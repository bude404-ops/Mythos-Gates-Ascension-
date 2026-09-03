extends Node
## Mythos Gates: Ascension — Tolveth, the Rootward (MG-DEITY-017)
## Warrior kit, MG-FACTION-005 (The Silverroot Kindred). DataLayer-driven (proven template).
## Solo-first: Second Growth heals YOU (MG-BUFF-HEAL-SELF); all other effects are
## enemy-facing or terrain. Every heal and buff in this kit is self-only.
## Tap-to-move compatible: Rootslam auto-centers on the nearest enemy cluster.

signal faith_gained(amount: int, reason: String)

const DEITY_ID := "MG-DEITY-017"
const HEAL_HOOK := "MG-BUFF-HEAL-SELF"
const SNARE_HOOK := "MG-DEBUFF-SNARE"

# ---- Local tuning (numbers, never lore) ----
const ROOTSLAM_RADIUS := 6.0        # the club's strike reach
const RIDGE_LENGTH := 10.0         # root-ridge wall length
const RIDGE_OFFSET := 2.0          # wall rises behind the swing
const RIDGE_DURATION := 4.0         # seconds the ridge holds
const GROVE_HEAL_PCT := 0.30       # Second Growth restores 30% of YOUR max HP
const GROVE_HEAL_TIME := 3.0       # sap flows over 3s
const FOREST_RADIUS := 18.0        # The Forest Rises reshapes this far
const FOREST_GRID := 3.0           # grid snap for terrain walls
const FOREST_ROOT_TIME := 1.5      # enemies caught by rising roots
const FOREST_WALLS := 8            # prefab walls that sprout

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
## Rootslam — AOE strike; a ridge of living root rises behind the swing,
## walling enemies off from their prey: you.
func rootslam(origin: Vector3, forward: Vector2, enemies: Array) -> Dictionary:
	var struck: Array[Dictionary] = []
	for e in enemies:
		var d := Vector2(e.position.x - origin.x, e.position.z - origin.z).length()
		if d <= ROOTSLAM_RADIUS:
			struck.append({"enemy": e, "distance": d})
	# Ridge wall: perpendicular to facing, rising behind the swing.
	var f := forward.normalized()
	var wall_dir := Vector2(-f.y, f.x)
	var center := Vector2(origin.x, origin.z) - f * RIDGE_OFFSET
	return {"struck": struck, "radius": ROOTSLAM_RADIUS,
		"ridge": {"center": center, "axis": wall_dir,
			"length": RIDGE_LENGTH, "duration": RIDGE_DURATION,
			"blocks_enemies": true}}

# ---------------------------------------------------------------- active_2
## Second Growth — grove-sap closes your wounds. SELF-ONLY (MG-BUFF-HEAL-SELF).
func second_growth(your_max_hp: float) -> Dictionary:
	return {"heal_amount": your_max_hp * GROVE_HEAL_PCT,
		"heal_time": GROVE_HEAL_TIME, "heal_hook": HEAL_HOOK,
		"self_only": true}

# ---------------------------------------------------------------- ultimate
## The Forest Rises — the battlefield sprouts. Terrain reshapes via
## grid-snapped prefab walls; enemies standing where roots rise are held.
func the_forest_rises(origin: Vector3, enemies: Array) -> Dictionary:
	var walls: Array[Dictionary] = []
	var rng := RandomNumberGenerator.new()
	rng.seed = int(origin.x * 31.0 + origin.z * 17.0)
	for i: int in FOREST_WALLS:
		var ang := rng.randf_range(0.0, TAU)
		var dist := rng.randf_range(3.0, FOREST_RADIUS)
		var cx := snappedf(origin.x + cos(ang) * dist, FOREST_GRID)
		var cz := snappedf(origin.z + sin(ang) * dist, FOREST_GRID)
		var axis_ang := snappedf(ang + PI * 0.5, PI * 0.25)
		walls.append({"center": Vector2(cx, cz),
			"axis": Vector2(cos(axis_ang), sin(axis_ang)),
			"length": FOREST_GRID * 2.0})
	var rooted: Array[Dictionary] = []
	for e in enemies:
		for w: Dictionary in walls:
			var rel := Vector2(e.position.x, e.position.z) - w["center"]
			var along := absf(rel.dot(w["axis"]))
			if along <= FOREST_GRID:  # standing in the sprout line
				e.set_meta("forest_held", true)
				e.set_meta("hold_timer", FOREST_ROOT_TIME)
				e.set_meta("hold_hook", SNARE_HOOK)
				rooted.append({"enemy": e, "duration": FOREST_ROOT_TIME})
				break
	faith_gained.emit(6, "the forest rose")
	return {"radius": FOREST_RADIUS, "walls": walls, "rooted": rooted}
