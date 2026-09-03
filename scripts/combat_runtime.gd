extends Node
## Mythos Gates: Ascension — Combat Runtime (the glue).
## One engine that ticks every status the 32 kits write and makes the
## math actually happen in fights. Model-agnostic: works on placeholder
## meshes; Meshy/Mixamo models drop in later with zero changes here.
##
## Statuses handled (kit -> meta):
##   snared / snare_timer          (MG-DEBUFF-SNARE)      rooted, move 0
##   slow_mult / slow_timer        (MG-DEBUFF-SLOW)       move x slow_mult
##   melt / melt_timer             (MG-DEBUFF-ARMOR-MELT) +damage taken
##   def_down / def_down_timer                            +damage taken
##   armor_shred / armor_shred_timer (Djekhur)            +5% per stack
##   writmarked / debt_seconds     (MG-BUFF-DEBT-STACK)   +5%/s compounding
##   debt_dot / debt_dot_acc        (MG-BUFF-DOT-GROW)     interest burn, 1 tick/s
##   omenmarked / hp_frac          (Corveth War-Omen)     +10% full -> +60% near death
##   moonmarked / moonmark_timer   (MG-BUFF-MARK)
##   lumenmarked                    (Thraniel Far Glint)
##   irradiated / blinded          (Tashareth / Kolweth)
##   iframes / untargetable_time   (MG-BUFF-I-FRAME / MG-BUFF-UNTARGETABLE)
## Barriers: pool with HP (Tolveth walls, Mawkreth stone, Kolweth fog).
## Bargains: F007 contract prompt records (Kraxus/Orivax/Mazka/Syrrax).

signal barrier_destroyed(barrier: Dictionary)
signal bargain_resolved(bargain: Dictionary, accepted: bool)
signal enemy_down(enemy: Node)

# ---- Tuning (numbers, never lore) ----
const TICK_RATE := 0.1                  # status tick, seconds
const WRIT_RATE_PER_SEC := 0.05         # writ debt grows +5%/s while held (cap 60%)
const WRIT_CAP := 0.60
const DEBTFIRE_INTEREST := 0.20         # Orivax: burn grows 20% per burn-tick
const SHRED_PER_STACK := 0.05           # Djekhur armor shred
const OMEN_MIN := 0.10                  # Corveth omen at full health
const OMEN_MAX := 0.60                  # Corveth omen near death
const BARRIER_POOL_SIZE := 12

var combatants: Array = []
var barriers: Array[Dictionary] = []
var bargains: Array[Dictionary] = []
var _accum := 0.0

func _process(delta: float) -> void:
	_accum += delta
	while _accum >= TICK_RATE:
		_tick(TICK_RATE)
		_accum -= TICK_RATE

func register(enemy: Node) -> void:
	if not combatants.has(enemy):
		combatants.append(enemy)
		if not enemy.has_meta("hp_frac"):
			enemy.set_meta("hp_frac", 1.0)

func unregister(enemy: Node) -> void:
	combatants.erase(enemy)

# ---------------------------------------------------------------- ticking
## Advance every status timer on every registered combatant.
func _tick(dt: float) -> void:
	for e in combatants:
		_tick_meta_timers(e, dt)
		_compound_debt(e, dt)

func _tick_meta_timers(e: Node, dt: float) -> void:
	# (timer meta, flag to clear at zero)
	for pair: Array in [
		["snare_timer", "snared"], ["slow_timer", null],
		["melt_timer", null], ["def_down_timer", "def_down"],
		["armor_shred_timer", null], ["moonmark_timer", "moonmarked"],
		["blinded", null], ["irradiated", null],
		["iframes", null], ["untargetable_time", null],
	]:
		var key: String = pair[0]
		var clear_flag = pair[1]   # null = no flag to clear
		var left: float = float(e.get_meta(key, 0.0)) - dt
		if left <= 0.0:
			e.set_meta(key, 0.0)
			if clear_flag:
				e.set_meta(clear_flag, false)
			if key == "slow_timer":
				e.set_meta("slow_mult", 1.0)
			if key == "melt_timer":
				e.set_meta("melt", 0.0)
			if key == "armor_shred_timer":
				e.set_meta("armor_shred", 0)
			if key == "def_down_timer":
				e.set_meta("def_down", 0.0)
		else:
			e.set_meta(key, left)

