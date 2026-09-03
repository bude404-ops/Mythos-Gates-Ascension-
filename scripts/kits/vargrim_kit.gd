extends Node
## Mythos Gates: Ascension — Vargrim, the Hollow-Eyed (MG-DEITY-007)
## Caster kit, Stormmoot. DataLayer-driven (proven F001 template).
## Solo-first: strips/reveals/silences are enemy-facing; no ally effects.

const DEITY_ID := "MG-DEITY-007"
const STRIP_DEBUFF := "MG-DEBUFF-BUFF-STRIP"
const SILENCE_DEBUFF := "MG-DEBUFF-SILENCE"

# ---- Local tuning ----
const UNDOING_BONUS_PER_BUFF := 0.10   # +10% dmg per buff stripped
const STORMSIGHT_RADIUS := 20.0
const STORMSIGHT_CRIT := 0.25          # +25% crit vs revealed
const STORMSIGHT_DURATION := 6.0
const UNWRITING_SILENCE := 6.0          # field-wide ability lockout

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[VargrimKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[VargrimKit] expected 3 abilities from DataLayer")
	print("[VargrimKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Rune of Undoing — strip a single enemy's buffs; more buffs = harder hit.
func rune_of_undoing(target) -> Dictionary:
	if target == null: return {"stripped": 0}
	var buffs: Dictionary = target.get_meta("enemy_buff", {})
	var n := buffs.size()
	target.set_meta("enemy_buff", {})
	target.set_meta("strip_hook", STRIP_DEBUFF)
	return {"stripped": n, "damage_mult": 1.0 + n * UNDOING_BONUS_PER_BUFF}

# ---------------------------------------------------------------- active_2
## Stormsight — reveal hidden enemies in 20m and expose weak points.
func stormsight(origin: Vector3, enemies: Array) -> Dictionary:
	var revealed: Array[Dictionary] = []
	for e in enemies:
		var d: float = Vector3(e.position.x, 0, e.position.z).distance_to(
			Vector3(origin.x, 0, origin.z))
		if d <= STORMSIGHT_RADIUS:
			e.set_meta("revealed", true)
			e.set_meta("weak_point", true)
			e.set_meta("weak_point_timer", STORMSIGHT_DURATION)
			revealed.append({"enemy": e, "crit_bonus": STORMSIGHT_CRIT})
	return {"revealed": revealed, "crit_bonus": STORMSIGHT_CRIT}

# ---------------------------------------------------------------- ultimate
## The Unwriting — blank runes erase every enemy's abilities for 6 seconds.
func the_unwriting(enemies: Array) -> Dictionary:
	for e in enemies:
		e.set_meta("silenced", true)
		e.set_meta("silence_timer", UNWRITING_SILENCE)
		e.set_meta("silence_hook", SILENCE_DEBUFF)
	return {"silenced": enemies.size(), "duration": UNWRITING_SILENCE, "hook": SILENCE_DEBUFF}
