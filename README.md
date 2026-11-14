<p align="center">
  <a href="https://pactt.xyz/">
    <img src="docs/assets/pactt-logo.svg" width="96" height="96" alt="Pactt" />
  </a>
</p>

<h1 align="center">Pactt</h1>

<p align="center">
  <strong>Earned Trust Coordination Layer for Sputnik DAOs on NEAR</strong>
</p>

<p align="center">
  <a href="https://near.org"><img src="https://img.shields.io/badge/NEAR-Protocol-000000.svg" alt="NEAR Protocol" /></a>
  <a href="https://github.com/youngcrypton/Pactt"><img src="https://img.shields.io/badge/Tests-33%20Passing-10b981.svg" alt="Tests" /></a>
  <a href="https://pactt.xyz/"><img src="https://img.shields.io/badge/Live%20App-pactt.xyz-10b981.svg" alt="Live App" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" /></a>
</p>

---

## Overview

**Pactt** is an Earned Trust Coordination Protocol on NEAR designed to eliminate governance bottlenecks and voting fatigue in decentralized autonomous organizations (DAOs).

In standard multi-sig DAOs like **Sputnik DAO v2**, councils face extreme friction: routine micro-tasks (small bug fixes, documentation, or community moderation) require a formal proposal, a bond deposit, and majority council quorum. Furthermore, completed claim records are deleted on-chain to reclaim storage gas, meaning veteran contributors with dozens of successful deliverables are treated with the exact same bureaucratic delay as a brand-new address.

Instead of replacing the multisig, Pactt acts as an intelligent trust routing layer on top of **Sputnik DAO** and **Trezu**:
* **High-value capital protection:** Large treasury allocations remain governed by full Sputnik DAO multi-sig.
* **Earned trust acceleration:** Routine bounties auto-payout instantly for verified contributors based on accumulated reputation.
* **Portable Web3 CV:** Verified completions mint permanent, non-transferable reputation badges directly to **NEAR Social (SocialDB)**.

```
                      [ Contributor Submits Work (GitHub PR) ]
                                         |
                                         v
                            +--------------------------+
                            |    Pactt Trust Engine    |
                            |   Evaluates Trust & NEAR |
                            +-------------+------------+
                                          |
                +-------------------------+-------------------------+
                |                         |                         |
                v                         v                         v
     [ Tier 1: Auto-Payout ]   [ Tier 2: Single-Council ]   [ Tier 3: Sputnik DAO ]
     * Reward <= 5 NEAR        * Reward <= 25 NEAR          * Reward > 25 NEAR
     * Trust >= 50 Points      * Trust >= 20 Points         * Or Newbies (< 20 pts)
     * Instant Settlement      * 1 Council Sign-Off         * Full Council Quorum
     * Zero Council Delay      * Fast-Track Disbursal       * Sputnik add_proposal
```

---

## Why Sputnik DAOs Need an Earned Trust Layer

An analysis of the official Sputnik DAO v2 smart contract source code (`sputnikdao2`) highlights three structural constraints:

1. **Contributor Amnesia (`bounties.rs`):**  
   `internal_remove_claim` deletes claim records upon completion to reclaim storage gas. There is no cumulative contribution history or reputation score.
2. **Council Voting Fatigue (`proposals.rs`):**  
   Disbursing funds requires a formal `ProposalKind::BountyDone` proposal and a proposal bond. Routine 2–5 NEAR bounties require 3 to 5 council members to individually log in and sign on-chain transactions.
3. **Quorum Bottlenecks (`policy.rs`):**  
   Strict majority voting policies (`WeightOrRatio::Ratio(1, 2)`) delay payouts when council members are unavailable or traveling.

Pactt resolves these issues by letting contributors earn trust points that unlock autonomous settlement while preserving DAO treasury custody.

---

## 3-Tier Dynamic Approvals

