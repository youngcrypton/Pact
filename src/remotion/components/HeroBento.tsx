import React from 'react';

interface HeroBentoProps {
  headline?: string;
  subtext?: string;
  problemTag?: string;
  problemHighlight?: boolean;
}

export const HeroBento: React.FC<HeroBentoProps> = ({
  headline = 'Earned trust eliminates 80% of DAO voting friction.',
  subtext = 'Pactt dynamically coordinates escrow custody across Sputnik DAOs. Micro-tasks settle autonomously in < 4.2 seconds upon verified deliverable proofs, reserving multi-sig votes strictly for high-capital allocations.',
  problemTag,
  problemHighlight = false,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#020617',
        borderRadius: '24px',
        padding: '36px 44px',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        border: problemHighlight
          ? '2px solid #ef4444'
          : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: problemHighlight
          ? '0 0 30px rgba(239, 68, 68, 0.25), 0 20px 40px -15px rgba(0, 0, 0, 0.4)'
          : '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Background subtle mesh glow */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: problemHighlight
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Tag Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: problemHighlight ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)',
            border: problemHighlight ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '999px',
            padding: '6px 14px',
            color: problemHighlight ? '#f87171' : '#34d399',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: problemHighlight ? '#ef4444' : '#10b981',
            }}
          />
          {problemTag || 'SPUTNIK DAO ACCELERATION · TRACK 12'}
        </div>

        {/* Contract Tags */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>
          <span>Contract: <strong style={{ color: '#f8fafc' }}>pact-dao-064783.testnet</strong></span>
          <span>·</span>
          <span>Sputnik: <strong style={{ color: '#f8fafc' }}>pactt.sputnik-dao.testnet</strong></span>
        </div>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontSize: '36px',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          marginBottom: '14px',
          maxWidth: '920px',
        }}
      >
        {headline}
      </h1>

      {/* Subtext with radiant high-contrast silver */}
      <p
        style={{
          fontSize: '17px',
          lineHeight: 1.55,
          color: '#e2e8f0',
          maxWidth: '960px',
          margin: 0,
          fontWeight: 400,
        }}
      >
        {subtext}
      </p>

      {/* Action Pills */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <div
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            color: '#020617',
            fontWeight: 700,
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Inspect Bounties ↗
        </div>
        <div
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          On-Chain Vault ↗
        </div>
      </div>
    </div>
  );
};
