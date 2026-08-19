# MYTHOS GATES: ASCENSION — GAME DESIGN DOCUMENT (GDD)
**Version:** 2.0  
**Date:** August 19, 2026  
**Status:** Production-Ready  
**Platform:** Mobile (iOS/Android) with cross-platform expansion capability  
**Genre:** Mythological Tactical Dungeon-Crawler / Action-RPG  
**Visual Style:** 2.5D Grim Dark Mythological Fantasy  

---

## 1. GAME OVERVIEW

### 1.1 Logline
Choose a deity. Project your Avatar through the Mythos Gates. Cross into enemy Realms, fight through divine dungeons, and battle mythological horrors. Earn Belief and Influence to grow your Avatar's power. Survive the Ascension.

### 1.2 Core Loop
Select Deity → Project Avatar → Enter Dungeon Route (home, enemy, or Earth) → Fight Through Rooms (Combat + Hazards + Lore) → Defeat Boss → Earn Belief/Influence → Return to Hub → Upgrade Avatar/Unlock Abilities → Select Harder Route

### 1.3 Core Pillars
1. **One Avatar, One Deity** — Single-avatar mastery. You command the Avatar of a god. No squad mechanics. The Deity is safe; the Avatar fights.
2. **Mythological Authenticity** — Every deity, creature, and Realm is drawn from real mythology, refracted through grim-dark divine lens.
3. **Route Variety** — Same dungeon plays completely differently per deity. 28 deities = 28 playthroughs per route.
4. **Realm Advantage** — Home turf = full power. Enemy turf = weakened but greater rewards. Earth = neutral, balanced ground.
5. **Sacred Stakes** — No jokes. No meta. Ancient civilizations handling sacred catastrophe.
6. **Progressive Depth** — Easy to pick up, deep to master. Combat is readable on mobile but rewards skill.

---

## 2. COMBAT SYSTEM

### 2.1 Combat Format
- **Perspective:** 2.5D isometric camera (slight angle, looking down at the battlefield)
- **Scale:** Avatars are GOD-SCALE everywhere (hundreds of feet tall). Camera frames the Avatar and 4-8 enemies at a time. Environmental scale cues (tiny buildings, mountains at waist height, clouds at chest level) communicate colossal size.
- **Movement:** Touch-stick or tap-to-move with auto-facing
- **Attacks:** Auto-attack (basic) + 3 Active Abilities + 1 Ultimate
- **Passive:** 1 innate Passive that defines the Avatar's playstyle identity

### 2.2 Ability Kit Structure
Every Avatar has:
| Slot | Type | Description |
|------|------|-------------|
| Passive | Innate | Always active, defines core identity |
| Ability 1 | Active | Bread-and-butter combat ability (low cooldown) |
| Ability 2 | Active | Tactical/positioning ability (medium cooldown) |
| Ability 3 | Active | Heavy impact ability (long cooldown) |
| Ultimate | Active | Room-clearing or boss-phase ability (charged via combat) |

### 2.3 Combat Roles (9 Roles)
| Role | Playstyle | Key Stat |
|------|----------|----------|
| Defender | Methodical, unkillable, room-by-room | Armor |
| Disruptor | Bait, fake, steal tempo, punish recovery | Speed |
| Sustain | Outlast via lifesteal, regen, endurance | Recovery |
| Assassin | Stealth, dodge, burst, execute | Crit |
| Battery | Spam abilities, resource gen, combo chains | Resource |
| Breaker | Crack defenses, armor-break, stagger | Penetration |
| Artillery | Positioning-based, devastating lines | Range |
| Controller | Terrain weapon, hazards, pathing | Area |
| Guardian | Protect objectives while fighting | Defense |

### 2.4 Resource System
- **Divine Energy (DE):** Primary combat resource. Regenerates over time + on hit. Abilities cost DE.
- **Ultimate Charge:** Fills via dealing/taking damage. When full, Ultimate is available.
- **Belief:** Meta-progression resource. Earned from victories, followers, realm control. Spent to level Avatar stats.
- **Influence:** Meta-progression resource. Earned from missions, battles, territory. Spent to unlock/upgrade abilities.
- **No Mana/No Cooldown-only:** DE gates ability use, not arbitrary cooldowns. Some abilities have mechanical cooldowns for balance.

