-- =========================================================================
-- Pact Protocol — Production Supabase Cloud Database Schema (Phase 3)
-- Solves Bug 1: Global Data Persistence across Server Restarts & Reloads
-- Includes:
--   - Bug 5 & 7: Escrow Vault & YoctoNEAR (10^24) Exact BigInt Precision
--   - Bug 3: Global Deliverable Link Deduplication Table
--   - Bug 6: 24h Council Dispute Windows & Reputation Slash Logging
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- 1. Table: bounties
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bounties (
  id TEXT PRIMARY KEY,
  code TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_formatted NUMERIC NOT NULL,
  amount_yocto VARCHAR(78) NOT NULL, -- 10^24 precision (Bug 7)
  category TEXT NOT NULL,            -- 'DEV', 'DESIGN', 'CONTENT', 'COMMUNITY', 'RESEARCH', 'SECURITY'
  status TEXT NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'CLAIMED', 'IN_REVIEW', 'APPROVED', 'REJECTED'
  approval_tier TEXT NOT NULL DEFAULT 'TIER_2_SINGLE_COUNCIL', -- 'TIER_1_AUTO', 'TIER_2_SINGLE_COUNCIL', 'TIER_3_DAO_ESCALATION'
  claimed_by TEXT,
  proof_url TEXT,
  created_by TEXT NOT NULL,
  
  -- Escrow Fund Custody & Gating (Bug 5)
  escrow_status TEXT NOT NULL DEFAULT 'ESCROWED', -- 'UNFUNDED', 'ESCROWED', 'DISBURSED', 'REFUNDED'
  escrow_vault_id TEXT DEFAULT 'pact-dao-064783.testnet',
  escrow_tx_hash TEXT,
  escrow_disbursed_at TIMESTAMPTZ,

  -- Council Dispute Window & Slashing (Bug 6)
  dispute_status TEXT NOT NULL DEFAULT 'NONE', -- 'NONE', 'CHALLENGED', 'RESOLVED_SLASHED', 'RESOLVED_CLEARED'
  disputed_by TEXT,
  dispute_reason TEXT,
  dispute_challenged_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by status and category
CREATE INDEX IF NOT EXISTS idx_bounties_status ON bounties(status);
CREATE INDEX IF NOT EXISTS idx_bounties_claimed_by ON bounties(claimed_by);

-- -------------------------------------------------------------------------
-- 2. Table: contributors
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contributors (
  account_id TEXT PRIMARY KEY,
  trust_points NUMERIC DEFAULT 0,
  current_tier TEXT DEFAULT 'TIER_3_DAO_ESCALATION',
  completed_bounties_count INTEGER DEFAULT 0,
  total_earned_near NUMERIC DEFAULT 0,
  total_earned_yocto VARCHAR(78) DEFAULT '0', -- 10^24 precision (Bug 7)
  daily_auto_count INTEGER DEFAULT 0,         -- Rolling velocity meter (Bug 6)
  last_auto_payout_at TIMESTAMPTZ,
  badges JSONB DEFAULT '[]'::jsonb,
  is_council BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. Table: used_proof_urls (Anti-Cheat Deduplication - Bug 3)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS used_proof_urls (
  proof_url TEXT PRIMARY KEY,
  bounty_id TEXT REFERENCES bounties(id) ON DELETE CASCADE,
  claimant TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. Table: trust_audit_events (Audit Trail & Slash Log - Bug 6)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trust_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_account TEXT NOT NULL,
  bounty_id TEXT REFERENCES bounties(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'COMPLETION_AWARD', 'COUNCIL_SLASH', 'VELOCITY_DOWNGRADE'
  points_delta NUMERIC NOT NULL,
  resulting_points NUMERIC NOT NULL,
  actor_account TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_contributor ON trust_audit_events(contributor_account);

-- -------------------------------------------------------------------------
-- 5. Row Level Security (RLS) & Client Access Policies
-- -------------------------------------------------------------------------
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_proof_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_audit_events ENABLE ROW LEVEL SECURITY;

-- Allow public read of bounties, contributors, proof URLs and audit events
CREATE POLICY "Public read on bounties" ON bounties FOR SELECT USING (true);
CREATE POLICY "Public insert/update on bounties" ON bounties FOR ALL USING (true);

CREATE POLICY "Public read on contributors" ON contributors FOR SELECT USING (true);
CREATE POLICY "Public insert/update on contributors" ON contributors FOR ALL USING (true);

CREATE POLICY "Public read on used_proof_urls" ON used_proof_urls FOR SELECT USING (true);
CREATE POLICY "Public insert on used_proof_urls" ON used_proof_urls FOR ALL USING (true);

CREATE POLICY "Public read on trust_audit_events" ON trust_audit_events FOR SELECT USING (true);
CREATE POLICY "Public insert on trust_audit_events" ON trust_audit_events FOR ALL USING (true);

-- -------------------------------------------------------------------------
-- 6. Seed Official Hackathon Bounties
-- -------------------------------------------------------------------------
INSERT INTO bounties (
  id, code, title, description, amount_formatted, amount_yocto, category, status, approval_tier, created_by, escrow_status
) VALUES 
  ('bounty-1', 'B-101', 'BOS / NEAR Social Profile Component Card Kit', 'Design pixel-perfect SVG and React preview cards for displaying earned trust reputation badges on near.social profile headers.', 8.0, '8000000000000000000000000', 'DESIGN', 'OPEN', 'TIER_2_SINGLE_COUNCIL', 'creatives.sputnik-dao.testnet', 'ESCROWED'),
  ('bounty-2', 'B-102', 'Deep-Dive Thread: Why NEAR Chain Abstraction Matters', 'Author a high-impact 8-tweet educational thread breaking down account aggregation and decentralized relayer networks for Web3 newcomers.', 4.5, '4500000000000000000000000', 'CONTENT', 'OPEN', 'TIER_1_AUTO', 'marketing.sputnik-dao.testnet', 'ESCROWED'),
  ('bounty-3', 'B-103', 'Translate Developer Quickstart to Spanish & Portuguese', 'Complete verified localization of the official NEAR 2.0 developer onboarding documentation for the Latin America developer guild.', 4.0, '4000000000000000000000000', 'COMMUNITY', 'CLAIMED', 'TIER_1_AUTO', 'devhub.sputnik-dao.testnet', 'ESCROWED'),
  ('bounty-4', 'B-104', 'Comparative Research: Sputnik DAO vs. Aragon & Moloch', 'Author a comprehensive 6-page research report evaluating capital efficiency, multi-sig latency, and reputation models across major DAO frameworks.', 15.0, '15000000000000000000000000', 'RESEARCH', 'OPEN', 'TIER_2_SINGLE_COUNCIL', 'policy.sputnik-dao.testnet', 'ESCROWED'),
  ('bounty-5', 'B-105', 'Implement NEP-171 NFT Metadata Parser', 'Write a zero-dependency TypeScript parser for standard NEAR NFT NEP-171 metadata specifications with full typing and schema validation.', 3.5, '3500000000000000000000000', 'DEV', 'APPROVED', 'TIER_1_AUTO', 'devhub.sputnik-dao.testnet', 'DISBURSED'),
  ('bounty-6', 'B-106', 'Audit FastAuth Session Key Invalidation Logic', 'Perform formal verification and manual code audit on testnet FastAuth session key rotation and storage deposit refunds.', 18.0, '18000000000000000000000000', 'SECURITY', 'IN_REVIEW', 'TIER_2_SINGLE_COUNCIL', 'security.sputnik-dao.testnet', 'ESCROWED'),
  ('bounty-7', 'B-107', 'Host Virtual AMA on BOS Composability & DAOs', 'Organize, moderate, and record a 45-minute live Twitter Space / Discord stage on decentralized frontends with guest speakers from Creatives DAO.', 6.5, '6500000000000000000000000', 'COMMUNITY', 'OPEN', 'TIER_2_SINGLE_COUNCIL', 'community.sputnik-dao.testnet', 'ESCROWED'),
  ('bounty-8', 'B-108', 'Build Full Cross-Chain Intent Relayer', 'Architect a production-grade intent relayer listening to NEAR cross-chain settlement contracts for 10 NEAR/ETH atomic swaps.', 50.0, '50000000000000000000000000', 'DEV', 'OPEN', 'TIER_3_DAO_ESCALATION', 'intents.sputnik-dao.testnet', 'ESCROWED')
ON CONFLICT (id) DO NOTHING;

-- Populate claimant & proof on pre-claimed bounties
UPDATE bounties SET claimed_by = 'maria.testnet' WHERE id = 'bounty-3';
UPDATE bounties SET claimed_by = 'alex.testnet', proof_url = 'https://github.com/near/core-contracts/pull/412', approved_at = NOW() WHERE id = 'bounty-5';
UPDATE bounties SET claimed_by = 'chen.testnet', proof_url = 'https://github.com/pactt-protocol/audit/pull/5' WHERE id = 'bounty-6';

-- -------------------------------------------------------------------------
-- 7. Seed Initial Test Contributors with Reputations & Personas
-- -------------------------------------------------------------------------
INSERT INTO contributors (account_id, trust_points, current_tier, completed_bounties_count, total_earned_near, total_earned_yocto, is_council, badges)
VALUES 
  ('alex.testnet', 142.5, 'TIER_1_AUTO', 6, 31.2, '31200000000000000000000000', false, '[{"title": "Pact Verified Gold (Tier 1)", "awardedAt": "2026-11-10"}]'::jsonb),
  ('chen.testnet', 65.5, 'TIER_1_AUTO', 4, 19.5, '19500000000000000000000000', false, '[{"title": "Pact Verified Silver (Tier 1)", "awardedAt": "2026-11-10"}]'::jsonb),
  ('maria.testnet', 24.0, 'TIER_2_SINGLE_COUNCIL', 2, 8.0, '8000000000000000000000000', false, '[{"title": "Pact Verified Bronze (Tier 2)", "awardedAt": "2026-11-10"}]'::jsonb),
  ('newuser.testnet', 0.0, 'TIER_3_DAO_ESCALATION', 0, 0.0, '0', false, '[]'::jsonb),
  ('council.testnet', 210.0, 'TIER_1_AUTO', 9, 45.0, '45000000000000000000000000', true, '[{"title": "Sputnik DAO Council Member", "awardedAt": "2026-11-01"}]'::jsonb)
ON CONFLICT (account_id) DO NOTHING;

-- Seed used proof URLs to enforce deduplication
INSERT INTO used_proof_urls (proof_url, bounty_id, claimant)
VALUES 
  ('https://github.com/near/core-contracts/pull/412', 'bounty-5', 'alex.testnet'),
  ('https://github.com/pactt-protocol/audit/pull/5', 'bounty-6', 'chen.testnet')
ON CONFLICT (proof_url) DO NOTHING;
