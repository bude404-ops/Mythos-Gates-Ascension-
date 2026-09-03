extends Node
## Mythos Gates: Ascension — Tashareth, the Already-There (MG-DEITY-024)
## Assassin kit, MG-FACTION-006 (Radiant Vigil). DataLayer-driven (proven template).
## Solo-first: nodes are hers alone; irradiate is enemy-facing.

const DEITY_ID := "MG-DEITY-024"
const CRIT_HOOK := "MG-BUFF-CRIT-CHAIN"

# ---- Local tuning ----
const MAX_NODES := 3                  # light-nodes placed per fight
const SWAP_BLINK := 40.0              # photon-quick: node swap range
const IRRADIATE_TIME := 3.0           # infusion window
const IRRADIATE_RANGE := 6.0          # strike must come from within
const EVERYWHERE_TIME := 5.0          # simultaneous strikes window

var deity: Dictionary = {}
var ability_db: Dictionary = {}
var nodes: Array[Vector3] = []

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[TasharethKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[TasharethKit] expected 3 abilities from DataLayer")
	print("[TasharethKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Threshold Glow — place a light-node anywhere; swap to it photon-quick.
func place_node(pos: Vector3) -> Dictionary:
	if nodes.size() >= MAX_NODES:
		nodes.pop_front()   # oldest light dims; newest shines
	nodes.append(pos)
	return {"nodes": nodes.size()}

func swap_to_node(from_pos: Vector3) -> Dictionary:
	if nodes.is_empty(): return {"swapped": false}
	var nearest := nodes[0]
	for n in nodes:
		if from_pos.distance_to(n) < from_pos.distance_to(nearest):
			nearest = n
	var legal := from_pos.distance_to(nearest) <= SWAP_BLINK
	return {"swapped": legal, "to": nearest}

# ---------------------------------------------------------------- active_2
## Irradiate — infuse an enemy 3s; your next strike from within is a crit.
func irradiate(target) -> Dictionary:
	if target == null: return {"infused": false}
	target.set_meta("irradiated", IRRADIATE_TIME)
	return {"infused": true, "window": IRRADIATE_TIME}

func strike_from_silence(self_pos: Vector3, target) -> Dictionary:
	var infused: bool = target.get_meta("irradiated", 0.0) > 0.0
	var in_range := self_pos.distance_to(target.position) <= IRRADIATE_RANGE
	return {"guaranteed_crit": infused and in_range, "crit_hook": CRIT_HOOK}

# ---------------------------------------------------------------- ultimate
## Everywhere At Once — 5s: every light-node acts as her.
func everywhere_at_once() -> Dictionary:
	return {"duration": EVERYWHERE_TIME, "active_nodes": nodes.duplicate(),
		"simultaneous": true}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "place_node",
	"active_2": "irradiate",
	"ultimate": "everywhere_at_once",
}

const SLOT_ARGS := {
	"active_1": ["target_pos"],
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
