# Mythos Gates — Project Status
_Last updated: Sept 5, 2026, 2:00 AM ET (BIGagent404)_

## Current Phase: VAULT COMPLETE — Stage 2 worlds rolled, lore+combat synced, verdicts open

### COMPLETE (all committed + pushed)
- **ROSTER: 24/24 Stage 1 character canons** — 6 factions (Ashfall, Skyrend, Everbloom, Duskmourn, Marenth, Stoneheart) × (2 primordial giant deities + 2 elven sprite champions). Names locked: Vharkar/Vesskra, Haeldir/Sylwen, Thevril/Miriath, Morvain/Senvra, Nerovax/Ilsarra, Grothmar/Bergrun; champions by title (Kiln-Warden/Hearth-Keeper, Storm-Warden/Matriarch, Bloom-Warden/Bloom-Keeper, Gloam-Warden/Veil-Keeper, Tide-Warden/Pearl-Keeper, Quarry-Warden/Crystal-Keeper).
- **STAGE 2: all 24 world compositions rolled + delivered** (Cinderlands → Heartroot Chamber). 2/24 canonized (Vharkar/Cinderlands, Vesskra/Ember Gorge); 22 verdicts open.
- **HOLLOW ENEMY SET: 7 units, 4 canonized** — T1 Undone (CANON), T2 Unmade Champion (CANON), T2 Erased Drake + Still Choir (pending), T3 Gate-Worm (CANON), T3 Echo of the Forgotten (CANON), T3 Hollow Furnace Brute / first Dead-God Shape (pending). Five more Dead-God Shapes queued behind the Furnace Brute verdict.
- **LORE SYNC (continuity pass 1 + 2 complete):** Giant-Era Canonical Roster in Codex; gate names unified (Cinder/Squall/Bloom/Dusk/Deep/Stone); First Forge myth re-cast to giant-era; 12/12 giant sagas; Skywilds→Skyrend drift fixed; old eras archived non-canon (docs/lore/archive-old-era/); LORE_CONTINUITY_AUDIT.md = the 11-layer gate map + fix log.
- **COMBAT LAYER:** MYTHOS_DEITY_COMBAT_KITS.md (giant warrior/caster frames, faction element bursts + gate rites, 12 giant stat blocks, 12 sprite champion kits, FAITH economy); COMBAT_SPEC §7-§8 (dragon rebase retired; 100-ft lore vs 9m combat reconciled via the Gate's mouth).

### Awaiting BudE404
- 22 Stage 2 world-composition keeps (canonize per faction on keeps).
- 3 Hollow keeps (Erased Drake, Still Choir, Hollow Furnace Brute) → then the five remaining Dead-God Shapes (dead-storm, dead-bloom, dead-lantern, dead-tide, dead-crystal).
- Sprite companion skins layer (Mythos Sprites doc) — cosmetic pipeline, whenever.

### Locked Rules (current)
1. Art grammar: LOTR-cinematic hand-painted stylized (all 24 + Hollow + worlds unified).
2. Primordial-Max giant anatomy; element-formed faces; Uniform Surface Law (giantesses); empty-realm law; sprite elven LOTR armor + signature headgear; sprite-world sharp law (foreground anchor, world in depth).
3. Generation prompts: NEVER a deity name/title in-prompt; zero text/emblems anywhere; wing-word banned in human-form prompts (lore-only).
4. Hollow doctrine: elites anchor on vault canons (champion armor / giant mirror) — the Hollow steals our identity.
5. Stage pipeline: 1 Character Lock → 2 World Composition (locked char as anchor) → 3 3D turnaround (A-pose, weapon separate) → Meshy/Mixamo → Godot + Unity.
6. Unity: staged only — no builds, no credit spend, no migrations without explicit go.
7. Approved asset → purge all older versions; one consolidated done-report per task; push to GitHub main on every milestone.
8. Old-era docs are archived non-canon; the canon set is: CODEX (roster+doctrine), WORLD_BIBLE, CAMPAIGN_BIBLE, STORIES, DEEP_LORE, ENV_SHEETS, NPC_ROSTER, SPRITES, DEITY_COMBAT_KITS, HOLLOW_TIDE_BESTIARY, LORE_CONTINUITY_AUDIT, COMBAT_SPEC, GAMEFEEL_TOP3_SPEC.

### Ops
- Repo: Mythos-Gates-Ascension (branch main). Pull --rebase before pushes.
- Engines: Godot 4.7.2 + Unity (staged). Godot scripts live (trauma cam, footstep weight, ground-slam, ring shader); Unity C# staged only.
- Unity Cloud service keys validated (secrets in encrypted store, never in repo; blocked on Unity Project ID — BudE404's Unity projects, not this game).
