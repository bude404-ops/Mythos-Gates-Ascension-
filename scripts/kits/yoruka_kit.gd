extends Node
## Mythos Gates: Ascension — Yoruka, the Hollow Moon (MG-DEITY-014)
## Archer kit, MG-FACTION-004 (The Thousand Torii). DataLayer-driven (proven template).
## Solo-first: all effects enemy-facing (moonmarks, guaranteed hits); no ally heals/buffs.
## Tap-to-move compatible: volley fires along facing toward the nearest threat.

signal faith_gained(amount: int, reason: String)

const DEITY_ID := "MG-DEITY-014"
const MARK_HOOK := "MG-BUFF-MARK"

# ---- Local tuning (numbers, never lore) ----
const VOLLEY_SHOTS := 3             # Crescent Volley arrows
const VOLLEY_SPREAD := 0.12         # radians between shots
const VOLLEY_PIERCE := true         # moonlight passes through walls AND bodies
const VOLLEY_LEN := 18.0            # effective arrow flight
const MARK_DURATION := 10.0         # Moonmark seconds
const MARK_RANGE_BONUS := 0.25      # +25% damage vs marked beyond 10m
const MARK_NEAR_RANGE := 10.0       # "at range" threshold
const ECLIPSE_DURATION := 8.0       # Total Eclipse seconds
const ECLIPSE_MARK_BONUS := 0.40    # arrows always find the marked: +40% vs marked
const ECLIPSE_VISION := true        # only moonmarks glow in the dark

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[YorukaKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[YorukaKit] expected 3 abilities from DataLayer")
	print("[YorukaKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Crescent Volley — 3 piercing moonlight shots. The Phase Bow's arrows pass
## through walls (spirit-boundary synergy) and through every body they touch.
func crescent_volley(origin: Vector3, forward: Vector2, enemies: Array) -> Dictionary:
	var f := forward.normalized()
	var lines: Array[Dictionary] = []
	for i in VOLLEY_SHOTS:
		var ang := (i - 1) * VOLLEY_SPREAD
		lines.append({"dir": Vector2(f.x * cos(ang) - f.y * sin(ang),
			f.x * sin(ang) + f.y * cos(ang))})
	var hits := {}
	for line in lines:
		var d: Vector2 = line["dir"]
		var right := Vector2(-d.y, d.x)
		for e in enemies:
			var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
			var along := rel.dot(d)
			if along >= 0 and along <= VOLLEY_LEN and absf(rel.dot(right)) <= 0.9:
				hits[e] = {"enemy": e, "pierce": VOLLEY_PIERCE, "along": along}
	return {"shots": VOLLEY_SHOTS, "walls_ignored": VOLLEY_PIERCE,
		"length": VOLLEY_LEN, "hits": hits.values()}

# ---------------------------------------------------------------- active_2
## Moonmark — the unblinking moon marks a target: visible through walls,
## and Yoruka's arrows bite harder at range.
func moonmark(origin: Vector3, target) -> Dictionary:
	if target == null or not is_instance_valid(target):
		return {"marked": false}
	target.set_meta("moonmarked", true)
	target.set_meta("moonmark_timer", MARK_DURATION)
	target.set_meta("moonmark_hook", MARK_HOOK)
	var d := Vector3(origin.x, 0, origin.z).distance_to(
		Vector3(target.position.x, 0, target.position.z))
	var at_range := d >= MARK_NEAR_RANGE
	return {"marked": true, "seen_through_walls": true, "at_range": at_range,
		"range_bonus": MARK_RANGE_BONUS if at_range else 0.0}

# ---------------------------------------------------------------- ultimate
## Total Eclipse — the field darkens; only moonmarks glow. His arrows always
## find them: every attack against a moonmarked enemy is a guaranteed hit.
func total_eclipse(enemies: Array) -> Dictionary:
	var marked: Array[Dictionary] = []
	for e in enemies:
		if e.get_meta("moonmarked", false):
			marked.append({"enemy": e, "guaranteed_hit": true,
				"dmg_bonus": ECLIPSE_MARK_BONUS})
	return {"duration": ECLIPSE_DURATION, "darkness": true,
		"only_marks_glow": ECLIPSE_VISION, "marked": marked}
