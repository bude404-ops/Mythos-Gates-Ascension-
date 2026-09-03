extends Node
## Mythos Gates: Ascension — Thuveka, the Silent Wing (MG-DEITY-032)
## Assassin kit, MG-FACTION-008 (Deepgreen). DataLayer-driven (proven template).
## Solo-first: stealth is SELF-only; reveal is enemy-facing.

const DEITY_ID := "MG-DEITY-032"
const UNTARGETABLE_HOOK := "MG-BUFF-UNTARGETABLE"
const CRIT_HOOK := "MG-BUFF-CRIT-CHAIN"
const GLOW_HOOK := "MG-BUFF-GLOW-RADIUS"

# ---- Local tuning ----
const FEATHERFALL_RANGE := 9.0
const FEATHERFALL_UNCUE := true      # no warning cue — the forest falls silent
const HUNT_TIME := 5.0               # completely undetectable
const HUNT_CRIT := true              # every strike from the silence crits

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[ThuvekaKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[ThuvekaKit] expected 3 abilities from DataLayer")
	print("[ThuvekaKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Featherfall — a glide-strike from above with no warning cue.
func featherfall(from_pos: Vector3, target_pos: Vector3) -> Dictionary:
	var legal := from_pos.distance_to(target_pos) <= FEATHERFALL_RANGE
	return {"legal": legal, "no_warning_cue": FEATHERFALL_UNCUE}

# ---------------------------------------------------------------- active_2
## Night-Eye — see marked enemies through terrain; reveal Hollow
## disguised as terrain.
func night_eye(enemies: Array) -> Dictionary:
	var revealed: Array = []
	for e in enemies:
		if e.get_meta("hollow_disguise", false) or e.get_meta("lumenmarked", false) \
			or e.get_meta("moonmarked", false):
			e.set_meta("revealed", true)
			e.set_meta("glow_hook", GLOW_HOOK)
			revealed.append(e)
	return {"revealed": revealed}

# ---------------------------------------------------------------- ultimate
## The Quiet Hunt — 5s completely undetectable; every strike from the
## silence is a critical.
func the_quiet_hunt() -> Dictionary:
	return {"undetectable": HUNT_TIME,
		"untargetable_hook": UNTARGETABLE_HOOK,
		"every_strike_crits": HUNT_CRIT, "crit_hook": CRIT_HOOK}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "featherfall",
	"active_2": "night_eye",
	"ultimate": "the_quiet_hunt",
}

const SLOT_ARGS := {
	"active_1": ["target_pos"],
	"active_2": ["enemies"],
	"ultimate": [],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
