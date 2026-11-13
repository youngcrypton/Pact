import React from 'react';

export const BRAND = {
  // Brand Palettes
  bg: '#f8fafc',
  bgDark: '#030406',
  surfaceCard: '#ffffff',
  surfaceCardDark: '#0d0e12',
  heroBg: '#020617', // Always dark obsidian anchor
  textPrimary: '#020617',
  textSecondary: '#334155',
  textMuted: '#64748b',
  textLight: '#ffffff',
  textLightSub: '#e2e8f0',
  
  // Emerald Neon Identity
  emerald: '#10b981',
  emeraldLight: '#34d399',
  emeraldDark: '#059669',
  emeraldGlow: '0 0 24px rgba(16, 185, 129, 0.35)',
  
  // Semantic Tiers
  tier1: '#059669',
  tier1Bg: 'rgba(16, 185, 129, 0.12)',
  tier2: '#b45309',
  tier2Bg: 'rgba(245, 158, 11, 0.12)',
  tier3: '#020617',
  tier3Bg: '#f1f5f9',

  // Borders & Shadows
  border: 'rgba(0, 0, 0, 0.12)',
  borderLight: 'rgba(255, 255, 255, 0.16)',
  cardShadow: '0 12px 36px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
  cardShadowDark: '0 20px 48px rgba(0, 0, 0, 0.65)',

  // Fonts
  fontSerif: "'Playfair Display', Georgia, 'Times New Roman', serif",
  fontSans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'Space Grotesk', ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
};

export const bgPatternSvg = "data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 0 C24 14 14 24 0 24 C14 24 24 34 24 48 C24 34 34 24 48 24 C34 24 24 14 24 0 Z' fill='%23000000' fill-opacity='0.035'/%3E%3Ccircle cx='24' cy='24' r='1.5' fill='%23000000' fill-opacity='0.05'/%3E%3C/svg%3E";

export const commonBackgroundStyle: React.CSSProperties = {
  backgroundColor: BRAND.bg,
  backgroundImage: `radial-gradient(circle 900px at 50% -120px, rgba(16, 185, 129, 0.14), transparent 70%), url("${bgPatternSvg}")`,
  backgroundRepeat: 'no-repeat, repeat',
  backgroundSize: '100% 1200px, 48px 48px',
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  fontFamily: BRAND.fontSans,
  color: BRAND.textPrimary,
};

