# Mythos Gates: Ascension

Mythos Gates: Ascension is a mythological tactical RPG built around seven source-culture Realms, the actual gods and goddesses of those mythologies, the mysterious Mythos Gates, and the Ascension Collapse.

This repository is the source of truth for:

1. The playable browser prototype
2. The Mini App source for `Mythos Gates: Ascension`
3. Canon, campaign, combat, economy, asset, and 3D production data
4. GitHub Pages build/deploy automation

## Open the Project

- Development command center: `index.html`
- Playable game: `game/index.html`
- Tactical map prototype: `game/tactical-map-prototype.html`
- Mini App source: `mini-app/mythos-gates-ascension.html`
- Lore Codex: `docs/lore/README.md`
- AAA repository audit: `docs/AAA_REPOSITORY_AUDIT.md`

## Repository Structure

```text
3D_Blueprints/        3D asset blueprints, registry, validation notes, production queue handoff
art/                  Artwork prompt records and mission art package data
artwork_import/       Artwork dropbox/intake queue and generation runthroughs
asset_registry/       GitHub asset registry and dependency graph
assets/               Reserved source/preview/game-ready asset lanes tracked with placeholders
backstories/          Deity, NPC, and creature backstory records
campaigns/            Campaign and chapter source records
data/                 Aggregated source-of-truth JSON used by dashboards and runtime checks
dialogue/             Mission dialogue source records
docs/                 Production documentation, lore bible, audits, build notes, handoff policy
engine/               Unity/Unreal adapter scaffolding and engine-neutral export contracts
schemas/              JSON Schema contract layer for canonical data shapes
src/                  Engine-ready module extraction lane for gameplay, platform core, data loaders, UI presenters, tools
tests/                Production module contracts and future grouped test suites
game/                 Playable browser prototype and tactical runtimes
handoff/              Creator, Big Bot, and external AI asset handoff packets
manifests/            Per-asset manifest records
maps/                 Tactical and campaign map records
mini-app/             Print World Mini App source
missions/             Normal and elite mission source records
npcs/                 Non-playable campaign character records
creatures/            Enemy creature and Gateborn threat records
scripts/              Build, validation, audit, asset, and smoke-test automation
validation/           Validation report records
visual/               Visual QA notes and baseline review scaffolding
.github/workflows/    GitHub Actions build/deploy and artwork intake automation
```

Generated `dist/` output is built by automation and is not a canonical source folder.

## Current Build

- Version: `0.6.9`
- Phase: GitHub Pages development platform + playable browser vertical slice + Mini App source
- Playable Realms/Factions: 7
- Playable deities: 28 total — 4 per Realm, 2 male gods and 2 female goddesses per Realm
- Non-playable campaign characters: 8
- Creatures/threats: 39
- Hollow threat creatures: 16
- Maps: 12
- Campaigns: 8
- Campaign chapters: 35
- Missions: 280 total — 140 Normal / 140 Elite
- Mission dialogue packages: 280
- Mission art packages: 280
- Schema contracts: active coverage for canon migration/version control, platform core, hosted backend boundary, runtime persistence, one-deity-vs-many combat, and UE5 templates
- Art prompts: 96
- 3D blueprint assets: 136
- Creator handoff packets: 23
- External AI production packet: 1 active benchmark battlefield packet
- Core combat rule: one active god or goddess in standard combat
- Platform core: v1 implemented for profile, save continuity, roster ownership, progression, inventory, and currency ledger
- Hosted backend boundary: v1 contract for profile service, cloud saves, authoritative economy ledger, and telemetry ingestion
- Runtime persistence boundary: database tables, route auth, admin operations, environments, and observability contract
- Unreal Engine 5 dungeon-crawler framework: Mythos Gates region/zone/exploration/tactical-arena template for the first mission
- Mobile-first UE5 architecture: Android/iOS baseline, scalable quality tiers, Gate-safe optimization, and first-zone approval gate
- One Deity vs. Many combat: one player-controlled god or goddess per battle, no armies, no squads, no team turns, visible progression, enemy role pressure
- Mission/campaign lore run-ins: all 280 missions and 8 campaigns use the mobile UE5 one-deity loop and can draw lore-valid cross-faction creature pools
- Current source asset status: 136 reserved asset IDs awaiting final source assets

## Commands

```bash
npm install
npm run precommit:verify
```

Focused gates, when reviewing a smaller change:

```bash
npm run audit:continuity
npm run audit:aaa-structure
node scripts/audit-current-canon.mjs
npm run validate:engine-adapters
npm run validate:platform-core
npm run validate:backend-boundary
npm run validate:runtime-persistence
npm run validate:ue5-dungeon-framework
npm run validate:ue5-mobile-first
npm run validate:one-deity-vs-many-combat
npm run validate:mission-campaign-lore-run-ins
npm run assets:verify
npm run test:playable-battle-ui
npm run validate:external-ai-packets
```

## GitHub Pages

The Pages workflow builds the static platform from source data and deploys the generated site without requiring committed `dist/` output.

It validates:

- Canon continuity and forbidden legacy terms
- JSON syntax and duplicate IDs
- Missing deity/faction/prompt references
- Missing lore files
- Unsafe artwork paths
- Invalid image extensions
- Asset registry integrity
- Playable game smoke coverage
- Dashboard integrity
- Secret leakage prevention

## Canon Direction

Current canon is locked around:

- Seven playable mythological Realms
- Four playable deities per Realm
- Two male gods and two female goddesses per Realm
- One active god or goddess controlled at a time
- One deity versus multiple enemies, bosses, monsters, and rival divine forces
- The Mythos Gates as the ancient Gate phenomenon, not a playable-character classification
- The Hollow as a non-playable campaign threat layer
- No playable armies
- No playable squads
- No five-character teams
- No playable characters classified as Titans
- No sci-fi
- No futuristic craft
- No old void rot / fungal civilization direction

GitHub is the source of truth. GitHub Pages is the visual command center. The Codex is the canonical knowledge base. The asset registry and manifests are the production handoff layer.

## AAA Production Readiness

This repo is strong as a canon, prototype, and asset-production command center. It is not yet structured like a final AAA engine repository. Before full production, the next structural leap should split the current prototype into engine-ready modules, add schema/type enforcement, expand CI to run the complete gate, and connect the asset manifest system to real DCC/game-engine import paths.

See `docs/AAA_REPOSITORY_AUDIT.md` for the current readiness verdict and priority cleanup path.
