# AAA Repository Audit — Mythos Gates: Ascension

Status: production-foundation audit completed after GitHub canon cleanup.

## Verdict

Mythos Gates: Ascension is structurally strong as a game bible, vertical-slice prototype, Mini App source, and asset-production command center. It is not yet a final AAA game-engine repository. The repo can guide a AAA build, but the next phase must separate prototype presentation from production runtime code and enforce schemas/contracts around every content pipeline.

Readiness grade after the mission/campaign lore run-in pass: A- for AAA preproduction repository, B+ for Unreal-target implementation repository, B- for live game-platform readiness foundation.

## What is already strong

- Canon scope is coherent: 7 playable Realms, 28 Deities, one-active-deity combat, The Hollow as a non-playable campaign threat.
- Content coverage is unusually deep for preproduction: 280 missions, 280 dialogue packages, 280 mission art packages, 35 campaign chapters, 110 art prompts.
- Production handoff exists: 129 3D blueprint assets, 129 asset manifests, creator handoff packets, asset dependency graph, external AI battlefield packet.
- Automation exists: build, continuity audit, content validation, asset validation, index freshness, playable battle smoke test, external AI packet validation, secret scan.
- GitHub Pages flow builds from source and does not require committed generated output.
- CI now runs the full production gate before deploying Pages.
- Collaboration governance exists: contribution rules, PR template, issue templates, ownership map, release checklist.
- AAA migration lanes now exist for schemas, source-module extraction, and grouped tests.
- First production source modules now exist for gameplay, economy, data loading, schema contracts, UI state presentation, and gate manifesting.
- Schema validation now checks Titans, factions, maps, mission dialogue, economy, telemetry, external AI packets, canon version manifests, all missions, and real asset manifests before deploy.
- Engine integration scaffolding now exists for shared exports; Unreal Engine 5 is now the primary mobile-first target with a Titan-scale dungeon-crawler framework, zone template, DataAsset/DataTable mapping, and mobile-first constraints.
- Canon migration/versioning policy now exists with append-only migration records and release-gate validation.
- Platform Core v1 now exists for player profile creation, save import/export, roster ownership, progression persistence, inventory balances, and currency ledger events.
- Hosted backend boundary v1 now defines profile service, cloud save service, authoritative economy ledger service, and telemetry ingestion service with idempotency and version-conflict rules.
- Runtime persistence boundary v1 now defines database tables, additive migration policy, route authorization, admin audit operations, environments, and observability fields.
- The first existing mission is now mobile-locked as the master prototype, mapped, and bound to one-Deity-vs-many combat, and all missions/campaigns now carry mobile UE5 loop metadata plus cross-faction lore run-in rules into one UE5 region, one exploration zone, one tactical arena, and one optional boss-arena template without rewriting lore canon.
- Large source asset policy is present through Git LFS attributes.

## Structural risks blocking AAA-scale production

### 1. Unreal Engine 5 target needs real project implementation

The architecture now names Unreal Engine 5 as the primary target and maps the first mission into a reusable Titan-scale dungeon-crawler template. The next implementation risk is creating actual UE5 project files, DataAssets, Blueprints, Level Instances, import commandlets, and mobile render profiles.

Required next state:

- UE5 mobile-first project shell with plugin/module layout
- generated DataAssets/DataTables from canon
- Blueprint Actor Components for exploration, encounters, and tactical arena entry
- Level Instance template for `TG-F01-C01-M01`
- Android/iOS device profiles, mobile lighting, LOD, culling, texture budgets, FPS/memory harness, one-Deity-vs-many combat loop, visible power progression checks, cross-faction creature encounter pools, mission/campaign lore guardrails, and first-zone approval gate

### 2. Prototype code is too bundled

The playable browser build and Mini App source are large generated/static HTML artifacts. That is acceptable for preview delivery, but not for a AAA implementation handoff.

Required next state:

- `src/gameplay/` for combat reducers, enemy AI, objectives, economy, progression, telemetry.
- `src/ui/` for command hub, battle UI, campaign UI, preview UI.
- `src/data-loaders/` for validated content loading and migrations.
- `src/tools/` for build-time generators.
- Built HTML should become generated output only.

### 3. Platform core is local, not yet a live backend

Platform Core v1 proves the save/progression/ledger contract locally. The hosted backend boundary and runtime persistence boundary now define the service seam, database shape, route auth, admin audit lane, and observability contract. A real gaming platform still needs deployed infrastructure wired to these contracts.

Required next state:

