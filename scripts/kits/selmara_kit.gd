extends Node
## Mythos Gates: Ascension — Selmara, the Returning River (MG-DEITY-031)
## Archer kit, MG-FACTION-008 (Deepgreen). DataLayer-driven (proven template).
## Solo-first: all effects are enemy-facing; the river owes no one.

const DEITY_ID := "MG-DEITY-031"
const SLOW_DEBUFF := "MG-DEBUFF-SLOW"

# ---- Local tuning ----
const UPSTREAM_RANGE := 16.0         # the shot travels out, then returns
const SHALLOWS_RADIUS := 5.0
const SHALLOWS_SLOW := 0.40          # -40% move while wading
const SHALLOWS_TIME := 3.0
const SPAWN_CHANNEL_WIDTH := 4.0     # river-channel you draw
const SPAWN_DAMAGE := 250.0          # torrent per enemy swept

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[SelmaraKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[SelmaraKit] expected 3 abilities from DataLayer")
	print("[SelmaraKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Upstream — a shot that pierces forward then RETURNS:
## every enemy on the line is hit twice, going and coming.
func upstream(origin: Vector3, facing: Vector2, enemies: Array) -> Dictionary:
	var f := facing.normalized()
	var hits: Array[Dictionary] = []
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var along := rel.dot(f)
		if along >= 0.0 and along <= UPSTREAM_RANGE:
			hits.append({"enemy": e, "times": 2})   # going and coming
	return {"range": UPSTREAM_RANGE, "hits": hits}

# ---------------------------------------------------------------- active_2
## Shallows — a deployable river-snare: enemies wade in slow motion.
func shallows(pos: Vector3, enemies: Array) -> Dictionary:
	var wading: Array = []
	for e in enemies:
		if pos.distance_to(e.position) <= SHALLOWS_RADIUS:
			e.set_meta("slow_mult", 1.0 - SHALLOWS_SLOW)
			e.set_meta("slow_timer", SHALLOWS_TIME)
			e.set_meta("slow_hook", SLOW_DEBUFF)
			wading.append(e)
	return {"pool": pos, "radius": SHALLOWS_RADIUS, "wading": wading}

# ---------------------------------------------------------------- ultimate
## The Spawning Run — a torrent of arrows floods a river-channel you draw;
## everything swept.
func the_spawning_run(origin: Vector3, facing: Vector2, enemies: Array) -> Dictionary:
	var f := facing.normalized()
	var right := Vector2(-f.y, f.x)
	var swept: Array = []
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var across := absf(rel.dot(right))
		if across <= SPAWN_CHANNEL_WIDTH:
			swept.append({"enemy": e, "damage": SPAWN_DAMAGE})
	return {"channel_width": SPAWN_CHANNEL_WIDTH * 2.0, "swept": swept}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "upstream",
	"active_2": "shallows",
	"ultimate": "the_spawning_run",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "facing", "enemies"],
	"active_2": ["target_pos", "enemies"],
	"ultimate": ["player_pos", "facing", "enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
