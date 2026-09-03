extends Node
## Mythos Gates: Ascension — Estrith, the Quiet Thread (MG-DEITY-008)
## Assassin kit, Stormmoot. DataLayer-driven (proven F001 template).
## Solo-first: slow/dodge-fail/marks are enemy-facing only.

const DEITY_ID := "MG-DEITY-008"
const SLOW_DEBUFF := "MG-DEBUFF-SLOW"
const MARK_HOOK := "MG-BUFF-MARK"

# ---- Local tuning ----
const THREADSTEP_RANGE := 12.0       # max blink distance
const THREADSTEP_LEAD := 0.5         # seconds of movement predicted
const UNSPOOL_SLOW := 0.30           # -30% move speed
const UNSPOOL_DURATION := 4.0
const PREDETERMINED_DURATION := 5.0   # fated strikes

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[EstrithKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[EstrithKit] expected 3 abilities from DataLayer")
	print("[EstrithKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Threadstep — blink to the target's future position (predicted lead).
func threadstep(target) -> Dictionary:
	if target == null: return {"blinked": false}
	var future: Vector3 = target.position + target.velocity * THREADSTEP_LEAD
	return {"destination": future,
		"blinked": future.length() > 0.0,
		"max_range": THREADSTEP_RANGE}

# ---------------------------------------------------------------- active_2
## Unspool — the target is slowed; its next dodge fails.
func unspool(target) -> Dictionary:
	if target == null: return {"applied": false}
	target.set_meta("slowed", UNSPOOL_SLOW)
	target.set_meta("slow_timer", UNSPOOL_DURATION)
	target.set_meta("slow_hook", SLOW_DEBUFF)
	target.set_meta("dodge_fails_next", true)
	return {"applied": true, "slow": UNSPOOL_SLOW,
		"duration": UNSPOOL_DURATION, "dodge_fails_next": true}

func slow_multiplier(target) -> float:
	if target == null or not target.get_meta("slowed", false):
		return 1.0
	return 1.0 - UNSPOOL_SLOW

# ---------------------------------------------------------------- ultimate
## The Predetermined — 5s: her strikes on marked enemies are fated to land.
func the_predetermined(marked_enemies: Array) -> Dictionary:
	for e in marked_enemies:
		e.set_meta("fated", true)
		e.set_meta("fated_timer", PREDETERMINED_DURATION)
		e.set_meta("fate_hook", MARK_HOOK)
	return {"duration": PREDETERMINED_DURATION,
		"guaranteed_hits_on_marked": true,
		"fated": marked_enemies.size()}
