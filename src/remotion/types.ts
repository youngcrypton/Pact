export interface BountyItem {
  id: string;
  title: string;
  category: string;
  payoutNear: number;
  tier: number;
  tierLabel: string;
  status: 'Open' | 'In Review' | 'Settling' | 'Paid Out';
  assignee?: string;
  proofUrl?: string;
  tags: string[];
}

export interface Contributor {
  rank: number;
  accountId: string;
  trustScore: number;
  completed: number;
  role: string;
  earned: string;
  tier: string;
  badge: string;
}

export interface SubtitleCue {
  fromFrame: number;
  toFrame: number;
  text: string;
  highlightWords?: string[];
}
