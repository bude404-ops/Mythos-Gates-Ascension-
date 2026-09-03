extends Node3D

## Render script for weapon attachment test
## Creates a character with weapon attachment, renders from front, saves screenshot
## Can be used in headless mode: godot --headless --script res://scripts/render_weapon_test.gd

var character: Node3D
var weapon_attachment: Node
var camera: Camera3D
var render_done: bool = false

func _ready():
	print("=== Weapon Attachment Render Test ===")
	
	# Create camera
	camera = Camera3D.new()
	camera.fov = 35
	camera.near = 0.1
	camera.far = 100
	camera.position = Vector3(0, 1.2, 4.5)
	camera.look_at(Vector3(0, 0.9, 0))
	add_child(camera)
	
	# Lighting
	var key = DirectionalLight3D.new()
	key.light_color = Color(1.0, 0.85, 0.67)
	key.light_energy = 2.0
	key.position = Vector3(3, 5, 4)
	key.look_at(Vector3.ZERO)
	add_child(key)
	
	var fill = DirectionalLight3D.new()
	fill.light_color = Color(0.27, 0.4, 0.67)
	fill.light_energy = 0.4
	fill.position = Vector3(-3, 2, -2)
	fill.look_at(Vector3.ZERO)
	add_child(fill)
	
	var ambient = AmbientLight3D.new()
	ambient.light_color = Color(0.13, 0.09, 0.06)
	ambient.light_energy = 0.3
	add_child(ambient)
	
	# Ground
	var ground = MeshInstance3D.new()
	ground.mesh = PlaneMesh.new()
	ground.mesh.size = Vector2(10, 10)
	var ground_mat = StandardMaterial3D.new()
	ground_mat.albedo_color = Color(0.07, 0.07, 0.09)
	ground_mat.roughness = 0.9
	ground.material_override = ground_mat
	ground.position = Vector3(0, 0, 0)
	add_child(ground)
	
	# Load character
	print("Loading character...")
	var char_scene = load("res://assets/models/aten_ra_meshy_rigged.glb")
	if char_scene:
		character = char_scene.instantiate()
		character.scale = Vector3(1.5, 1.5, 1.5)
		add_child(character)
		print("Character loaded and scaled 1.5x")
	else:
		print("ERROR: Could not load character")
		return
	
	# Load and attach weapon using the WeaponAttachment script
	print("Loading weapon attachment script...")
	var wa_script = load("res://scripts/weapon_attachment.gd")
	if not wa_script:
		print("ERROR: Could not load weapon_attachment.gd")
		return
	
	weapon_attachment = Node3D.new()
	weapon_attachment.set_script(wa_script)
	weapon_attachment.set("weapon_path", "res://assets/models/aten_ra_staff.glb")
	weapon_attachment.set("hand_side", "left")
	weapon_attachment.set("weapon_proportion", 0.75)
	weapon_attachment.set("grip_ratio", 0.22)
	character.add_child(weapon_attachment)
	
	# Wait a frame for _ready to run
	await get_tree().process_frame
	
	# Let animations play a bit then capture
	await get_tree().create_timer(1.0).timeout
	
	# Find the character's AnimationPlayer and play idle
	var anim_player = _find_node_of_type(character, "AnimationPlayer")
	if anim_player and anim_player.has_animation("idle"):
		anim_player.play("idle")
		print("Playing idle animation")
	
	await get_tree().create_timer(0.5).timeout
	
	# Capture screenshot
	_capture_screenshot("front_view")
	
	# Rotate camera to side
	camera.position = Vector3(4.5, 1.2, 0)
	camera.look_at(Vector3(0, 0.9, 0))
	await get_tree().create_timer(0.5).timeout
	_capture_screenshot("side_view")
	
	print("=== Render complete ===")
	
	# In headless mode, we can't actually save screenshots without viewport
	# But we can print the debug info to verify the attachment worked
	get_tree().quit()

func _capture_screenshot(name: String):
	print("Capturing: ", name)
	# In headless mode, we can't capture the viewport
	# But we print the weapon position for verification
	if weapon_attachment and weapon_attachment.has_method("get_weapon"):
		var weapon = weapon_attachment.get_weapon()
		if weapon:
			print("  Weapon position: ", weapon.global_position)
			print("  Weapon scale: ", weapon.scale)
			print("  Weapon rotation: ", weapon.quaternion)

func _find_node_of_type(node: Node, type_name: String) -> Node:
	if node.is_class(type_name):
		return node
	for child in node.get_children():
		var result = _find_node_of_type(child, type_name)
		if result:
			return result
	return null
