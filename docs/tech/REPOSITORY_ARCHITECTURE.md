# Repository Architecture — Titan Gates: Ascension

Titan Gates is organized as a source-of-truth preproduction repository: canon records, gameplay prototypes, asset manifests, handoff packets, and validation gates live together while final engine implementation is still ahead.

## Current layers

| Layer | Purpose |
| --- | --- |
| Canon/content records | Factions, Titans, missions, maps, dialogue, NPCs, creatures, backstories, and lore documents. |
| Aggregated data | Generated JSON indexes used by dashboards, validation, and prototype surfaces. |
| Prototype runtime | Browser-playable tactical and campaign flows used for vertical-slice proof. |
| Production source modules | Importable gameplay, data-loader, UI presenter, and production-gate modules under `src/`. |
| Mini App surface | Holder-facing command center and canon dashboard. |
| Asset production | Blueprint folders, manifests, registry, dependency graph, handoff packets, and source/preview/game-ready lanes. |
| Validation | Build, content, canon, schema contracts, asset, economy, runtime, UI, and secret-scan gates. |

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

## Production module seam

The first source-module extraction pass now exists:

```text
src/gameplay/solo-battle/   stable reducer exports and vertical-slice state factory
src/gameplay/economy/       economy runtime exports
src/data-loaders/           recursive JSON loading, source dataset lookup, schema contract validation
src/ui/                     presentation-safe state summaries for browser/Mini App layers
src/tools/                  production gate manifest
tests/                      production module contract smoke tests
```

`npm run validate:schemas` checks Titans, all 280 missions, and 129 asset manifests against the active schemas. `npm run test:production-modules` proves the browser runtime can be consumed through the new `src/` seams. Both are now enforced by `npm run precommit:verify`.

## Rules

1. Source JSON and lore docs are canonical. Generated indexes are reproducible outputs.
2. Large HTML files are presentation shells, not the final engine architecture.
3. Runtime logic should migrate from large browser surfaces into importable modules under `src/`.
4. Tests should migrate from one-off scripts into grouped suites under `tests/` while package scripts preserve the existing gates.
5. Every major content shape should gain a JSON Schema or typed contract before external team expansion.
6. Source assets must enter through approved asset lanes, keep permanent IDs, and validate through manifests.
