import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Navbar } from '../components/Navbar.js';
import { HeroBento } from '../components/HeroBento.js';
import { MetricCards } from '../components/MetricCards.js';
import { BountyTable } from '../components/BountyTable.js';
import { Drawer } from '../components/Drawer.js';
import { Cursor } from '../components/Cursor.js';
import { BountyItem } from '../types.js';

export const Scene3DaoSafety: React.FC = () => {
  const frame = useCurrentFrame();

  const bounty108: BountyItem = {
    id: '#B-108',
    title: 'Smart Contract Re-entrancy & Invariant Security Audit',
    category: 'Security',
    payoutNear: 50.0,
    tier: 3,
    tierLabel: 'Tier 3 (Sputnik DAO)',
    status: frame >= 240 ? 'In Review' : 'Open',
    tags: ['audit', 'rust'],
  };

  const bounties: BountyItem[] = [
    bounty108,
    {
      id: '#B-102',
      title: 'Refactor Indexer Query Pipeline for Low-Latency SSE',
      category: 'Core Dev',
      payoutNear: 4.5,
      tier: 1,
      tierLabel: 'Tier 1 (Instant)',
      status: 'Paid Out',
      tags: ['rust'],
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
      id: '#B-105',
      title: 'FastAuth Social Login & Keypom Onboarding Integration',
      category: 'Identity',
      payoutNear: 8.0,
      tier: 2,
      tierLabel: 'Tier 2 (1-Council)',
      status: 'Open',
      tags: ['fastauth'],
    },
  ];

  const isDrawerOpen = frame >= 60;
  const isDaoForwarded = frame >= 180;

  // Cursor movement
  const cursorX = interpolate(frame, [0, 60, 180, 360], [400, 1780, 1620, 1500], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [0, 60, 180, 360], [300, 715, 980, 800], {
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
      <Navbar activePersona="newuser.testnet" activePersonaScore={0.0} activeNavTab="bounties" />

      <div style={{ padding: '36px 64px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        <HeroBento
          headline="Treasury Custody Never Leaves Sputnik DAO."
          subtext="When a newcomer claims a task or rewards exceed 25 NEAR, Pactt's algorithmic routing bridges directly to Sputnik DAO v2 council consensus. 24-hour velocity caps and dispute slashing ensure zero treasury drain."
          problemTag="TIER 3 SAFETY · SPUTNIK DAO MULTI-SIG"
        />

        <MetricCards escrowNear={99.0} disbursedNear={54.0} latencySec="Multi-Sig" reputationCount={49} />

        <BountyTable bounties={bounties} highlightId="#B-108" onClaimLabel="Inspect & Claim" />
      </div>

      <Drawer
        bounty={bounty108}
        isOpen={isDrawerOpen}
        contributorId="newuser.testnet"
        contributorScore={0.0}
        stage={isDaoForwarded ? 'dao_forwarded' : 'input'}
        proofUrl="https://github.com/youngcrypton/Pactt/security/audit-report.pdf"
      />

      <Cursor x={cursorX} y={cursorY} />
    </div>
  );
};
