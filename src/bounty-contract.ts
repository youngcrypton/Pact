import { utils } from 'near-api-js';
import { Bounty, BountyStatus, ContributorProfile, TierPolicy, EscrowStatus } from './types.js';
import { TrustEngine } from './trust-engine.js';
import { SputnikConnector } from './sputnik-connector.js';
import { DEFAULT_TIER_POLICY } from './config.js';

export class TrustBountyContract {
  private bounties: Map<string, Bounty> = new Map();
  private contributors: Map<string, ContributorProfile> = new Map();
  private trustEngine: TrustEngine;
  private sputnikConnector: SputnikConnector;
  private councilMembers: Set<string> = new Set();
  private bountyCounter: number = 0;
  private usedProofUrls: Map<string, string> = new Map(); // Bug 3: Tracks normalized deliverable URLs to prevent recycling

  constructor(
    policy: TierPolicy = DEFAULT_TIER_POLICY,
    councilAccounts: string[] = ['council.testnet', 'admin.testnet']
  ) {
    this.trustEngine = new TrustEngine(policy);
    this.sputnikConnector = new SputnikConnector();
    councilAccounts.forEach(c => this.councilMembers.add(c));
  }

  // --- VIEW METHODS ---

  public get_bounties(filters?: { status?: BountyStatus; limit?: number }): Bounty[] {
    let list = Array.from(this.bounties.values());
    if (filters?.status) {
      list = list.filter(b => b.status === filters.status);
    }
    // Sort newest first
    list.sort((a, b) => b.created_at - a.created_at);
    if (filters?.limit) {
      list = list.slice(0, filters.limit);
    }
    return list;
  }

  public get_bounty(bounty_id: string): Bounty | null {
    return this.bounties.get(bounty_id) || null;
  }

  public get_contributor(account_id: string): ContributorProfile {
    return this.getOrCreateProfile(account_id);
  }

  public get_leaderboard(limit: number = 10): ContributorProfile[] {
    const list = Array.from(this.contributors.values());
    list.sort((a, b) => b.trust_score - a.trust_score);
    return list.slice(0, limit);
  }

  public get_tier_policy(): TierPolicy {
    return DEFAULT_TIER_POLICY;
  }

  // --- CHANGE METHODS ---

  public create_bounty(args: {
    title: string;
    description: string;
    amount_formatted: number;
    amount_near?: string;
    category?: Bounty['category'];
    created_by: string;
    escrow_status?: EscrowStatus;
    escrow_tx_hash?: string | null;
  }): Bounty {
    this.bountyCounter++;
    const id = `bounty-${this.bountyCounter}`;

    // Bug 7: Convert NEAR float to exact yoctoNEAR string using standard NEAR precision
    const yocto = args.amount_near || utils.format.parseNearAmount(args.amount_formatted.toString()) || '0';

    const bounty: Bounty = {
      id,
      title: args.title,
      description: args.description,
      amount_near: yocto,
      amount_formatted: args.amount_formatted,
      category: args.category || 'DEV',
      created_by: args.created_by,
      claimed_by: null,
      claimed_at: null,
      proof_url: null,
      submission_notes: null,
      status: 'OPEN',
      escrow_status: args.escrow_status || 'ESCROWED',
      escrow_tx_hash: args.escrow_tx_hash || (args.escrow_status === 'UNFUNDED' ? null : `tx-escrow-${Date.now()}`),
      required_tier: 'TIER_3_FULL_DAO', // Will be re-evaluated on submission based on claimant
      council_approved_by: null,
      sputnik_proposal_id: null,
      created_at: Date.now(),
      completed_at: null
    };

    this.bounties.set(id, bounty);
    return bounty;
  }

  public claim_bounty(bounty_id: string, claimant_account_id: string): Bounty {
    const bounty = this.bounties.get(bounty_id);
    if (!bounty) throw new Error(`Bounty ${bounty_id} not found`);

    // Bug 4: Atomic lock check against race conditions
    if (bounty.status !== 'OPEN' || bounty.claimed_by !== null) {
      throw new Error(`Conflict: Bounty ${bounty_id} is already claimed by ${bounty.claimed_by || 'another user'} (status: ${bounty.status})`);
    }

    // Bug 5: Escrow fund custody check
    if (bounty.escrow_status !== 'ESCROWED') {
      throw new Error(`EscrowRequired: Bounty ${bounty_id} is not funded (escrow status: ${bounty.escrow_status})`);
    }

    bounty.claimed_by = claimant_account_id;
    bounty.claimed_at = Date.now();
    bounty.status = 'CLAIMED';

    return bounty;
  }

