extends Node
## Mythos Gates: Ascension — Tolveth, the Rootward (MG-DEITY-017)
## Warrior kit, MG-FACTION-005 (Silverroot Kindred). DataLayer-driven (proven template).
## Solo-first: heal is SELF-only; root/snare are enemy-facing.

const DEITY_ID := "MG-DEITY-017"
const SNARE_DEBUFF := "MG-DEBUFF-SNARE"
const HEAL_HOOK := "MG-BUFF-HEAL-SELF"

# ---- Local tuning ----
const ROOTSLAM_RADIUS := 5.0
const ROOTSLAM_SNARE_TIME := 1.5
const RIDGE_LENGTH := 8.0          # root-ridge barrier length
const RIDGE_HP := 200.0
const SECOND_GROWTH_HEAL := 0.25   # 25% max HP from grove-sap, SELF only
const FOREST_WALL_SNAP := 2.0      # grid snap for prefab walls
const FOREST_WALL_COUNT := 4       # walls sprouted
const FOREST_SNARE_TIME := 2.0

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[TolvethKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[TolvethKit] expected 3 abilities from DataLayer")
	print("[TolvethKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Rootslam — AOE strike; a root-ridge barrier rises from the impact.
func rootslam(origin: Vector3, enemies: Array) -> Dictionary:
	var hits: Array[Dictionary] = []
	for e in enemies:
		if origin.distance_to(e.position) <= ROOTSLAM_RADIUS:
			e.set_meta("snared", true)
			e.set_meta("snare_timer", ROOTSLAM_SNARE_TIME)
			e.set_meta("snare_hook", SNARE_DEBUFF)
			hits.append({"enemy": e, "snared": true})
	var ridge := {"position": origin, "length": RIDGE_LENGTH, "hp": RIDGE_HP}
	return {"hits": hits, "ridge": ridge}

# ---------------------------------------------------------------- active_2
## Second Growth — grove-sap knits YOU closed. SELF-only restore.
func second_growth(max_hp: float) -> Dictionary:
	return {"heal": max_hp * SECOND_GROWTH_HEAL, "heal_hook": HEAL_HOOK}

# ---------------------------------------------------------------- ultimate
## The Forest Rises — the battlefield sprouts grid-snapped walls;
## enemies caught in the growth are rooted.
func the_forest_rises(origin: Vector3, enemies: Array) -> Dictionary:
	var walls: Array[Dictionary] = []
	for i in FOREST_WALL_COUNT:
		var w := {"grid": Vector2(
			round(origin.x / FOREST_WALL_SNAP) * FOREST_WALL_SNAP + i * FOREST_WALL_SNAP,
			round(origin.z / FOREST_WALL_SNAP) * FOREST_WALL_SNAP), "hp": RIDGE_HP}
		walls.append(w)
	var rooted: Array = []
	for e in enemies:
		e.set_meta("snared", true)
		e.set_meta("snare_timer", FOREST_SNARE_TIME)
		rooted.append(e)
	return {"walls": walls, "rooted": rooted, "grid_snap": FOREST_WALL_SNAP}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "rootslam",
	"active_2": "second_growth",
	"ultimate": "the_forest_rises",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "enemies"],
	"active_2": ["max_hp"],
	"ultimate": ["player_pos", "enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
