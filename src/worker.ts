export default {
  async fetch(request: Request, env: any): Promise<Response> {
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

