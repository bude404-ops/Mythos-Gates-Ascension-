extends Node
## Mythos Gates: Ascension — Hikarune, the Weaving Sun (MG-DEITY-015)
## Caster kit, MG-FACTION-004 (Thousand Torii). DataLayer-driven (proven template).
## Solo-first: shield/heal are SELF-only; snare is enemy-facing.

const DEITY_ID := "MG-DEITY-015"
const SNARE_DEBUFF := "MG-DEBUFF-SNARE"
const SHIELD_HOOK := "MG-BUFF-SHIELD-SELF"
const HEAL_HOOK := "MG-BUFF-HEAL-SELF"

# ---- Local tuning ----
const SUNTHREAD_LENGTH := 14.0       # beam reach
const SUNTHREAD_SNARE_TIME := 2.0    # rooted by binding light
const WEAVE_SHIELD := 0.30           # absorbs 30% of max HP
const WEAVE_DURATION := 8.0
const DAWN_HEAL := 0.35              # restores 35% of max HP to YOU

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
## Sunthread — a binding light-beam roots every enemy it crosses.
func sunthread(origin: Vector3, forward: Vector2, enemies: Array) -> Array:
	var f := forward.normalized()
	var hits: Array[Dictionary] = []
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var along := rel.dot(f)
		if along >= 0.0 and along <= SUNTHREAD_LENGTH:
			e.set_meta("snared", true)
			e.set_meta("snare_timer", SUNTHREAD_SNARE_TIME)
			e.set_meta("snare_hook", SNARE_DEBUFF)
			hits.append({"enemy": e, "rooted": true, "along": along})
	return hits

# ---------------------------------------------------------------- active_2
## Radiant Weave — a shield of woven light around YOU.
func radiant_weave(max_hp: float) -> Dictionary:
	var shield_amount := max_hp * WEAVE_SHIELD
	return {"shield": shield_amount, "duration": WEAVE_DURATION,
		"shield_hook": SHIELD_HOOK}

# ---------------------------------------------------------------- ultimate
## Dawn Rewound — true light returns: heals YOU and purges every false
## reflection on the field (hard-counter to realm illusions).
func dawn_rewound(max_hp: float, enemies: Array) -> Dictionary:
	var purged: Array = []
	for e in enemies:
		if e.get_meta("is_false_reflection", false):
			e.set_meta("purged", true)
			purged.append(e)
	return {"heal": max_hp * DAWN_HEAL, "heal_hook": HEAL_HOOK,
		"false_reflections_purged": purged}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "sunthread",
	"active_2": "radiant_weave",
	"ultimate": "dawn_rewound",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "facing", "enemies"],
	"active_2": ["max_hp"],
	"ultimate": ["max_hp", "enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
