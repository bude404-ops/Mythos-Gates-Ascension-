# MYTHOS GATES: ASCENSION — CAMPAIGN MAP SYSTEM
**Version:** 1.0  
**Date:** August 19, 2026  
**Total Maps:** 7 Realm Routes + 3 Threat Layer Maps + 4 World Boss Arenas = 14 Maps  

---

## MAP ARCHITECTURE

Each map consists of:
- **Campaign Map** (mobile chapter-select layer — shows the Realm overview, route path, chapter nodes)
- **Tactical Map** (2.5D battle-board — the actual playable dungeon rooms)

---

# SECTION 1: REALM ROUTE MAPS (7)

## MAP 1: Sun-Scale Verdict Descent — Aten Ra
**Realm:** The Solar Dominion of Khepra  
**Gate State:** Unstable (sun-bleeding)  
**Visual:** Desert temple complexes, solar pylons, Nile-black rivers, lotus fields, sandstone ruins  

### Campaign Map Layout
```
[Entry Gate] → [Room 1: Sun-Bleached Antechamber] → [Lughch A / Lughch B]
  Lughch A → [Room 2: Lotus Verdict Hall] → [Room 3: Solar Scale Chamber] → [Elite: Misweighed Judge] → [Room 5: Ma'at Shrine] → [Boss: The Sun-Scorched Oathbreaker]
  Lughch B → [Room 2: Nile Underground] → [Room 3: Forgotten Pharaoh's Tomb] → [Treasure Room] → [Room 4: Duat Threshold] → [Boss: The Sun-Scorched Oathbreaker]
```

### Tactical Room Definitions

| Room | Type | Hazards | Enemies | Lore Pickup |
|------|------|---------|---------|-------------|
| Sun-Bleached Antechamber | Combat | Solar radiation (10 ATK/s to standing deity) | 3x Khepri Scarab, 1x Uraeus Serpent | "The Gate bleeds light. That is not power. That is distress." |
| Lotus Verdict Hall | Hazard + Combat | Falling lotus pillars (200 ATK, telegraphed) | 2x Solar Judge | "Seven thousand scales. Six thousand nine hundred and ninety-nine. The missing one was eaten." |
| Solar Scale Chamber | Elite | Solar beams sweep room (150 ATK) | Elite: Misweighed Judge (8000 HP) | "Ma'at weighs the heart. The Gate weighs the soul. Neither agrees anymore." |
| Nile Underground | Combat + Hazard | Rising water (Slow 40%, 50 ATK/s) | 2x Khepri Scarab, 1x Uraeus Serpent | "The river bends uphill. Record that before you correct it." |
| Forgotten Pharaoh's Tomb | Treasure | None — safe room | 1x Solar Judge (guardian) | Relic: Sun-Disc of Aten (Epic) |
| Duat Threshold | Combat + Lore | Spirit fog (vision -3m) | 2x Uraeus Serpent, 1x Solar Judge | "The dead pharaoh does not rest. He waits for a verdict that will never come." |
| Ma'at Shrine | Shrine | None — healing/buff station | None | Full HP heal + 20% ATK buff for 60s |
| Boss: The Sun-Scorched Oathbreaker | Boss | Solar radiation, arena columns | Boss: Sun-Scorched Oathbreaker (15000 HP) | "He broke his oath to the sun. The sun never forgets. The sun never forgives." |

### Boss: The Sun-Scorched Oathbreaker
| Phase | HP Range | Mechanics |
|-------|---------|-----------|
| 1 | 100-66% | Solar axe swings (300 ATK). Solar beam from crown (200 ATK, pierce). Summons 2x Khepri Scarab every 15s. |
| 2 | 66-33% | Arena heats — 50 ATK/s passive. Axe gains +50% damage. Summons 1x Solar Judge. |
| 3 | 33-0% | "Final Verdict" — charges Ma'at scale. If fully charged (15s), 800 ATK room-wide. Must DPS to interrupt. Enrage: 60s. |

---

