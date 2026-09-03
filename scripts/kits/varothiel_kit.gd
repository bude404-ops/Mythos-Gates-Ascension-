extends Node
## Mythos Gates: Ascension — Varothiel, the Last Beacon (MG-DEITY-021)
## Warrior kit, MG-FACTION-006 (Radiant Vigil). DataLayer-driven (proven template).
## Solo-first: resolve/undying are SELF-only; blind/draw are enemy-facing.

const DEITY_ID := "MG-DEITY-021"
const UNDYING_HOOK := "MG-BUFF-UNDYING"
const SPEED_HOOK := "MG-BUFF-SPEED-SELF"

# ---- Local tuning ----
const FLAREGUARD_RADIUS := 6.0
const FLAREGUARD_BLIND := 1.5            # enemies blinded, seconds
const RESOLVE_ATK_SPEED := 0.40           # +40% attack speed, SELF
const RESOLVE_DURATION := 5.0
const BEACON_UNDYING := 8.0              # the standard holds 8s
const BEACON_DRAW_RADIUS := 14.0         # enemies drawn toward it

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[VarothielKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[VarothielKit] expected 3 abilities from DataLayer")
	print("[VarothielKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Flareguard — raise the lens: block, then a blinding shockwave-ring.
func flareguard(origin: Vector3, enemies: Array) -> Dictionary:
	var blinded: Array = []
	for e in enemies:
		if origin.distance_to(e.position) <= FLAREGUARD_RADIUS:
			e.set_meta("blinded", FLAREGUARD_BLIND)
			blinded.append(e)
	return {"blocked": true, "blinded": blinded}

# ---------------------------------------------------------------- active_2
## Ignited Resolve — your light burns hotter: attack speed, SELF only.
func ignited_resolve() -> Dictionary:
	return {"atk_speed": RESOLVE_ATK_SPEED, "duration": RESOLVE_DURATION,
		"self_buff": true, "speed_hook": SPEED_HOOK}

# ---------------------------------------------------------------- ultimate
## The Final Beacon — plant the light-standard: YOU are undying 8s,
## and enemies are drawn toward it.
func the_final_beacon(origin: Vector3, enemies: Array) -> Dictionary:
	var drawn: Array = []
	for e in enemies:
		if origin.distance_to(e.position) <= BEACON_DRAW_RADIUS:
			e.set_meta("drawn_to", origin)
			drawn.append(e)
	return {"standard": origin, "undying": BEACON_UNDYING,
		"undying_hook": UNDYING_HOOK, "drawn": drawn}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "flareguard",
	"active_2": "ignited_resolve",
	"ultimate": "the_final_beacon",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "enemies"],
	"active_2": [],
	"ultimate": ["player_pos", "enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
