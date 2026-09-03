extends Node
## Mythos Gates: Ascension — Mukage, the Unfinished (MG-DEITY-016)
## Assassin kit, MG-FACTION-004 (The Thousand Torii). DataLayer-driven (proven template).
## Solo-first compliant: zero ally heals/buffs — all effects are enemy-facing.
## Tap-to-move compatible: Spirit-Step blinks toward the nearest enemy.

signal faith_gained(amount: int, reason: String)
signal threshold_closed(count: int)

const DEITY_ID := "MG-DEITY-016"
const MARK_HOOK := "MG-BUFF-MARK"
const ARMOR_HOOK := "MG-DEBUFF-ARMOR-MELT"

# ---- Local tuning (numbers, never lore) ----
const SPIRIT_RANGE := 14.0           # Spirit-Step blink reach
const SPIRIT_THROUGH_WALLS := true   # the boundary does not stop her
const UNMAKING_BONUS := 1.0          # double force vs illusions / false reflections
const THRESHOLD_RADIUS := 10.0      # The Threshold Closes reach
const THRESHOLD_DEF_SHRED := 0.50    # half-spirited enemies lose 50% defense
const THRESHOLD_DURATION := 5.0      # how long they stand defenseless
const THRESHOLD_CRIT := 1.00         # your strikes always find the gap

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
## Spirit-Step — blink across the boundary, through terrain, to the nearest enemy.
func spirit_step(origin: Vector3, enemies: Array) -> Dictionary:
	var nearest: Node3D = null
	var nd := INF
	for e in enemies:
		var d: float = origin.distance_to(e.position)
		if d <= SPIRIT_RANGE and d < nd: nd = d; nearest = e
	if nearest == null: return {"blinked": false}
	return {"blinked": true, "destination": nearest.position,
		"through_walls": SPIRIT_THROUGH_WALLS, "distance": nd}

# ---------------------------------------------------------------- active_2
## Unmaking Cut — strikes against illusions and false reflections
## land with double force. The copy is always less than the original.
func unmaking_cut(target) -> Dictionary:
	if target == null: return {"cut": false}
	var is_illusion: bool = target.get_meta("is_false_reflection", false)
	return {"cut": true, "mult": 1.0 + (UNMAKING_BONUS if is_illusion else 0.0),
		"vs_illusion": is_illusion}

# ---------------------------------------------------------------- ultimate
## The Threshold Closes — marked enemies are pulled halfway out of their bodies,
## defenseless. Their defense is halved and your strikes always find the gap.
func the_threshold_closes(origin: Vector3, enemies: Array) -> Dictionary:
	var caught: Array[Dictionary] = []
	for e in enemies:
		var d: float = origin.distance_to(e.position)
		if d <= THRESHOLD_RADIUS:
			e.set_meta("half_spirited", true)
			e.set_meta("defense_shred", THRESHOLD_DEF_SHRED)
			e.set_meta("defenseless_timer", THRESHOLD_DURATION)
			e.set_meta("mark_hook", MARK_HOOK)
			e.set_meta("armor_hook", ARMOR_HOOK)
			caught.append({"enemy": e, "defense_shred": THRESHOLD_DEF_SHRED,
				"always_crit": THRESHOLD_CRIT})
	threshold_closed.emit(caught.size())
	faith_gained.emit(caught.size(), "the line was drawn and kept")
	return {"radius": THRESHOLD_RADIUS, "duration": THRESHOLD_DURATION,
		"caught": caught}
