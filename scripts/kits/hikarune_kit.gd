extends Node
## Mythos Gates: Ascension — Hikarune, the Weaving Sun (MG-DEITY-015)
## Caster kit, MG-FACTION-004 (The Thousand Torii). DataLayer-driven (proven template).
## Solo-first compliant: the shield is SELF-ONLY (MG-BUFF-SHIELD-SELF),
## the ult heal is SELF-ONLY (MG-BUFF-HEAL-SELF). Sunthread is enemy-facing.
## Tap-to-move compatible: Sunthread tethers the nearest enemy — no aiming.

signal faith_gained(amount: int, reason: String)
signal reflections_purged(count: int)

const DEITY_ID := "MG-DEITY-015"
const SHIELD_HOOK := "MG-BUFF-SHIELD-SELF"
const HEAL_HOOK := "MG-BUFF-HEAL-SELF"
const SNARE_HOOK := "MG-DEBUFF-SNARE"
const STRIP_HOOK := "MG-DEBUFF-BUFF-STRIP"

# ---- Local tuning (numbers, never lore) ----
const THREAD_RANGE := 12.0           # Sunthread tether reach
const THREAD_SNARE := 2.5            # seconds the target is rooted
const WEAVE_SHIELD := 0.30           # Radiant Weave absorbs 30% of incoming
const WEAVE_DURATION := 5.0          # shield duration (self-only)
const DAWN_HEAL := 0.35              # Dawn Rewound restores 35% of YOUR HP
const DAWN_PURGE_RADIUS := 15.0      # true light reaches this far
const DAWN_PURGE_BONUS := 1.0        # double force against false reflections

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[HikaruneKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[HikaruneKit] expected 3 abilities from DataLayer")
	print("[HikaruneKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Sunthread — a binding light-beam roots the nearest enemy (MG-DEBUFF-SNARE).
func sunthread(origin: Vector3, enemies: Array) -> Dictionary:
	var nearest: Node3D = null
	var nd := INF
	for e in enemies:
		var d: float = origin.distance_to(e.position)
		if d <= THREAD_RANGE and d < nd: nd = d; nearest = e
	if nearest == null: return {"tethered": false}
	nearest.set_meta("snared", true)
	nearest.set_meta("snare_timer", THREAD_SNARE)
	nearest.set_meta("snare_hook", SNARE_HOOK)
	return {"tethered": true, "target": nearest, "snare": THREAD_SNARE,
		"debuff_hook": SNARE_HOOK, "distance": nd}

# ---------------------------------------------------------------- active_2
## Radiant Weave — a shield woven from light, around YOU only.
func radiant_weave() -> Dictionary:
	return {"absorb": WEAVE_SHIELD, "duration": WEAVE_DURATION,
		"self_only": true, "buff_hook": SHIELD_HOOK}

# ---------------------------------------------------------------- ultimate
## Dawn Rewound — the field remembers the true light. Heals YOU (self-only)
## and purges false reflections: illusions within reach are stripped of their
## stolen buffs (MG-DEBUFF-BUFF-STRIP) and struck with double force.
func dawn_rewound(origin: Vector3, enemies: Array) -> Dictionary:
	var purged: Array[Dictionary] = []
	for e in enemies:
		var d: float = origin.distance_to(e.position)
		if d <= DAWN_PURGE_RADIUS and e.get_meta("is_false_reflection", false):
			e.set_meta("stolen_buffs_stripped", true)
			e.set_meta("strip_hook", STRIP_HOOK)
			purged.append({"enemy": e, "mult": 1.0 + DAWN_PURGE_BONUS,
				"revealed": true})
	reflections_purged.emit(purged.size())
	faith_gained.emit(4, "the true light was remembered")
	return {"self_heal": DAWN_HEAL, "self_only_heal": true, "heal_hook": HEAL_HOOK,
		"purge_radius": DAWN_PURGE_RADIUS, "purged": purged}