## Writ of War (Kraxus): debt_seconds compounds while the mark holds.
## Debtfire (Orivax): debt_dot burns once per second, then grows 20%.
func _compound_debt(e: Node, dt: float) -> void:
	if e.get_meta("writmarked", false):
		e.set_meta("debt_seconds", e.get_meta("debt_seconds", 0.0) + dt)
	if e.get_meta("debt_dot", 0.0) > 0.0:
		var acc: float = e.get_meta("debt_dot_acc", 0.0) + dt
		if acc >= 1.0 - TICK_RATE * 0.5:
			acc -= 1.0
			var burn: float = e.get_meta("debt_dot", 0.0)
			apply_damage(null, e, burn)
			e.set_meta("debt_dot", burn * (1.0 + DEBTFIRE_INTEREST))
		e.set_meta("debt_dot_acc", acc)

# ---------------------------------------------------------------- queries
## Movement multiplier this frame: 0 rooted, slow_mult slowed, else 1.
func move_multiplier(e: Node) -> float:
	if e.get_meta("snared", false):
		return 0.0
	return e.get_meta("slow_mult", 1.0)

## Total damage-taken multiplier: melt + def_down + shred + writ + omen.
func damage_taken_multiplier(e: Node) -> float:
	var mult := 1.0
	mult += e.get_meta("melt", 0.0)
	mult += e.get_meta("def_down", 0.0)
	mult += int(e.get_meta("armor_shred", 0)) * SHRED_PER_STACK
	if e.get_meta("writmarked", false):
		mult += minf(WRIT_CAP, e.get_meta("debt_seconds", 0.0) * WRIT_RATE_PER_SEC)
	if e.get_meta("omenmarked", false):
		var frac: float = clampf(e.get_meta("hp_frac", 1.0), 0.0, 1.0)
		mult += OMEN_MAX - (OMEN_MAX - OMEN_MIN) * frac
	return mult

## Can this enemy be targeted right now? (i-frames / untargetable)
func targetable(e: Node) -> bool:
	return e.get_meta("iframes", 0.0) <= 0.0 \
		and e.get_meta("untargetable_time", 0.0) <= 0.0

## Resolve one damage instance against an enemy. Returns applied damage.
func apply_damage(attacker: Node, e: Node, base: float) -> float:
	if not targetable(e):
		return 0.0
	var dealt: float = base * damage_taken_multiplier(e)
	var hp: float = e.get_meta("hp", 100.0)
	var new_hp: float = maxf(hp - dealt, 0.0)
	e.set_meta("hp", new_hp)
	var hp_max: float = maxf(e.get_meta("hp_max", 100.0), 1.0)
	e.set_meta("hp_frac", new_hp / hp_max)
	if new_hp <= 0.0:
		emit_signal("enemy_down", e)
	return dealt

# ---------------------------------------------------------------- barriers
## Spawn a barrier from the pool (Tolveth walls, Mawkreth stone, Kolweth fog).
func spawn_barrier(pos: Vector3, facing: Vector2, length: float, hp: float, kind: String) -> Dictionary:
	if barriers.size() >= BARRIER_POOL_SIZE:
		barriers.pop_front()   # oldest crumbles; the grove recycles
	var barrier := {"position": pos, "facing": facing.normalized(),
		"length": length, "hp": hp, "kind": kind,
		"blocks_sight": kind == "fog", "blocks_projectiles": true}
	barriers.append(barrier)
	return barrier

func damage_barrier(barrier: Dictionary, amount: float) -> void:
	barrier["hp"] = maxf(barrier["hp"] - amount, 0.0)
	if barrier["hp"] <= 0.0:
		barriers.erase(barrier)
		emit_signal("barrier_destroyed", barrier)

# ---------------------------------------------------------------- bargains
## Open a Black-Iron bargain prompt (Kraxus / Orivax / Mazka / Syrrax).
## Returns a contract record the UI renders; accept/decline resolves it.
func open_bargain(deity_id: String, terms: Dictionary) -> Dictionary:
	var bargain := {"id": deity_id + "_" + str(bargains.size()),
		"deity_id": deity_id, "terms": terms, "open": true}
	bargains.append(bargain)
	return bargain

func resolve_bargain(bargain: Dictionary, accepted: bool) -> void:
	bargain["open"] = false
	bargain["accepted"] = accepted
	bargains.erase(bargain)
	emit_signal("bargain_resolved", bargain, accepted)
