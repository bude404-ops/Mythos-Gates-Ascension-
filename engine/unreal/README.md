# Unreal Adapter Notes

Unreal should consume validated Titan Gates records as DataAssets or PrimaryDataAssets.

## First mappings

| Canon record | Unreal target |
| --- | --- |
| Titan | `UTG_TitanCombatData` DataAsset |
| Mission | `UTG_MissionDefinition` PrimaryDataAsset |
| Asset manifest | `UTG_AssetImportManifest` import metadata |
| Battlefield map | `UTG_BattlefieldMapData` DataAsset |

## Import discipline

- Do not author canon inside Unreal first.
- Preserve permanent IDs as stable primary asset IDs.
- Keep source assets and optimized runtime assets distinct.
- Block import if schema validation fails upstream.
