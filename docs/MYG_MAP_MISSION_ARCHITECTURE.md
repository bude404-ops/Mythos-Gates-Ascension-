# MYTHOS GATES: ASCENSION — Map, Dungeon & Mission Architecture
## THE DEFINING CONCEPT: ONE WORLD — TWO SCALES

Locked Sept 5, 2026 (BudE404 design brief). The player normally exists as a 1–3 foot Sprite in a large fantasy world. During major story moments they pass through a divine Gate and become their true form — a colossal elemental god ~100 feet tall. Giant Mode is NOT "normal combat with a bigger character." The same world produces two fundamentally different games depending on which body you're in.

---

## 1. SPRITE-SCALE MAPS (the mortal world)

Design rule: **the world is a giant's architecture seen from the floor.** A normal building is a small dungeon. A fallen tree is a bridge. A wall crack is a door. A fireplace, basement, drainage tunnel, or shrine interior is an explorable area.

### The three space types (every map is a mosaic of these)

**SAFE** — towns, shrines, camps, NPC hearths
- No combat pressure; NPCs wander, dialogue, shops/rites, quest boards
- Rest restores HP; shrines bank EMBER
- Warm lighting, brazier glow, music shift
- Safe zones are the emotional anchor — the thing the Giant later fights to protect

**THREAT** — Hollow corruption, traps, elites
- Cold/purple palette, corruption ground-moss, skitterer nests, ambush triggers
- Elites guard chokepoints; traps reward observation (cracks that glow before they strike)
- Threat zones breathe: corruption visibly expands during missions

**DISCOVERY** — secrets, lore, relics, hidden passages, environmental storytelling
- Never marked on any map; found by curiosity: a draft of air, a wrong-colored brick, ember motes leaking through a crack
- Each discovery is one of: LORE STONE (myth fragment), RELIC SHARD (upgrade material), HIDDEN PASSAGE (shortcut or optional area), ECHO (environmental storytelling — a scene frozen in corruption)
- Discovery is the Sprite's signature content; the Giant can't access any of it

### Content verbs per space type
- SAFE → NPC interaction, investigation, rites
- THREAT → small-scale combat, traps, stealth-by-design (brush, tall grass, dark corners)
- DISCOVERY → environmental puzzles, secrets, lore, rescue objectives, optional areas
- **Not every room is a combat arena.** Target ratio per dungeon: ~40% SAFE/transition, ~35% DISCOVERY, ~25% THREAT.

---

## 2. GIANT-SCALE BATTLEFIELDS (the divine world)

Design rule: **the player is a living natural disaster, and the map knows it.**

- Large open combat zones (300–800m) with natural strategic lanes: rivers, lava channels, forest lines, cliff edges, ruin fields
- Elevation matters: ridges give slam range advantage; valleys funnel enemy armies
- **Destructible structures:** bridges (deny lanes), watchtowers (collapse onto enemy columns), walls (smash new lanes), boulders (kick through ranks)
- **Environmental hazards as weapons:** knock armies into ravines, lava, rivers; dam a stream to flood a lane; topple trees as area denial
- **Collateral damage is real:** friendly structures and civilians take damage from YOUR attacks. Protecting is a skill.
- **Objectives distributed across the battlefield,** not one arena: evacuation routes to defend, a Gate to stabilize, a shrine to protect, corruption hearts to destroy — the war happens everywhere at once
- **Colossal enemies** (enemy gods / Hollow Colossi) anchor major battles as duel set-pieces

### The Giant's interaction verbs
smash walls · collapse structures · destroy bridges · create craters · knock enemies into hazards · use terrain tactically · accidentally damage friendlies · shield civilians

---

## 3. CONNECTING THE SCALES — the SAME world twice

Hard rule: **every Giant battlefield is composed of landmarks the Sprite has already touched on foot.** The player must recognize the world from the other height.

- Sprite explores Emberfall village → later, as the God, that village sits at their feet as the thing they defend
- Sprite squeezes through a wall crack by the canyon → as the God, that same crack is an ankle-height detail
- Sprite lights the path braziers → as the God, those braziers are the evacuation route beacons still burning
- **Recognition checklist for every battlefield:** minimum 3 landmarks per map shared across scales, each with gameplay meaning at both scales (bridge = puzzle at sprite scale, lane-denial at giant scale)

