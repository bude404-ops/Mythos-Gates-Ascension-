# DARK HORSE SLEEPER STABLE — MASTER SPEC
**Project:** Dark Horse Sleeper Stable (1,111 NFT collection + $SLPR token)
**Founder:** BigFax (@BigFax404)
**Status:** v1.0 — audit fixes baked in, investor-ready (Clutch Markets / UnVault)
**Origin positioning:** First implementation of **Decentralized Curated Markets (DCM)** — a framework BigFax coined and published in December 2025, a full five months before Matt Ye's May 2026 "Decentralized Market Formation" paper.

---

## 1. CORE THESIS

1,111 curated "sleeper" NFTs backed by a single fungible token ($SLPR), where the collection's value flows through **player-vs-player wagering** — not passive yield. The Fax Machine gacha is the treasury engine; the wager pools are the heartbeat; the curated stable is the brand.

---

## 2. TOKENOMICS (CORRECTED MATH — LOCKED)

| Parameter | Value |
|---|---|
| Token | $SLPR |
| **Total supply** | **1,234,444,321** (fixed, no mint function after TGE) |
| NFT collection | 1,111 one-of-one "sleeper" horses |
| Swap ratio | **1 NFT = 1,111,111 $SLPR** (exact) |
| Supply check | 1,111 × 1,111,111 = **1,234,444,321** ✓ supply fully backs collection, zero unclaimed float |

**Math is exact and closed.** The supply is not a cosmetic number — it is precisely 1,111 NFT-claims denominated in $SLPR. This is the foundation line for every investor deck.

---

## 3. MINT MECHANISM — TOKEN-SWAP-ONLY (DOUBLE-CLAIM ELIMINATED)

**Problem solved:** the original blueprint double-claimed NFT supply — once as a minted allocation and again as token claims. That structure collapses under diligence.

**Locked mechanism:**
- $SLPR is the ONLY entry point. There is no separate NFT sale, no NFT whitelist, no NFT allocation.
- An NFT is minted **only by burning 1,111,111 $SLPR** into the Fax Machine.
- Every burned swap permanently removes tokens from circulating supply → **built-in deflationary pressure scaling with mint velocity**.
- No NFT exists that isn't backed by a prior burn → zero double-claim, zero unbacked float, clean audit trail.
- Mint windows are dynamic; the swap ratio is fixed forever.

---

## 4. THE FAX MACHINE — GACHA TREASURY ENGINE

The gacha ("Fax Machine") is the protocol's treasury and distribution engine, serving two functions:

1. **NFT distribution** — swap $SLPR in, sleeper NFT out (the only mint path).
2. **Treasury accumulation** — spread between secondary market price and swap floor accrues to the treasury, which funds the wager pools and operations.

### 4a. ANTI-FRONT-RUNNING RULE (LOCKED)
**Gacha costs are never pre-announced.** Pricing reveals at pull time only; pull windows and pulls-per-window are dynamic. No published cost schedule = no exploitable calendar = no bot front-running of mint windows. Communicate the *mechanic*, never the *schedule*.

### 4b. DATA ENGINE
Every pull generates structured demand data (pull velocity, price tolerance, wallet cohorts). This dataset is a first-class asset of the protocol — it informs dynamic pricing and becomes the curated-market intelligence layer for future DCM deployments.

---

## 5. REWARD MODEL — PvP WAGER POOLS (NOT YIELD)

**Problem solved:** marketing rewards as "yield" reads as a security (passive return from a common enterprise — Howey exposure).

**Locked framing:** all rewards are **PvP wager pools** — participants stake against each other on curated outcomes (sleeper performance, market events). Winners are paid from the pooled stakes of losers, minus a protocol rake to the treasury.

- Zero protocol-promised returns. The protocol never promises yield; it *hosts competition*.
- Value flows from participants to participants — the protocol only racks the table.
- Skill-based competition framing is materially different from a passive-investment contract.
- All copy, decks, and site language uses: *wager pools, PvP stakes, curated competition* — the word "yield" is banned from every surface.

---

## 6. REVENUE FLOWS

1. **Fax Machine spread** (gacha pulls)
2. **Wager pool rake** (% of every settled pool)
3. **Secondary royalties** (NFT marketplace trades)
4. **Treasury data products** (cohort/demand intelligence, future DCM tooling)

---

## 7. INVESTOR NARRATIVE (CLUTCH / UNVAULT)

- **First-mover DCM implementation** by the framework's own author — narrative ownership is uncontestable.
- **Closed-form tokenomics** — 1,234,444,321 / 1,111 / 1,111,111 reconcile exactly.
- **Deflationary by construction** — every mint burns.
- **Regulatorily-aware design** — PvP wager framing, no yield promises, no pre-announced schedules.
- **Treasury engine with compounding data moat** — the Fax Machine is both cash register and intelligence layer.

---

## 8. PHASES

| Phase | Milestone |
|---|---|
| 0 | Spec lock (this doc) + investor conversations (Clutch Markets, UnVault) |
| 1 | $SLPR deployment (fixed supply, no admin mint), Fax Machine contracts, audit |
| 2 | 1,111 sleeper collection reveal + first mint window (dynamic, unannounced) |
| 3 | PvP wager pools live (curated stakes, rake to treasury) |
| 4 | DCM expansion — the stable becomes the flagship of the framework |

---

## 9. STANDING RULES (NON-NEGOTIABLE)

1. Supply stays **1,234,444,321** — any future "burn a few zeros" idea breaks the closed math.
2. **Token-swap-only mint** — no NFT allocation ever mints outside the burn path.
3. **Never pre-announce gacha costs or windows.**
4. **Never use the word "yield"** — wager pools, always.
5. Swap ratio **1,111,111 : 1** is immutable.

*v1.0 — compiled from the founder's blueprint with the four structural fixes (supply math, swap-only mint, PvP framing, cost opacity) applied.*
