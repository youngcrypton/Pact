import React from 'react';
import { useCurrentFrame } from 'remotion';
import { commonBackgroundStyle, BRAND } from '../styles.js';
import { Header } from '../components/Header.js';
import { KineticSubtitles } from '../components/KineticSubtitles.js';

export const Scene4NearRoleAndSocialDB: React.FC = () => {
  const frame = useCurrentFrame();

  let currentSubtitle = 'Pactt protects treasuries with rolling 24-hour velocity caps and council dispute slashing.';
  if (frame > 220) {
    currentSubtitle = 'Completed work is permanently written to NEAR Social on v1.social08.testnet as a portable, soulbound Web3 credential.';
  }

  return (
    <div style={commonBackgroundStyle}>
      <Header
        connectedAccount="alex.testnet"
        trustScore={175.5}
        tier="Tier 1"
      />

      <div
        style={{
          position: 'absolute',
          top: 110,
          left: 0,
          right: 0,
          padding: '0 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 840 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: BRAND.fontMono,
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#059669',
              background: BRAND.tier1Bg,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '4px 12px',
              borderRadius: 20,
              marginBottom: 10,
            }}
          >
            NEAR ON-CHAIN TELEMETRY & SOULBOUND CREDENTIALS
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#020617', margin: 0 }}>
            Cryptographic Verification on NEAR Protocol
          </h2>
        </div>

        {/* 2-Column Telemetry Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', maxWidth: 1080 }}>
          {/* Card 1: 24h Velocity Cap & Dispute Window */}
          <div
            style={{
              background: '#ffffff',
              border: `1px solid ${BRAND.border}`,
              borderRadius: 14,
              padding: 24,
              boxShadow: BRAND.cardShadow,
            }}
          >
            <div style={{ fontSize: 11, fontFamily: BRAND.fontMono, color: BRAND.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
              TREASURY PROTECTION ENGINE
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#020617', marginBottom: 12 }}>
              Rolling 24-Hour Velocity Cap
            </h3>
            <p style={{ fontSize: 13.5, color: BRAND.textSecondary, lineHeight: 1.55, marginBottom: 16 }}>
              Restricts automatic capital outflows per rolling 24-hour window. If an account attempts to drain treasury funds, Pactt automatically halts execution and escalates to Sputnik DAO multi-sig review.
            </p>

            <div style={{ background: '#f8fafc', border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontFamily: BRAND.fontMono, fontWeight: 700, marginBottom: 6 }}>
                <span>Tier 1 Velocity Cap: 10.0 NEAR / 24h</span>
                <span style={{ color: '#059669' }}>4.5 / 10.0 Used (Healthy)</span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: '#059669' }} />
              </div>
            </div>
          </div>

          {/* Card 2: SocialDB Badge Verification */}
          <div
            style={{
              background: '#ffffff',
              border: `1px solid ${BRAND.border}`,
              borderRadius: 14,
              padding: 24,
              boxShadow: BRAND.cardShadow,
            }}
          >
            <div style={{ fontSize: 11, fontFamily: BRAND.fontMono, color: BRAND.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
              NEAR SOCIAL SOULBOUND REPUTATION
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#020617', marginBottom: 12 }}>
              Permanent Credential Minting
            </h3>
            <p style={{ fontSize: 13.5, color: BRAND.textSecondary, lineHeight: 1.55, marginBottom: 14 }}>
              Unlike vanilla Sputnik DAOs that delete completed claim history, Pactt writes earned trust directly to NEAR SocialDB contract (<code style={{ fontFamily: BRAND.fontMono, color: '#059669' }}>v1.social08.testnet</code>).
            </p>

            <div style={{ background: '#020617', borderRadius: 8, padding: 12, color: '#ffffff', fontFamily: BRAND.fontMono, fontSize: 11, lineHeight: 1.5 }}>
              <div>Contract: <span style={{ color: '#34d399' }}>pact-dao-064783.testnet</span></div>
              <div>SocialDB: <span style={{ color: '#34d399' }}>v1.social08.testnet</span></div>
              <div style={{ color: '#94a3b8', marginTop: 4 }}>Tx: ExWvUsgiL5yb6Wwr7NuxAn637oufojuu7XkCWuAjFaJ8</div>
            </div>
          </div>
        </div>
      </div>

      <KineticSubtitles
        tag="NEAR INTEGRATION · SOCIALDB"
        subtitle={currentSubtitle}
      />
    </div>
  );
};

