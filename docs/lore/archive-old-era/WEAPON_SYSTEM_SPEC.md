# Mythos Gates: Ascension — Weapon & Ascension System Specification
**Locked:** August 19, 2026
**Approved by:** BudE404 (Creative Director), BIGagent404
**Power Budget:** Weapons = 25% of total Gear power (Gear = 50% of total power)

---

## Design Philosophy

Each deity has ONE signature weapon tied to their mythology. The weapon cannot be swapped — it IS the deity's identity. Players upgrade their weapon through a skill-tree-like Ascension system where they make meaningful choices at every 5 levels. No two players using the same deity will feel identical.

---

## Power Budget Allocation

| Source | % of Total Power | Notes |
|--------|-----------------|-------|
| Avatar Level | 20% | Base stats, content unlock |
| **Gear (total)** | **50%** | Includes weapon + armor + relics |
| └ Weapon | 25% | Damage, range, ability scaling |
| └ Armor + Helm + Boots | 15% | Defense, dodge, parry, HP |
| └ Relic + Sigil | 10% | Ult charge, cooldown reduction |
| Abilities | 30% | Ability tree upgrades |

---

## Weapon Base Stats (Per Deity)

All weapons are balanced to a BASE POWER VALUE (BPV) of 100 at Level 1. No deity's weapon starts stronger than another — differences are in playstyle, not raw power.

### Stat Categories
| Stat | Description | Range (Level 1) |
|------|-------------|-----------------|
| Attack Power | Base damage per hit | 80-120 (avg 100) |
| Attack Range | Hit distance (short/medium/long) | Categorical |
| Attack Speed | Hits per second | 0.8-1.2 (avg 1.0) |
| Crit Chance | % chance for 1.5x damage | 5-15% (avg 10%) |
| Ability Scaling | How much weapon boosts abilities | 80-120% (avg 100%) |

### Balance Principle
- High attack power = lower attack speed (heavy weapons)
- High crit chance = lower ability scaling (precision weapons)
- Long range = lower attack power (ranged weapons)
- Every weapon has the SAME effective DPS at base level — stats are distributed differently

### Faction Base Stat Profiles

| Faction | Attack Power | Attack Speed | Crit | Ability Scaling | Playstyle |
|---------|-------------|---------------|------|----------------|-----------|
| Aten Ra | 100 | 1.0 | 10% | 100% | Balanced |
| Asgardian | 120 | 0.8 | 8% | 90% | Heavy hitter |
| Olympian | 90 | 1.1 | 12% | 100% | Fast/precise |
| Kami | 85 | 1.2 | 15% | 95% | Fast/crit |
| Tuatha | 100 | 1.0 | 10% | 105% | Ability-focused |
| Empyrean | 95 | 1.0 | 10% | 110% | Ability-heavy |
| Infernal | 115 | 0.9 | 10% | 85% | Heavy/burn |
| Hollow | 100 | 1.0 | 10% | 100% | Balanced/anti-light |

**Effective DPS Check (Level 1):**
- Asgardian: 120 × 0.8 = 96 base + crit/ability = ~100 effective ✓
- Kami: 85 × 1.2 = 102 base + crit/ability = ~100 effective ✓
- Empyrean: 95 × 1.0 = 95 base + ability scaling = ~100 effective ✓
- All factions normalize to ~100 effective DPS at Level 1 ✓

---

## Weapon Leveling Progression

| Weapon Level | Total Upgrade Points | Stat Multiplier | Visual Stage |
|-------------|--------------------|-----------------|--------------|
| 1 (base) | 0 | 1.0x | Base form |
| 2-4 | 0 | 1.03x per level | Base form |
| 5 | ASCENSION NODE 1 | 1.15x | +Faction glow |
| 6-9 | — | 1.03x per level | Glow intensifies |
| 10 | ASCENSION NODE 2 | 1.30x | +Ornate detailing |
| 11-14 | — | 1.03x per level | Detailing matures |
| 15 | ASCENSION NODE 3 | 1.45x | +Energy effects |
| 16-19 | — | 1.03x per level | Effects expand |
| 20 | ASCENSION NODE 4 | 1.60x | +Particle effects |
| 21-24 | — | 1.03x per level | Particles intensify |
| 25 | ASCENSION NODE 5 | 1.75x (MAX) | Fully divine form |

**Max weapon power at Level 25:** 100 BPV × 1.75 = 175 BPV
**This represents 25% of total power** — a Level 25 weapon contributes 25% of total avatar power at max level.

---

## Ascension Nodes — Choice System

