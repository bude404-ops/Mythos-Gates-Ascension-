# Mythos Gates Dungeon Route Registry

## Purpose

This registry defines the first production-ready dungeon-route layer for **Mythos Gates: Ascension**.

It preserves the current Lore Codex and turns the established seven Realm/Gate structure into playable dungeon-crawler routes without inventing replacement factions, replacement Realms, or a contradictory Gate origin.

## Canon Rule

Each dungeon route must:

- belong to one existing Realm;
- use one established Mythos Gate or established Gate state;
- support one god/goddess entering at a time;
- preserve one-avatar-vs-many-enemies combat;
- use hazards, landmarks, and visual language already present in the Realm Codex;
- reveal Gate mystery without fully resolving the origin of the Mythos Gates;
- support future **Mythos Gates: [Subtitle]** expansions.

## Implemented Routes

1. **Sun-Scale Verdict Descent** — Aten Ra / The Solar Dominion of Khepra
2. **Thunder-Oath Root Gauntlet** — Asgardian / The Storm-Rooted Aesir Holds
3. **Laurel-Sky Hubris Trial** — Olympian / The Celestial Heights of Olympus
4. **Torii-Moon Mirror Road** — Kami / The Sacred Kingdoms
5. **Silver-Root Geas Labyrinth** — Tuatha / Avalora
6. **Choir-Vault Discord Ascent** — Empyrean / The Radiant Hierarchies
7. **Black-Iron Debt Descent** — Infernal Dominion / The Infernal Dominion

## Route Structure

Every route includes:

- entry Gate;
- Gate state classification;
- seven room nodes minimum;
- branching pressure layer;
- hazards pulled from Realm Codex;
- shrine nodes;
- treasure room logic;
- standard enemy ecology;
- elite encounter;
- boss encounter;
- lore reveal chain;
- art-direction constraints;
- expansion hooks.

## Validation

The route registry is validated by:

```bash
npm run validate:mythos-gates-dungeon-routes
```

The validator enforces:

- exactly seven routes;
- all seven Realms covered;
- all seven factions covered;
- one active playable deity per route;
- no armies or squads;
- established Gate-state classification;
- at least one boss node per route;
- at least one branching node per route;
- treasure, hazards, lore reveals, elite encounters, and boss encounters present;
- art direction rejects sci-fi portal treatment.

## Next Layer

The next production layer should convert each route into mission-ready dungeon content:

- encounter tables;
- enemy placements;
- room objective rules;
- trap timing;
- treasure reward tables;
- boss phase mechanics;
- lore pickup text;
- map art prompts;
- playable first-route prototype.
