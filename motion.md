# Universal Autonomous Motion Graphics Engine (`motion.md`)
### *The Universal Zero-Dead-Air Video Production Blueprint*

> **Engine Directive:** This document is a product-agnostic, universal motion graphics operating system. It accepts **ANY** input (GitHub repository, live website URL, brand asset directory, or raw product spec) and transforms it into a complete, high-energy, **2-to-3 minute (120–180s)** motion graphics video.
>
> **Core Law:** **Perpetual Kinetic Energy.** Every single second is in continuous motion from 00:00 to the final frame. Static screens are prohibited. Every transition is an unbroken handoff where the exit velocity and geometry of one scene become the entry velocity and geometry of the next.

---

## 1. Input Ingestion Protocol (Repo / URL / Asset Scanner)

When fed a new project via repo path, URL, or asset folder, the engine automatically extracts five asset buckets:

```
[ INPUT: Repo / Live URL / Asset Folder ]
   │
   ├── ① Visual DNA ────► Dominant & accent hex colors, font pairings, logos (SVG), dark/light canvas mode
   ├── ② Narrative Core ─► Tagline, the "villain" (user pain point), the "superpower" (solution), CTA
   ├── ③ Live Proof ─────► UI screenshots, product recordings, 3D models, code snippets, git stats, metrics
   ├── ④ Feature Pillars ─► 3 to 5 core functional capabilities ranked by visual impact
   └── ⑤ Audio Persona ──► BPM selection (120–128 hype vs. 95–105 prestige), voice tone & timbre
```

### Automated Ingestion Matrix
| Extracted Layer | If Given a Codebase / Repo | If Given a Live URL | If Given Raw Assets / Brief |
|---|---|---|---|
| **Color Tokens** | Scan `tailwind.config`, CSS variables, or theme files | Inspect root CSS styles (`--primary`, `--bg`, DOM styles) | Sample dominant colors from logo & primary imagery |
| **Typography** | Scan `@font-face`, Google Fonts, Next.js font imports | Detect `h1`, `h2`, `body` computed font-families | Match against clean Sans (Inter/Geist) or Serif (Editorial) |
| **Product Proof** | Grep `public/`, `assets/`, Readme images, screenshots | Headless browser capture of hero, dashboard, key UI | Ingest supplied `.png`, `.svg`, `.mp4`, or 3D mockups |
| **Narrative Value** | Extract from `README.md`, package description, landing copy | Scrape Hero headline, feature cards, testimonials | Synthesize value proposition into punchy one-liners |

---

## 2. The Universal Motion Physics & Transition Laws

Synthesized from world-class motion references (Fireworks AI, Conduct, Klivvr), these rules apply across **all** styles and genres:

```
                  THE KINETIC HANDOFF PIPELINE
 ┌──────────────┐     Kinetic Vector     ┌──────────────┐
 │   SCENE A    │ ─────────────────────► │   SCENE B    │
 │ (Exit Move)  │  Push / Morph / Shutter │ (Entry Move) │
 └──────────────┘                        └──────────────┘
        ▲                                       │
        └────────── Continuous Micro-Drift ─────┘
```

### Law 1: The Relay-Race Handoff (Exit = Entry)
* **Never cut to an empty frame or black screen.** 
* **Mechanic A (Push-Through Dive):** Camera zooms rapidly into a UI button, letter counter, or icon until its fill color floods the viewport, seamlessly becoming the background of the incoming scene.
* **Mechanic B (Continuous Element Morph):** An active element never disappears; it transforms. A button collapses into a pill, which lengthens into a progress bar, which curls into an orbit ring.
* **Mechanic C (Sliding Shutter / Blind Cascade):** Parallax horizontal or vertical bands wipe across the canvas at staggered speeds, wiping out old content while actively drawing the new scene underneath.
* **Mechanic D (Dimensional 2D-to-3D Shift):** A flat 2D layout pitches on the X/Y axes into 3D isometric space, rotating 90° edge-on, swapping texture, and swinging into the next scene.

### Law 2: The Tri-Layer Motion Rule (Zero Dead Time)
Every frame must contain three simultaneous, independent layers of motion:
1. **Macro Motion (Primary):** The camera path, focal element entrance/exit, or major dimensional morph (snappy, high acceleration: 10–18 frames).
2. **Meso Motion (Secondary):** Reactive UI elements (data counters ticking, progress rings filling, connector lines drawing, status badges pulsing).
3. **Micro Motion (Ambient):** Persistent environmental life (subtle 3D gyro drift, floating grid coordinates, particle dust, lighting sweeps, shader ripples).

### Law 3: Easing Curves & Momentum
* **Snappy Modern Tech (Fireworks style):** `cubic-bezier(0.16, 1, 0.3, 1)` or `power4.out`. 
  * *Profile:* Instant burst (0 to 100% in 12 frames), slight elastic overshoot (2–4%), settling into a slow, endless drift.
