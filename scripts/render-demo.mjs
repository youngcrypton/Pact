import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const OUT_DIR = path.join(ROOT_DIR, 'out');
const AUDIO_DIR = path.join(ROOT_DIR, 'public', 'audio');
const FFMPEG_BIN_DIR = 'C:\\Users\\GOONESS\\scoop\\apps\\ffmpeg\\9.0.2\\bin';
const FFMPEG = path.join(FFMPEG_BIN_DIR, 'ffmpeg.exe');
const FFPROBE = path.join(FFMPEG_BIN_DIR, 'ffprobe.exe');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log('===========================================================');
console.log('  PACTT MOTION GRAPHICS PIPELINE - 90s DEMO COMPOSITION');
console.log('===========================================================');
console.log('Frames:   2700 frames @ 30fps (90.0 seconds)');
console.log('Output:   out/demo.mp4');
console.log('Theme:    Swiss Instrument Light Mode (#F8F9FA, #10B981, #0A0A0A)');
console.log('Voice:    en-US-ChristopherNeural High-Definition Synthesizer');
console.log('-----------------------------------------------------------');

// 1. Build synchronized audio track
console.log('[1/3] Assembling frame-accurate voiceover audio track...');
const audioSynced = path.join(OUT_DIR, 'audio-synced.aac');
const audioCmd = `"${FFMPEG}" -hide_banner -loglevel error ` +
  `-i "${path.join(AUDIO_DIR, 'act1.mp3')}" ` +
  `-i "${path.join(AUDIO_DIR, 'act2.mp3')}" ` +
  `-i "${path.join(AUDIO_DIR, 'act3.mp3')}" ` +
  `-i "${path.join(AUDIO_DIR, 'act4.mp3')}" ` +
  `-i "${path.join(AUDIO_DIR, 'act5.mp3')}" ` +
  `-filter_complex "[0:a]adelay=0|0[a1];[1:a]adelay=22500|22500[a2];[2:a]adelay=42000|42000[a3];[3:a]adelay=60000|60000[a4];[4:a]adelay=76000|76000[a5];[a1][a2][a3][a4][a5]amix=inputs=5:duration=longest:normalize=0,volume=2.2[outa]" ` +
  `-map "[outa]" -c:a aac -b:a 192k -y "${audioSynced}"`;

execSync(audioCmd, { stdio: 'inherit' });
console.log('Audio track assembled successfully.');

// 2. Render Remotion video frames
console.log('[2/3] Rendering 2700 frames via Remotion CLI and Headless Edge...');
const videoRaw = path.join(OUT_DIR, 'video-raw.mp4');
const remotionCli = path.join(ROOT_DIR, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');

const remotionArgs = [
  remotionCli,
  'render',
  'src/remotion/index.ts',
  'PacttDemo',
  videoRaw,
  '--muted',
  `--binaries-directory=${FFMPEG_BIN_DIR}`,
  '--overwrite',
  '--gl=angle'
];

const renderProcess = spawn('node', remotionArgs, {
  stdio: 'inherit',
  cwd: ROOT_DIR
});

renderProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Remotion render exited with code ${code}`);
    process.exit(code);
  }

  // 3. Mux high-def video with audio track
  console.log('[3/3] Final muxing: combining 1080p video with stereo master audio...');
  const finalDemo = path.join(OUT_DIR, 'demo.mp4');
  const workspaceDemo = path.join(ROOT_DIR, 'pactt-demo-final.mp4');
  const muxCmd = `"${FFMPEG}" -hide_banner -loglevel error -i "${videoRaw}" -i "${audioSynced}" -c:v copy -c:a copy -t 90 -y "${finalDemo}"`;
  execSync(muxCmd, { stdio: 'inherit' });

  // Save copy directly to workspace root for easy user download & posting
  fs.copyFileSync(finalDemo, workspaceDemo);

  // Cleanup intermediates
  if (fs.existsSync(videoRaw)) fs.unlinkSync(videoRaw);
  if (fs.existsSync(audioSynced)) fs.unlinkSync(audioSynced);

  console.log('===========================================================');
  console.log('  SUCCESS: out/demo.mp4 and pactt-demo-final.mp4 created!');
  console.log('===========================================================');
  
  // Inspect result
  const stats = fs.statSync(finalDemo);
  console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  const probeOutput = execSync(`"${FFPROBE}" -v error -show_entries format=duration:stream=width,height,r_frame_rate -of default=noprint_wrappers=1 "${finalDemo}"`).toString();
  console.log(probeOutput.trim());
});

