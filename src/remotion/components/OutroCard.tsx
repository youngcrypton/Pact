import React from 'react';
import { BRAND } from '../styles.js';

export const OutroCard: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
        padding: '0 40px',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      {/* Brand Squircle Monogram */}
      <div
        style={{
          width: 80,
          height: 80,
          background: '#020617',
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
          marginBottom: 24,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M12 11C12 9.89543 12.8954 9 14 9H25C30.5228 9 35 13.4772 35 19C35 24.5228 30.5228 29 25 29H18V37C18 38.1046 17.1046 39 16 39H14C12.8954 39 12 38.1046 12 37V11Z"
            fill="#ffffff"
          />
          <path
            d="M18 15H25C27.2091 15 29 16.7909 29 19C29 21.2091 27.2091 23 25 23H18V15Z"
            fill="#020617"
          />
          <path
            d="M28 27H35V29H32V38C32 38.5523 31.5523 39 31 39H29C28.4477 39 28 38.5523 28 38V27Z"
            fill="#ffffff"
          />
          <path
            d="M34 27H41V29H38V38C38 38.5523 37.5523 39 37 39H35C34.4477 39 34 38.5523 34 38V27Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <h1
        style={{
          fontFamily: BRAND.fontSerif,
          fontSize: 54,
          fontWeight: 700,
          color: '#020617',
          marginBottom: 12,
        }}
      >
        Pactt Protocol
      </h1>

      <p
        style={{
          fontSize: 20,
          color: BRAND.textSecondary,
          marginBottom: 32,
        }}
      >
        Earned Trust Coordination Layer on NEAR
      </p>

      {/* Badges / Links */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
        <div
          style={{
            background: '#ffffff',
            border: `1px solid ${BRAND.border}`,
            padding: '10px 20px',
            borderRadius: 8,
            fontFamily: BRAND.fontMono,
            fontSize: 14,
            fontWeight: 700,
            color: '#020617',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          pactt.terminall.workers.dev
        </div>
        <div
          style={{
            background: '#ffffff',
            border: `1px solid ${BRAND.border}`,
            padding: '10px 20px',
            borderRadius: 8,
            fontFamily: BRAND.fontMono,
            fontSize: 14,
            fontWeight: 700,
            color: '#020617',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          github.com/youngcrypton/Pactt
        </div>
      </div>

      <div
        style={{
          fontFamily: BRAND.fontMono,
          fontSize: 12,
          color: '#059669',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Built for NEAR HACKATHON 2026 · Track 12: Social · Sputnik DAO Escrow
      </div>
    </div>
  );
};

