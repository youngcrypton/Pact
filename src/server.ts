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

  // POST /api/bounties (Create)
  if (req.method === 'POST' && pathname === '/api/bounties') {
    readBody().then(body => {
      if (!body.title || !body.amount_formatted) {
        return sendJson(400, { error: 'Missing title or amount_formatted' });
      }
      const bounty = contract.create_bounty({
        title: body.title,
        description: body.description || '',
        amount_formatted: Number(body.amount_formatted),
        category: body.category || 'DEV',
        created_by: body.created_by || 'community.sputnik-dao.testnet'
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
        return sendJson(400, { error: err.message });
      }
    });
    return;
  }

  // POST /api/bounties/:id/submit
  if (req.method === 'POST' && pathname.match(/\/api\/bounties\/[^/]+\/submit/)) {
    const id = pathname.split('/')[3];
    readBody().then(body => {
      if (!body.contributor_id || !body.proof_url) {
        return sendJson(400, { error: 'Missing contributor_id or proof_url' });
      }

      // Verify GitHub format
      const ghCheck = gitHubVerifier.parseProofUrl(body.proof_url);
      if (!ghCheck.isValid) {
        return sendJson(400, { error: ghCheck.error });
      }

      try {
        const result = contract.submit_work({
          bounty_id: id,
          contributor_id: body.contributor_id,
          proof_url: body.proof_url,
          submission_notes: body.notes
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

