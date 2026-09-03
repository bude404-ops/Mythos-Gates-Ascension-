extends Node
## Mythos Gates: Ascension — Mukage, the Unfinished (MG-DEITY-016)
## Assassin kit, MG-FACTION-004 (Thousand Torii). DataLayer-driven (proven template).
## Solo-first: i-frames are SELF-only; armor melt is enemy-facing.

const DEITY_ID := "MG-DEITY-016"
const IFRAME_BUFF := "MG-BUFF-I-FRAME"
const MELT_DEBUFF := "MG-DEBUFF-ARMOR-MELT"

# ---- Local tuning ----
const SPIRIT_STEP_RANGE := 12.0     # blink distance — walls do not argue
const SPIRIT_IFRAMES := 0.5          # brief untargetability mid-crossing
const UNMAKING_BONUS := 0.50         # +50% vs illusions and false reflections
const THRESHOLD_SNARE_TIME := 1.0    # pulled halfway out — brief root
const THRESHOLD_MELT := 0.60         # -60% defense while halfway out
const THRESHOLD_DURATION := 4.0
const THRESHOLD_LANDS_TRUE := true   # your strikes cannot miss them

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[MukageKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[MukageKit] expected 3 abilities from DataLayer")
	print("[MukageKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Spirit-Step — blink across the boundary, through terrain, untouchable.
func spirit_step(from_pos: Vector3, to_pos: Vector3) -> Dictionary:
	var dist := from_pos.distance_to(to_pos)
	return {"blink": dist <= SPIRIT_STEP_RANGE, "distance": dist,
		"iframes": SPIRIT_IFRAMES, "iframe_hook": IFRAME_BUFF}

# ---------------------------------------------------------------- active_2
## Unmaking Cut — the blade finishes what illusions left undone.
func unmaking_cut(target) -> Dictionary:
	if target == null: return {"cut": false}
	var vs_illusion: bool = target.get_meta("is_false_reflection", false) \
		or target.get_meta("is_illusion", false)
	return {"cut": true, "bonus": UNMAKING_BONUS if vs_illusion else 0.0,
		"target_is_reflection": vs_illusion}

# ---------------------------------------------------------------- ultimate
## The Threshold Closes — marked enemies are pulled halfway out of their
## bodies: defenseless, and your strikes land true.
func the_threshold_closes(enemies: Array) -> Dictionary:
	var caught: Array[Dictionary] = []
	for e in enemies:
		if e.get_meta("moonmarked", false) or e.get_meta("thresholdmarked", false):
			e.set_meta("snared", true)
			e.set_meta("snare_timer", THRESHOLD_SNARE_TIME)
			e.set_meta("melt", THRESHOLD_MELT)
			e.set_meta("melt_timer", THRESHOLD_DURATION)
			e.set_meta("melt_hook", MELT_DEBUFF)
			caught.append({"enemy": e, "defenseless": true})
	return {"caught": caught, "strikes_land_true": THRESHOLD_LANDS_TRUE,
		"duration": THRESHOLD_DURATION}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "spirit_step",
	"active_2": "unmaking_cut",
	"ultimate": "the_threshold_closes",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "target_pos"],
	"active_2": ["target"],
	"ultimate": ["enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
