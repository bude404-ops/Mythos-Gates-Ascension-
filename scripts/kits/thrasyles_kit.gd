extends Node
## Mythos Gates: Ascension — Thrasyles, the Contest-Fury (MG-DEITY-009)
## Warrior kit, MG-FACTION-003. DataLayer-driven (proven template).
## Solo-first: Flourish is SELF-buff; duel marks are enemy-facing.

const DEITY_ID := "MG-DEITY-009"
const CRIT_HOOK := "MG-BUFF-CRIT-CHAIN"
const UNDYING_HOOK := "MG-BUFF-UNDYING"

# ---- Local tuning ----
const CLAIM_DMG_UP := 0.25           # claimed enemy takes +25% from Thrasyles
const CLAIM_OTHERS_DOWN := 0.25      # all NON-claimed enemies deal -25% to him
const FLOURISH_CRIT_WINDOW := 3.0    # guaranteed crit seconds
const DUEL_RADIUS := 6.0             # the duel-circle
const VERDICT_BONUS := 1.00          # +100% vs claimed inside the circle

var deity: Dictionary = {}
var ability_db: Dictionary = {}
var claimed: WeakRef = null

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[ThrasylesKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[ThrasylesKit] expected 3 abilities from DataLayer")
	print("[ThrasylesKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Duelist's Claim — challenge one enemy: the claimed takes +25% from him,
## every OTHER enemy deals -25% to him while the claim holds.
func duelists_claim(target, center: Vector3) -> Dictionary:
	claimed = weakref(target)
	target.set_meta("claimed", true)
	return {"claimed": target, "dmg_taken_mult": 1.0 + CLAIM_DMG_UP,
		"others_deal_mult": 1.0 - CLAIM_OTHERS_DOWN, "circle_center": center}

func claim_multiplier(attacker, target) -> float:
	var t = claimed.get_ref() if claimed else null
	if t != null and target == t: return 1.0 + CLAIM_DMG_UP
	return 1.0

# ---------------------------------------------------------------- active_2
## Flourish — SELF-buff: a guaranteed-crit window.
func flourish() -> Dictionary:
	return {"guaranteed_crit": true, "duration": FLOURISH_CRIT_WINDOW,
		"self_buff": true, "hook": CRIT_HOOK}

# ---------------------------------------------------------------- ultimate
## Champion's Verdict — inside his duel-circle he cannot lose:
## undying within the circle + massive bonus vs the claimed enemy.
func champions_verdict(self_pos: Vector3, circle_center: Vector3) -> Dictionary:
	var in_circle := Vector3(self_pos.x, 0, self_pos.z).distance_to(
		Vector3(circle_center.x, 0, circle_center.z)) <= DUEL_RADIUS
	var t = claimed.get_ref() if claimed else null
	return {"in_circle": in_circle, "undying": in_circle,
		"hook": UNDYING_HOOK, "claimed_bonus": VERDICT_BONUS,
		"has_claim": t != null, "radius": DUEL_RADIUS}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "duelists_claim",
	"active_2": "flourish",
	"ultimate": "champions_verdict",
}

const SLOT_ARGS := {
	"active_1": ["target", "target_pos"],
	"active_2": [],
	"ultimate": ["player_pos", "target_pos"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
