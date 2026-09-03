extends Control
## Touch controls — MOBILE-FIRST, tap-to-move. No joystick.
## • Tap the ground → deity walks there (raycast onto the y=0 floor plane)
## • Drag one finger → orbit camera
## • Pinch two fingers → zoom
## Ability buttons live in the AbilityHUD (tap to cast, auto-aimed).
## Uses _unhandled_input so taps on HUD/Select buttons never trigger movement.

signal tap_move(target: Vector3)
signal camera_drag(delta: Vector2)
signal zoom_changed(delta: float)

const TAP_MAX_TIME := 0.35          # seconds; longer = drag
const DRAG_THRESHOLD := 20.0        # pixels before a press becomes a camera drag
const ARRIVE_EPSILON := 0.3         # player stops this close to the tap point

var drag_active: bool = false
var drag_id: int = -1
var press_pos: Vector2 = Vector2.ZERO
var press_time: float = 0.0
var last_drag_pos: Vector2 = Vector2.ZERO
var pinch_active: bool = false
var pinch_last_dist: float = 0.0
var active_touches: Dictionary = {}   # index -> Vector2 position

func _ready() -> void:
	set_anchors_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_IGNORE   # this layer never eats taps itself

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		_handle_touch(event)
	elif event is InputEventScreenDrag:
		_handle_drag(event)

func _handle_touch(event: InputEventScreenTouch) -> void:
	if event.pressed:
		active_touches[event.index] = event.position
		if drag_id == -1:
			drag_id = event.index
			press_pos = event.position
			press_time = Time.get_ticks_msec() / 1000.0
			drag_active = false
			last_drag_pos = event.position
	else:
		active_touches.erase(event.index)
		if event.index == drag_id:
			var held: float = (Time.get_ticks_msec() / 1000.0) - press_time
			if not drag_active and held <= TAP_MAX_TIME:
				_emit_tap(event.position)
			drag_id = -1
			drag_active = false
	pinch_active = active_touches.size() >= 2
	if pinch_active:
		pinch_last_dist = _pinch_dist()

func _handle_drag(event: InputEventScreenDrag) -> void:
	if active_touches.has(event.index):
		active_touches[event.index] = event.position
	# two fingers: pinch zoom, no camera drag
	if active_touches.size() >= 2:
		var dist: float = _pinch_dist()
		emit_signal("zoom_changed", pinch_last_dist - dist)
		pinch_last_dist = dist
		return
	if event.index == drag_id:
		if not drag_active and event.position.distance_to(press_pos) > DRAG_THRESHOLD:
			drag_active = true
		if drag_active:
			emit_signal("camera_drag", event.position - last_drag_pos)
		last_drag_pos = event.position

func _pinch_dist() -> float:
	var pts: Array = active_touches.values()
	return (pts[0] - pts[1]).length()

## Screen point -> world point on the floor plane. Public for tests.
func screen_to_ground(screen_pos: Vector2) -> Vector3:
	var cam: Camera3D = get_viewport().get_camera_3d()
	if cam == null:
		return Vector3.INF
	var from: Vector3 = cam.project_ray_origin(screen_pos)
	var dir: Vector3 = cam.project_ray_normal(screen_pos)
	var plane := Plane(Vector3.UP, 0.0)
	var hit = plane.intersects_ray(from, dir)
	if hit == null:
		return Vector3.INF
	return hit

func _emit_tap(screen_pos: Vector2) -> void:
	var target: Vector3 = screen_to_ground(screen_pos)
	if target != Vector3.INF and is_finite(target.x):
		emit_signal("tap_move", target)
