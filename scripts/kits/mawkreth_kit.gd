extends Node
## Mythos Gates: Ascension — Mawkreth, the Sleeping Ridge (MG-DEITY-029)
## Warrior kit, MG-FACTION-008 (Deepgreen). DataLayer-driven (proven template).
## Solo-first: basalt skin is SELF-only; slam/eruption are enemy-facing.

const DEITY_ID := "MG-DEITY-029"

# ---- Local tuning ----
const RIDGEBREAK_RADIUS := 5.5
const RIDGEBREAK_SNARE := 1.0
const WALL_HP := 250.0
const BASALT_REDUCTION := 0.35        # -35% damage taken while standing ground
const BASALT_MIN_MOVE := 0.2          # standing ground = moving slower than this
const BASALT_DURATION := 6.0
const ERUPTION_RADIUS := 12.0
const ERUPTION_KNOCKUP := 3.0         # lava vents knock enemies up

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[MawkrethKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[MawkrethKit] expected 3 abilities from DataLayer")
	print("[MawkrethKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Ridgebreaker — a ground-slam AOE; stone walls rise from the cracks.
func ridgebreaker(origin: Vector3, enemies: Array) -> Dictionary:
	var hits: Array = []
	for e in enemies:
		if origin.distance_to(e.position) <= RIDGEBREAK_RADIUS:
			e.set_meta("snared", true)
			e.set_meta("snare_timer", RIDGEBREAK_SNARE)
			hits.append(e)
	return {"hits": hits, "walls": [{"hp": WALL_HP}, {"hp": WALL_HP}]}

# ---------------------------------------------------------------- active_2
## Basalt Skin — damage reduction while YOU stand your ground.
func basalt_skin() -> Dictionary:
	return {"reduction": BASALT_REDUCTION, "duration": BASALT_DURATION,
		"standing_ground": BASALT_MIN_MOVE, "self_buff": true}

func basalt_multiplier(current_move_speed: float) -> float:
	return 1.0 - BASALT_REDUCTION if current_move_speed <= BASALT_MIN_MOVE else 1.0

# ---------------------------------------------------------------- ultimate
## The Ridge Wakes — an eruption: shockwave out, lava vents in preset patterns.
func the_ridge_wakes(origin: Vector3, enemies: Array) -> Dictionary:
	var affected: Array[Dictionary] = []
	for e in enemies:
		if origin.distance_to(e.position) <= ERUPTION_RADIUS:
			affected.append({"enemy": e, "knocked_up": ERUPTION_KNOCKUP})
	return {"radius": ERUPTION_RADIUS, "affected": affected,
		"vent_patterns": ["cone", "ring", "line"]}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "ridgebreaker",
	"active_2": "basalt_skin",
	"ultimate": "the_ridge_wakes",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "enemies"],
	"active_2": [],
	"ultimate": ["player_pos", "enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
