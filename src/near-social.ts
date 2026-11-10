import { ContributorProfile } from './types.js';

/**
 * NEAR Social (SocialDB) Integration
 * Generates and broadcasts on-chain reputation badges to near.social
 * as highlighted in the hackathon track guide.
 */
export class NearSocialConnector {
  private networkId: string;
  private socialContractId: string;

  constructor(networkId: string = 'testnet') {
    this.networkId = networkId;
    this.socialContractId = networkId === 'mainnet' ? 'social.near' : 'v1.social08.testnet';
  }

  /**
   * Generates a SocialDB `set` payload for writing a Trust Badge to a contributor's profile.
   * Format conforms to standard NEP-BOS profile badges:
   * { [account_id]: { profile: { badges: { "trustbounty_core": "..." } } } }
   */
  public generateBadgePayload(profile: ContributorProfile): {
    contractId: string;
    methodName: string;
    args: Record<string, any>;
    depositYocto: string;
  } {
    const badgeName = profile.current_tier === 'TRUSTED_CORE'
      ? 'Pact Core Contributor (Tier 1)'
      : 'Pact Verified Contributor (Tier 2)';

    const badgeData = {
      name: badgeName,
      trustScore: profile.trust_score,
      completedBounties: profile.completed_bounties_count,
      awardedAt: new Date().toISOString()
    };

    const dataPayload = {
      [profile.account_id]: {
        profile: {
          badges: {
            pact: JSON.stringify(badgeData)
          }
        },
        index: {
          notify: JSON.stringify({
            key: profile.account_id,
            value: {
              type: 'trust_badge_awarded',
              message: `Congratulations! You unlocked ${badgeName} with a Trust Score of ${profile.trust_score}.`
            }
          })
        }
      }
    };

    return {
      contractId: this.socialContractId,
      methodName: 'set',
      args: { data: dataPayload },
      depositYocto: '50000000000000000000000' // 0.05 NEAR storage deposit for SocialDB
    };
  }

  /**
   * Helper to verify transaction status on SocialDB API
   * (Handles the CodeDoesNotExist expected behavior noted in HACKATHON.md)
   */
  public getVerificationUrl(txHash: string): string {
    return `https://api2.near.social/v1/tx/${txHash}`;
  }
}