## MAP 2: Thunder-Oath Root Gauntlet — Asgardian
**Realm:** The Storm-Rooted Aesir Holds  
**Gate State:** Ruin Gate (oath memory active)  
**Visual:** Storm-iron cliffs, Yggdrasil roots, frozen bridges, thunderstorm sky, frost-covered halls  

### Campaign Map Layout
```
[Entry Gate] → [Room 1: Broken Bridge Approach] → [Lughch A / Lughch B]
  Lughch A → [Room 2: Oath-Stone Hall] → [Room 3: Storm Riven Pass] → [Elite: Forgotten Standard Bearer] → [Room 5: Shield-Wall Shrine] → [Boss: The Forgotten Standard Bearer (Phase 2)]
  Lughch B → [Room 2: Frozen Root Tunnels] → [Room 3: Draugr Mound] → [Treasure Room] → [Room 4: Thunder Vault] → [Boss]
```

### Tactical Room Definitions

| Room | Type | Hazards | Enemies | Lore Pickup |
|------|------|---------|---------|-------------|
| Broken Bridge Approach | Combat | Lightning strikes random (250 ATK, 1s telegraph) | 3x Rime Raider | "The bridge held. That means the oath is not dead." |
| Oath-Stone Hall | Hazard | Oath-stones pulse — push deity back 3m every 4s | 2x Rime Raider, 1x Thunder-Bridge Jotun | "Do not swear unless you are prepared to be changed by the words." |
| Storm Riven Pass | Combat + Hazard | Wind pushes (movement -30%), ice patches (slide) | 1x Thunder-Bridge Jotun, 1x Valkyr Storm-Caller | "Thunder is not anger. It is memory with a voice." |
| Frozen Root Tunnels | Combat | Frost (20 ATK/s, Slow 20%) | 3x Rime Raider | "The roots remember pressure better than praise." |
| Draugr Mound | Treasure | None | 1x Thunder-Bridge Jotun (guardian) | Relic: Oath-Bound Frost Iron (Epic) |
| Thunder Vault | Combat + Lore | Lightning chains between walls (200 ATK if touched) | 1x Valkyr Storm-Caller, 2x Rime Raider | "The first step is not across the bridge. The first step is deciding what your word weighs." |
| Shield-Wall Shrine | Shrine | None | None | Full HP heal + 30% DEF buff for 60s |
| Boss: The Forgotten Standard Bearer | Boss | Oath-stone eruptions, frost zones | Boss: Forgotten Standard Bearer (18000 HP) | "I was raised by hands both courts deny. Let them deny the blood next." |

### Boss: The Forgotten Standard Bearer
| Phase | HP Range | Mechanics |
|-------|---------|-----------|
| 1 | 100-66% | Banner aura — summons 2x Rime Raider every 12s. Halberd swing (280 ATK, 1.5s telegraph). Frost stomp (200 ATK AoE, Slow). |
| 2 | 66-33% | Banner empowers — all enemies +50% ATK. Standard Bearer gains shield (blocks 3 hits). Oath-stones erupt from ground. |
| 3 | 33-0% | "Last Oath" — Bearer plants banner. Arena becomes frost zone (100 ATK/s). Bearer enrages (+80% ATK). Must destroy banner to remove frost. Enrage: 75s. |

---

## MAP 3: Laurel-Sky Hubris Trial — Olympian
**Realm:** The Celestial Heights of Olympus  
**Gate State:** Stable (oracle vapor leak)  
**Visual:** Marble courts, bronze columns, laurel groves, cloud terraces, amphitheater ruins  

### Campaign Map Layout
```
[Entry Gate] → [Room 1: Laurel Approach] → [Lughch A / Lughch B]
  Lughch A → [Room 2: Oracle Vapor Hall] → [Room 3: Trial Arena] → [Elite: Thunder Tribunal Usurper] → [Room 5: Victory Shrine] → [Boss: The Thunder Tribunal Usurper (Phase 2)]
  Lughch B → [Room 2: Bronze Forge Ruins] → [Room 3: Cloud Terrace] → [Treasure Room] → [Room 4: Laurel Garden] → [Boss]
```

