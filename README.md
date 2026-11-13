<p align="center">
  <a href="https://pactt.terminall.workers.dev/">
    <img src="docs/assets/pactt-logo.svg" width="96" height="96" alt="Pactt Protocol Logo" />
  </a>
</p>

<h1 align="center">Pactt Protocol</h1>

<p align="center">
  <strong>Earned Trust Coordination Protocol for Sputnik DAOs on NEAR</strong>
</p>

<p align="center">
  <a href="https://near.org"><img src="https://img.shields.io/badge/NEAR-Testnet%20%7C%20Mainnet-000000.svg" alt="NEAR Protocol" /></a>
  <a href="https://github.com/youngcrypton/Pactt/blob/main/HACKATHON.md"><img src="https://img.shields.io/badge/Track-Social%20Money%20(social)-7c3aed.svg" alt="NEAR Hackathon Track" /></a>
  <a href="https://github.com/youngcrypton/Pactt"><img src="https://img.shields.io/badge/Tests-33%20Passing-10b981.svg" alt="Tests" /></a>
  <a href="https://pactt.terminall.workers.dev/"><img src="https://img.shields.io/badge/Deployed-pactt.terminall.workers.dev-orange.svg?logo=cloudflare" alt="Cloudflare Workers" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg?logo=supabase" alt="Supabase" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" /></a>
</p>

---

## Quick Navigation

