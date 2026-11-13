import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Navbar } from '../components/Navbar.js';
import { HeroBento } from '../components/HeroBento.js';
import { MetricCards } from '../components/MetricCards.js';
import { BountyTable } from '../components/BountyTable.js';
import { Cursor } from '../components/Cursor.js';
import { BountyItem } from '../types.js';

const mockBounties: BountyItem[] = [
  {
    id: '#B-103',
    title: 'Update Documentation Typo & Readme Links',
    category: 'Documentation',
    payoutNear: 2.0,
    tier: 1,
    tierLabel: 'Tier 1 (Instant)',
    status: 'Open',
    tags: ['docs', 'markdown'],
  },
  {
    id: '#B-102',
    title: 'Refactor Indexer Query Pipeline for Low-Latency SSE',
    category: 'Core Dev',
    payoutNear: 4.5,
    tier: 1,
    tierLabel: 'Tier 1 (Instant)',
    status: 'Open',
    tags: ['rust', 'near-lake'],
  },
  {
    id: '#B-101',
    title: 'SputnikDAO Governance Fast-Track Proposal UI',
    category: 'Frontend',
    payoutNear: 12.0,
    tier: 2,
    tierLabel: 'Tier 2 (1-Council)',
    status: 'In Review',
    tags: ['react', 'near-api'],
  },
  {
    id: '#B-108',
    title: 'Smart Contract Re-entrancy & Invariant Security Audit',
    category: 'Security',
    payoutNear: 50.0,
    tier: 3,
    tierLabel: 'Tier 3 (Sputnik DAO)',
    status: 'Open',
    tags: ['audit', 'rust'],
  },
];

export const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle cursor glide showing the problem
  const cursorX = interpolate(frame, [0, 150, 300, 450], [960, 480, 520, 680], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [0, 150, 300, 450], [300, 620, 650, 720], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Problem Alert Banner pops in at frame 90
  const alertOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const alertScale = interpolate(frame, [90, 120], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
      {/* Light Mode Header */}
      <Navbar activePersona="alex.testnet" activePersonaScore={142.5} activeNavTab="bounties" />

      {/* Main Content Area */}
      <div style={{ padding: '36px 64px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        {/* Stark Inverted Hero Card */}
        <HeroBento
          headline="Instant DAO Bounties. Zero Voter Fatigue."
          subtext="Standard Sputnik DAOs force every 2 NEAR micro-task through 5-person council votes and multi-day delays. Even worse, claim history is wiped upon completion, treating experienced contributors like strangers."
          problemTag="THE DAO FRICTION PROBLEM"
          problemHighlight={frame > 90}
        />

        {/* Metrics Bar */}
        <MetricCards escrowNear={103.5} disbursedNear={49.5} latencySec="< 4.2s" reputationCount={48} />

        {/* Bounties Table */}
        <BountyTable bounties={mockBounties} highlightId={frame > 90 ? '#B-103' : undefined} />
      </div>

      {/* Visual Overlay: The Voter Fatigue Trap Callout */}
      {frame >= 90 && (
        <div
          style={{
            position: 'absolute',
            top: '380px',
            right: '80px',
            width: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: '2px solid #ef4444',
            boxShadow: '0 20px 50px -10px rgba(239, 68, 68, 0.3)',
            padding: '24px',
            opacity: alertOpacity,
            transform: `scale(${alertScale})`,
            zIndex: 4000,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
            <span>⚠️</span>
            <span>Voter Fatigue Trap</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#020617', margin: '8px 0' }}>
            3 Days Waiting for a 2 NEAR Task
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
            Without Pactt, routine micro-tasks require full council consensus, proposal bonds, and manual multi-sig signatures, stalling community momentum.
          </div>
        </div>
      )}

      {/* Mouse Cursor */}
      <Cursor x={cursorX} y={cursorY} />
    </div>
  );
};
