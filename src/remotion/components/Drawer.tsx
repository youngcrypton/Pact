import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BountyItem } from '../types.js';

interface DrawerProps {
  bounty: BountyItem;
  isOpen: boolean;
  contributorId: string;
  contributorScore: number;
  stage: 'input' | 'verifying' | 'settled' | 'dao_forwarded';
  proofUrl?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  bounty,
  isOpen,
  contributorId,
  contributorScore,
  stage,
  proofUrl = 'https://github.com/pactt/protocol/pull/88',
}) => {
  const frame = useCurrentFrame();

  if (!isOpen) return null;

  const isTier1 = bounty.tier === 1;
  const isSettled = stage === 'settled';
  const isVerifying = stage === 'verifying';
  const isDaoForwarded = stage === 'dao_forwarded';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '620px',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '-20px 0 50px rgba(0, 0, 0, 0.18)',
        zIndex: 5000,
        display: 'flex',
        flexDirection: 'column',
        padding: '36px 40px',
        boxSizing: 'border-box',
        overflowY: 'hidden',
      }}
    >
      {/* Drawer Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 700,
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            {bounty.id}
          </span>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#020617',
              margin: '10px 0 0 0',
              lineHeight: 1.25,
            }}
          >
            {bounty.title}
          </h2>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669' }}>
            {bounty.payoutNear.toFixed(1)} <span style={{ fontSize: '14px', color: '#64748b' }}>NEAR</span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Escrow Locked
          </div>
        </div>
      </div>

      {/* Contributor Persona Card */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          padding: '14px 18px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Claiming Contributor
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>
            {contributorId}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Trust Score
          </div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#059669' }}>
            {contributorScore.toFixed(1)} pts
          </div>
        </div>
      </div>

      {/* Routing Analysis Banner */}
      <div
        style={{
          backgroundColor: isTier1 ? '#ecfdf5' : '#eff6ff',
          border: isTier1 ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isTier1 ? '#10b981' : '#3b82f6',
            }}
          />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: isTier1 ? '#065f46' : '#1e40af',
            }}
          >
            {isTier1 ? 'Tier 1: Autonomous Escrow Release' : 'Tier 3: Sputnik DAO Council Multi-Sig'}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: isTier1 ? '#065f46' : '#1e3a8a' }}>
          {isTier1
            ? `Contributor score (${contributorScore} pts >= 50 threshold) qualifies for instant payout in < 4.2 seconds. No council vote or proposal bond required.`
            : `Capital allocation (${bounty.payoutNear} NEAR > 25 threshold) requires multi-sig quorum from Sputnik DAO v2 council on pactt.sputnik-dao.testnet.`}
        </p>
      </div>

      {/* Deliverable Proof Input Box */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
          Verified Work Deliverable (GitHub PR / Commit Hash)
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '2px solid #cbd5e1',
            borderRadius: '10px',
            padding: '12px 16px',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#0f172a',
          }}
        >
          <span style={{ color: '#94a3b8', marginRight: '6px' }}>PR:</span>
          <span>{proofUrl}</span>
        </div>
      </div>

      {/* Anti-Cheat Real-Time Validation Box */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
          Algorithmic Anti-Cheat Engine
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#475569' }}>SHA-256 Work Deduplication</span>
            <span style={{ color: '#059669', fontWeight: 700 }}>Passed (Unique Hash)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#475569' }}>24h Velocity Cap Protection</span>
            <span style={{ color: '#059669', fontWeight: 700 }}>Active (Within 35 NEAR limit)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#475569' }}>Dispute Slashing Escrow Window</span>
            <span style={{ color: '#6366f1', fontWeight: 700 }}>24 Hours Rolling</span>
          </div>
        </div>
      </div>

      {/* Settlement Result or Action */}
      {isSettled && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '2px solid #10b981',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#065f46', fontWeight: 800, fontSize: '16px' }}>
            <span style={{ fontSize: '20px' }}>✓</span>
            <span>Settled Autonomously in 4.2 Seconds</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '13px', color: '#065f46' }}>
            {bounty.payoutNear.toFixed(1)} NEAR released to <code>{contributorId}</code> from <code>pact-dao-064783.testnet</code>.
          </div>
          <div style={{ marginTop: '10px', fontSize: '13px', fontWeight: 700, color: '#059669' }}>
            +33 Trust Points Awarded · Soulbound Badge Minted to NEAR Social
          </div>
        </div>
      )}

      {isDaoForwarded && (
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '2px solid #3b82f6',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 8px 24px -4px rgba(59, 130, 246, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e40af', fontWeight: 800, fontSize: '16px' }}>
            <span>Sputnik DAO Proposal #412 Dispatched</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '13px', color: '#1e3a8a' }}>
            Escrow custody preserved in <code>pactt.sputnik-dao.testnet</code>. Requiring 3 of 5 council multi-sig votes.
          </div>
        </div>
      )}

      {/* Bottom CTA Button */}
      <div style={{ marginTop: 'auto' }}>
        <button
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: isSettled ? '#059669' : isDaoForwarded ? '#2563eb' : '#020617',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          }}
        >
          {isSettled
            ? 'Disbursement Complete · View on NearBlocks'
            : isDaoForwarded
            ? 'Track Proposal #412 on Sputnik DAO'
            : isVerifying
            ? 'Verifying Algorithmic Proof...'
            : 'Submit for Settlement'}
        </button>
      </div>
    </div>
  );
};
