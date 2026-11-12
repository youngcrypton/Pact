# Pact — Frontend Integration Guide

This guide provides instructions and drop-in code for connecting any React/Vite frontend to the Pact Protocol.

Two connection modes are supported:
1. **Cloud Supabase (Recommended / Zero Localhost):** No need to run a local server; data and approval tiers run live in the cloud.
2. **Local REST API:** Local HTTP server running on port `3001` with CORS enabled.

---

## 1. Cloud Supabase Setup (Zero Localhost)

### Step A: Initialize the Database
Open your Supabase Project Dashboard -> **SQL Editor**, paste and run the SQL migration script from [`scripts/supabase-schema.sql`](scripts/supabase-schema.sql).

This sets up:
* `bounties` table (pre-populated with 5 active community bounties).
* `contributors` table (pre-populated with test trust scores and badges).
* Public read and write permissions (RLS) for seamless client testing.

### Step B: Drop-In Service (`src/services/pactService.js`)
Create this file in your frontend repository to communicate with Supabase using your existing `src/supabase.js` client:

```javascript
import { supabase } from '../supabase';

export const PactService = {
  // 1. Fetch active bounties
  async getBounties() {
    const { data, error } = await supabase
      .from('bounties')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching bounties:', error);
    return data || [];
  },

  // 2. Contributor claims a bounty
  async claimBounty(bountyId, accountId) {
    return supabase
      .from('bounties')
      .update({ status: 'CLAIMED', claimed_by: accountId, updated_at: new Date() })
      .eq('id', bountyId);
  },

  // 3. Contributor submits GitHub PR link (Triggers 3-Tier Dynamic Routing)
  async submitWork(bountyId, accountId, proofUrl) {
    const { data: bounty } = await supabase.from('bounties').select('*').eq('id', bountyId).single();
    const { data: contributor } = await supabase.from('contributors').select('*').eq('account_id', accountId).single();

    const trustScore = contributor?.trust_points || 0;
    const reward = Number(bounty.reward_near);

    let newStatus = 'IN_REVIEW';
    let assignedTier = 'TIER_2_SINGLE_COUNCIL';

    // 3-Tier Evaluation Engine
    if (reward <= 5 && trustScore >= 50) {
      newStatus = 'APPROVED'; // Tier 1: Instant Auto-Payout (Zero council clicks)
      assignedTier = 'TIER_1_AUTO';
    } else if (reward <= 25 && trustScore >= 20) {
      newStatus = 'IN_REVIEW'; // Tier 2: Single-Council Sign-Off
      assignedTier = 'TIER_2_SINGLE_COUNCIL';
    } else {
      newStatus = 'ESCALATED_TO_DAO'; // Tier 3: Escalate to Sputnik DAO Council Vote
      assignedTier = 'TIER_3_DAO_ESCALATION';
    }

    await supabase.from('bounties').update({
      status: newStatus,
      approval_tier: assignedTier,
      proof_url: proofUrl,
      updated_at: new Date()
    }).eq('id', bountyId);

    // If Tier 1 auto-approved, award trust points immediately
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

  // 4. Council Member signs off on Tier 2
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

  // 5. Fetch Real-Time Leaderboard
  async getLeaderboard() {
    const { data } = await supabase
      .from('contributors')
      .select('*')
      .order('trust_points', { ascending: false });
    return data || [];
  }
};
```

---

## 2. Local REST API Option (Alternative)

If testing against the local Node.js backend:
* Start the server: `npm run api`
* Base URL: `http://localhost:3001/api`
* Endpoints:
  * `GET /api/bounties`
  * `POST /api/bounties/:id/claim` — `{ "accountId": "alice.testnet" }`
  * `POST /api/bounties/:id/submit` — `{ "accountId": "alice.testnet", "proofUrl": "https://github.com/..." }`
  * `POST /api/bounties/:id/approve` — `{ "councilAccountId": "council.testnet" }`
  * `GET /api/leaderboard`

---

## 3. Test Personas for UI Verification

| Account ID | Trust Score | Role | Expected UI Behavior |
| :--- | :---: | :--- | :--- |
| **`alice.testnet`** | **60 pts** | **Trusted Core** | Submitting a small bounty ($\le 5\text{ NEAR}$) **instantly auto-approves** without council vote! |
| **`carol.testnet`** | **25 pts** | **Contributor** | Submitting a mid-size bounty queues for **1 council member sign-off**. |
| **`bob.testnet`** | **0 pts** | **Newbie** | Submitting any bounty escalates to **Sputnik DAO council quorum**. |
| **`council.testnet`** | — | **Council Member** | Can click the single-click **Approve** button on Tier 2 bounties. |

