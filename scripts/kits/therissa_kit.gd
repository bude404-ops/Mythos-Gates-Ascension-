extends Node
## Mythos Gates: Ascension — Therissa, the Silent Laurel (MG-DEITY-010)
## Archer kit, MG-FACTION-003. DataLayer-driven (proven template).
## Solo-first: speed stacks are SELF-only; snare is enemy-facing.

const DEITY_ID := "MG-DEITY-010"
const SNARE_DEBUFF := "MG-DEBUFF-SNARE"
const SPEED_HOOK := "MG-BUFF-SPEED-SELF"

# ---- Local tuning ----
const LAUREL_SNARE_TIME := 2.0
const PACE_PER_STACK := 0.10        # +10% move speed per hit
const PACE_MAX_STACKS := 3
const PACE_DURATION := 5.0
const WITNESS_SHOT_DMG := 300.0
const WITNESS_FAITH_SURGE := 10.0   # faith restored on a killing shot

var deity: Dictionary = {}
var ability_db: Dictionary = {}
var pace_stacks := 0

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[TherissaKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[TherissaKit] expected 3 abilities from DataLayer")
	print("[TherissaKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Laurel Snare — the arrow plants a binding laurel-root.
func laurel_snare(target) -> Dictionary:
	if target == null: return {"snared": false}
	target.set_meta("snared", true)
	target.set_meta("snare_timer", LAUREL_SNARE_TIME)
	target.set_meta("snare_hook", SNARE_DEBUFF)
	return {"snared": true, "duration": LAUREL_SNARE_TIME}

# ---------------------------------------------------------------- active_2
## Hunter's Pace — self speed stacks, one per landed hit.
func hunters_pace_hit() -> int:
	pace_stacks = mini(pace_stacks + 1, PACE_MAX_STACKS)
	return pace_stacks

func pace_multiplier() -> float:
	return 1.0 + pace_stacks * PACE_PER_STACK

# ---------------------------------------------------------------- ultimate
## The Witness Shot — one perfect arrow; a kill restores Faith to you.
func the_witness_shot(target, current_hp: float) -> Dictionary:
	if target == null: return {"fired": false}
	var kills: bool = current_hp <= WITNESS_SHOT_DMG
	return {"fired": true, "damage": WITNESS_SHOT_DMG, "always_hits": true,
		"kill": kills, "faith_restored": WITNESS_FAITH_SURGE if kills else 0.0}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "laurel_snare",
	"active_2": "hunters_pace_hit",
	"ultimate": "the_witness_shot",
}

const SLOT_ARGS := {
	"active_1": ["target"],
	"active_2": [],
	"ultimate": ["target"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
