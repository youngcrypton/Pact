import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy preview HTML to root index.html, 200.html, and preview/index.html
const srcHtml = path.resolve(process.cwd(), 'src', 'preview', 'index.html');
const destRootHtml = path.resolve(distDir, 'index.html');
const destFallbackHtml = path.resolve(distDir, '200.html');
const destPreviewHtml = path.resolve(distDir, 'preview', 'index.html');

fs.mkdirSync(path.dirname(destPreviewHtml), { recursive: true });
fs.copyFileSync(srcHtml, destRootHtml);
fs.copyFileSync(srcHtml, destFallbackHtml);
fs.copyFileSync(srcHtml, destPreviewHtml);

// Copy demo HTML
const srcDemoHtml = path.resolve(process.cwd(), 'src', 'preview', 'demo.html');
const destDemoHtml = path.resolve(distDir, 'demo.html');
if (fs.existsSync(srcDemoHtml)) {
  fs.copyFileSync(srcDemoHtml, destDemoHtml);
}


// Copy preview server if present
const srcPreviewServer = path.resolve(process.cwd(), 'src', 'preview', 'server.mjs');
const destPreviewServer = path.resolve(distDir, 'preview', 'server.mjs');
if (fs.existsSync(srcPreviewServer)) {
  fs.copyFileSync(srcPreviewServer, destPreviewServer);
}

// Remove legacy _redirects if present to avoid Cloudflare 100324 infinite loop error
const redirectsFile = path.resolve(distDir, '_redirects');
if (fs.existsSync(redirectsFile)) {
  fs.unlinkSync(redirectsFile);
}

// Cloudflare security headers and asset ignore
fs.writeFileSync(path.resolve(distDir, '.assetsignore'), '_worker.js\n_redirects\n');
fs.writeFileSync(
  path.resolve(distDir, '_headers'),
  '/*\n  X-Frame-Options: SAMEORIGIN\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: document-domain=()\n  Access-Control-Allow-Origin: *\n'
);

// Cloudflare edge worker handler - Supabase REST Multi-User Sync
const workerCode = `/**
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
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const sbUrl = (env && env.SUPABASE_URL) || SUPABASE_URL;
    const sbKey = (env && env.SUPABASE_ANON_KEY) || SUPABASE_ANON_KEY;

    const sbHeaders = {
      'apikey': sbKey,
      'Authorization': 'Bearer ' + sbKey,
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
        const res = await fetch(sbUrl + '/rest/v1/bounties?order=id.asc', {
          headers: sbHeaders
        });
        const data = await res.json();
        return new Response(JSON.stringify({ bounties: data, total: Array.isArray(data) ? data.length : 0 }), {
          headers: CORS_HEADERS
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // POST /api/bounties (Create Bounty)
    if (method === 'POST' && url.pathname === '/api/bounties') {
      try {
        const body = await request.json();
        const res = await fetch(sbUrl + '/rest/v1/bounties', {
          method: 'POST',
          headers: { ...sbHeaders, 'Prefer': 'return=representation' },
          body: JSON.stringify(body)
        });
        const created = await res.json();
        return new Response(JSON.stringify(created), { status: res.status, headers: CORS_HEADERS });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // POST /api/bounties/:id/claim
    if (method === 'POST' && url.pathname.match(/^\\/api\\/bounties\\/[^/]+\\/claim$/)) {
      const id = url.pathname.split('/')[3];
      try {
        const body = await request.json();
        const res = await fetch(sbUrl + '/rest/v1/bounties?id=eq.' + id, {
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
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // POST /api/bounties/:id/submit
    if (method === 'POST' && url.pathname.match(/^\\/api\\/bounties\\/[^/]+\\/submit$/)) {
      const id = url.pathname.split('/')[3];
      try {
        const body = await request.json();
        const isAuto = body.is_auto_tier1 === true;
        const res = await fetch(sbUrl + '/rest/v1/bounties?id=eq.' + id, {
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
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // POST /api/bounties/:id/approve
    if (method === 'POST' && url.pathname.match(/^\\/api\\/bounties\\/[^/]+\\/approve$/)) {
      const id = url.pathname.split('/')[3];
      try {
        const body = await request.json();
        const res = await fetch(sbUrl + '/rest/v1/bounties?id=eq.' + id, {
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
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // GET /api/contributors
    if (method === 'GET' && url.pathname === '/api/contributors') {
      try {
        const res = await fetch(sbUrl + '/rest/v1/contributors?order=trust_points.desc', {
          headers: sbHeaders
        });
        const data = await res.json();
        return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
      } catch (err) {
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
`;
fs.writeFileSync(path.resolve(distDir, '_worker.js'), workerCode);

console.log('[Build] Cloudflare Pages distribution bundle prepared successfully in ./dist');