* **Elastic Consumer / Fintech (Klivvr style):** Spring physics (`mass: 1.0, stiffness: 120, damping: 12`).
  * *Profile:* Bouncy, organic tactile feedback for card pops, device flips, and icon reveals.
* **Editorial Enterprise (Conduct style):** Smooth inertia dampening (`cubic-bezier(0.25, 1, 0.5, 1)`).
  * *Profile:* Continuous sliding bands with deliberate momentum that never hit a hard stop.

---

## 3. Audio & Voiceover Engine (Beat-Sync Architecture)

### Universal Timing Grid (Based on 124 BPM)
* **1 Beat** = `0.484s` (~14.5 frames at 30fps / ~29 frames at 60fps)
* **1 Bar (4 Beats)** = `1.935s` (~58 frames at 30fps)
* **Standard Video Length:** 2.5 minutes = **78 musical bars** (150 seconds).

```
Beat 1 (Downbeat):   [MAJOR IMPACT] -> Scene transform / Camera zoom / Hero headline slam
Beat 2 (Backbeat):   [TACTILE HIT]  -> UI card pop / Secondary badge snap / Click SFX
Beat 3:              [CONTINUATION] -> Data counter starts roll / Connector lines draw
Beat 4 (Backbeat):   [ACCENT HIT]   -> Micro-burst / Particle pulse / Preparation for transition
```

### Voiceover (VO) Cadence & Sidechain Protocol
1. **The 3-Beat Breath:** VO statements are written in concise, punchy clauses (maximum 8–12 words per sentence).
2. **Audio Ducking:**
   * When VO is speaking: Music ducks by **-10dB** (high-frequency shelf drops -2dB to prioritize vocal clarity).
   * In gaps between VO clauses (0.8s to 1.5s): Music sidechain releases instantly to **0dB**, allowing the drums, bassline, and visual kinetic bursts to command full attention.
3. **SFX Choreography:** Every graphic event must have a dedicated audio asset:
   * *Card pops:* Tactile mechanical clicks, muted thuds.
   * *Transitions:* Whooshes, sub-bass drops, riser sweeps.
   * *Data updates:* Micro digital bleeps, ticker ticks, laser sweeps.

---

## 4. The Universal 5-Act Narrative Architecture (2–3 Minutes)

This structure flexes to fit **any product, repository, or service**:

```
 0:00                     0:25               1:05               1:45               2:15        2:30
  │── ACT 1: THE HOOK ─────│── ACT 2: PROOF ──│── ACT 3: ENGINE ─│── ACT 4: REACH ──│── ACT 5 ──│
  │  Genesis & Problem     │  The Interface    │  Deep Mechanics   │  Scale & Stats   │  The Call │
```

---

### ACT 1: The Genesis & The Problem (0:00 – 0:25)
* **Theme:** Establishing the world, exposing the friction/pain, introducing the brand hero mark.
* **Pacing:** High anticipation building into an explosive beat drop at 0:08–0:10.
* **Visual Action:**
  * Coordinate grid / dark canvas animates. Vector lines sketch the project's core logo mark.
  * **Handoff Transition:** Camera dives straight through the logo into an infinite 3D perspective plane.
* **VO Formula:**
  > *"The way we [current frustrating industry process] is broken. Slow. Fragmented. Until now. Introducing [Project Name]: the [one-sentence core superpower]."*

---

### ACT 2: The Interface & Tangible Proof (0:25 – 1:05)
* **Theme:** Putting the real product front and center. Showing, not just telling.
* **Pacing:** Upbeat, rhythmic, synchronized card pops on 1/4 note beats.
* **Visual Action:**
  * 3D device mockup (mobile or desktop monitor) rises with spring physics.
  * Screen comes alive with real UI captures from the repo/URL.
  * Floating glassmorphic cards detach in 3D parallax layers highlighting the top 3 features.
  * **Handoff Transition:** The primary UI card scales up, flattens to 2D, and unfolds into stepped pipeline bars.
* **VO Formula:**
  > *"Designed from the ground up for [target user]. With [Feature 1], everything happens in real time. [Feature 2] eliminates the friction, while [Feature 3] puts total control in your hands."*

---

### ACT 3: The Engine & Deep Mechanics (1:05 – 1:45)
* **Theme:** Unveiling what's under the hood—architecture, speed, intelligence, technical superiority.
* **Pacing:** Driving, relentless momentum with complex secondary animations.
* **Visual Action:**
  * Stepped horizontal pipeline bars (Conduct style) with animated pulsing connector lines.
  * Live data counters rolling upward at high speed.
  * System architecture diagram or workflow visual assembling in kinetic sync.
  * **Handoff Transition:** Pipeline collapses horizontally into a compact pill, which rotates and blooms into a concentric circular orbit.

* **VO Formula:**
  > *"Behind the simplicity lies relentless power. An architecture built for [speed/scale/security]. Zero overhead, seamless integration, and performance that scales effortlessly as your demands grow."*

