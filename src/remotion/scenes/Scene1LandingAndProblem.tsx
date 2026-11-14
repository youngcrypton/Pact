import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { commonBackgroundStyle } from '../styles.js';
import { Header } from '../components/Header.js';
import { LandingHero } from '../components/LandingHero.js';
import { BentoGrid } from '../components/BentoGrid.js';
import { BountyTable } from '../components/BountyTable.js';
import { Cursor } from '../components/Cursor.js';
import { KineticSubtitles } from '../components/KineticSubtitles.js';
import { BountyItem } from '../types.js';

const mockBounties: BountyItem[] = [
  { id: '#B-102', title: 'Documentation Architecture & Tutorials', sponsor: 'pact-core.testnet', discipline: 'Docs', tier: 1, rewardNear: 4.5, status: 'Open' },
  { id: '#B-104', title: 'Rust Contract Audit & Gas Optimization', sponsor: 'aurora-core.testnet', discipline: 'Smart Contract', tier: 2, rewardNear: 15.0, status: 'Open' },
  { id: '#B-108', title: 'Sputnik DAO Treasury Sharding Engine', sponsor: 'sputnik-dao.testnet', discipline: 'Core Protocol', tier: 3, rewardNear: 50.0, status: 'Open' },
];

export const Scene1LandingAndProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Landing Page (0 - 300 frames)
  // Phase 2: Click "Launch Protocol" and transition to App Board (300 - 675 frames)
  const isTransitioned = frame >= 320;

  // Cursor glide to button
  const cursorProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
  });

  const cursorX = isTransitioned
    ? 960
    : interpolate(cursorProgress, [0, 1], [1300, 960]);
  const cursorY = isTransitioned
    ? 500
    : interpolate(cursorProgress, [0, 1], [800, 480]);
  const isClicked = frame >= 280 && frame <= 320;

  // Transition opacity
  const landingOpacity = interpolate(frame, [290, 330], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const appOpacity = interpolate(frame, [310, 350], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dynamic Subtitle text based on speech progress
  let currentSubtitle = 'Decentralized autonomous organizations on NEAR';
  if (frame > 80 && frame <= 155) {
    currentSubtitle = 'face severe voting fatigue.';
  } else if (frame > 155 && frame <= 240) {
    currentSubtitle = 'Routine micro-tasks under 5 NEAR require full council...';
  } else if (frame > 240 && frame <= 390) {
    currentSubtitle = '...multi-sig consensus, proposal bonds, and days of delay.';
  } else if (frame > 390 && frame <= 520) {
    currentSubtitle = 'Even worse: Sputnik DAO purges claim records upon completion,';
  } else if (frame > 520 && frame <= 600) {
    currentSubtitle = 'treating veteran contributors like strangers.';
  } else if (frame > 600) {
    currentSubtitle = 'We built Pactt.';
  }

  return (
    <div style={commonBackgroundStyle}>
      <Header />

      {/* Landing Page Layer */}
      <div
        style={{
          opacity: landingOpacity,
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          display: landingOpacity > 0 ? 'block' : 'none',
        }}
      >
        <LandingHero buttonHovered={frame > 180 && frame < 320} buttonClicked={isClicked} />
      </div>

      {/* Workspace App Board Layer */}
      <div
        style={{
          opacity: appOpacity,
          position: 'absolute',
          top: 84,
          left: 0,
          right: 0,
          padding: '0 48px',
          display: appOpacity > 0 ? 'block' : 'none',
        }}
      >
        <BentoGrid />
        <BountyTable bounties={mockBounties} />
      </div>

      {/* Simulated Cursor */}
      {!isTransitioned && <Cursor x={cursorX} y={cursorY} isClicked={isClicked} />}

      {/* Kinetic Subtitles */}
      <KineticSubtitles
        tag="THE PROBLEM"
        subtitle={currentSubtitle}
      />
    </div>
  );
};