At weapon levels 5, 10, 15, 20, and 25, the player chooses ONE of THREE upgrades. Each upgrade is themed to the deity's mythology. Once chosen, the other two are locked until respec (costs Influence).

### Upgrade Categories (Balanced Across All Deities)

| Category | Effect | Power Value | Balance Rule |
|----------|--------|-------------|--------------|
| Damage Modifier | Multi-hit, cleave, pierce, splash | +15% effective DPS | Same power across all deities |
| Sustain | Life steal, reflect, shield on kill | +12% survivability | Capped at 8% lifesteal max |
| Utility | Speed, dodge, cooldown | +10% mobility/control | Never exceeds 20% dodge |
| Ability Enhancement | Ult modification, secondary effects | +18% ult effectiveness | One per deity, unique |

**Every upgrade option grants the SAME power value.** A damage upgrade on Aten Ra gives the same +15% effective DPS as a damage upgrade on Kami. No faction is stronger — they're just different.

### Balance Math Per Node

Each ascension node grants exactly +0.15x to the weapon's stat multiplier. The three choices determine HOW that power is expressed, not HOW MUCH power you get.

```
Node 1 (Level 5):  +15% power — choose Damage, Sustain, or Utility
Node 2 (Level 10): +15% power — choose Damage, Sustain, or Ability Enhancement
Node 3 (Level 15): +15% power — choose Damage, Sustain, or Utility
Node 4 (Level 20): +15% power — choose Damage, Sustain, or Ability Enhancement
Node 5 (Level 25): +15% power — choose Damage, Sustain, or Utility
```

**Total possible paths:** 3^5 = 243 unique builds per deity
**Total across all 28 deities:** 6,804 possible character builds
**Power is always the same** — only expression differs.

---

## Faction-Specific Upgrade Names & Effects

### ATEN RA (Solar/Desert)

| Node | Damage Option | Sustain Option | Utility/Ability Option |
|------|--------------|---------------|----------------------|
| 1 | Sun Flare Strike — multi-hit, blinds 1s | Mummy's Curse — 5% lifesteal | Desert Wind — +10% move speed |
| 2 | Solar Barrage — ult fires in line | Desert Storm — cleave + sand vortex | Solar Mend — lifesteal scales with HP |
| 3 | Ra's Fury — +20% crit damage | Pharaoh's Ward — shield on kill | Sun Step — dodge on attack |
| 4 | Searing Light — ult adds burn DoT | Servant's Sacrifice — 8% lifesteal | Light Speed — +15% move speed |
| 5 | Apex of the Sun — ult screen-wide | Eternal Reign — reflect 15% damage | Barque of Millions — i-frame dash |

### ASGARDIAN (Storm/Iron)

| Node | Damage Option | Sustain Option | Utility/Ability Option |
|------|--------------|---------------|----------------------|
| 1 | Thunder Clap — cleave + lightning chain | Berserker Rage — 5% lifesteal <30% HP | Storm Step — dodge on attack |
| 2 | Gungnir's Throw — ult pierces all in line | Iron Hide — reflect 10% | Raven's Foresight — +10% dodge |
| 3 | Mjölnir's Crash — +20% crit damage | Valkyrie's Blessing — shield on kill | Thunder Speed — +15% move speed |
| 4 | Storm Breaker — ult adds stun | Blood of Ymir — 8% lifesteal | Berserker Step — i-frame on rage |
| 5 | Apex Storm — ult chains to all enemies | Asgard's Wall — reflect 15% | Odin's Sacrifice — i-frame dash |

### OLYMPIAN (Marble/Bronze)

| Node | Damage Option | Sustain Option | Utility/Ability Option |
|------|--------------|---------------|----------------------|
| 1 | Phalanx Strike — multi-hit shield bash | Athena's Aegis — reflect 10% | Hermes' Speed — +10% move speed |
| 2 | Zeus's Verdict — ult adds stun | Achilles' Hold — 5% lifesteal | Oracle's Sight — +10% dodge |
| 3 | Olympian Cleave — +20% crit damage | Spartan Shield — shield on kill | Pegasus Step — +15% move speed |
| 4 | Divine Thunder — ult adds chain lightning | Hephaestus' Forge — 8% lifesteal | Mercury's Dash — i-frame |
| 5 | Will of Olympus — ult screen-wide | Aegis Prime — reflect 15% | Chariot of Apollo — i-frame dash |

### KAMI (Lacquer/Spirit)

