extends Node
## Mythos Gates: Ascension — Caelvarin, the Every-Handed (MG-DEITY-018)
## Archer kit, MG-FACTION-005 (Silverroot Kindred). DataLayer-driven (proven template).
## Solo-first: crit buff is SELF-only; element effects are enemy-facing.

const DEITY_ID := "MG-DEITY-018"
const CRIT_HOOK := "MG-BUFF-CRIT-CHAIN"
const SLOW_DEBUFF := "MG-DEBUFF-SLOW"
const SNARE_DEBUFF := "MG-DEBUFF-SNARE"

# ---- Local tuning ----
const ELEMENTS := ["fire", "frost", "shock"]   # Tradeshot craft-swap order
const ELEMENT_EFFECT := {"fire": "burn_dot", "frost": "slow", "shock": "stagger"}
const FOOTWORK_DASH := 7.0
const FOOTWORK_CRIT_TIME := 3.0                 # next shot within 3s crits
const MOMENT_DURATION := 6.0                     # Master of the Moment window

var deity: Dictionary = {}
var ability_db: Dictionary = {}
var craft_stack := 0
var next_shot_crits := false

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
## Tradeshot — each cast swaps your next arrow's element: fire/frost/shock.
func tradeshot() -> Dictionary:
	var element: String = ELEMENTS[craft_stack % ELEMENTS.size()]
	craft_stack += 1
	return {"element": element, "effect": ELEMENT_EFFECT[element]}

# ---------------------------------------------------------------- active_2
## Footwork — dash; the next shot fired within the window crits.
func footwork(from_pos: Vector3, to_pos: Vector3) -> Dictionary:
	var legal := from_pos.distance_to(to_pos) <= FOOTWORK_DASH
	if legal:
		next_shot_crits = true
	return {"dash": legal, "crit_window": FOOTWORK_CRIT_TIME if legal else 0.0,
		"crit_hook": CRIT_HOOK}

# ---------------------------------------------------------------- ultimate
## Master of the Moment — 6s: every skill he owns fires in sequence, at once.
func master_of_the_moment() -> Dictionary:
	return {"duration": MOMENT_DURATION, "sequence": ["tradeshot", "footwork", "volley"],
		"all_at_once": true}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "tradeshot",
	"active_2": "footwork",
	"ultimate": "master_of_the_moment",
}

const SLOT_ARGS := {
	"active_1": [],
	"active_2": [],
	"ultimate": [],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
