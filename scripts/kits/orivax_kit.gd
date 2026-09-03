extends Node
## Mythos Gates: Ascension — Orivax, the First Debtor (MG-DEITY-026)
## Caster kit, MG-FACTION-007 (Black-Iron Dominion). DataLayer-driven (proven template).
## Solo-first: refinanced debuffs are his own; interest/growth are enemy-facing.

const DEITY_ID := "MG-DEITY-026"
const DOT_GROW_HOOK := "MG-BUFF-DOT-GROW"
const DEBT_HOOK := "MG-BUFF-DEBT-STACK"

# ---- Local tuning ----
const DEBTFIRE_BASE := 40.0         # damage per tick
const DEBTFIRE_INTEREST := 0.20      # +20% per tick — interest compounds
const DEBTFIRE_TICKS := 4
const LOAN_POWER := 1.80             # 8s of overwhelming power (1.8x)
const LOAN_DURATION := 8.0
const LOAN_REPAYMENT := 0.20          # 20% of damage dealt comes due after

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[OrivaxKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[OrivaxKit] expected 3 abilities from DataLayer")
	print("[OrivaxKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Debtfire — damage that grows over time. Interest.
func debtfire(target) -> Dictionary:
	if target == null: return {"burning": false}
	target.set_meta("debt_dot", DEBTFIRE_BASE)
	target.set_meta("dot_grow_hook", DOT_GROW_HOOK)
	target.set_meta("debt_hook", DEBT_HOOK)
	return {"burning": true, "base": DEBTFIRE_BASE, "interest": DEBTFIRE_INTEREST}

func debtfire_tick(current: float) -> float:
	return current * (1.0 + DEBTFIRE_INTEREST)

func debtfire_total() -> float:
	var dmg := DEBTFIRE_BASE
	var total := 0.0
	for i in DEBTFIRE_TICKS:
		dmg = debtfire_tick(dmg)
		total += dmg
	return total

# ---------------------------------------------------------------- active_2
## Refinance — restructure YOUR OWN debuffs into one delayed burst.
func refinance(active_debuffs: Array) -> Dictionary:
	var burst: float = active_debuffs.size() * DEBTFIRE_BASE
	return {"consolidated": active_debuffs.size(), "delayed_burst": burst,
		"self_only": true}

# ---------------------------------------------------------------- ultimate
## The Original Loan — 8s of overwhelming power; a fraction of damage
## dealt comes due after. The temptation ult.
func the_original_loan() -> Dictionary:
	return {"power": LOAN_POWER, "duration": LOAN_DURATION,
		"repayment_frac": LOAN_REPAYMENT, "temptation": true}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "debtfire",
	"active_2": "refinance",
	"ultimate": "the_original_loan",
}

const SLOT_ARGS := {
	"active_1": ["target"],
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
