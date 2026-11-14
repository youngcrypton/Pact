import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { commonBackgroundStyle } from '../styles.js';
import { Header } from '../components/Header.js';
import { BentoGrid } from '../components/BentoGrid.js';
import { BountyTable } from '../components/BountyTable.js';
import { TaskDrawer } from '../components/TaskDrawer.js';
import { Cursor } from '../components/Cursor.js';
import { KineticSubtitles } from '../components/KineticSubtitles.js';
import { BountyItem } from '../types.js';

const mockBounties: BountyItem[] = [
  { id: '#B-102', title: 'Documentation Architecture & Tutorials', sponsor: 'pact-core.testnet', discipline: 'Docs', tier: 1, rewardNear: 4.5, status: 'Claimed' },
  { id: '#B-104', title: 'Rust Contract Audit & Gas Optimization', sponsor: 'aurora-core.testnet', discipline: 'Smart Contract', tier: 2, rewardNear: 15.0, status: 'Open' },
  { id: '#B-108', title: 'Sputnik DAO Treasury Sharding Engine', sponsor: 'sputnik-dao.testnet', discipline: 'Core Protocol', tier: 3, rewardNear: 50.0, status: 'Open' },
];

export const Scene2InstantAutoPayout: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Click "Inspect & Claim" on Bounty #B-102 (frames 0 - 120)
  // Phase 2: Drawer opens, deliverable is inspected (frames 120 - 320)
  // Phase 3: Submit for Settlement clicked, 4.2s auto payout (frames 320 - 585)

  const isDrawerOpen = frame >= 80;
  const isSubmitting = frame >= 280 && frame < 360;
  const isPaidOut = frame >= 360;

  // Drawer slide animation
  const drawerSlide = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Cursor motion
  const cursorProgress = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 90, mass: 1 },
  });

  let cursorX = 1450;
  let cursorY = 620;
  let isClicked = false;

  if (frame < 120) {
    cursorX = interpolate(cursorProgress, [0, 1], [1200, 1450]);
    cursorY = interpolate(cursorProgress, [0, 1], [700, 620]);
    isClicked = frame >= 65 && frame <= 95;
  } else if (frame >= 120 && frame < 320) {
    // Cursor glides to submit button inside drawer
    cursorX = interpolate(frame, [180, 260], [1450, 1630], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    cursorY = interpolate(frame, [180, 260], [620, 850], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    isClicked = frame >= 270 && frame <= 295;
  } else {
    cursorX = 1630;
    cursorY = 850;
  }

  // Update bounty status if paid out
  const updatedBounties = mockBounties.map((b) =>
    b.id === '#B-102' && isPaidOut ? { ...b, status: 'Paid Out' } : b
  );

  let currentSubtitle = 'When Alex, a trusted contributor with 142 trust points,';
  if (frame > 125 && frame <= 245) {
    currentSubtitle = 'submits a 4.5 NEAR task, Pactt verifies the deliverable...';
  } else if (frame > 245 && frame <= 365) {
    currentSubtitle = '...and settles the payout instantly in 4.2 seconds.';
  } else if (frame > 365 && frame <= 460) {
    currentSubtitle = '0 council signatures. 0 voting fatigue.';
  } else if (frame > 460) {
    currentSubtitle = 'and Alex earns +33 trust points!';
  }

  return (
    <div style={commonBackgroundStyle}>
      <Header
        connectedAccount="alex.testnet"
        trustScore={isPaidOut ? 175.5 : 142.5}
        tier="Tier 1"
      />

      <div style={{ position: 'absolute', top: 84, left: 0, right: 0, padding: '0 48px' }}>
        <BentoGrid escrowBalance={isPaidOut ? 148.5 : 153.0} />
        <BountyTable bounties={updatedBounties} highlightedId="#B-102" />
      </div>

      {/* Task Drawer */}
      <div
        style={{
          transform: `translateX(${(1 - drawerSlide) * 100}%)`,
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 580,
        }}
      >
        <TaskDrawer
          isOpen={isDrawerOpen}
          bountyId="#B-102"
          reward={4.5}
          contributor="alex.testnet"
          trustScore={142.5}
          deliverableUrl="https://github.com/pactt/core/pull/88"
          dedupChecked={true}
          isSubmitting={isSubmitting}
          isPaidOut={isPaidOut}
        />
      </div>

      {/* Cursor */}
      <Cursor x={cursorX} y={cursorY} isClicked={isClicked} />

      {/* Kinetic Subtitles */}
      <KineticSubtitles
        tag="THE MAGIC MOMENT · TIER 1"
        subtitle={currentSubtitle}
      />
    </div>
  );
};