---

### ACT 4: Scale, Ecosystem & Social Proof (1:45 – 2:15)
* **Theme:** Trust, metrics, community, enterprise compatibility, or integrations.
* **Pacing:** Majestic, high-energy crescendo with wide-angle camera perspectives.
* **Visual Action:**
  * Concentric orbital rings (Fireworks style) spinning with partner, tool, or integration logos.
  * High-impact metric typography slamming onto screen (`10x Faster`, `99.9% Uptime`, `100% Onchain`).
  * Mosaic grid or ticker cascade showing live activity, commits, or community traction.
  * **Handoff Transition:** The entire constellation compresses into a centered 3D prism that flips gracefully into the final scene.
* **VO Formula:**
  > *"Trusted across the entire ecosystem. Seamlessly connected with the tools you already rely on. Validated by [key metric / benchmark / community milestone]."*

---

### ACT 5: The Climax & Unstoppable Call to Action (2:15 – 2:30)
* **Theme:** The memorable resolve, final emotional punch, and clear user action.
* **Pacing:** Triumphant sustained chords, high-contrast typography, final resonant sub-bass thud.
* **Visual Action:**
  * 3D devices and feature cards pull back in a dynamic multi-frame layout.
  * Central logo mark re-forms with ambient radiant bloom.
  * Clean, prominent URL / GitHub link / CTA button with pulsing glow indicator.
* **VO Formula:**
  > *"The future of [industry/domain] is here. Don't get left behind. [Call to Action verb: Build / Join / Start] with [Project Name] today."*

---

## 5. Multi-Platform Generation Pipelines

This framework outputs production-ready assets across any preferred tech stack:

### Pipeline A: Programmable React Video (Remotion)
For generating pixel-perfect, code-driven motion graphics directly from repository data:

```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const UniversalSceneTransition = ({ children, incoming }: { children: React.ReactNode, incoming: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy Exponential Easing (Fireworks Style)
  const exitProgress = spring({
    frame: frame - 60, // Starts at frame 60
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 120 },
  });

  // Scale-Dive Handoff: Scene A scales up & blurs out while Scene B takes over
  const scaleOut = interpolate(exitProgress, [0, 1], [1, 2.5]);
  const opacityOut = interpolate(exitProgress, [0, 0.8, 1], [1, 0.2, 0]);
  const scaleIn = interpolate(exitProgress, [0, 1], [0.6, 1]);

  return (
    <AbsoluteFill className="bg-black overflow-hidden">
      {/* Exiting Scene */}
      <AbsoluteFill style={{ transform: `scale(${scaleOut})`, opacity: opacityOut }}>
        {children}
      </AbsoluteFill>
      
      {/* Incoming Scene inheriting the momentum */}
      <AbsoluteFill style={{ transform: `scale(${scaleIn})`, opacity: exitProgress }}>
        {incoming}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

### Pipeline B: Generative AI Video Prompts (Runway Gen-3 / Sora / Kling)
To generate hyper-realistic motion graphics clips using generative AI tools, use this structured prompt formula:

```text
[SCENE DURATION: 5-8s] [STYLE: High-end tech commercial motion graphics, 8k resolution, octane render]
[CAMERA PATH: Continuous seamless camera movement, starting with a rapid push-through zoom into {Focal Element A}, smoothly accelerating without cutting, matching momentum into {Focal Element B}]
[LIGHTING & COLOR: Dominant {Primary Hex}, deep obsidian dark background, volumetric rim lighting, micro-grid coordinate overlays]
[MOTION DYNAMICS: Kinetic typography snapping into place with power4.out deceleration, zero static frames, continuous floating ambient particle drift, hyper-clean edges]
```

### Pipeline C: After Effects / Motion Designer Expression Rig
Apply this expression to any 3D Camera or Null Controller to enforce **Law 2 (Persistent Micro-Motion)**:

```javascript
// Continuous Ambient Camera Float (Guarantees Zero Dead Air)
var speed = 1.2;
var amplitude = 12;
var x = Math.sin(time * speed) * amplitude;
var y = Math.cos(time * speed * 0.8) * (amplitude * 0.7);
var z = time * 25; // Constant forward travel
value + [x, y, z];
```

---

## 6. How to Execute This Blueprint on ANY New Project

Whenever you have a new project, feed it to the agent or pipeline using this standard prompt:

```text
"Execute motion.md for this project:
- Repository / URL: [Insert Link or Path]
- Target Duration: [2 or 3 Minutes]
- Audio Vibe: [Hype 126 BPM Electronic / Prestige 98 BPM Chill / Cinematic Orchestral]
- Key Assets Included: [List screenshots, logos, SVGs, or models]

Follow all motion.md rules:
1. Guarantee continuous motion (zero dead air).
2. Execute seamless kinetic handoff transitions between every act.
3. Output the exact timecoded VO script, audio cues, screen visuals, and implementation code."
```
