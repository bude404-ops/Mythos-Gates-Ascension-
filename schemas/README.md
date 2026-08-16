# Schemas

Active coverage now includes Titans, factions, maps, missions, mission dialogue, asset manifests, economy, battlefield telemetry, external AI production packets, and canon version manifests.

This folder is the contract layer for Titan Gates production data.

## Intent

Every major canonical JSON record should eventually have a machine-enforced schema. The repository already validates IDs and references; schemas add team-scale confidence before outside implementation begins.

## Priority order

1. Titan
2. Faction / Realm
3. Mission
4. Mission dialogue
5. Mission art package
6. Battlefield map
7. 3D asset manifest
8. External AI packet
9. Economy / progression
10. Telemetry event
11. Canon version manifest

## Migration rule

New schemas should be added without breaking existing source files unless the migration is performed in the same change. Each schema must define required IDs, stable enum fields, versioning expectations, and cross-reference fields.
