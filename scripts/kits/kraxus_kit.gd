extends Node
## Mythos Gates: Ascension — Kraxus, the Binder King (MG-DEITY-025)
## Warrior kit, MG-FACTION-007 (Black-Iron Dominion). DataLayer-driven (proven template).
## Solo-first: debt stacks and pulls are enemy-facing only.

const DEITY_ID := "MG-DEITY-025"
const DEBT_HOOK := "MG-BUFF-DEBT-STACK"
const MARK_HOOK := "MG-BUFF-MARK"

# ---- Local tuning ----
const WRIT_TICK := 0.05             # +5% damage per second the mark holds
const WRIT_MAX := 0.60              # compounded debt caps at +60%
const WRIT_DURATION := 12.0
const CHAINSTROKE_RANGE := 12.0
const COLLECTION_MELT := 0.40       # -40% defense on collection

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[KraxusKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[KraxusKit] expected 3 abilities from DataLayer")
	print("[KraxusKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Writ of War — the mark holds: damage compounds the longer it stands.
func writ_of_war(target) -> Dictionary:
	if target == null: return {"marked": false}
	target.set_meta("writmarked", true)
	target.set_meta("mark_hook", MARK_HOOK)
	target.set_meta("debt_hook", DEBT_HOOK)
	target.set_meta("debt_seconds", 0.0)
	return {"marked": true, "tick": WRIT_TICK, "max": WRIT_MAX,
		"duration": WRIT_DURATION}

func writ_multiplier(seconds_held: float) -> float:
	return minf(1.0 + seconds_held * WRIT_TICK, 1.0 + WRIT_MAX)

# ---------------------------------------------------------------- active_2
## Chainstroke — the Flesh Charter's chain drags an enemy to him.
func chainstroke(self_pos: Vector3, target) -> Dictionary:
	if target == null: return {"pulled": false}
	var dist := self_pos.distance_to(target.position)
	return {"pulled": dist <= CHAINSTROKE_RANGE, "distance": dist,
		"to": self_pos}

# ---------------------------------------------------------------- ultimate
## Involuntary Collection — all marked enemies dragged in;
## accumulated debt executes at once.
func involuntary_collection(self_pos: Vector3, enemies: Array) -> Dictionary:
	var collected: Array[Dictionary] = []
	for e in enemies:
		if e.get_meta("writmarked", false):
			e.set_meta("drawn_to", self_pos)
			e.set_meta("melt", COLLECTION_MELT)
			var held: float = e.get_meta("debt_seconds", 0.0)
			collected.append({"enemy": e, "debt_multiplier": writ_multiplier(held)})
	return {"collected": collected}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "writ_of_war",
	"active_2": "chainstroke",
	"ultimate": "involuntary_collection",
}

const SLOT_ARGS := {
	"active_1": ["target"],
	"active_2": ["player_pos", "target"],
	"ultimate": ["player_pos", "enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
