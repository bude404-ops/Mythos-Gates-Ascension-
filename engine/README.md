# Engine Integration Lane

This folder defines the first engine-facing adapter boundary for Mythos Gates: Ascension.

The browser prototype remains the playable proof. Engine folders are not a second canon source; they consume canonical JSON, schemas, manifests, and source modules.

## Current adapters

```text
engine/shared/     Engine-neutral export contracts and mapping helpers
engine/unreal/     Unreal-oriented data asset handoff notes and adapter manifest
engine/unity/      Unity-oriented ScriptableObject handoff notes and adapter manifest
```

## Rules

1. Canon stays in JSON/data/lore records.
2. Engine adapters consume `src/` modules and schema-validated content.
3. No engine folder may invent Deity, faction, mission, or asset facts.
4. Engine import work must preserve permanent IDs from manifests and source records.
5. Generated engine output must be reproducible from source records.
