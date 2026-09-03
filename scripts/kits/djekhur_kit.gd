extends Node
## Mythos Gates: Ascension — Djekhur, the Ashen Gale (MG-DEITY-002)
## Warrior kit, Meridian Court. DataLayer-driven (identical template to khaveth_kit.gd).
## Solo-first compliant: all effects are enemy-facing debuffs (armor shred / defense down).

const DEITY_ID := "MG-DEITY-002"

# ---- Local tuning (numbers, never lore) ----
const DASH_LENGTH := 8.0             # Sand-Gale Dash reach
const DASH_HALF_WIDTH := 1.5         # half-width of the gale corridor
const SHRED_PER_STACK := 0.20        # -20% enemy defense per shred stack
const SHRED_MAX_STACKS := 2
const SHRED_DURATION := 6.0
const SWEEP_RADIUS := 4.5            # Scouring Sweep radius around Djekhur
const SWEEP_DEF_DOWN := 0.15         # flat defense down on swept enemies
const SWEEP_DURATION := 5.0

var deity: Dictionary = {}
var ability_db: Dictionary = {}       # slot -> ability record from DataLayer

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[DjekhurKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[DjekhurKit] expected 3 abilities from DataLayer")
	print("[DjekhurKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

## Defense multiplier an enemy suffers from accumulated armor shreds.
func shred_multiplier(target) -> float:
	if target == null: return 1.0
	var stacks := int(target.get_meta("armor_shred", 0))
	return 1.0 - stacks * SHRED_PER_STACK

# ---------------------------------------------------------------- active_1
## Sand-Gale Dash — dash through the gale corridor; enemies inside take damage
## and gain an armor-shred stack. Returns hit list for the combat loop.
func sand_gale_dash(origin: Vector3, forward: Vector2, enemies: Array) -> Dictionary:
	var f := forward.normalized()
	var right := Vector2(-f.y, f.x) * DASH_HALF_WIDTH
	var hits: Array[Dictionary] = []
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var along := rel.dot(f)
		var across := absf(rel.dot(right.normalized()))
		if along >= 0.0 and along <= DASH_LENGTH and across <= DASH_HALF_WIDTH:
			var stacks := int(e.get_meta("armor_shred", 0))
			stacks = mini(stacks + 1, SHRED_MAX_STACKS)
			e.set_meta("armor_shred", stacks)
			e.set_meta("armor_shred_timer", SHRED_DURATION)
			hits.append({"enemy": e, "shred_stacks": stacks})
	return {"length": DASH_LENGTH, "half_width": DASH_HALF_WIDTH, "hits": hits}

# ---------------------------------------------------------------- active_2
## Scouring Sweep — AOE around Djekhur; erodes pride: flat defense down.
func scouring_sweep(origin: Vector3, enemies: Array) -> Array:
	var hits: Array[Dictionary] = []
	for e in enemies:
		var d := origin.distance_to(e.position)
		if d <= SWEEP_RADIUS:
			e.set_meta("def_down", SWEEP_DEF_DOWN)
			e.set_meta("def_down_timer", SWEEP_DURATION)
			hits.append({"enemy": e, "def_down": SWEEP_DEF_DOWN})
	return hits

# ---------------------------------------------------------------- ultimate
## The Erasing Wind — storm sweeps the whole field: strips enemy buffs
## and destroys hostile terrain effects (e.g. Glaresworn light-patch hazards).
func erasing_wind(enemies: Array, terrain_effects: Array) -> Dictionary:
	var buffs_stripped := 0
	for e in enemies:
		if e.has_meta("enemy_buff"):
			e.set_meta("enemy_buff", {})
			buffs_stripped += 1
	var erased: Array = []
	for t in terrain_effects:
		if t.get("hostile", false):
			erased.append(t)
	return {"buffs_stripped": buffs_stripped, "terrain_erased": erased}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "sand_gale_dash",
	"active_2": "scouring_sweep",
	"ultimate": "erasing_wind",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "facing", "enemies"],
	"active_2": ["player_pos", "enemies"],
	"ultimate": ["enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
