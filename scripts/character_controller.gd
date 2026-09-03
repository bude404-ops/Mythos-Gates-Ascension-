extends Node3D

@export var move_speed: float = 5.0
@export var rotation_speed: float = 8.0

var animation_player: AnimationPlayer

func _ready():
	animation_player = find_animation_player(self)
	if animation_player and animation_player.has_animation("Idle"):
		animation_player.play("Idle")

func find_animation_player(node: Node) -> AnimationPlayer:
	if node is AnimationPlayer:
		return node
	for child in node.get_children():
		var result = find_animation_player(child)
		if result:
			return result
	return null

func _process(delta):
	var input_dir = Vector3.ZERO
	
	if Input.is_action_pressed("move_forward"):
		input_dir.z -= 1
	if Input.is_action_pressed("move_back"):
		input_dir.z += 1
	if Input.is_action_pressed("move_left"):
		input_dir.x -= 1
	if Input.is_action_pressed("move_right"):
		input_dir.x += 1
	
	input_dir = input_dir.normalized()
	
	if input_dir != Vector3.ZERO:
		position += input_dir * move_speed * delta
		var target_angle = atan2(input_dir.x, input_dir.z)
		rotation.y = lerp_angle(rotation.y, target_angle, rotation_speed * delta)
		if animation_player and animation_player.has_animation("Walk"):
			if animation_player.current_animation != "Walk":
				animation_player.play("Walk")
	else:
		if animation_player and animation_player.has_animation("Idle"):
			if animation_player.current_animation != "Idle":
				animation_player.play("Idle")

func play_attack():
	if animation_player and animation_player.has_animation("CombatSwing"):
		animation_player.play("CombatSwing")

func play_spellcast():
	if animation_player and animation_player.has_animation("Spellcast"):
		animation_player.play("Spellcast")
