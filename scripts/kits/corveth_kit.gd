extends Node
## Mythos Gates: Ascension — Corveth, the Battle-Crow (MG-DEITY-020)
## Assassin kit, MG-FACTION-005 (The Silverroot Kindred). DataLayer-driven (proven template).
## Solo-first: all effects are enemy-facing (marks, fate-damage); Crowfall's
## untargetable window applies to YOU mid-flight (MG-BUFF-UNTARGETABLE).
## Tap-to-move compatible: Crowfall dives the nearest enemy; War-Omen marks
## whatever you strike; the flock lands where the battle ends.

signal faith_gained(amount: int, reason: String)

const DEITY_ID := "MG-DEITY-020"
const UNTARGETABLE_HOOK := "MG-BUFF-UNTARGETABLE"
const MARK_HOOK := "MG-BUFF-MARK"

# ---- Local tuning (numbers, never lore) ----
const CROWFALL_RANGE := 12.0        # the dive's reach
const CROW_FLIGHT_TIME := 0.6       # seconds untargetable in crow-form
const OMEN_MAX_BONUS := 1.0         # fate doubles as the target fades
const OMEN_DURATION := 10.0         # the omen hangs this long
const FATE_EXECUTE_PCT := 0.30      # marked enemies below 30% meet their fate

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[CorvethKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[CorvethKit] expected 3 abilities from DataLayer")
	print("[CorvethKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Crowfall — a leap-strike from above. Untargetable while in crow-form.
func crowfall(origin: Vector3, target_pos: Vector3) -> Dictionary:
	var d := Vector2(target_pos.x - origin.x, target_pos.z - origin.z).length()
	if d > CROWFALL_RANGE:
		return {"dived": false, "reason": "beyond the flock's reach"}
	return {"dived": true, "destination": target_pos,
		"untargetable": CROW_FLIGHT_TIME,
		"untargetable_hook": UNTARGETABLE_HOOK, "distance": d}

# ---------------------------------------------------------------- active_2
## War-Omen — mark a target: the lower its health, the more damage it takes.
func war_omen(target, target_hp_frac: float) -> Dictionary:
	if target == null:
		return {"marked": false}
	var bonus := clampf((1.0 - target_hp_frac) * OMEN_MAX_BONUS, 0.0, OMEN_MAX_BONUS)
	target.set_meta("war_omened", true)
	target.set_meta("omen_timer", OMEN_DURATION)
	target.set_meta("omen_hook", MARK_HOOK)
	target.set_meta("omen_damage_mult", 1.0 + bonus)
	return {"marked": true, "damage_mult": 1.0 + bonus,
		"duration": OMEN_DURATION, "hp_frac": target_hp_frac}

# ---------------------------------------------------------------- ultimate
## The End of the Battle — she lands as a flock. Every marked enemy takes its
## fate-damage immediately; those already fading are finished.
func the_end_of_the_battle(origin: Vector3, enemies: Array) -> Dictionary:
	var fated: Array[Dictionary] = []
	var executed: Array[Dictionary] = []
	for e in enemies:
		if e.get_meta("war_omened", false):
			var hp_frac: float = e.get_meta("hp_frac", 1.0)
			var bonus: float = clampf((1.0 - hp_frac) * OMEN_MAX_BONUS, 0.0, OMEN_MAX_BONUS)
			var fate: Dictionary = {"enemy": e, "fate_damage_mult": 1.0 + bonus,
				"hp_frac": hp_frac}
			if hp_frac <= FATE_EXECUTE_PCT:
				e.set_meta("fated", true)
				fate["executed"] = true
				executed.append(fate)
			else:
				fated.append(fate)
			e.set_meta("war_omened", false)
	faith_gained.emit(8, "the battle ended")
	return {"landed_as_flock": true, "fated": fated, "executed": executed}
