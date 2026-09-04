## TitanCamera — trauma-based shake + LOW TITAN CAMERA (Godot 4.x)
## Attach to the player titan scene root. Wire `camera` (Camera3D) in the inspector.
## Spec: docs/GAMEFEEL_TOP3_SPEC.md — params mirror GameFeelConstants.cs (Unity).
extends Node3D

@export var camera: Camera3D

# --- LOW TITAN CAMERA (spec section 3) ---
const CAM_HEIGHT_MORTAL := 1.6        # mortal eye height, never above the titan's knee
const CAM_DIST := 7.0                # meters behind the titan
const FOV_BASE := 50.0               # vertical FOV
const PITCH_BASE_DEG := 8.0          # baseline up-tilt
const LOOK_UP_MAX_DEG := 35.0        # head breaks skyline on upward aim
const SPRINT_FOV_ADD := 6.0
const SPRINT_FOV_TIME := 0.3

# --- TRAUMA SHAKE (spec sections 1 & 2) ---
const TRAUMA_DECAY := 1.8            # per second
const SHAKE_MAX_OFFSET := 0.35        # meters at trauma = 1
const SHAKE_MAX_ROLL_DEG := 1.2      # degrees at trauma = 1
const IMPACT_DELAY_MS := 40          # contact -> shake peak; sound leads the camera

var _trauma: float = 0.0
var _trauma_pending: float = 0.0
var _trauma_timer_ms := 0
var _noise_x := FastNoiseLite.new()
var _noise_y := FastNoiseLite.new()
var _noise_roll := FastNoiseLite.new()
var _t := 0.0
var _sprint_fov_current := 0.0

func _ready() -> void:
	for n in [_noise_x, _noise_y, _noise_roll]:
		n.noise_type = FastNoiseLite.TYPE_PERLIN
		n.frequency = 12.0
	if camera == null:
		push_warning("TitanCamera: no camera wired — low-cam still applies, shake inactive")

func add_trauma(amount: float) -> void:
	## Called by TitanFootstep (0.22/0.34) and TitanGroundSlam (0.65).
	_trauma_pending = clampf(_trauma + amount, 0.0, 1.0)
	_trauma_timer_ms = IMPACT_DELAY_MS

func set_sprinting(active: bool) -> void:
	var target := SPRINT_FOV_ADD if active else 0.0
	var tween := create_tween()
	tween.tween_property(self, "_sprint_fov_current", target, SPRINT_FOV_TIME)

func _physics_process(delta: float) -> void:
	_t += delta

	# Trauma arrives 40ms after the impact frame (ear-brain ordering sells it)
	if _trauma_pending > 0.0:
		_trauma_timer_ms -= int(delta * 1000.0)
		if _trauma_timer_ms <= 0:
			_trauma = _trauma_pending
			_trauma_pending = 0.0

	_trauma = maxf(_trauma - TRAUMA_DECAY * delta, 0.0)

	# --- LOW CAM POSITION (mortal eye height behind the titan) ---
	var back := -global_transform.basis.z
	var anchor := global_position + back * CAM_DIST
	anchor.y = ground_y(anchor) + CAM_HEIGHT_MORTAL
	camera.global_position = camera.global_position.lerp(anchor, 10.0 * delta)

	# --- PITCH: baseline up-tilt + aim look-up bias ---
	var aim_up := Input.get_axis(&"aim_down", &"aim_up") if OS.has_feature("mobile") else 0.0
	var pitch := deg_to_rad(PITCH_BASE_DEG + aim_up * LOOK_UP_MAX_DEG)

	# --- TRAUMA SHAKE: offset ∝ trauma², Perlin-driven ---
	var shake_pow := _trauma * _trauma
	var ox := _noise_x.get_noise_1d(_t) * SHAKE_MAX_OFFSET * shake_pow
	var oy := _noise_y.get_noise_1d(_t + 100.0) * SHAKE_MAX_OFFSET * shake_pow
	var roll := deg_to_rad(_noise_roll.get_noise_1d(_t + 200.0) * SHAKE_MAX_ROLL_DEG * shake_pow)

	camera.global_position += Vector3(ox, oy, 0) * back.length()
	camera.rotation.z += roll
	camera.fov = FOV_BASE + _sprint_fov_current
	camera.rotation.x = -pitch + shake_pow * 0.02

func ground_y(pos: Vector3) -> float:
	## Replace with a raycast against your terrain layer in production.
	var space := get_world_3d().direct_space_state
	var q := PhysicsRayQueryParameters3D.create(
		pos + Vector3.UP * 50.0, pos + Vector3.DOWN * 200.0)
	q.collide_with_areas = false
	var hit := space.intersect_ray(q)
	return hit.get("position", pos).y if hit else 0.0
