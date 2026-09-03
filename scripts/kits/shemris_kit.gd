extends Node
## Mythos Gates: Ascension — Shemris, the Glasswind (MG-DEITY-003)
## Archer kit, Meridian Court. DataLayer-driven (identical template to khaveth_kit.gd).
## Solo-first compliant: decoy/bonus effects are all self- or enemy-facing.

const DEITY_ID := "MG-DEITY-003"

# ---- Local tuning ----
const DECOY_DURATION := 5.0
const DECOY_HP := 50.0
const BENT_LIGHT_ALWAYS_HITS := true   # light-bent shots ignore cover/dodge
const BENT_LIGHT_BONUS := 0.25         # +25% damage
const DECOY_SYNERGY_BONUS := 0.50      # +50% vs enemies currently attacking the decoy
const ULT_FALSE_SHOTS := 12            # a dozen false suns
const ULT_FALSE_SHOT_DAMAGE := 15.0
const ULT_TRUE_SHOT_BASE := 100.0

var deity: Dictionary = {}
var ability_db: Dictionary = {}
var decoy_active := false
var decoy_hp_left := 0.0

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[ShemrisKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[ShemrisKit] expected 3 abilities from DataLayer")
	print("[ShemrisKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Mirage Double — a false Shemris draws enemy fire.
func mirage_double() -> Dictionary:
	decoy_active = true
	decoy_hp_left = DECOY_HP
	return {"active": true, "hp": DECOY_HP, "duration": DECOY_DURATION}

func decoy_absorb(damage: float) -> Dictionary:
	if not decoy_active: return {"absorbed": false}
	decoy_hp_left -= damage
	if decoy_hp_left <= 0.0:
		decoy_active = false
		decoy_hp_left = 0.0
	return {"absorbed": true, "decoy_destroyed": not decoy_active, "hp_left": decoy_hp_left}

# ---------------------------------------------------------------- active_2
## Bent Light Volley — shots curve; they always land, +25% base,
## +50% more against enemies shooting at the decoy (they aim where she is not).
func bent_light_volley(target_attacking_decoy: bool) -> Dictionary:
	var mult: float = 1.0 + BENT_LIGHT_BONUS
	if target_attacking_decoy:
		mult += DECOY_SYNERGY_BONUS
	return {"always_hits": BENT_LIGHT_ALWAYS_HITS, "damage_mult": mult}

# ---------------------------------------------------------------- ultimate
## Mirage Volley — a dozen false suns, one true volley:
## every false shot converts into bonus damage on the single true hit.
func mirage_volley() -> Dictionary:
	var total := ULT_TRUE_SHOT_BASE + ULT_FALSE_SHOTS * ULT_FALSE_SHOT_DAMAGE
	return {"false_shots": ULT_FALSE_SHOTS, "true_shot_damage": total,
		"always_hits": BENT_LIGHT_ALWAYS_HITS}
