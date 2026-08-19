# Mythos Gates: Ascension — Official Combat System Specification
**Locked:** August 19, 2026
**Approved by:** BudE404 (Creative Director), BIGagent404

---

## Overview

Mythos Gates uses a **2.5D stat-driven combat system** designed for mobile. The battlefield is a flat plane with 3D terrain creating the illusion of depth. Combat is pure RPG mechanics — no twitch reflexes, no timing windows, no joystick required. The player is a strategist, not a button-masher.

## Battlefield Architecture

### 2.5D Plane
- The combat plane is **flat** — all movement and positioning happens on a single layer
- **3D terrain** (buildings, columns, cliffs, ruins, environmental structures) sits ON the flat plane to create visual depth
- Camera is positioned at a **~30-degree overhead angle** — flat enough for tactical clarity, angled enough to sell 3D depth
- Scale reference: tiny human-sized buildings and structures scattered across the field to show **god-scale** combat (avatars tower over everything)

### Ground Effect Zones
The flat combat plane contains **interactive zones** with gameplay effects:
- **Damage Zones** — void-mist pools, fire fields, energy burns (deal damage over time)
- **Buff Zones** — faction-aligned power spots (increase damage, defense, or ability charge speed)
- **Debuff Zones** — slow fields, weaken areas (reduce enemy effectiveness)
- **Hazard Zones** — instant damage if occupied too long (forces repositioning)

Zone layouts are **unique per battlefield** based on faction terrain:
- **Aten Ra (Egypt):** Solar burn zones, sandstorm blind areas
- **Asgardian (Scandinavia):** Storm surge zones, ice slick areas
- **Olympian (Greece):** Divine light buff zones, earthquake cracks
- **Tuatha (Ireland):** Root-grasp zones, mist concealment areas
- **Kami (Japan):** Spirit energy zones, sakura bloom buffs
- **Empyrean (Mesopotamia):** Radiant light zones, holy ground buffs
- **Infernal Dominion (Underworld):** Hellfire damage zones, magma flows
- **Hollow (Void):** Void-mist dissolution zones, anti-light hazard fields

## Control Scheme (Mobile)

### Input Layer — Tap-Based, One-Hand Playable
| Input | Action |
|-------|--------|
| **Tap on battlefield** | Move avatar to that location (no joystick) |
| **Auto** | Basic attacks trigger automatically when enemy is within weapon range |
| **Tap ability button** | Cast ability (3-4 buttons, tap when charged/off cooldown) |
| **Tap 🔋 Ultimate button** | Unleash ultimate when Belief bar is full |

### No Auto-Move
The player manually taps to reposition the avatar. No auto-pathing to enemies. This makes positioning a deliberate strategic choice.

### No Reflex Inputs
- No dodge button to press with timing
- No parry timing window
- No manual aiming
- Everything is stat-resolved with cinematic animation

## Stat-Driven Mechanics

### Dodge / Parry System
Dodge and parry are **auto-resolved stat checks**, not player inputs:

1. Enemy attacks → Game rolls **Avatar Dodge Stat vs Enemy Accuracy Stat**
2. If Dodge succeeds → Avatar auto-evades (dodge animation plays)
3. If Dodge fails → Game rolls **Avatar Parry Stat vs Enemy Attack Power**
4. If Parry succeeds → Reduced damage taken (parry animation plays)
5. If both fail → Full damage taken

Different avatars have different dodge/parry profiles:
- High-dodge avatars evade frequently (agile, evasive playstyle)
- High-parry avatars reduce damage when hit (tanky, defensive playstyle)
- Low-both avatars take full hits (glass cannon, high damage tradeoff)

### Attack Range System
- Each weapon has a **Range Stat** (melee = short, spear = medium, bow/spell = long)
- Auto-attack only triggers when enemy is within weapon range
- If no enemy in range, avatar stands idle (player must reposition)

### Ability Types
| Type | Effect |
|------|--------|
| **Single Target** | Hits 1 enemy in range |
| **Cleave** | Hits enemies in a front arc |
| **AoE** | Hits all enemies within a radius |
| **Line** | Hits everything in a straight line |
| **Ultimate** | Hits ALL enemies on the battlefield |

### Ultimate (🔋) System
- Charges from **Belief accumulation** during combat (not from hits taken/dealt)
- When full, player taps 🔅 to unleash
- Effect is **screen-wide** — every enemy on the battlefield takes the hit
- Each deity has a **unique ultimate** (Aten Ra = solar flare, Odin = storm of spears, etc.)
- This is the strategic "win button" earned through fight duration

## Player Decisions (Core Strategy)

The player makes 4 strategic decisions every fight:
1. **WHERE to stand** — ground effect zones make positioning critical
2. **WHEN to use abilities** — charge/cooldown management + enemy positioning
3. **HOW to build the avatar** — stats, gear, belief path (dodge vs parry vs damage)
4. **WHEN to pop ultimate** — Belief bar timing, maximizing enemy hits

## Combat Flow Example (Aten Ra vs Hollow)

1. Player taps a spot near a **solar buff zone** → avatar walks there
2. Avatar enters weapon range of Hollow enemy → auto basic attacks begin
3. Hollow attacks → game rolls dodge (Aten Ra dodge = 65) vs Hollow accuracy (40) → **Dodge succeeds** → evasion animation plays
4. Player taps Ability 1 (Cleave) → hits 3 Hollows in front arc
5. Hollow attacks again → dodge fails → parry roll (Aten Ra parry = 50 vs Hollow power = 60) → **Parry fails** → full damage taken
6. Player taps to move OUT of a void-mist damage zone that appeared
7. Belief bar fills → 🔅 FULL
8. Player taps 🔅 → Aten Ra's solar flare ultimate → all remaining Hollows on battlefield take massive damage
9. Fight ends → loot drops, belief gained, avatar stats reviewed

## Design Philosophy
- **Mobile-first:** One-hand playable, tap-only, no joystick
- **RPG depth, not reflex depth:** Stats and strategy matter more than reaction time
- **Cinematic presentation:** Auto-attacks, dodges, and parries play as animations
- **Strategic positioning:** Ground effect zones make WHERE you stand matter
- **Faction identity:** Each battlefield has unique zones matching faction lore
- **God-scale maintained:** Avatars tower over the environment on every map

---
**Status:** LOCKED — Official Combat System Specification
