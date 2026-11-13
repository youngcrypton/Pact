import React from 'react';
import { BRAND } from '../styles.js';

interface SputnikQuorumCardProps {
  proposalId?: string;
  bountyId?: string;
  amount?: number;
  quorumVotes?: number;
  totalCouncil?: number;
}

export const SputnikQuorumCard: React.FC<SputnikQuorumCardProps> = ({
  proposalId = '#412',
  bountyId = '#B-108',
  amount = 50.0,
  quorumVotes = 2,
  totalCouncil = 3,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        border: `1px solid ${BRAND.border}`,
        borderRadius: 14,
        padding: 24,
        boxShadow: BRAND.cardShadow,
        width: '100%',
        maxWidth: 780,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${BRAND.border}`, paddingBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: BRAND.fontMono,
              fontSize: 12,
              fontWeight: 800,
              background: '#020617',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: 6,
            }}
          >
            Sputnik Proposal {proposalId}
          </span>
          <span style={{ fontSize: 13, fontFamily: BRAND.fontMono, color: BRAND.textSecondary }}>
            pactt.sputnik-dao.testnet
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#b45309',
            background: BRAND.tier2Bg,
            padding: '3px 8px',
            borderRadius: 4,
          }}
        >
          High-Capital Gate
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: BRAND.fontMono, color: BRAND.textMuted, textTransform: 'uppercase', fontWeight: 800 }}>
            Escrow Disbursement Request
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#020617', marginTop: 2 }}>
            Bounty {bountyId} · Core Engine Refactor
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 900, fontFamily: BRAND.fontMono, color: '#020617' }}>
            {amount.toFixed(1)} NEAR
          </div>
        </div>
      </div>

      {/* Quorum Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: BRAND.fontMono, fontWeight: 700, marginBottom: 6 }}>
          <span>Council Multi-Sig Quorum</span>
          <span>{quorumVotes} of {totalCouncil} Signatures (Pending Threshold)</span>
        </div>
        <div style={{ width: '100%', height: 8, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ width: `${(quorumVotes / totalCouncil) * 100}%`, height: '100%', background: '#d97706', borderRadius: 9999 }} />
        </div>
      </div>

      {/* Council Voting Ledger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 6 }}>
          <span style={{ fontFamily: BRAND.fontMono, fontSize: 12, color: '#020617', fontWeight: 700 }}>
            council-1.sputnik-dao.testnet
          </span>
          <span style={{ fontSize: 11, fontFamily: BRAND.fontMono, color: '#059669', fontWeight: 800 }}>
            APPROVED (Signed)
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 6 }}>
          <span style={{ fontFamily: BRAND.fontMono, fontSize: 12, color: '#020617', fontWeight: 700 }}>
            council-2.sputnik-dao.testnet
          </span>
          <span style={{ fontSize: 11, fontFamily: BRAND.fontMono, color: '#059669', fontWeight: 800 }}>
            APPROVED (Signed)
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', border: `1px solid ${BRAND.border}`, borderRadius: 6 }}>
          <span style={{ fontFamily: BRAND.fontMono, fontSize: 12, color: BRAND.textMuted }}>
            council-3.sputnik-dao.testnet
          </span>
          <span style={{ fontSize: 11, fontFamily: BRAND.fontMono, color: '#b45309', fontWeight: 700 }}>
            PENDING SIGNATURE
          </span>
        </div>
      </div>
    </div>
  );
};

