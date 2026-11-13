import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Navbar } from '../components/Navbar.js';
import { Cursor } from '../components/Cursor.js';
import { Contributor } from '../types.js';

const mockContributors: Contributor[] = [
  {
    rank: 1,
    accountId: 'alex.testnet',
    trustScore: 175.5,
    completed: 7,
    role: 'Full-Stack Dev',
    earned: '35.7 NEAR',
    tier: 'Tier 1 (Instant)',
    badge: 'Verified Gold ↗',
  },
  {
    rank: 2,
    accountId: 'chen.testnet',
    trustScore: 165.5,
    completed: 5,
    role: 'Security Auditor',
    earned: '19.5 NEAR',
    tier: 'Tier 1 (Instant)',
    badge: 'Verified Gold ↗',
  },
  {
    rank: 3,
    accountId: 'sarah.testnet',
    trustScore: 48.0,
    completed: 3,
    role: 'UI/UX Designer',
    earned: '12.0 NEAR',
    tier: 'Tier 2 (Council)',
    badge: 'Verified Silver ↗',
  },
  {
    rank: 4,
    accountId: 'maria.testnet',
    trustScore: 24.0,
    completed: 2,
    role: 'Community Lead',
    earned: '8.0 NEAR',
    tier: 'Tier 2 (Council)',
    badge: 'Verified Bronze ↗',
  },
  {
    rank: 5,
    accountId: 'newuser.testnet',
    trustScore: 0.0,
    completed: 0,
    role: 'New Contributor',
    earned: '0.0 NEAR',
    tier: 'Tier 3 (DAO)',
    badge: 'New Contributor ↗',
  },
];

export const Scene4NearSocial: React.FC = () => {
  const frame = useCurrentFrame();

  const cursorX = interpolate(frame, [0, 200, 400], [500, 1400, 1550], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [0, 200, 400], [400, 520, 680], {
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
      <Navbar activePersona="alex.testnet" activePersonaScore={175.5} activeNavTab="trust" />

      <div style={{ padding: '36px 64px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        {/* Hero Banner explaining NEAR Social & NearBlocks */}
        <div
          style={{
            backgroundColor: '#020617',
            borderRadius: '24px',
            padding: '32px 40px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '999px',
                padding: '6px 14px',
                color: '#818cf8',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366f1' }} />
              PORTABLE ON-CHAIN REPUTATION · NEAR SOCIAL (v1.social08.testnet)
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Soulbound Proofs Outlive Any Single DAO.
            </h1>
            <p style={{ fontSize: '15px', color: '#e2e8f0', margin: 0, maxWidth: '850px' }}>
              Unlike Sputnik DAO which erases claim history upon disbursement, Pactt writes verifiable reputation directly to NEAR Social. Contributors carry their trust everywhere across Web3.
            </p>
          </div>

          {/* NearBlocks live explorer badge */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '20px 24px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              NEAR Explorer Proof
            </div>
            <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700, margin: '4px 0' }}>
              ExWvUsgiL5yb...J8 ↗
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
              ✓ Confirmed on NEAR Testnet
            </div>
          </div>
        </div>

        {/* Trust Registry Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px 28px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#020617', margin: '0 0 4px 0' }}>
                DAO Contributor Trust Registry
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Algorithmic trust tiers computed from on-chain delivery history, dispute-free longevity, and completed bounties.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '6px 12px', borderRadius: '999px' }}>
                7 Verified Contributors
              </span>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 14px' }}>Rank</th>
                <th style={{ padding: '12px 14px' }}>Contributor</th>
                <th style={{ padding: '12px 14px' }}>Trust Score</th>
                <th style={{ padding: '12px 14px' }}>Completed</th>
                <th style={{ padding: '12px 14px' }}>Role</th>
                <th style={{ padding: '12px 14px' }}>Earned</th>
                <th style={{ padding: '12px 14px' }}>Tier</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Social Badge</th>
              </tr>
            </thead>
            <tbody>
              {mockContributors.map((c) => {
                const isAlex = c.accountId === 'alex.testnet';
                return (
                  <tr
                    key={c.accountId}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      backgroundColor: isAlex ? '#f0fdf4' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '14px', fontWeight: 700, color: '#64748b' }}>{c.rank}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                        {c.accountId}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ fontWeight: 800, color: isAlex ? '#059669' : '#020617', fontSize: '15px' }}>
                        {c.trustScore.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>{c.completed}</td>
                    <td style={{ padding: '14px', color: '#475569', fontWeight: 500 }}>{c.role}</td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#020617' }}>{c.earned}</td>
                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: c.tier.includes('Tier 1') ? '#ecfdf5' : c.tier.includes('Tier 2') ? '#fef3c7' : '#f1f5f9',
                          color: c.tier.includes('Tier 1') ? '#065f46' : c.tier.includes('Tier 2') ? '#92400e' : '#475569',
                          padding: '4px 10px',
                          borderRadius: '999px',
                        }}
                      >
                        {c.tier}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: '#fef3c7',
                          color: '#b45309',
                          border: '1px solid #fde68a',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          display: 'inline-block',
                        }}
                      >
                        {c.badge}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Cursor x={cursorX} y={cursorY} />
    </div>
  );
};
