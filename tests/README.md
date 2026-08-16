# Tests

This folder is reserved for grouped production test suites as the prototype matures into engine-ready modules.

Current executable gates live in `scripts/` and are wired through package commands. As runtime logic migrates into `src/`, move tests into:

```text
tests/content/      schema and canon fixtures
tests/gameplay/     reducers, objectives, enemy AI, economy, progression
tests/assets/       asset manifests, dependency graph, source-file intake
tests/ui/           browser and Mini App smoke flows
tests/integration/  full campaign and battlefield playflow
```

The package command `npm run precommit:verify` remains the release-quality gate.
