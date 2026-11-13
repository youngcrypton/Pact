# Pactt — Official Brand Identity & Design System Kit

> Earned Trust Coordination Layer on NEAR Protocol  
> Track 12: Social · Sputnik DAO Escrow Multi-Sig Governance  
> Version 2.0.0 · Production Architecture Reference

---

## 1. Executive Brand Identity & Name

### 1.1 Brand Name
* **Name**: Pactt
* **Pronunciation**: /pækt/ (pronounced like "pact")
* **Etymology**: Derived from the Latin *pactum* ("covenant", "agreement", "binding protocol") combined with a double "t" representing the **Trust Telemetry** layer. It symbolizes algorithmic covenants backed by mathematical proof rather than subjective human politics.
* **In Code**: `pact-protocol`, `pactt`, `pact_dao`
* **In Prose**: Always capitalized as **Pactt** (never PACTT, pactt, or PactT).

### 1.2 Mission & Core Problem Statement
* **The Problem**: Decentralized autonomous organizations (DAOs) on NEAR suffer from severe governance voting fatigue. Routing routine micro-bounties (< 5 NEAR) through full council multi-sig voting paralyzes velocity, requires council bonds, and creates bureaucratic delays. Furthermore, Sputnik DAO purges completed claim records, meaning proven contributors are treated with the exact same friction as brand-new wallets.
* **The Solution**: Pactt introduces algorithmic trust routing on top of Sputnik DAO v2. Contributor credibility is quantified on-chain through delivered utility (10 base points + 5 points per NEAR escrowed). Routine tasks settle autonomously in 4.2 seconds, while high-capital allocations automatically escalate to Sputnik DAO council multi-sig. Reputation is permanently soulbound to NEAR Social (`v1.social08.testnet`).

### 1.3 Taglines
* **Primary Tagline**: Earned Trust Coordination Layer on NEAR
* **Technical Tagline**: Dynamic Multi-Tier Approvals & Soulbound SocialDB Credentials for Sputnik DAO
* **Marketing Tagline**: Instant DAO Bounties. Zero Voter Fatigue.

### 1.4 Elevator Pitch
Pactt eliminates 80 percent of DAO voting friction by bridging algorithmic trust scores with Sputnik DAO multi-sig escrow on NEAR. When vetted contributors submit verified deliverables, micro-bounties disburse autonomously in 4.2 seconds with zero council voting overhead. High-value allocations automatically escalate to multi-sig consensus, while completed milestones are permanently minted to NEAR Social as portable on-chain credentials.

---

## 2. Brand Mark & Logo Geometry

### 2.1 Visual Metaphor
The Pactt logo combines a monolithic obsidian squircle frame with an architectural vector monogram. The primary glyph "P" forms the foundation, interlocked with a double-T coordination knot. This interlocking geometry represents the unbreakable bond between task deliverables, cryptographic escrow, and earned contributor reputation.

### 2.2 Mark Specifications
* **Squircle Frame Dimensions**: 
  * Desktop Header: 30px x 30px, 8px border-radius
  * Splash Screen: 58px x 58px, 14px border-radius
  * Favicon / App Icon: 32px x 32px / 512px x 512px
* **Clear Space**: A minimum clearance equal to 50% of the logo's width (0.5X) must surround the mark on all sides. No text or competing visual elements may encroach upon this exclusion zone.
* **Minimum Display Size**: 
  * Digital: 20px x 20px
  * Print: 8mm x 8mm

### 2.3 Theme Inversion Matrix

| Element | Cyber Dark Theme | Studio Light Theme |
| :--- | :--- | :--- |
| Squircle Frame Background | `#ffffff` (Pure White) | `#020617` (Deep Obsidian) |
| Glyph Primary Path (`.logo-glyph-main`) | `#000000` (Jet Black) | `#ffffff` (Pure White) |
| Glyph Counter Space (`.logo-glyph-counter`) | `#ffffff` (Pure White) | `#020617` (Deep Obsidian) |
| Ambient Shadow Glow | `0 0 12px rgba(16, 185, 129, 0.20)` | `0 2px 10px rgba(0, 0, 0, 0.15)` |

### 2.4 Official Vector SVG Code

