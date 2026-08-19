# Mythos Gates: Ascension — Official Brand & Lore Restructure Audit

## Official Identity

- Permanent core IP/world identity: **Mythos Gates**
- Current game/chapter: **Mythos Gates: Ascension**
- Subtitle rule: **Ascension** is the current major story arc and era, not a permanent suffix for the whole IP.
- Future structure: **Mythos Gates: [Subtitle]**. No future subtitles were invented.

## Lore Authority

The existing Lore Codex remains the highest authority. This pass does not replace factions, Realms, gods, relationships, or established Gate function. The old Deity Gates identity has been reinterpreted into the **Mythos Gates** brand framework without inventing a contradictory origin.

## Preserved Canon

- Seven current factions remain unchanged.
- Seven extradimensional mythological Realms remain unchanged.
- Twenty-eight playable gods/goddesses remain the roster target.
- The playable characters remain actual gods and goddesses, not Deities and not mortal heroes.
- Gate states remain canon: Stable Gates, Ruin Gates, Distortion Gates, Sealed Gates, Wound Gates.
- The Ascension Collapse remains the current campaign-era rupture in dimensional order.
- The Gates remain ancient, mysterious, non-technological reality-structures tied to Realm travel, conflict, dungeons, artifacts, enemies, and boss arenas.

## NEW CANON EXTENSION

The former Deity Gates are now officially the **Mythos Gates**: ancient threshold-points where boundaries between mythological Realms become traversable. Their complete origin remains unresolved, even to many gods, preserving long-term expansion mystery.

This is an extension and reinterpretation of existing Gate canon, not a replacement origin.

## 1. Lore Review

Already fits:

- Existing Gate lore already supported ancient inter-Realm roads, sealed routes, unstable anomalies, relic displacement, and campaign conflict.
- Existing Realm Codex already treats Realms as supernatural mythological civilizations, not planets or sci-fi worlds.
- Existing factions already map to distinct mythology/civilization/Realm identities.

Changed:

- Official game title changed to **Mythos Gates: Ascension**.
- Gate terminology changed from Deity Gates to Mythos Gates across source content.
- Ascension is now framed as the current story arc, not the permanent IP identity.
- Gate mysteries are deliberately preserved for future eras.

## 2. Factions Review

No faction was renamed, merged, replaced, or invented. The current seven-faction structure remains the source of truth.

Required future work:

- Continue ensuring each faction has exactly four major gods/goddesses: two male gods and two female goddesses.
- Keep deity choices grounded in the existing Lore Codex and each faction’s mythology.

## 3. Realms Review

Already fits:

- Realms are extradimensional mythological civilizations.
- They are not planets and not sci-fi worlds.
- Architecture, materials, creatures, symbols, and divine law already differ by Realm.

Required future work:

- Build Realm-specific dungeon templates that make each dungeon feel naturally rooted in its mythology.

## 4. Gods Review

Already fits:

- Playable roster is deity-based and validates at 28 entries.
- Art identity audit validates 14 male and 14 female deity records.
- Prompts are categorized as Deity.

Required future work:

- Add explicit per-deity uniqueness checks for face, anatomy, silhouette, armor, mask, weapon, jewelry, posture, cultural beauty, and divine effects.

## 5. Gate System Review

Already fits:

- Gates connect otherwise separated Realms.
- Gates are ancient, mysterious, dangerous, and politically/cosmically contested.
- Gates naturally support travel, dungeons, bosses, relics, enemies, and long-term expansion.

Changed:

- Gate brand is now **Mythos Gates**.
- The universe name is now **Mythos Gates**.
- The Gates are positioned as the expansion mechanism for future Realms, factions, gods, conflicts, dungeons, and mysteries.

No contradictory Gate origin was added.

## 6. Character Database Review

Already fits:

- 28 deity records validate.
- Deity identity is connected to mythology, domain, faction, Realm, personality, combat, and art.

Required future work:

- Finish any compatibility migration if internal legacy `titan` keys are ever renamed. Those keys remain validated compatibility architecture for now.

## 7. Combat Review

Already fits:

- One deity vs. multiple enemies is implemented as the central combat fantasy.
- Combat validation remains green.

Required future work:

- Expand enemy formations, trap pressure, elite combinations, boss mechanics, and dungeon modifiers around each god’s divine domain.

## 8. Dungeon System Review

Already fits:

- UE5 dungeon framework validates.
- Dungeon-crawler structure is compatible with existing Gate roads, ruin gates, distortion gates, sealed gates, and wound gates.

Required future work:

- Create the production dungeon-route registry using the Mythos Gates as canonical entry points.

## 9. Progression Review

Already fits:

- Progression represents divine restoration, awakening, expansion, mastery, artifacts, relics, passives, and Realm connection.

Required future work:

- Keep Ascension specific to this story arc while leaving future Mythos Gates chapters open to other progression themes.

## 10. Loot Review

Already fits partially:

- Reward systems exist and validate.

Required future work:

- Expand loot into sacred weapons, divine relics, mythological artifacts, ceremonial armor, Realm materials, god-specific equipment, and divine jewelry.

## 11. Enemies and Bosses Review

Already fits:

- Creatures, enemies, Hollow threats, bosses, and rival forces already exist and validate.

Required future work:

- Tie enemy ecology to dungeon location, Realm law, faction conflict, and Mythos Gate instability.

## 12. Campaign Review

Changed:

- **Ascension** is now the current campaign arc and era of the Mythos Gates universe.

Preserved:

- Existing campaign architecture, Ascension Collapse, Realm conflicts, and Gate mysteries.

Required future work:

- Ensure each campaign reveal deepens Mythos Gates mystery without resolving every question in the first arc.

## 13. Art Prompt Review

Changed:

- Battleground, map, Gate, and character prompt language now uses Mythos Gates branding.
- Existing approved style remains unchanged.

Required future work:

- Add explicit brand rule to future prompt templates: Mythos Gates universe, Ascension era when relevant, no anime, no aliens, no sci-fi, no generic fantasy humans.

## 14. UI / Codex / Menu Review

Changed:

- Source project title and Mini App path now use Mythos Gates: Ascension.
- Player-facing title strings were moved to Mythos Gates identity.

Preserved:

- Legacy internal IDs such as `TG-` remain for compatibility. They are now historical technical identifiers, not visible brand canon.

## 15. Terminology Classification

Automated audit results:

- Old title/brand hits: **0**
- Banned playable-character Deity phrase hits: **0**

Remaining `titan` terminology, where present, is legacy technical architecture such as internal IDs, filenames, schema names, validation names, and compatibility data keys. Those should be migrated only with a dedicated internal migration plan, not by blind replacement.

## Highest-Priority Next Task

Create the **Mythos Gates dungeon-route registry**:

- one canonical dungeon route per Realm
- each route attached to an existing Gate state or Realm location
- room graph
- shrine nodes
- traps and hazards
- treasure logic
- enemy ecology
- elite encounter
- boss chamber
- lore reveal chain
- expansion hooks for later Mythos Gates subtitles