| Approval Tier | Payout Threshold | Trust Score Required | Governance Mechanism | Security Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Instant Auto-Payout** | $\le 5\text{ NEAR}$ | $\ge 50\text{ Points}$ | Instant disbursement upon PR verification. Zero council overhead. | Rolling 24h velocity cap (max 2 auto-payouts/day). |
| **Tier 2: Single-Council Sign-Off** | $\le 25\text{ NEAR}$ | $\ge 20\text{ Points}$ | Fast-tracks payout with a single council signature. | Bypasses majority quorum for trusted regulars. |
| **Tier 3: Sputnik DAO Escalation** | $> 25\text{ NEAR}$ | Any / Newbies ($< 20\text{ pts}$) | Automatically creates a formal Sputnik DAO `add_proposal`. | Multi-sig consensus protects treasury custody. |

### Trust Scoring Algorithm
Trust points are awarded deterministically upon verified task completion:

$$\text{Trust Points Earned} = 10 + (5 \times \text{Reward in NEAR})$$

* **Newbie (0 – 19 Points):** Submissions route to **Tier 3** Sputnik DAO governance.
* **Contributor (20 – 49 Points):** Unlocks **Tier 2** single-council expedited review.
* **Trusted Core (50+ Points):** Unlocks **Tier 1** instant auto-settlement for bounties up to 5 NEAR.

---

## Key Features & Security Architecture

* **NEAR Social (SocialDB) Badges:** Mints NEP-BOS compliant contributor badges (`v1.social08.testnet` / `social.near`), turning task completions into portable Web3 credentials on near.social.
* **Anti-Cheat & PR Deduplication:** Normalized PR URL hashing prevents duplicate or recycled submissions across multiple bounties.
* **Atomic Claim Locks:** Concurrency control prevents race-condition double-claiming on open bounties.
* **Escrow Custody Gate:** Enforces escrow funding verification (`ESCROWED` $\rightarrow$ `DISBURSED` / `REFUNDED`), preventing claims on unfunded tasks.
* **Rolling 24-Hour Velocity Cap:** Limits instant payouts to 2 per contributor every 24 hours, automatically routing subsequent tasks to Tier 2 to prevent treasury draining.
* **24-Hour Council Challenge Window:** Gives authorized council members 24 hours to dispute fraudulent submissions, reversing approvals and slashing 50 trust points.
* **Exact $10^{24}$ YoctoNEAR Precision:** Native JavaScript `BigInt` eliminates floating-point drift across all financial settlements.
* **NEP-413 Cryptographic Authentication:** Ed25519 off-chain challenge signature verification supporting MyNearWallet, Meteor, Here, and custom testnet accounts.

---

## Getting Started & Verification

The protocol test suite and simulation can be executed locally requiring only Node.js (v18+):

### 1. Installation
```bash
git clone https://github.com/youngcrypton/Pactt.git
cd Pactt
npm install
```

### 2. Run Automated Verification Tests
```bash
npm test
```
All **33 unit and integration tests** pass across 4 comprehensive suites in ~2.2 seconds:
* **Pact API Integration (13 tests):** Validates REST endpoints, escrow custody, and storage persistence.
* **Resilient Storage Architecture (3 tests):** Validates Supabase PostgreSQL sync and offline disk hydration across restarts.
* **Tiered Approvals & Trust Engine (13 tests):** Validates Tier 1 auto-settlement, Tier 2 council sign-off, Tier 3 Sputnik escalation, BigInt precision, PR deduplication, velocity caps, and council dispute slashing.
* **NEAR Wallet & NEP-413 Auth (4 tests):** Validates cryptographic Ed25519 signature signing, verification, and challenge generation.

### 3. Run End-to-End Terminal Simulation
```bash
npm run demo
```
Executes the complete lifecycle simulation across all three tiers, outputting the updated leaderboard and the NEAR Social badge payload.

### 4. Build for Production & Local Preview
```bash
# Build the edge distribution bundle
npm run build

# Start local preview server (Port 3000)
node dist/preview/server.mjs
```
Serves the responsive protocol interface on `http://localhost:3000`.

