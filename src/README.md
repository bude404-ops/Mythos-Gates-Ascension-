# Source Module Migration

The current playable build proves the tactical loop and command surfaces. AAA production should move reusable logic here while keeping browser prototype delivery stable.

## Target modules

```text
src/gameplay/       combat reducers, objectives, enemy behavior, economy, progression
src/ui/             reusable UI presenters and state adapters
src/data-loaders/   content loading, schema validation, migrations
src/tools/          build-time generators and shared utilities
```

## Current extraction

The first production seam is active:

- `src/gameplay/solo-battle/` re-exports stable solo battle reducers and owns a vertical-slice state factory.
- `src/gameplay/economy/` exposes the free-to-play economy runtime through the source module lane.
- `src/data-loaders/` owns recursive JSON loading, canonical content lookup, and lightweight schema contract checks.
- `src/ui/` turns runtime state into presentation-safe summaries for browser and Mini App layers.
- `src/tools/` publishes the production gate manifest used by tests and audits.

## Rule

Do not move working prototype logic blindly. Extract one stable module at a time, keep package scripts green, and leave browser/Mini App shells as presentation layers.
