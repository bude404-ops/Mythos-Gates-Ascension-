extends Node
## Mythos Gates: Ascension — Arashido, the Threshold Storm (MG-DEITY-013)
## Warrior kit, MG-FACTION-004 (The Thousand Torii). DataLayer-driven (proven template).
## Solo-first: Gale Step speed buff is SELF-ONLY; all other effects are enemy-facing.
## Tap-to-move compatible: dash runs along facing; Storm Crosses marches toward the largest cluster.

signal faith_gained(amount: int, reason: String)

const DEITY_ID := "MG-DEITY-013"
const SPEED_HOOK := "MG-BUFF-SPEED-SELF"

# ---- Local tuning (numbers, never lore) ----
const GALE_DISTANCE := 10.0        # Gale Step dash length
const GALE_SPEED_BUFF := 0.35      # +35% self movement speed for the window
const GALE_WINDOW := 2.5           # seconds of speed after the dash
const GALE_STRIKE_BONUS := 0.20    # next strike after crossing a threshold +20%
const SWEEP_RADIUS := 6.0          # Tempest Sweep knockback radius
const SWEEP_KNOCKBACK := 7.0       # meters enemies are pushed
const STORM_BAND_WIDTH := 3.0      # half-width of the marching torii line
const STORM_MARCH_LEN := 20.0      # how far the storm-torii march
const STORM_GATES := 5             # torii in the marching line
const STORM_DMG_PER_GATE := 0.30   # +30% damage per torii gate an enemy is caught between

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[ArashidoKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[ArashidoKit] expected 3 abilities from DataLayer")
	print("[ArashidoKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Gale Step — dash through torii at speed. SELF-ONLY speed buff (MG-BUFF-SPEED-SELF).
## The next strike after crossing a threshold hits harder.
func gale_step() -> Dictionary:
	return {"dash_distance": GALE_DISTANCE,
		"self_speed_buff": GALE_SPEED_BUFF, "speed_window": GALE_WINDOW,
		"speed_hook": SPEED_HOOK, "self_only": true,
		"next_strike_bonus": GALE_STRIKE_BONUS}

# ---------------------------------------------------------------- active_2
## Tempest Sweep — AOE knockback around the threshold-storm.
func tempest_sweep(origin: Vector3, enemies: Array) -> Dictionary:
	var pushed: Array[Dictionary] = []
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var d := rel.length()
		if d <= SWEEP_RADIUS and d > 0.001:
			var dir := rel / d
			pushed.append({"enemy": e, "to": Vector3(origin.x + dir.x * SWEEP_KNOCKBACK, 0,
				origin.z + dir.y * SWEEP_KNOCKBACK)})
	return {"radius": SWEEP_RADIUS, "pushed": pushed}

# ---------------------------------------------------------------- ultimate
## The Storm Crosses — a line of storm-torii marches across the field.
## Enemies caught between gate pairs are struck; the more gates they are caught
## between, the harder the storm lands. Marches toward the densest enemy cluster
## (tap-to-move: no manual aiming).
func the_storm_crosses(origin: Vector3, enemies: Array) -> Dictionary:
	if enemies.is_empty():
		return {"gates": STORM_GATES, "hits": []}
	var best_dir := Vector2(1, 0)
	var best_count := -1
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		if rel.length() < 0.001: continue
		var dir := rel.normalized()
		var count := 0
		for other in enemies:
			var ro := Vector2(other.position.x - origin.x, other.position.z - origin.z)
			if ro.dot(dir) > 0 and absf(ro.dot(Vector2(-dir.y, dir.x))) <= STORM_BAND_WIDTH:
				count += 1
		if count > best_count:
			best_count = count; best_dir = dir
	var f := best_dir
	var right := Vector2(-f.y, f.x)
	var hits: Array[Dictionary] = []
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var along := rel.dot(f)
		var across := absf(rel.dot(right))
		if along >= 0 and along <= STORM_MARCH_LEN and across <= STORM_BAND_WIDTH:
			var gates_caught := int(along / (STORM_MARCH_LEN / float(STORM_GATES))) + 1
			hits.append({"enemy": e, "gates": gates_caught,
				"dmg_mult": 1.0 + gates_caught * STORM_DMG_PER_GATE})
	faith_gained.emit(3, "the storm crossed the line")
	return {"gates": STORM_GATES, "direction": f, "length": STORM_MARCH_LEN, "hits": hits}
