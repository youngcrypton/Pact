# Pact — React Frontend Integration Guide

Welcome! This guide gives you everything you need to connect your React frontend to the Pact Protocol backend.

---

## 1. Quickstart (How to Run the Backend)

1. In the backend directory (`NEAR HACK`), start the local API server:
   ```bash
   npm run api
   ```
2. The server starts on:
   ```text
   http://localhost:3001
   ```
3. Full **CORS is enabled**, so your React app running on `http://localhost:3000` (or `http://localhost:5173` via Vite) can directly call these endpoints without proxy issues.

---

## 2. API Endpoints

**Base URL:** `http://localhost:3001/api`

### `GET /api/bounties`
Returns all bounties (supports optional query filters `?status=OPEN` or `?limit=10`).

**Response Shape:**
```json
{
  "bounties": [
    {
      "id": "bounty-1",
      "title": "Implement NEP-171 NFT Metadata Parser",
      "description": "Write a lightweight parser for standard NEAR NFT metadata.",
      "amount_formatted": 3.5,
      "amount_near": "3500000000000000000000000",
      "category": "DEV",
      "status": "OPEN",
      "required_tier": "TIER_3_FULL_DAO",
      "created_by": "devhub.sputnik-dao.testnet",
      "claimed_by": null,
      "proof_url": null,
      "created_at": 1794240000000
    }
  ],
  "total": 1
}
```

### `GET /api/bounties/:id`
Returns a specific bounty object.

---

### `POST /api/bounties/:id/claim`
Claims an open bounty for a specific contributor.

**Request Body:**
```json
{
  "account_id": "alice.testnet"
}
```

---

### `POST /api/bounties/:id/submit`
Submits proof of work (GitHub PR link). **This triggers the 3-Tier Earned Trust Engine!**

**Request Body:**
```json
{
  "contributor_id": "alice.testnet",
  "proof_url": "https://github.com/near/nep-171/pull/15",
  "notes": "Finished parser implementation and added unit tests."
}
```

**Response Scenarios:**
* **If Tier 1 (Small payout & High Trust Score):**
  * Status becomes `APPROVED` instantly.
  * Auto-payout released.
  * Trust points awarded.
* **If Tier 2 (Mid-size payout & Moderate Trust Score):**
  * Status becomes `IN_REVIEW`.
  * Moves to the Council Review Queue.
* **If Tier 3 (Large payout or New Contributor):**
  * Status becomes `ESCALATED_TO_DAO`.
  * Returns `sputnik_proposal_id` for full council voting.

---

### `POST /api/bounties/:id/approve`
Single-Council expedited approval (for Tier 2 bounties in `IN_REVIEW` status).

**Request Body:**
```json
{
  "council_account_id": "council.testnet"
}
```

---

### `GET /api/contributors/:account_id`
Returns contributor reputation, trust score, and tier badges.

**Response Shape:**
```json
{
  "account_id": "alice.testnet",
  "trust_score": 75,
  "completed_bounties_count": 4,
  "total_earned_formatted": 15.5,
  "current_tier": "TRUSTED_CORE",
  "near_social_badge_minted": true,
  "history": [
    {
      "bounty_id": "bounty-1",
      "points_awarded": 27,
      "timestamp": 1794241000000,
      "reason": "Completed Bounty: Implement NEP-171 NFT Metadata Parser"
    }
  ]
}
```

---

### `GET /api/leaderboard`
Returns top contributors ranked by trust score.

---

## 3. Test Personas (For UI Testing)

You can switch between these personas to test each tier:

| Persona Account | Trust Level | Expected Behavior |
| :--- | :--- | :--- |
| **`alice.testnet`** | **Trusted Core (Score $\ge 50$)** | Submitting a $\le 5\text{ NEAR}$ bounty will **instantly auto-approve**! |
| **`bob-newbie.testnet`** | **New Contributor (Score 0)** | Submitting any bounty will escalate to Sputnik DAO (`ESCALATED_TO_DAO`). |
| **`council.testnet`** | **Council Member** | Can click the single-click **Approve** button on Tier 2 bounties. |

---

## 4. Shared TypeScript Definitions

You can copy [`src/types.ts`](file:///C:/Users/NEAR%20HACK/src/types.ts) directly into your React project for full autocomplete and type safety.

