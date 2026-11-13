import net from 'node:net';

function checkWhois() {
  return new Promise((resolve) => {
    const s = net.connect(43, 'whois.nic.xyz', () => {
      s.write('pactt.xyz\r\n');
    });
    let data = '';
    s.on('data', d => data += d.toString());
    s.on('end', () => {
      s.destroy();
      const hasAlexia = data.toLowerCase().includes('alexia.ns.cloudflare.com');
      const hasMargo = data.toLowerCase().includes('margo.ns.cloudflare.com');
      resolve({ hasAlexia, hasMargo });
    });
    s.on('error', () => resolve({ hasAlexia: false, hasMargo: false }));
  });
}

console.log('[Monitor] Gentle check active. Polling pactt.xyz registry every 30s...');

const startTime = Date.now();
const interval = setInterval(async () => {
  const res = await checkWhois();
  if (res.hasAlexia || res.hasMargo) {
    console.log('\n[SUCCESS] pactt.xyz nameservers switched over to alexia & margo!');
    clearInterval(interval);
    process.exit(0);
  } else {
    process.stdout.write('.');
  }
  // Timeout after 2 hours
  if (Date.now() - startTime > 120 * 60 * 1000) {
    console.log('\n[Timeout] 2 hours elapsed.');
    clearInterval(interval);
    process.exit(1);
  }
}, 30000);

