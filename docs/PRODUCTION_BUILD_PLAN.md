# Mythos Gates: Ascension — Production Build Plan

**Engine:** Unreal Engine 5 (Mobile-First)
**Status:** Pre-production → Production
**Date:** August 20, 2026

---

## 1. TECH STACK DECISION: UE5

### Why UE5 over Unity
- **Existing investment:** Full UE5 dungeon framework, mobile-first architecture, and 11 passing contract tests
- **Visual quality:** Lumen + Nanite for god-scale visuals, Niagara for faction VFX
- **3D pipeline:** UE5's MetaHuman and nanite geometry stream better for 3D-converted deity models
- **Mobile-first architecture already defined:** Performance budgets, structure, and rules locked

### Mobile Performance Targets (from architecture)
- **Target FPS:** 30 baseline, 60 high-end
- **Max enemies in combat:** 6 standard, 4 boss
- **Lighting:** Baked/static, mobile-compatible (0 dynamic lights)
- **Materials:** Max 32 unique per zone
- **Textures:** Streamed with mobile mips

---

## 2. PRODUCTION PHASES

### Phase 1: Project Scaffold (Week 1-2)
- [x] Create UE5 project (Mobile template, C++)
- [x] Set up folder structure per Content folder mapping
- [ ] Import data as Data Assets (deities, missions, campaigns, creatures)
- [x] Build Blueprint Actor Components for combat system (C++ scaffold)
- [x] Set up DataTables for stats, abilities, weapons (data assets defined)

### Phase 2: Core Combat (Week 3-6)
- [ ] 2.5D combat plane implementation
- [ ] Tap-to-move player controller
- [ ] Auto-attack system (weapon range-based)
- [ ] Stat-driven auto-parry/dodge
- [ ] Ability system (1 passive + 3 active + 1 ultimate)
- [ ] Belief charging for ultimate
- [ ] Enemy AI (5 archetypes, terrain-aware)
- [ ] Victory/defeat resolution

### Phase 3: Content Pipeline (Week 5-8)
- [ ] 2D → 3D model conversion (TRELLIS.2 or custom)
- [ ] GLB → UE5 Static Mesh import
- [ ] Texture/material assignment per faction
- [ ] Weapon mesh import (28 signature weapons)
- [ ] Creature mesh import (39 creatures)
- [ ] Environment/map art → UE5 levels

### Phase 4: Campaign & Progression (Week 7-10)
- [ ] Campaign progression system (Belief/Influence)
- [ ] Mission flow (Explore → Encounter → Combat → Rewards → Upgrade)
- [ ] Weapon ascension system (243 builds/deity)
- [ ] Save/load system
- [ ] Economy (Sunshards, GateKeys, SignatureAlloy)
- [ ] Achievement system

### Phase 5: UI & Polish (Week 9-12)
- [ ] Deity selection screen
- [ ] Mobile combat HUD (thumb-zone optimized)
- [ ] Campaign map screen
- [ ] Loot/reward screens
- [ ] Settings & accessibility
- [ ] Audio integration
- [ ] Performance optimization pass

### Phase 6: NFT Integration (Week 11-14)
- [ ] Smart contract deployment (Polygon/Base)
- [ ] Wallet connection
- [ ] NFT minting for deity avatars
- [ ] Staking system
- [ ] Marketplace integration

---

## 3. DATA PIPELINE

```
JSON Data Files → UE5 Data Assets → Blueprint System → Runtime
                                    ↓
                              DataTables → Combat System
                                    ↓
2D Art → 3D Conversion → GLB → UE5 Static Meshes → Material Assignment
                                    ↓
28 Deities + 28 Weapons + 39 Creatures + 8 Maps → Playable Build
```

### Import Schema
- `data/deitys.json` → UE5 DeityCombatData assets (28)
- `data/creatures.json` → UE5 EnemyData assets (39)
- `data/mission-registry.json` → UE5 MissionDefinition assets (280)
- `data/campaigns.json` → UE5 CampaignData assets (8)
- `data/ascension-system.json` → UE5 ProgressionData
- `data/deity-role-matrix.json` → UE5 BalanceData

---

## 4. COMBAT SYSTEM SPEC

### Core Loop (per mission)
1. **Explore** — Player moves through zone (tap-to-move)
2. **Encounter** — Enemy wave spawns
3. **1 Deity vs. Multiple Enemies** — 2.5D tactical combat
4. **Victory** — All enemies defeated
5. **Rewards** — Loot, XP, materials
6. **Upgrade Deity** — Weapon ascension choice (1 of 3)
7. **Explore Further** — Next zone unlocks

### Combat Rules (Locked)
- 1 player-controlled deity per battle
- No squad combat, no team formations
- Auto-attack based on weapon range
- Stat-driven auto-parry/dodge
- Ultimate charges via Belief
- Screen-wide ultimate coverage
- Max 6 enemies standard, 4 boss

### Power Distribution (Locked)
- 20% Level
- 50% Gear (weapon ascension)
- 30% Abilities

---

## 5. BLOCKERS

1. **3D Asset Pipeline** — Need Hugging Face GPU token for TRELLIS.2, OR build custom 3D generator
2. **UE5 License** — Need EULA acceptance for mobile publishing
3. **NFT Chain Selection** — Polygon vs Base (gas costs, ecosystem)

---

## 6. IMMEDIATE NEXT STEPS

1. Create UE5 C++ project scaffold with mobile template
2. Build data import script (JSON → UE5 Data Assets)
3. Implement core combat prototype in UE5
4. Set up 3D asset pipeline (TRELLIS.2 or custom)
5. Begin Phase 2: Core Combat implementation
