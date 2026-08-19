# Changelog

## [2026-08-19] — Mythological Earth Campaigns + Full Audit

- **Campaign restructure**: ALL 280 missions now take place in each faction's mythological homeland on ancient Earth
  - Aten Ra → Ancient Egypt (~2500 BCE): Nile Delta → Desert Necropolis → Temple Complex → Sacred Desert → Great Pyramid
  - Olympian → Ancient Greece (~500 BCE): Aegean Coast → Acropolis → Oracle's Mountain → Olympia → Mount Olympus Base
  - Kami → Ancient Japan (~700 CE): Coastal Shrine → Bamboo Temple → Mountain Pass → Imperial Shrine → Mount Fuji
  - Tuatha → Ancient Ireland (~1000 BCE): Misted Coastline → Sacred Grove → Hill Fort → Passage Tombs → Giant's Causeway
  - Empyrean → Ancient Mesopotamia (~3000 BCE): Ziggurat Steps → Hanging Gardens → Tablet Archive → Desert Temple → Tower of Babel
  - Infernal → Ancient Underworld/Kur (~3000 BCE): Cursed Ruins → Underworld Gates → Throne of Ash → Lake of Fire → The Abyss
  - Asgardian → Ancient Scandinavia (~500 CE): Frozen Fjord → Burial Mounds → Thingvellir → Great Forest → Yggdrasil Root
- **Enemy**: The Hollow (void creatures) — factions do NOT fight each other in campaign
- **Faction realms**: Event-only (raids, PvP, seasonal, world bosses)
- **Removed**: Realm Advantage System, cross-realm campaign structure, enemy territory penalties
- **Rewrote**: 280 mission briefings to reference Earth locations + Hollow enemy
- **Cleaned**: All stale cross-realm references from docs, GDD, and lore files
- **Pending**: 3D model production (TRELLIS.2) awaiting Hugging Face GPU token


## v0.7.0 — August 19, 2026 — The Avatar Update

### MAJOR: Avatar System Pivot

The playable character concept has been fundamentally redesigned. Players now control **Avatars** (divine projections of Deities) instead of Deities directly.

#### New Systems

- **Avatar System:** Players project an Avatar of their chosen Deity through the Mythos Gates. The Deity remains safe in its home Realm.
- **Belief and Influence:** Two new progression resources. Belief (earned from victories/followers) levels Avatar stats. Influence (earned from missions/battles) unlocks and upgrades abilities.
- **Realm Advantage System:** Home Realm = full power. Enemy Realm = weakened (-20% ATK, -15% DEF, +25% cooldowns) but +50% rewards. Earth = neutral, balanced.
- **Earth as Neutral Territory:** Earth is now the primary battleground for dungeons, PvP, and Hollow invasions. No faction has home advantage.
- **Avatar Death and Respawn:** Avatar death does not kill the Deity. Respawn at Deity domain with penalty (loss of 10-20% unspent Belief/Influence). All progression preserved.
- **God-Scale (Option A):** Avatars remain god-scale in all Realms. Power differences shown through aura intensity, ability charges, and cooldowns — not physical size.

#### Files Updated

- `docs/lore/01-GAME-LORE.md` — Added Avatar System, Earth as neutral territory, Belief/Influence, death mechanics
- `docs/lore/02-DEITY-GATES.md` — Added Gate as Avatar projection mechanism, realm modifiers
- `docs/lore/03-REALMS.md` — Added Realm Advantage System, Earth as neutral realm, per-faction avatar advantages
- `docs/lore/04-DEITIES.md` — Changed from Single-Deity Rule to Avatar System, added Belief/Influence progression, death/respawn, scale rules
- `docs/GAME_DESIGN_DOCUMENT.md` — Full v2.0 rewrite with Avatar system, progression, economy, death mechanics, realm modifiers, visual scale
- `README.md` — Updated to reflect Avatar system, new progression, Earth territory, version bump

### Previous Versions

## v0.6.9 — August 18, 2026
- Full Mythos Gates rebrand from Mythos Gates
- 1,358 files renamed from MG- prefix to MG- prefix
- All 28 deity art assets locked and committed
- 39 faction creature assets locked
- 21 campaign map art assets locked
- 8 NPC witness renders locked
- 4 World Boss renders locked
- 280 mission dialogue files rewritten with unique lore-consistent lines
- Full repository audit: 'The The' typos fixed, Deity nomenclature standardized

## v0.6.8 — August 17, 2026
- Initial Mythos Gates: Ascension production suite
- Campaign architecture, faction stat sheets, dialogue system, dungeon route registry
- 2D art production pipeline established
- TRELLIS.2 3D conversion pipeline prepared (pending HF GPU token)
