# Mythos Gates: Ascension — Official Combat System Specification
**Locked:** August 20, 2026 (v3.0.0 — FINAL)
**Approved by:** BudE404 (Creative Director), BIGagent404

---

## Overview

Mythos Gates uses a **2.5D stat-driven combat system** designed for mobile. The battlefield is a flat plane with 3D terrain creating the illusion of depth. Combat is RPG mechanics + MOBA-lite mobility — no joystick, no timing windows, tap-to-move. The player is a strategist who controls positioning and ability timing, not a button-masher.

**Feel reference:** Arena of Valor / Wild Rift simplified. God-scale combat. One-hand playable.

## Control Scheme (Mobile) — FINAL

### Input Layer — Tap-Based, One-Hand Playable
| Input | Action |
|-------|--------|
| **Tap on battlefield** | Move avatar to that location (NO joystick) |
| **Auto** | Basic attacks trigger automatically when enemy is within weapon range (free, no input) |
| **Tap ability button (×3-4)** | Cast ability when charged/off cooldown |
| **Tap 🔋 Ultimate button** | Unleash ultimate when Belief bar is full |
| **Tap dodge button** | Quick dash reposition (spatial awareness counter, NOT timing-based) |

### Total: 4-5 Buttons
- 3-4 ability buttons (tap when charged/cooldown ready)
- 1 dodge button (quick dash for repositioning)
- **ZERO joysticks**

### Tap-to-Move
The player manually taps to reposition the avatar. No auto-pathing to enemies. This makes positioning a deliberate strategic choice. The avatar walks to the tapped location.

### Auto Basic Attacks
When an enemy enters the avatar's weapon range, basic attacks trigger automatically — no button press needed. If no enemy is in range, the avatar stands idle (player must tap to reposition).

### Dodge Button — Spatial Repositioning Only
The dodge button is a **quick dash** for spatial repositioning:
- Escape hazard/damage zones
- Close distance to enemies
- Reposition for ability placement
- **NOT a timing window** — no i-frames, no invincibility frames
- **NOT reflex-based** — it's a movement tool, not a combat mechanic
- Short cooldown (3-5s)

### Stat-Driven Dodge/Parry (Damage Mitigation)
Separate from the dodge button, dodge and parry as **damage mitigation** are **auto-resolved stat checks**, not player inputs:

1. Enemy attacks → Game rolls **Avatar Dodge Stat vs Enemy Accuracy Stat**
2. If Dodge succeeds → Avatar auto-evades (dodge animation plays)
3. If Dodge fails → Game rolls **Avatar Parry Stat vs Enemy Attack Power**
4. If Parry succeeds → Reduced damage taken (parry animation plays)
5. If both fail → Full damage taken

Different avatars have different dodge/parry profiles:
- High-dodge avatars evade frequently (agile, evasive playstyle)
- High-parry avatars reduce damage when hit (tanky, defensive playstyle)
- Low-both avatars take full hits (glass cannon, high damage tradeoff)

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

## Attack Range System
- Each weapon has a **Range Stat** (melee = short, spear = medium, bow/spell = long)
- Auto-attack only triggers when enemy is within weapon range
- If no enemy in range, avatar stands idle (player must tap to reposition)

## Ability Types
| Type | Effect |
|------|--------|
| **Single Target** | Hits 1 enemy in range |
| **Cleave** | Hits enemies in a front arc |
| **AoE** | Hits all enemies within a radius |
| **Line** | Hits everything in a straight line |
| **Ultimate** | Hits ALL enemies on the battlefield — screen-wide |

## Resources

### Divine Energy
- Built from basic attacks and taking damage
- Spent on abilities 1, 2, and Signature
- Each ability has a Divine Energy cost

### Belief Bar (Ultimate Resource)
- Built throughout the battle from all combat actions
- At 100%, Ultimate/Ascension is unlocked
- Player taps the Ultimate button to unleash
- Effect is **screen-wide** — every enemy on the battlefield takes the hit
- Each deity has a **unique ultimate** (live kit examples: data/deities/ — Shemris = heat-shimmer volley, Stormmoot kits = oath-spears, etc.)

