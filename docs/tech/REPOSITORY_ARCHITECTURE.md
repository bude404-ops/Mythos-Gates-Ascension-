# Repository Architecture — Titan Gates: Ascension

Titan Gates is organized as a source-of-truth preproduction repository: canon records, gameplay prototypes, asset manifests, handoff packets, and validation gates live together while final engine implementation is still ahead.

## Current layers

| Layer | Purpose |
| --- | --- |
| Canon/content records | Factions, Titans, missions, maps, dialogue, NPCs, creatures, backstories, and lore documents. |
| Aggregated data | Generated JSON indexes used by dashboards, validation, and prototype surfaces. |
| Prototype runtime | Browser-playable tactical and campaign flows used for vertical-slice proof. |
| Mini App surface | Holder-facing command center and canon dashboard. |
| Asset production | Blueprint folders, manifests, registry, dependency graph, handoff packets, and source/preview/game-ready lanes. |
| Validation | Build, content, canon, asset, economy, runtime, UI, and secret-scan gates. |

## AAA target shape

The current repo is ready for AAA preproduction and vertical-slice planning. For full production, migrate toward:

```text
src/
  gameplay/
  ui/
  data-loaders/
  tools/
tests/
  gameplay/
  content/
  assets/
  ui/
schemas/
engine/
  unreal/ or unity/
docs/
  production/
  tech/
  art/
  lore/
```

## Rules

1. Source JSON and lore docs are canonical. Generated indexes are reproducible outputs.
2. Large HTML files are presentation shells, not the final engine architecture.
3. Runtime logic should migrate from large browser surfaces into importable modules under `src/`.
4. Tests should migrate from one-off scripts into grouped suites under `tests/` while package scripts preserve the existing gates.
5. Every major content shape should gain a JSON Schema or typed contract before external team expansion.
6. Source assets must enter through approved asset lanes, keep permanent IDs, and validate through manifests.
