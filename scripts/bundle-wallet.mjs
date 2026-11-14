import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const entry = `
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui-js';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupSender } from '@near-wallet-selector/sender';

window.PacttNearWallet = {
  setupWalletSelector,
  setupModal,
  setupMyNearWallet,
  setupMeteorWallet,
  setupHereWallet,
  setupSender
};
`;

const nodeBuiltinsPlugin = {
  name: 'node-builtins',
  setup(build) {
    build.onResolve({ filter: /^(http|https|crypto|stream|path|os|fs|buffer|util|url|assert|zlib)$/ }, args => ({
      path: args.path,
      namespace: 'node-builtins'
    }));
    build.onLoad({ filter: /.*/, namespace: 'node-builtins' }, args => {
      if (args.path === 'crypto') {
        return {
          contents: `
            export const webcrypto = typeof window !== 'undefined' ? window.crypto : null;
            export const randomBytes = (n) => typeof window !== 'undefined' ? window.crypto.getRandomValues(new Uint8Array(n)) : new Uint8Array(n);
            export default { webcrypto, randomBytes };
          `,
          loader: 'js'
        };
      }
      if (args.path === 'buffer') {
        return {
          contents: `
            const BufferShim = typeof window !== 'undefined' && window.Buffer ? window.Buffer : class Buffer extends Uint8Array {
              static from(val, enc) {
                if (typeof val === 'string') return new TextEncoder().encode(val);
                return new Uint8Array(val);
              }
              static isBuffer(b) {
                return b instanceof Uint8Array;
              }
              toString(enc) {
                return new TextDecoder().decode(this);
              }
            };
            export const Buffer = BufferShim;
            export default { Buffer: BufferShim };
          `,
          loader: 'js'
        };
      }
      return {
        contents: 'export default {};',
        loader: 'js'
      };
    });
  }
};

export async function buildWalletBundle() {
  console.log('[Wallet Bundle] Building official NEAR Wallet Selector bundle...');
  const result = await esbuild.build({
    stdin: {
      contents: entry,
      resolveDir: process.cwd(),
      sourcefile: 'wallet-entry.js',
      loader: 'js'
    },
    bundle: true,
    minify: true,
    format: 'iife',
    platform: 'browser',
    write: false,
    plugins: [nodeBuiltinsPlugin],
    define: {
      'process.env.NODE_ENV': '"production"',
      'global': 'window'
    }
  });

  const bundleJs = result.outputFiles[0].text;
  const cssPath = path.resolve(process.cwd(), 'node_modules', '@near-wallet-selector', 'modal-ui-js', 'styles.css');
  const bundleCss = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

  // Write to src/preview/
  const previewDir = path.resolve(process.cwd(), 'src', 'preview');
  fs.writeFileSync(path.resolve(previewDir, 'near-wallet-selector.bundle.js'), bundleJs);
  if (bundleCss) {
    fs.writeFileSync(path.resolve(previewDir, 'near-wallet-selector.css'), bundleCss);
  }

  // Write to dist/ if exists
  const distDir = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.resolve(distDir, 'near-wallet-selector.bundle.js'), bundleJs);
    if (bundleCss) {
      fs.writeFileSync(path.resolve(distDir, 'near-wallet-selector.css'), bundleCss);
    }
  }

  console.log('[Wallet Bundle] Success: near-wallet-selector.bundle.js (' + (bundleJs.length / 1024).toFixed(1) + ' KB) and near-wallet-selector.css created.');
}

if (process.argv[1] && process.argv[1].endsWith('bundle-wallet.mjs')) {
  buildWalletBundle().catch(err => {
    console.error('[Wallet Bundle] Failed:', err);
    process.exit(1);
  });
}
