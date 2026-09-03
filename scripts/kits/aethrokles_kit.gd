extends Node
## Mythos Gates: Ascension — Aethrokles, the Sky-Verdict (MG-DEITY-011)
## Caster kit, MG-FACTION-003. DataLayer-driven (proven template).
## Solo-first: exile/DOT/silence are enemy-facing; no ally effects.

const DEITY_ID := "MG-DEITY-011"
const DOT_HOOK := "MG-BUFF-DOT-GROW"
const SILENCE_DEBUFF := "MG-DEBUFF-SILENCE"

# ---- Local tuning ----
const EXILE_DURATION := 5.0          # no ally buff synergies while exiled
const SKYWRIT_DOT_TICK := 8.0        # damage per tick
const SKYWRIT_TICKS := 5             # growing DOT ticks
const SKYWRIT_GROWTH := 1.25         # each tick 25% stronger
const UNCONTESTED_SILENCE := 3.0

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[AethroklesKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[AethroklesKit] expected 3 abilities from DataLayer")
	print("[AethroklesKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Ostracize — exile the target from ally buff synergies: it can receive
## no new buffs while exiled.
func ostracize(target) -> Dictionary:
	if target == null: return {"exiled": false}
	target.set_meta("buff_exiled", true)
	target.set_meta("exile_timer", EXILE_DURATION)
	return {"exiled": true, "duration": EXILE_DURATION}

# ---------------------------------------------------------------- active_2
## Sky-Writ — a lightning mark: growing damage over time.
func sky_writ(target) -> Dictionary:
	if target == null: return {"applied": false}
	target.set_meta("skywrit", true)
	target.set_meta("skywrit_hook", DOT_HOOK)
	return {"applied": true, "hook": DOT_HOOK}

func skywrit_total_damage() -> float:
	var total := 0.0
	var tick := SKYWRIT_DOT_TICK
	for i in SKYWRIT_TICKS:
		total += tick
		tick *= SKYWRIT_GROWTH
	return total

# ---------------------------------------------------------------- ultimate
## The Uncontested Sky — the storm flattens the arena:
## cover destroyed, enemy casting silenced.
func the_uncontested_sky(cover_objects: Array, enemies: Array) -> Dictionary:
	var destroyed: Array = cover_objects.duplicate()
	for e in enemies:
		e.set_meta("silenced", true)
		e.set_meta("silence_timer", UNCONTESTED_SILENCE)
		e.set_meta("silence_hook", SILENCE_DEBUFF)
	return {"cover_destroyed": destroyed.size(),
		"silenced": enemies.size(), "silence_duration": UNCONTESTED_SILENCE}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "ostracize",
	"active_2": "sky_writ",
	"ultimate": "the_uncontested_sky",
}

const SLOT_ARGS := {
	"active_1": ["target"],
	"active_2": ["target"],
	"ultimate": ["enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
