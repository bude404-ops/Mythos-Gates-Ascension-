extends Node
## Mythos Gates: Ascension — Combat Loop (the first playable slice).
## Pick a deity -> spawn placeholder enemies -> auto-attack + cast abilities
## against real AI, all resolved through the CombatManager runtime.
## Model-agnostic: enemies are capsules today, GLB models tomorrow.

signal ability_cast(deity_id: String, slot: String, result: Dictionary)
signal deity_changed(deity_id: String)
signal wave_cleared()
signal player_down()

const PLAYER_MAX_HP := 1000.0
const AUTO_ATTACK_RANGE := 5.0
const AUTO_ATTACK_DMG := 60.0
const AUTO_ATTACK_CD := 1.0
const ENEMY_SPEED := 2.5
const ENEMY_MELEE_RANGE := 2.0
const ENEMY_MELEE_DMG := 40.0
const ENEMY_MELEE_CD := 1.5
const ENEMY_MAX_HP := 300.0

@export var deity_id: String = "MG-DEITY-001"   # default: Khaveth, first of the pantheon

var player: Node3D
var kit: Node
var runtime: Node
var enemies: Array = []
var _atk_cd := 0.0
var _enemy_cd: Dictionary = {}

## Load the deity's kit node from its faction + file name, per DataLayer.
func select_deity(id: String) -> bool:
	var d: Dictionary = DataLayer.deities.get(id, {})
	if d.is_empty():
		push_warning("[CombatLoop] unknown deity %s" % id)
		return false
	deity_id = id
	var kit_name: String = String(d.get("name", "")).to_lower() + "_kit"
	if not ResourceLoader.exists("res://scripts/kits/%s.gd" % kit_name):
		push_warning("[CombatLoop] no kit script for %s" % kit_name)
		return false
	if kit: kit.queue_free()
	kit = load("res://scripts/kits/%s.gd" % kit_name).new()
	add_child(kit)
	emit_signal("deity_changed", deity_id)
	return true

func _ready() -> void:
	runtime = get_node_or_null("../CombatManager")
	if runtime == null:
		runtime = load("res://scripts/combat_runtime.gd").new()
		get_parent().add_child.call_deferred(runtime)
	select_deity(deity_id)

func set_player(p: Node3D) -> void:
	player = p
	p.set_meta("hp", PLAYER_MAX_HP)
	p.set_meta("hp_max", PLAYER_MAX_HP)
	p.set_meta("hp_frac", 1.0)

## Spawn one placeholder enemy (capsule now, GLB later).
func spawn_enemy(pos: Vector3) -> Node3D:
	var e := Node3D.new()
	e.position = pos
	e.set_meta("hp", ENEMY_MAX_HP)
	e.set_meta("hp_max", ENEMY_MAX_HP)
	e.set_meta("hp_frac", 1.0)
	# Placeholder visual: grim crimson capsule (real GLBs land via the pipeline later).
	var vis := MeshInstance3D.new()
	var m := CapsuleMesh.new()
	m.radius = 0.3
	m.height = 1.5
	vis.mesh = m
	vis.position = Vector3(0, 0.75, 0)
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.30, 0.08, 0.06)
	mat.emission_enabled = true
	mat.emission = Color(0.45, 0.10, 0.08)
	mat.emission_energy_multiplier = 0.25
	vis.set_surface_override_material(0, mat)
	e.add_child(vis)
	get_parent().add_child.call_deferred(e)
	enemies.append(e)
	runtime.register(e)
	return e

func _process(delta: float) -> void:
	if player == null or not is_instance_valid(player):
		return
	_hide_dead()
	_auto_attack(delta)
	_enemy_ai(delta)

## Fallen placeholders vanish from view (hp meta already gates all logic).
func _hide_dead() -> void:
	for e in enemies:
		if is_instance_valid(e) and e.visible and e.get_meta("hp", 1.0) <= 0.0:
			e.visible = false

## Auto-attack: nearest enemy in range, damage through the runtime.
func _auto_attack(delta: float) -> void:
	_atk_cd = maxf(_atk_cd - delta, 0.0)
	if _atk_cd > 0.0: return
	var nearest := _nearest(player.position, AUTO_ATTACK_RANGE)
	if nearest == null: return
	_atk_cd = AUTO_ATTACK_CD
	var dealt: float = runtime.apply_damage(player, nearest, AUTO_ATTACK_DMG)
	if dealt > 0.0:
		emit_signal("ability_cast", deity_id, "auto_attack", {"target": nearest, "dealt": dealt})

## Enemy AI: walk toward player, melee on cooldown. Placeholder brains.
func _enemy_ai(delta: float) -> void:
	for e in enemies:
		if not is_instance_valid(e): continue
		if e.get_meta("hp", 0.0) <= 0.0: continue
		var to_player: Vector3 = player.position - e.position
		var dist: float = to_player.length()
		var mult: float = runtime.move_multiplier(e)
		if dist > ENEMY_MELEE_RANGE and mult > 0.0:
			e.position += to_player.normalized() * ENEMY_SPEED * mult * delta
			continue
		if dist <= ENEMY_MELEE_RANGE:
			var cd: float = _enemy_cd.get(e, 0.0) - delta
			if cd <= 0.0 and runtime.targetable(player):
				cd = ENEMY_MELEE_CD
				runtime.apply_damage(e, player, ENEMY_MELEE_DMG)
				if player.get_meta("hp", 0.0) <= 0.0:
					emit_signal("player_down")
			_enemy_cd[e] = cd

## Cast a kit ability at a ground target. Slots: active_1, active_2, ultimate.
## Every kit exposes the uniform cast_slot(slot, ctx) dispatcher.
func cast(slot: String, target_pos: Vector3) -> Dictionary:
	if kit == null: return {"cast": false, "why": "no kit"}
	var dir3 := target_pos - player.position
	if dir3.length() < 0.001: dir3 = Vector3.FORWARD
	dir3 = dir3.normalized()
	var ctx := {
		"player_pos": player.position,
		"target_pos": target_pos,
		"facing": Vector2(dir3.x, dir3.z).normalized(),
		"enemies": _enemies_in(30.0),
		"target": _nearest(player.position, 30.0),
		"max_hp": player.get_meta("hp_max", 1000.0),
	}
	var result: Dictionary = kit.cast_slot(slot, ctx)
	emit_signal("ability_cast", deity_id, slot, result)
	return result

func _nearest(from: Vector3, max_dist: float) -> Node3D:
	var best: Node3D = null
	var best_d: float = max_dist
	for e in enemies:
		if not is_instance_valid(e) or e.get_meta("hp", 0.0) <= 0.0: continue
		var d: float = from.distance_to(e.position)
		if d < best_d:
			best = e; best_d = d
	return best

func _enemies_in(radius: float) -> Array:
	var out: Array = []
	for e in enemies:
		if is_instance_valid(e) and e.get_meta("hp", 0.0) > 0.0 \
			and player.position.distance_to(e.position) <= radius:
			out.append(e)
	return out

## Any living enemies left? true = wave still alive, false = cleared.
func wave_alive() -> bool:
	for e in enemies:
		if is_instance_valid(e) and e.get_meta("hp", 0.0) > 0.0:
			return true
	if enemies.is_empty(): return false
	_emit_cleared()
	return false

func _emit_cleared() -> void:
	emit_signal("wave_cleared")
