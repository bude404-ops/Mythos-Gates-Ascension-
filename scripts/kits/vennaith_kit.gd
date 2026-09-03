extends Node
## Mythos Gates: Ascension — Vennaith, the Unbanked Flame (MG-DEITY-019)
## Caster kit, MG-FACTION-005 (Silverroot Kindred). DataLayer-driven (proven template).
## Solo-first: heal is SELF-only; flame-root/melt/strip are enemy-facing.

const DEITY_ID := "MG-DEITY-019"
const SNARE_DEBUFF := "MG-DEBUFF-SNARE"
const HEAL_HOOK := "MG-BUFF-HEAL-SELF"
const MELT_DEBUFF := "MG-DEBUFF-ARMOR-MELT"
const STRIP_DEBUFF := "MG-DEBUFF-BUFF-STRIP"

# ---- Local tuning ----
const CINDERBIND_RADIUS := 4.0
const CINDERBIND_SNARE_TIME := 2.0
const REKINDLE_HEAL := 0.30           # 30% max HP from the First Flame, SELF
const SMELTING_MELT := 0.50           # -50% armor in the forge-fire wave
const SMELTING_WAVE_RADIUS := 12.0

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[VennaithKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[VennaithKit] expected 3 abilities from DataLayer")
	print("[VennaithKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Cinderbind — the forge-flame takes root: enemies in the radius are rooted.
func cinderbind(origin: Vector3, enemies: Array) -> Array:
	var hits: Array[Dictionary] = []
	for e in enemies:
		if origin.distance_to(e.position) <= CINDERBIND_RADIUS:
			e.set_meta("snared", true)
			e.set_meta("snare_timer", CINDERBIND_SNARE_TIME)
			e.set_meta("snare_hook", SNARE_DEBUFF)
			hits.append({"enemy": e, "snared": true})
	return hits

# ---------------------------------------------------------------- active_2
## Rekindle — the First Flame restores YOU. SELF-only.
func rekindle(max_hp: float) -> Dictionary:
	return {"heal": max_hp * REKINDLE_HEAL, "heal_hook": HEAL_HOOK}

# ---------------------------------------------------------------- ultimate
## The Smelting — a forge-fire wave rolls out: armor melts, buffs strip away.
func the_smelting(origin: Vector3, enemies: Array) -> Dictionary:
	var affected: Array[Dictionary] = []
	for e in enemies:
		if origin.distance_to(e.position) <= SMELTING_WAVE_RADIUS:
			e.set_meta("melt", SMELTING_MELT)
			e.set_meta("melt_hook", MELT_DEBUFF)
			var stripped := false
			if e.has_meta("enemy_buff"):
				e.set_meta("enemy_buff", {})
				stripped = true
			affected.append({"enemy": e, "melt": SMELTING_MELT, "stripped": stripped})
	return {"radius": SMELTING_WAVE_RADIUS, "affected": affected}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "cinderbind",
	"active_2": "rekindle",
	"ultimate": "the_smelting",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "enemies"],
	"active_2": ["max_hp"],
	"ultimate": ["player_pos", "enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