### Tactical Room Definitions

| Room | Type | Hazards | Enemies | Lore Pickup |
|------|------|---------|---------|-------------|
| Laurel Approach | Combat | Oracle vapor (random: 50% miss chance for 2s bursts) | 2x Laurel Hoplon Guard, 1x Oracle Glass Archer | "The trial is not here to admire you. It is here to measure you." |
| Oracle Vapor Hall | Hazard | Vapor clouds (Silence for 2s when entered) | 1x Oracle Glass Archer, 2x Laurel Hoplon Guard | "Glory without discipline is only noise in polished armor." |
| Trial Arena | Elite | Marble columns fall (250 ATK, telegraphed) | Elite: Bronze Chimera Trialbeast (7000 HP) | "The arena does not hate the unworthy. It simply refuses to pretend." |
| Bronze Forge Ruins | Combat | Molten bronze patches (100 ATK/s Burn) | 2x Laurel Hoplon Guard | "Even the forge tests its maker. Especially the forge." |
| Cloud Terrace | Hazard | Cloud platforms (must jump between, falling = 300 ATK fall damage) | 1x Oracle Glass Archer | "The sky does not catch you. It watches you fall." |
| Laurel Garden | Treasure | None | 1x Bronze Chimera Trialbeast (guardian) | Relic: Laurel of Triumph (Epic) |
| Victory Shrine | Shrine | None | None | Full HP heal + 25% CRIT buff for 60s |
| Boss: The Thunder Tribunal Usurper | Boss | Oracle vapor, falling columns | Boss: Thunder Tribunal Usurper (16000 HP) | "He stole the laurel. He cannot steal the verdict." |

### Boss: The Thunder Tribunal Usurper
| Phase | HP Range | Mechanics |
|-------|---------|-----------|
| 1 | 100-66% | Lightning spear (250 ATK, pierce). Shield bash (200 ATK, Stagger). Oracle vapor fills 30% of arena (Silence). Summons 2x Laurel Hoplon Guard. |
| 2 | 66-33% | Usurper gains stolen laurel — +40% ATK and DEF. Columns fall every 8s (random positions, telegraphed). Vapor expands to 50% of arena. |
| 3 | 33-0% | "Tribunal Verdict" — charges for 10s. If successful, 700 ATK room-wide + Stun 3s. Must interrupt. Usurper becomes immune to physical damage for 2s windows (alternates with vulnerable windows). Enrage: 60s. |

---

## MAP 4: Torii-Moon Mirror Road — Kami
**Realm:** The Sacred Kingdoms  
**Gate State:** Distortion (ritual rerouting)  
**Visual:** Torii gates, shrine paths, foxfire lanterns, mirror lakes, moonlit cedar forests  

### Campaign Map Layout
```
[Entry Gate] → [Room 1: Lantern Path] → [Lughch A / Lughch B]
  Lughch A → [Room 2: Mirror Lake Crossing] → [Room 3: Foxfire Shrine] → [Elite: False Reflection Kami] → [Room 5: Moon Bridge Shrine] → [Boss: The False Reflection Kami (Phase 2)]
  Lughch B → [Room 2: Cedar Mist Path] → [Room 3: Seal Room] → [Treasure Room] → [Room 4: Torii Gate Array] → [Boss]
```

### Tactical Room Definitions

