extends Node
## Mythos Gates: Ascension — Sothiel, the White Ledger (MG-DEITY-023)
## Caster kit, MG-FACTION-006 (Radiant Vigil). DataLayer-driven (proven template).
## Solo-first: all effects are enemy-facing (reflect/beam/invert).

const DEITY_ID := "MG-DEITY-023"
const INVERT_DEBUFF := "MG-DEBUFF-BUFF-INVERT"
const MARK_HOOK := "MG-BUFF-MARK"

# ---- Local tuning ----
const REFRACT_PENALTY := 0.75          # refracted ability hits at 75% strength
const RAY_RANGE := 16.0
const RAY_MARK_BONUS := 0.30           # +30% vs marked targets
# Refraction is registry-gated (Phase 2): simplified to reflect the target's
# last-used ability type back at 75% strength. Fantasy preserved.

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[SothielKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[SothielKit] expected 3 abilities from DataLayer")
	print("[SothielKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Refraction — bend the enemy's last ability back at it (registry-gated,
## simplified reflection; full re-cast unlocks with the Phase 2 ability registry).
func refraction(target) -> Dictionary:
	if target == null: return {"refracted": false}
	var last: String = target.get_meta("last_ability", "")
	if last.is_empty(): return {"refracted": false, "no_ability_seen": true}
	return {"refracted": true, "mirrors": last,
		"strength": REFRACT_PENALTY}

# ---------------------------------------------------------------- active_2
## Annotated Ray — a precision beam; the ledger adds a bonus vs marked.
func annotated_ray(self_pos: Vector3, target) -> Dictionary:
	if target == null: return {"fired": false}
	var dist := self_pos.distance_to(target.position)
	var marked: bool = target.get_meta("lumenmarked", false) \
		or target.get_meta("moonmarked", false)
	return {"fired": dist <= RAY_RANGE, "distance": dist,
		"bonus": RAY_MARK_BONUS if marked else 0.0}

# ---------------------------------------------------------------- ultimate
## The Reversal — every enemy buff inverts into a debuff.
func the_reversal(enemies: Array) -> Dictionary:
	var inverted: Array = []
	for e in enemies:
		if e.has_meta("enemy_buff") and not e.get_meta("enemy_buff", {}).is_empty():
			e.set_meta("enemy_buff", {})
			e.set_meta("inverted_debuff", INVERT_DEBUFF)
			inverted.append(e)
	return {"inverted": inverted}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "refraction",
	"active_2": "annotated_ray",
	"ultimate": "the_reversal",
}

const SLOT_ARGS := {
	"active_1": ["target"],
	"active_2": ["player_pos", "target"],
	"ultimate": ["enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