### 2.5 Damage Types
| Damage Type | Description | Counter |
|-------------|-------------|---------|
| Divine | Raw divine power | Divine Resistance |
| Storm | Lightning, thunder, wind | Storm Warding |
| Solar | Sun-fire, radiance, light | Solar Shielding |
| Frost | Ice, cold, freeze | Frost Immunity |
| Nature | Root, thorn, growth, poison | Nature Warding |
| Spirit | Soul, phase, mirror | Spirit Binding |
| Infernal | Hellfire, ash, chain | Infernal Sealing |
| Void | Hollow anti-light, erasure | Void Anchoring (rare) |

### 2.6 Status Effects
| Effect | Mechanic |
|--------|----------|
| Stagger | Enemy cannot act for 1.5s |
| Knockback | Enemy pushed back |
| Slow | Movement -40% for 3s |
| Burn | DoT — damage over time |
| Freeze | Immobilized 2s, shatters for bonus damage |
| Stun | Cannot act for 2.5s |
| Marked | Takes +25% damage from all sources |
| Corrupted | Healing reversed (takes damage instead of healing) |
| Hollowed | Identity drain — abilities cost +50% DE for 4s |

### 2.7 Enemy AI Tiers
| Tier | Behavior |
|------|----------|
| Trash | Swarm, basic attack, die fast |
| Elite | Telegraphed attacks, 2-3 ability rotations, moderate HP |
| Mini-Boss | Phase mechanics, enrage timers, requires ability use |
| Boss | Multi-phase, room mechanics, lore-driven encounters |
| World Boss | Server-event scale, unique mechanics, legendary |

### 2.8 Realm Advantage Modifiers

When an Avatar fights outside its home Realm, combat stats are modified:

| Territory | ATK Modifier | DEF Modifier | Cooldown Modifier | Reward Modifier |
|-----------|-------------|-------------|-------------------|-----------------|
| Home Realm | +0% | +0% | +0% | Standard |
| Enemy Realm | -20% | -15% | +25% | +50% Belief/Influence |
| Earth (Neutral) | +0% | +0% | +0% | +25% Belief/Influence |

---

## 3. PROGRESSION SYSTEM

### 3.1 Avatar Progression
- **Level:** 1-50 per Avatar. Gained by spending Belief earned through route completion, combat, and lore pickups.
- **Level Bonuses:** +HP, +DE, +Damage per level. No skill trees (keep it mobile-simple).
- **Ascension Rank:** After level 50, Avatars enter Ascension tiers (1-10). Each tier unlocks a passive enhancement slot. Ascension requires high Influence.

### 3.2 Belief System
- **Belief** is the spiritual fuel that powers the Avatar's connection to its Deity
- Earned from: victories, followers gained through missions, realm control objectives, daily challenges
- Spent on: Avatar level-ups (base stat increases)
- More Belief = stronger Avatar projection = more of the Deity's power channeled

### 3.3 Influence System
- **Influence** is the territorial and political power the Avatar accumulates
- Earned from: completing missions, winning battles, spreading the Deity's domain, defeating rival Avatars
- Spent on: unlocking new abilities, upgrading existing abilities, relic enhancement, Ascension tier unlocks

### 3.4 Relic System
- Relics are route rewards — divine items tied to mythology
- 3 Relic slots per Avatar: Weapon, Armor, Artifact
- Relics have rarity tiers: Common, Rare, Epic, Legendary, Mythic
- Relics provide stat bonuses + sometimes modify ability behavior
- Relics are deity-locked (Aten Ra relics only work on Aten Ra Avatars)

### 3.5 Gate Shard Currency
- **Gate Shards:** Earned from completing routes, defeating bosses, daily challenges
- Spent on: Relic rerolls, cosmetic unlocks, new deity contracts, route keys
- **Lore Shards:** Rare currency from lore pickups — used to unlock story chapters and realm codex entries

### 3.6 Hub System
- The **Crossroads** — a neutral space between Realms where the player manages their roster
- Features: Deity selection, Avatar customization, Relic management, Route selection, Codex (lore library), Daily Challenges
- Visual: A shattered Mythos Gate plaza with portals to each Realm and to Earth

### 3.7 Death and Respawn
- **Avatar Death:** The Avatar falls, not the Deity. The Gate returns the divine essence to the home Realm.
- **Respawn:** Player respawns at their Deity's domain after a cooldown period
- **Penalties:** Loss of 10-20% of unspent Belief and Influence; cooldown timer before re-deployment
- **Preserved:** Avatar level, unlocked abilities, relics, and all progression
- **Permadeath Tiers:** Only in Gate Failure difficulty (Tier 5) does death carry heavier consequences

