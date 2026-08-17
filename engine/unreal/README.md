# Unreal Engine 5 Target Architecture

Titan Gates: Ascension is now an Unreal Engine 5-first Titan-scale dungeon-crawler tactical RPG target. Unreal consumes validated canon; it does not invent canon.

## Primary mappings

| Canon / framework record | Unreal target |
| --- | --- |
| Titan | `UTG_TitanCombatData` DataAsset |
| Mission | `UTG_MissionDefinition` PrimaryDataAsset |
| Region | `UTG_RegionDefinition` PrimaryDataAsset |
| Zone | `UTG_ZoneDefinition` DataAsset + Level Instance |
| Encounter set | `UTG_EncounterTable` Data Table |
| Tactical arena | `UTG_TacticalArenaData` DataAsset |
| Boss arena | `UTG_BossArenaData` DataAsset |
| Asset manifest | `UTG_AssetImportManifest` import metadata |
| Battlefield map | `UTG_BattlefieldMapData` DataAsset |

## Framework files

- `dungeon-crawler-framework.json` defines the UE5-first architecture.
- `first-mission-zone-template.json` converts `TG-F01-C01-M01` into the first reusable region/zone/arena template.
- `ue5-dungeon-framework.mjs` validates framework continuity.

## Import discipline

- Do not author canon inside Unreal first.
- Preserve permanent IDs as stable Primary Asset IDs.
- Use DataAssets, Data Tables, Blueprint Actor Components, and Level Instances.
- Keep source assets and optimized runtime assets distinct.
- Block import if upstream schema validation fails.
- Treat mobile-compatible lighting as the default target; high-end Lumen is a variant, not the base.
- AI generation assembles approved modules in ordered stages; it does not generate whole campaigns at once.
