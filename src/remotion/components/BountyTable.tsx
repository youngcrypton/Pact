import React from 'react';
import { BountyItem } from '../types.js';

interface BountyTableProps {
  bounties: BountyItem[];
  highlightId?: string;
  onClaimLabel?: string;
}

export const BountyTable: React.FC<BountyTableProps> = ({
  bounties,
  highlightId,
  onClaimLabel = 'Inspect & Claim',
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px 28px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#020617',
              margin: '0 0 4px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Active Escrow Bounties
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Automated trust verification: Micro-tasks settle in &lt; 4.2s; high-capital allocations route to Sputnik DAO.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#059669',
              backgroundColor: '#ecfdf5',
              padding: '6px 12px',
              borderRadius: '999px',
            }}
          >
            Tier 1: Instant (&lt;5 NEAR)
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#d97706',
              backgroundColor: '#fef3c7',
              padding: '6px 12px',
              borderRadius: '999px',
            }}
          >
            Tier 2: 1-Council (5-25 NEAR)
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#4f46e5',
              backgroundColor: '#e0e7ff',
              padding: '6px 12px',
              borderRadius: '999px',
            }}
          >
            Tier 3: Sputnik DAO (&gt;25 NEAR)
          </span>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '12px 14px' }}>Task</th>
            <th style={{ padding: '12px 14px' }}>Category</th>
            <th style={{ padding: '12px 14px' }}>Reward</th>
            <th style={{ padding: '12px 14px' }}>Routing Tier</th>
            <th style={{ padding: '12px 14px' }}>Status</th>
            <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bounties.map((b) => {
            const isHighlighted = highlightId === b.id;
            const isPaid = b.status === 'Paid Out';

            let tierBg = '#ecfdf5';
            let tierColor = '#065f46';
            if (b.tier === 2) {
              tierBg = '#fef3c7';
              tierColor = '#92400e';
            } else if (b.tier === 3) {
              tierBg = '#e0e7ff';
              tierColor = '#3730a3';
            }

            let statusBg = '#f1f5f9';
            let statusColor = '#475569';
            if (isPaid) {
              statusBg = '#ecfdf5';
              statusColor = '#059669';
            } else if (b.status === 'In Review') {
              statusBg = '#fff7ed';
              statusColor = '#c2410c';
            }

            return (
              <tr
                key={b.id}
                style={{
                  borderBottom: '1px solid #f8fafc',
                  backgroundColor: isHighlighted ? '#f0fdf4' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <td style={{ padding: '14px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{b.title}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{b.id}</div>
                </td>
                <td style={{ padding: '14px', fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                  {b.category}
                </td>
                <td style={{ padding: '14px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#020617' }}>
                    {b.payoutNear.toFixed(1)}{' '}
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>NEAR</span>
                  </span>
                </td>
                <td style={{ padding: '14px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: tierBg,
                      color: tierColor,
                      padding: '4px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    {b.tierLabel}
                  </span>
                </td>
                <td style={{ padding: '14px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: statusBg,
                      color: statusColor,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {isPaid && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                        }}
                      />
                    )}
                    {b.status}
                  </span>
                </td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: isHighlighted ? '#10b981' : isPaid ? '#f1f5f9' : '#020617',
                      color: isPaid ? '#94a3b8' : '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: isHighlighted ? '0 4px 12px rgba(16, 185, 129, 0.35)' : 'none',
                    }}
                  >
                    {isPaid ? 'Settled' : onClaimLabel}
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
