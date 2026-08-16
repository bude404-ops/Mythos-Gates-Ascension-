# Tests

This folder is reserved for grouped production test suites as the prototype matures into engine-ready modules.

The first executable production-module contract lives at `tests/production-module-contract.test.mjs` and is wired into `npm run precommit:verify`. As runtime logic migrates further into `src/`, group tests into:

```text
tests/content/      schema and canon fixtures
tests/gameplay/     reducers, objectives, enemy AI, economy, progression
tests/assets/       asset manifests, dependency graph, source-file intake
tests/ui/           browser and Mini App smoke flows
tests/integration/  full campaign and battlefield playflow
```

The package command `npm run precommit:verify` remains the release-quality gate.