| Room | Type | Hazards | Enemies | Lore Pickup |
|------|------|---------|---------|-------------|
| Lantern Path | Combat | False lanterns (explode for 200 ATK when approached) | 3x Foxfire Runner | "Count the lanterns only after closing your eyes. The honest ones remain warm." |
| Mirror Lake Crossing | Hazard + Combat | Mirror surface reflects attacks (50% reflected back) | 2x Foxfire Runner, 1x Shimenawa Binder | "The reflection moved first. The Gate has stopped asking permission from cause." |
| Foxfire Shrine | Elite | Foxfire zones (80 ATK/s Spirit, teleport random) | Elite: False Reflection Kami (6500 HP) | "Every promise wants a witness. I became the witness promises deserve." |
| Cedar Mist Path | Combat | Dense mist (vision -4m) | 2x Foxfire Runner, 1x Oni Iron-Breaker | "The path moved because you assumed it belonged to you." |
| Seal Room | Treasure | None | 1x Shimenawa Binder (guardian) | Relic: Sacred Mirror Shard (Epic) |
| Torii Gate Array | Combat + Lore | Torii gates teleport (random gate exit) | 1x Oni Iron-Breaker, 2x Foxfire Runner | "Mark the reflection last. It is the first thing that wants to be believed." |
| Moon Bridge Shrine | Shrine | None | None | Full HP heal + 30% SPD buff for 60s |
| Boss: The False Reflection Kami | Boss | Mirror copies, foxfire zones, teleport gates | Boss: False Reflection Kami (14000 HP) | "Balance is not softness. It is the blade returning to center." |

### Boss: The False Reflection Kami
| Phase | HP Range | Mechanics |
|-------|---------|-----------|
| 1 | 100-66% | Creates a mirror copy of the deity (50% stats). Foxfire bolts (180 ATK). Teleports between torii gates. |
| 2 | 66-33% | Two mirror copies simultaneously. Arena has 4 foxfire zones (80 ATK/s). Shimenawa roots (bind 2s) every 10s. |
| 3 | 33-0% | "Broken Mirror" — 6 mirror shards scatter across arena. Each creates a mini-copy (30% stats). Must destroy all shards to damage boss. Boss immune while shards exist. Enrage: 90s. |

---

## MAP 5: Silver-Root Geas Labyrinth — Tuatha
**Realm:** Avalora  
**Gate State:** Sealed (fae time bleed)  
**Visual:** Living forests, root tunnels, standing stones, moonlit glades, mist-heavy atmosphere  

### Campaign Map Layout
```
[Entry Gate] → [Room 1: Root Mouth Entrance] → [Lughch A / Lughch B]
  Lughch A → [Room 2: Geas Chamber] → [Room 3: Thorn Maze] → [Elite: Crow-Crowned Geas Breaker] → [Room 5: Cauldron Shrine] → [Boss: The Crow-Crowned Geas Breaker (Phase 2)]
  Lughch B → [Room 2: Moonlit Glade] → [Room 3: Standing Stone Circle] → [Treasure Room] → [Room 4: Fae Time Pocket] → [Boss]
```

### Tactical Room Definitions

| Room | Type | Hazards | Enemies | Lore Pickup |
|------|------|---------|---------|-------------|
| Root Mouth Entrance | Combat | Roots grab (Root 1.5s every 5s) | 3x Thornbound Strangler | "Walk lightly. Not because the ground is fragile. Because it is listening." |
| Geas Chamber | Hazard | Geas zones (disable random ability for 3s when entered) | 1x Druidic Seer, 2x Thornbound Strangler | "The root remembers pressure better than praise." |
| Thorn Maze | Elite | Thorns (40 ATK/s + Bleed on contact) | Elite: Ancient Root Ogre (7500 HP) | "Do not call the wound ugly. It kept the hill from splitting." |
| Moonlit Glade | Combat | Time bleed (random 0.5x or 2x speed for 3s bursts) | 2x Thornbound Strangler, 1x Ancient Root Ogre | "Green things are not harmless. They are merely patient with their teeth." |
| Standing Stone Circle | Treasure | None | 1x Ancient Root Ogre (guardian) | Relic: Silver Lughch Crown (Epic) |
| Fae Time Pocket | Combat + Lore | Time distortion (cooldowns +50% for 4s) | 1x Druidic Seer, 2x Thornbound Strangler | "The root remembers pressure better than praise. It forgets nothing else." |
| Cauldron Shrine | Shrine | None | None | Full HP heal + 30% REC buff for 60s |
| Boss: The Crow-Crowned Geas Breaker | Boss | Thorn zones, geas zones, crow swarms | Boss: Crow-Crowned Geas Breaker (17000 HP) | "I was bound by a promise I never made. I broke it by becoming the one who made it." |

