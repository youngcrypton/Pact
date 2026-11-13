import React from 'react';

interface NavbarProps {
  activePersona?: string;
  activePersonaScore?: number;
  activeNavTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePersona = 'alex.testnet',
  activePersonaScore = 142.5,
  activeNavTab = 'bounties',
}) => {
  return (
    <header
      style={{
        height: '80px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Brand & Track Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#020617',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '20px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#020617',
            }}
          >
            Pactt
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '999px',
            padding: '6px 14px',
            color: '#065f46',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          NEAR HACKATHON 2026 · TRACK 12: SOCIAL · SPUTNIK DAO ESCROW
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
        }}
      >
        {[
          { id: 'bounties', label: 'Bounties (8)' },
          { id: 'trust', label: 'Trust Registry' },
          { id: 'proofs', label: 'On-Chain Proofs' },
          { id: 'policy', label: 'SputnikDAO Policy' },
        ].map((tab) => {
          const isActive = activeNavTab === tab.id;
          return (
            <div
              key={tab.id}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: isActive ? '#020617' : '#64748b',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                boxShadow: isActive ? '0 2px 6px rgba(0, 0, 0, 0.05)' : 'none',
              }}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {/* Wallet Persona Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '999px',
            padding: '8px 16px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
            }}
          />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            {activePersona}
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#059669',
              backgroundColor: '#ecfdf5',
              padding: '2px 8px',
              borderRadius: '999px',
            }}
          >
            {activePersonaScore.toFixed(1)} pts
          </span>
        </div>

        {/* Light Mode Sun Icon indicator */}
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#020617',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </div>
      </div>
    </header>
  );
};
