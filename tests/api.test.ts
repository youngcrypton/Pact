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

  await t.test('GET /api/leaderboard returns contributor rankings', async () => {
    const res = await fetch(`${BASE_URL}/leaderboard`);
    assert.strictEqual(res.status, 200);
    const data = await res.json() as any;
    assert.ok(Array.isArray(data.leaderboard));
  });

  // Close server after tests complete
  server.close();
});

