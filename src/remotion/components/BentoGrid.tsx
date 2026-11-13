import React from 'react';
import { BRAND } from '../styles.js';

interface BentoGridProps {
  escrowBalance?: number;
  autoRatio?: number;
  councilRatio?: number;
  daoRatio?: number;
  reputationCount?: number;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  escrowBalance = 153.0,
  autoRatio = 70,
  councilRatio = 20,
  daoRatio = 10,
  reputationCount = 48,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2.2fr 1fr 1fr',
        gap: 18,
        width: '100%',
        maxWidth: 1540,
        margin: '0 auto 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Bento Hero Card: Always Dark Obsidian Anchor */}
      <div
        style={{
          backgroundColor: '#020617',
          backgroundImage:
            'radial-gradient(circle at 85% 20%, rgba(16, 185, 129, 0.16) 0%, transparent 60%), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 36px 36px, 36px 36px',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: 14,
          padding: 24,
          color: '#ffffff',
          boxShadow: '0 14px 40px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: BRAND.fontMono,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.16)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '3px 10px',
              borderRadius: 20,
              marginBottom: 12,
            }}
          >
            SPUTNIK DAO ACCELERATION
          </div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.25,
              color: '#ffffff',
              marginBottom: 8,
            }}
          >
            Earned trust eliminates 80% of DAO voting friction.
          </h2>
          <p
            style={{
              fontSize: 14,
              color: '#e2e8f0',
              lineHeight: 1.62,
              maxWidth: 720,
            }}
          >
            Pactt dynamically coordinates escrow disbursement across Sputnik DAOs. Micro-tasks
            settle autonomously upon verified deliverable proofs, reserving multi-sig votes
            strictly for high-capital allocations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <div
            style={{
              background: '#ffffff',
              color: '#000000',
              fontSize: 13,
              fontWeight: 700,
              padding: '8px 18px',
              borderRadius: 8,
              boxShadow: '0 2px 10px rgba(255, 255, 255, 0.2)',
            }}
          >
            Inspect Tasks ↗
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              padding: '8px 18px',
              borderRadius: 8,
            }}
          >
            On-Chain Vault ↗
          </div>
        </div>
      </div>

      {/* Capital Velocity & Escrow Card */}
      <div
        style={{
          background: '#ffffff',
          border: `1px solid ${BRAND.border}`,
          borderRadius: 14,
          padding: 22,
          boxShadow: BRAND.cardShadow,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontFamily: BRAND.fontMono,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: BRAND.textMuted,
              fontWeight: 800,
              marginBottom: 6,
            }}
          >
            CAPITAL VELOCITY & ESCROW
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              fontFamily: BRAND.fontMono,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.04em',
              color: '#020617',
              marginBottom: 8,
            }}
          >
            {escrowBalance.toFixed(2)}{' '}
            <span style={{ fontSize: 16, fontWeight: 700, color: BRAND.textSecondary }}>NEAR</span>
          </div>

          {/* 3-Segment Stacked Velocity Bar */}
          <div
            style={{
              width: '100%',
              height: 8,
              background: 'rgba(0, 0, 0, 0.06)',
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              marginBottom: 10,
            }}
          >
            <div style={{ width: `${autoRatio}%`, background: '#059669' }} />
            <div style={{ width: `${councilRatio}%`, background: '#d97706' }} />
            <div style={{ width: `${daoRatio}%`, background: '#64748b' }} />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              fontFamily: BRAND.fontMono,
              color: BRAND.textSecondary,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 2, background: '#059669' }} />
              Auto: {autoRatio}%
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 2, background: '#d97706' }} />
              1-Council: {councilRatio}%
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 2, background: '#64748b' }} />
              Multi-Sig: {daoRatio}%
            </span>
          </div>
        </div>

        <div style={{ fontSize: 12, color: BRAND.textMuted, marginTop: 12 }}>
          Active Vault: <strong>103.5 NEAR</strong> · Disbursed: <strong>49.5 NEAR</strong>
        </div>
      </div>

      {/* NEAR Social Reputation Card */}
      <div
        style={{
          background: '#ffffff',
          border: `1px solid ${BRAND.border}`,
          borderRadius: 14,
          padding: 22,
          boxShadow: BRAND.cardShadow,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontFamily: BRAND.fontMono,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: BRAND.textMuted,
              fontWeight: 800,
              marginBottom: 6,
            }}
          >
            NEAR SOCIAL REPUTATION
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              fontFamily: BRAND.fontMono,
              letterSpacing: '-0.04em',
              color: '#020617',
              marginBottom: 8,
            }}
          >
            {reputationCount} <span style={{ fontSize: 16, fontWeight: 700, color: BRAND.textSecondary }}>Badges</span>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11.5,
              fontFamily: BRAND.fontMono,
              color: '#059669',
              background: BRAND.tier1Bg,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid rgba(16, 185, 129, 0.25)',
              marginBottom: 8,
            }}
          >
            <span>v1.social08.testnet</span>
          </div>
        </div>

        <div style={{ fontSize: 12, color: BRAND.textMuted, lineHeight: 1.4 }}>
          Algorithmic trust credentials soulbound on NEAR SocialDB with permanent verifiable proofs.
        </div>
      </div>
    </div>
  );
};

