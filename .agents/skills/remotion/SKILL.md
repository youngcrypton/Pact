---
name: remotion
description: >-
  Programmatic video creation, motion graphics, and frame-accurate video rendering using React and Remotion.
  Use when designing, editing, or rendering programmatic video compositions, motion graphics, screen walkthroughs,
  audio-timed animations, or Remotion CLI pipelines.
---

# Remotion Video Development Skill

A guide and reference runbook for building, previewing, and rendering programmatic videos in React with Remotion.

---

## 1. Core Architecture

Remotion treats video as a deterministic function of frames:
$$\text{Frame} = f(t \times \text{fps})$$

### 1.1 Project Structure
```text
├── remotion.config.ts          # Remotion CLI configuration & browser binary setup
├── package.json                # npm scripts for rendering stills and MP4s
└── src/
    └── remotion/
        ├── index.ts            # Entry point registering Root (<Composition />)
        ├── Root.tsx            # Composition definitions (dimensions, fps, duration)
        ├── Composition.tsx     # Master video timeline (Series, Sequences, Audio)
        ├── components/         # Reusable scene components & kinetic graphics
        └── styles/             # Modular CSS or theme tokens
```

---

## 2. Fundamental Primitives

### 2.1 `<Composition />` Definition
Every video composition must be registered inside a Root component:

```tsx
import { Composition } from 'remotion';
import { MainVideo } from './MainVideo';

export const RemotionRoot = () => {
  return (
    <Composition
      id="PacttDemo"
      component={MainVideo}
      durationInFrames={2700} // 90 seconds @ 30fps
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        theme: 'light',
        accentColor: '#10b981',
      }}
    />
  );
};
```

### 2.2 `<Series>` vs `<Sequence>`
* **`<Sequence from={frame} durationInFrames={length}>`**: Places elements at an absolute frame offset on the timeline. Supports overlapping tracks (e.g. background audio, persistent watermark).
* **`<Series>`**: Automatically sequences scenes sequentially without manually calculating frame math:

```tsx
import { Series, Sequence, Audio, staticFile } from 'remotion';

export const MainVideo = () => {
  return (
    <>
      {/* Background Audio across entire video */}
      <Audio src={staticFile('audio/master-voiceover.mp3')} volume={0.9} />

      {/* Sequential scenes */}
      <Series>
        <Series.Sequence durationInFrames={450}>
          <SceneProblem />
        </Series.Sequence>
        <Series.Sequence durationInFrames={600}>
          <SceneInstantPayout />
        </Series.Sequence>
        <Series.Sequence durationInFrames={450}>
          <SceneMultiSigSafety />
        </Series.Sequence>
        <Series.Sequence durationInFrames={1200}>
          <SceneSocialProof />
        </Series.Sequence>
      </Series>
    </>
  );
};
```

---

## 3. Kinetic Animation & Motion Principles

### 3.1 `spring()` for Natural Physics
Never use linear transitions for UI reveals or typography entrances. Always use `spring()`:

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const entrance = spring({
  frame,
  fps,
  config: {
    damping: 14,
    mass: 0.8,
    stiffness: 120,
  },
});

const scale = interpolate(entrance, [0, 1], [0.85, 1]);
const opacity = interpolate(entrance, [0, 1], [0, 1]);
```

### 3.2 `interpolate()` for Range Mapping
Map frame progression to CSS transforms or numeric telemetry counters:

```tsx
import { interpolate, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();

// Telemetry counter interpolation
const balance = interpolate(frame, [30, 90], [103.5, 153.0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

---

## 4. Headless Browser Configuration (`remotion.config.ts`)

On Windows or restricted environments where Chromium fails automatic download, configure Remotion to use the installed Microsoft Edge or Google Chrome binary:

```typescript
import { Config } from '@remotion/cli/config';

// 1. Point to locally installed browser executable
Config.setBrowserExecutable(
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
);

// 2. Resolve ESM/NodeNext .js extension alias in TypeScript
Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      extensionAlias: {
        '.js': ['.ts', '.tsx', '.js'],
      },
    },
  };
});
```

---

## 5. CLI Rendering Recipes

```bash
# Render single still frame for testing / OG image
npm run video:still
# Equivalent to:
npx remotion still src/remotion/index.ts PacttDemo out/frame.png --frame=450

# Render full production MP4
npm run video:render
# Equivalent to:
npx remotion render src/remotion/index.ts PacttDemo out/demo.mp4 --codec=h264

# Start local Remotion preview studio
npx remotion preview src/remotion/index.ts
```
