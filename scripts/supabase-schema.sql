-- =========================================================================
-- Pact Protocol — Supabase Cloud Database Schema & Seed Data
-- =========================================================================

-- 1. Create Bounties Table
CREATE TABLE IF NOT EXISTS bounties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_near NUMERIC NOT NULL,
  category TEXT NOT NULL, -- 'DEV', 'DESIGN', 'AUDIT', 'COMMUNITY'
  status TEXT NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'CLAIMED', 'IN_REVIEW', 'APPROVED', 'ESCALATED_TO_DAO'
  approval_tier TEXT NOT NULL DEFAULT 'TIER_2_SINGLE_COUNCIL', -- 'TIER_1_AUTO', 'TIER_2_SINGLE_COUNCIL', 'TIER_3_DAO_ESCALATION'
  claimed_by TEXT,
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Contributors & Trust Reputation Table
CREATE TABLE IF NOT EXISTS contributors (
  account_id TEXT PRIMARY KEY,
  trust_points INTEGER DEFAULT 0,
  current_tier TEXT DEFAULT 'NEWBIE', -- 'NEWBIE', 'CONTRIBUTOR', 'TRUSTED_CORE'
  completed_bounties_count INTEGER DEFAULT 0,
  total_earned_near NUMERIC DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS) & Set Policies for Public Client Access
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on bounties" ON bounties FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on bounties" ON bounties FOR ALL USING (true);

CREATE POLICY "Allow public read on contributors" ON contributors FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on contributors" ON contributors FOR ALL USING (true);

-- 4. Seed Official Pact Bounties
INSERT INTO bounties (id, title, description, reward_near, category, status, approval_tier)
VALUES 
  ('bounty-1', 'Fix Markdown Link Syntax in Trezu Docs', 'Correct dead links and update URLs in the developer guide.', 3.5, 'COMMUNITY', 'OPEN', 'TIER_1_AUTO'),
  ('bounty-2', 'Add Dark Mode Toggle to Bounty Board', 'Implement Tailwind dark mode with local storage persistence.', 8.0, 'DESIGN', 'OPEN', 'TIER_2_SINGLE_COUNCIL'),
  ('bounty-3', 'Refactor Sputnik DAO Transfer Gas Limit', 'Optimize cross-contract call gas usage to prevent timeouts.', 15.0, 'DEV', 'OPEN', 'TIER_2_SINGLE_COUNCIL'),
  ('bounty-4', 'Design Pact Protocol Vector Badges', 'Create 3 SVG badge tiers (Newbie, Contributor, Trusted Core) for BOS profiles.', 6.0, 'DESIGN', 'OPEN', 'TIER_2_SINGLE_COUNCIL'),
  ('bounty-5', 'Audit Smart Contract Reentrancy Guards', 'Conduct formal verification of cross-contract transfer callbacks.', 35.0, 'AUDIT', 'OPEN', 'TIER_3_DAO_ESCALATION')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Initial Test Contributors with Historical Trust
INSERT INTO contributors (account_id, trust_points, current_tier, completed_bounties_count, total_earned_near, badges)
VALUES 
  ('alice.testnet', 60, 'TRUSTED_CORE', 3, 17.5, '[{"title": "Pact Core Contributor (Tier 1)", "awardedAt": "2026-11-10"}]'::jsonb),
  ('carol.testnet', 25, 'CONTRIBUTOR', 1, 8.0, '[{"title": "Pact Verified Contributor (Tier 2)", "awardedAt": "2026-11-10"}]'::jsonb),
  ('bob.testnet', 0, 'NEWBIE', 0, 0, '[]'::jsonb)
ON CONFLICT (account_id) DO NOTHING;