### Faction Resource
- Each faction has a unique resource (Solar Charge, Oathfire, Divine Favor, Sealfire, Geas, Choir Resonance, Debtfire)
- Powers the deity's faction passive buff
- Builds from combat actions (role-dependent: block, cast, shoot, crit)
- Empowers at 3 stacks (mini-power) and 5 stacks (full-power)
- See `FACTION_BUFFS.md` for full details on each faction's buff
- Scales with level: +10%/+20%/+30% effect at levels 10/20/30

## Player Decisions (Core Strategy)

The player makes 5 strategic decisions every fight:
1. **WHERE to stand** — ground effect zones make positioning critical
2. **WHEN to use abilities** — charge/cooldown management + enemy positioning
3. **HOW to build the avatar** — stats, gear, belief path (dodge vs parry vs damage)
4. **WHEN to pop ultimate** — Belief bar timing, maximizing enemy hits
5. **WHEN to dash** — dodge button for spatial repositioning (escape zones, close gaps, reposition)

## Combat Flow Example (Aten Ra vs Hollow)

1. Player taps a spot near a **solar buff zone** → avatar walks there
2. Avatar enters weapon range of Hollow enemy → auto basic attacks begin
3. Hollow attacks → game rolls dodge (Aten Ra dodge = 65) vs Hollow accuracy (40) → **Dodge succeeds** → evasion animation plays
4. Player taps Ability 1 (Cleave) → hits 3 Hollows in front arc
5. Hollow attacks again → dodge fails → parry roll (Aten Ra parry = 50 vs Hollow power = 60) → **Parry fails** → full damage taken
6. Player taps **dodge button** → quick dash OUT of a void-mist damage zone that appeared
7. Belief bar fills → 🔋 FULL
8. Player taps 🔋 → Aten Ra's solar flare ultimate → all remaining Hollows on battlefield take massive damage
9. Fight ends → loot drops, belief gained, avatar stats reviewed

## Enemy AI System

### Design Philosophy
Hollow enemies are not punching bags — they are tactical opponents that understand the battlefield, the player's abilities, and the ground effect system. The AI creates emergent, chess-like encounters where the player must think 2-3 moves ahead.

### 1. Terrain Awareness
Enemies interact with ground effect zones strategically:
- **Zone Exploitation:** Enemies seek out their own buff zones to power up before engaging
- **Zone Denial:** Enemies occupy or block access to player buff zones
- **Hazard Baiting:** Enemies use knockback abilities to push the player toward hazard zones
- **Cover Usage:** Enemies retreat behind 3D terrain elements to break line of sight and reset
- **Debuff Ambush:** Enemies wait in debuff zones where the player will be slowed/weakened if they approach

### 2. Combat Mechanic Intelligence
Enemies track and respond to the player's combat state:
- **Cooldown Tracking:** Enemies recognize when player abilities are on cooldown and press the attack during vulnerable windows
- **Belief Bar Awareness:** Enemies detect when the player's ultimate is charging and attempt to burst the player down before it activates
- **Range Exploitation:** Melee enemies attempt to close distance; ranged enemies maintain distance and kite
- **Stat Profiling:** Enemies identify player weaknesses — if player dodge is low, they swarm with fast attacks; if parry is low, they use heavy attacks
- **Repositioning:** Enemies reposition when the player moves to a buff zone, forcing the player to choose between the buff and pursuing

### 3. Enemy Archetypes

| Archetype | AI Behavior | Role |
|----------|-------------|------|
| **Stalker** | Flanks the player, waits for engagement with another enemy, then strikes from behind | Assassin |
| **Brute** | Charges through hazard zones (immune to terrain damage), uses ground slam to CREATE new hazard zones | Tank/Zone Controller |
| **Caster** | Stands in buff zones at max range, casts from distance, repositions if player approaches | Ranged DPS |
| **Swarmer** | Groups up in debuff zones to slow the player, overwhelms with numbers, weak individually | Crowd Control |
| **Sentinel** | Guards key terrain positions, will not chase, forces the player to approach into unfavorable zones | Defender |

### 4. Adaptive Difficulty Scaling
Enemy AI sophistication scales across the campaign:

