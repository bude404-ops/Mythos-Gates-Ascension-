# PROGRESSION SPEC — Weapon Levels, Skill Tree, Difficulty Tiers
Status: ACTIVE (v1.0.0) | Author: BIGagent404 | Owner approval: BudE404 (design question, Sept 2 2026)
Data: `data/progression/mg_progression_registry.json`

## Principle
Kit tuning constants (scripts/kits/*.gd) are the **level-1, un-tree'd BASELINE**.
Progression multiplies that baseline. Nothing in the kit files knows progression exists.
This keeps kits testable in isolation and means every future kit automatically
inherits the whole progression system with zero extra work.

## Weapon Leveling (per weapon, per deity)
- Levels 1–10 (mobile-friendly ceiling; no infinite grind walls)
- Damage: additive +8% per level → x1.72 at level 10
- Upgrade currency: **faith_shards** (earned via the Faith system; server-authoritative)
- Cost curve: `100 * level^1.5` — early levels cheap and dopamine-friendly, level 10 is a statement

## Skill Tree (per deity)
- 3 branches = the kit's own slots (active_1 / active_2 / ultimate) — the tree deepens the kit you already love
- 4 nodes per branch, 12 total: each node is +5% potency OR −5% cooldown (player's choice per node)
- Full tree = **x1.35 max effectiveness** (capped, so harness baselines stay meaningful)
- Respec: free at outposts (F2P-friendly experimentation; never monetized)
- **SOLO-FIRST RULE in the tree:** every node affects the player's own kit only.
  No ally-targeted nodes exist at any depth. This is enforced by harness, not honor system.

## Difficulty Tiers
| Tier | Enemy HP | Enemy Dmg | Faith Gain |
|------|----------|-----------|------------|
| Normal | x1.00 | x1.00 | x1.00 |
| Hard | x1.50 | x1.25 | x1.30 |
| Mythic | x2.25 | x1.60 | x1.70 |

## Balance Invariants (harness-enforced, every faction kit)
1. **Level-1 vs Normal:** player power 1.00 == enemy HP 1.00 → fair fight at baseline.
2. **Max vs Mythic:** player power 1.72 × 1.35 = **2.322** ≥ mythic enemy HP 2.25
   → the full climb ends in victory. Mythic is beatable at cap, never before.
3. Anything between is interpolated — smooth power fantasy, no cliff walls.

## Why this is now, not later
All 32 kits are being authored against this curve from day one. Retrofitting
progression after 32 kits would invalidate every harness-validated number and
force a full rebalance. Building the backbone now costs one spec + one registry;
building it later costs 32 kit reworks.

## What is explicitly LATER (needs owner art/UI approval)
- Skill tree UI + art
- Node names/flavor content fills
- Weapon visual upgrade cosmetics (F2P cosmetics-only monetization applies)
