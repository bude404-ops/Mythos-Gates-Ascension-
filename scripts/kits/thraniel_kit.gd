extends Node
## Mythos Gates: Ascension — Thraniel, the Far Lumen (MG-DEITY-022)
## Archer kit, MG-FACTION-006 (Radiant Vigil). DataLayer-driven (proven template).
## Solo-first: verdict targets enemies; SELF has no friendly-fire buffers.

const DEITY_ID := "MG-DEITY-022"
const MARK_HOOK := "MG-BUFF-MARK"
const GLOW_HOOK := "MG-BUFF-GLOW-RADIUS"

# ---- Local tuning ----
const GLINT_RANGE := 30.0             # long-range glint
const PRISM_SHOTS := 5                # one arrow splits into a spectrum
const PRISM_ELEMENTS := ["sun", "glint", "wane", "ember", "lumen"]
const VERDICT_BONUS := 0.50           # +50% vs the named strongest

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[ThranielKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[ThranielKit] expected 3 abilities from DataLayer")
	print("[ThranielKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Far Glint — a long-range mark that glows through walls.
func far_glint(target, self_pos: Vector3) -> Dictionary:
	if target == null: return {"marked": false}
	var dist := self_pos.distance_to(target.position)
	if dist > GLINT_RANGE: return {"marked": false, "out_of_range": true}
	target.set_meta("lumenmarked", true)
	target.set_meta("mark_hook", MARK_HOOK)
	target.set_meta("glow_hook", GLOW_HOOK)
	return {"marked": true, "distance": dist}

# ---------------------------------------------------------------- active_2
## Prismatic Volley — one arrow splits into a spectrum of typed shots.
func prismatic_volley() -> Dictionary:
	return {"shots": PRISM_ELEMENTS.duplicate(), "count": PRISM_SHOTS}

# ---------------------------------------------------------------- ultimate
## Sunrise Verdict — names the strongest enemy; light converges from every
## angle. Cannot outrun dawn.
func sunrise_verdict(enemies: Array) -> Dictionary:
	if enemies.is_empty(): return {"named": null}
	var strongest = enemies[0]
	for e in enemies:
		if e.get_meta("threat", 0.0) > strongest.get_meta("threat", 0.0):
			strongest = e
	return {"named": strongest, "bonus": VERDICT_BONUS,
		"guaranteed_hit": true, "no_escape": true}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "far_glint",
	"active_2": "prismatic_volley",
	"ultimate": "sunrise_verdict",
}

const SLOT_ARGS := {
	"active_1": ["target", "player_pos"],
	"active_2": [],
	"ultimate": ["enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