The reverse direction also holds: after a Giant battle, the player returns as a Sprite and walks through the battlefield aftermath — craters they stamped, bridges they broke, the corruption they burned away.

---

## 4. LAYERED DUNGEON/MISSION STRUCTURE

Major story missions are **journeys** through depth layers, not disconnected combat rooms:

**Surface town (SAFE) → Ruins (THREAT/DISCOVERY) → Sprite Dungeon (mixed) → Ancient Chamber (DISCOVERY) → Divine/Gate Chamber (ritual) → Giant Battlefield (war) → Colossal Boss Arena (duel)**

- Not every mission uses every layer; pick 3–5 per mission
- Each layer changes ONE primary verb (talk → investigate → fight → sneak → ritual → war)
- The Gate Chamber is always the hinge between the two scales

## 5. GATES AS PHYSICAL WORLD LANDMARKS

- Gates are **enormous ancient monuments**, visible from huge distances (100–200m tall), never menu portals
- A Gate's silhouette on the horizon is the compass of the whole region — sprite navigation uses Gates as landmarks ("head toward the Cinder Gate")
- Approach ramps, pilgrimage paths, and offerings daises scale to the Sprite; the Gate itself scales to the God
- Passing through = the scale transition (growth cinematic, camera ascent, palette shift)

## 6. MISSIONS = OBJECTIVES, NOT KILLS

Objective library (each implemented with environment interaction):
REACH · INVESTIGATE · PROTECT A TOWN · RESCUE CIVILIANS · ESCORT SURVIVORS · PERFORM A RITE · DESTROY CORRUPTION · HUNT A CREATURE · DEFEND A GATE · HOLD A FIELD · DEFEAT A COLOSSUS · ESCAPE A COLLAPSE

Design rule: **kills are the obstacle, never the goal.** Every mission's win condition reads like a sentence: "Light the two braziers and reach the Gate." "Hold the shrine for three waves while the village evacuates."

## 7. THE WORLD CHANGES DURING MISSIONS

Dynamic world events (scripted beats + systemic reactions):
- Buildings collapse (Giant collateral, enemy rams), fire spreads from ember attacks, lava erupts along fault lines, bridges break under mass
- **Hollow corruption expands** over time in THREAT zones — unaddressed, it converts SAFE zones
- Gates destabilize if corruption reaches them (mission timer pressure)
- Evacuation routes reroute when blocked; boss attacks reshape the battlefield (a Colossus's opening stomp wrecks the bridge you were defending)
- **Player actions leave permanent marks:** craters, broken walls, burned corruption — visible if they return at the other scale

## 8. HANDCRAFTED vs PROCEDURAL

**Handcrafted (fixed, authored):**
- Critical story path geometry (all SAFE and Gate Chamber spaces)
- All six Gate landmarks
- Colossal boss arenas
- Landmark recognition scenes (anything that must read identically at both scales)
- Environmental storytelling moments (ECHOES)
- Main dungeons' room graph and puzzle logic

**Procedural (generated per run, seeded):**
- Cave systems, drainage networks, and interior layouts of ordinary buildings (the "building is a dungeon" spaces)
- Enemy placement within THREAT zones, patrol routes, trap positions
- Loot/relic/mote placement in DISCOVERY areas (never in SAFE)
- Corruption spread pattern during missions
- Giant battlefield enemy army composition and wave approach lanes

**Hybrid (handcrafted shell + procedural fill):**
- Towns: authored core landmarks (shrine, elder house, quest structures) + procedural house interiors/filler plots
- Ruins: authored silhouette + procedural interior rubble/paths

**Rule of thumb: if the player must REMEMBER it, handcraft it. If the player merely SURVIVES or LOOTS it, proceduralize it.**

---

## IMPLEMENTATION STATE
- Vertical-slice prototype demonstrating the concept: `mythos-gates-ascension-two-scales.html` (Sprite village → canyon ritual → Gate → God growth → protect-the-village battlefield — one shared world, both scales playable)
- Sprite dungeon mode: `mythos-gates-sprite-depths.html` (fixed-camera ARPG, DISCOVERY/THREAT pacing)
- Giant war mode: `mythos-gates-mobile-prototype.html` (wave-destroying cinematic battlefield tech)