| Resource | Link | Description |
| :--- | :--- | :--- |
| **Live Production App** | [https://pactt.terminall.workers.dev/](https://pactt.terminall.workers.dev/) | Live multi-user protocol interface deployed on Cloudflare Workers edge |
| **GitHub Repository** | [https://github.com/youngcrypton/Pactt](https://github.com/youngcrypton/Pactt) | Source code, test runner, and protocol coordination engine |
| **Hackathon Track** | `social` (Social Money) | Shared budgets, programmable rewards, and reputation on Sputnik DAO |
| **Target Ecosystem** | Sputnik DAO v2, Trezu, NEAR Social (SocialDB), Named Accounts |
| **Testnet Protocol Account** | [`pact-dao-064783.testnet`](https://testnet.nearblocks.io/address/pact-dao-064783.testnet) | Live on-chain badge minter on NEAR Testnet |

---

## Track Alignment: Social Money (`social`)

The official NEAR Hackathon track specification for **Social Money (`social`)** dictates:

> *"Build shared budgets, programmable rewards, collective ownership and reputation-based access on top of Sputnik DAO and Trezu. Don't rebuild the multisig — build what communities do with it."*  
> *Hints: SPUTNIK DAO, TREZU, NAMED ACCOUNTS*

Pactt is built specifically around this philosophy:
1. **Don't rebuild the multisig:** Treasury custody and high-value approvals remain secured inside the battle-tested Sputnik DAO v2 smart contract (`sputnikdao2`).
2. **Build what communities do with it:** Pactt introduces an **Earned Trust routing layer** directly on top of Sputnik DAO. It eliminates council voting fatigue on routine micro-bounties and converts completed work into verifiable, portable Web3 reputation badges on NEAR Social (`v1.social08.testnet`).
3. **Named Accounts & Trezu:** Pactt leverages human-readable NEAR accounts (`alex.testnet`, `devhub.sputnik-dao.testnet`) and serializes compliant `add_proposal` calls for Trezu and Sputnik multi-sig quorum.

---

## The Problem: Sputnik DAO Structural Bottlenecks

An audit of the official Sputnik DAO v2 smart contract source code (`near-daos/sputnik-dao-contract`) reveals three structural governance bottlenecks that stall community growth:

```
+------------------------------------------------------------------------------------+
|                             SPUTNIK DAO v2 FRICTIONS                               |
+------------------------------------------------------------------------------------+
|  1. Contributor Amnesia (bounties.rs)                                              |
|     internal_remove_claim purges claim records on completion to reclaim storage   |
|     gas. A builder with 30 successful PRs is treated like an unverified address.   |
|                                                                                    |
|  2. Council Voting Fatigue (proposals.rs)                                          |
|     Every routine 2 NEAR micro-task requires a formal ProposalKind::BountyDone, a  |
|     1 NEAR proposal bond, and individual wallet signatures from 3-5 council members|
|                                                                                    |
|  3. Quorum Gridlocks (policy.rs)                                                   |
|     Majority ratio policy (WeightOrRatio::Ratio(1, 2)) delays contributor payouts |
|     for weeks when council members are traveling or offline.                       |
+------------------------------------------------------------------------------------+
```

---

## The Solution: 3-Tier Dynamic Approvals

Pactt acts as an intelligent routing layer between contributors and the Sputnik DAO treasury. Tasks flow dynamically based on the reward amount and the contributor's cumulative on-chain trust score:

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

### Trust Scoring Formula

Upon validated task completion, trust points are awarded deterministically:

$$\text{Trust Points Earned} = 10 + (5 \times \text{Reward in NEAR})$$

* **Newbie (0 – 19 Points):** Submissions route to **Tier 3** Sputnik DAO governance.
* **Contributor (20 – 49 Points):** Unlocks **Tier 2** single-council expedited review.
* **Trusted Core (50+ Points):** Unlocks **Tier 1** instant auto-approvals for bounties up to 5 NEAR.

---

## Core Protocol Architecture & Features

### 1. Sputnik DAO v2 Integration
For Tier 3 escalations, Pactt generates and serializes compliant `add_proposal` calls targeting Sputnik DAO v2 (`dev-community.sputnik-dao.testnet` / AstroDAO / Trezu):
* Formats `ProposalKind::Transfer` payloads with attached governance bond (`0.1 NEAR`).
* Enforces on-chain multi-sig council quorum rules without compromising treasury custody.

### 2. On-Chain Reputation via NEAR Social (SocialDB)
Reputation is permanently broadcast to NEAR's native social data layer (`v1.social08.testnet` / `social.near`):
* Mints NEP-BOS compliant profile badge records:
  * `Pact Core Contributor (Tier 1)`
  * `Pact Verified Contributor (Tier 2)`
* Broadcasts on-chain notifications to the contributor's profile on [near.social](https://near.social).

### 3. Anti-Cheat & Treasury Defense Engine
* **Deliverable Link Deduplication:** Tracks and hashes normalized PR URLs; rejects recycled or plagiarized proof links.
* **Atomic Claim Locks:** Concurrency locks guard against race-condition double-claiming.
* **Escrow Custody Gate:** Rejects task claims against unfunded or uncommitted bounties.
* **Rolling 24-Hour Velocity Cap:** Restricts contributors to a maximum of 2 instant auto-payouts in a rolling 24-hour window, automatically rerouting excess claims to Tier 2 single-council review to prevent flash-drain exploits.
* **24-Hour Council Challenge Window:** Gives authorized council members a 24-hour window to dispute fraudulent work, reversing approvals and slashing 50 trust points on-chain.
* **Exact $10^{24}$ YoctoNEAR Precision:** Native JavaScript `BigInt` eliminates floating-point rounding drift across all escrow records.

---

## Live On-Chain Verification (NEAR Testnet)

Pactt is verified against live NEAR Testnet ledger contracts. Inspect the live transactions directly on NearBlocks Explorer:

| Action | Target Contract | Method | Transaction Hash | Explorer Link |
| :--- | :--- | :---: | :--- | :--- |
| **Mint Contributor Badge** | `v1.social08.testnet` | `set` | `ExWvUsgiL5yb6Wwr7NuxAn637oufojuu7XkCWuAjFaJ8` | [View on NearBlocks](https://testnet.nearblocks.io/txns/ExWvUsgiL5yb6Wwr7NuxAn637oufojuu7XkCWuAjFaJ8) |
| **Account Creation & Funding** | `testnet` | `CreateAccount` | `Bf1P7pZpdgCVd76ooY9mF77wmPQpX3Z42JF5j2cCCHDT` | [View on NearBlocks](https://testnet.nearblocks.io/txns/Bf1P7pZpdgCVd76ooY9mF77wmPQpX3Z42JF5j2cCCHDT) |

* **Live Protocol Testnet Account:** [`pact-dao-064783.testnet`](https://testnet.nearblocks.io/address/pact-dao-064783.testnet)
* Anyone can re-broadcast live testnet badges at any time: `npm run broadcast`

---

## Verification & Testing ("Do X — See Y" for Judges)

Per hackathon screening requirements, the test suite and simulation can be executed locally in under 30 seconds using Node.js (v18+).

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
**See:** All **33 unit and integration tests** pass across 4 suites in ~2.4 seconds:
* **Pact API Server Integration (13 tests):** Validates all REST endpoints, CORS, escrow vault metrics, and persistence.
* **Cloud & Local Resilient Persistence (3 tests):** Validates Supabase PostgreSQL sync and offline file hydration across simulated crashes.
* **Tiered Approvals & Earned Trust Engine (13 tests):** Validates Tier 1 instant payouts, Tier 2 council sign-off, Tier 3 Sputnik DAO escalations, exact yoctoNEAR $10^{24}$ BigInt precision, atomic claim locks, PR deduplication, 24h velocity caps, and council dispute slashing.
* **NEAR Wallet Selector & NEP-413 Cryptographic Auth (4 tests):** Validates NEP-413 auth challenge generation, Ed25519 signature signing and verification via `near-api-js`, and named account rules.

### 3. Run Interactive Terminal Simulation
```bash
npm run demo
```
**See:** Executes the complete end-to-end lifecycle across all three tiers, outputting the contributor leaderboard and the NEAR Social badge payload.

### 4. Run On-Chain Testnet Broadcast
```bash
npm run broadcast
```
**See:** Connects to NEAR Testnet RPC, generates an account, and broadcasts a live badge transaction to `v1.social08.testnet`, printing the clickable NearBlocks link.

### 5. Build for Production & Run Local Preview
```bash
# Build the zero-dependency distribution bundle
npm run build

# Start local preview server on Port 3000
node dist/preview/server.mjs
```
**See:** Serves the full web client on `http://localhost:3000` with live Supabase cloud sync and edge fallback routing.

---

## REST API Reference

The backend exposes a lightweight REST interface (supported locally via `src/server.ts` and on the edge via Cloudflare Workers):

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

## Technology Stack & Libraries Disclosed

Per `HACKATHON.md` rule Q-005, all libraries, dependencies, and external frameworks are disclosed:

* **Blockchain & Cryptography:**
  * `near-api-js` (`^4.0.4`): NEAR RPC communication, NEP-413 payload generation, and Ed25519 cryptographic key-pair verification.
* **Frontend:**
  * Vanilla TypeScript & HTML5: Zero framework overhead, modular design.
  * Crypton Cyber-Monochrome Design System: Emerald glows (`#10b981`), high-contrast typography, responsive drawers, and bento telemetry.
* **Cloud & Serverless Hosting:**
  * Cloudflare Workers with Static Assets: Edge distribution at `https://pactt.terminall.workers.dev/`.
  * Supabase Cloud PostgreSQL: PostgREST cloud state synchronization with atomic local file fallback.
* **Developer Tooling & Testing:**
  * Node.js native test runner (`tsx --test`): Zero-overhead TypeScript execution.
  * TypeScript (`^5.7.2`): Strict type checking (ES2022 / NodeNext modules).

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
|   |-- prepare-dist.mjs             # Cloudflare Pages/Workers build packager
|   |-- seed-bounties.ts             # Initial mock data generator
|   |-- supabase-schema.sql          # Supabase PostgreSQL schema and seed data
|   |-- sync-supabase.mjs            # Cloud PostgreSQL synchronization script
|   `-- validate-submission.ts       # Hackathon payload validator
|-- src/
|   |-- bounty-contract.ts           # Protocol state machine and lifecycle methods
|   |-- config.ts                    # Network endpoints and contract addresses
|   |-- github-verifier.ts           # Pull request and commit verifier
|   |-- index.ts                     # Main protocol entry point
|   |-- near-social.ts               # SocialDB NEP-BOS badge payload generator
|   |-- near-wallet.ts               # NEP-413 cryptographic authentication helper
|   |-- server.ts                    # Native REST API server
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
|-- .gitignore                       # Clean ignore rules (keeps secrets & notes off git)
|-- LICENSE                          # MIT License
|-- package.json                     # Project scripts and dependencies
`-- tsconfig.json                    # TypeScript compiler configuration
```

---

## License

This project is licensed under the [MIT License](LICENSE).
