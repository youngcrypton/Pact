/**
 * Cloudflare Edge Worker for Pact Protocol
 * Replicates multi-user protocol state via Supabase PostgreSQL at the edge
 */

const SUPABASE_URL = 'https://dlwzgacpavudmgeemndh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_loqJDlLq7NzN35vBUcjC6g_oGf9T4dm';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
  'Content-Type': 'application/json'
};

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const sbUrl = env?.SUPABASE_URL || SUPABASE_URL;
    const sbKey = env?.SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

    const sbHeaders: Record<string, string> = {
      'apikey': sbKey,
      'Authorization': `Bearer ${sbKey}`,
      'Content-Type': 'application/json'
    };

    // Health check
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        protocol: 'Pact Protocol',
        cloud: 'Supabase PostgreSQL',
        edge: 'Cloudflare Workers',
        timestamp: Date.now()
      }), { headers: CORS_HEADERS });
    }

    // Storage Status
    if (url.pathname === '/api/storage') {
      return new Response(JSON.stringify({
        mode: 'supabase',
        cloudActive: true,
        host: new URL(sbUrl).hostname
      }), { headers: CORS_HEADERS });
    }

    // GET /api/bounties
    if (method === 'GET' && url.pathname === '/api/bounties') {
      try {
        const res = await fetch(`${sbUrl}/rest/v1/bounties?order=id.asc`, {
          headers: sbHeaders
        });
        const data = await res.json();
        return new Response(JSON.stringify({ bounties: data, total: Array.isArray(data) ? data.length : 0 }), {
          headers: CORS_HEADERS
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // POST /api/bounties (Create Bounty)
    if (method === 'POST' && url.pathname === '/api/bounties') {
      try {
        const body: any = await request.json();
        const res = await fetch(`${sbUrl}/rest/v1/bounties`, {
          method: 'POST',
          headers: { ...sbHeaders, 'Prefer': 'return=representation' },
          body: JSON.stringify(body)
        });
        const created = await res.json();
        return new Response(JSON.stringify(created), { status: res.status, headers: CORS_HEADERS });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // POST /api/bounties/:id/claim
    if (method === 'POST' && url.pathname.match(/^\/api\/bounties\/[^/]+\/claim$/)) {
      const id = url.pathname.split('/')[3];
      try {
        const body: any = await request.json();
        const res = await fetch(`${sbUrl}/rest/v1/bounties?id=eq.${id}`, {
          method: 'PATCH',
          headers: { ...sbHeaders, 'Prefer': 'return=representation' },
          body: JSON.stringify({
            claimed_by: body.account_id,
            status: 'CLAIMED',
            updated_at: new Date().toISOString()
          })
        });
        const updated = await res.json();
        return new Response(JSON.stringify(updated), { status: res.status, headers: CORS_HEADERS });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // POST /api/bounties/:id/submit
    if (method === 'POST' && url.pathname.match(/^\/api\/bounties\/[^/]+\/submit$/)) {
      const id = url.pathname.split('/')[3];
      try {
        const body: any = await request.json();
        const isAuto = body.is_auto_tier1 === true;
        const res = await fetch(`${sbUrl}/rest/v1/bounties?id=eq.${id}`, {
          method: 'PATCH',
          headers: { ...sbHeaders, 'Prefer': 'return=representation' },
          body: JSON.stringify({
            proof_url: body.proof_url,
            status: isAuto ? 'APPROVED' : 'IN_REVIEW',
            escrow_status: isAuto ? 'DISBURSED' : 'ESCROWED',
            approved_at: isAuto ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
        });
        const updated = await res.json();
        return new Response(JSON.stringify(updated), { status: res.status, headers: CORS_HEADERS });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // POST /api/bounties/:id/approve
    if (method === 'POST' && url.pathname.match(/^\/api\/bounties\/[^/]+\/approve$/)) {
      const id = url.pathname.split('/')[3];
      try {
        const res = await fetch(`${sbUrl}/rest/v1/bounties?id=eq.${id}`, {
          method: 'PATCH',
          headers: { ...sbHeaders, 'Prefer': 'return=representation' },
          body: JSON.stringify({
            status: 'APPROVED',
            escrow_status: 'DISBURSED',
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        });
        const updated = await res.json();
        return new Response(JSON.stringify(updated), { status: res.status, headers: CORS_HEADERS });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // GET /api/contributors
    if (method === 'GET' && url.pathname === '/api/contributors') {
      try {
        const res = await fetch(`${sbUrl}/rest/v1/contributors?order=trust_points.desc`, {
          headers: sbHeaders
        });
        const data = await res.json();
        return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // Fallback: Static Assets
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('Pact Protocol Active on Cloudflare', { status: 200 });
  }
};
