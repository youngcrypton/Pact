import React from 'react';
import { BRAND } from '../styles.js';

interface TaskDrawerProps {
  isOpen: boolean;
  bountyId?: string;
  title?: string;
  reward?: number;
  contributor?: string;
  trustScore?: number;
  deliverableUrl?: string;
  dedupChecked?: boolean;
  isSubmitting?: boolean;
  isPaidOut?: boolean;
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({
  isOpen,
  bountyId = '#B-102',
  title = 'Documentation Architecture & Tutorials',
  reward = 4.5,
  contributor = 'alex.testnet',
  trustScore = 142.5,
  deliverableUrl = 'https://github.com/pactt/core/pull/88',
  dedupChecked = true,
  isSubmitting = false,
  isPaidOut = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 580,
        background: '#ffffff',
        borderLeft: `1px solid ${BRAND.border}`,
        boxShadow: '-16px 0 48px rgba(0, 0, 0, 0.18)',
        zIndex: 1000,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${BRAND.border}`, paddingBottom: 16 }}>
        <div>
          <span style={{ fontSize: 11, fontFamily: BRAND.fontMono, color: BRAND.textMuted }}>
            {bountyId} · Escrow Custody
          </span>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#020617', marginTop: 2 }}>
            {title}
          </h2>
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: '#020617',
          }}
        >
          ✕
        </div>
      </div>

      {/* Routing Pill */}
      <div
        style={{
          background: '#f8fafc',
          border: `1px solid ${BRAND.border}`,
          borderRadius: 10,
          padding: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: 10, fontFamily: BRAND.fontMono, color: BRAND.textMuted, textTransform: 'uppercase', fontWeight: 800 }}>
            Algorithmic Routing
          </span>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
            Tier 1: Autonomous Escrow Release
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 10, fontFamily: BRAND.fontMono, color: BRAND.textMuted, textTransform: 'uppercase', fontWeight: 800 }}>
            Escrow Gate
          </span>
          <div style={{ fontSize: 18, fontWeight: 900, fontFamily: BRAND.fontMono, color: '#020617' }}>
            {reward.toFixed(1)} NEAR
          </div>
        </div>
      </div>

      {/* Contributor Profile */}
      <div
        style={{
          background: '#f8fafc',
          border: `1px solid ${BRAND.border}`,
          borderRadius: 10,
          padding: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: 10, fontFamily: BRAND.fontMono, color: BRAND.textMuted, textTransform: 'uppercase', fontWeight: 800 }}>
            Claiming Contributor
          </span>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: BRAND.fontMono, color: '#020617', marginTop: 2 }}>
            {contributor}
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            fontFamily: BRAND.fontMono,
            color: '#059669',
            background: BRAND.tier1Bg,
            padding: '4px 10px',
            borderRadius: 6,
          }}
        >
          Trust Score: {isPaidOut ? trustScore + 33 : trustScore} pts
        </div>
      </div>

      {/* Deliverable Proof Submission */}
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: BRAND.textSecondary, marginBottom: 6 }}>
          GitHub Pull Request / Deliverable Proof URL
        </label>
        <div
          style={{
            width: '100%',
            background: '#ffffff',
            border: `1px solid ${BRAND.border}`,
            padding: '10px 14px',
            borderRadius: 8,
            fontFamily: BRAND.fontMono,
            fontSize: 13,
            color: '#020617',
            boxSizing: 'border-box',
          }}
        >
          {deliverableUrl}
        </div>

        {/* Deduplication Verification Tag */}
        {dedupChecked && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 8,
              padding: '8px 12px',
              borderRadius: 6,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              fontSize: 12,
              color: '#059669',
              fontWeight: 600,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
            Deduplication Verified: Zero recycled link collisions detected across Sputnik DAOs.
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div style={{ marginTop: 'auto' }}>
        {!isPaidOut ? (
          <button
            style={{
              width: '100%',
              background: isSubmitting ? '#047857' : '#059669',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '14px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>{isSubmitting ? 'Verifying Deliverable Proof...' : 'Submit for Settlement ↗'}</span>
          </button>
        ) : (
          /* The Magic Moment Success State */
          <div
            style={{
              background: '#020617',
              borderRadius: 12,
              padding: 20,
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981' }} />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
                Paid Out in 4.2 Seconds!
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>
              Algorithmic trust gate satisfied (Trust: {trustScore} $\ge$ 50 pts, Amount $\le$ 5.0 NEAR).
              Funds disbursed autonomously without council vote delay.
            </p>
            <div
              style={{
                marginTop: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontFamily: BRAND.fontMono,
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '4px 10px',
                borderRadius: 6,
              }}
            >
              Earned: +33.0 Trust Points awarded to Alex
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

