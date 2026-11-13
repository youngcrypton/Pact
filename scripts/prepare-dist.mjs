import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy preview HTML to root index.html and preview/index.html
const srcHtml = path.resolve(process.cwd(), 'src', 'preview', 'index.html');
const destRootHtml = path.resolve(distDir, 'index.html');
const destFallbackHtml = path.resolve(distDir, '200.html');
const destPreviewHtml = path.resolve(distDir, 'preview', 'index.html');

fs.mkdirSync(path.dirname(destPreviewHtml), { recursive: true });
fs.copyFileSync(srcHtml, destRootHtml);
fs.copyFileSync(srcHtml, destFallbackHtml);
fs.copyFileSync(srcHtml, destPreviewHtml);

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

// Cloudflare edge worker handler
const workerCode = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'healthy', protocol: 'Pact Protocol', edge: 'Cloudflare' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('Pact Protocol Active on Cloudflare', { status: 200 });
  }
};
`;
fs.writeFileSync(path.resolve(distDir, '_worker.js'), workerCode);

console.log('[Build] Cloudflare Pages distribution bundle prepared successfully in ./dist');

