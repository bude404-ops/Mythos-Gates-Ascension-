# Mythos Gates: Ascension — Master Reconfiguration Audit

## Scope

Audit and canon-safe reconfiguration for the approved direction: mythological, extradimensional, single-character, dungeon-crawler, turn-based tactical RPG. The existing Mythos Gates universe, Lore Codex, seven factions, Realms, campaign architecture, combat systems, and art style remain the source of truth.

## Gate Canon Read

Established Gate canon preserved:

- Mythos Gates are ancient dimensional gateways connecting powerful Realms.
- They are not technology; they are ancient reality-structures: threshold, wound, sacred mechanism, and living law.
- They connect Realms, sealed ruins, forgotten roads, relics, powers, memories, and wars.
- The Ascension Collapse shattered the old dimensional order.
- Existing Gate states remain canon: Stable Gates, Ruin Gates, Distortion Gates, Sealed Gates, and Wound Gates.
- Gates remain campaign sites, dungeon entrances, major conflict engines, and boss arenas.
- No single new Gate creator or replacement origin was invented.

NEW CANON EXTENSION:

- Some Mythos Gate routes now function as dungeon-crawler paths through established Gate roads, ruin gates, distortion gates, sealed gates, wound gates, sacred Realm locations, corrupted regions, monster territories, and boss arenas.
- This extends existing Gate use; it does not replace Gate canon.

## 1. Existing Systems That Already Fit

- Seven mythological factions remain intact.
- Realm Codex already defines extradimensional mythological civilizations rather than planets or sci-fi cultures.
- One-deity combat systems already support one active player-controlled divine character versus multiple enemies.
- Enemy, creature, Hollow, boss, and campaign threat systems already support one-god-vs-many encounter pressure.
- Mythos Gates already serve as major mission sites, boss arenas, and inter-Realm conflict engines.
- Approved visual style already fits premium mobile tactical RPG, stylized realism, painterly material detail, dramatic lighting, and strong silhouettes.
- UE5 dungeon-crawler framework already existed and validates.

## 2. Systems Requiring Changes

- Legacy internal names still use `titan` in IDs, routes, test names, schemas, and engine adapter keys. These are compatibility names and should be renamed only in a dedicated migration.
- Visual baseline records still contain old historical screen names such as Titan Selection and Titan Profile.
- Some art-production pipeline prose still uses Titan as a production shorthand; player-facing and prompt-facing language should be cleaned first.
- Some exporter/Unity docs still expose `TitanCombatData` or `mapTitanForEngine`; these should become compatibility wrappers around Deity data.

## 3. Lore Requiring Changes

Changed:

- Canon Lock now states playable characters are actual gods and goddesses, not Titans.
- Mythos Gates page now preserves established Gate canon and integrates dungeon-crawler routes as a NEW CANON EXTENSION.
- Old playable roster lore page was reframed as Playable Deities while preserving the filename for compatibility.

Still recommended:

- Add a dedicated dungeon-route codex entry for each Realm using existing Realm landmarks and Gate states.
- Update older historical references that call playable divine beings Titans only when they are not internal compatibility names.

## 4. Gameplay Requiring Changes

Changed/aligned:

- Core identity now points to single-Avatar tactical dungeon crawling.
- Player controls one god or goddess at a time.
- Dungeon routes are entered through Mythos Gate systems.
- One-deity-vs-many combat remains the center.

Still recommended:

- Add formal dungeon run data: rooms, branching paths, shrine nodes, traps, treasure nodes, elite rooms, boss rooms, modifiers, and realm-specific event tables.
- Expand reward tables so dungeon loot is explicitly sacred, mythological, deity-specific, and Realm-material based.

## 5. Character Database Changes

Already established:

- 28 playable divine characters.
- 7 factions.
- 4 deities per faction.
- 2 male gods and 2 female goddesses per faction.
- Character art audit passes with 14 male and 14 female entries.

