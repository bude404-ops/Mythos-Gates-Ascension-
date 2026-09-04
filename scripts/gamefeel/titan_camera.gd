extends Node3D
## TitanCamera — low titan camera + trauma-based shake (Game-feel #1 + #3)
## Attach to the camera pivot; child Camera3D looks at -Z. Assign `camera` and `target`.

@export var camera: Camera3D
@export var target: Node3D            # the titan (player root)
@export var constants: Node           # GameFeelConstants node

var _trauma := 0.0
var _noise := FastNoiseLite.new()
var _noise_t := 0.0
var _base_fov := 50.0
var _sprinting := false

func _ready() -> void:
    _noise.frequency = 3.0
    if camera:
        _base_fov = constants.CAM_FOV
        camera.fov = _base_fov

func add_trauma(amount: float) -> void:
    _trauma = clampf(_trauma + amount, 0.0, 1.0)

func set_sprinting(active: bool) -> void:
    if _sprinting == active: return
    _sprinting = active
    var tween := create_tween()
    var target_fov: float = _base_fov + (constants.SPRINT_FOV_ADD if active else 0.0)
    tween.tween_property(camera, "fov", target_fov, constants.SPRINT_FOV_TIME_S)

func _physics_process(delta: float) -> void:
    # Trauma decay; shake power = trauma^2 (small hits stay small)
    _trauma = maxf(_trauma - constants.TRAUMA_DECAY * delta, 0.0)
    _noise_t += delta * 30.0
    if not target or not camera: return

    # --- LOW TITAN CAMERA RIG (mechanic 3) ---
    var t_xf := target.global_transform
    var back := -t_xf.basis.z.normalized()
    var cam_pos := t_xf.origin + back * constants.CAM_DISTANCE_M
    cam_pos.y = t_xf.origin.y + constants.CAM_HEIGHT_M      # NEVER above the knee
    global_position = global_position.lerp(cam_pos, 10.0 * delta)
    look_at(target.global_position + Vector3.UP * 6.0, Vector3.UP)
    rotate_object_local(Vector3.RIGHT, deg_to_rad(constants.CAM_BASE_PITCH_DEG))  # +8 up-tilt

    # --- TRAUMA SHAKE (mechanic 1) ---
    var shake := _trauma * _trauma
    var ox := _noise.get_noise_2d(_noise_t, 0.0) * constants.SHAKE_MAX_OFFSET * shake
    var oy := _noise.get_noise_2d(0.0, _noise_t) * constants.SHAKE_MAX_OFFSET * shake
    var roll := _noise.get_noise_2d(_noise_t, _noise_t) * deg_to_rad(constants.SHAKE_MAX_ROLL_DEG) * shake
    camera.position = Vector3(ox, oy, 0.0)
    camera.rotation = camera.rotation + Vector3(0.0, 0.0, roll)
