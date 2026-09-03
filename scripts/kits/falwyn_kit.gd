extends Node
## Mythos Gates: Ascension — Falwyn, the Duskfeather (MG-DEITY-006)
## Archer kit, Stormmoot. DataLayer-driven (proven F001 template).
## Solo-first: marks/untargetable are self- or enemy-facing only.

const DEITY_ID := "MG-DEITY-006"
const MARK_HOOK := "MG-BUFF-MARK"
const UNTARGETABLE_HOOK := "MG-BUFF-UNTARGETABLE"

# ---- Local tuning ----
const DUSKFLIGHT_GLIDE := 6.0        # backwards glide distance
const DUSKFLIGHT_SHOTS := 3          # shots fired while gliding
const DUSKFLIGHT_RANGE := 15.0       # shots always hit within this range
const FEATHERMARK_STACKS := 3        # next 3 shots seek the marked
const FEATHERMARK_BONUS := 0.20      # +20% dmg on seeking shots
const ULT_DURATION := 4.0             # falcon-form
const ULT_BARRAGE_SHOTS := 8

var deity: Dictionary = {}
var ability_db: Dictionary = {}
var feather_stacks := 0
var feather_target = null

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[FalwynKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[FalwynKit] expected 3 abilities from DataLayer")
	print("[FalwynKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Duskflight — glide backwards while loosing shots; shots land within range.
func duskflight(origin: Vector3, away_from: Vector3, enemies: Array) -> Dictionary:
	var dir := (origin - away_from)
	dir.y = 0
	if dir.length() < 0.001: dir = Vector3(0, 0, 1)
	var glide_to := origin + dir.normalized() * DUSKFLIGHT_GLIDE
	var shots: Array[Dictionary] = []
	for i in DUSKFLIGHT_SHOTS:
		var in_range: Array = []
		for e in enemies:
			if Vector3(e.position.x, 0, e.position.z).distance_to(
					Vector3(glide_to.x, 0, glide_to.z)) <= DUSKFLIGHT_RANGE:
				in_range.append(e)
		shots.append({"shot": i + 1, "always_hits": true, "targets_available": in_range.size()})
	return {"glide_to": glide_to, "shots": shots}

# ---------------------------------------------------------------- active_2
## Feathermark — homing mark: the next 3 shots seek the marked target.
func feathermark(target) -> Dictionary:
	feather_target = target
	feather_stacks = FEATHERMARK_STACKS
	target.set_meta("feathermarked", true)
	target.set_meta("feather_hook", MARK_HOOK)
	return {"target": target, "seeking_shots": FEATHERMARK_STACKS}

## Consume one seeking shot against the marked target.
func fire_seeking_shot(target) -> Dictionary:
	if feather_stacks <= 0 or target != feather_target:
		return {"seeks": false}
	feather_stacks -= 1
	if feather_stacks == 0:
		feather_target = null
		target.set_meta("feathermarked", false)
	return {"seeks": true, "always_hits": true,
		"damage_mult": 1.0 + FEATHERMARK_BONUS}

# ---------------------------------------------------------------- ultimate
## The Falcon's Price — untargetable falcon-form barrage.
func the_falcons_price(enemies: Array) -> Dictionary:
	var volley: Array[Dictionary] = []
	for i in ULT_BARRAGE_SHOTS:
		if enemies.is_empty(): break
		volley.append({"shot": i + 1, "always_hits": true})
	return {"untargetable": true, "hook": UNTARGETABLE_HOOK,
		"duration": ULT_DURATION, "volley": volley}