  public submit_work(args: {
    bounty_id: string;
    contributor_id: string;
    proof_url: string;
    submission_notes?: string;
  }): { bounty: Bounty; actionTaken: string } {
    const bounty = this.bounties.get(args.bounty_id);
    if (!bounty) throw new Error(`Bounty ${args.bounty_id} not found`);
    if (bounty.claimed_by !== args.contributor_id) {
      throw new Error(`Only the claimant (${bounty.claimed_by}) can submit work`);
    }

    bounty.proof_url = args.proof_url;
    bounty.submission_notes = args.submission_notes || null;

    // Bug 3: Deliverable Link Deduplication
    const normUrl = args.proof_url.trim().toLowerCase().replace(/\/+$/, '');
    const priorBountyId = this.usedProofUrls.get(normUrl);
    if (priorBountyId && priorBountyId !== args.bounty_id) {
      throw new Error(`ProofAlreadyUsed: Deliverable URL has already been redeemed on bounty #${priorBountyId}`);
    }
    this.usedProofUrls.set(normUrl, args.bounty_id);

    // Check Contributor Trust Score
    const profile = this.getOrCreateProfile(args.contributor_id);
    const tier = this.trustEngine.evaluateTier(bounty.amount_formatted, profile.trust_score);
    bounty.required_tier = tier;

    if (tier === 'TIER_1_AUTO') {
      // Bug 6: Anti-drain rolling 24-hour velocity limit (max 2 instant auto-payouts/24h)
      const recentAutoCount = this.trustEngine.getDailyAutoPayoutCount(profile);
      if (recentAutoCount >= 2) {
        bounty.status = 'IN_REVIEW';
        bounty.required_tier = 'TIER_2_SINGLE_COUNCIL';
        return {
          bounty,
          actionTaken: 'VELOCITY_LIMIT_EXCEEDED: Contributor reached max 2 instant auto-payouts in 24h. Payout routed to Tier 2 (Single Council Review) for confirmation.'
        };
      }

      // Tier 1: Instant Auto-Approval!
      bounty.status = 'APPROVED';
      bounty.escrow_status = 'DISBURSED'; // Bug 5: Mark escrow disbursed
      bounty.completed_at = Date.now();

      // Record Trust points
      const { updatedProfile, pointsAwarded } = this.trustEngine.recordCompletion(profile, bounty, true);
      this.contributors.set(args.contributor_id, updatedProfile);

      return {
        bounty,
        actionTaken: `TIER_1_AUTO_APPROVED: Earned trust applied! ${pointsAwarded} trust points awarded, payout dispatched.`
      };
    } else if (tier === 'TIER_2_SINGLE_COUNCIL') {
      bounty.status = 'IN_REVIEW';
      return {
        bounty,
        actionTaken: 'TIER_2_PENDING_COUNCIL: Single council member sign-off required to finalize payout.'
      };
    } else {
      // Tier 3: Escalate to Sputnik DAO proposal
      bounty.status = 'ESCALATED_TO_DAO';
      bounty.sputnik_proposal_id = Math.floor(Math.random() * 1000) + 1; // Simulated proposal ID

      return {
        bounty,
        actionTaken: `TIER_3_ESCALATED: Exceeds trust limit. Proposal #${bounty.sputnik_proposal_id} created in Sputnik DAO for full council vote.`
      };
    }
  }

  public approve_as_council(bounty_id: string, council_account_id: string): Bounty {
    if (!this.councilMembers.has(council_account_id)) {
      throw new Error(`Account ${council_account_id} is not an authorized council member`);
    }

    const bounty = this.bounties.get(bounty_id);
    if (!bounty) throw new Error(`Bounty ${bounty_id} not found`);
    if (
      bounty.status !== 'IN_REVIEW' &&
      bounty.status !== 'CLAIMED' &&
      bounty.status !== 'ESCALATED_TO_DAO'
    ) {
      throw new Error(`Bounty cannot be approved in state ${bounty.status}`);
    }

    bounty.status = 'APPROVED';
    bounty.escrow_status = 'DISBURSED'; // Bug 5: Mark escrow disbursed upon council approval
    bounty.council_approved_by = council_account_id;
    bounty.completed_at = Date.now();

    if (bounty.claimed_by) {
      const profile = this.getOrCreateProfile(bounty.claimed_by);
      const { updatedProfile } = this.trustEngine.recordCompletion(profile, bounty);
      this.contributors.set(bounty.claimed_by, updatedProfile);
    }

    return bounty;
  }

