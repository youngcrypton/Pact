import React from 'react';

interface MetricCardsProps {
  escrowNear?: number;
  disbursedNear?: number;
  latencySec?: string;
  reputationCount?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  escrowNear = 103.5,
  disbursedNear = 49.5,
  latencySec = '< 4.2s',
  reputationCount = 48,
}) => {
  const total = escrowNear + disbursedNear;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '20px' }}>
      {/* Escrow Velocity Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px 28px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          CAPITAL VELOCITY & ESCROW
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontSize: '32px', fontWeight: 800, color: '#020617', letterSpacing: '-0.02em' }}>
            {total.toFixed(2)}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748b' }}>NEAR</span>
        </div>

        {/* 3-Color Progress Bar */}
        <div
          style={{
            height: '6px',
            borderRadius: '999px',
            backgroundColor: '#e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            marginBottom: '10px',
          }}
        >
          <div style={{ width: '22%', backgroundColor: '#10b981' }} />
          <div style={{ width: '56%', backgroundColor: '#f59e0b' }} />
          <div style={{ width: '22%', backgroundColor: '#6366f1' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
          <span>Active Escrow: <strong style={{ color: '#0f172a' }}>{escrowNear.toFixed(1)} NEAR</strong></span>
          <span>Disbursed: <strong style={{ color: '#059669' }}>{disbursedNear.toFixed(1)} NEAR</strong></span>
        </div>
      </div>

      {/* Latency Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px 28px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          AUTONOMOUS SETTLEMENT
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '32px', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em' }}>
            {latencySec}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
          Tier 1 micro-bounties settle instantly upon algorithmic proof verification.
        </div>
      </div>

      {/* SocialDB Reputation Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px 28px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          NEAR SOCIAL REPUTATION
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '32px', fontWeight: 800, color: '#6366f1', letterSpacing: '-0.02em' }}>
            {reputationCount}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>SOULBOUND BADGES</span>
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
          Permanent, non-transferable proofs on <code style={{ color: '#0f172a' }}>v1.social08.testnet</code>
        </div>
      </div>
    </div>
  );
};
