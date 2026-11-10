import { Bounty, BountyStatus, ContributorProfile, TierPolicy } from './types.js';
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
    category?: Bounty['category'];
    created_by: string;
  }): Bounty {
    this.bountyCounter++;
    const id = `bounty-${this.bountyCounter}`;

    // Convert NEAR float to yoctoNEAR string
    const yocto = (BigInt(Math.floor(args.amount_formatted * 1e6)) * BigInt(1e18)).toString();

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
    if (bounty.status !== 'OPEN') throw new Error(`Bounty is not open (status: ${bounty.status})`);

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

    // Check Contributor Trust Score
    const profile = this.getOrCreateProfile(args.contributor_id);
    const tier = this.trustEngine.evaluateTier(bounty.amount_formatted, profile.trust_score);
    bounty.required_tier = tier;

    if (tier === 'TIER_1_AUTO') {
      // Tier 1: Instant Auto-Approval!
      bounty.status = 'APPROVED';
      bounty.completed_at = Date.now();

      // Record Trust points
      const { updatedProfile, pointsAwarded } = this.trustEngine.recordCompletion(profile, bounty);
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
    bounty.council_approved_by = council_account_id;
    bounty.completed_at = Date.now();

    if (bounty.claimed_by) {
      const profile = this.getOrCreateProfile(bounty.claimed_by);
      const { updatedProfile } = this.trustEngine.recordCompletion(profile, bounty);
      this.contributors.set(bounty.claimed_by, updatedProfile);
    }

    return bounty;
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
