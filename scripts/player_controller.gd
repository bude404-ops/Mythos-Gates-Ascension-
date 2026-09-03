extends CharacterBody3D

# Player controller — works with both keyboard AND touch controls
# WASD for desktop, virtual joystick for mobile

@export var move_speed: float = 5.0
@export var rotation_speed: float = 8.0
@export var animation_tree_path: NodePath = ""

var animation_player: AnimationPlayer
var skeleton: Skeleton3D
var current_anim: String = "Idle"
var move_vector: Vector2 = Vector2.ZERO
var attack_triggered: bool = false
var spellcast_triggered: bool = false

# Touch input state
var touch_move_vector: Vector2 = Vector2.ZERO

func _ready():
	# Find AnimationPlayer in the GLB hierarchy
	animation_player = _find_animation_player(self)
	skeleton = _find_skeleton(self)
	
	if animation_player:
		# List available animations
		var anims = animation_player.get_animation_list()
		print("Player: Available animations: ", anims)
		
		# Play idle by default
		if "Idle" in anims:
			animation_player.play("Idle")
		elif "idle" in anims:
			animation_player.play("idle")
	
	# Move to dungeon spawn point
	var main = get_tree().current_scene
	var dungeon = main.get_node_or_null("Dungeon")
	if dungeon and dungeon.has_method("get_spawn_point"):
		var spawn = dungeon.get_spawn_point()
		global_position = spawn
		print("Player: Spawned at ", spawn)
	
	# Connect to touch controls if available
	var touch_controls = main.get_node_or_null("TouchControls")
	if touch_controls and touch_controls.has_signal("move_vector_changed"):
		touch_controls.move_vector_changed.connect(_on_move_vector_changed)
		touch_controls.attack_pressed.connect(_on_attack)
		touch_controls.spellcast_pressed.connect(_on_spellcast)

func _on_move_vector_changed(vec: Vector2):
	touch_move_vector = vec

func _on_attack():
	attack_triggered = true

func _on_spellcast():
	spellcast_triggered = true

func _physics_process(delta):
	# Get input from keyboard OR touch
	var input_dir: Vector2 = Vector2.ZERO
	
	# Keyboard input
	if Input.is_action_pressed("move_forward"):
		input_dir.y -= 1
	if Input.is_action_pressed("move_back"):
		input_dir.y += 1
	if Input.is_action_pressed("move_left"):
		input_dir.x -= 1
	if Input.is_action_pressed("move_right"):
		input_dir.x += 1
	
	# Touch input overrides if active
	if touch_move_vector.length() > 0.1:
		input_dir = touch_move_vector
	
	# Normalize and apply
	if input_dir.length() > 1.0:
		input_dir = input_dir.normalized()
	
	# Get camera-relative direction
	var camera = get_viewport().get_camera_3d()
	if camera:
		var forward = -camera.global_transform.basis.z
		forward.y = 0
		forward = forward.normalized()
		var right = camera.global_transform.basis.x
		right.y = 0
		right = right.normalized()
		
		var direction = (forward * -input_dir.y + right * input_dir.x)
		
		if direction.length() > 0.1:
			# Move the character
			velocity = direction * move_speed
			
			# Rotate to face movement direction
			var target_angle = atan2(direction.x, direction.z)
			var current_angle = rotation.y
			var angle_diff = angle_difference(current_angle, target_angle)
			rotation.y += angle_diff * rotation_speed * delta
			
			# Play walk animation
			if animation_player and current_anim != "Walk":
				_play_animation("Walk")
		else:
			velocity = Vector3.ZERO
			if animation_player and current_anim != "Idle":
				_play_animation("Idle")
	else:
		# Fallback without camera
		velocity = Vector3(input_dir.x * move_speed, 0, input_dir.y * move_speed)
		if input_dir.length() > 0.1:
			if animation_player and current_anim != "Walk":
				_play_animation("Walk")
		else:
			if animation_player and current_anim != "Idle":
				_play_animation("Idle")
	
	# Handle attack
	if (Input.is_action_just_pressed("attack") or attack_triggered) and animation_player:
		_play_animation("CombatSwing")
		attack_triggered = false
	
	# Handle spellcast
	if spellcast_triggered and animation_player:
		_play_animation("Spellcast")
		spellcast_triggered = false
	
	move_and_slide()

func _play_animation(anim_name: String):
	if not animation_player:
		return
	var anims = animation_player.get_animation_list()
	# Try exact match
	if anim_name in anims:
		animation_player.play(anim_name)
		current_anim = anim_name
		return
	# Try case-insensitive
	for a in anims:
		if a.to_lower() == anim_name.to_lower():
			animation_player.play(a)
			current_anim = a
			return

func _find_animation_player(node: Node) -> AnimationPlayer:
	if node is AnimationPlayer:
		return node
	for child in node.get_children():
		var result = _find_animation_player(child)
		if result:
			return result
	return null

func _find_skeleton(node: Node) -> Skeleton3D:
	if node is Skeleton3D:
		return node
	for child in node.get_children():
		var result = _find_skeleton(child)
		if result:
			return result
	return null