Changed/reinforced:

- Playable identity is god/goddess/deity.
- Art and lore descriptions use deity framing.

Still recommended:

- Add a cross-faction silhouette matrix for every deity: face, body, weapon, mask, posture, armor, movement, and cultural beauty standard.

## 6. Dungeon Changes

Changed:

- UE5 dungeon-crawler framework purpose now states single-Avatar dungeon-crawler tactical RPG.
- Dungeon routes are canonically tied to established Mythos Gate roads and Gate states.

Still recommended:

- Create per-Realm dungeon archetypes from current Realm Codex landmarks.
- For each dungeon, define place reason, Gate identity, room graph, hazard set, enemy ecology, shrine logic, treasure logic, elite/boss escalation, and lore reveal chain.

## 7. Progression Changes

Already fits:

- Progression centers individual divine mastery, Momentum, Divinity, stances, reactions, executions, relics, and ascension upgrades.

Still recommended:

- Rename remaining player-facing save concepts from Titan collection/levels/loadouts to Divine Collection, Divine Level, Divine Loadouts, and deity mastery while preserving legacy storage keys until migration.

## 8. Loot Changes

Already fits partially:

- Reward system supports campaign, boss, raid, event, and progression rewards.

Still recommended:

- Add mythological loot taxonomy: sacred weapons, divine relics, ceremonial armor, realm materials, god-specific artifacts, sacred jewelry, and ancient treasures.
- Tie loot to deity domains and Realm civilization rather than generic gear bands.

## 9. Art Prompt Changes

Already changed:

- 28 playable character prompts use Deity category.
- Prompt structure begins from actual deity identity.
- Art identity audit and contract test pass.

Still recommended:

- Add mandatory prompt fields for cultural beauty standards, sex-specific armor logic, mask identity, silhouette test, and cross-faction uniqueness notes.
- Complete the remaining visible production-copy cleanup where Titan appears as shorthand for playable character art.

## 10. UI / Terminology Changes

Changed:

- Player-facing UI uses Deities, Deity Profile, Deity Roster, Divine Collection, Divine Gear, Divine Stats, Divine Level, and Divine Ascension where applicable.
- Titan remains preserved for Mythos Gates/title/lore.

Still recommended:

- Historical visual QA baselines should either be archived as legacy records or reissued with Deity Selection and Deity Profile screen names.

## 11. Gate-Lore Conflicts

No replacement Gate lore was introduced in this pass.

One previous risk was corrected: an invented simple explanation for why the Gates are called Mythos Gates was replaced with a source-of-truth protection rule. The Lore Codex still keeps the Gates mysterious and does not define one universal named creator.

## 12. Recommended Fixes

1. Build the formal dungeon-route registry from existing Realm Codex landmarks.
2. Add per-Realm dungeon archetypes and room graphs.
3. Add mythological loot taxonomy and deity-specific artifact tables.
4. Add cross-faction deity silhouette/beauty/armor/mask uniqueness audit.
5. Migrate visible historical UI labels from Titan Selection/Profile to Deity Selection/Profile, or archive them as legacy QA records.
6. Plan a safe internal naming migration only after gameplay/content alignment is stable.

## 13. Highest-Priority Next Task

Create the production dungeon-route registry: one canon-safe dungeon template per Realm, each connected to an existing Mythos Gate, Realm landmark, enemy ecology, hazard set, room graph, treasure logic, elite encounter, boss chamber, and lore reveal chain.

## Final Classification

Automated classification recorded zero hits for the explicit banned playable-character phrases. Remaining Titan references are classified as:

- Mythos Gates/title/phenomenon
- Ancient Titan concept lore/technical scale
- Legacy internal IDs/schema/routes/API
- Legacy internal validator/test naming
- Visible review queue for historical art/visual/exporter records

The visible review queue is documented in the generated audit data and should be handled as the next cleanup pass, not by blind replacement.
