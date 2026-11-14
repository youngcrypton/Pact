import React from 'react';
import { BRAND } from '../styles.js';

interface LandingHeroProps {
  buttonHovered?: boolean;
  buttonClicked?: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  buttonHovered = false,
  buttonClicked = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '60px 40px 30px',
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      {/* Radiant Green Aura Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(5, 150, 105, 0.3)',
          borderRadius: 9999,
          padding: '6px 20px',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: BRAND.fontMono,
          color: BRAND.emeraldDark,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          boxShadow: '0 2px 12px rgba(5, 150, 105, 0.15)',
          marginBottom: 24,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 10px #10b981',
          }}
        />
        NEAR HACKATHON 2026 · TRACK 12: SOCIAL · SPUTNIK DAO ESCROW
      </div>

      {/* Editorial Headline with Playfair Display & Italic Green Accent */}
      <h1
        style={{
          fontFamily: BRAND.fontSerif,
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: '-0.025em',
          color: '#020617',
          marginBottom: 20,
        }}
      >
        Instant DAO <span style={{ fontStyle: 'italic', fontWeight: 500, color: '#059669' }}>Bounties</span>.
        <br />
        Zero <span style={{ fontStyle: 'italic', fontWeight: 500, color: '#059669' }}>Voter Fatigue</span>.
      </h1>

      {/* High-Contrast Pitch ("Little Text") */}
      <p
        style={{
          fontSize: 17,
          color: '#334155',
          maxWidth: 680,
          lineHeight: 1.65,
          marginBottom: 36,
        }}
      >
        Pactt replaces high-friction multi-sig voting on NEAR with algorithmic trust routing.
        Micro-bounties settle autonomously in 4.2 seconds; major milestones route to Sputnik DAO with
        Soulbound SocialDB credentials.
      </p>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: buttonHovered ? '#047857' : '#059669',
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 700,
            padding: '14px 36px',
            borderRadius: 9999,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(5, 150, 105, 0.35)',
            transform: buttonClicked ? 'scale(0.96)' : buttonHovered ? 'translateY(-2px)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span>Launch Pactt</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0, 0, 0, 0.04)',
            color: '#020617',
            fontSize: 15,
            fontWeight: 600,
            padding: '14px 28px',
            borderRadius: 9999,
            border: '1px solid rgba(0, 0, 0, 0.15)',
          }}
        >
          Take Quick Tour
        </div>
      </div>
    </div>
  );
};

