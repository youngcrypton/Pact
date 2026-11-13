// @ts-nocheck
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

async function main() {
  console.log('[Remotion] Initializing video render for Pactt Hackathon Demo...');
  const entryPoint = path.resolve('./src/remotion/index.ts');
  const outDir = path.resolve('./out');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`[Remotion] Bundling composition from: ${entryPoint}`);
  const bundleLocation = await bundle({
    entryPoint,
  });

  console.log('[Remotion] Selecting composition: PacttDemo');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'PacttDemo',
  });

  console.log(
    `[Remotion] Composition specs: ${composition.width}x${composition.height} (16:9), ` +
      `${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(1)}s) @ ${composition.fps}fps`
  );

  const outputLocation = path.resolve(outDir, 'pactt-hackathon-demo.mp4');
  console.log(`[Remotion] Output file destination: ${outputLocation}`);

  // Chromium / Edge detection
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserExecutable = fs.existsSync(edgePath) ? edgePath : undefined;
  if (browserExecutable) {
    console.log(`[Remotion] Using system browser: ${browserExecutable}`);
  }

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation,
    browserExecutable,
    onProgress: ({ progress }) => {
      const pct = (progress * 100).toFixed(1);
      process.stdout.write(`\r[Remotion Render Progress] ${pct}% complete`);
    },
  });

  console.log('\n[Remotion] Video render complete!');
  const stats = fs.statSync(outputLocation);
  console.log(`[Remotion] Generated: ${outputLocation} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
}

main().catch((err) => {
  console.error('[Remotion] Render failed:', err);
  process.exit(1);
});
