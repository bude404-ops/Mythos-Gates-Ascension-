# Contributing to Titan Gates: Ascension

Titan Gates is source-of-truth driven. Treat canon, data, and assets as production records, not scratch files.

## Before opening a pull request

Run:

```bash
npm install
npm run precommit:verify
node scripts/audit-current-canon.mjs
```

For focused local checks during development, run the smaller package command matching the files you changed.

## Source rules

- Do not edit generated `dist/` files. Build output is produced by automation.
- Keep root clean. New prototypes belong under `game/`, Mini Apps under `mini-app/`, production docs under `docs/`, and content under the relevant source folders.
- Canon changes must update both source JSON and the relevant lore docs.
- Asset changes must preserve permanent asset IDs and update manifests/registries.
- No secrets, API keys, private tokens, or local machine paths may be committed.

## Canon rules

- Standard combat uses one active deity.
- The Hollow is a non-playable campaign threat.
- The seven playable mythological Realms remain the playable foundation.
- Avoid old/contradictory directions: sci-fi, futuristic craft, void rot/fungal civilization canon, and legacy project names.

## Pull request checklist

- [ ] Build passes.
- [ ] Canon audit passes.
- [ ] Asset validation passes if assets or manifests changed.
- [ ] Index freshness check passes.
- [ ] No generated-only artifacts were committed.
- [ ] README/docs are updated if structure or counts changed.
