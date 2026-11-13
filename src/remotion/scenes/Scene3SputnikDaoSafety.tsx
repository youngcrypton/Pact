import React from 'react';
import { useCurrentFrame } from 'remotion';
import { commonBackgroundStyle } from '../styles.js';
import { Header } from '../components/Header.js';
import { SputnikQuorumCard } from '../components/SputnikQuorumCard.js';
import { KineticSubtitles } from '../components/KineticSubtitles.js';

export const Scene3SputnikDaoSafety: React.FC = () => {
  const frame = useCurrentFrame();

  let currentSubtitle = 'Custody never leaves the DAO. When a newcomer submits work or the reward exceeds 25 NEAR, Pactt automatically routes to Sputnik DAO v2.';
  if (frame > 260) {
    currentSubtitle = 'The council quorum ledger tracks real-time M-of-N multi-sig voting, safeguarding community treasury funds with full on-chain consensus.';
  }

  return (
    <div style={commonBackgroundStyle}>
      <Header
        connectedAccount="newuser.testnet"
        trustScore={0}
        tier="Tier 3"
      />

      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          padding: '0 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 800 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: "'Space Grotesk', monospace",
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#020617',
              background: '#f1f5f9',
              border: '1px solid rgba(0, 0, 0, 0.15)',
              padding: '4px 12px',
              borderRadius: 20,
              marginBottom: 10,
            }}
          >
            TIER 3 ESCALATION · HIGH CAPITAL GOVERNANCE
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#020617', margin: 0 }}>
            Automated Escalation to Sputnik DAO Multi-Sig
          </h2>
          <p style={{ fontSize: 15, color: '#334155', marginTop: 8 }}>
            Tasks exceeding 25 NEAR or submitted by unvetted contributors are guarded by council quorum.
          </p>
        </div>

        <SputnikQuorumCard
          proposalId="#412"
          bountyId="#B-108"
          amount={50.0}
          quorumVotes={2}
          totalCouncil={3}
        />
      </div>

      <KineticSubtitles
        tag="SPUTNIK DAO ESCROW · TIER 3"
        subtitle={currentSubtitle}
      />
    </div>
  );
};