---

## 4. CAMPAIGN STRUCTURE

### 4.1 Route Architecture
7 playable routes, one per Realm, plus Earth as neutral dungeon territory:

| # | Route Name | Realm | Gate State |
|---|-----------|-------|------------|
| 1 | Sun-Scale Verdict Descent | Aten Ra | Unstable (sun-bleeding) |
| 2 | Thunder-Oath Root Gauntlet | Asgardian | Ruin Gate (oath memory active) |
| 3 | Laurel-Sky Hubris Trial | Olympian | Stable (oracle vapor leak) |
| 4 | Torii-Moon Mirror Road | Kami | Distortion (ritual rerouting) |
| 5 | Silver-Root Geas Labyrinth | Tuatha | Sealed (fae time bleed) |
| 6 | Choir-Vault Discord Ascent | Empyrean | Wound Gate (radiance leak) |
| 7 | Black-Iron Debt Descent | Infernal Dominion | Distortion (contract-bound) |
| 8 | Earth — Hollow Corridor | Earth (Neutral) | Multiple damaged Gates |

### 4.2 Route Structure
Each route contains:
- Entry Gate (transition screen — Avatar projection sequence)
- 7+ Room Nodes minimum
- Branching paths (player chooses direction)
- Hazard rooms (Realm-specific traps)
- Combat rooms (enemy encounters)
- Shrine nodes (healing/buffs)
- Treasure rooms (relics/currency)
- Elite encounter (mini-boss)
- Lore reveal chains (story pickups)
- Boss chamber (Realm-specific boss)
- Expansion hooks (teasers for future content)

### 4.3 Mission Types
| Type | Description |
|------|-------------|
| Standard Route | Full dungeon crawl, boss at end |
| Threat Mission | Hollow/Beast Realm incursion — shorter, higher pressure |
| Gate Event | Time-limited event with unique mechanics |
| World Boss | Server-wide encounter, requires coordination |
| Lore Detour | Optional side-path with story rewards, minimal combat |
| Elite Lock | Room that requires specific role/ability to progress |
| Earth Dungeon | Neutral-territory Hollow invasion — balanced, no faction advantage |
| Cross-Realm Raid | Avatar invades enemy Realm territory — high risk, high reward |

### 4.4 Difficulty Tiers
| Tier | Name | Modifier |
|------|------|----------|
| 1 | Gate Breath | Base stats, learning mode |
| 2 | Gate Echo | +25% enemy HP/damage |
| 3 | Gate Strain | +50% enemy HP/damage, new enemy types |
| 4 | Gate Collapse | +75% enemy HP/damage, boss phases added |
| 5 | Gate Failure | +100% enemy HP/damage, heavier death penalties |

### 4.5 Campaign Chapters (19 Chapters)
- **Act I (Ch 1-6):** The First Reopening — Aten Ra + Asgardian + Olympian routes
- **Act II (Ch 7-13):** Deeper Descent — Tuatha + Kami + Empyrean routes + first World Boss + Earth dungeons unlock
- **Act III (Ch 14-19):** The Black Iron Bargain — Infernal Dominion + final World Bosses + Hollow climax on Earth

---

## 5. THREAT LAYER

### 5.1 The Hollow
- Primary cross-route antagonist
- Not a playable faction — an anti-civilization
- Consumes memory, identity, terrain law
- Punishes overextension, corrupts objectives
- Imitates consumed source-culture forms
- Visual: Void-mist bodies, white fracture cracks, anti-light absorption, Gate stone fragments as only solid anchors
- Primary invasion point: Earth (through damaged Gates)

### 5.2 Threat Categories
| Category | Role | Mechanics |
|----------|------|-----------|
| Hollow | Primary pressure | Identity drain, void corruption, anti-light |
| Forgotten | Memory loss | Erasure aura, frost spread, half-dissolved forms |
| Beast Realm | Wilderness threat | Pack mechanics, primal aggression |
| Gateborn | Anomaly threat | Portal mechanics, terrain distortion, mutations |
| World Bosses | Legendary encounters | Server events, unique mechanics |