---

## REST API Reference

| Endpoint | Method | Purpose | Request Body |
| :--- | :---: | :--- | :--- |
| `/api/bounties` | `GET` | List active and historical community bounties | None |
| `/api/bounties` | `POST` | Create a new escrowed bounty | `{ title, description, amount_formatted, category, created_by }` |
| `/api/bounties/:id/claim` | `POST` | Claim an open bounty (Atomic lock guard) | `{ account_id }` |
| `/api/bounties/:id/submit`| `POST` | Submit deliverable proof & trigger tier routing | `{ contributor_id, proof_url, notes }` |
| `/api/bounties/:id/approve`| `POST`| Single-council sign-off (Tier 2) | `{ council_account_id }` |
| `/api/bounties/:id/challenge`| `POST`| 24h council dispute & reputation slash | `{ council_account_id, reason, slash_points }` |
| `/api/escrow` | `GET` | Escrow vault metrics & yoctoNEAR breakdown | None |
| `/api/storage` | `GET` | Storage engine status (Supabase cloud vs local) | None |
| `/api/leaderboard` | `GET` | Retrieve contributor reputation rankings | None |
| `/api/health` | `GET` | System health, protocol status, and timestamp | None |

---

## Repository Structure

```text
Pactt/
|-- docs/
|   |-- assets/
|   |   `-- pactt-logo.svg           # Vector protocol emblem
|   `-- FRONTEND_INTEGRATION.md      # Client integration guide and service specs
|-- FRONTEND.md                      # Supabase drop-in service implementation
|-- scripts/
|   |-- broadcast-testnet.ts         # Live on-chain NEAR Social broadcast script
|   |-- demo-simulation.ts           # Interactive terminal lifecycle simulation
|   |-- deploy-testnet.ts            # Testnet deployment guide
|   |-- prepare-dist.mjs             # Edge build packager
|   |-- seed-bounties.ts             # Initial mock data generator
|   |-- supabase-schema.sql          # Supabase PostgreSQL schema and seed data
|   |-- sync-supabase.mjs            # Cloud PostgreSQL synchronization script
|   `-- validate-submission.ts       # Submission payload validator
|-- src/
|   |-- bounty-contract.ts           # Protocol state machine and lifecycle methods
|   |-- config.ts                    # Network endpoints and contract addresses
|   |-- github-verifier.ts           # Pull request and commit verifier
|   |-- index.ts                     # Protocol entry point
|   |-- near-social.ts               # SocialDB NEP-BOS badge payload generator
|   |-- near-wallet.ts               # NEP-413 cryptographic authentication helper
|   |-- server.ts                    # REST API server
|   |-- sputnik-connector.ts         # Sputnik DAO v2 proposal serializer
|   |-- storage.ts                   # Resilient cloud and local storage engine
|   |-- trust-engine.ts              # 3-Tier approval and trust scoring engine
|   |-- types.ts                     # Shared interfaces and types
|   |-- worker.ts                    # Cloudflare Edge Worker API handler
|   `-- preview/
|       |-- index.html               # Responsive frontend client
|       `-- server.mjs               # Local preview proxy server
|-- tests/
|   |-- api.test.ts                  # REST API integration tests (13 tests)
|   |-- storage.test.ts              # Persistence and crash recovery tests (3 tests)
|   |-- trust-engine.test.ts         # 3-Tier approvals and anti-cheat tests (13 tests)
|   `-- wallet.test.ts               # Cryptographic NEP-413 wallet auth tests (4 tests)
|-- .env.example                     # Environment configuration template
|-- .gitignore                       # Standard ignore rules
|-- LICENSE                          # MIT License
|-- package.json                     # Project scripts and dependencies
`-- tsconfig.json                    # TypeScript compiler configuration
```

---

## License

This project is licensed under the [MIT License](LICENSE).
