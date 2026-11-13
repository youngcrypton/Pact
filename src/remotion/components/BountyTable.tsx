import React from 'react';
import { BRAND } from '../styles.js';
import { BountyItem } from '../types.js';

interface BountyTableProps {
  bounties: BountyItem[];
  highlightedId?: string;
}

export const BountyTable: React.FC<BountyTableProps> = ({
  bounties,
  highlightedId = '',
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        border: `1px solid ${BRAND.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: BRAND.cardShadow,
        width: '100%',
        maxWidth: 1540,
        margin: '0 auto',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f1f5f9', borderBottom: `1px solid ${BRAND.border}` }}>
            <th style={{ padding: '14px 20px', fontSize: 11.5, fontFamily: BRAND.fontMono, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
              Task
            </th>
            <th style={{ padding: '14px 20px', fontSize: 11.5, fontFamily: BRAND.fontMono, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
              Category
            </th>
            <th style={{ padding: '14px 20px', fontSize: 11.5, fontFamily: BRAND.fontMono, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
              Approval Tier
            </th>
            <th style={{ padding: '14px 20px', fontSize: 11.5, fontFamily: BRAND.fontMono, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
              Reward
            </th>
            <th style={{ padding: '14px 20px', fontSize: 11.5, fontFamily: BRAND.fontMono, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
              Status
            </th>
            <th style={{ padding: '14px 20px', fontSize: 11.5, fontFamily: BRAND.fontMono, color: '#020617', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, textAlign: 'right' }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {bounties.map((b) => {
            const isHighlight = b.id === highlightedId;
            return (
              <tr
                key={b.id}
                style={{
                  borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
                  background: isHighlight ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                  boxShadow: isHighlight ? 'inset 4px 0 0 #059669' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Title & Sponsor */}
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontFamily: BRAND.fontMono, color: BRAND.textMuted }}>
                      {b.id}
                    </span>
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: '#020617' }}>
                      {b.title}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, fontFamily: BRAND.fontMono, color: BRAND.textSecondary }}>
                    Sponsor: {b.sponsor}
                  </div>
                </td>

                {/* Category */}
                <td style={{ padding: '16px 20px' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: BRAND.fontMono,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: '#f1f5f9',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      color: '#334155',
                    }}
                  >
                    {b.discipline}
                  </span>
                </td>

                {/* Tier */}
                <td style={{ padding: '16px 20px' }}>
                  {b.tier === 1 && (
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: BRAND.fontMono,
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 5,
                        color: BRAND.tier1,
                        background: BRAND.tier1Bg,
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                      }}
                    >
                      Tier 1: Auto (≤ 5 NEAR)
                    </span>
                  )}
                  {b.tier === 2 && (
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: BRAND.fontMono,
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 5,
                        color: BRAND.tier2,
                        background: BRAND.tier2Bg,
                        border: '1px solid rgba(245, 158, 11, 0.35)',
                      }}
                    >
                      Tier 2: 1-Council (5-25 NEAR)
                    </span>
                  )}
                  {b.tier === 3 && (
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: BRAND.fontMono,
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 5,
                        color: BRAND.tier3,
                        background: BRAND.tier3Bg,
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      Tier 3: Sputnik Multi-Sig
                    </span>
                  )}
                </td>

                {/* Reward */}
                <td style={{ padding: '16px 20px' }}>
                  <span
                    style={{
                      fontFamily: BRAND.fontMono,
                      fontSize: 16,
                      fontWeight: 800,
                      color: '#020617',
                    }}
                  >
                    {b.rewardNear.toFixed(1)}{' '}
                    <span style={{ fontSize: 11, fontWeight: 600, color: BRAND.textSecondary }}>
                      NEAR
                    </span>
                  </span>
                </td>

                {/* Status */}
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: b.status === 'Paid Out' ? '#059669' : '#10b981',
                        boxShadow: '0 0 8px #10b981',
                      }}
                    />
                    <span style={{ color: b.status === 'Paid Out' ? '#059669' : '#020617' }}>
                      {b.status}
                    </span>
                  </div>
                </td>

                {/* Action button */}
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button
                    style={{
                      background: isHighlight ? '#059669' : '#020617',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '7px 14px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    Inspect & Claim ↗
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

