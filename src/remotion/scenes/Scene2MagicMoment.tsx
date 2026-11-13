import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Navbar } from '../components/Navbar.js';
import { HeroBento } from '../components/HeroBento.js';
import { MetricCards } from '../components/MetricCards.js';
import { BountyTable } from '../components/BountyTable.js';
import { Drawer } from '../components/Drawer.js';
import { Cursor } from '../components/Cursor.js';
import { BountyItem } from '../types.js';

export const Scene2MagicMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline relative to this scene (0 to 750 frames):
  // 0 - 60: Cursor moves from center to inspect button for #B-102
  // 60 - 80: Click inspect button
  // 80 - 240: Drawer is open, PR deliverable typed and anti-cheat verified
  // 240 - 270: Cursor moves to "Submit for Settlement" and clicks at frame 270
  // 270 - 396: Verification & Settlement in progress (< 4.2 seconds)
  // 396 - 750: Settled! Score increases from 142.5 to 175.5, status becomes "Paid Out"

  const isDrawerOpen = frame >= 80;
  const isClickingInspect = frame >= 60 && frame <= 75;
  const isClickingSubmit = frame >= 265 && frame <= 280;

  let drawerStage: 'input' | 'verifying' | 'settled' | 'dao_forwarded' = 'input';
  if (frame >= 396) {
    drawerStage = 'settled';
  } else if (frame >= 270) {
    drawerStage = 'verifying';
  }

  // Smooth trust score increment from 142.5 to 175.5 starting at frame 396
  const scoreProgress = interpolate(frame, [396, 450], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentScore = 142.5 + scoreProgress * 33.0;

  // Cursor movement path
  let cursorX = 960;
  let cursorY = 540;
  let isClicking = false;

  if (frame < 80) {
    cursorX = interpolate(frame, [0, 60], [960, 1780], { extrapolateRight: 'clamp' });
    cursorY = interpolate(frame, [0, 60], [540, 715], { extrapolateRight: 'clamp' });
    isClicking = isClickingInspect;
  } else if (frame < 280) {
    cursorX = interpolate(frame, [80, 260], [1780, 1620], { extrapolateRight: 'clamp' });
    cursorY = interpolate(frame, [80, 260], [715, 980], { extrapolateRight: 'clamp' });
    isClicking = isClickingSubmit;
  } else {
    cursorX = interpolate(frame, [280, 420], [1620, 1600], { extrapolateRight: 'clamp' });
    cursorY = interpolate(frame, [280, 420], [980, 750], { extrapolateRight: 'clamp' });
  }

  const bounty102: BountyItem = {
    id: '#B-102',
    title: 'Refactor Indexer Query Pipeline for Low-Latency SSE',
    category: 'Core Dev',
    payoutNear: 4.5,
    tier: 1,
    tierLabel: 'Tier 1 (Instant)',
    status: frame >= 396 ? 'Paid Out' : 'Open',
    tags: ['rust', 'near-lake'],
  };

  const bounties: BountyItem[] = [
    bounty102,
    {
      id: '#B-103',
      title: 'Update Documentation Typo & Readme Links',
      category: 'Documentation',
      payoutNear: 2.0,
      tier: 1,
      tierLabel: 'Tier 1 (Instant)',
      status: 'Open',
      tags: ['docs'],
    },
    {
      id: '#B-101',
      title: 'SputnikDAO Governance Fast-Track Proposal UI',
      category: 'Frontend',
      payoutNear: 12.0,
      tier: 2,
      tierLabel: 'Tier 2 (1-Council)',
      status: 'In Review',
      tags: ['react'],
    },
    {
      id: '#B-108',
      title: 'Smart Contract Re-entrancy & Invariant Security Audit',
      category: 'Security',
      payoutNear: 50.0,
      tier: 3,
      tierLabel: 'Tier 3 (Sputnik DAO)',
      status: 'Open',
      tags: ['audit'],
    },
  ];

  return (
    <div
      style={{
        width: '1920px',
        height: '1080px',
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(#e2e8f0 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Navbar with dynamically rising trust score */}
      <Navbar activePersona="alex.testnet" activePersonaScore={currentScore} activeNavTab="bounties" />

      {/* Main Content Area */}
      <div style={{ padding: '36px 64px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        <HeroBento
          headline="Tier 1 Algorithmic Routing: Settled in 4.2 Seconds."
          subtext="When trusted core contributor Alex submits verified work for a 4.5 NEAR task, Pactt verifies deliverable integrity and releases escrow automatically with 0 council votes."
          problemTag="MAGIC MOMENT · INSTANT AUTONOMOUS SETTLEMENT"
        />

        <MetricCards
          escrowNear={frame >= 396 ? 99.0 : 103.5}
          disbursedNear={frame >= 396 ? 54.0 : 49.5}
          latencySec="3.8s"
          reputationCount={frame >= 396 ? 49 : 48}
        />

        <BountyTable bounties={bounties} highlightId="#B-102" onClaimLabel="Inspect & Claim" />
      </div>

      {/* Slide-in Drawer Modal */}
      <Drawer
        bounty={bounty102}
        isOpen={isDrawerOpen}
        contributorId="alex.testnet"
        contributorScore={currentScore}
        stage={drawerStage}
        proofUrl="https://github.com/youngcrypton/Pactt/pull/88"
      />

      {/* Mouse Cursor */}
      <Cursor x={cursorX} y={cursorY} isClicking={isClicking} />
    </div>
  );
};
