# Mythos Gates: Ascension — Change Summary

> Last updated: August 17, 2026  
> Maintained by: BIGagent404 for BudE404

---

## Current Repo State

| Metric | Count |
|--------|-------|
| Titans (Deities) | 28 |
| Creatures | 39 |
| Hollow Creatures | 16 |
| Factions | 7 |
| Campaigns | 8 |
| Chapters | 24 |
| Missions | 280 |
| Mission Dialogue | 280 |
| Art Prompts | 96 |
| Backstories | 75 |
| 3D Blueprint Assets | 136 |
| NPCs | 8 |
| Maps | 12 |

**Validation:** `validate-content.mjs` passes ✓  
**Tests:** `solo-battle-reducers` ✓ | `creature-behavior-runtime` ✓  
**Pre-existing failure:** `battlefield-runtime` objectives count test (line 49) — documented, not blocking

---

## Canon and Lore Changes

### Universe Rename
- **From:** Generic project name
- **To:** Mythos Gates: Ascension
- Commit: `4e4408d`

### Combat Model: Single Deity Dungeon Crawler
- Restructured from multi-unit squads to **one active deity vs many enemies**
- Commit: `8094197`
- Validator enforces: `one-deity-vs-many` combat contract
- All missions set to `teamSize: 1`
- Active titan policy: `ONE_PLAYER_CONTROLLED_TITAN_PER_BATTLE`

### Deity is the Canonical Term
- BudE404 confirmed: **deity** is the intended term across lore, combat, art prompts, AND technical code
- The earlier audit that changed deity to titan was **reverted** (commits `d790ecf`, `d5a0ad6`)
- `data/` files contain 9,242 deity references (lore, dialogue, mission text) — all intentional
- `game/` engine files use `deity` for state objects and parameters
- `scripts/` validators reference `deity` in combat contracts

### Faction Lore Alignment
- Factions and deity backstories synced with Mythos Gates lore (`5b32696`)
- Core lore codex synchronized (`f9bf36a`)
- Mission arcs rewritten for Ascension route canon (`d8848a4`)
- Art prompts aligned with route canon (`df42485`)
- Dungeon route registry added (`515b753`)

---

## Art Direction Changes

### No Halo Rings — Universal Rule
- **All halo/halo-ring/circular-disc references removed** from 325 files
- Replaced with **aura** terminology
- 2,498 total replacements across:
  - 63 titan files
  - 14 art prompt files
  - 80 mission art packages
  - 80 mission dialogue files
  - 15 backstories
  - 25 data files
  - 5 creature files
  - 3D blueprint metadata
- Commit: `7325e18`
- **Zero remaining halo references**

### Approved Concept Art
| Titan | Status | Notes |
|-------|--------|-------|
| TG-TITAN-001 Aten-Ra Solar Law Monolith | Approved | Hair added (electrum-streaked braids) |
| TG-TITAN-002 Khemet Suncrown | Approved | |
| TG-TITAN-003 Nefra Obsidian Dawn | Approved | Feminine face, amber eyes, obsidian liner |
| TG-TITAN-010 Allfather Stormvein | Approved | Style benchmark for all future titans |

### Art Style Direction (Aug 17 2026)
- Balance between **stylized and detailed** — NOT photorealistic
- Must be suitable for 3D model conversion
- Reference: Allfather Stormvein (TG-TITAN-010) is the approved benchmark
- All titan art must follow **verbatim repo prompts** — no improvisation

### Aten Ra Visual Identifier Fix
- Resolved 13 overlapping facial/cranial/mask/crown features across 9 titans
- Each Aten Ra titan now has completely unique visual identifiers
- Commit: `2b3fe85`

---

## Combat System Changes

### Battlefield Vertical Slice Upgrade
- **Solar Charge mechanic** added (solo charge meter, grows on illuminated terrain control)
- **Stance system** (Guardian, Assault, Ascendant)
- **Bastion technique** (hold-zone shield, taunt, counterstance)
- **HP bars** and **game-over screen** added
- **Seal visuals** implemented
- Self-contained CSS (no external CDN dependency)
- Commits: `12f1672`, `0042a98`

### Cross-Faction Creatures
- 21 new cross-faction creatures added (total now 39)
- Wired into elite Chapter 5 missions with cross-faction enemy scaling
- Run-in validator synced with deity route canon
- Commits: `9300daf`, `a48e2a5`, `3614be4`

### Battlefield Runtime
- 7x7 grid combat
- Six tactical zones using Aten-Ra materials
- Three solar seals
- One Titan (player's) — never show multiple titans
- M01 specs synced, stale boss/anchor code removed
- Commit: `7893c1f`

---

## Technical Fixes

### Import/Export Fixes
- `applyDeityAction` import reference in `game/index.html` (was referencing non-existent function)
- `applyTitanAction` is the correct export name in `solo-battle-engine.mjs`
- `command-hub-runtime.mjs` imports `applyTitanAction` from `browser-battle-engine.mjs`

### Syntax Fix
- Fixed spread operator typo in `command-hub-runtime.mjs` (`.. .titans` to `...titans`)
- Commit: `15f2061`

### File Renames
- `src/combat/one-titan-vs-many.mjs` renamed back to `src/combat/one-deity-vs-many.mjs`
- `production-gate-manifest.mjs` references updated to match

### Test Fixes
- `test-creature-behavior-runtime.mjs`: Updated to use `deity` parameter (matching `browser-battle-engine.mjs`)
- `test-solo-battle-reducers.mjs`: Already using `deity: titan` pattern

---

## Battlefield Development Status

- **BATTLEFIELD_001**: On hold per BudE404 (reworking combat system)
- **Art generation**: Paused — BudE reworking combat may change battlefield design requirements
- **No new builds to be sent** until BudE provides updated combat specs

---

## Known Issues

1. `test-battlefield-runtime.mjs` line 49: objectives count assertion fails (expected: 2) — pre-existing, documented
2. `game/economy-runtime.mjs` still uses `unlockDeity`, `deityId`, `unlockedDeityIds` — intentional per deity canon
3. `game/shared-preview.js` has deity references in UI rendering — intentional per deity canon

---

## Commit History (Recent)

| Hash | Description |
|------|-------------|
| `d5a0ad6` | Revert deity-to-titan audit — deity is canonical |
| `d790ecf` | Revert commit 7bc6bea (deity-to-titan audit) |
| `eb6c7dd` | Remove obsolete orphan art prompt |
| `3614be4` | Sync run-in validator with deity route canon |
| `7bc6bea` | Audit: Fix deity-to-titan (later reverted) |
| `df42485` | Align art prompts with Ascension route canon |
| `0042a98` | Upgrade battlefield vertical slice |
| `12f1672` | Fix import mismatches, upgrade battlefield VS |
| `7325e18` | Remove all halo references (325 files, 2498 replacements) |
| `15f2061` | Fix syntax error in command-hub-runtime |
| `f9bf36a` | Synchronize Ascension core lore codex |
| `d8848a4` | Rewrite Mythos Gates route mission arcs |
| `6539a4c` | Align deity art and begin mission recreation |
| `5b32696` | Align factions and deity backstories |
| `515b753` | Add Mythos Gates dungeon route registry |
| `4e4408d` | Rename universe to Mythos Gates |
| `8094197` | Reconfigure canon for single deity dungeon crawler |
| `bafe971` | Restructure playable Titans into god roster |
