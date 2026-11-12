import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy preview HTML to root index.html and preview/index.html
const srcHtml = path.resolve(process.cwd(), 'src', 'preview', 'index.html');
const destRootHtml = path.resolve(distDir, 'index.html');
const destPreviewHtml = path.resolve(distDir, 'preview', 'index.html');

fs.mkdirSync(path.dirname(destPreviewHtml), { recursive: true });
fs.copyFileSync(srcHtml, destRootHtml);
fs.copyFileSync(srcHtml, destPreviewHtml);

// Cloudflare SPA routing and security headers
fs.writeFileSync(path.resolve(distDir, '_redirects'), '/*    /index.html   200\n');
fs.writeFileSync(
  path.resolve(distDir, '_headers'),
  '/*\n  X-Frame-Options: SAMEORIGIN\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: document-domain=()\n  Access-Control-Allow-Origin: *\n'
);

console.log('[Build] Cloudflare Pages distribution bundle prepared successfully in ./dist');
