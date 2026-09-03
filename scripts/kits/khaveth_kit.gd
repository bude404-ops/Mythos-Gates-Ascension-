extends Node
## Mythos Gates: Ascension — Khaveth, the Measured Light (MG-DEITY-001)
## PROOF-OF-CONCEPT playable kit. First kit built 100% DataLayer-driven:
## every name, epithet, weapon, and mechanic string is read from res://data at runtime.
## Solo-first compliant: zero ally heals/buffs. All effects are enemy-facing (marks/verdicts).
## Tap-to-move compatible: no aiming required — abilities auto-face nearest unworthy enemy.

signal faith_gained(amount: int, reason: String)
signal verdict_passed(enemy_name: String)

const DEITY_ID := "MG-DEITY-001"
const MARK_BUFF := "MG-BUFF-MARK"

# ---- Local tuning (numbers, never lore) ----
const MARK_DMG_PER_STACK := 0.12      # +12% damage per Tallied stack
const MARK_MAX_STACKS := 5
const MARK_DURATION := 8.0
const BEAM_LENGTH := 12.0             # Noon Sentence reach
const BEAM_HALF_WIDTH := 1.2          # half-width of the verdict line
const BEAM_MARK_CONSUME := 2          # stacks burned into Brand damage
const BRAND_DMG_MULT := 1.5           # vs marked targets on beam hit
const ULT_RANGE := 18.0
const ULT_EXECUTE_PCT := 0.15          # condemned enemies below 15% HP are judged
const ULT_MARK_STACKS := 3

var deity: Dictionary = {}
var ability_db: Dictionary = {}        # slot -> ability record from DataLayer

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[KhavethKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[KhavethKit] expected 3 abilities from DataLayer")
	print("[KhavethKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Weigh the Deed — apply/stack the Tallied mark (MG-BUFF-MARK) on target.
func weigh_the_deed(target) -> int:
	if target == null or not is_instance_valid(target):
		return 0
	var stacks := int(target.get_meta("tallied_stacks", 0))
	stacks = mini(stacks + 1, MARK_MAX_STACKS)
	target.set_meta("tallied_stacks", stacks)
	target.set_meta("tallied_timer", MARK_DURATION)
	return stacks

## Damage multiplier against a Tallied target (read by the combat loop).
func mark_multiplier(target) -> float:
	if target == null: return 1.0
	var stacks := int(target.get_meta("tallied_stacks", 0))
	return 1.0 + stacks * MARK_DMG_PER_STACK

# ---------------------------------------------------------------- active_2
## Noon Sentence — verdict beam: line AOE in facing direction.
## Enemies inside the rectangle take BRAND_DMG_MULT if marked, consume BEAM_MARK_CONSUME stacks.
func noon_sentence(origin: Vector3, forward: Vector2, enemies: Array) -> Dictionary:
	var hits: Array[Dictionary] = []
	var f := forward.normalized()
	var right := Vector2(-f.y, f.x) * BEAM_HALF_WIDTH
	for e in enemies:
		var rel := Vector2(e.position.x - origin.x, e.position.z - origin.z)
		var along := rel.dot(f)
		var across := absf(rel.dot(right.normalized()))
		if along >= 0.0 and along <= BEAM_LENGTH and across <= BEAM_HALF_WIDTH:
			var stacks := int(e.get_meta("tallied_stacks", 0))
			var dmg_mult: float = BRAND_DMG_MULT if stacks > 0 else 1.0
			if stacks > 0:
				e.set_meta("tallied_stacks", maxf(stacks - BEAM_MARK_CONSUME, 0))
			hits.append({"enemy": e, "mult": dmg_mult})
	return {"length": BEAM_LENGTH, "half_width": BEAM_HALF_WIDTH, "hits": hits}

# ---------------------------------------------------------------- ultimate
## Meridian Judgement — pillar of noonlight condemns the strongest unworthy enemy.
## "Unworthy" = closest enemy within ULT_RANGE (tap-to-move: no manual selection).
## Condemned: ULT_MARK_STACKS applied; if HP <= ULT_EXECUTE_PCT, verdict executes.
func meridian_judgement(origin: Vector3, enemies: Array) -> Dictionary:
	var best: Node3D = null
	var best_dmg := -1.0
	for e in enemies:
		var d := origin.distance_to(e.position)
		if d <= ULT_RANGE:
			var threat: float = float(e.get_meta("threat", 1.0))
			if threat > best_dmg:
				best_dmg = threat; best = e
	if best == null:
		return {"condemned": null}
	var stacks := int(best.get_meta("tallied_stacks", 0))
	best.set_meta("tallied_stacks", mini(stacks + ULT_MARK_STACKS, MARK_MAX_STACKS))
	best.set_meta("condemned", true)
	var hp_frac := float(best.get_meta("hp", 1.0)) / maxf(float(best.get_meta("hp_max", 1.0)), 1.0)
	var execute := hp_frac <= ULT_EXECUTE_PCT
	if execute:
		verdict_passed.emit(str(best.get_meta("enemy_name", "enemy")))
		faith_gained.emit(5, "verdict passed openly")
	return {"condemned": best, "executed": execute}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "weigh_the_deed",
	"active_2": "noon_sentence",
	"ultimate": "meridian_judgement",
}

const SLOT_ARGS := {
	"active_1": ["target"],
	"active_2": ["player_pos", "facing", "enemies"],
	"ultimate": ["player_pos", "enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
