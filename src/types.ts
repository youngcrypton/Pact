/**
 * Pact Protocol - Core Types
 * Shared data contract between NEAR Backend and React Frontend
 */

export type BountyStatus =
  | 'OPEN'
  | 'CLAIMED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ESCALATED_TO_DAO';

export type ApprovalTier =
  | 'TIER_1_AUTO'           // Instant payout (< 5 NEAR & Trust >= 50)
  | 'TIER_2_SINGLE_COUNCIL' // 1 Council signoff needed (5 - 25 NEAR & Trust >= 20)
  | 'TIER_3_FULL_DAO';      // Full Sputnik DAO council vote (> 25 NEAR or Low Trust)

export interface Bounty {
  id: string;
  title: string;
  description: string;
  amount_near: string;            // yoctoNEAR as string to prevent JS float precision loss
  amount_formatted: number;       // human readable NEAR (e.g. 5.5)
  category: 'DEV' | 'DESIGN' | 'COMMUNITY' | 'AUDIT';
  created_by: string;             // e.g. "community-dao.sputnik-dao.testnet"
  claimed_by: string | null;      // e.g. "alice.testnet"
  claimed_at: number | null;
  proof_url: string | null;       // GitHub PR, commit, or demo link
  submission_notes: string | null;
  status: BountyStatus;
  required_tier: ApprovalTier;
  council_approved_by: string | null;
  sputnik_proposal_id: number | null; // Set when escalated to Sputnik DAO
  created_at: number;
  completed_at: number | null;
}

export interface ContributorProfile {
  account_id: string;
  trust_score: number;
  completed_bounties_count: number;
  total_earned_yocto: string;
  total_earned_formatted: number;
  current_tier: 'NEWBIE' | 'CONTRIBUTOR' | 'TRUSTED_CORE';
  near_social_badge_minted: boolean;
  history: TrustEvent[];
}

export interface TrustEvent {
  bounty_id: string;
  points_awarded: number;
  timestamp: number;
  reason: string;
}

export interface TierPolicy {
  tier1_max_near: number;         // e.g. 5 NEAR
  tier1_min_trust: number;        // e.g. 50 points
  tier2_max_near: number;         // e.g. 25 NEAR
  tier2_min_trust: number;        // e.g. 20 points
}

export interface SputnikProposalArgs {
  dao_contract_id: string;
  description: string;
  receiver_id: string;
  amount_yocto: string;
}

