extends Node
## Mythos Gates: Ascension — Caelvarin, the Every-Handed (MG-DEITY-018)
## Archer kit, MG-FACTION-005 (The Silverroot Kindred). DataLayer-driven (proven template).
## Solo-first: Footwork's speed and crit apply to YOU only (MG-BUFF-SPEED-SELF /
## MG-BUFF-CRIT-CHAIN); all other effects are enemy-facing.
## Tap-to-move compatible: Tradeshot auto-targets the nearest enemy; arrow type
## cycles fire/frost/shock — one discipline per craft.

signal faith_gained(amount: int, reason: String)

const DEITY_ID := "MG-DEITY-018"
const SPEED_HOOK := "MG-BUFF-SPEED-SELF"
const CRIT_HOOK := "MG-BUFF-CRIT-CHAIN"

const ELEMENTS: Array[String] = ["fire", "frost", "shock"]

# ---- Local tuning (numbers, never lore) ----
const TRADESHOT_RANGE := 18.0       # the linked dart's full reach
const TRADESHOT_PIERCE := 3         # segments through this many bodies
const CRAFT_PER_HIT := 1            # stacks gained per hit
const CRAFT_TO_SWAP := 3            # stacks that reforge the next arrow
const FOOTWORK_DASH := 8.0          # dash distance
const FOOTWORK_BUFF := 0.40         # 40% self-only speed while repositioning
const CRIT_WINDOW := 4.0            # seconds the crit conviction holds
const MOMENT_DURATION := 6.0        # Master of the Moment window
const MOMENT_INTERVAL := 1.5        # each owned skill fires on this cadence

var deity: Dictionary = {}
var ability_db: Dictionary = {}
var craft_stacks: int = 0
var next_element_idx: int = 0

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[CaelvarinKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[CaelvarinKit] expected 3 abilities from DataLayer")
	print("[CaelvarinKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Tradeshot — each hit grants a Craft stack; at three, the next arrow is
## reforged into the next discipline: fire, frost, shock.
func tradeshot(origin: Vector3, forward: Vector2, enemies: Array) -> Dictionary:
	var f := forward.normalized()
	var hits: Array[Dictionary] = []
	var pierced: int = 0
	var sorted_enemies := enemies.duplicate()
	sorted_enemies.sort_custom(func(a, b):
		var da := (a.position.x - origin.x) * f.x + (a.position.z - origin.z) * f.y
		var db := (b.position.x - origin.x) * f.x + (b.position.z - origin.z) * f.y
		return da < db)
	for e in sorted_enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var along := rel.dot(f)
		var across := absf(rel.dot(Vector2(-f.y, f.x)))
		if along >= 0.0 and along <= TRADESHOT_RANGE and across <= 0.9:
			if pierced >= TRADESHOT_PIERCE:
				break
			hits.append({"enemy": e, "along": along})
			pierced += 1
			craft_stacks = minf(craft_stacks + CRAFT_PER_HIT, CRAFT_TO_SWAP)
	var swapped: bool = false
	var element: String = ""
	if craft_stacks >= CRAFT_TO_SWAP:
		element = ELEMENTS[next_element_idx % ELEMENTS.size()]
		next_element_idx += 1
		craft_stacks = 0
		swapped = true
	return {"hits": hits, "craft_stacks": craft_stacks,
		"swapped": swapped, "next_element": element}

# ---------------------------------------------------------------- active_2
## Footwork — dash; your next shot crits. Speed and crit are SELF-ONLY.
func footwork() -> Dictionary:
	return {"dash_distance": FOOTWORK_DASH,
		"self_speed_buff": FOOTWORK_BUFF, "speed_hook": SPEED_HOOK,
		"next_shot_crits": true, "crit_hook": CRIT_HOOK,
		"crit_window": CRIT_WINDOW, "self_only": true}

# ---------------------------------------------------------------- ultimate
## Master of the Moment — for 6 seconds, every skill he owns fires in
## sequence, all at once. The schedule of a lifetime of mastery.
func master_of_the_moment() -> Dictionary:
	var volleys: int = int(MOMENT_DURATION / MOMENT_INTERVAL)
	var schedule: Array[Dictionary] = []
	for i: int in volleys:
		schedule.append({"t": (i + 1) * MOMENT_INTERVAL,
			"fires": ["active_1", "active_2", "basic"]})
	faith_gained.emit(6, "every craft at once")
	return {"duration": MOMENT_DURATION, "volleys": volleys,
		"schedule": schedule, "all_skills_sequence": true}