```xml
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Primary Stem and Upper Loop -->
  <path class="logo-glyph-main"
    d="M12 11C12 9.89543 12.8954 9 14 9H25C30.5228 9 35 13.4772 35 19C35 24.5228 30.5228 29 25 29H18V37C18 38.1046 17.1046 39 16 39H14C12.8954 39 12 38.1046 12 37V11Z"
    fill="currentColor" />
  <!-- Inner Counter-Space Cutout -->
  <path class="logo-glyph-counter"
    d="M18 15H25C27.2091 15 29 16.7909 29 19C29 21.2091 27.2091 23 25 23H18V15Z"
    fill="var(--logo-glyph-counter)" />
  <!-- Intersecting Double-T Coordination Knot -->
  <path class="logo-glyph-main"
    d="M28 27H35V29H32V38C32 38.5523 31.5523 39 31 39H29C28.4477 39 28 38.5523 28 38V27Z"
    fill="currentColor" />
  <path class="logo-glyph-main"
    d="M34 27H41V29H38V38C38 38.5523 37.5523 39 37 39H35C34.4477 39 34 38.5523 34 38V27Z"
    fill="currentColor" />
</svg>
```

### 2.5 AI Generation Prompts for Brand Assets

#### Primary App Icon & Favicon (1:1 Ratio)
> A minimalist vector brand icon for a Web3 governance protocol named Pactt. High-contrast obsidian black squircle with subtle curved corners on a pitch-black background. Inside the squircle sits a geometric glyph combining the letter P with a dual-pillar knot, rendered in pure white with surgical neon emerald (#10b981) edge illumination. Sharp architectural lines, premium Swiss graphic design, 8k resolution, vector finish, no 3D bevels, no drop shadows, no text.

#### OpenGraph Social Card (1200 x 630 px)
> Premium Web3 dark-mode product showcase banner for Pactt Protocol. Background is deep obsidian #030406 featuring a subtle 48px grid mesh with radial neon emerald (#10b981) spotlighting. In the center, an elegant bento card display showcasing: 153.00 NEAR Escrow, 4.2s Instant Settlement, and Tier 1 Autonomous Release. Editorial serif typography in Playfair Display stating 'Instant DAO Bounties. Zero Voter Fatigue.' Clean technical tags, cryptographic telemetry, NearBlocks verification stamps, sleek modern UI aesthetics.

---

## 3. Color Palette & Token Architecture

Pactt enforces a high-contrast Cyber-Monochrome and Studio Light design system, accented by a precision Neon Emerald brand glow.

### 3.1 Primary Brand Colors

| Swatch | Token Name | Hex | RGB | HSL | Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Black | Obsidian Abyss | `#030406` | `3, 4, 6` | `220°, 33%, 2%` | Core dark page background |
| Dark | Deep Obsidian | `#020617` | `2, 6, 23` | `229°, 84%, 5%` | Bento hero anchor, light mode text |
| Card | Surface Card Dark | `#0d0e12` | `13, 14, 18` | `228°, 16%, 6%` | Dark mode bento cards & panels |
| White | Pure Snow White | `#ffffff` | `255, 255, 255` | `0°, 0%, 100%` | Dark mode headings, primary buttons |
| Light | Studio Slate 50 | `#f8fafc` | `248, 250, 252` | `210°, 40%, 98%` | Light mode background |
| Emerald | Neon Emerald | `#10b981` | `16, 185, 129` | `160°, 84%, 39%` | Primary accent, Tier 1, success glow |
| Emerald | Mint Light | `#34d399` | `52, 211, 153` | `158°, 64%, 52%` | Dark mode badge text & code highlights |
| Emerald | Deep Pine | `#059669` | `5, 150, 105` | `160°, 94%, 30%` | Light mode emerald text & buttons |

### 3.2 Semantic Tier Routing System

| Tier | Governance Classification | Capital Boundary | Trust Minimum | Primary Color | Background Fill | Border Token |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | Autonomous Escrow Release | $\le$ 5.0 NEAR | 50+ pts | `#10b981` (Emerald) | `rgba(16, 185, 129, 0.08)` | `rgba(16, 185, 129, 0.35)` |
| **Tier 2** | 1-Council Fast-Track | 5.0 – 25.0 NEAR | 20+ pts | `#f59e0b` (Amber) | `rgba(245, 158, 11, 0.08)` | `rgba(245, 158, 11, 0.30)` |
| **Tier 3** | Sputnik DAO Multi-Sig | > 25.0 NEAR | Any / 0 pts | `#f1f5f9` / `#6366f1` | `rgba(255, 255, 255, 0.04)` | `rgba(255, 255, 255, 0.18)` |

### 3.3 SocialDB Soulbound Reputation Badges

| Badge Tier | Qualification Metric | Text Token (Dark) | Text Token (Light) | Border Accent |
| :--- | :--- | :--- | :--- | :--- |
| **Gold Contributor** | Trust Score $\ge$ 100 pts | `#fbbf24` (Gold) | `#ca8a04` (Warm Gold) | `rgba(245, 158, 11, 0.35)` |
| **Silver Contributor** | Trust Score 50 – 99 pts | `#f1f5f9` (Silver) | `#475569` (Slate 600) | `rgba(226, 232, 240, 0.30)` |
| **Bronze Contributor** | Trust Score 10 – 49 pts | `#f59e0b` (Bronze) | `#b45309` (Deep Bronze) | `rgba(217, 119, 6, 0.35)` |

### 3.4 Complete CSS Custom Property Tokens

```css
/* ==========================================================================
   CRYPTON CYBER-MONOCHROME DESIGN SYSTEM (DARK THEME)
   ========================================================================== */
:root {
  /* Surface & Background */
  --bg: #030406;
  --bg-gradient: #030406;
  --surface: #07080a;
  --surface-card: #0d0e12;
  --surface-hover: #14161f;
  --surface-active: #1b1e2a;
  --surface-secondary: #050507;

  /* Ambient Atmospheric Glow & 48px Coordinate Grid */
  --bg-ambient: radial-gradient(circle 900px at 50% -120px, rgba(16, 185, 129, 0.22), transparent 72%),
    radial-gradient(circle 650px at 85% 25%, rgba(16, 185, 129, 0.12), transparent 60%),
    radial-gradient(circle 750px at 15% 45%, rgba(255, 255, 255, 0.035), transparent 65%),
    radial-gradient(ellipse 100% 60% at 50% 100%, rgba(2, 3, 5, 0.98), transparent 85%);
  --bg-pattern: url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 0 C24 14 14 24 0 24 C14 24 24 34 24 48 C24 34 34 24 48 24 C34 24 24 14 24 0 Z' fill='%23ffffff' fill-opacity='0.035'/%3E%3Ccircle cx='24' cy='24' r='1.5' fill='%23ffffff' fill-opacity='0.06'/%3E%3C/svg%3E");

  /* Borders & Dividers */
  --border: rgba(255, 255, 255, 0.14);
  --border-sharp: rgba(255, 255, 255, 0.28);
  --border-subtle: rgba(255, 255, 255, 0.07);
  --border-faint: rgba(255, 255, 255, 0.04);
  --border-blade: rgba(255, 255, 255, 0.40);
  --border-focus: #ffffff;

  /* Typography Colors */
  --text-primary: #ffffff;
  --text-secondary: #f8fafc;
  --text-tertiary: #e2e8f0;
  --text-muted: #cbd5e1;

  /* Bento Hero Anchor (Always Dark Obsidian) */
  --hero-bg: #000000;
  --hero-text: #ffffff;
  --hero-subtext: #f1f5f9;
  --hero-border: rgba(255, 255, 255, 0.22);

  /* Brand Accents */
  --accent: #ffffff;
  --accent-glow: rgba(255, 255, 255, 0.25);
  --emerald-neon: #10b981;
  --emerald-light: #34d399;
  --emerald-dark: #059669;
  --emerald-glow: 0 0 20px rgba(16, 185, 129, 0.25);

  /* Box Shadows */
  --card-shadow: 0 16px 40px rgba(0, 0, 0, 0.85), 0 0 1px rgba(255, 255, 255, 0.12);

  /* Font Families */
  --font-serif: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: 'Space Grotesk', ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

/* ==========================================================================
   HIGH-CONTRAST STUDIO LIGHT THEME
   ========================================================================== */
body.theme-light {
  --bg: #f8fafc;
  --bg-gradient: #f8fafc;
  --surface: #ffffff;
  --surface-card: #ffffff;
  --surface-hover: #f1f5f9;
  --surface-active: #e2e8f0;
  --surface-secondary: #f8fafc;

  --bg-ambient: radial-gradient(circle 800px at 50% -80px, rgba(16, 185, 129, 0.12), transparent 70%),
    radial-gradient(circle 500px at 80% 20%, rgba(5, 150, 105, 0.07), transparent 60%),
    radial-gradient(ellipse 100% 60% at 50% 100%, rgba(241, 245, 249, 0.95), transparent 85%);
  --bg-pattern: url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 0 C24 14 14 24 0 24 C14 24 24 34 24 48 C24 34 34 24 48 24 C34 24 24 14 24 0 Z' fill='%23000000' fill-opacity='0.025'/%3E%3Ccircle cx='24' cy='24' r='1.5' fill='%23000000' fill-opacity='0.04'/%3E%3C/svg%3E");

  --border: rgba(0, 0, 0, 0.12);
  --border-sharp: rgba(0, 0, 0, 0.24);
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-faint: rgba(0, 0, 0, 0.03);
  --border-blade: rgba(0, 0, 0, 0.38);
  --border-focus: #020617;

  --text-primary: #020617;
  --text-secondary: #0f172a;
  --text-tertiary: #334155;
  --text-muted: #475569;

  /* Bento Hero Remains Anchored in Dark Mode for Visual Authority */
  --hero-bg: #020617;
  --hero-text: #ffffff;
  --hero-subtext: #e2e8f0;
  --hero-border: #020617;

  --accent: #020617;
  --accent-glow: rgba(0, 0, 0, 0.15);
  --card-shadow: 0 8px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
}
```

---

## 4. Typography System & Type Scale

Pactt pairs an editorial serif with a high-performance sans-serif interface face, backed by a technical monospace for numbers, balances, and hashes.

### 4.1 Typeface Selection

| Role | Font Family | Source | Loaded Weights | Semantic Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Editorial & Display** | `Playfair Display` | Google Fonts | 500, 600, 700, 800 (Italic & Regular) | Hero headline statements, editorial emphasis |
| **Interface & Body** | `Plus Jakarta Sans` | Google Fonts | 300, 400, 500, 600, 700, 800 | All UI copy, form labels, buttons, drawer text |
| **Telemetry & Mono** | `Space Grotesk` | Google Fonts | 500, 600, 700 (`tabular-nums`) | NEAR balances, contract IDs, badges, telemetry |

### 4.2 Type Scale Hierarchy

| Semantic Level | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `Playfair Display` | 58px / 3.625rem | 34px / 2.125rem | 700 | 1.12 | -0.025em |
| **Display Italic** | `Playfair Display` | 58px / 3.625rem | 34px / 2.125rem | 500 Italic | 1.12 | -0.025em |
| **Section H1** | `Playfair Display` | 34px / 2.125rem | 26px / 1.625rem | 700 | 1.20 | -0.020em |
| **Bento H2** | `Plus Jakarta Sans` | 24px / 1.500rem | 20px / 1.250rem | 900 | 1.25 | -0.040em |
| **Card H3** | `Plus Jakarta Sans` | 16px / 1.000rem | 15px / 0.938rem | 700 | 1.30 | -0.015em |
| **Pitch / Hero Body** | `Plus Jakarta Sans` | 16px / 1.000rem | 14.5px / 0.906rem | 400 | 1.65 | -0.010em |
| **Body Standard** | `Plus Jakarta Sans` | 14px / 0.875rem | 13.5px / 0.844rem | 400 | 1.62 | -0.010em |
| **Table Headings** | `Space Grotesk` | 11.5px / 0.719rem | N/A (Cards) | 800 | 1.20 | +0.080em (Caps) |
| **Telemetry Metric** | `Space Grotesk` | 30px / 1.875rem | 24px / 1.500rem | 900 | 1.10 | -0.040em |
| **Pill / Status Badge** | `Space Grotesk` | 11px / 0.688rem | 10px / 0.625rem | 700 | 1.20 | +0.060em (Caps) |

### 4.3 Typography Rules & Guidelines
1. **Editorial Italic Flourish**: In hero headings, apply the class `.framer-italic` specifically to positive outcome words (e.g., *"Instant DAO Bounties."*, *"Zero Voter Fatigue"*).
2. **Tabular Numerics**: All numeric values relating to NEAR balances, yoctoNEAR, elapsed seconds, percentages, and wallet scores must use `font-variant-numeric: tabular-nums` to ensure exact column alignment.
3. **Contrast Guarantee**: Text in secondary elements (`--text-secondary`, `--text-tertiary`) must never fall below a 4.5:1 WCAG AA contrast ratio against its container background.

---

## 5. Spatial Architecture & Layout Grid

### 5.1 Bento Telemetry Grid
The core application workspace utilizes an asymmetrical Bento Grid:
* **Desktop Grid Specification**: `grid-template-columns: 2.2fr 1fr 1fr; gap: 16px; margin-bottom: 20px;`
* **Card 1 (Left 2.2fr)**: Bento Hero Card. In both light and dark modes, this card retains a dark `#020617` obsidian background with radial green ambient lighting, establishing a visual anchor for the page.
* **Card 2 (Middle 1fr)**: Capital Velocity & Escrow card featuring the 3-segment stacked capacity bar.
* **Card 3 (Right 1fr)**: NEAR Social Reputation card featuring live contributor counts and active verification proofs.
* **Mobile Breakpoint ($\le$ 860px)**: Bento collapses to a single column (`grid-template-columns: 1fr; gap: 12px;`).

### 5.2 Capital Velocity 3-Segment Bar
The capital distribution bar visually communicates risk partitioning across Sputnik DAO:
* **Segment 1 (Auto)**: 70% width, `#10b981` (Neon Emerald) with glow `0 0 8px rgba(16, 185, 129, 0.5)`.
* **Segment 2 (1-Council)**: 20% width, `#f59e0b` (Amber) with glow `0 0 8px rgba(245, 158, 11, 0.4)`.
* **Segment 3 (Sputnik DAO)**: 10% width, `#94a3b8` (Slate 400).
* **Container**: Height `7px`, border-radius `4px`, border `1px solid rgba(255, 255, 255, 0.05)`.

### 5.3 Elevation & Border Radius Scale

```
Radius Scale:
  --radius-xs:  4px   (Tags, micro-pills)
  --radius-sm:  6px   (Code blocks, sub-pills, badges)
  --radius-md:  8px   (Buttons, form inputs, segmented nav)
  --radius-lg:  10px  (Sub-cards, drawer blocks, wallet options)
  --radius-xl:  14px  (Bento cards, modal dialogs, drawer cards)
  --radius-2xl: 20px  (Showcase cards, mobile sheet top edges)
  --radius-full: 9999px (Pills, circular avatars, primary CTAs)
```

---

## 6. Key Components & Micro-Interactions

### 6.1 Masthead Navigation & Header
* **Height**: 58px fixed sticky bar with `backdrop-filter: blur(24px)`.
* **Segmented Navigation**: Four tabs (`Bounties`, `Trust Registry`, `On-Chain Proofs`, `Sputnik DAO Policy`).
* **Active Indicator**: White pill with inverted text on dark mode (`#ffffff` bg, `#000000` text), dark obsidian pill on light mode (`#020617` bg, `#ffffff` text).
* **Live Network Dot**: Pulsing green dot with CSS keyframe animation `emeraldPulse 2s infinite ease-in-out`.

### 6.2 Mobile Staggered 3-Line Hamburger Menu
To match the Framer design reference, mobile devices ($\le$ 860px) feature a custom staggered 3-line menu button:
* **Line 1 (Top)**: Width 16px, height 2px, border-radius 2px.
* **Line 2 (Middle)**: Width 22px, height 2px, border-radius 2px.
* **Line 3 (Bottom)**: Width 14px, height 2px, border-radius 2px.
* **Behavior**: Clicking opens a full slide-out drawer from the right containing direct links to Trust Registry, On-Chain Proofs, and Sputnik DAO Policy.

### 6.3 Slide-Out Task Drawer & Mobile Bottom Sheet
* **Desktop**: Slides in from right, width 580px, height 100vh, box-shadow `-16px 0 48px rgba(0, 0, 0, 0.70)`.
* **Mobile**: Transforms into an iOS-style Bottom Sheet with `border-radius: 20px 20px 0 0`, max-height `85vh`, and a central drag handle (`width: 40px; height: 4px; border-radius: 4px;`).

### 6.4 Sputnik DAO Council Quorum Card
When a bounty falls into Tier 3 (> 25 NEAR), the submission drawer displays the Sputnik DAO Multi-Sig card:
* **Quorum Progress Bar**: Height 8px, rounded 999px. Turns from `#f59e0b` (pending) to `#10b981` (approved).
* **Council Ledger**: Shows each council member (`council-member-1.testnet`, `council-member-2.testnet`, `council-member-3.testnet`) with individual vote status and signed timestamp.

### 6.5 Deduplication Alert System
Pactt verifies submitted deliverable URLs in real time:
* **Unique Submission**: Green badge (`rgba(16, 185, 129, 0.08)` bg, `#10b981` text), confirming zero collision with previous DAO submissions.
* **Collision Detected**: Crimson warning (`rgba(239, 68, 68, 0.08)` bg, `#f87171` text), alerting council that the deliverable has already been compensated on another task.

---

## 7. Voice, Tone & Lexicon

### 7.1 Brand Personality
* **Authoritative & Cryptographic**: Every statement is grounded in smart contracts, yoctoNEAR precision, and cryptographic hashes. We avoid hype and vague buzzwords.
* **Speed with Safety**: We highlight rapid settlement (4.2 seconds) while immediately demonstrating how the Sputnik DAO council dispute window and 24-hour velocity caps safeguard treasury funds.
* **Clean & Professional**: Editorial clarity over noise. High-contrast typography and precise technical nomenclature.

### 7.2 Writing Rules
* **Lead with the User Friction**: Always address the voting bottleneck of DAOs before presenting our technical solution.
* **Concretely Cite NEAR Architecture**: Name specific contracts (`pact-dao-064783.testnet`, `pactt.sputnik-dao.testnet`, `v1.social08.testnet`). Never say simply *"powered by NEAR"*.
* **No Marketing Fluff**: Avoid hyperbolic phrases like *"revolutionary game-changer"* or *"the future of work"*. State the exact metrics: 80% friction eliminated, 4.2-second disbursement.

### 7.3 Vocabulary Lexicon

| Preferred Terminology | Deprecated / Avoided Terms | Strategic Rationale |
| :--- | :--- | :--- |
| **Earned Trust Coordination** | Reputation Gamification | Emphasizes cryptographic utility rather than points or toys |
| **Autonomous Escrow Release** | Instant Payout / Cashout | Conveys smart contract custody and objective rule execution |
| **Sputnik DAO Multi-Sig** | Governance Voting | Accurately references the NEAR Sputnik DAO v2 protocol |
| **Soulbound SocialDB Credential** | NFT Badge | Correctly cites the decentralized storage architecture on NEAR Social |
| **Algorithmic Trust Routing** | AI Decision Making | Distinguishes deterministic smart contract routing from generative AI |
| **Council Dispute Slashing** | Penalties / Bans | Reinforces on-chain economic staking and collateral enforcement |

---

## 8. Asset Inventory & Implementation Checklist

| Asset | File Location / Identifier | Dimensions / Format | Status |
| :--- | :--- | :--- | :--- |
| Vector Monogram SVG | `src/preview/index.html` (lines 3688–3701) | Vector / 48x48 ViewBox | Active |
| Favicon SVG | `src/preview/favicon.svg` | 32x32 Vector SVG | Active |
| Apple Touch Icon | `public/apple-touch-icon.png` | 180x180 PNG | Complete |
| OpenGraph Social Card | `out/scene2-magic-moment.png` | 1920x1080 (16:9) PNG | Active |
| Remotion Demo Video | `out/pactt-demo-light.mp4` | 1920x1080 30fps (90s) | Active |
| Studio Demo Player | `src/preview/demo.html` | Interactive HTML5 Player | Active |
| Production DApp | `https://pactt.terminall.workers.dev/` | Cloudflare Worker / SPA | Live |
| Custom Domain | `https://pactt.xyz/` | Cloudflare / Namecheap DNS | Routing |

