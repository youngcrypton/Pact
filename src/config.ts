import dotenv from 'dotenv';
import { TierPolicy } from './types.js';

dotenv.config();

export const NEAR_CONFIG = {
  networkId: process.env.NEAR_NETWORK_ID || 'testnet',
  nodeUrl: process.env.NEAR_NODE_URL || 'https://rpc.testnet.near.org',
  walletUrl: process.env.NEAR_WALLET_URL || 'https://testnet.mynearwallet.com',
  helperUrl: process.env.NEAR_HELPER_URL || 'https://helper.testnet.near.org',
  sputnikDaoContract: process.env.SPUTNIK_DAO_CONTRACT_ID || 'dev-community.sputnik-dao.testnet',
  pactContract: process.env.PACT_CONTRACT_ID || 'pact.testnet'
};

// Default policy for Earned Trust Tiers
export const DEFAULT_TIER_POLICY: TierPolicy = {
  tier1_max_near: 5,        // Small bounties (up to 5 NEAR)
  tier1_min_trust: 50,      // Requires 50+ trust points (~3-5 completed tasks)
  tier2_max_near: 25,       // Mid-size bounties (up to 25 NEAR)
  tier2_min_trust: 20       // Requires 20+ trust points (at least 1-2 completed tasks)
};

// Trust calculation formula
export const BASE_COMPLETION_POINTS = 10;
export const POINTS_PER_NEAR = 5;