### 5.3 World Bosses (4)
1. **Leviathan of the First Flood** — 200+ft primordial sea serpent, living stormwater body
2. **Hollow World-Wound Behemoth** — Colossal Hollow entity, void-mist colossus
3. **The Gate Guardian** — 300+ft living-stone sentinel, fused with broken Gate
4. **The Forgotten Giant** — 250+ft frost-iron Deity, walking erasure, half-erased face

---

## 6. FACTION STAT SYSTEM

### 6.1 Stat Categories
| Stat | Range | Effect |
|------|-------|--------|
| Health (HP) | 1000-5000 | Damage capacity |
| Divine Energy (DE) | 100-300 | Ability resource pool |
| Attack (ATK) | 150-800 | Base damage scaling |
| Defense (DEF) | 50-400 | Damage reduction |
| Speed (SPD) | 1-10 | Movement + attack speed |
| Crit Rate | 5%-35% | Critical hit chance |
| Crit Damage | 150%-300% | Critical hit multiplier |
| Penetration | 0-200 | Ignores enemy DEF |
| Recovery | 0-50 HP/s | Passive HP regen |
| Area | 1-10 | AoE radius modifier |

### 6.2 Stat Budget Rule
Total stat budget per Avatar = 1000 points (base). Role determines distribution:
- Defender: HP/DEF heavy
- Assassin: SPD/Crit heavy
- Artillery: ATK/Area heavy
- Battery: DE/Recovery heavy
- (etc. per role)

### 6.3 Realm Advantage Modifiers (Stat Impact)
When fighting outside home Realm, Avatar base stats are modified:
- **Home Realm:** Full stats, no penalty
- **Enemy Realm:** -20% ATK, -15% DEF, +25% cooldowns (but +50% Belief/Influence rewards)
- **Earth (Neutral):** Full stats, no penalty, +25% Belief/Influence rewards

---

## 7. VISUAL SCALE

### 7.1 God-Scale Rule (Option A)
All Avatars remain GOD-SCALE everywhere, regardless of Realm. Both the Avatar and enemies should appear COLOSSAL — hundreds of feet tall.

Scale cues to communicate god-scale:
- Tiny city buildings, temples, and structures near the fighters' feet
- Mountains in the background that only reach the fighter's waist
- Clouds at chest level of the fighters
- Rivers with tiny boats in the far background
- Birds as barely visible specks near the fighters' knees
- Impact craters that crush multiple buildings
- Weapons as wide as city avenues

### 7.2 Power Visual Indicators (Not Size)
Power differences between Realms are shown through:
- **Aura intensity:** Full radiance at home, dimmer in enemy territory, medium on Earth
- **Ability charge availability:** More charges at home, fewer in enemy territory
- **Cooldown length:** Shorter at home, longer in enemy territory
- **Particle effects:** More intense at home, reduced in enemy territory
- **NOT physical size** — the Avatar is always colossal

---

## 8. ECONOMY

### 8.1 Currencies
| Currency | Source | Use |
|----------|--------|-----|
| Belief | Victories, followers, realm control | Avatar level-ups (base stats) |
| Influence | Missions, battles, territory | Ability unlocks and upgrades |
| Gate Shards | Routes, bosses, daily challenges | Relic rerolls, cosmetics, route keys |
| Lore Shards | Lore pickups | Story chapter unlocks, codex entries |

### 8.2 Economy Flow
1. Play routes → earn Belief + Influence + Gate Shards
2. Spend Belief → level Avatar → increase base stats
3. Spend Influence → unlock abilities → expand combat options
4. Spend Gate Shards → reroll relics → optimize build
5. Higher difficulty routes → greater rewards (but greater risk)
6. Enemy Realm routes → +50% Belief/Influence (but Avatar is weakened)

---

## 9. AVATAR SYSTEM SUMMARY

| Aspect | Detail |
|--------|--------|
| Playable character | Avatar (divine projection of a Deity) |
| Deity status | Safe in home Realm — never dies |
| Avatar scale | GOD-SCALE everywhere (Option A) |
| Power source | Belief (stats) + Influence (abilities) |
| Home Realm | Full power, full aura, max charges |
| Enemy Realm | Weakened (-20% ATK, -15% DEF, +25% cooldowns) but +50% rewards |
| Earth (Neutral) | Balanced, no advantage, +25% rewards |
| Avatar death | Respawn at Deity domain, lose 10-20% unspent Belief/Influence |
| Preserved on death | Level, abilities, relics, all progression |
| Earth role | Neutral dungeons, PvP, Hollow invasions, World Bosses |
