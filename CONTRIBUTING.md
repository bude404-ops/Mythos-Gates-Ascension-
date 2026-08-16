# Contributing to Titan Gates: Ascension

Titan Gates is source-of-truth driven. Treat canon, data, and assets as production records, not scratch files.

## Before opening a pull request

Run:

```bash
npm install
npm run build
npm run assets:verify
npm run index:check
node scripts/audit-current-canon.mjs
node scripts/secret-scan.mjs
```

If your environment has Chromium and Playwright available, also run:

```bash
npm run precommit:verify
```

## Source rules

- Do not edit generated `dist/` files. Build output is produced by automation.
- Keep root clean. New prototypes belong under `game/`, Mini Apps under `mini-app/`, production docs under `docs/`, and content under the relevant source folders.
- Canon changes must update both source JSON and the relevant lore docs.
- Asset changes must preserve permanent asset IDs and update manifests/registries.
- No secrets, API keys, private tokens, or local machine paths may be committed.

## Canon rules

- Standard combat uses one active Titan.
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
