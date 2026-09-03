extends Camera3D

@export var target: NodePath
@export var distance: float = 8.0
@export var height: float = 6.0
@export var rotation_speed: float = 5.0
@export var smooth_speed: float = 5.0

var target_node: Node3D
var yaw: float = 0.0
var pitch: float = -0.4

func _ready():
	if target:
		target_node = get_node(target)

func _process(delta):
	if not target_node:
		return
	
	# Camera orbit controls with Q/E
	if Input.is_key_pressed(KEY_Q):
		yaw += rotation_speed * delta
	if Input.is_key_pressed(KEY_E):
		yaw -= rotation_speed * delta
	
	# Zoom with bracket keys
	if Input.is_key_pressed(KEY_BRACKETLEFT):
		distance = max(distance - 20 * delta, 3.0)
	if Input.is_key_pressed(KEY_BRACKETRIGHT):
		distance = min(distance + 20 * delta, 20.0)
	
	# Calculate camera position
	var offset = Vector3(
		sin(yaw) * cos(pitch) * distance,
		-height,
		cos(yaw) * cos(pitch) * distance
	)
	
	var target_pos = target_node.global_position
	var desired_pos = target_pos + offset
	global_position = global_position.lerp(desired_pos, smooth_speed * delta)
	
	# Look at target
	look_at(target_pos + Vector3(0, 1, 0), Vector3.UP)
