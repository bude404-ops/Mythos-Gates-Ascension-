extends Node
## Mythos Gates: Ascension — Yoruka, the Hollow Moon (MG-DEITY-014)
## Archer kit, MG-FACTION-004 (Thousand Torii). DataLayer-driven (proven template).
## Solo-first: eclipse vision is SELF-only; mark is enemy-facing.

const DEITY_ID := "MG-DEITY-014"
const MARK_HOOK := "MG-BUFF-MARK"
const GLOW_HOOK := "MG-BUFF-GLOW-RADIUS"

# ---- Local tuning ----
const VOLLEY_SHOTS := 3              # Crescent Volley — three crescents, no more
const VOLLEY_SPREAD := 0.18           # radians between shots in the fan
const VOLLEY_PIERCE := true           # moonlight does not stop at the first body
const MARK_DURATION := 8.0
const MARK_RANGE_BONUS := 0.25        # +25% damage vs marked beyond 15m
const MARK_RANGE_MIN := 15.0
const ECLIPSE_MARK_DMG := 0.40        # +40% on guaranteed-marked targets
const ECLIPSE_DURATION := 6.0         # the dark lasts six seconds

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[YorukaKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[YorukaKit] expected 3 abilities from DataLayer")
	print("[YorukaKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Crescent Volley — three piercing moonlight crescents fan outward.
func crescent_volley() -> Dictionary:
	var shots: Array[Dictionary] = []
	for i in VOLLEY_SHOTS:
		shots.append({"angle_offset": (i - 1) * VOLLEY_SPREAD, "pierce": VOLLEY_PIERCE})
	return {"shots": shots, "pierce": VOLLEY_PIERCE}

# ---------------------------------------------------------------- active_2
## Moonmark — the target glows through walls; distance sharpens the arrow.
func moonmark(target, self_pos: Vector3) -> Dictionary:
	if target == null: return {"marked": false}
	target.set_meta("moonmarked", true)
	target.set_meta("moonmark_timer", MARK_DURATION)
	target.set_meta("moonmark_hook", MARK_HOOK)
	target.set_meta("glow_hook", GLOW_HOOK)   # visible through walls
	var dist := self_pos.distance_to(target.position)
	var in_range := dist >= MARK_RANGE_MIN
	return {"marked": true, "duration": MARK_DURATION,
		"range_bonus": MARK_RANGE_BONUS if in_range else 0.0,
		"distance": dist}

# ---------------------------------------------------------------- ultimate
## Total Eclipse — the field darkens; only moonmarks glow. Arrows fired
## during the eclipse always find marked targets.
func total_eclipse(enemies: Array) -> Dictionary:
	var marked: Array = []
	for e in enemies:
		if e.get_meta("moonmarked", false):
			marked.append(e)
	return {"darkness": true, "duration": ECLIPSE_DURATION,
		"marked": marked, "marked_bonus": ECLIPSE_MARK_DMG,
		"arrows_always_hit_marked": true}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "crescent_volley",
	"active_2": "moonmark",
	"ultimate": "total_eclipse",
}

const SLOT_ARGS := {
	"active_1": [],
	"active_2": ["target", "player_pos"],
	"ultimate": ["enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
