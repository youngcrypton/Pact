import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface CursorProps {
  x: number;
  y: number;
  isClicking?: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ x, y, isClicking = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clickScale = isClicking ? 0.88 : 1.0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `scale(${clickScale}) translate(-2px, -2px)`,
        transition: 'transform 0.08s ease',
      }}
    >
      {/* SVG Realistic Arrow Pointer */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35))',
        }}
      >
        <path
          d="M5.5 3.2L18.5 12.2L12.5 13.5L16 20.8L13.2 22.2L9.8 15L5.5 19.2V3.2Z"
          fill="#020617"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Click ripple animation */}
      {isClicking && (
        <div
          style={{
            position: 'absolute',
            left: 2,
            top: 2,
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '2px solid #10b981',
            transform: 'translate(-50%, -50%)',
            animation: 'none',
            opacity: 0.8,
            background: 'rgba(16, 185, 129, 0.25)',
          }}
        />
      )}
    </div>
  );
};