| Node | Damage Option | Sustain Option | Utility/Ability Option |
|------|--------------|---------------|----------------------|
| 1 | Thousand Cuts — multi-hit flurry | Spirit Drain — 5% lifesteal | Kitsune Step — dodge + afterimage |
| 2 | Totsuka's Wrath — ult pierces | Yokai Consume — lifesteal scales with HP | Shrine Step — +10% dodge |
| 3 | Blade Master — +20% crit damage | Guardian Spirit — shield on kill | Wind Walk — +15% move speed |
| 4 | Amaterasu's Light — ult heals on hit | Soul Harvest — 8% lifesteal | Kami Phase — i-frame |
| 5 | Supreme Cut — ult screen-wide | Divine Seal — reflect 15% | Torii Gate Step — i-frame dash |

### TUATHA (Wood/Bone/Druidic)

| Node | Damage Option | Sustain Option | Utility/Ability Option |
|------|--------------|---------------|----------------------|
| 1 | Wild Growth — cleave + root vines | Morrigan's Harvest — 5% lifesteal + fear | Forest Step — dodge through terrain |
| 2 | Cauldron's Boon — ult revives on death once | Earth Mend — lifesteal scales with HP | Druid Sight — +10% dodge |
| 3 | Cernunnos' Hunt — +20% crit damage | Oak Shield — shield on kill | Wild Step — +15% move speed |
| 4 | Horned Lord's Fury — ult roots all | Blood Oak — 8% lifesteal | Green Man's Path — i-frame |
| 5 | Primal Awakening — ult screen-wide | Ancient Guardian — reflect 15% | Faerie Gate Step — i-frame dash |

### EMPYREAN (Light/Ivory/Gold)

| Node | Damage Option | Sustain Option | Utility/Ability Option |
|------|--------------|---------------|----------------------|
| 1 | Radiant Burst — multi-hit light beams | Divine Mend — 5% lifesteal as light | Light Step — dodge transforms to light |
| 2 | Seraph's Wrath — ult adds second wave | Halo Shield — reflect 10% | Seraphim Speed — +10% dodge |
| 3 | Heavenly Cleave — +20% crit damage | Cherub's Guard — shield on kill | Ascension Step — +15% move speed |
| 4 | Throne of Light — ult blinds all | Radiance — 8% lifesteal | Divine Phase — i-frame |
| 5 | Apex of Creation — ult screen-wide | Seraph's Aegis — reflect 15% | Chariot of Fire — i-frame dash |

### INFERNAL (Ash/Hellfire)

| Node | Damage Option | Sustain Option | Utility/Ability Option |
|------|--------------|---------------|----------------------|
| 1 | Hellfire Chain — multi-hit + burn DoT | Soul Devour — 5% lifesteal from burning | Shadow Step — dodge leaves fire trail |
| 2 | Lucifer's Fall — ult drops meteor | Infernal Hide — reflect 10% | Hell Speed — +10% dodge |
| 3 | Abyssal Cleave — +20% crit damage | Demon Shield — shield on kill | Phantom Step — +15% move speed |
| 4 | Morning Star — ult adds explosion | Soul Harvest — 8% lifesteal | Void Walk — i-frame |
| 5 | Apex of the Abyss — ult screen-wide | Infernal Aegis — reflect 15% | Fall From Grace — i-frame dash |

### HOLLOW (Void/Gate Stone)

| Node | Damage Option | Sustain Option | Utility/Ability Option |
|------|--------------|---------------|----------------------|
| 1 | Void Rend — multi-hit phases through armor | Mist Consumption — 5% lifesteal | Phase Step — dodge makes intangible |
| 2 | Gate's Collapse — ult creates black hole | Void Shield — reflect 10% | Mist Step — +10% dodge |
| 3 | Null Cleave — +20% crit damage | Gate Stone Guard — shield on kill | Void Walk — +15% move speed |
| 4 | Entropy — ult dissolves armor | Anti-Life — 8% lifesteal | Phantasm Step — i-frame |
| 5 | The End of All Things — ult screen-wide | Void Aegis — reflect 15% | Gate Walk — i-frame dash |

---

## Difficulty Scaling

Weapon power must remain relevant at all difficulties without trivializing content.

### Difficulty Tiers

| Difficulty | Enemy HP Multiplier | Enemy Damage Multiplier | Weapon Effectiveness | Notes |
|-----------|-------------------|----------------------|---------------------|-------|
| Normal | 1.0x | 1.0x | 100% | Base game, all content clearable with Level 15 weapon |
| Hard | 1.5x | 1.3x | 100% | Level 20 weapon recommended, requires ascension choices |
| Nightmare | 2.0x | 1.6x | 90% | Level 25 weapon required, optimal build needed |
| Mythic | 3.0x | 2.0x | 80% | Max weapon + optimal gear + abilities — endgame challenge |

