extends Node
## Mythos Gates: Ascension — Mazka, the Ash Broker (MG-DEITY-027)
## Archer kit, MG-FACTION-007 (Black-Iron Dominion). DataLayer-driven (proven template).
## Solo-first: payment heal is SELF-only; shield-break is enemy-facing.

const DEITY_ID := "MG-DEITY-027"
const HEAL_HOOK := "MG-BUFF-HEAL-SELF"
const SHIELD_HOOK := "MG-BUFF-SHIELD-SELF"
const DEBT_HOOK := "MG-BUFF-DEBT-STACK"

# ---- Local tuning ----
const PAYMENT_HEAL := 0.02           # 2% max HP per landed strike, SELF
const TERMS_SHOTS := 4               # volley size
const SHIELD_TRANSFER := 1.0         # full shield value transfers to you
const TRANSFER_TIME := 5.0           # temporary self-buff window
const CLOSING_MULT := 1.5            # blast = payments x1.5

var deity: Dictionary = {}
var ability_db: Dictionary = {}
var payments_collected := 0.0

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[MazkaKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[MazkaKit] expected 3 abilities from DataLayer")
	print("[MazkaKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Payment Collection — every strike collects a small payment: SELF-heal.
func payment_collection(max_hp: float) -> Dictionary:
	var heal := max_hp * PAYMENT_HEAL
	payments_collected += heal
	return {"heal": heal, "heal_hook": HEAL_HOOK}

# ---------------------------------------------------------------- active_2
## Terms of Trade — a volley that shatters enemy shields and transfers
## their value to you (temporary self-buff).
func terms_of_trade(enemies: Array) -> Dictionary:
	var shots: Array = []
	var transferred := 0.0
	for i in TERMS_SHOTS:
		if i < enemies.size():
			var e = enemies[i]
			var shield: float = e.get_meta("shield_value", 0.0)
			if shield > 0.0:
				e.set_meta("shield_value", 0.0)
				transferred += shield * SHIELD_TRANSFER
				shots.append({"enemy": e, "shattered": true})
			else:
				shots.append({"enemy": e, "shattered": false})
	return {"shots": shots, "transferred": transferred,
		"transfer_time": TRANSFER_TIME, "shield_hook": SHIELD_HOOK}

# ---------------------------------------------------------------- ultimate
## Closing Costs — all payments collected this fight detonate as one blast.
func closing_costs() -> Dictionary:
	var blast := payments_collected * CLOSING_MULT
	return {"blast": blast, "payments": payments_collected}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "payment_collection",
	"active_2": "terms_of_trade",
	"ultimate": "closing_costs",
}

const SLOT_ARGS := {
	"active_1": ["max_hp"],
	"active_2": ["enemies"],
	"ultimate": [],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