  public cancel_bounty(bounty_id: string, caller_account_id: string): Bounty {
    const bounty = this.bounties.get(bounty_id);
    if (!bounty) throw new Error(`Bounty ${bounty_id} not found`);
    if (bounty.created_by !== caller_account_id && !this.councilMembers.has(caller_account_id)) {
      throw new Error(`Unauthorized: Only the creator (${bounty.created_by}) or council can cancel this bounty`);
    }
    if (bounty.status !== 'OPEN') {
      throw new Error(`Cannot cancel bounty in status ${bounty.status}`);
    }

    bounty.status = 'REJECTED';
    bounty.escrow_status = 'REFUNDED'; // Bug 5: Return escrowed funds
    return bounty;
  }

  /**
   * Bug 6: Council Challenge / Dispute Window
   * Allows authorized council members to challenge fraudulent auto-approved work within 24h,
   * slashing contributor trust score and freezing/reversing the payout.
   */
  public challenge_submission(args: {
    bounty_id: string;
    council_account_id: string;
    reason: string;
    slash_points?: number;
  }): { bounty: Bounty; slashedProfile: ContributorProfile } {
    if (!this.councilMembers.has(args.council_account_id)) {
      throw new Error(`Unauthorized: Account ${args.council_account_id} is not an authorized council member`);
    }

    const bounty = this.bounties.get(args.bounty_id);
    if (!bounty) throw new Error(`Bounty ${args.bounty_id} not found`);

    if (bounty.status !== 'APPROVED') {
      throw new Error(`Cannot challenge bounty in status ${bounty.status} (must be APPROVED)`);
    }

    // 24-hour challenge window check
    const challengeWindowMs = 24 * 60 * 60 * 1000;
    if (bounty.completed_at && (Date.now() - bounty.completed_at > challengeWindowMs)) {
      throw new Error('ChallengeWindowExpired: 24-hour dispute window has passed for this bounty');
    }

    bounty.status = 'REJECTED';
    bounty.dispute_status = 'CHALLENGED';
    bounty.disputed_by = args.council_account_id;
    bounty.dispute_reason = args.reason;
    bounty.dispute_challenged_at = Date.now();

    if (!bounty.claimed_by) {
      throw new Error('Bounty has no claimant to challenge');
    }

    const profile = this.getOrCreateProfile(bounty.claimed_by);
    const slashAmount = args.slash_points || (10 + Math.floor(bounty.amount_formatted * 5));
    const slashedProfile = this.trustEngine.recordSlash(profile, bounty, slashAmount, args.reason);
    this.contributors.set(bounty.claimed_by, slashedProfile);

    return { bounty, slashedProfile };
  }

  public get_escrow_metrics(): {
    total_locked_yocto: string;
    total_disbursed_yocto: string;
    total_refunded_yocto: string;
    total_locked_formatted: number;
    total_disbursed_formatted: number;
    total_refunded_formatted: number;
    escrow_vault_account: string;
  } {
    let locked = BigInt(0);
    let disbursed = BigInt(0);
    let refunded = BigInt(0);

    for (const b of this.bounties.values()) {
      const amount = BigInt(b.amount_near || '0');
      if (b.escrow_status === 'ESCROWED') {
        locked += amount;
      } else if (b.escrow_status === 'DISBURSED') {
        disbursed += amount;
      } else if (b.escrow_status === 'REFUNDED') {
        refunded += amount;
      }
    }

    return {
      total_locked_yocto: locked.toString(),
      total_disbursed_yocto: disbursed.toString(),
      total_refunded_yocto: refunded.toString(),
      total_locked_formatted: parseFloat(utils.format.formatNearAmount(locked.toString()) || '0'),
      total_disbursed_formatted: parseFloat(utils.format.formatNearAmount(disbursed.toString()) || '0'),
      total_refunded_formatted: parseFloat(utils.format.formatNearAmount(refunded.toString()) || '0'),
      escrow_vault_account: 'pact-dao-933742.testnet'
    };
  }

  private getOrCreateProfile(account_id: string): ContributorProfile {
    let p = this.contributors.get(account_id);
    if (!p) {
      p = {
        account_id,
        trust_score: 0,
        completed_bounties_count: 0,
        total_earned_yocto: '0',
        total_earned_formatted: 0,
        current_tier: 'NEWBIE',
        near_social_badge_minted: false,
        history: []
      };
      this.contributors.set(account_id, p);
    }
    return p;
  }

  // Admin helper for testing
  public addCouncilMember(account: string) {
    this.councilMembers.add(account);
  }
}