| Campaign Stage | AI Behavior |
|----------------|------------|
| **Early Campaign (Ch 1-2)** | Enemies use terrain but telegraph attacks clearly. Basic positioning, predictable patterns. |
| **Mid Campaign (Ch 3-4)** | Enemies start tracking cooldowns, using debuff zones strategically, flanking with Stalkers. |
| **Late Campaign (Ch 5)** | Full tactical AI — combos, zone denial, ability timing, coordinated attacks between archetypes. |
| **Boss Fights** | Unique AI patterns per boss. Bosses manipulate zones, summon adds, phase-shift tactics. |

### 5. Zone Manipulation
Advanced enemies can alter the battlefield:
- **Zone Creation:** Brute-type enemies crack the floor, creating new void-mist hazard zones
- **Zone Corruption:** Caster-type enemies can corrupt a player buff zone into a debuff zone
- **Zone Displacement:** Some enemies can push ground effect zones toward the player with abilities
- **Zone Clearing:** Elite enemies can destroy hazard zones to open escape routes for themselves

### 6. Coordinated Enemy Tactics
In late-game encounters, enemies coordinate:
- **Pincer:** Stalkers flank while Brutes push from the front
- **Zone Trap:** Caster corrupts the player's buff zone while Swarmers herd the player toward a hazard
- **Ultimate Denial:** Sentinels block escape routes while the team bursts the player before their Belief bar fills
- **Divide and Conquer:** Enemies split the player from buff zones, forcing fights in unfavorable terrain

## Avatar System

### Playable Character
The player controls an **Avatar** — a divine projection of their chosen Deity. The Deity itself is safe in their home Realm and never dies. Only the Avatar can fall in combat.

### Realm Advantage Modifiers
| Location | ATK | DEF | Cooldown |
|----------|-----|-----|----------|
| Home Realm | 0 | 0 | 0 |
| Enemy Realm | -20% | -15% | +25% |
| Earth (Neutral) | 0 | 0 | 0 |

### Death
- Avatar dies, not the Deity
- Respawn at Deity's home domain
- Penalty: 10-20% unspent Belief/Influence loss
- Preserved: Level, abilities, relics, progression

## Belief Integration

| Condition | Bonus |
|-----------|-------|
| Base per win | 100 |
| Faction passive | +10% |
| Deity faith trigger | +20% |
| Fallback (if faith not triggered) | +5% |
| **Max per win** | **130** |
| With faction bonus trigger | 135 |
| With pantheon resonance | 145 |

## Faith Triggers (4 Combat Roles)

| Role | Trigger | Bonus |
|------|---------|-------|
| **Warrior — The Unbroken** | Win while staying above 50% HP the entire fight | +20% Belief |
| **Caster — The Weaver** | Win after executing 3+ ability combo chains in one encounter | +20% Belief |
| **Archer — The Sovereign** | Win while controlling 60%+ of battlefield nodes | +20% Belief |
| **Assassin — The Breaker** | Win after breaking 3+ enemy armor/defense stacks | +20% Belief |

## Design Philosophy
- **Mobile-first:** One-hand playable, tap-only, no joystick
- **MOBA-lite feel:** Arena of Valor / Wild Rift simplified with god-scale combat
- **RPG depth, not reflex depth:** Stats and strategy matter more than reaction time
- **Cinematic presentation:** Auto-attacks, dodges, and parries play as animations
- **Strategic positioning:** Ground effect zones make WHERE you stand matter
- **Spatial awareness:** Dodge button for quick repositioning (not timing-based)
- **Faction identity:** Each battlefield has unique zones matching faction lore
- **God-scale maintained:** Avatars tower over the environment on every map

## Change Log
- **v1.0.0** — Initial turn-based tactical combat system
- **v2.0.0** — Reworked to real-time action RPG with virtual joystick + swipe dodge with i-frames
- **v2.1.0 (Aug 19 2026)** — Removed joystick, switched to tap-to-move. Dodge/parry became auto-resolved stat checks. No reflex inputs.
- **v3.0.0 (Aug 20 2026)** — FINAL: Tap-to-move + auto basic attacks + 3-4 ability buttons + 1 dodge button (spatial dash, NOT timing-based). Dodge button is for repositioning only. Stat-driven dodge/parry still auto-resolved for damage mitigation. Total 4-5 buttons. Zero joysticks. One-hand playable. MOBA-lite feel.

---
**Status:** LOCKED — Official Combat System Specification (v3.0.0)
**Approved:** August 20, 2026 by BudE404 & BIGagent404
