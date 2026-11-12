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
    assert.strictEqual(autoResult.bounty.escrow_status, 'DISBURSED');
    assert.ok(autoResult.actionTaken.includes('TIER_1_AUTO_APPROVED'));
  });

  await t.test('4. Bug 4: Atomic claim locks prevent duplicate claims (Race condition guard)', () => {
    const raceBounty = contract.create_bounty({
      title: 'Race Condition Test Task',
      description: 'Ensure only first claimant wins',
      amount_formatted: 2,
      created_by: 'dao.testnet'
    });

    // First user claims successfully
    const claimed = contract.claim_bounty(raceBounty.id, 'first-user.testnet');
    assert.strictEqual(claimed.claimed_by, 'first-user.testnet');
    assert.strictEqual(claimed.status, 'CLAIMED');

    // Second user attempting to claim the exact same bounty must fail with Conflict
    assert.throws(() => {
      contract.claim_bounty(raceBounty.id, 'second-user.testnet');
    }, (err: any) => {
      assert.ok(err.message.includes('Conflict:'));
      assert.ok(err.message.includes('first-user.testnet'));
      return true;
    });
  });

  await t.test('5. Bug 5: Escrow fund custody gate, disbursement and refund lifecycle', () => {
    // A: Unfunded bounty cannot be claimed
    const unfundedBounty = contract.create_bounty({
      title: 'Unfunded Bounty Test',
      description: 'Should not allow claims without escrow',
      amount_formatted: 10,
      created_by: 'dao.testnet',
      escrow_status: 'UNFUNDED'
    });

    assert.throws(() => {
      contract.claim_bounty(unfundedBounty.id, 'eager-user.testnet');
    }, (err: any) => {
      assert.ok(err.message.includes('EscrowRequired:'));
      return true;
    });

    // B: Cancellation of open bounty refunds escrow
    const cancelTarget = contract.create_bounty({
      title: 'Cancel Me',
      description: 'Refund test',
      amount_formatted: 7,
      created_by: 'sponsor.testnet'
    });
    assert.strictEqual(cancelTarget.escrow_status, 'ESCROWED');

    const cancelled = contract.cancel_bounty(cancelTarget.id, 'sponsor.testnet');
    assert.strictEqual(cancelled.status, 'REJECTED');
    assert.strictEqual(cancelled.escrow_status, 'REFUNDED');

    // C: Escrow metrics accurately summarize locked, disbursed, and refunded
    const metrics = contract.get_escrow_metrics();
    assert.ok(BigInt(metrics.total_disbursed_yocto) > BigInt(0));
    assert.ok(BigInt(metrics.total_refunded_yocto) > BigInt(0));
    assert.strictEqual(metrics.escrow_vault_account, 'pact-dao-933742.testnet');
  });

  await t.test('6. Bug 7: Exact YoctoNEAR BigInt precision (10^24) without float rounding drift', () => {
    const preciseBounty = contract.create_bounty({
      title: 'Precision Micro Bounty',
      description: 'Exact 1.123456789012345678 NEAR',
      amount_formatted: 1.5,
      created_by: 'math.testnet'
    });

    // 1.5 NEAR = 1500000000000000000000000 yoctoNEAR
    assert.strictEqual(preciseBounty.amount_near, '1500000000000000000000000');

    // Verify contributor total earned accumulates yoctoNEAR via BigInt
    contract.claim_bounty(preciseBounty.id, 'math-dev.testnet');
    contract.submit_work({
      bounty_id: preciseBounty.id,
      contributor_id: 'math-dev.testnet',
      proof_url: 'https://github.com/near/math/pull/1'
    });
    contract.approve_as_council(preciseBounty.id, 'council-member.testnet');

    const profile = contract.get_contributor('math-dev.testnet');
    assert.strictEqual(profile.total_earned_yocto, '1500000000000000000000000');
    assert.strictEqual(profile.total_earned_formatted, 1.5);
  });

  await t.test('7. Bug 3: Deliverable Link Deduplication rejects recycled PR links', () => {
    const bountyA = contract.create_bounty({
      title: 'Original Task',
      description: 'First task',
      amount_formatted: 3,
      created_by: 'dao.testnet'
    });
    contract.claim_bounty(bountyA.id, 'dev-a.testnet');
    contract.submit_work({
      bounty_id: bountyA.id,
      contributor_id: 'dev-a.testnet',
      proof_url: 'https://github.com/near/core-contracts/pull/777'
    });

    const bountyB = contract.create_bounty({
      title: 'Duplicate Task Attempt',
      description: 'Second task trying to recycle PR',
      amount_formatted: 3,
      created_by: 'dao.testnet'
    });
    contract.claim_bounty(bountyB.id, 'dev-b.testnet');

    // Attempting to recycle the exact same PR link must fail!
    assert.throws(() => {
      contract.submit_work({
        bounty_id: bountyB.id,
        contributor_id: 'dev-b.testnet',
        proof_url: 'https://github.com/near/core-contracts/pull/777'
      });
    }, (err: any) => {
      assert.ok(err.message.includes('ProofAlreadyUsed'));
      return true;
    });
  });

  await t.test('8. Bug 6: Rolling 24-Hour Velocity Cap prevents rapid treasury draining', () => {
    // Setup trusted user with high points (> 50 points)
    const setupBounty = contract.create_bounty({
      title: 'Setup Trust',
      description: 'Warmup',
      amount_formatted: 10,
      created_by: 'dao.testnet'
    });
    contract.claim_bounty(setupBounty.id, 'speedy.testnet');
    contract.submit_work({
      bounty_id: setupBounty.id,
      contributor_id: 'speedy.testnet',
      proof_url: 'https://github.com/near/warmup/pull/1'
    });
    contract.approve_as_council(setupBounty.id, 'council-member.testnet');

    const speedyProfile = contract.get_contributor('speedy.testnet');
    assert.ok(speedyProfile.trust_score >= 50, 'Should qualify for Tier 1');

    // 1st instant auto-payout (allowed: 1/2)
    const task1 = contract.create_bounty({ title: 'Task 1', description: 'Fast 1', amount_formatted: 3, created_by: 'dao.testnet' });
    contract.claim_bounty(task1.id, 'speedy.testnet');
    const res1 = contract.submit_work({ bounty_id: task1.id, contributor_id: 'speedy.testnet', proof_url: 'https://github.com/near/speed/pull/1' });
    assert.strictEqual(res1.bounty.status, 'APPROVED');

    // 2nd instant auto-payout (allowed: 2/2)
    const task2 = contract.create_bounty({ title: 'Task 2', description: 'Fast 2', amount_formatted: 3, created_by: 'dao.testnet' });
    contract.claim_bounty(task2.id, 'speedy.testnet');
    const res2 = contract.submit_work({ bounty_id: task2.id, contributor_id: 'speedy.testnet', proof_url: 'https://github.com/near/speed/pull/2' });
    assert.strictEqual(res2.bounty.status, 'APPROVED');

    // 3rd instant auto-payout on same day (VELOCITY CAP TRIGGERED!)
    const task3 = contract.create_bounty({ title: 'Task 3', description: 'Fast 3', amount_formatted: 3, created_by: 'dao.testnet' });
    contract.claim_bounty(task3.id, 'speedy.testnet');
    const res3 = contract.submit_work({ bounty_id: task3.id, contributor_id: 'speedy.testnet', proof_url: 'https://github.com/near/speed/pull/3' });
    
    // Automatically downgraded to Tier 2 Council Review!
    assert.strictEqual(res3.bounty.status, 'IN_REVIEW');
    assert.strictEqual(res3.bounty.required_tier, 'TIER_2_SINGLE_COUNCIL');
    assert.ok(res3.actionTaken.includes('VELOCITY_LIMIT_EXCEEDED'));
  });

  await t.test('9. Bug 6: Council Challenge / Dispute Window slashes points on fraudulent submissions', () => {
    // Find task1 which was approved earlier
    const targetBounty = contract.get_bounties().find(b => b.title === 'Task 1')!;
    assert.strictEqual(targetBounty.status, 'APPROVED');

    const trustBefore = contract.get_contributor('speedy.testnet').trust_score;

    // Council challenges the submission
    const challengeResult = contract.challenge_submission({
      bounty_id: targetBounty.id,
      council_account_id: 'council-member.testnet',
      reason: 'Empty PR detected post-settlement',
      slash_points: 30
    });

    assert.strictEqual(challengeResult.bounty.status, 'REJECTED');
    assert.strictEqual(challengeResult.bounty.dispute_status, 'CHALLENGED');
    assert.strictEqual(challengeResult.bounty.disputed_by, 'council-member.testnet');
    assert.strictEqual(challengeResult.slashedProfile.trust_score, trustBefore - 30);
  });
});

