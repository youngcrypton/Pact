import { ApprovalTier, Bounty, ContributorProfile, TierPolicy, TrustEvent } from './types.js';
import { DEFAULT_TIER_POLICY, BASE_COMPLETION_POINTS, POINTS_PER_NEAR } from './config.js';

export class TrustEngine {
  private policy: TierPolicy;

  constructor(policy: TierPolicy = DEFAULT_TIER_POLICY) {
    this.policy = policy;
  }

  /**
   * Determine which approval tier applies to a submission based on:
   * 1. Bounty value in NEAR
   * 2. Contributor's accumulated trust score
   */
  public evaluateTier(amountNear: number, contributorTrustScore: number): ApprovalTier {
    // Tier 1: Small payout + High trust = Instant Auto-Approval
    if (amountNear <= this.policy.tier1_max_near && contributorTrustScore >= this.policy.tier1_min_trust) {
      return 'TIER_1_AUTO';
    }

    // Tier 2: Mid-size payout + Moderate trust = Single Council Sign-Off
    if (amountNear <= this.policy.tier2_max_near && contributorTrustScore >= this.policy.tier2_min_trust) {
      return 'TIER_2_SINGLE_COUNCIL';
    }

    // Tier 3: Large payout OR New Contributor with insufficient trust = Escalate to Sputnik DAO
    return 'TIER_3_FULL_DAO';
  }

  /**
   * Calculate trust points earned from completing a bounty
   */
  public calculatePointsAwarded(amountNear: number): number {
    return Math.floor(BASE_COMPLETION_POINTS + (amountNear * POINTS_PER_NEAR));
  }

  /**
   * Update contributor profile with a new verified completion
   */
  public recordCompletion(
    profile: ContributorProfile,
    bounty: Bounty
  ): { updatedProfile: ContributorProfile; pointsAwarded: number } {
    const points = this.calculatePointsAwarded(bounty.amount_formatted);

    const event: TrustEvent = {
      bounty_id: bounty.id,
      points_awarded: points,
      timestamp: Date.now(),
      reason: `Completed Bounty: ${bounty.title} (${bounty.amount_formatted} NEAR)`
    };

    const newTrustScore = profile.trust_score + points;
    const newCount = profile.completed_bounties_count + 1;
    const newTotalEarned = profile.total_earned_formatted + bounty.amount_formatted;

    // Determine trust badge tier
    let currentTier: ContributorProfile['current_tier'] = 'NEWBIE';
    if (newTrustScore >= 100) {
      currentTier = 'TRUSTED_CORE';
    } else if (newTrustScore >= 20) {
      currentTier = 'CONTRIBUTOR';
    }

    const updatedProfile: ContributorProfile = {
      ...profile,
      trust_score: newTrustScore,
      completed_bounties_count: newCount,
      total_earned_formatted: newTotalEarned,
      current_tier: currentTier,
      near_social_badge_minted: newTrustScore >= 50, // Qualifies for on-chain social badge
      history: [...profile.history, event]
    };

    return { updatedProfile, pointsAwarded: points };
  }
}