### Boss: The Crow-Crowned Geas Fracture
| Phase | HP Range | Mechanics |
|-------|---------|-----------|
| 1 | 100-66% | Thorn lash (250 ATK, Bleed). Crow swarm (150 ATK, Blind 2s). Geas zone (disable random ability 3s). Summons 2x Thornbound Strangler. |
| 2 | 66-33% | Root eruption (200 ATK AoE, random). Fae time (deity cooldowns +50% for 5s). Geas Breaker gains +40% SPD. |
| 3 | 33-0% | "Geas Unbound" — all geas zones expand to cover 60% of arena. Crow crown releases massive swarm (300 ATK/s for 5s). Must destroy thorn walls to create safe zones. Enrage: 80s. |

---

## MAP 6: Choir-Vault Discord Ascent — Empyrean
**Realm:** The Radiant Hierarchies  
**Gate State:** Wound Gate (radiance leak)  
**Visual:** White-gold cathedral vaults, glass stair-ladders, choir halls, light bridges, celestial architecture  

### Campaign Map Layout
```
[Entry Gate] → [Room 1: Discord Antechamber] → [Lughch A / Lughch B]
  Lughch A → [Room 2: Choir Hall] → [Room 3: Glass Stair] → [Elite: Discord Warden] → [Room 5: Harmony Shrine] → [Boss: The Discord Warden (Phase 2)]
  Lughch B → [Room 2: Light Bridge Crossing] → [Room 3: Vault Archive] → [Treasure Room] → [Room 4: Bell Tower] → [Boss]
```

### Tactical Room Definitions

| Room | Type | Hazards | Enemies | Lore Pickup |
|------|------|---------|---------|-------------|
| Discord Antechamber | Combat | Discord radiance (random: 100 ATK pulse every 5s) | 3x Choir Vanguard | "The lower notes are missing. The Choir continues because it has mistaken absence for consent." |
| Choir Hall | Hazard | Choral resonance (Silence 2s when resonance peaks) | 2x Choir Vanguard, 1x Light-Clad Sentinel | "A law that cannot bend will eventually call breathing a violation." |
| Glass Stair | Elite | Stair collapses (random steps fall, 300 ATK fall) | Elite: Seraphic Iron-Clad (7000 HP) | "Do not run. The stair punishes urgency more reliably than malice." |
| Light Bridge Crossing | Hazard | Light bridge flickers (must time crossings, fall = 250 ATK) | 1x Light-Clad Sentinel | "The Choir is beautiful. That does not mean it is right." |
| Vault Archive | Treasure | None | 1x Seraphic Iron-Clad (guardian) | Relic: Containment Helm (Epic) |
| Bell Tower | Combat + Lore | Bell tolls (200 ATK AoE every 10s, Stun 1s) | 1x Light-Clad Sentinel, 2x Choir Vanguard | "Preservation without discernment becomes a polished tomb." |
| Harmony Shrine | Shrine | None | None | Full HP heal + 25% DEF + 25% REC for 60s |
| Boss: The Discord Warden | Boss | Discord zones, collapsing stairs, bell tolls | Boss: Discord Warden (16000 HP) | "Mercy variable removed. Preservation purity restored." |

### Boss: The Discord Warden
| Phase | HP Range | Mechanics |
|-------|---------|-----------|
| 1 | 100-66% | Radiant blade (280 ATK, pierce). Containment field (blocks area, 3s). Discord pulse (200 ATK AoE, Silences 2s). Summons 2x Choir Vanguard. |
| 2 | 66-33% | Arena stairs collapse (safe zones shrink). Warden gains Divine Aegis (blocks 2 hits, reflects). Bell tolls every 8s (Stun 1s). |
| 3 | 33-0% | "Final Choir" — Warden channels for 12s. If completed, 600 ATK + permanently Silences. Must interrupt. Warden becomes pure light — only vulnerable during 2s windows when light flickers. Enrage: 70s. |

