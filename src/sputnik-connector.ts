import { SputnikProposalArgs } from './types.js';
import { NEAR_CONFIG } from './config.js';

export interface SputnikProposalPayload {
  proposal: {
    description: string;
    kind: {
      Transfer: {
        token_id: string; // "" represents native NEAR
        receiver_id: string;
        amount: string;   // yoctoNEAR
      };
    };
  };
}

export class SputnikConnector {
  private daoContractId: string;

  constructor(daoContractId: string = NEAR_CONFIG.sputnikDaoContract) {
    this.daoContractId = daoContractId;
  }

  /**
   * Generates a valid Sputnik DAO `add_proposal` payload for a Transfer payout.
   * This is called when a bounty exceeds Tier 1 and Tier 2 thresholds and requires full council voting.
   */
  public createTransferProposalPayload(args: {
    bountyId: string;
    bountyTitle: string;
    contributorId: string;
    amountYocto: string;
  }): { targetContract: string; method: string; args: SputnikProposalPayload; deposit: string } {
    const description = `[Pact Escrow] Bounty #${args.bountyId} ("${args.bountyTitle}") completed by @${args.contributorId}. Payout authorization requested.`;

    const payload: SputnikProposalPayload = {
      proposal: {
        description,
        kind: {
          Transfer: {
            token_id: '', // Native NEAR
            receiver_id: args.contributorId,
            amount: args.amountYocto
          }
        }
      }
    };

    return {
      targetContract: this.daoContractId,
      method: 'add_proposal',
      args: payload,
      deposit: '100000000000000000000000' // 0.1 NEAR proposal bond (standard Sputnik DAO bond)
    };
  }

  public getDaoContractId(): string {
    return this.daoContractId;
  }
}

