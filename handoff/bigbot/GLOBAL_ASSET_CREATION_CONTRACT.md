# Big Bot Global Asset Creation Contract

## Purpose
This contract governs every asset Big Bot creates for Mythos Gates: Ascension. It applies to battlefields, artwork, Titans, character models, creatures, enemies, bosses, Gates, props, structures, VFX references, and mission thumbnails.

Big Bot must create canon-locked, mission-aware, scale-correct assets. Big Bot must not create random cool assets that are disconnected from gameplay, mission specs, asset IDs, or the Master Scale Reference.

## Universal creation rule
Every asset must answer four questions before generation begins:

1. What permanent asset ID does this fulfill?
2. What mission, map, faction, character, or gameplay role does it serve?
3. What scale contract does it obey?
4. What approval is required before GitHub import?

If any answer is missing, Big Bot must stop and request the missing canon packet instead of inventing details.

## Approval gate
Big Bot may generate previews, drafts, renders, mockups, and source candidates before approval.

Big Bot may not import an asset into GitHub as canon until the holder approves it.

After approval, Big Bot must:

1. Preserve the original source file.
2. Import under the correct permanent asset ID.
3. Update the asset registry and manifest.
4. Run detection and validation.
5. Commit only the approved asset bundle plus required registry/manifest/report updates.
6. Never mark a prompt, preview, or placeholder as an imported source asset.

## Canon locks
Big Bot must not:

- Rename permanent asset IDs.
- Invent new lore.
- Invent new faction identity.
- Change a character, Titan, enemy, map, or Gate role without approval.
- Add sci-fi drift where the faction does not support it.
- Add firearms, modern corporate UI, readable generated text, watermarks, logos, or celebrity likeness drift.
- Shrink Titans to make a scene fit.
- Hide mission-critical silhouettes behind decoration.
- Treat concept art as final source without approval.

## Source authority order
When creating an asset, Big Bot must follow this authority order:

1. Permanent asset ID and asset registry.
2. Mission registry / tactical profile if the asset appears in missions.
3. Mission art package / artwork generation bundle.
4. 3D blueprint package.
5. Master Scale Reference.
6. Material Library and Visual Style Guide.
7. Holder approval.

If sources conflict, Big Bot must flag the conflict for review instead of choosing silently.

## Mission alignment requirement
Any battlefield, mission artwork, boss arena, environmental prop set, or tactical VFX must match the mission specs it serves.

Required mission alignment checks:

- Mission ID and title.
- Map ID and battlefield asset ID.
- Faction and campaign type.
- Terrain description.
- Primary objective.
- Optional objectives when they affect layout.
- Enemy waves and entry points.
- Boss requirement, if present.
- Turn limit and routing pressure.
- Special rules.
- Victory / defeat conditions.
- Tactical problem tags.
- Recommended role pressures.
- UI and thumbnail promises from the mission art package.

A battlefield must be playable for the mission, not merely decorative.

## Battlefield requirements
Every battlefield must include or clearly support:

- Player start zone.
- Enemy spawn / entry zones.
- Reinforcement lanes where mission waves require them.
- Objective zones.
- Walkable and non-walkable zones.
- Cover zones.
- Interactive or hazardous areas where specified.
- Gate placement if the map references a Gate.
- Camera boundaries.
- Top-down tactical readability.
- Titan clearance zones.
- Enemy clearance zones.
- Gameplay scale reference.
- Separate simplified collision mesh.
- LOD0 close, LOD1 gameplay, LOD2 distance, and collision LOD.

Battlefields must remain readable in mobile tactical view and must not become cluttered dioramas.


## Titan visual identity law
Titans are not robots, mechs, androids, cyborgs, powered armor suits, or normal humans in ornate armor. Every Titan must read as a living extradimensional power being whose body is fused with Realm matter, divine law, mythic anatomy, and faction symbolism. Hard surfaces are allowed only when they feel grown, forged by myth, carved from living stone, sacred metal, infernal bone, storm-iron hide, or celestial law — never mechanical plating on a robot chassis.

Every Titan prompt must pull from:

- Titan lore and personality.
- Faction culture and visual identity.
- Realm codex visual language.
- Gameplay role silhouette.
- Ability names and equipment.
- Master Scale Reference.

Big Bot must reject any Titan that reads first as machine, superhero, normal humanoid, or generic monster before it reads as a faction-specific extradimensional Titan. Big Bot must also reject any Titan that reads as a blocky building, tower, fortress, stacked geometric shape, terrain chunk pile, or abstract architecture creature instead of a living character.

## Character, Titan, creature, enemy, and boss model requirements
Every living model must include or clearly support:

- Permanent asset ID.
- Canon name.
- Asset type.
- Faction or source realm when defined.
- Gameplay role when defined.
- Scale class from the Master Scale Reference.
- Front, side, back, and 3/4 views.
- Silhouette check at mobile size.
- Scale comparison against the correct references.
- Rig notes.
- Animation socket notes where applicable.
- VFX socket notes where applicable.
- Material and color notes tied to faction/style guide.
- LOD plan.
- Collision or hit-volume notes.

Titans must feel enormous in gameplay, not only in promotional renders. Normal enemies must occupy visibly less physical volume than Titans. Bosses must obey their own scale class and should not be resized casually for composition.

