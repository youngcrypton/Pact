import { TrustBountyContract } from '../src/bounty-contract.js';
import fs from 'fs';
import path from 'path';

console.log('Seeding initial bounties for React Frontend...');

const contract = new TrustBountyContract();
contract.addCouncilMember('council.testnet');

// 1. Open Dev Bounty (Tier 1 Eligible)
contract.create_bounty({
  title: 'Implement NEP-171 NFT Metadata Parser',
  description: 'Write a lightweight parser for standard NEAR NFT metadata in TypeScript.',
  amount_formatted: 3.5,
  category: 'DEV',
  created_by: 'devhub.sputnik-dao.testnet'
});

// 2. Open Design Bounty
contract.create_bounty({
  title: 'BOS / NEAR Social Component Card Design',
  description: 'Design pixel-perfect Figma cards for reputation badges on near.social.',
  amount_formatted: 8.0,
  category: 'DESIGN',
  created_by: 'marketing.sputnik-dao.testnet'
});

// 3. Claimed Bounty
const b3 = contract.create_bounty({
  title: 'Audit FastAuth Session Key Invalidation Logic',
  description: 'Verify security boundaries when rotating session keys on testnet.',
  amount_formatted: 18.0,
  category: 'AUDIT',
  created_by: 'security.sputnik-dao.testnet'
});
contract.claim_bounty(b3.id, 'alice-trusted.testnet');

// 4. Completed Bounty (Auto-Approved by Tier 1)
const b4 = contract.create_bounty({
  title: 'Fix typo in README instructions',
  description: 'Update Quickstart command in core docs.',
  amount_formatted: 2.0,
  category: 'COMMUNITY',
  created_by: 'devhub.sputnik-dao.testnet'
});
contract.claim_bounty(b4.id, 'alice-trusted.testnet');
contract.submit_work({
  bounty_id: b4.id,
  contributor_id: 'alice-trusted.testnet',
  proof_url: 'https://github.com/near/docs/pull/99'
});

// 5. Large Bounty (Tier 3 DAO Escrow)
const b5 = contract.create_bounty({
  title: 'Build Full Cross-Chain Intent Relayer',
  description: 'Build a production-ready intent solver for 10 NEAR/ETH swaps.',
  amount_formatted: 50.0,
  category: 'DEV',
  created_by: 'intents.sputnik-dao.testnet'
});

const allBounties = contract.get_bounties();
console.log(`Successfully generated ${allBounties.length} mock bounties:`);
allBounties.forEach(b => {
  console.log(` - [${b.status}] ${b.id}: ${b.title} (${b.amount_formatted} NEAR) -> Tier: ${b.required_tier}`);
});

// Save to JSON for immediate import by React dev if needed
const outputPath = path.resolve('mock-bounties.json');
fs.writeFileSync(outputPath, JSON.stringify(allBounties, null, 2));
console.log(`Saved mock data to ${outputPath}`);

