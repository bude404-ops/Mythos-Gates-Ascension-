# Unreal Engine 5 Mobile-First Target Architecture

Titan Gates: Ascension is an Unreal Engine 5-first, mobile-baseline Titan-scale dungeon-crawler tactical RPG target. Unreal consumes validated canon; it does not invent canon.

## Primary target

- Baseline platforms: Android and iOS.
- Build mobile-first from the beginning. Do not build a PC/console version first and optimize later.
- High-end PC/console rendering is a scalable variant, not the source target.
- Preserve massive Titan scale through composition, landmarks, camera, and environment proportion — not through uncontrolled asset cost.

## Primary mappings

| Canon / framework record | Unreal target |
| --- | --- |
| Titan | `UTG_TitanCombatData` DataAsset |
| Mission | `UTG_MissionDefinition` PrimaryDataAsset |
| Region | `UTG_RegionDefinition` PrimaryDataAsset |
| Zone | `UTG_ZoneDefinition` DataAsset + Level Instance |
| Encounter set | `UTG_EncounterTable` Data Table |
| Tactical arena | `UTG_TacticalArenaData` DataAsset |
| Boss / elite arena | `UTG_BossArenaData` DataAsset |
| Asset manifest | `UTG_AssetImportManifest` import metadata |
| Battlefield map | `UTG_BattlefieldMapData` DataAsset |

## Framework files

- `dungeon-crawler-framework.json` defines the UE5 Titan-scale dungeon-crawler architecture.
- `mobile-first-architecture.json` defines Android/iOS baseline budgets, quality tiers, Titan optimization, negative rules, and first-zone approval gates.
- `data/one-titan-vs-many-combat.json` defines the core combat rule: one player-controlled Titan per battle against multiple coordinated enemies.
- `data/cross-faction-encounter-pools.json` defines lore-faithful faction creature run-ins for mission events and faction clashes without rewriting established factions.
- `first-mission-zone-template.json` converts `TG-F01-C01-M01` into the first reusable mobile master prototype.
- `ue5-dungeon-framework.mjs` and `mobile-first-architecture.mjs` validate framework continuity.

## Import discipline

- Do not author canon inside Unreal first.
- Preserve permanent IDs as stable Primary Asset IDs.
- Use DataAssets, Data Tables, Blueprint Actor Components, and Level Instances.
- Keep source assets and optimized runtime assets distinct.
- Block import if upstream schema validation fails.
- Mobile-compatible lighting is the default target; high-end Lumen is optional.
- World Partition is allowed only where it reduces loading or memory cost for larger regions.
- AI generation assembles approved modules in ordered stages; it does not generate whole campaigns at once.
- Build the first zone completely and validate scale, controls, loading, memory, FPS, streaming, combat, camera, lore, one-deity combat, visible progression, gear improvement, and return-to-exploration before expanding.
- Never add squad combat, team formations, ally positioning, multiple player-controlled Titans, or team turns.
- Cross-faction enemies must come from approved run-in pools, preserve their home faction source-culture rules, and only appear when the mission/event provides a lore-valid reason.
