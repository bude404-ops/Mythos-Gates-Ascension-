## TitanGroundSlam — SHOCKWAVE: windup, expanding ring, cracks, displacement (Godot 4.x)
## Spec: docs/GAMEFEEL_TOP3_SPEC.md — section 2.
## Attach to the titan. Wire TitanCamera sibling (auto-found) + enemy group name.
extends Node3D

@export var enemy_group: StringName = &"enemies"
@export var ring_color_f001 := Color(1.0, 0.82, 0.35)  # warm gold (F001 glow)
@export var ring_color_f002 := Color(0.45, 0.75, 1.0)  # ice-blue (F002 glow)
@export var current_faction := 2

const WINDUP_S := 0.45
const WINDUP_CAM_PULLBACK_M := 1.5
const WINDUP_FOV_ADD := 4.0
const RING_MAX_RADIUS_M := 18.0
const RING_EXPAND_S := 0.7
const CRACK_COUNT_MIN := 6
const CRACK_COUNT_MAX := 10
const CRACK_ANGLE_JITTER_DEG := 20.0
const SLAM_TRAUMA := 0.65
const LAUNCH_AIRBORNE_DIST_M := 6.0
const PULSE_MS := 40

var _camera: Node
var _slamming := false

func _ready() -> void:
	_camera = get_node_or_null("../TitanCamera")

func trigger_slam() -> void:
	## Bind to the slam ability button (mobile tap target).
	if _slamming:
		return
	_slamming = true
	await _windup()
	var impact_pos: Vector3 = global_position + (-global_transform.basis.z * 2.0)
	_impact(impact_pos)
	_slamming = false

func _windup() -> void:
	var t := create_tween()
	t.tween_property(_camera if _camera else self, "position",
		(_camera.position if _camera else position) + Vector3(0, 0, WINDUP_CAM_PULLBACK_M)
			* -1.0 * 0.0 + Vector3(0, 0, -WINDUP_CAM_PULLBACK_M), WINDUP_S)
	await get_tree().create_timer(WINDUP_S).timeout

func _impact(at: Vector3) -> void:
	if _camera:
		_camera.add_trauma(SLAM_TRAUMA)          # biggest shake in the game
		_camera.set_sprinting(true)              # reuse FOV tween as pull-in +4°
	_spawn_ring(at)
	_spawn_cracks(at)
	_displace_enemies(at)
	if OS.has_feature("mobile"):
		Input.vibrate_handheld(80)               # double-tap heavy impact
		await get_tree().create_timer(0.08).timeout
		Input.vibrate_handheld(80)

func _spawn_ring(at: Vector3) -> void:
	var mesh := ImmediateMesh.new()  # simple quad ring; swap to torus in production
	var ring := MeshInstance3D.new()
	ring.mesh = mesh
	var mat := StandardMaterial3D.new()
	var col: Color = ring_color_f001 if current_faction == 1 else ring_color_f002
	mat.albedo_color = col
	mat.emission_enabled = true
	mat.emission = col
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	ring.material_override = mat
	ring.position = at
	add_child(ring)

	var t := create_tween()
	var radius := 0.0
	t.tween_method(func(r: float):
		_update_ring(mesh, r, col), 0.0, RING_MAX_RADIUS_M, RING_EXPAND_S)
	await t.finished
	# fade
	var f := create_tween()
	f.tween_property(mat, "albedo_color:a", 0.0, 0.15)
	await f.finished
	ring.queue_free()

func _update_ring(mesh: ImmediateMesh, radius: float, col: Color) -> void:
	mesh.clear_surfaces()
	var inner := radius * 0.85
	var segs := 48
	mesh.surface_begin(Mesh.PRIMITIVE_TRIANGLE_STRIP)
	for i in segs + 1:
		var a := TAU * i / segs
		var d := Vector3(cos(a), 0, sin(a))
		mesh.surface_set_color(Color(col.r, col.g, col.b, clampf(1.0 - radius / RING_MAX_RADIUS_M, 0.1, 1.0)))
		mesh.surface_add_vertex(d * inner)
		mesh.surface_add_vertex(d * radius)
	mesh.surface_end()

func _spawn_cracks(at: Vector3) -> void:
	var n := randi_range(CRACK_COUNT_MIN, CRACK_COUNT_MAX)
	for i in n:
		var ang := TAU * i / n + deg_to_rad(randf_range(-CRACK_ANGLE_JITTER_DEG, CRACK_ANGLE_JITTER_DEG))
		# Decal-based ground cracks: swap for Decal node with crack texture per faction.
		var d := Decal.new()
		d.size = Vector3(4, 2, randf_range(6, 12))
		d.rotation = Vector3(-PI / 2.0, ang, 0)
		d.position = at + Vector3(cos(ang), 0, sin(ang) * d.size.z * 0.5)
		add_child(d)
		var f := create_tween()
		f.tween_interval(6.0)          # cracks linger, then go
		f.tween_callback(d.queue_free)

func _displace_enemies(at: Vector3) -> void:
	## Radial launch: force ∝ (1 − dist/18 m). Kills NOTHING at range — displacement only.
	for body in get_tree().get_nodes_in_group(enemy_group):
		var e := body as Node3D
		if e == null:
			continue
		var offset := e.global_position - at
		var dist := offset.length()
		if dist > RING_MAX_RADIUS_M:
			continue
		var force_scale := 1.0 - dist / RING_MAX_RADIUS_M
		var dir := offset.normalized()
		if e is RigidBody3D:
			var rb := e as RigidBody3D
			var impulse := dir * force_scale * 12.0
			if dist < LAUNCH_AIRBORNE_DIST_M:
				impulse += Vector3.UP * force_scale * 8.0   # ants fly
			rb.apply_central_impulse(impulse)
		elif e.has_method(&"apply_stagger"):
			e.apply_stagger(force_scale)
