# Pact — React Frontend Integration Guide

Welcome! This guide outlines how to connect your React frontend to the Pact Protocol data and approval engine.

You can connect in two ways:
* **Option 1 (Recommended / Zero Localhost): Direct Cloud via Supabase** — Cloud database ready for production and live deployment.
* **Option 2: Localhost REST API** — Local HTTP server running on port `3001`.

---

## Option 1: Direct Cloud via Supabase (Zero Localhost)

To avoid running a local backend server on your machine, Pact supports direct cloud communication via Supabase.

### 1. Database Setup
Run the SQL migration script from [`scripts/supabase-schema.sql`](../scripts/supabase-schema.sql) in your Supabase SQL Editor. This automatically creates:
* `bounties` table (pre-seeded with 5 realistic bounties)
* `contributors` table (pre-seeded with test personas)
* Row Level Security (RLS) policies for public client access

### 2. Service Implementation (`src/services/pactService.js`)
Add this helper to your project using your existing `src/supabase.js` client:

```javascript
import { supabase } from '../supabase';

export const PactService = {
  // Fetch active bounties
  async getBounties() {
    const { data } = await supabase.from('bounties').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  // Contributor claims a bounty
  async claimBounty(bountyId, accountId) {
    return supabase.from('bounties').update({
      status: 'CLAIMED',
      claimed_by: accountId,
      updated_at: new Date()
    }).eq('id', bountyId);
  },

  // Submit GitHub PR proof and trigger the 3-Tier Approval Engine
  async submitWork(bountyId, accountId, proofUrl) {
    const { data: bounty } = await supabase.from('bounties').select('*').eq('id', bountyId).single();
    const { data: contributor } = await supabase.from('contributors').select('*').eq('account_id', accountId).single();

    const trustScore = contributor?.trust_points || 0;
    const reward = Number(bounty.reward_near);

    let newStatus = 'IN_REVIEW';
    let assignedTier = 'TIER_2_SINGLE_COUNCIL';

    // 3-Tier Evaluation Logic
    if (reward <= 5 && trustScore >= 50) {
      newStatus = 'APPROVED'; // Tier 1: Instant Auto-Payout
      assignedTier = 'TIER_1_AUTO';
    } else if (reward <= 25 && trustScore >= 20) {
      newStatus = 'IN_REVIEW'; // Tier 2: Single-Council Sign-Off
      assignedTier = 'TIER_2_SINGLE_COUNCIL';
    } else {
      newStatus = 'ESCALATED_TO_DAO'; // Tier 3: Escalate to Sputnik DAO Council
      assignedTier = 'TIER_3_DAO_ESCALATION';
    }

    await supabase.from('bounties').update({
      status: newStatus,
      approval_tier: assignedTier,
      proof_url: proofUrl,
      updated_at: new Date()
    }).eq('id', bountyId);

    // Auto-award trust points if Tier 1
    if (newStatus === 'APPROVED') {
      const earnedPoints = 10 + (5 * reward);
      await supabase.from('contributors').upsert({
        account_id: accountId,
        trust_points: trustScore + earnedPoints,
        completed_bounties_count: (contributor?.completed_bounties_count || 0) + 1,
        total_earned_near: Number(contributor?.total_earned_near || 0) + reward,
        current_tier: trustScore + earnedPoints >= 50 ? 'TRUSTED_CORE' : 'CONTRIBUTOR',
        updated_at: new Date()
      });
    }

    return { status: newStatus, tier: assignedTier };
  },

  // Single-Council member approves a Tier 2 bounty
  async approveAsCouncil(bountyId) {
    const { data: bounty } = await supabase.from('bounties').select('*').eq('id', bountyId).single();
    const reward = Number(bounty.reward_near);
    const accountId = bounty.claimed_by;

    await supabase.from('bounties').update({ status: 'APPROVED', updated_at: new Date() }).eq('id', bountyId);

    const { data: contributor } = await supabase.from('contributors').select('*').eq('account_id', accountId).single();
    const currentPoints = contributor?.trust_points || 0;
    const earnedPoints = 10 + (5 * reward);

    await supabase.from('contributors').upsert({
      account_id: accountId,
      trust_points: currentPoints + earnedPoints,
      completed_bounties_count: (contributor?.completed_bounties_count || 0) + 1,
      total_earned_near: Number(contributor?.total_earned_near || 0) + reward,
      current_tier: currentPoints + earnedPoints >= 50 ? 'TRUSTED_CORE' : 'CONTRIBUTOR',
      updated_at: new Date()
    });
  },

  // Fetch contributor trust leaderboard
  async getLeaderboard() {
    const { data } = await supabase.from('contributors').select('*').order('trust_points', { ascending: false });
    return data || [];
  }
};
```

---

## Option 2: Localhost REST API

If running the backend locally:

1. Start the API server in the backend workspace:
   ```bash
   npm run api
   ```
2. The server runs on `http://localhost:3001` with full CORS enabled.

### Endpoints
* `GET /api/bounties` — Returns all bounties.
* `POST /api/bounties/:id/claim` — Body: `{ "accountId": "alice.testnet" }`
* `POST /api/bounties/:id/submit` — Body: `{ "accountId": "alice.testnet", "proofUrl": "https://github.com/..." }`
* `POST /api/bounties/:id/approve` — Body: `{ "councilAccountId": "council.testnet" }`
* `GET /api/leaderboard` — Returns rankings, points, and badges.

---

## Test Personas (For Demo & Verification)

| Account ID | Trust Score | Tier Status | Behavior |
| :--- | :---: | :--- | :--- |
| **`alice.testnet`** | **60 pts** | **Trusted Core** | Submitting a small bounty ($\le 5\text{ NEAR}$) **instantly auto-approves** with zero council delay! |
| **`carol.testnet`** | **25 pts** | **Contributor** | Submitting a 15 NEAR task queues for **single-council sign-off**. |
| **`bob.testnet`** | **0 pts** | **Newbie** | Submitting a task escalates to **Sputnik DAO council quorum**. |
| **`council.testnet`** | — | **Council Member** | Can sign off on Tier 2 bounties. |
