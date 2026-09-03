extends Node
## Mythos Gates: Ascension — Mukage, the Unfinished (MG-DEITY-016)
## Assassin kit, MG-FACTION-004 (The Thousand Torii). DataLayer-driven (proven template).
## Solo-first: Spirit-Step grants Mukage a brief untouchable window (MG-BUFF-I-FRAME);
## all other effects are enemy-facing. No ally heals/buffs anywhere in the kit.
## Tap-to-move compatible: blink lands behind the nearest marked threat.

signal faith_gained(amount: int, reason: String)

const DEITY_ID := "MG-DEITY-016"
const MARK_HOOK := "MG-BUFF-MARK"
const IFRAME_HOOK := "MG-BUFF-I-FRAME"

# ---- Local tuning (numbers, never lore) ----
const SPIRIT_STEP_RANGE := 14.0     # blink reach — through any terrain
const IFRAME_WINDOW := 0.8          # seconds untouchable while crossing the boundary
const UNMAKING_BONUS := 0.75        # +75% damage vs illusions / false reflections
const THRESHOLD_RADIUS := 13.0      # The Threshold Closes reach
const HALF_SPIRIT_DEF_SHRED := 1.0  # half-spirited enemies lose 100% of armor
const HALF_SPIRIT_WINDOW := 5.0     # seconds they hang between body and spirit
const HALF_SPIRIT_CRIT := 1.00      # your strikes land true: guaranteed crit window

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[MukageKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[MukageKit] expected 3 abilities from DataLayer")
	print("[MukageKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Spirit-Step — blink across the boundary, through terrain. Mukage is the
## boundary; walls are merely lines she has already crossed.
func spirit_step(origin: Vector3, target_pos: Vector3) -> Dictionary:
	var d := Vector3(origin.x, 0, origin.z).distance_to(
		Vector3(target_pos.x, 0, target_pos.z))
	if d > SPIRIT_STEP_RANGE:
		return {"blinked": false, "reason": "beyond the boundary's reach"}
	return {"blinked": true, "destination": target_pos,
		"through_walls": true, "iframes": IFRAME_WINDOW,
		"iframe_hook": IFRAME_HOOK, "distance": d}

# ---------------------------------------------------------------- active_2
## Unmaking Cut — the Boundary Blades were drawn to end false things.
## Bonus damage against illusions and false reflections.
func unmaking_cut(target) -> Dictionary:
	if target == null: return {"bonus": 0.0}
	var is_untrue := target.get_meta("is_illusion", false) or \
		target.get_meta("is_false_reflection", false)
	return {"bonus": UNMAKING_BONUS if is_untrue else 0.0, "untrue": is_untrue}

# ---------------------------------------------------------------- ultimate
## The Threshold Closes — the inverse of the boundary-thieves' move: marked
## enemies are pulled halfway out of their bodies, defenseless. Your strikes
## land true on half-spirited enemies.
func the_threshold_closes(origin: Vector3, enemies: Array) -> Dictionary:
	var caught: Array[Dictionary] = []
	for e in enemies:
		var d := Vector3(origin.x, 0, origin.z).distance_to(
			Vector3(e.position.x, 0, e.position.z))
		var is_marked: bool = e.get_meta("moonmarked", false) or e.get_meta("marked", false)
		if d <= THRESHOLD_RADIUS:
			e.set_meta("half_spirited", true)
			e.set_meta("armor", 0)
			e.set_meta("half_spirit_timer", HALF_SPIRIT_WINDOW)
			caught.append({"enemy": e, "half_spirited": true,
				"defense_shredded": HALF_SPIRIT_DEF_SHRED,
				"guaranteed_crit": HALF_SPIRIT_CRIT,
				"was_marked": is_marked})
	faith_gained.emit(4, "the threshold closed")
	return {"radius": THRESHOLD_RADIUS, "window": HALF_SPIRIT_WINDOW,
		"caught": caught}
