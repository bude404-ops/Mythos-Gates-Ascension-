# Data Migration and Canon Versioning Policy

Titan Gates canon is an engineered asset. It must move forward with explicit version intent, traceable migration records, and repeatable validation.

## Canon version format

Use `MAJOR.MINOR.PATCH-slug`.

- **Major**: breaking canonical shape, ID, schema, or engine export changes.
- **Minor**: backward-compatible content, schema, runtime, or adapter additions.
- **Patch**: fixes that preserve existing shape and semantics.

The current source of truth is `data/canon-version-manifest.json`.

## When a migration record is required

Add a migration when any change affects:

1. Required schema fields.
2. Canonical ID formats or cross-reference behavior.
3. Mission objective, economy, reward, telemetry, or progression meaning.
4. Runtime projections consumed by browser gameplay or production modules.
5. Engine export payloads consumed by Unity or Unreal.
6. Generated index semantics.

No migration is required for pure documentation copy, visual-only browser polish, or rebuilds of generated output from unchanged source.

## Required migration fields

Every migration must include:

- `id`
- `fromVersion`
- `toVersion`
- `type`
- `status`
- `owner`
- `summary`
- `affectedData`
- `validation`

Applied migrations are append-only. If a migration is wrong after release, supersede it with a new migration instead of rewriting history.

## Release gate

`npm run validate:migrations` must pass before release. The validator enforces:

- manifest identity and active status
- current version equals the latest applied migration target
- migration IDs are unique and sequential
- version chain continuity
- allowed migration type and status enums
- affected data files exist
- validation commands are declared
- migration validation is part of the precommit gate

## Ownership

- Data Director owns schema/content migrations.
- Gameplay Director owns runtime projection migrations.
- Technical Director owns engine export migrations.
- Release Director owns validation-gate and release-process migrations.
