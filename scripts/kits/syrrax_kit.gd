extends Node
## Mythos Gates: Ascension — Syrrax, the Unsigned (MG-DEITY-028)
## Assassin kit, MG-FACTION-007 (Black-Iron Dominion). DataLayer-driven (proven template).
## Solo-first: amnesty is SELF-only; default bonus is enemy-facing.

const DEITY_ID := "MG-DEITY-028"
const IFRAME_HOOK := "MG-BUFF-I-FRAME"
const UNTARGETABLE_HOOK := "MG-BUFF-UNTARGETABLE"
const CRIT_HOOK := "MG-BUFF-CRIT-CHAIN"
const DEBT_HOOK := "MG-BUFF-DEBT-STACK"

# ---- Local tuning ----
const LOOPHOLE_RANGE := 10.0
const LOOPHOLE_IFRAMES := 0.4
const DEFAULT_BONUS := 0.50          # +50% vs marked / debt-stacked enemies
const AMNESTY_UNTARGETABLE := 1.0    # brief untargetable

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[SyrraxKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[SyrraxKit] expected 3 abilities from DataLayer")
	print("[SyrraxKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Loophole — an untouchable blink THROUGH enemies.
func loophole(from_pos: Vector3, to_pos: Vector3) -> Dictionary:
	var legal := from_pos.distance_to(to_pos) <= LOOPHOLE_RANGE
	return {"blink": legal, "iframes": LOOPHOLE_IFRAMES,
		"iframe_hook": IFRAME_HOOK, "phases_through": true}

# ---------------------------------------------------------------- active_2
## Default — bonus damage against marked or debt-stacked enemies.
func strike(target) -> Dictionary:
	if target == null: return {"bonus": 0.0}
	var eligible: bool = target.get_meta("writmarked", false) \
		or target.get_meta("debt_dot", 0.0) > 0.0
	return {"bonus": DEFAULT_BONUS if eligible else 0.0, "debt_hook": DEBT_HOOK}

# ---------------------------------------------------------------- ultimate
## Amnesty — the contract dissolves: erase YOUR marks/debuffs, briefly
## untargetable, and your next strike is a guaranteed crit.
func amnesty(active_self_debuffs: Array) -> Dictionary:
	return {"erased": active_self_debuffs.size(),
		"untargetable": AMNESTY_UNTARGETABLE,
		"untargetable_hook": UNTARGETABLE_HOOK,
		"next_strike_crit": true, "crit_hook": CRIT_HOOK}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "loophole",
	"active_2": "strike",
	"ultimate": "amnesty",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "target_pos"],
	"active_2": ["target"],
	"ultimate": [],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