---

## MAP 7: Black-Iron Debt Descent — Infernal Dominion
**Realm:** The Infernal Dominion  
**Gate State:** Distortion (contract-bound)  
**Visual:** Black iron courts, volcanic halls, chain bridges, ash markets, execution chambers  

### Campaign Map Layout
```
[Entry Gate] → [Room 1: Ash Market Approach] → [Lughch A / Lughch B]
  Lughch A → [Room 2: Contract Court] → [Room 3: Chain Bridge] → [Elite: Chain Magistrate] → [Room 5: Ember Shrine] → [Boss: The Chain Magistrate (Phase 2)]
  Lughch B → [Room 2: Volcanic Passage] → [Room 3: Debt Archive] → [Treasure Room] → [Room 4: Execution Floor] → [Boss]
```

### Tactical Room Definitions

| Room | Type | Hazards | Enemies | Lore Pickup |
|------|------|---------|---------|-------------|
| Ash Market Approach | Combat | Ashfall (vision -2m, 10 ATK/s) | 2x Brass Hellhound, 1x Cinder-Chain Bailiff | "Name the cost before you call the offer cruel." |
| Contract Court | Hazard | Contract zones (deity takes 50% more damage inside) | 1x Cinder-Chain Bailiff, 2x Brass Hellhound | "I do not hide the chain. That is more honesty than most Realms can bear." |
| Chain Bridge | Elite | Chains sweep bridge (200 ATK, knockback) | Elite: Black Iron Executor (7500 HP) | "Power without terms is just violence waiting for a witness." |
| Volcanic Passage | Combat | Lava patches (150 ATK/s Burn) | 2x Brass Hellhound, 1x Cinder-Chain Bailiff | "Fire does not fear water. It fears a current with judgment behind it." |
| Debt Archive | Treasure | None | 1x Black Iron Executor (guardian) | Relic: Iron Crown of Dominion (Epic) |
| Execution Floor | Combat + Lore | Furnace bursts (250 ATK random, 1s telegraph) | 1x Black Iron Executor, 2x Brass Hellhound | "The executioner does not hate. Hate would imply he cares about the verdict." |
| Ember Shrine | Shrine | None | None | Full HP heal + 30% ATK buff for 60s |
| Boss: The Chain Magistrate | Boss | Contract zones, chain sweeps, furnace bursts | Boss: Chain Magistrate (18000 HP) | "Every bargain creates a throne, a chain, or a wound." |

### Boss: The Chain Magistrate
| Phase | HP Range | Mechanics |
|-------|---------|-----------|
| 1 | 100-66% | Chain lash (250 ATK, pull 3m). Contract zone (deity takes +50% damage). Summons 2x Brass Hellhound. Ember burst (200 ATK AoE). |
| 2 | 66-33% | "Debt Called" — pulls deity's highest stat. Reduces it by 30% for 10s. Chain cages (trap deity 2s). Furnace floor (50 ATK/s arena-wide). |
| 3 | 33-0% | "Final Verdict" — Magistrate charges contract. If completed (10s), 800 ATK + permanently reduces deity's stats by 20%. Must interrupt. Magistrate gains iron armor (+50% DEF). Enrage: 65s. |

---

# SECTION 2: THREAT LAYER MAPS (3)

## THREAT MAP 1: Hollow Breach
**Type:** Threat Mission (shorter, higher pressure)  
**Visual:** Reality dissolving at edges, void-mist corridors, white fracture cracks spreading  

| Room | Type | Hazards | Enemies |
|------|------|---------|---------|
| Dissolving Corridor | Combat + Hazard | Void zones (150 ATK/s, expanding) | 4x Hollow Wretch, 2x Hollow Knell Archer |
| Identity Loss Chamber | Elite | Anti-light (deity vision -4m, abilities cost +30% DE) | Elite: Hollow Mirror-Face |
| Void Heart | Boss | Arena dissolving (safe zone shrinks every 10s) | Boss: Hollow Throne Guard (10000 HP) |

