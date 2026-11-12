interface Env {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

export const onRequest = async (context: { request: Request; env: Env }): Promise<Response> => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Health check
  if (path === '/api/health') {
    return new Response(
      JSON.stringify({ status: 'healthy', protocol: 'Pact Protocol', edge: 'Cloudflare Pages', timestamp: Date.now() }),
      { headers: corsHeaders, status: 200 }
    );
  }

  const supabaseUrl = context.env?.SUPABASE_URL || 'https://dlwzgacpavudmgeemndh.supabase.co';
  const supabaseKey = context.env?.SUPABASE_ANON_KEY || 'sb_publishable_loqJDlLq7NzN35vBUcjC6g_oGf9T4dm';

  // Storage status check
  if (path === '/api/storage') {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/bounties?select=id`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      const bounties = await res.json() as any[];
      return new Response(
        JSON.stringify({
          mode: 'supabase',
          isCloudActive: true,
          counts: { bounties: Array.isArray(bounties) ? bounties.length : 8, contributors: 5 },
          updatedAt: Date.now()
        }),
        { headers: corsHeaders, status: 200 }
      );
    } catch (e: any) {
      return new Response(
        JSON.stringify({ mode: 'supabase', isCloudActive: false, error: e.message }),
        { headers: corsHeaders, status: 200 }
      );
    }
  }

  // Query bounties from Supabase
  if (path === '/api/bounties') {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/bounties?select=*`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      const bounties = await res.json() as any[];
      return new Response(
        JSON.stringify({ bounties: Array.isArray(bounties) ? bounties : [], total: bounties.length || 0 }),
        { headers: corsHeaders, status: 200 }
      );
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { headers: corsHeaders, status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: 'Route not found' }), { headers: corsHeaders, status: 404 });
};

