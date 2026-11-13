import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const HTML_PATH = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Reverse proxy API routes to backend on port 3001
  if (url.pathname.startsWith('/api/')) {
    const proxyHeaders = { ...req.headers, host: '127.0.0.1:3001' };
    const proxyReq = http.request({
      hostname: '127.0.0.1',
      port: 3001,
      path: req.url,
      method: req.method,
      headers: proxyHeaders
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Backend API offline on port 3001: ' + err.message,
        fallbackMode: 'durable-local-browser'
      }));
    });

    req.pipe(proxyReq, { end: true });
    return;
  }

  if (url.pathname === '/' || url.pathname === '/index.html') {
    try {
      const html = fs.readFileSync(HTML_PATH, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading preview HTML: ' + err.message);
    }
    return;
  }

  // Demo Video Studio Player
  if (url.pathname === '/demo' || url.pathname === '/demo.html') {
    try {
      const demoHtmlPath = path.join(__dirname, 'demo.html');
      const html = fs.readFileSync(demoHtmlPath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading demo studio HTML: ' + err.message);
    }
    return;
  }

  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', preview: true, port: PORT }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Pact Preview] Dev server active on http://localhost:${PORT}`);
  console.log(`[Pact Preview] Network access on http://192.168.18.2:${PORT}`);
  console.log(`[Pact Preview] Reverse-proxying /api/ to http://127.0.0.1:3001`);
  console.log(`[Pact Preview] UI Specification: Swiss Instrument / Anti-slop`);
});