### Balance Rules for Difficulty

1. **Weapon effectiveness decreases on higher difficulties** — not because the weapon is weaker, but because enemies have higher resistance. This prevents weapon upgrades from trivializing endgame.

2. **At Normal difficulty:** A Level 25 weapon does 75% of an enemy's HP per hit cycle. Fights last 2-3 cycles.

3. **At Nightmare difficulty:** A Level 25 weapon does 45% of an enemy's HP per hit cycle. Fights last 4-6 cycles. Ascension choices (sustain, utility) become essential.

4. **At Mythic difficulty:** A Level 25 weapon does 30% of an enemy's HP per hit cycle. Fights last 7-10 cycles. Build synergy (weapon + gear + abilities) is required.

5. **Weapon upgrades NEVER become irrelevant.** Even at Mythic, the difference between a Level 1 and Level 25 weapon is 1.75x — that's always significant.

---

## Cross-Deity Balance Verification

### Effective DPS at Max Weapon Level (Level 25, no ascension bonuses)

| Faction | Base DPS | ×1.75 multiplier | Max DPS | Check |
|---------|---------|-----------------|---------|-------|
| Aten Ra | 100 | 175 | 175 | ✓ |
| Asgardian | 96 | 168 | 168 | ✓ (slower hits, more damage each) |
| Olympian | 99 | 173 | 173 | ✓ |
| Kami | 102 | 179 | 179 | ✓ (fast hits, less damage each) |
| Tuatha | 100 | 175 | 175 | ✓ |
| Empyrean | 95 | 166 | 166 + ability bonus | ✓ |
| Infernal | 104 | 182 | 182 + burn DoT | ✓ (DoT compensated by lower ability) |
| Hollow | 100 | 175 | 175 | ✓ |

**Variance: 166-182 = ±5% from mean.** This is within acceptable balance range. Infernal's higher raw DPS is compensated by lower ability scaling and burn DoT being resistible. Empyrean's lower raw DPS is compensated by higher ability scaling.

### With Full Ascension (5 nodes, all damage-focused)

| Faction | Max DPS | With 5 × +15% damage | Total | Check |
|---------|---------|---------------------|-------|-------|
| Aten Ra | 175 | +75% | 306 | ✓ |
| Asgardian | 168 | +75% | 294 | ✓ |
| Olympian | 173 | +75% | 303 | ✓ |
| Kami | 179 | +75% | 313 | ✓ |
| Tuatha | 175 | +75% | 306 | ✓ |
| Empyrean | 166 | +75% | 291 + ability | ✓ |
| Infernal | 182 | +75% | 319 | ✓ (DoT resistible) |
| Hollow | 175 | +75% | 306 | ✓ |

**All-damage builds: 291-319 range = ±5% variance.** Balanced. A player who picks all sustain or all utility will have lower DPS but higher survivability — this is the build tradeoff.

---

## Upgrade Material Drops

Materials drop from winning fights and are used to level the weapon.

| Material | Source | Use | Drop Rate |
|----------|--------|-----|----------|
| Weapon Shards | Normal missions | +1 weapon level | Common (every fight) |
| Energy Cores | Chapter bosses | +1 weapon level | Uncommon (guaranteed per chapter) |
| Divine Essence | Elite remix missions | +1 weapon level + crit | Rare (daily) |
| Faction Relics | Raid bosses | +1 weapon level + unlock perk | Epic (weekly) |
| Godsteel | World bosses | +1 weapon level + visual upgrade | Legendary (weekly) |
| Primordial Matter | Crafting (rare mats) | +1 weapon level + unique effect | Mythic (crafted only) |

**To max a weapon (Level 25):** ~100 normal shards + 10 energy cores + 5 divine essence + 3 faction relics + 2 godsteel + 1 primordial matter. Approximately 3-4 months of regular play for F2P.

---

## Respec System

- Reset all ascension choices: 500 Influence (premium)
- Weapon level stays the same — only choices reset
- Can respec at any time between fights
- Encourages experimentation with different builds

---

## Summary

- **28 signature weapons** (one per deity, fixed)
- **5 ascension nodes** with 3 choices each = 243 builds per deity
- **All choices are power-equal** — different expression, same value
- **Cross-faction variance: ±5%** — no deity is strictly better
- **Difficulty scaling keeps weapons relevant without trivializing content**
- **Visual progression tied to upgrade path** — your weapon looks different based on choices
- **Upgrade materials from drops** — 3-4 months to max for F2P
- **Respec available** for build experimentation

---
**Status:** LOCKED — Weapon & Ascension System Specification
