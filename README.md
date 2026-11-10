# Pact Protocol

**Earned Trust Coordination Protocol for Sputnik DAOs on NEAR**

[![NEAR Protocol](https://img.shields.io/badge/NEAR-Testnet%20%7C%20Mainnet-000000.svg)](https://near.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-11%20Passing-brightgreen.svg)](https://github.com/youngcrypton/Pact)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

* **Track:** Social Money (`social`)
* **Target Ecosystem:** Shared community budgets, programmable rewards, and reputation-based access on Sputnik DAO and Trezu.
* **Repository:** [https://github.com/youngcrypton/Pact](https://github.com/youngcrypton/Pact)

---

## Overview

Pact is an Earned Trust Coordination Protocol designed to eliminate governance bottlenecks in NEAR decentralized autonomous organizations (DAOs).

In standard multi-sig DAOs, council members experience substantial voting fatigue: routine micro-tasks (such as small bug fixes, translation, or documentation updates) require a formal proposal, a bond deposit, and multi-signature quorum. Simultaneously, standard DAOs have no native mechanism to track contributor reputation; a developer who has shipped 30 successful tasks is treated with the same bureaucratic scrutiny as an unverified address.

Pact resolves these frictions without transferring treasury custody away from the DAO. Treasury custody and high-value decisions remain secured within the Sputnik DAO smart contract, while Pact acts as an intelligent trust and approval routing layer that introduces 3-Tier Dynamic Approvals and verifiable on-chain reputation badges via NEAR Social.

```
       [ Contributor Submits Work (GitHub PR) ]
                          |
                          v
               +---------------------+
               |  Pact Trust Engine  |
               +----------+----------+
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
   [ Tier 1: Auto ] [ Tier 2: Expedited ] [ Tier 3: DAO ]
   - Reward <= 5 N  - Reward <= 25 N      - Reward > 25 N
   - Trust >= 50 pt - Trust >= 20 pt      - Or Newbies (< 20 pt)
   - Instant Payout - 1 Council Sign-Off  - Full Council Quorum
```

---

## Problem Analysis

An audit of the official Sputnik DAO v2 smart contract source code (`near-daos/sputnik-dao-contract`) reveals three structural governance constraints:

1. **Contributor Amnesia (`sputnikdao2/src/bounties.rs`):**  
   Sputnik DAO only stores active bounty claims (`bounty_claimers`). Upon completion, the contract invokes `internal_remove_claim`, permanently deleting claim records to reclaim storage gas. There is no historical reputation ledger or cumulative contribution record. Every participant is evaluated as a new address.

2. **Voting Fatigue (`sputnikdao2/src/proposals.rs`):**  
   Disbursing funds requires creating a formal proposal of type `ProposalKind::BountyDone` and attaching a proposal bond (typically 1 NEAR). For routine micro-tasks, 3 to 5 council members must individually log in, connect wallets, and sign on-chain transactions, causing significant overhead.

3. **Quorum Bottlenecks (`sputnikdao2/src/policy.rs`):**  
   Voting policies require strict majority quorum (`WeightOrRatio::Ratio(1, 2)`). If council members are unavailable or traveling, proposals stall, delaying payouts for contributors who have delivered verified work.

---

## Architecture: 3-Tier Dynamic Approvals

Pact routes task completions through three distinct approval paths based on the financial threshold and the contributor's verified on-chain trust score:

| Approval Tier | Payout Ceiling | Trust Requirement | Approval Mechanism | Risk Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Instant Auto-Payout** | <= 5 NEAR | >= 50 Trust Points | Instant settlement upon GitHub PR verification. Zero council overhead. | Daily working pool limit; restricted to established contributors. |
| **Tier 2: Single-Council Sign-Off** | <= 25 NEAR | >= 20 Trust Points | Single-council member approval (first available signer releases funds). | Removes majority quorum latency for trusted regulars. |
| **Tier 3: Sputnik DAO Escalation** | > 25 NEAR | Any / Newbies (< 20 pts) | Automatic proposal creation via `add_proposal` on Sputnik DAO. | Multi-signature DAO custody protects treasury against large capital outflows. |

### Trust Scoring Algorithm

Trust points are calculated programmatically upon validated bounty completion:

$$\text{Trust Points} = \text{Base Points (10)} + (5 \times \text{Reward in NEAR})$$

* Contributor tiers:
  * **Newbie (0 - 19 Points):** All submissions route to Tier 3 Sputnik DAO governance.
  * **Contributor (20 - 49 Points):** Unlocks Tier 2 single-council expedited review.
  * **Trusted Core (50+ Points):** Unlocks Tier 1 instant auto-approvals for bounties up to 5 NEAR.

---

## Protocol Integrations

### 1. Sputnik DAO v2
For Tier 3 transactions, Pact generates and serializes compliant `add_proposal` calls targeting Sputnik DAO v2 (`dev-community.sputnik-dao.testnet` / Astro DAO):
* Generates `Transfer` or `BountyDone` proposal kinds.
* Attaches the required governance bond (`1 NEAR`).
* Enforces on-chain council quorum rules.

### 2. NEAR Social (SocialDB)
Reputation is exported to NEAR's native social data layer (`v1.social08.testnet` / `social.near`):
* Issues NEP-BOS compliant profile badge records:
  * `Pact Core Contributor (Tier 1)`
  * `Pact Verified Contributor (Tier 2)`
* Broadcasts on-chain notifications to the contributor's account on [near.social](https://near.social).

### 3. GitHub Proof Verifier
Validates contributor pull requests and commits before state transitions:
* Verifies repository ownership, branch status, and PR identifiers.
* Filters invalid URLs and submission attempts.

---

## Verification & Testing

The protocol includes an automated test suite and an interactive simulation runner requiring only Node.js (v18+).

### 1. Installation
```bash
git clone https://github.com/youngcrypton/Pact.git
cd Pact
npm install
```

### 2. Run Automated Verification Tests
```bash
npm test
```
All 11 unit and integration tests run in under 2 seconds:
* Verifies Tier 3 Sputnik DAO proposal creation for large tasks and new contributors.
* Verifies Tier 2 single-council expedited sign-off.
* Verifies Tier 1 zero-delay auto-approval for trusted contributors.
* Validates REST API endpoints and error handling.

### 3. Run End-to-End Simulation
```bash
npm run demo
```
Executes a full terminal simulation demonstrating the end-to-end lifecycle across all three tiers, printing the resulting contributor leaderboard and NEAR Social badge payloads.

### 4. Start Local REST API
```bash
npm run api
```
Starts the native HTTP API server on `http://localhost:3001` with CORS enabled to serve frontend clients.

---

## REST API Reference

The backend exposes a lightweight REST interface on port `3001`:

| Endpoint | Method | Purpose | Request Body |
| :--- | :---: | :--- | :--- |
| `/api/bounties` | `GET` | List active and historical bounties | None |
| `/api/bounties` | `POST` | Create a new bounty | `{ title, description, rewardNear, category, deadlineDays }` |
| `/api/bounties/:id/claim` | `POST` | Claim an open bounty | `{ accountId }` |
| `/api/bounties/:id/submit`| `POST` | Submit work proof and trigger tier routing | `{ accountId, proofUrl }` |
| `/api/bounties/:id/approve`| `POST`| Single-council sign-off (Tier 2) | `{ councilAccountId }` |
| `/api/leaderboard` | `GET` | Retrieve contributor reputation rankings | None |
| `/api/health` | `GET` | System health and network status | None |

---

## Repository Structure

```text
Pact/
|-- FRONTEND.md              # Client integration guide and Supabase service
|-- docs/
|   `-- FRONTEND_INTEGRATION.md  # Client integration guide and component specifications
|-- scripts/
|   |-- demo-simulation.ts       # Interactive lifecycle simulation
|   |-- deploy-testnet.ts        # NEAR Testnet deployment helper
|   |-- seed-bounties.ts         # Generates initial mock data
|   |-- supabase-schema.sql      # Supabase cloud schema and seed data
|   `-- validate-submission.ts   # Hackathon payload validation
|-- src/
|   |-- bounty-contract.ts       # Protocol state machine and lifecycle methods
|   |-- config.ts                # Network endpoints and contract addresses
|   |-- github-verifier.ts       # Pull request verification logic
|   |-- index.ts                 # Main protocol entry point
|   |-- near-social.ts           # SocialDB NEP-BOS badge payload generator
|   |-- server.ts                # Native REST API server
|   |-- sputnik-connector.ts     # Sputnik DAO v2 proposal serializer
|   `-- types.ts                 # Shared data structures and interfaces
|-- tests/
|   |-- api.test.ts              # REST API integration tests
|   `-- trust-engine.test.ts     # 3-Tier approval and trust scoring tests
|-- .env.example                 # Environment configuration template
|-- .gitignore                   # Standard ignore rules
|-- LICENSE                      # MIT License
|-- package.json                 # Project configuration and scripts
|-- package-lock.json            # Deterministic dependency lockfile
`-- tsconfig.json                # TypeScript compiler configuration
```

---

## License

This software is released under the [MIT License](LICENSE).
