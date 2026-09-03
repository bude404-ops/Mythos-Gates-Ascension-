extends Node
## Mythos Gates: Ascension — Arashido, the Threshold Storm (MG-DEITY-013)
## Warrior kit, MG-FACTION-004 (Thousand Torii). DataLayer-driven (proven template).
## Solo-first: speed is SELF-only; slow/snare are enemy-facing debuffs.

const DEITY_ID := "MG-DEITY-013"
const SLOW_DEBUFF := "MG-DEBUFF-SLOW"
const SNARE_DEBUFF := "MG-DEBUFF-SNARE"
const SPEED_HOOK := "MG-BUFF-SPEED-SELF"

# ---- Local tuning (numbers, never lore) ----
const DASH_LENGTH := 9.0             # Gale Step reach — a crossing, not a crawl
const DASH_HALF_WIDTH := 1.6         # half-width of the storm corridor
const DASH_SLOW := 0.30              # -30% move on enemies crossed
const DASH_SLOW_TIME := 2.5
const CROSS_SPEED := 0.35            # +35% self speed after crossing a threshold
const CROSS_SPEED_TIME := 3.0
const SWEEP_RADIUS := 5.0            # Tempest Sweep radius
const SWEEP_KNOCKBACK := 6.0         # knockback distance
const STORM_TORII_SPACING := 3.0     # storm-torii march spacing
const STORM_WIDTH := 10.0            # storm-front half-width (perpendicular)
const STORM_SNARE_TIME := 2.0        # caught between torii = rooted

var deity: Dictionary = {}
var ability_db: Dictionary = {}       # slot -> ability record from DataLayer

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[ArashidoKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[ArashidoKit] expected 3 abilities from DataLayer")
	print("[ArashidoKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Gale Step — dash through the storm corridor; enemies crossed are slowed,
## and Arashido gains brief self speed for crossing the threshold.
func gale_step(origin: Vector3, forward: Vector2, enemies: Array) -> Dictionary:
	var f := forward.normalized()
	var right := Vector2(-f.y, f.x) * DASH_HALF_WIDTH
	var hits: Array[Dictionary] = []
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var along := rel.dot(f)
		var across := absf(rel.dot(right.normalized()))
		if along >= 0.0 and along <= DASH_LENGTH and across <= DASH_HALF_WIDTH:
			e.set_meta("slow_mult", 1.0 - DASH_SLOW)
			e.set_meta("slow_timer", DASH_SLOW_TIME)
			e.set_meta("slow_hook", SLOW_DEBUFF)
			hits.append({"enemy": e, "slow": DASH_SLOW})
	return {"length": DASH_LENGTH, "half_width": DASH_HALF_WIDTH,
		"hits": hits, "self_speed": CROSS_SPEED, "self_speed_time": CROSS_SPEED_TIME,
		"speed_hook": SPEED_HOOK}

# ---------------------------------------------------------------- active_2
## Tempest Sweep — the naginata whirls; AOE knockback around Arashido.
func tempest_sweep(origin: Vector3, enemies: Array) -> Array:
	var hits: Array[Dictionary] = []
	for e in enemies:
		var d := origin.distance_to(e.position)
		if d <= SWEEP_RADIUS:
			var dir: Vector3 = (e.position - origin).normalized()
			hits.append({"enemy": e, "knockback": dir * SWEEP_KNOCKBACK,
				"distance": d})
	return hits

# ---------------------------------------------------------------- ultimate
## The Storm Crosses — a line of storm-torii marches across the field;
## enemies caught between the torii are struck and rooted.
func the_storm_crosses(storm_origin: Vector3, march_dir: Vector2, enemies: Array) -> Dictionary:
	var f := march_dir.normalized()
	var right := Vector2(-f.y, f.x)
	var hits: Array[Dictionary] = []
	for e in enemies:
		var rel := Vector2(e.position.x - storm_origin.x, e.position.z - storm_origin.z)
		var across := absf(rel.dot(right))
		if across <= STORM_WIDTH:
			e.set_meta("snared", true)
			e.set_meta("snare_timer", STORM_SNARE_TIME)
			e.set_meta("snare_hook", SNARE_DEBUFF)
			hits.append({"enemy": e, "struck": true, "snared": true})
	return {"torii_spacing": STORM_TORII_SPACING, "width": STORM_WIDTH,
		"hits": hits}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "gale_step",
	"active_2": "tempest_sweep",
	"ultimate": "the_storm_crosses",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "facing", "enemies"],
	"active_2": ["player_pos", "enemies"],
	"ultimate": ["player_pos", "facing", "enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