## Artwork requirements
Every artwork asset must state:

- Which asset ID or mission ID it serves.
- Whether it is concept, preview, thumbnail, background, UI art, or final source candidate.
- Faction color language.
- Required visual motifs.
- Negative prompts / rejection triggers.
- Mobile crop readability.
- Whether it is approved for GitHub import.

Artwork that does not have approval stays non-canon review material.

## Scale contract
All scale must follow the Master Scale Reference.

Core relative scale units:

- normalHumanoid: 1.0
- smallSwarm: 0.55
- standardEnemy: 1.15
- eliteEnemy: 1.85
- largeEnemy: 2.8
- playerTitan: 5.2
- smallAgileTitan: 4.4
- heavyTitan: 6.1
- titanScaleEnemy: 5.8
- colossalBoss: 9.5
- standardWall: 3.4
- titanGateArch: 14.0
- gateInteriorOpening: 8.0
- statue: 7.5
- bridgeWidth: 6.5
- templePylon: 11.0

Scale rules:

- Do not shrink Titans to fit the map.
- Enlarge architecture and Gate landmarks around Titan scale.
- Gates must be visible landmarks from major battlefield zones.
- Tactical grid spaces represent decisions, not literal human-sized squares.
- Titan attacks need enough space for arcs, shockwaves, dust, terrain reaction, and camera weight.
- Scale must be checked at gameplay camera distance and mobile resolution.

## Mobile readability gates
Every final candidate must pass these checks:

- 360x640 tactical zoom.
- 390x844 normal zoom.
- 430x932 boss or action framing when relevant.
- Landscape action camera when relevant.
- Bottom action bar obstruction test.

Critical gameplay information must remain visible:

- Player unit.
- Enemy threats.
- Objective markers.
- Spawn/entry pressure.
- Gate or landmark orientation.
- Cover and walkable space.

## Required return packet before holder approval
Before asking for approval, Big Bot must return:

1. Preview render or image.
2. Source candidate summary.
3. Asset ID and canon name.
4. Mission/map/character linkage.
5. Scale assumptions.
6. Tool and version used.
7. Known blockers or unfinished areas.
8. Clear statement of whether this is only a preview or ready for approved import.

## GitHub import packet after holder approval
After approval, Big Bot must return/import:

1. Original source file in the correct source slot.
2. Preview render when available.
3. Notes file listing tool, version, scale assumptions, and blockers.
4. Registry update.
5. Manifest update.
6. Validation report update.

## Rejection triggers
Reject and revise if:

- Asset does not match its mission or canon source.
- Asset has no permanent ID.
- Titan/character/enemy scale is wrong.
- Battlefield cannot support the mission objective.
- Mobile readability fails.
- Cover or decoration hides silhouettes.
- Gate landmarks are too small.
- Source file is missing but asset is marked imported.
- Generated text, watermark, logo, or modern/sci-fi drift appears.
- The asset looks visually impressive but gameplay-useless.

## Batch rule
For batches, Big Bot must treat every asset independently. Approval of one asset does not approve the whole batch unless the holder explicitly approves the full batch.

Each batch must list:

- Approved assets.
- Rejected assets.
- Needs-revision assets.
- Missing source files.
- Validation status.

## First vertical-slice priority
The first proof target remains:

- `BATTLEFIELD_001 — The First Reopening Gate`
- Mission: `TG-F01-C01-M01 — First Light Under Dead Stone`

This first battlefield is the test of the complete pipeline. Once it passes, the same contract applies to every following battlefield and model.

## Faction Visual Bible Requirement
Before generating any faction-linked Titan, NPC, creature, battlefield, faction screen, or 3D asset, Big Bot must apply `data/faction-visual-bible.json` and `handoff/bigbot/FACTION_VISUAL_BIBLE.md`. The asset must show that faction through silhouette, armor construction, materials, texture, symbols, posture, and avoid-list compliance. Reject faction drift even if the image is otherwise high quality.

### Aten Ra Source-Culture Rule
For Aten Ra assets, do not design "Egyptian-inspired costumes." Treat the Solar Dominion of Khepra as the older source culture that human Egyptian religion, crowns, pylons, solar discs, scarabs, ankhs, funerary art, and animal-divinity later copied imperfectly. Each Aten Ra asset must show the specific myth function behind its design: Ra/Aten solar authority, Ma’at balance, Khepri renewal, Sutekh desert defense, Iset restoration, Maahes lion protection, or Amunet hidden power.

### Cross-Faction Source-Culture Rule
For every Mythos Gates faction, do not design themed costumes based on Earth mythology. Each Realm is the older extradimensional source culture that human civilizations later copied through Gate dreams, ruins, survivor memory, and distorted religious/mythic echoes. Every asset must show the specific source function behind its traits, armor, realm, posture, materials, and hazards.

### Source-Culture Weapons, Gear, and Ability Rule
Every weapon, armor body, resonance core, basic attack, technique, signature, reaction, execution, passive, and Divine Ascension must match the owning faction's source mythology. Reject generic names or visuals such as plain Implement, Realmplate, Charge Core, Blow, generic magic blast, robot weapon, or costume prop unless the faction canon explicitly transforms them into a source-culture artifact.
