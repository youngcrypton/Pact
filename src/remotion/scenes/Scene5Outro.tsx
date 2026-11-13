import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 45], [0.95, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '1920px',
        height: '1080px',
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '1240px',
          backgroundColor: '#ffffff',
          borderRadius: '32px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.1)',
          padding: '64px 72px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {/* Track Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '999px',
            padding: '8px 20px',
            color: '#065f46',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          NEAR HACKATHON 2026 · TRACK 12: SOCIAL & SPUTNIK DAO ESCROW
        </div>

        {/* Brand Icon & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#020617',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '32px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            }}
          >
            P
          </div>
          <span style={{ fontSize: '48px', fontWeight: 900, color: '#020617', letterSpacing: '-0.04em' }}>
            Pactt
          </span>
        </div>

        {/* Punchy Tagline */}
        <h1
          style={{
            fontSize: '38px',
            fontWeight: 800,
            color: '#020617',
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            maxWidth: '900px',
          }}
        >
          Instant DAO Bounties. Zero Voter Fatigue.
        </h1>

        <p
          style={{
            fontSize: '20px',
            color: '#64748b',
            lineHeight: 1.5,
            maxWidth: '820px',
            margin: '0 0 44px 0',
          }}
        >
          Empowering NEAR communities with 4.2-second autonomous micro-payouts, Sputnik DAO multi-sig treasury protection, and permanent SocialDB credentials.
        </p>

        {/* 3 Link Bento Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%' }}>
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Live Production App
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
              pactt.terminall.workers.dev
            </div>
            <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
              pactt.xyz (Cloudflare Edge)
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              NEAR Testnet Contracts
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
              pact-dao-064783.testnet
            </div>
            <div style={{ fontSize: '13px', color: '#6366f1', fontFamily: 'monospace', marginTop: '4px' }}>
              v1.social08.testnet (SocialDB)
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Open Source GitHub
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
              github.com/youngcrypton/Pactt
            </div>
            <div style={{ fontSize: '13px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
              33/33 Tests Passing (100%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