---

## THREAT MAP 2: Beast Realm Hunt
**Type:** Threat Mission  
**Visual:** Primordial wilderness, massive bone formations, ancient creature trails  

| Room | Type | Hazards | Enemies |
|------|------|---------|---------|
| Predator Trail | Combat | Pounce zones (telegraphed ambush) | 3x Beast Realm Maneater |
| Pack Den | Elite | None | Elite: Beast Realm Maneater Alpha (enhanced) |
| Primal Maw | Boss | Pack mechanics (enemies arrive in waves) | Boss: Primal Chimera (12000 HP, 3 attack types) |

---

## THREAT MAP 3: Gateborn Anomaly
**Type:** Threat Mission  
**Visual:** Distorted reality, floating terrain, portal fragments, gravity warps  

| Room | Type | Hazards | Enemies |
|------|------|---------|---------|
| Gravity Warp Hall | Combat + Hazard | Gravity flips (deity controls inverted for 3s bursts) | 2x Gateborn Colossus |
| Portal Maze | Elite | Random portals teleport deity to random room location | Elite: Gateborn Colossus (enhanced) |
| Anomaly Core | Boss | Reality fragments (arena splits, reunites, splits) | Boss: Gateborn Abomination (11000 HP, random abilities) |

---

# SECTION 3: WORLD BOSS ARENAS (4)

## WB ARENA 1: The Drowned Deep
**World Boss:** Leviathan of the First Flood  
**Visual:** Storm-wracked ocean, moonlit sky (no sun), drowned temples beneath waves, broken ships  

| Feature | Detail |
|---------|--------|
| Arena Size | Extra-large (deity is dwarfed) |
| Water Level | Rises in Phase 2, fully submerged Phase 3 |
| Platforms | Floating debris (Phase 2-3, must stand on these) |
| Special | Moonlight illumination — Leviathan's eyes light the arena |
| Enrage | 90 seconds in Phase 3 |

---

## WB ARENA 2: The World-Wound
**World Boss:** Hollow World-Wound Behemoth  
**Visual:** Void-mist arena, white fracture cracks across ground, anti-light atmosphere, Gate stone fragments embedded in terrain  

| Feature | Detail |
|---------|--------|
| Arena Size | Large |
| Void Zones | Expand throughout fight (Phase 2+) |
| Safe Zone | Shrinks as fight progresses |
| Special | Arena goes dark at 50% HP — vision reduced to 3m |
| Enrage | 120 seconds in Phase 2 |

---

## WB ARENA 3: The Broken Gate
**World Boss:** The Gate Counter  
**Visual:** Colossal broken Mythos Gate, ancient stone plaza, petrified forest, amber-gold dust, dead mountains  

| Feature | Detail |
|---------|--------|
| Arena Size | Massive (Gate fills background) |
| Root Growth | Roots spread across arena in Phase 2 |
| Arena Shrink | Safe zone contracts in Phase 3 |
| Special | Guardian is fused with Gate — immovable, only front-facing vulnerable |
| Enrage | 180 seconds in Phase 3 |

---

## WB ARENA 4: The Forgotten Wastes
**World Boss:** The Forgotten Giant  
**Visual:** Dead realm, frost everywhere, half-dissolved ruins, mountains losing their shape, sky fading to white  

| Feature | Detail |
|---------|--------|
| Arena Size | Large |
| Frost Zones | Created by Giant's footsteps, persist entire fight |
| Erasure Zones | Arena edges dissolve in Phase 2, expand in Phase 3 |
| Special | Giant's right side becomes intangible in Phase 3 — can only damage left side |
| Enrage | 150 seconds in Phase 3 |

---

## END OF CAMPAIGN MAPS
Total: 7 Realm Routes + 3 Threat Maps + 4 World Boss Arenas = 14 Maps
