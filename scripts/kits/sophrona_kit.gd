extends Node
## Mythos Gates: Ascension — Sophrona, the Calculated (MG-DEITY-012)
## Assassin kit, MG-FACTION-003. DataLayer-driven (proven template).
## Solo-first: premise/conclusion marks are enemy-facing; faith restore self.

const DEITY_ID := "MG-DEITY-012"
const MARK_HOOK := "MG-BUFF-MARK"
const SPEED_HOOK := "MG-BUFF-SPEED-SELF"

# ---- Local tuning ----
const CONCLUSION_RANGE := 12.0      # blink reach to a marked target
const CONCLUSION_STRIKE := 1.5      # bonus damage on the conclusion strike
const PLAN_DURATION := 6.0           # auto-targeting window
const PLAN_CRIT := 0.50              # +50% crit vs weak points
const PLAN_FAITH_PER_KILL := 5.0

var deity: Dictionary = {}
var ability_db: Dictionary = {}
var marked: Array = []

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[SophronaKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[SophronaKit] expected 3 abilities from DataLayer")
	print("[SophronaKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Premise — mark a target with a logical condition.
func premise(target) -> Dictionary:
	if target == null: return {"marked": false}
	target.set_meta("premise_marked", true)
	target.set_meta("premise_hook", MARK_HOOK)
	if not marked.has(target): marked.append(target)
	return {"marked": true, "total_marked": marked.size()}

# ---------------------------------------------------------------- active_2
## Conclusion — blink to any marked target within 12m and strike.
func conclusion(origin: Vector3, target) -> Dictionary:
	if target == null or not target.get_meta("premise_marked", false):
		return {"blinked": false}
	var d: float = Vector3(origin.x, 0, origin.z).distance_to(
		Vector3(target.position.x, 0, target.position.z))
	if d > CONCLUSION_RANGE: return {"blinked": false, "reason": "out_of_range"}
	return {"blinked": true, "destination": target.position,
		"strike_bonus": CONCLUSION_STRIKE, "distance": d}

# ---------------------------------------------------------------- ultimate
## The Perfect Plan — 6s of auto-targeted weak points;
## every kill inside it restores Faith to you.
func the_perfect_plan(kills: int) -> Dictionary:
	return {"duration": PLAN_DURATION, "crit_bonus": PLAN_CRIT,
		"auto_target": true, "faith_restored": kills * PLAN_FAITH_PER_KILL,
		"self_only": true}
