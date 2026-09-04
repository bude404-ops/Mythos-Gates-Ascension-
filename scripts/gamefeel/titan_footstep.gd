## TitanFootstep — WEIGHT: shake + dust + bass per footfall (Godot 4.x)
## Attach to the titan. Requires TitanCamera on the scene root (auto-found).
## Spec: docs/GAMEFEEL_TOP3_SPEC.md — section 1.
extends Node3D

@export var walk_trauma: float = 0.22
@export var charge_trauma: float = 0.34
@export var dust_color_f001 := Color(0.78, 0.66, 0.47)  # warm sandstone tan
@export var dust_color_f002 := Color(0.55, 0.58, 0.63)  # cold grey granite
@export var current_faction := 1                        # 1 = F001, 2 = F002

const DUST_PARTICLES_MIN := 36
const DUST_PARTICLES_MAX := 48
const DUST_LIFETIME_MIN := 0.9
const DUST_LIFETIME_MAX := 1.4
const DUST_RISE_M := 0.4
const BASS_FREQ_START := 70.0
const BASS_FREQ_END := 40.0
const BASS_LEN_MS := 180
const BASS_DB_UNDER := -6.0

var _camera: Node
var _left_foot: bool = true

func _ready() -> void:
	_camera = get_node_or_null("../TitanCamera")  # titan scene root sibling

func foot_contact(foot_global_pos: Vector3, charging: bool) -> void:
	## Call from the walk animation's foot-plant keyframe (AnimationPlayer call track).
	var trauma := charge_trauma if charging else walk_trauma
	if _camera:
		_camera.add_trauma(trauma)

	_burst_dust(foot_global_pos)
	_play_bass()
	if OS.has_feature("mobile"):
		Input.vibrate_handheld(25)  # 25 ms medium impact

func _burst_dust(at: Vector3) -> void:
	var count := randi_range(DUST_PARTICLES_MIN, DUST_PARTICLES_MAX)
	var col: Color = dust_color_f001 if current_faction == 1 else dust_color_f002
	for i in count:
		var ang := TAU * float(i) / float(count) + randf() * 0.2
		var dir := Vector3(cos(ang), 0.0, sin(ang))
		var speed := randf_range(1.5, 3.5)
		_spawn_dust_particle(at, dir * speed, col)

func _spawn_dust_particle(at: Vector3, vel: Vector3, col: Color) -> void:
	## Minimal GPUParticles3D one-shot; swap for a pooled emitter in production.
	var p := GPUParticles3D.new()
	p.amount = 1
	p.one_shot = true
	p.emitting = false
	p.explosiveness = 1.0
	p.lifetime = randf_range(DUST_LIFETIME_MIN, DUST_LIFETIME_MAX)
	p.position = at + Vector3(randf_range(-0.1, 0.1), 0.05, randf_range(-0.1, 0.1))
	var mesh := QuadMesh.new()
	mesh.size = Vector2(0.25, 0.25)
	var mat := StandardMaterial3D.new()
	mat.albedo_color = col
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mesh.material = mat
	p.process_material = _dust_process_mat(vel)
	p.draw_pass = mesh
	add_child(p)
	p.emitting = true
	p.finished.connect(p.queue_free)

func _dust_process_mat(vel: Vector3) -> ParticleProcessMaterial:
	var m := ParticleProcessMaterial.new()
	m.direction = vel.normalized()
	m.spread = 15.0
	m.initial_velocity_min = vel.length() * 0.8
	m.initial_velocity_max = vel.length() * 1.2
	m.gravity = Vector3(0, 9.8, 0)   # dust settles, rises then falls
	m.scale_min = 0.6
	m.scale_max = 1.0
	m.color_ramp = _dust_ramp()
	return m

func _dust_ramp() -> GradientTexture1D:
	var g := Gradient.new()
	g.set_color(0, Color(1, 1, 1, 0.9))   # opaque burst
	g.set_color(1, Color(1, 1, 1, 0.0))   # fade out
	g.add_point(0.4, Color(1, 1, 1, 0.5))
	var t := GradientTexture1D.new()
	t.gradient = g
	return t

func _play_bass() -> void:
	## Sub-bass thump with the 70->40 Hz falling read. Swap for an AudioStream in prod.
	if Engine.is_editor_hint():
		return
	# Audio bus "SFX" assumed; generated tone via AudioStreamGenerator kept out of the
	# drop-in script — wire an AudioStreamPlayer3D named BassThump in production:
	var player := get_node_or_null(^"BassThump") as AudioStreamPlayer3D
	if player:
		player.play()
