# Source Module Migration

The current playable build proves the tactical loop and command surfaces. AAA production should move reusable logic here while keeping browser prototype delivery stable.

## Target modules

```text
src/gameplay/       combat reducers, objectives, enemy behavior, economy, progression
src/ui/             reusable UI presenters and state adapters
src/data-loaders/   content loading, schema validation, migrations
src/tools/          build-time generators and shared utilities
```

## Rule

Do not move working prototype logic blindly. Extract one stable module at a time, keep package scripts green, and leave browser/Mini App shells as presentation layers.
