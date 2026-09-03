extends Node
## Mythos Gates: Ascension — Vennaith, the Unbanked Flame (MG-DEITY-019)
## Caster kit, MG-FACTION-005 (The Silverroot Kindred). DataLayer-driven (proven template).
## Solo-first: Rekindle heals YOU (MG-BUFF-HEAL-SELF); all other effects are
## enemy-facing. No ally heals/buffs anywhere in the kit.
## Tap-to-move compatible: Cinderbind auto-roots the nearest cluster; the
## Smelting wave rolls forward along your facing.

signal faith_gained(amount: int, reason: String)

const DEITY_ID := "MG-DEITY-019"
const HEAL_HOOK := "MG-BUFF-HEAL-SELF"
const SNARE_HOOK := "MG-DEBUFF-SNARE"
const ARMOR_HOOK := "MG-DEBUFF-ARMOR-MELT"
const STRIP_HOOK := "MG-DEBUFF-BUFF-STRIP"

# ---- Local tuning (numbers, never lore) ----
const CINDER_RADIUS := 5.0          # flame-roots reach
const CINDER_ROOT_TIME := 2.0       # seconds the roots hold
const CINDER_BURN_TIME := 4.0       # the ember-glow lingers
const REKINDLE_PCT := 0.35          # Rekindle restores 35% of YOUR max HP
const SMELTING_RANGE := 14.0        # the forge-wave rolls this far
const SMELTING_WIDTH := 6.0         # full width of the wave front
const ARMOR_MELT := 0.40            # enemies lose 40% armor
const MELT_TIME := 5.0              # seconds the melt holds

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
## Cinderbind — flame-roots seize enemies where they stand.
func cinderbind(origin: Vector3, enemies: Array) -> Dictionary:
	var caught: Array[Dictionary] = []
	for e in enemies:
		var d := Vector2(e.position.x - origin.x, e.position.z - origin.z).length()
		if d <= CINDER_RADIUS:
			e.set_meta("cinderbound", true)
			e.set_meta("root_timer", CINDER_ROOT_TIME)
			e.set_meta("root_hook", SNARE_HOOK)
			caught.append({"enemy": e, "root": CINDER_ROOT_TIME,
				"burn": CINDER_BURN_TIME})
	return {"radius": CINDER_RADIUS, "caught": caught}

# ---------------------------------------------------------------- active_2
## Rekindle — the First Flame was never let die; it mends YOU. SELF-ONLY.
func rekindle(your_max_hp: float) -> Dictionary:
	return {"heal_amount": your_max_hp * REKINDLE_PCT,
		"heal_hook": HEAL_HOOK, "self_only": true}

# ---------------------------------------------------------------- ultimate
## The Smelting — a wave of forge-fire rolls forward: armor melts and every
## enemy blessing is stripped to slag.
func the_smelting(origin: Vector3, forward: Vector2, enemies: Array) -> Dictionary:
	var f := forward.normalized()
	var right := Vector2(-f.y, f.x)
	var smelted: Array[Dictionary] = []
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var along := rel.dot(f)
		var across := rel.dot(right)
		if along >= 0.0 and along <= SMELTING_RANGE \
				and absf(across) <= SMELTING_WIDTH * 0.5:
			e.set_meta("armor_melted", ARMOR_MELT)
			e.set_meta("melt_timer", MELT_TIME)
			e.set_meta("melt_hook", ARMOR_HOOK)
			e.set_meta("buffs_stripped", true)
			e.set_meta("strip_hook", STRIP_HOOK)
			smelted.append({"enemy": e, "armor_melt": ARMOR_MELT,
				"melt_time": MELT_TIME, "buffs_stripped": true})
	faith_gained.emit(6, "the smelting rolled")
	return {"range": SMELTING_RANGE, "width": SMELTING_WIDTH,
		"smelted": smelted}
