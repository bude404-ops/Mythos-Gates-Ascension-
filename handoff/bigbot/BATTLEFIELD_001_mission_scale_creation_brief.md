# Big Bot Creation Brief — BATTLEFIELD_001

## Asset lock
- Asset ID: `BATTLEFIELD_001`
- Canon name: `The First Reopening Gate`
- Canon map: `TG-MAP-001`
- First mission using it: `TG-F01-C01-M01 — First Light Under Dead Stone`
- Approval rule: create previews first; import source files only after holder approval.
- Canon rule: do not add new lore, new faction identity, sci-fi drift, watermarks, readable logos, or non-canon symbols.

## Mission alignment
This battlefield must serve the mission, not just look impressive.

- Mission description: Aten Ra advances through sacred temple approach with shallow river-light lanes and low sandstone cover while the Gate tests whether solar law can hold under pressure.
- Terrain: sacred temple approach with shallow river-light lanes and low sandstone cover
- Primary objective: Drive your active deity to the marked solar seal before the Hollow closes around it.
- Turn limit: 11
- Team size: one active player-controlled Titan.
- Active Titan policy: ONE_PLAYER_CONTROLLED_TITAN
- Enemy wave 1: TG-CREATURE-002, TG-CREATURE-003; entry: deployed at opposing gate markers.
- Enemy wave 2: TG-CREATURE-003; entry: reinforcement from shadowed lane; trigger: turn 3 or primary objective touched.

## Required tactical layout
Create an elongated mobile-readable 3D tactical battlefield with:

1. A clear player Titan start zone.
2. Opposing Gate enemy markers for wave 1.
3. A shadowed side lane or rear lane for wave 2 reinforcement.
4. A marked solar seal objective zone reachable before turn 8 by good routing and before turn 11 normally.
5. Shallow river-light lanes that affect routing and read clearly from tactical zoom.
6. Low sandstone cover placed to create decisions without hiding silhouettes.
7. Gate pressure zones that feel dangerous but do not clutter mobile readability.
8. At least one obvious central lane and two side route choices.
9. Enough flat/collision-safe tactical surface for one Titan, several smaller enemies, VFX, and camera motion.
10. No purely decorative layout that fails the mission objective.

## Artwork alignment
Use the mission art package as binding direction:

- Map prompt: Elongated 3D tactical map for First Light Under Dead Stone, sacred temple approach with shallow river-light lanes and low sandstone cover, readable mobile lanes, three-Titan tactical scale, faction-specific Aten Ra gold, sandstone, turquoise river-light, and solemn Gate pressure.
- Background: Mythic Sun Realm background for Awakening, distant pyramids, solar obelisks, ancient river channels, no modern elements, no comedy tone.
- Enemy placement: Place enemies to create lane decisions, objective tension, and flanking pressure without hiding readable silhouettes.
- Objective art: Solar seal, obelisk anchor, river-light marker, or Gate pressure node with clear mobile visibility.
- VFX: sunflare tile warning, river-light pulse, Gate pressure distortion, Hollow shadow contact
- Thumbnail promise: First Light Under Dead Stone thumbnail: three Titan silhouettes advancing through sacred temple approach with shallow river-light lanes and low sandstone cover.

## Scale and sizing contract
All sizing must follow the Master Scale Reference. Do not invent independent scale.

Relative scale units:
- Normal humanoid: 1.0
- Small swarm: 0.55
- Standard enemy: 1.15
- Elite enemy: 1.85
- Player Titan: 5.2
- Heavy Titan: 6.1
- Titan-scale enemy: 5.8
- Mythos Gate arch: 14.0
- Gate interior opening: 8.0
- Statue: 7.5
- Bridge / major lane width: 6.5
- Temple pylon: 11.0

Scale rules:
- Do not shrink Titans to fit the map; enlarge architecture and Gate landmarks.
- Normal enemies must read visibly smaller than the Titan.
- Gates must be landmarks visible from major battlefield zones.
- Tactical grid spaces express decisions, not literal human-sized squares.
- Titan attacks need room for arcs, shockwaves, dust, terrain reaction, and camera weight.

## Required 3D deliverables
Big must return these before approval/import:

1. Original 3D source file.
2. Preview render from tactical gameplay camera.
3. Top-down layout preview.
4. Scale comparison preview with player Titan, standard enemy, Gate arch, cover, and lane width.
5. Notes listing tool/version, unit assumptions, polygon/texture assumptions, blockers, and what is not final.

## Required blueprint views to satisfy before final import
The final source bundle must support these views or equivalent review images:

- Full battlefield top-down blueprint
- 3D perspective reference
- Side and front elevation
- Terrain height map
- Grid reference
- Walkable and non-walkable area maps
- Spawn zones
- Objective zones
- Cover zones
- Interactive areas
- Camera boundaries
- Terrain material map
- Environmental prop layout
- Structure layout
- Gate placement
- Titan clearance zones
- Enemy clearance zones
- Gameplay scale reference

## Mobile and performance gates
- Mobile tactical view must stay readable at 360x640.
- Normal zoom must stay readable at 390x844.
- Boss/action camera framing must work at 430x932.
- Bottom action bar obstruction must not hide the objective, player Titan, or enemy threats.
- Include LOD0 close, LOD1 gameplay, LOD2 distance, and a separate simplified collision mesh.
- Never derive gameplay collision from high-detail art mesh.

## Rejection triggers
Reject or revise if any of these happen:

- The battlefield looks like a neon board-game tile instead of physical broken Gatefield terrain.
- The Gate is too small to justify Titan travel.
- Titans look human-sized because the terrain or camera is wrong.
- Cover blocks mobile silhouettes.
- Enemy lanes do not match mission wave entries.
- The solar seal objective is unclear.
- Sci-fi armor, firearms, modern UI, corporate markings, watermarks, or readable generated text appear.
- It cannot support the mission objective and turn pressure.

## Import rule
Only after holder approval:

1. Import the real source file under the permanent asset ID `BATTLEFIELD_001`.
2. Preserve the original source file.
3. Update the asset registry and manifest.
4. Run asset detection and validation.
5. Commit only the approved asset bundle and validation updates.
