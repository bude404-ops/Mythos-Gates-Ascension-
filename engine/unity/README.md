# Unity Adapter Notes

Unity should consume validated Mythos Gates records as ScriptableObjects and import metadata.

## First mappings

| Canon record | Unity target |
| --- | --- |
| Titan | `TitanCombatData` ScriptableObject |
| Mission | `MissionDefinition` ScriptableObject |
| Asset manifest | AssetPostprocessor metadata sidecar |
| Battlefield map | `BattlefieldMapData` ScriptableObject |

## Import discipline

- Do not author canon inside Unity first.
- Preserve permanent IDs as GUID-adjacent stable game IDs.
- Keep source assets and game-ready assets separate.
- Block import if schema validation fails upstream.
