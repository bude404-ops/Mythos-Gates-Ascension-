extends Node
## Mythos Gates: Ascension — Halmarr, the Thundermark (MG-DEITY-005)
## Warrior kit, Stormmoot. DataLayer-driven (proven F001 template).
## Solo-first: Oathguard is SELF-buff; snare is enemy-facing.

const DEITY_ID := "MG-DEITY-005"
const SNARE_DEBUFF := "MG-DEBUFF-SNARE"
const SHIELD_HOOK := "MG-BUFF-SHIELD-SELF"

# ---- Local tuning ----
const THUNDERSTEP_LEAP := 7.0        # leap distance
const SHOCKWAVE_RADIUS := 3.5       # shockwave AOE at landing
const SHOCKWAVE_SNARE := 1.0        # seconds snared
const OATHGUARD_REDUCTION := 0.40   # 40% damage reduction while stance holds
const OATHGUARD_TAUNT := true
const OATHGUARD_DURATION := 5.0
const VERDICT_SNARE := 1.5

var deity: Dictionary = {}
var ability_db: Dictionary = {}
var oathguard_active := false
var oathguard_timer := 0.0

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[HalmarrKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[HalmarrKit] expected 3 abilities from DataLayer")
	print("[HalmarrKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Thunderstep — leap and land: shockwave snares everything near the impact.
func thunderstep(origin: Vector3, forward: Vector2, enemies: Array) -> Dictionary:
	var f := forward.normalized()
	var landing := origin + Vector3(f.x * THUNDERSTEP_LEAP, 0, f.y * THUNDERSTEP_LEAP)
	var hits: Array[Dictionary] = []
	for e in enemies:
		if Vector3(e.position.x, 0, e.position.z).distance_to(
				Vector3(landing.x, 0, landing.z)) <= SHOCKWAVE_RADIUS:
			e.set_meta("snared", true)
			e.set_meta("snare_timer", SHOCKWAVE_SNARE)
			e.set_meta("snare_hook", SNARE_DEBUFF)
			hits.append({"enemy": e})
	return {"landing": landing, "shockwave_radius": SHOCKWAVE_RADIUS, "hits": hits}

# ---------------------------------------------------------------- active_2
## Oathguard — SELF-buff stance: 40% damage reduction + taunt while it holds.
func oathguard() -> Dictionary:
	oathguard_active = true
	oathguard_timer = OATHGUARD_DURATION
	return {"damage_reduction": OATHGUARD_REDUCTION, "taunt": OATHGUARD_TAUNT,
		"duration": OATHGUARD_DURATION, "self_buff": true, "hook": SHIELD_HOOK}

func oathguard_tick(delta: float) -> void:
	if oathguard_active:
		oathguard_timer -= delta
		if oathguard_timer <= 0.0:
			oathguard_active = false

# ---------------------------------------------------------------- ultimate
## Verdict of the Sky — one sky-splitting strike on the BIGGEST enemy on the field.
func verdict_of_the_sky(enemies: Array) -> Dictionary:
	if enemies.is_empty(): return {"condemned": null}
	var biggest = null
	for e in enemies:
		if biggest == null or e.hp_max > biggest.hp_max:
			biggest = e
	biggest.set_meta("snared", true)
	biggest.set_meta("snare_timer", VERDICT_SNARE)
	biggest.set_meta("snare_hook", SNARE_DEBUFF)
	return {"condemned": biggest, "snare": VERDICT_SNARE}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "thunderstep",
	"active_2": "oathguard",
	"ultimate": "verdict_of_the_sky",
}

const SLOT_ARGS := {
	"active_1": ["player_pos", "facing", "enemies"],
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
