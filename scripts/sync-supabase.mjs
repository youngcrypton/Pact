import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://dlwzgacpavudmgeemndh.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_loqJDlLq7NzN35vBUcjC6g_oGf9T4dm';

const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
};

const canonicalBounties = [
  {
    id: 'bounty-1',
    code: 'B-101',
    title: 'BOS / NEAR Social Profile Component Card Kit',
    description: 'Design pixel-perfect SVG and React preview cards for displaying earned trust reputation badges on near.social profile headers.',
    amount_formatted: 8.0,
    amount_yocto: '8000000000000000000000000',
    category: 'DESIGN',
    status: 'OPEN',
    approval_tier: 'TIER_2_SINGLE_COUNCIL',
    claimed_by: null,
    proof_url: null,
    created_by: 'creatives.sputnik-dao.testnet',
    escrow_status: 'ESCROWED',
    escrow_vault_id: 'pact-dao-064783.testnet',
    dispute_status: 'NONE'
  },
  {
    id: 'bounty-2',
    code: 'B-102',
    title: 'Deep-Dive Thread: Why NEAR Chain Abstraction Matters',
    description: 'Author a high-impact 8-tweet educational thread breaking down account aggregation and decentralized relayer networks for Web3 newcomers.',
    amount_formatted: 4.5,
    amount_yocto: '4500000000000000000000000',
    category: 'CONTENT',
    status: 'OPEN',
    approval_tier: 'TIER_1_AUTO',
    claimed_by: null,
    proof_url: null,
    created_by: 'marketing.sputnik-dao.testnet',
    escrow_status: 'ESCROWED',
    escrow_vault_id: 'pact-dao-064783.testnet',
    dispute_status: 'NONE'
  },
  {
    id: 'bounty-3',
    code: 'B-103',
    title: 'Translate Developer Quickstart to Spanish & Portuguese',
    description: 'Complete verified localization of the official NEAR 2.0 developer onboarding documentation for the Latin America developer guild.',
    amount_formatted: 4.0,
    amount_yocto: '4000000000000000000000000',
    category: 'COMMUNITY',
    status: 'CLAIMED',
    approval_tier: 'TIER_1_AUTO',
    claimed_by: 'maria.testnet',
    proof_url: null,
    created_by: 'devhub.sputnik-dao.testnet',
    escrow_status: 'ESCROWED',
    escrow_vault_id: 'pact-dao-064783.testnet',
    dispute_status: 'NONE'
  },
  {
    id: 'bounty-4',
    code: 'B-104',
    title: 'Comparative Research: Sputnik DAO vs. Aragon & Moloch',
    description: 'Author a comprehensive 6-page research report evaluating capital efficiency, multi-sig latency, and reputation models across major DAO frameworks.',
    amount_formatted: 15.0,
    amount_yocto: '15000000000000000000000000',
    category: 'RESEARCH',
    status: 'OPEN',
    approval_tier: 'TIER_2_SINGLE_COUNCIL',
    claimed_by: null,
    proof_url: null,
    created_by: 'policy.sputnik-dao.testnet',
    escrow_status: 'ESCROWED',
    escrow_vault_id: 'pact-dao-064783.testnet',
    dispute_status: 'NONE'
  },
  {
    id: 'bounty-5',
    code: 'B-105',
    title: 'Implement NEP-171 NFT Metadata Parser',
    description: 'Write a zero-dependency TypeScript parser for standard NEAR NFT NEP-171 metadata specifications with full typing and schema validation.',
    amount_formatted: 3.5,
    amount_yocto: '3500000000000000000000000',
    category: 'DEV',
    status: 'APPROVED',
    approval_tier: 'TIER_1_AUTO',
    claimed_by: 'alex.testnet',
    proof_url: 'https://github.com/near/core-contracts/pull/412',
    created_by: 'devhub.sputnik-dao.testnet',
    escrow_status: 'DISBURSED',
    escrow_vault_id: 'pact-dao-064783.testnet',
    dispute_status: 'NONE'
  },
  {
    id: 'bounty-6',
    code: 'B-106',
    title: 'Audit FastAuth Session Key Invalidation Logic',
    description: 'Perform formal verification and manual code audit on testnet FastAuth session key rotation and storage deposit refunds.',
    amount_formatted: 18.0,
    amount_yocto: '18000000000000000000000000',
    category: 'SECURITY',
    status: 'IN_REVIEW',
    approval_tier: 'TIER_2_SINGLE_COUNCIL',
    claimed_by: 'chen.testnet',
    proof_url: 'https://github.com/pactt-protocol/audit/pull/5',
    created_by: 'security.sputnik-dao.testnet',
    escrow_status: 'ESCROWED',
    escrow_vault_id: 'pact-dao-064783.testnet',
    dispute_status: 'NONE'
  },
  {
    id: 'bounty-7',
    code: 'B-107',
    title: 'Host Virtual AMA on BOS Composability & DAOs',
    description: 'Organize, moderate, and record a 45-minute live Twitter Space / Discord stage on decentralized frontends with guest speakers from Creatives DAO.',
    amount_formatted: 6.5,
    amount_yocto: '6500000000000000000000000',
    category: 'COMMUNITY',
    status: 'OPEN',
    approval_tier: 'TIER_2_SINGLE_COUNCIL',
    claimed_by: null,
    proof_url: null,
    created_by: 'community.sputnik-dao.testnet',
    escrow_status: 'ESCROWED',
    escrow_vault_id: 'pact-dao-064783.testnet',
    dispute_status: 'NONE'
  },
  {
    id: 'bounty-8',
    code: 'B-108',
    title: 'Build Full Cross-Chain Intent Relayer',
    description: 'Architect a production-grade intent relayer listening to NEAR cross-chain settlement contracts for 10 NEAR/ETH atomic swaps.',
    amount_formatted: 50.0,
    amount_yocto: '50000000000000000000000000',
    category: 'DEV',
    status: 'OPEN',
    approval_tier: 'TIER_3_FULL_DAO',
    claimed_by: null,
    proof_url: null,
    created_by: 'intents.sputnik-dao.testnet',
    escrow_status: 'ESCROWED',
    escrow_vault_id: 'pact-dao-064783.testnet',
    dispute_status: 'NONE'
  }
];

