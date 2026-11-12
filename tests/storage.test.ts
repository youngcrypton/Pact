import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { PactStorage } from '../src/storage.js';
import { TrustBountyContract } from '../src/bounty-contract.js';

test('Bug 1: Cloud & Local Resilient Persistence Architecture', async (t) => {
  const testStorageDir = path.resolve(process.cwd(), 'data', 'test-store');
  const testStorageFile = path.resolve(testStorageDir, 'test-pact-store.json');

  // Clean test file if exists
  if (fs.existsSync(testStorageFile)) {
    fs.unlinkSync(testStorageFile);
  }

  await t.test('1. PactStorage instantiates in local-durable mode without cloud keys', () => {
    const storage = new PactStorage({ localFilePath: testStorageFile });
    assert.strictEqual(storage.getStorageMode(), 'local-durable');
    assert.strictEqual(storage.isCloudActive(), false);
  });

  await t.test('2. Contract persists mutations and hydrates across reboot', async () => {
    const storage1 = new PactStorage({ localFilePath: testStorageFile });
    const contract1 = new TrustBountyContract(undefined, ['council.testnet'], storage1);

    await contract1.init();

    // Seed contributor with trust so Tier 2 routing applies
    contract1.seedContributor('alex.testnet', 100);

    // Create a bounty
    const b1 = contract1.create_bounty({
      title: 'Persistent Architecture Bounty',
      description: 'Testing durable disk persistence across reboots',
      amount_formatted: 12.5,
      category: 'DEV',
      created_by: 'dao.sputnik-dao.testnet'
    });

    // Claim it
    contract1.claim_bounty(b1.id, 'alex.testnet');

    // Submit work
    contract1.submit_work({
      bounty_id: b1.id,
      contributor_id: 'alex.testnet',
      proof_url: 'https://github.com/near/core-contracts/pull/999'
    });

    // Verify file exists on disk
    assert.ok(fs.existsSync(testStorageFile));
    const raw = fs.readFileSync(testStorageFile, 'utf-8');
    const snapshot = JSON.parse(raw);
    assert.strictEqual(snapshot.bounties.length, 1);
    assert.strictEqual(snapshot.bounties[0].id, b1.id);
    assert.strictEqual(snapshot.bounties[0].status, 'IN_REVIEW');
    assert.strictEqual(snapshot.usedProofUrls.length, 1);
    assert.strictEqual(snapshot.usedProofUrls[0][0], 'https://github.com/near/core-contracts/pull/999');

    // Simulate complete process crash and reboot
    const storage2 = new PactStorage({ localFilePath: testStorageFile });
    const contract2 = new TrustBountyContract(undefined, ['council.testnet'], storage2);
    
    // Before init, contract2 has 0 bounties
    assert.strictEqual(contract2.get_bounties().length, 0);

    // Hydrate
    await contract2.init();

    // After init, all data is restored
    assert.strictEqual(contract2.get_bounties().length, 1);
    const restoredBounty = contract2.get_bounty(b1.id);
    assert.ok(restoredBounty);
    assert.strictEqual(restoredBounty.title, 'Persistent Architecture Bounty');
    assert.strictEqual(restoredBounty.claimed_by, 'alex.testnet');
    assert.strictEqual(restoredBounty.status, 'IN_REVIEW');

    // Deduplication should also be restored across reboots
    const b2 = contract2.create_bounty({
      title: 'Second Bounty',
      description: 'Attempting recycled URL',
      amount_formatted: 2.0,
      category: 'DEV',
      created_by: 'dao.sputnik-dao.testnet'
    });
    contract2.claim_bounty(b2.id, 'bob.testnet');

    assert.throws(
      () => {
        contract2.submit_work({
          bounty_id: b2.id,
          contributor_id: 'bob.testnet',
          proof_url: 'https://github.com/near/core-contracts/pull/999'
        });
      },
      /ProofAlreadyUsed/
    );
  });

  await t.test('3. Escrow custody and slashed trust scores survive reboots', async () => {
    const storage1 = new PactStorage({ localFilePath: testStorageFile });
    const contract1 = new TrustBountyContract(undefined, ['council.testnet'], storage1);
    await contract1.init();

    // Approve the first bounty
    const bounties = contract1.get_bounties();
    const b1Id = bounties.find(b => b.title === 'Persistent Architecture Bounty')!.id;
    contract1.approve_as_council(b1Id, 'council.testnet');

    // Challenge and slash
    contract1.challenge_submission({
      bounty_id: b1Id,
      council_account_id: 'council.testnet',
      reason: 'Deliverable was plagiarized',
      slash_points: 50
    });

    const metricsBeforeReboot = contract1.get_escrow_metrics();

    // Reboot again
    const storage2 = new PactStorage({ localFilePath: testStorageFile });
    const contract2 = new TrustBountyContract(undefined, ['council.testnet'], storage2);
    await contract2.init();

    const metricsAfterReboot = contract2.get_escrow_metrics();
    assert.strictEqual(metricsAfterReboot.total_refunded_formatted, metricsBeforeReboot.total_refunded_formatted);
    assert.strictEqual(metricsAfterReboot.total_refunded_yocto, metricsBeforeReboot.total_refunded_yocto);

    const bAfter = contract2.get_bounty(b1Id);
    assert.strictEqual(bAfter?.dispute_status, 'CHALLENGED');
    assert.strictEqual(bAfter?.dispute_reason, 'Deliverable was plagiarized');
  });

  // Cleanup test artifacts
  if (fs.existsSync(testStorageFile)) {
    fs.unlinkSync(testStorageFile);
  }
  if (fs.existsSync(testStorageDir)) {
    try { fs.rmdirSync(testStorageDir); } catch {}
  }
});
