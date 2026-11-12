import http from 'node:http';
import { TrustBountyContract } from './bounty-contract.js';
import { NearSocialConnector } from './near-social.js';
import { GitHubVerifier } from './github-verifier.js';

const PORT = process.env.PORT || 3001;
const contract = new TrustBountyContract();
const socialConnector = new NearSocialConnector();
const gitHubVerifier = new GitHubVerifier();

// Seed initial council members for testing
contract.addCouncilMember('council.testnet');
contract.addCouncilMember('admin.testnet');

// Pre-seed a few sample bounties
contract.create_bounty({
  title: 'Implement NEP-171 NFT Metadata Parser',
  description: 'Write a lightweight parser for standard NEAR NFT metadata in TypeScript.',
  amount_formatted: 3.5,
  category: 'DEV',
  created_by: 'devhub.sputnik-dao.testnet'
});

contract.create_bounty({
  title: 'BOS / NEAR Social Component Card Design',
  description: 'Design pixel-perfect Figma cards for reputation badges on near.social.',
  amount_formatted: 8.0,
  category: 'DESIGN',
  created_by: 'marketing.sputnik-dao.testnet'
});

contract.create_bounty({
  title: 'Build Full Cross-Chain Intent Relayer',
  description: 'Build a production-ready intent solver for 10 NEAR/ETH swaps.',
  amount_formatted: 50.0,
  category: 'DEV',
  created_by: 'intents.sputnik-dao.testnet'
});

