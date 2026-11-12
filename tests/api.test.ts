process.env.NODE_ENV = 'test';
import test from 'node:test';
import assert from 'node:assert';
import { server, contract } from '../src/server.js';

test('Pact API Server Integration', async (t) => {
  const BASE_URL = 'http://localhost:3001/api';

  await t.test('GET /api/health returns healthy', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json() as any;
    assert.strictEqual(data.status, 'healthy');
    assert.strictEqual(data.protocol, 'Pact Protocol');
  });

  await t.test('GET /api/bounties returns initial seeded bounties', async () => {
    const res = await fetch(`${BASE_URL}/bounties`);
    assert.strictEqual(res.status, 200);
    const data = await res.json() as any;
    assert.ok(Array.isArray(data.bounties));
    assert.ok(data.bounties.length >= 3);
  });

  await t.test('POST /api/bounties creates a new bounty', async () => {
    const res = await fetch(`${BASE_URL}/bounties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'New Integration Bounty',
        description: 'Test API creation',
        amount_formatted: 4.0,
        category: 'DEV'
      })
    });
    assert.strictEqual(res.status, 201);
    const bounty = await res.json() as any;
    assert.strictEqual(bounty.title, 'New Integration Bounty');
    assert.strictEqual(bounty.status, 'OPEN');
  });

  await t.test('POST /api/bounties/:id/claim claims the bounty', async () => {
    const res = await fetch(`${BASE_URL}/bounties/bounty-1/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id: 'alice.testnet' })
    });
    assert.strictEqual(res.status, 200);
    const bounty = await res.json() as any;
    assert.strictEqual(bounty.status, 'CLAIMED');
    assert.strictEqual(bounty.claimed_by, 'alice.testnet');
    assert.strictEqual(bounty.escrow_status, 'ESCROWED');
  });

  await t.test('Bug 4: POST /api/bounties/:id/claim returns 409 Conflict on collision', async () => {
    const res = await fetch(`${BASE_URL}/bounties/bounty-1/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id: 'bob-attacker.testnet' })
    });
    assert.strictEqual(res.status, 409);
    const body = await res.json() as any;
    assert.ok(body.error.includes('Conflict:'));
  });

  await t.test('Bug 5: POST /api/bounties/:id/claim returns 402 when claiming unfunded bounty', async () => {
    // Create an unfunded bounty
    const createRes = await fetch(`${BASE_URL}/bounties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Unfunded Task',
        amount_formatted: 5.0,
        escrow_status: 'UNFUNDED'
      })
    });
    assert.strictEqual(createRes.status, 201);
    const created = await createRes.json() as any;

    const claimRes = await fetch(`${BASE_URL}/bounties/${created.id}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id: 'someone.testnet' })
    });
    assert.strictEqual(claimRes.status, 402);
    const claimErr = await claimRes.json() as any;
    assert.ok(claimErr.error.includes('EscrowRequired:'));
  });

  await t.test('GET /api/escrow returns vault metrics', async () => {
    const res = await fetch(`${BASE_URL}/escrow`);
    assert.strictEqual(res.status, 200);
    const data = await res.json() as any;
    assert.ok(data.total_locked_yocto !== undefined);
    assert.strictEqual(data.escrow_vault_account, 'pact-dao-933742.testnet');
  });

  await t.test('POST /api/bounties/:id/submit validates GitHub PR link and triggers Tier flow', async () => {
    // 1. Invalid URL rejected
    const badRes = await fetch(`${BASE_URL}/bounties/bounty-1/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contributor_id: 'alice.testnet',
        proof_url: 'https://notgithub.com/something'
      })
    });
    assert.strictEqual(badRes.status, 400);

    // 2. Valid URL accepted
    const goodRes = await fetch(`${BASE_URL}/bounties/bounty-1/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contributor_id: 'alice.testnet',
        proof_url: 'https://github.com/near/nep-171/pull/15',
        notes: 'Implemented parser and tests'
      })
    });
    assert.strictEqual(goodRes.status, 200);
    const result = await goodRes.json() as any;
    assert.ok(result.bounty);
    assert.ok(result.actionTaken);
  });

  await t.test('Bug 3: POST /api/bounties/:id/submit rejects recycled proof links', async () => {
    // Create and claim a new bounty
    const bRes = await fetch(`${BASE_URL}/bounties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Recycle Target', amount_formatted: 3 })
    });
    const bData = await bRes.json() as any;

    await fetch(`${BASE_URL}/bounties/${bData.id}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id: 'copycat.testnet' })
    });

    // Attempt to submit the exact same PR link that was already redeemed on bounty-1
    const dupRes = await fetch(`${BASE_URL}/bounties/${bData.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contributor_id: 'copycat.testnet',
        proof_url: 'https://github.com/near/nep-171/pull/15'
      })
    });

    assert.strictEqual(dupRes.status, 400);
    const dupErr = await dupRes.json() as any;
    assert.ok(dupErr.error.includes('ProofAlreadyUsed'));
  });

  await t.test('Bug 6: POST /api/bounties/:id/challenge allows council dispute within 24h', async () => {
    // First approve bounty-1 as council so it becomes APPROVED
    await fetch(`${BASE_URL}/bounties/bounty-1/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ council_account_id: 'council.testnet' })
    });

    // Challenge the submission
    const chalRes = await fetch(`${BASE_URL}/bounties/bounty-1/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        council_account_id: 'council.testnet',
        reason: 'Plagiarism detected post-settlement',
        slash_points: 25
      })
    });

    assert.strictEqual(chalRes.status, 200);
    const chalData = await chalRes.json() as any;
    assert.strictEqual(chalData.bounty.status, 'REJECTED');
    assert.strictEqual(chalData.bounty.dispute_status, 'CHALLENGED');
  });

  await t.test('GET /api/leaderboard returns contributor rankings', async () => {
    const res = await fetch(`${BASE_URL}/leaderboard`);
    assert.strictEqual(res.status, 200);
    const data = await res.json() as any;
    assert.ok(Array.isArray(data.leaderboard));
  });

  // Close server after tests complete
  server.close();
});

