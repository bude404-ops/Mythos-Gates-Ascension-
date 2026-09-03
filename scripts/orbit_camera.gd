extends Camera3D

# Orbit camera — works with mouse AND touch
# Desktop: mouse drag to orbit, scroll wheel to zoom
# Mobile: one-finger drag to orbit, pinch to zoom

@export var target: NodePath = ""
@export var orbit_speed: float = 0.005
@export var zoom_speed: float = 0.5
@export var min_distance: float = 3.0
@export var max_distance: float = 25.0
@export var min_height: float = 1.0
@export var max_height: float = 15.0

var target_node: Node3D
var yaw: float = 0.0
var pitch: float = -0.4
var distance: float = 10.0

# Mouse drag state
var mouse_dragging: bool = false
var last_mouse_pos: Vector2 = Vector2.ZERO

# Touch drag state
var touch_drag_delta: Vector2 = Vector2.ZERO
var touch_zoom_delta: float = 0.0

func _ready():
	if not target.is_empty():
		target_node = get_node(target)
	
	# Connect to touch controls
	var main = get_tree().current_scene
	var touch_controls = main.get_node_or_null("TouchControls")
	if touch_controls:
		if touch_controls.has_signal("camera_drag"):
			touch_controls.camera_drag.connect(_on_camera_drag)
		if touch_controls.has_signal("zoom_changed"):
			touch_controls.zoom_changed.connect(_on_zoom_changed)
	
	_update_camera()

func _on_camera_drag(delta: Vector2):
	touch_drag_delta += delta

func _on_zoom_changed(delta: float):
	touch_zoom_delta += delta

func _input(event: InputEvent):
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				mouse_dragging = true
				last_mouse_pos = event.position
			else:
				mouse_dragging = false
		elif event.button_index == MOUSE_BUTTON_WHEEL_UP:
			distance = max(min_distance, distance - zoom_speed)
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			distance = min(max_distance, distance + zoom_speed)
	
	if event is InputEventMouseMotion and mouse_dragging:
		var delta = event.position - last_mouse_pos
		yaw -= delta.x * orbit_speed
		pitch = clamp(pitch - delta.y * orbit_speed, -1.3, 0.3)
		last_mouse_pos = event.position

func _process(delta):
	# Apply touch input
	if touch_drag_delta.length() > 0:
		yaw -= touch_drag_delta.x * orbit_speed
		pitch = clamp(pitch - touch_drag_delta.y * orbit_speed, -1.3, 0.3)
		touch_drag_delta = Vector2.ZERO
	
	if touch_zoom_delta != 0.0:
		distance = clamp(distance + touch_zoom_delta, min_distance, max_distance)
		touch_zoom_delta = 0.0
	
	_update_camera()

func _update_camera():
	if not target_node:
		return
	
	# Calculate camera position from yaw and pitch
	var offset = Vector3.ZERO
	offset.x = sin(yaw) * cos(pitch) * distance
	offset.y = -sin(pitch) * distance
	offset.z = cos(yaw) * cos(pitch) * distance
	
	# Clamp height
	offset.y = clamp(offset.y, min_height, max_height)
	
	global_position = target_node.global_position + offset + Vector3(0, 2, 0)
	
	# Look at the target
	look_at(target_node.global_position + Vector3(0, 1, 0), Vector3.UP)
