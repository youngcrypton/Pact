import { TrustBountyContract } from './bounty-contract.js';

console.log('=== PACT PROTOCOL INITIALIZED ===');
console.log('Contract loaded and ready for interaction.');

const contract = new TrustBountyContract();

// Create sample bounty to demonstrate readiness
const bounty = contract.create_bounty({
  title: 'Optimize Sputnik DAO Approval Query',
  description: 'Refactor cross-contract transfer calls to reduce gas units by 20%',
  amount_formatted: 4.5,
  category: 'DEV',
  created_by: 'dev-community.sputnik-dao.testnet'
});

console.log('Sample Open Bounty:', bounty);
console.log('Available View Methods: get_bounties(), get_bounty(), get_contributor(), get_leaderboard()');

