import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { SubtitleCue } from '../types.js';

interface KineticSubtitlesProps {
  cues: SubtitleCue[];
}

export const KineticSubtitles: React.FC<KineticSubtitlesProps> = ({ cues }) => {
  const frame = useCurrentFrame();

  const activeCue = cues.find((c) => frame >= c.fromFrame && frame < c.toFrame);

  if (!activeCue) return null;

  // Gentle fade-in and scale-in for each cue
  const cueProgress = frame - activeCue.fromFrame;
  const opacity = interpolate(cueProgress, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const words = activeCue.text.split(' ');
  const highlights = (activeCue.highlightWords || []).map((w) => w.toLowerCase());

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9000,
        pointerEvents: 'none',
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          padding: '16px 32px',
          backgroundColor: 'rgba(2, 6, 23, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {words.map((word, idx) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase();
          const isHighlighted = highlights.some((h) => cleanWord.includes(h) || h.includes(cleanWord));

          return (
            <span
              key={idx}
              style={{
                fontSize: '26px',
                fontWeight: isHighlighted ? 700 : 500,
                color: isHighlighted ? '#10b981' : '#f8fafc',
                textShadow: isHighlighted
                  ? '0 0 12px rgba(16, 185, 129, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)'
                  : '0 2px 4px rgba(0, 0, 0, 0.8)',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
