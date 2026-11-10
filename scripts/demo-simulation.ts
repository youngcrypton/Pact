import { TrustBountyContract } from '../src/bounty-contract.js';
import { NearSocialConnector } from '../src/near-social.js';
import { GitHubVerifier } from '../src/github-verifier.js';

/**
 * Pact Protocol - End-to-End Terminal Demo Simulation
 * Demonstrates the full lifecycle of all 3 Earned Trust Tiers on Sputnik DAO.
 */

console.log('==============================================================');
console.log('       🤝 PACT PROTOCOL — END-TO-END DEMO SIMULATION          ');
console.log('       Earned Trust Coordination on Sputnik DAO (NEAR)         ');
console.log('==============================================================\n');

const contract = new TrustBountyContract();
const socialConnector = new NearSocialConnector('testnet');
const verifier = new GitHubVerifier();

contract.addCouncilMember('council.testnet');

// -------------------------------------------------------------
// SCENARIO 1: New Contributor (Tier 3 - Sputnik DAO Escalation)
// -------------------------------------------------------------
console.log('--- SCENARIO 1: Large Bounty / New Contributor (Tier 3) ---');
const bounty1 = contract.create_bounty({
  title: 'Audit Smart Contract Reentrancy Guards',
  description: 'Deep audit of fund release methods',
  amount_formatted: 35.0, // 35 NEAR (> 25 NEAR)
  category: 'AUDIT',
  created_by: 'security.sputnik-dao.testnet'
});
console.log(`[Created] ${bounty1.id}: "${bounty1.title}" (${bounty1.amount_formatted} NEAR)`);

contract.claim_bounty(bounty1.id, 'bob-newbie.testnet');
console.log(`[Claimed] Bob (Trust Score: 0) claimed ${bounty1.id}`);

const res1 = contract.submit_work({
  bounty_id: bounty1.id,
  contributor_id: 'bob-newbie.testnet',
  proof_url: 'https://github.com/near/audit/pull/101',
  submission_notes: 'Completed full audit report.'
});
console.log(`[Action] ${res1.actionTaken}`);
console.log(`[Status] Bounty status is now: ${res1.bounty.status}\n`);

// -------------------------------------------------------------
// SCENARIO 2: Mid-Size Bounty (Tier 2 - Single Council Sign-Off)
// -------------------------------------------------------------
console.log('--- SCENARIO 2: Mid-Size Bounty (Tier 2 - Single Council) ---');

// First give Carol 25 initial trust points
const warmup = contract.create_bounty({
  title: 'Setup GitHub Actions CI',
  description: 'Add automated tests',
  amount_formatted: 3.0,
  created_by: 'devhub.sputnik-dao.testnet'
});
contract.claim_bounty(warmup.id, 'carol.testnet');
contract.submit_work({ bounty_id: warmup.id, contributor_id: 'carol.testnet', proof_url: 'https://github.com/near/ci/pull/1' });
contract.approve_as_council(warmup.id, 'council.testnet');

const carolProfile = contract.get_contributor('carol.testnet');
console.log(`[Contributor] Carol has accumulated ${carolProfile.trust_score} trust points.`);

const bounty2 = contract.create_bounty({
  title: 'Build TypeScript SDK Client',
  description: 'Wrap RPC methods in typed library',
  amount_formatted: 15.0, // 15 NEAR (Tier 2: 5-25 NEAR)
  category: 'DEV',
  created_by: 'devhub.sputnik-dao.testnet'
});
contract.claim_bounty(bounty2.id, 'carol.testnet');

const res2 = contract.submit_work({
  bounty_id: bounty2.id,
  contributor_id: 'carol.testnet',
  proof_url: 'https://github.com/near/sdk/pull/5',
  submission_notes: 'SDK completed with tests.'
});
console.log(`[Action] ${res2.actionTaken}`);
console.log(`[Status] Bounty status is: ${res2.bounty.status} (Waiting for 1 council approval)`);

const approvedBounty2 = contract.approve_as_council(bounty2.id, 'council.testnet');
console.log(`[Council Sign-Off] Approved by council.testnet! Status: ${approvedBounty2.status}\n`);

// -------------------------------------------------------------
// SCENARIO 3: Trusted Contributor (Tier 1 - Instant Auto-Payout)
// -------------------------------------------------------------
console.log('--- SCENARIO 3: Trusted Contributor (Tier 1 - Instant Auto-Approval) ---');

// Alice already has high trust (simulate completed history)
const aliceWarmup = contract.create_bounty({
  title: 'Refactor State Storage',
  description: 'Save storage fees',
  amount_formatted: 10.0,
  created_by: 'devhub.sputnik-dao.testnet'
});
contract.claim_bounty(aliceWarmup.id, 'alice.testnet');
contract.submit_work({ bounty_id: aliceWarmup.id, contributor_id: 'alice.testnet', proof_url: 'https://github.com/near/core/pull/2' });
contract.approve_as_council(aliceWarmup.id, 'council.testnet');

const aliceProfile = contract.get_contributor('alice.testnet');
console.log(`[Contributor] Alice is a "${aliceProfile.current_tier}" with ${aliceProfile.trust_score} trust points.`);

const bounty3 = contract.create_bounty({
  title: 'Fix typo in documentation link',
  description: 'Quick link correction',
  amount_formatted: 3.5, // 3.5 NEAR (Tier 1: <= 5 NEAR)
  category: 'COMMUNITY',
  created_by: 'devhub.sputnik-dao.testnet'
});
contract.claim_bounty(bounty3.id, 'alice.testnet');
console.log(`[Claimed] Alice claimed ${bounty3.id}`);

const res3 = contract.submit_work({
  bounty_id: bounty3.id,
  contributor_id: 'alice.testnet',
  proof_url: 'https://github.com/near/docs/pull/88'
});

console.log(`[⚡ INSTANT ACTION] ${res3.actionTaken}`);
console.log(`[Status] Bounty status: ${res3.bounty.status} (Zero council delay!)`);

// -------------------------------------------------------------
// LEADERBOARD & NEAR SOCIAL BADGES
// -------------------------------------------------------------
console.log('\n==============================================================');
console.log('                  🏆 LEADERBOARD & REPUTATION                 ');
console.log('==============================================================');
const leaderboard = contract.get_leaderboard();
leaderboard.forEach((user, idx) => {
  console.log(`${idx + 1}. @${user.account_id.padEnd(20)} | Trust: ${String(user.trust_score).padStart(3)} pts | Earned: ${user.total_earned_formatted} NEAR | Tier: ${user.current_tier}`);
});

console.log('\n[NEAR Social Badge Payload Preview]');
const badgePayload = socialConnector.generateBadgePayload(aliceProfile);
console.log(`Target Contract: ${badgePayload.contractId}`);
console.log(`SocialDB Method: ${badgePayload.methodName}`);
console.log(`Badge Data:`, JSON.stringify(badgePayload.args, null, 2));

console.log('\n==============================================================');
console.log('       ✔ DEMO SIMULATION COMPLETED SUCCESSFULLY!             ');
console.log('==============================================================');

