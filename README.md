# Titan Gates: Ascension

Titan Gates: Ascension is a Titan-only mythological tactical RPG built around extradimensional Realms, Titan Gates, the Ascension Collapse, and colossal Titans shaped by their civilizations.

This repository is now the source of truth for both:

1. The playable browser game
2. The GitHub Pages Development Platform

## Open the Project

- Development Platform: `index.html`
- Playable game: `game/index.html`
- Legacy exported dev platform: `titan-gates-dev-platform.html`
- Lore Codex: `docs/lore/README.md`

## Repository Structure

```text
art/                 Artwork pipeline folders and prompt files
art/prompts/         Versioned prompt records, one JSON file per entity prompt
data/                Source-of-truth JSON data for the Pages dashboard
characters/          Future character records; current canon has no playable Heroes
codex/               Reserved codex expansion area
dev/                 Development Platform entry copy
development/         Reserved development records
directors/           Reserved Director expansion area
docs/lore/           Canon lore codex
game/                Playable Titan Gates game
scripts/             Index generation, validation, Pages build scripts
.github/workflows/   GitHub Pages build/validate/deploy workflow
```

## Current Build

- Version: `0.2.0`
- Phase: GitHub Pages Development Platform
- Factions: 7
- Titans: 63
- Characters: 0 playable characters by canon lock
- Art prompts: 63 Titan prompts
- Game loop: first playable Gate encounter

## Commands

```bash
npm install
npm run index
npm run validate
npm run build
```

`npm run build` generates indexes, validates references, and creates the `dist/` folder used by GitHub Pages.

## GitHub Pages

The workflow at `.github/workflows/pages.yml` builds and deploys the static platform without exposing personal tokens.

It validates:

- JSON syntax
- Duplicate IDs
- Missing Titan/faction/prompt references
- Missing lore files
- Unsafe artwork paths
- Invalid image extensions
- Playable game integrity
- Dashboard integrity

## Canon Direction

Current canon is locked around:

- Seven playable mythological Realms
- Nine Titans per Realm
- Five-Titan strike forces
- No playable Heroes in the current format
- No normal units in the current format
- No sci-fi
- No aliens
- No spaceships
- No Mycocide / fungal civilization content

GitHub is the source of truth. GitHub Pages is the visual command center. The Codex is the canonical knowledge base. The Art Studio is the visual production pipeline. The Directors are the governance system.
