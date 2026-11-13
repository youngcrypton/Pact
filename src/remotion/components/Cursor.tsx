import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface CursorProps {
  x: number;
  y: number;
  isClicked?: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ x, y, isClicked = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clickScale = isClicked
    ? spring({
        frame: frame % 15,
        fps,
        config: { damping: 12, stiffness: 200, mass: 0.5 },
      })
    : 1;

  const scale = isClicked ? interpolate(clickScale, [0, 1], [0.85, 1]) : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 99999,
        transform: `translate(-2px, -2px) scale(${scale})`,
        filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.35))',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 3L19 12L12 14L9 21L5 3Z"
          fill="#020617"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      {isClicked && (
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid #10b981',
            transform: 'translate(-50%, -50%)',
            opacity: 0.8,
            boxShadow: '0 0 12px #10b981',
          }}
        />
      )}
    </div>
  );
};