- deployed backend profile service
- deployed authoritative save service
- actual managed database implementation of the runtime persistence schema
- live telemetry/event ingestion and monitoring
- admin/support tools
- environment configuration for dev/stage/prod

### 4. Data needs schemas, not just validators

The repo validates references and IDs, but AAA production needs explicit JSON Schema or TypeScript/Zod contracts for every major data shape.

Priority schemas:

- Titan
- Faction/Realm
- Mission
- Mission dialogue
- Mission art package
- Battlefield map
- 3D asset manifest
- External AI packet
- Economy/progression
- Telemetry event

### 5. Generated output must stay out of source control

`dist/` is generated by the build. It should remain ignored and should not be treated as canonical source. GitHub Pages can deploy the generated artifact from CI.

### 6. CI must stay aligned with the full local gate

The Pages workflow now runs the full `precommit:verify` gate before deployment. Keep future CI changes aligned with the same release-quality checks:

- content validation
- canon audit
- asset registry validation
- gameplay runtime tests
- browser UI smoke tests
- secret scan
- generated index freshness

### 7. Collaboration governance added; keep it enforced

The repo now includes contribution rules, pull request template, issue templates, an ownership map, and a release checklist. Before larger team expansion, connect these to branch protection and required review rules.

### 8. Asset folders are prepared, but not populated

The folder lanes for source, preview, and game-ready assets are correct. Most are placeholders. AAA production needs actual import standards and validation of real source assets once art begins landing.

Required next state:

- naming contract for each asset type
- scale/unit rules
- material/texture budget rules
- collision/LOD requirements
- animation clip naming
- engine import metadata
- source-to-game-ready conversion checks

### 9. Root directory should stay clean

The root should contain only project entry files, config, documentation, and package metadata. Prototype/demo exports belong under `game/`, `dev/`, `mini-app/`, or generated output.

## Recommended AAA structure target

```text
.github/
assets/
  source/
  preview/
  game_ready/
content/
  factions/
  titans/
  missions/
  dialogue/
  maps/
  economy/
  progression/
data/
  generated/
docs/
  lore/
  production/
  tech/
  art/
engine/
  unity/ or unreal/
game/
  prototype/
handoff/
manifests/
schemas/
scripts/
src/
  gameplay/
  ui/
  data-loaders/
  tools/
tests/
```

The current repo does not need to move everything immediately. The highest-value first move is to add `schemas/`, `src/`, and `tests/`, then gradually migrate runtime logic out of large HTML shells.

## Priority cleanup plan

### Immediate

1. Keep `dist/` generated only.
2. Keep root free of loose prototype exports.
3. Keep README synchronized with current counts and canon.
4. Keep CI running the full validation gate before deploy.
5. Enforce contribution, issue, review, and release governance.

### Next production pass

1. Create the UE5 project shell and generated DataAsset/DataTable importer for the first mission template.
2. Implement the runtime persistence boundary in a real deployed service once infrastructure is available.
3. Tighten nested schema depth for abilities, mission objectives, economy products, telemetry events, and external AI generation stages.
4. Deepen migration automation with generated migration templates and changelog-to-manifest drift detection.
5. Continue extracting prototype code into deeper modules under `src/gameplay`, `src/ui`, and `src/data-loaders`.
6. Move browser smoke tests into grouped suites under `tests/ui` and `tests/integration`.
7. Expand engine adapter stubs into real import tooling once an engine target is chosen.

### AAA handoff pass

1. Convert Unity/Unreal adapter manifests into working importers or commandlets.
2. Add source asset validation for real `.glb`, `.fbx`, textures, animations, and VFX.
3. Add performance budgets for mobile and desktop.
4. Add automated screenshots/video captures for key flows.
5. Add milestone folders: vertical slice, alpha, beta, content lock, release candidate.

## Current proof points from audit

- GitHub `main` matched local `main` at audit start.
- Tracked files after structural cleanup: 1,784.
- JSON files after structural cleanup: 1,583.
- Invalid JSON files found: 0.
- Major generated/canonical counts: 28 Deities, 280 missions, 129 3D blueprint assets, 23 creator handoff packets.
- AAA structure audit passed: required directories, governance files, expanded schema scaffolds, source/test migration lanes, engine adapter lane, and full-gate Pages workflow are present.
- Secret scan passed.
- Current-canon audit passed.
- Full precommit gate passed.

## Final read

The bones are good. The canon is strong. The production data is deep. The next danger is letting prototype delivery files become the architecture. Split the runtime, schema-lock the data, strengthen CI, and this becomes a serious AAA preproduction repository instead of a beautiful command center with too much weight in generated surfaces.
