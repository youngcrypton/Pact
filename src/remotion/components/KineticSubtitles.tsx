import React from 'react';
import { BRAND } from '../styles.js';

interface KineticSubtitlesProps {
  subtitle: string;
  tag?: string;
}

export const KineticSubtitles: React.FC<KineticSubtitlesProps> = ({
  subtitle,
  tag = 'PACTT',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 36,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: 1100,
        background: 'rgba(2, 6, 23, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: 16,
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
        zIndex: 9999,
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          fontFamily: BRAND.fontMono,
          fontSize: 11,
          fontWeight: 800,
          color: '#34d399',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          padding: '4px 10px',
          borderRadius: 6,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {tag}
      </span>
      <p
        style={{
          fontFamily: BRAND.fontSans,
          fontSize: 16,
          fontWeight: 600,
          color: '#ffffff',
          lineHeight: 1.45,
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};