const canonicalContributors = [
  {
    account_id: 'alex.testnet',
    trust_points: 142.5,
    current_tier: 'TIER_1_AUTO',
    completed_bounties_count: 6,
    total_earned_near: 31.2,
    total_earned_yocto: '31200000000000000000000000',
    is_council: false
  },
  {
    account_id: 'chen.testnet',
    trust_points: 65.5,
    current_tier: 'TIER_1_AUTO',
    completed_bounties_count: 4,
    total_earned_near: 19.5,
    total_earned_yocto: '19500000000000000000000000',
    is_council: false
  },
  {
    account_id: 'maria.testnet',
    trust_points: 24.0,
    current_tier: 'TIER_2_SINGLE_COUNCIL',
    completed_bounties_count: 2,
    total_earned_near: 8.0,
    total_earned_yocto: '8000000000000000000000000',
    is_council: false
  },
  {
    account_id: 'council.testnet',
    trust_points: 210.0,
    current_tier: 'TIER_1_AUTO',
    completed_bounties_count: 9,
    total_earned_near: 45.0,
    total_earned_yocto: '45000000000000000000000000',
    is_council: true
  },
  {
    account_id: 'newuser.testnet',
    trust_points: 0.0,
    current_tier: 'NEWBIE',
    completed_bounties_count: 0,
    total_earned_near: 0.0,
    total_earned_yocto: '0',
    is_council: false
  }
];

async function sync() {
  console.log('[Supabase Sync] Upserting canonical bounties...');
  for (const b of canonicalBounties) {
    const res = await fetch(`${supabaseUrl}/rest/v1/bounties`, {
      method: 'POST',
      headers,
      body: JSON.stringify(b)
    });
    if (!res.ok) {
      console.error(`Failed ${b.id}:`, res.status, await res.text());
    } else {
      console.log(`Synced ${b.id} (${b.code}) - ${b.status}`);
    }
  }

  console.log('[Supabase Sync] Upserting canonical contributors...');
  for (const c of canonicalContributors) {
    const res = await fetch(`${supabaseUrl}/rest/v1/contributors`, {
      method: 'POST',
      headers,
      body: JSON.stringify(c)
    });
    if (!res.ok) {
      console.error(`Failed ${c.account_id}:`, res.status, await res.text());
    } else {
      console.log(`Synced contributor ${c.account_id} - ${c.trust_points} pts`);
    }
  }
  console.log('[Supabase Sync] Complete!');
}

sync().catch(console.error);

