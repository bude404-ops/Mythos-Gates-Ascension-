# External AI Production Packet — BATTLEFIELD_001: The First Reopening Gate

Status: **ACTIVE SOURCE OF TRUTH**  
Target: **BATTLEFIELD_001 / TG-MAP-001 / The First Reopening Gate**  
Rule: **Do not generate Battlefield 002 or any later battlefield from this packet.**

## Mission
Build the first Titan Gates battlefield as the master quality benchmark. Generate or model it piece-by-piece. Validate each stage before moving forward.

## Canon Identity
- Faction: Aten Ra
- Realm: The Solar Dominion of Khepra
- Battlefield: The First Reopening Gate
- Starter deity scale reference: Aten-Ra, Solar Law Monolith
- Tactical size: 7x7, 49 meaningful spaces

## Production Stages
- BATTLEFIELD_BLUEPRINT
- COMBAT_LAYOUT
- GRAYBOX
- TERRAIN_FOUNDATION
- VERTICALITY
- COMBAT_SURFACES
- CONNECTIONS
- BOUNDARIES
- TITAN_SCALE
- REAL_3D_GEOMETRY
- MODULAR_ENVIRONMENT_ASSETS
- ARCHITECTURE
- HERO_LANDMARK
- LORE_INTEGRATION
- MATERIALS
- LIGHTING
- ENVIRONMENTAL_DRESSING
- ATMOSPHERE
- GAMEPLAY_CAMERA
- MOBILE_OPTIMIZATION
- FINAL_QUALITY_REVIEW
- APPROVAL_GATE

## Tactical Zones
- **Broken Threshold** (`entry`): Gate arrival cinematic and movement tutorial — spaces A1, A2, B1, B2
- **Sun-Cracked Causeway** (`open`): Open mobility route with ranged exposure — spaces C1, C2, D1, D2, E1, E2
- **Fallen Pylon Choke** (`choke`): Direct route, enemy blocking, pillar destruction — spaces B3, C3, D3
- **Judgment Ray Lanes** (`terrain`): Solar terrain grants Momentum but telegraphs danger — spaces E3, F3, E4, F4
- **Solar Seal Court** (`objective`): Primary objective: stabilize three solar seals — spaces B4, C4, D4
- **Anchor Scar** (`elite`): Elite encounter and reinforcements — spaces A5, B5, C5
- **Gate Mouth Arena** (`boss`): Colossal boss phase fight beside the massive Gate — spaces D5, E5, F5, G5, D6, E6, F6, G6, D7, E7, F7, G7

## Routes
- **direct**: Push through Fallen Pylon Choke; fastest path but eats ranged pressure and elite overwatch.
- **safe**: Circle through Broken Threshold ruins; slower, more cover, lower Momentum income.
- **tactical**: Enter Judgment Ray Lanes, use Aten-Ra solar law to gain Momentum and trigger terrain punishment on enemies.
- **optional**: Break the memory obelisk for micro-lore and mastery XP before boss escalation.

## Core Generation Prompt
Titan Gates tactical battleground environment concept: The First Reopening Gate. A shattered Earth-side gateway courtyard where the first playable encounter unfolds, built for a 5x5 tactical onboarding composition that can expand later. The unstable Gate pulse is visible as pressure fractures through old stone, wind-torn banners, dust columns, and cracked objective ground that feels physically broken rather than marked. Broken Earth-side Gatefield lore: ancient threshold masonry, collapsed relief statues, scorched grass, loose flagstones, and natural cover formed by fallen gate ribs. Dark mythological tactical RPG battlefield, isometric-friendly composition, mobile-readable lanes and objectives, terrain effects integrated into the location itself, no sci-fi. Canon premise: this contested battlefield shows the seven Realm source cultures colliding through the Gate; Earth mythology is only the later echo, so props must look like original Realm relics rather than museum costumes. Battlefield cosmetics rule: objective props, banners, ruins, reward caches, hazard markers, and cover pieces must inherit the owning faction source-culture materials and relic silhouettes; no generic RPG props, plain weapons, plain armor, or mismatched faction symbols.

## Negative Prompt / Rejection Rules
sci-fi, futuristic craft, guns, extradimensional beings, modern city, superhero costume, photorealistic celebrity, cute cartoon, low detail, blurry, text, watermark, logo, no glowing tiles, no neon grid markers, no board-game hazard overlays, no UI-like terrain indicators, no artificial colored floor squares, generic RPG props, plain weapon cache, plain armor cache, mismatched faction symbols, museum cosplay set dressing, historical reenactment scenery

## Aten Ra Visual Locks
- Thesis: Aten Ra is the source behind human Egyptian solar myth: living Ma’at, Ra’s noon authority, Aten’s sun-disc radiance, Khepri’s renewal, Iset’s throne-magic, Sutekh’s necessary desert violence, Maahes’ lion protection, and Amunet’s hidden power. Designs must feel like ancient humans copied these beings later — not like Titans copied Egypt.
- Materials: primary: hammered electrum-gold, sun-warmed bronze, white-gold living radiance, and royal linen hardened by solar law, secondary: lapis/obsidian blue-black shadow, turquoise/faience blue-green inlay, ivory limestone, black Nile silt glass, red desert jasper, accent: scarab emerald, lotus pink, papyrus green, blood-red Set storm marks, amber Aten hand-rays, black solar-eclipse enamel
- Texture language: hand-hammered electrum and bronze with ritual dents, edge wear, and sand-softened corners, faience-like blue-green glaze, lapis chips, obsidian enamel cracks lit from within, linen fibers stiffened into divine armor folds, sun-bleached at the edges, carved relief bands showing abstract stars, river ripples, feathers, barque arcs, and balance geometry without readable text, heat shimmer, desert abrasion, Nile polish, and incense smoke staining around sacred seams, scarab-shell iridescence or lion-fur shadow only when the deity’s myth anchor calls for it
- Color palette: white-gold noon light, electrum gold, burnished bronze, lapis/obsidian blue-black, faience turquoise, Nile silt black, desert red jasper, papyrus green, lotus pink, ivory limestone

## Geometry Rules
- Primitive cubes are permitted only for temporary graybox/blockout.
- Final terrain must use real modeled forms: sculpted surfaces, bevels, secondary geometry, irregular edges, and structural transitions.
- Textures may enhance geometry but may not hide poor modeling.
- Hero landmark and major architecture require thickness, depth, believable support, and strong silhouette.
- Do not create neon board-game tiles, sci-fi panels, robot/mecha surfaces, or human-scale architecture.

## Required External-AI Output Manifest
Every external output should include:
- asset ID prefix: `BATTLEFIELD_001`
- files generated
- dimensions / scale assumptions
- tool or model used
- polygon estimate if 3D
- texture sizes if textured
- preview camera angle
- Titan scale proxy image or note
- known limitations
- whether it satisfies the stage requested

## Import Targets
- Source assets: `assets/source/BATTLEFIELD_001/`
- Game-ready models: `assets/game_ready/BATTLEFIELD_001/`
- Previews: `assets/previews/BATTLEFIELD_001/`
- Manifest: `manifests/assets/BATTLEFIELD_001/manifest.json`

## Approval Gate
Current status: **BLUEPRINT_PACKET_READY**  
Next battlefield allowed: **NO**  
Stop after Battlefield 001 final review and wait for holder approval.
