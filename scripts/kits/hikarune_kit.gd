extends Node
## Mythos Gates: Ascension — Hikarune, the Weaving Sun (MG-DEITY-015)
## Caster kit, MG-FACTION-004 (The Thousand Torii). DataLayer-driven (proven template).
## Solo-first: Radiant Weave shields YOU (MG-BUFF-SHIELD-SELF); Dawn Rewound heals YOU
## (MG-BUFF-HEAL-SELF). No ally heals/buffs anywhere in the kit.
## Tap-to-move compatible: Sunthread auto-faces the nearest unrooted enemy.

signal faith_gained(amount: int, reason: String)

const DEITY_ID := "MG-DEITY-015"
const SHIELD_HOOK := "MG-BUFF-SHIELD-SELF"
const HEAL_HOOK := "MG-BUFF-HEAL-SELF"
const SNARE_HOOK := "MG-DEBUFF-SNARE"

# ---- Local tuning (numbers, never lore) ----
const SUNTHREAD_LEN := 12.0        # binding beam reach
const SUNTHREAD_WIDTH := 1.0       # half-width of the sunthread
const ROOT_DURATION := 2.5         # seconds enemies stay woven to the ground
const WEAVE_SHIELD_PCT := 0.25     # shield = 25% of your max HP
const WEAVE_DURATION := 6.0        # seconds the woven light holds
const DAWN_HEAL_PCT := 0.35        # Dawn Rewound restores 35% of YOUR max HP
const DAWN_PURGE_BONUS := 0.50     # +50% damage vs illusions / false reflections
const DAWN_PURGE_WINDOW := 6.0     # seconds the true light lingers

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
## Sunthread — a binding light-beam roots enemies where it touches.
func sunthread(origin: Vector3, forward: Vector2, enemies: Array) -> Dictionary:
	var f := forward.normalized()
	var right := Vector2(-f.y, f.x) * SUNTHREAD_WIDTH
	var rooted: Array[Dictionary] = []
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var along := rel.dot(f)
		var across := absf(rel.dot(right.normalized()))
		if along >= 0.0 and along <= SUNTHREAD_LEN and across <= SUNTHREAD_WIDTH:
			e.set_meta("sunthread_rooted", true)
			e.set_meta("root_timer", ROOT_DURATION)
			e.set_meta("root_hook", SNARE_HOOK)
			rooted.append({"enemy": e, "duration": ROOT_DURATION})
	return {"length": SUNTHREAD_LEN, "half_width": SUNTHREAD_WIDTH, "rooted": rooted}

# ---------------------------------------------------------------- active_2
## Radiant Weave — a shield woven from light. SELF-ONLY (MG-BUFF-SHIELD-SELF).
func radiant_weave(your_max_hp: float) -> Dictionary:
	return {"shield_amount": your_max_hp * WEAVE_SHIELD_PCT,
		"duration": WEAVE_DURATION, "shield_hook": SHIELD_HOOK,
		"self_only": true}

# ---------------------------------------------------------------- ultimate
## Dawn Rewound — restores the true light: heals YOU and purges every false
## reflection on the field. The hard-counter to this realm's illusions.
func dawn_rewound(your_max_hp: float, enemies: Array) -> Dictionary:
	var purged: Array[Dictionary] = []
	for e in enemies:
		if e.get_meta("is_illusion", false) or e.get_meta("is_false_reflection", false):
			e.set_meta("revealed", true)
			purged.append({"enemy": e, "revealed": true,
				"damage_taken_mult": 1.0 + DAWN_PURGE_BONUS})
	faith_gained.emit(5, "the dawn was rewound")
	return {"heal_amount": your_max_hp * DAWN_HEAL_PCT, "heal_hook": HEAL_HOOK,
		"self_only_heal": true, "purged": purged,
		"purge_window": DAWN_PURGE_WINDOW}