const server = http.createServer((req, res) => {
  // CORS Headers for React Frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const pathname = url.pathname;

  const sendJson = (statusCode: number, data: any) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  };

  const readBody = (): Promise<any> => {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
  };

  // --- ROUTES ---

  // Health check
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(200, { status: 'healthy', protocol: 'Pact Protocol', timestamp: Date.now() });
  }

  // GET /api/bounties
  if (req.method === 'GET' && pathname === '/api/bounties') {
    const status = url.searchParams.get('status') as any;
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!, 10) : undefined;
    const bounties = contract.get_bounties({ status, limit });
    return sendJson(200, { bounties, total: bounties.length });
  }

  // GET /api/bounties/:id
  if (req.method === 'GET' && pathname.startsWith('/api/bounties/')) {
    const id = pathname.replace('/api/bounties/', '');
    const bounty = contract.get_bounty(id);
    if (!bounty) return sendJson(404, { error: `Bounty ${id} not found` });
    return sendJson(200, bounty);
  }

  // GET /api/contributors/:account_id
  if (req.method === 'GET' && pathname.startsWith('/api/contributors/')) {
    const accountId = pathname.replace('/api/contributors/', '');
    const profile = contract.get_contributor(accountId);
    return sendJson(200, profile);
  }

  // GET /api/leaderboard
  if (req.method === 'GET' && pathname === '/api/leaderboard') {
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!, 10) : 10;
    const leaderboard = contract.get_leaderboard(limit);
    return sendJson(200, { leaderboard });
  }

  // GET /api/policy
  if (req.method === 'GET' && pathname === '/api/policy') {
    return sendJson(200, contract.get_tier_policy());
  }

  // GET /api/escrow (Escrow Vault Metrics - Bug 5)
  if (req.method === 'GET' && pathname === '/api/escrow') {
    return sendJson(200, contract.get_escrow_metrics());
  }

  // POST /api/bounties (Create)
  if (req.method === 'POST' && pathname === '/api/bounties') {
    readBody().then(body => {
      if (!body.title || (!body.amount_formatted && !body.amount_near)) {
        return sendJson(400, { error: 'Missing title or amount_formatted' });
      }
      const bounty = contract.create_bounty({
        title: body.title,
        description: body.description || '',
        amount_formatted: Number(body.amount_formatted || 0),
        amount_near: body.amount_near,
        category: body.category || 'DEV',
        created_by: body.created_by || 'community.sputnik-dao.testnet',
        escrow_status: body.escrow_status,
        escrow_tx_hash: body.escrow_tx_hash
      });
      return sendJson(201, bounty);
    });
    return;
  }

  // POST /api/bounties/:id/claim
  if (req.method === 'POST' && pathname.match(/\/api\/bounties\/[^/]+\/claim/)) {
    const id = pathname.split('/')[3];
    readBody().then(body => {
      if (!body.account_id) return sendJson(400, { error: 'Missing account_id' });
      try {
        const bounty = contract.claim_bounty(id, body.account_id);
        return sendJson(200, bounty);
      } catch (err: any) {
        // Bug 4: Return 409 Conflict if race condition occurred
        if (err.message && err.message.startsWith('Conflict:')) {
          return sendJson(409, { error: err.message });
        }
        // Bug 5: Return 402 Payment Required if unfunded
        if (err.message && err.message.startsWith('EscrowRequired:')) {
          return sendJson(402, { error: err.message });
        }
        return sendJson(400, { error: err.message });
      }
    });
    return;
  }

  // POST /api/bounties/:id/cancel
  if (req.method === 'POST' && pathname.match(/\/api\/bounties\/[^/]+\/cancel/)) {
    const id = pathname.split('/')[3];
    readBody().then(body => {
      if (!body.caller_account_id) return sendJson(400, { error: 'Missing caller_account_id' });
      try {
        const bounty = contract.cancel_bounty(id, body.caller_account_id);
        return sendJson(200, bounty);
      } catch (err: any) {
        return sendJson(400, { error: err.message });
      }
    });
    return;
  }

  // POST /api/bounties/:id/submit
  if (req.method === 'POST' && pathname.match(/\/api\/bounties\/[^/]+\/submit/)) {
    const id = pathname.split('/')[3];
    readBody().then(async (body) => {
      if (!body.contributor_id || !body.proof_url) {
        return sendJson(400, { error: 'Missing contributor_id or proof_url' });
      }

      // Bug 3: Live GitHub verification (checks merged status, author, and syntax)
      const ghCheck = await gitHubVerifier.verifyMergedPullRequest(body.proof_url, body.github_handle);
      if (!ghCheck.isVerified && !ghCheck.isFallback) {
        return sendJson(400, { error: ghCheck.error || 'Invalid or unmerged GitHub Pull Request' });
      }

      try {
        const result = contract.submit_work({
          bounty_id: id,
          contributor_id: body.contributor_id,
          proof_url: body.proof_url,
          submission_notes: body.notes
        });
        return sendJson(200, { ...result, githubVerification: ghCheck });
      } catch (err: any) {
        return sendJson(400, { error: err.message });
      }
    });
    return;
  }

  // POST /api/bounties/:id/challenge (Bug 6: Council Dispute Window)
  if (req.method === 'POST' && pathname.match(/\/api\/bounties\/[^/]+\/challenge/)) {
    const id = pathname.split('/')[3];
    readBody().then(body => {
      if (!body.council_account_id || !body.reason) {
        return sendJson(400, { error: 'Missing council_account_id or reason' });
      }
      try {
        const result = contract.challenge_submission({
          bounty_id: id,
          council_account_id: body.council_account_id,
          reason: body.reason,
          slash_points: body.slash_points ? Number(body.slash_points) : undefined
        });
        return sendJson(200, result);
      } catch (err: any) {
        return sendJson(400, { error: err.message });
      }
    });
    return;
  }

  // POST /api/bounties/:id/approve (Council Signoff)
  if (req.method === 'POST' && pathname.match(/\/api\/bounties\/[^/]+\/approve/)) {
    const id = pathname.split('/')[3];
    readBody().then(body => {
      if (!body.council_account_id) {
        return sendJson(400, { error: 'Missing council_account_id' });
      }
      try {
        const bounty = contract.approve_as_council(id, body.council_account_id);
        return sendJson(200, bounty);
      } catch (err: any) {
        return sendJson(400, { error: err.message });
      }
    });
    return;
  }

  // Fallback 404
  return sendJson(404, { error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`[Pact API] Server running on http://localhost:${PORT}`);
  console.log(`Ready to serve React Frontend.`);
});

export { server, contract };

