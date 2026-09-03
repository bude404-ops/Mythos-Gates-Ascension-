extends Node
## Mythos Gates: Ascension — Corveth, the Battle-Crow (MG-DEITY-020)
## Assassin kit, MG-FACTION-005 (Silverroot Kindred). DataLayer-driven (proven template).
## Solo-first: untargetability is SELF-only; omen mark is enemy-facing.

const DEITY_ID := "MG-DEITY-020"
const UNTARGETABLE_HOOK := "MG-BUFF-UNTARGETABLE"
const MARK_HOOK := "MG-BUFF-MARK"

# ---- Local tuning ----
const CROWFALL_RANGE := 10.0
const CROWFALL_UNTARGETABLE := 0.8   # untouchable in crow-form during the dive
const OMEN_MIN_BONUS := 0.10          # +10% damage at full health
const OMEN_MAX_BONUS := 0.60          # +60% damage near death
const FATE_EXECUTE := 0.15            # marked targets below 15% HP are executed

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[CorvethKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[CorvethKit] expected 3 abilities from DataLayer")
	print("[CorvethKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Crowfall — leap-strike from above; untouchable in crow-form mid-dive.
func crowfall(from_pos: Vector3, target_pos: Vector3) -> Dictionary:
	var legal := from_pos.distance_to(target_pos) <= CROWFALL_RANGE
	return {"legal": legal, "untargetable": CROWFALL_UNTARGETABLE,
		"untargetable_hook": UNTARGETABLE_HOOK}

# ---------------------------------------------------------------- active_2
## War-Omen — mark the target: it takes more damage the lower its health.
func war_omen(target) -> Dictionary:
	if target == null: return {"marked": false}
	target.set_meta("omenmarked", true)
	target.set_meta("mark_hook", MARK_HOOK)
	return {"marked": true}

## Omen damage multiplier — 1.10 at full health, 1.60 near death.
func omen_multiplier(target_hp_frac: float) -> float:
	var frac := clampf(target_hp_frac, 0.0, 1.0)
	return 1.0 + OMEN_MAX_BONUS - (OMEN_MAX_BONUS - OMEN_MIN_BONUS) * frac

# ---------------------------------------------------------------- ultimate
## The End of the Battle — lands as a flock: all marked enemies take
## their fate-damage immediately.
func the_end_of_the_battle(enemies: Array) -> Dictionary:
	var struck: Array[Dictionary] = []
	for e in enemies:
		if e.get_meta("omenmarked", false):
			var hp_frac: float = e.get_meta("hp_frac", 1.0)
			var executed := hp_frac <= FATE_EXECUTE
			struck.append({"enemy": e, "executed": executed,
				"multiplier": omen_multiplier(hp_frac)})
	return {"struck": struck}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "crowfall",
	"active_2": "war_omen",
	"ultimate": "the_end_of_the_battle",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "target_pos"],
	"active_2": ["target"],
	"ultimate": ["enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
