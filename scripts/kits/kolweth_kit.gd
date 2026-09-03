extends Node
## Mythos Gates: Ascension — Kolweth, the Gray Veil (MG-DEITY-030)
## Caster kit, MG-FACTION-008 (Deepgreen). DataLayer-driven (proven template).
## Solo-first: mirage is a decoy of self; blindness is enemy-facing.

const DEITY_ID := "MG-DEITY-030"

# ---- Local tuning ----
const VEIL_WALL_LENGTH := 8.0        # fog wall
const VEIL_WALL_HP := 150.0          # blocks sight + projectiles until broken
const MIRAGE_LIFETIME := 4.0         # decoy double duration
const MIRAGE_TAUNT := true           # enemies swing at the wrong shape
const WHITEOUT_TIME := 6.0           # field filled, enemies wander blind

var deity: Dictionary = {}
var ability_db: Dictionary = {}

func _ready() -> void:
	deity = DataLayer.deities.get(DEITY_ID, {})
	assert(not deity.is_empty(), "[KolwethKit] DataLayer missing " + DEITY_ID)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		for a: Dictionary in DataLayer.abilities.values():
			if a.get("deity_id", "") == DEITY_ID and a.get("slot", "") == slot:
				ability_db[slot] = a
	assert(ability_db.size() == 3, "[KolwethKit] expected 3 abilities from DataLayer")
	print("[KolwethKit] kit online: %s, %s — %s | %s | %s" % [
		deity.get("name", "?"), deity.get("epithet", "?"),
		ability_db["active_1"].get("name", "?"),
		ability_db["active_2"].get("name", "?"),
		ability_db["ultimate"].get("name", "?")])

# ---------------------------------------------------------------- active_1
## Veilcast — a fog wall that blocks enemy sight and projectiles.
func veilcast(pos: Vector3, facing: Vector2) -> Dictionary:
	return {"wall": pos, "facing": facing.normalized(),
		"length": VEIL_WALL_LENGTH, "hp": VEIL_WALL_HP,
		"blocks_sight": true, "blocks_projectiles": true}

# ---------------------------------------------------------------- active_2
## Mistake — deploy a mirage double of yourself. Enemies swing at fog.
func mistake(self_pos: Vector3) -> Dictionary:
	return {"decoy": self_pos, "lifetime": MIRAGE_LIFETIME,
		"taunts": MIRAGE_TAUNT, "is_illusion": true}

# ---------------------------------------------------------------- ultimate
## Whiteout — the field fills: enemies wander blind while you strike
## from anywhere.
func whiteout(enemies: Array) -> Dictionary:
	for e in enemies:
		e.set_meta("blinded", WHITEOUT_TIME)
	return {"duration": WHITEOUT_TIME, "blind_all": true,
		"you_see_clearly": true}

# ------------------------------------------------ uniform dispatch
## Uniform dispatch for the combat loop. ctx keys:
##   player_pos, target_pos, facing, enemies, target, max_hp
const SLOT_FN := {
	"active_1": "veilcast",
	"active_2": "mistake",
	"ultimate": "whiteout",
}

const SLOT_ARGS := {
	"active_1": ["target_pos", "facing"],
	"active_2": ["player_pos"],
	"ultimate": ["enemies"],
}

func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:
	var fn: String = SLOT_FN.get(slot, "")
	if fn.is_empty(): return {"cast": false, "why": "unknown slot"}
	var args: Array = []
	for k in SLOT_ARGS.get(slot, []):
		args.append(ctx if k == "CTX" else ctx[k])
	return {"cast": true, "slot": slot, "result": self.callv(fn, args)}
