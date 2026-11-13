export interface VideoTheme {
  bg: string;
  surface: string;
  surfaceCard: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  emeraldNeon: string;
  emeraldLight: string;
  emeraldDark: string;
  amber: string;
}

export interface CursorPosition {
  x: number;
  y: number;
  clicked?: boolean;
}

export interface BountyItem {
  id: string;
  title: string;
  sponsor: string;
  discipline: string;
  tier: 1 | 2 | 3;
  rewardNear: number;
  status: string;
}

