import React from 'react';
import { BRAND } from '../styles.js';

interface KineticSubtitlesProps {
  subtitle: string;
  tag?: string;
  highlightWords?: string[];
}

export const KineticSubtitles: React.FC<KineticSubtitlesProps> = ({
  subtitle,
  tag = 'PACTT',
  highlightWords = ['NEAR', 'Pactt', 'Sputnik', 'DAO', '4.2', '142.5', '+33', '24-hour', 'SocialDB', 'v1.social08.testnet', 'pactt.xyz', '0', 'Zero'],
}) => {
  // Highlight important brand terms in emerald
  const renderFormattedText = (text: string) => {
    const words = text.split(' ');
    return words.map((word, idx) => {
      const clean = word.replace(/[^a-zA-Z0-9.+]/g, '');
      const isHighlighted = highlightWords.some(hw => clean.toLowerCase() === hw.toLowerCase());
      return (
        <span
          key={idx}
          style={{
            color: isHighlighted ? '#34d399' : '#ffffff',
            fontWeight: isHighlighted ? 900 : 800,
            textShadow: isHighlighted ? '0 0 16px rgba(52, 211, 153, 0.4)' : 'none',
          }}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 38,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: 1280,
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1.5px solid rgba(255, 255, 255, 0.22)',
        borderRadius: 18,
        padding: '18px 34px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(16, 185, 129, 0.35)',
        zIndex: 9999,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontFamily: BRAND.fontMono,
          fontSize: 12.5,
          fontWeight: 900,
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.22)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          padding: '6px 14px',
          borderRadius: 8,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)',
        }}
      >
        {tag}
      </div>
      <p
        style={{
          fontFamily: BRAND.fontSans,
          fontSize: 25,
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.35,
          letterSpacing: '-0.015em',
          margin: 0,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          flex: 1,
        }}
      >
        {renderFormattedText(subtitle)}
      </p>
    </div>
  );
};
