import test from 'node:test';
import assert from 'node:assert';
import { TrustBountyContract } from '../src/bounty-contract.js';

test('Pact Protocol - Tiered Approvals and Earned Trust Verification', async (t) => {
  const contract = new TrustBountyContract();
  contract.addCouncilMember('council-member.testnet');

  await t.test('1. New contributor on large bounty triggers Tier 3 Sputnik DAO Escalation', () => {
    const bounty = contract.create_bounty({
      title: 'Major Protocol Audit',
      description: 'Review security policies',
      amount_formatted: 30, // 30 NEAR (> 25 NEAR)
      created_by: 'community.sputnik-dao.testnet'
    });

    contract.claim_bounty(bounty.id, 'bob-newbie.testnet');

    const result = contract.submit_work({
      bounty_id: bounty.id,
      contributor_id: 'bob-newbie.testnet',
      proof_url: 'https://github.com/near-daos/audit/pull/1'
    });

    assert.strictEqual(result.bounty.status, 'ESCALATED_TO_DAO');
    assert.strictEqual(result.bounty.required_tier, 'TIER_3_FULL_DAO');
    assert.ok(result.bounty.sputnik_proposal_id !== null);
  });

  await t.test('2. Mid-size bounty triggers Tier 2 Single Council Sign-Off', () => {
    // First, give alice some trust points
    const smallBounty = contract.create_bounty({
      title: 'Initial Fix',
      description: 'Minor patch',
      amount_formatted: 5,
      created_by: 'community.sputnik-dao.testnet'
    });
    contract.claim_bounty(smallBounty.id, 'alice.testnet');
    contract.submit_work({
      bounty_id: smallBounty.id,
      contributor_id: 'alice.testnet',
      proof_url: 'https://github.com/near/fix/pull/10'
    });
    contract.approve_as_council(smallBounty.id, 'council-member.testnet');

    // Alice now has 35 trust points (10 + 5*5)
    const profile = contract.get_contributor('alice.testnet');
    assert.ok(profile.trust_score >= 20, 'Alice should qualify for Tier 2');

    // Alice works on a 15 NEAR bounty (Tier 2: 5-25 NEAR with trust >= 20)
    const midBounty = contract.create_bounty({
      title: 'SDK Enhancement',
      description: 'Add types',
      amount_formatted: 15,
      created_by: 'community.sputnik-dao.testnet'
    });
    contract.claim_bounty(midBounty.id, 'alice.testnet');

    const subResult = contract.submit_work({
      bounty_id: midBounty.id,
      contributor_id: 'alice.testnet',
      proof_url: 'https://github.com/near/sdk/pull/42'
    });

    assert.strictEqual(subResult.bounty.status, 'IN_REVIEW');
    assert.strictEqual(subResult.bounty.required_tier, 'TIER_2_SINGLE_COUNCIL');

    // Single council signs off
    const approvedBounty = contract.approve_as_council(midBounty.id, 'council-member.testnet');
    assert.strictEqual(approvedBounty.status, 'APPROVED');
    assert.strictEqual(approvedBounty.council_approved_by, 'council-member.testnet');
  });

  await t.test('3. Trusted contributor triggers Tier 1 Instant Auto-Approval', () => {
    // Alice now has 35 + (10 + 15*5) = 120 trust points (> 50 points!)
    const profile = contract.get_contributor('alice.testnet');
    assert.ok(profile.trust_score >= 50, `Alice trust score is ${profile.trust_score}, expected >= 50`);
    assert.strictEqual(profile.current_tier, 'TRUSTED_CORE');
    assert.strictEqual(profile.near_social_badge_minted, true);

    // Alice takes on a small bounty (4 NEAR <= 5 NEAR)
    const quickBounty = contract.create_bounty({
      title: 'Update Docs link',
      description: 'Fix dead link in tutorial',
      amount_formatted: 4,
      created_by: 'community.sputnik-dao.testnet'
    });
    contract.claim_bounty(quickBounty.id, 'alice.testnet');

    const autoResult = contract.submit_work({
      bounty_id: quickBounty.id,
      contributor_id: 'alice.testnet',
      proof_url: 'https://github.com/near/docs/pull/101'
    });

    // INSTANT AUTO-APPROVAL! No council vote needed!
    assert.strictEqual(autoResult.bounty.status, 'APPROVED');
    assert.strictEqual(autoResult.bounty.required_tier, 'TIER_1_AUTO');
    assert.ok(autoResult.actionTaken.includes('TIER_1_AUTO_APPROVED'));
  });
});

