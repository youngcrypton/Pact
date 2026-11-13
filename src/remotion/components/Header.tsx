import React from 'react';
import { BRAND } from '../styles.js';

interface HeaderProps {
  connectedAccount?: string;
  trustScore?: number;
  tier?: string;
}

export const Header: React.FC<HeaderProps> = ({
  connectedAccount = 'alex.testnet',
  trustScore = 142.5,
  tier = 'Tier 1',
}) => {
  return (
    <header
      style={{
        width: '100%',
        height: 64,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${BRAND.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        boxSizing: 'border-box',
      }}
    >
      {/* Brand logo & live network */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 34,
            height: 34,
            background: '#020617',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
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

        <span
          style={{
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: '#020617',
          }}
        >
          Pactt
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontFamily: BRAND.fontMono,
            color: BRAND.textSecondary,
            padding: '3px 10px',
            border: `1px solid ${BRAND.border}`,
            borderRadius: 20,
            background: '#ffffff',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          NEAR Testnet
        </div>
      </div>

      {/* Segmented Nav */}
      <div
        style={{
          display: 'flex',
          background: '#f1f5f9',
          border: `1px solid ${BRAND.border}`,
          borderRadius: 10,
          padding: 4,
          gap: 4,
        }}
      >
        <div
          style={{
            background: '#020617',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 700,
            padding: '6px 16px',
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          }}
        >
          Bounties{' '}
          <span
            style={{
              fontSize: 10,
              fontFamily: BRAND.fontMono,
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '1px 5px',
              borderRadius: 8,
            }}
          >
            8
          </span>
        </div>
        <div
          style={{
            color: BRAND.textSecondary,
            fontSize: 13,
            fontWeight: 600,
            padding: '6px 16px',
          }}
        >
          Trust Registry
        </div>
        <div
          style={{
            color: BRAND.textSecondary,
            fontSize: 13,
            fontWeight: 600,
            padding: '6px 16px',
          }}
        >
          On-Chain Proofs
        </div>
        <div
          style={{
            color: BRAND.textSecondary,
            fontSize: 13,
            fontWeight: 600,
            padding: '6px 16px',
          }}
        >
          Sputnik DAO Policy
        </div>
      </div>

      {/* Connected Account Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 14px',
          height: 38,
          background: '#ffffff',
          border: `1px solid ${BRAND.border}`,
          borderRadius: 8,
          fontSize: 12.5,
          fontFamily: BRAND.fontMono,
          color: '#020617',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px #10b981',
          }}
        />
        <strong style={{ color: '#020617' }}>{connectedAccount}</strong>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 4,
            background: BRAND.tier1Bg,
            color: BRAND.tier1,
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          {tier} ({trustScore} pts)
        </span>
      </div>
    </header>
  );
};

