extends Node
## Mythos Gates: Ascension — Amekhet, the Sunless Eye (MG-DEITY-004)
## Assassin kit, Meridian Court. DataLayer-driven (identical template to khaveth_kit.gd).
## Solo-first compliant: marks/bonuses are self- or enemy-facing only.

const DEITY_ID := "MG-DEITY-004"
const IFRAME_BUFF := "MG-BUFF-I-FRAME"
const UNTARGETABLE_BUFF := "MG-BUFF-UNTARGETABLE"

# ---- Local tuning ----
const SHADOW_STEP_RANGE := 9.0        # blink reach between sun-spots
const SHADOW_STEP_IFRAMES := 0.4      # brief immunity on blink
const NOONSHADE_BONUS := 0.15        # +15% damage per Noonshade stack
const NOONSHADE_MAX_STACKS := 4
const NOONSHADE_DURATION := 8.0
const ULT_DURATION := 5.0              # she is the day's only shadow

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[AmekhetKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[AmekhetKit] expected 3 abilities from DataLayer")
	print("[AmekhetKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Shadow-Step — blink to the nearest sun-spot in range, with brief i-frames.
func shadow_step(origin: Vector3, sun_spots: Array) -> Dictionary:
	var best: Vector3 = origin
	var best_d := SHADOW_STEP_RANGE
	var found := false
	for s in sun_spots:
		var d: float = origin.distance_to(s)
		if d <= best_d and d > 0.0:
			best_d = d; best = s; found = true
	return {"destination": best, "blinked": found,
		"iframes": SHADOW_STEP_IFRAMES, "buff": IFRAME_BUFF}

# ---------------------------------------------------------------- active_2
## Noonshade Mark — bonus damage from the one shadow light cannot banish.
func noonshade_mark(target) -> int:
	if target == null: return 0
	var stacks := int(target.get_meta("noonshade_stacks", 0))
	stacks = mini(stacks + 1, NOONSHADE_MAX_STACKS)
	target.set_meta("noonshade_stacks", stacks)
	target.set_meta("noonshade_timer", NOONSHADE_DURATION)
	return stacks

func noonshade_multiplier(target) -> float:
	if target == null: return 1.0
	var stacks := int(target.get_meta("noonshade_stacks", 0))
	return 1.0 + stacks * NOONSHADE_BONUS

# ---------------------------------------------------------------- ultimate
## High Noon Eclipsed — 5 seconds where she is the day's only shadow:
## untargetable, and every strike lands critical.
func high_noon_eclipsed() -> Dictionary:
	return {"untargetable": true, "all_critical": true,
		"duration": ULT_DURATION, "buff": UNTARGETABLE_BUFF}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "shadow_step",
	"active_2": "noonshade_mark",
	"ultimate": "high_noon_eclipsed",
}

const SLOT_ARGS := {
	"active_1": ["player_pos"],
	"active_2": ["target"],
	"ultimate": [],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
