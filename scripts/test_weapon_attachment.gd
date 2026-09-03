extends SceneTree

## Headless test script for weapon attachment
## Run with: godot --headless --script res://scripts/test_weapon_attachment.gd
##
## This script:
## 1. Loads the character GLB
## 2. Instantiates the WeaponAttachment
## 3. Verifies bone detection, scale calculation, and grip offset
## 4. Prints a detailed report

const CharacterGLB = "res://assets/models/aten_ra_meshy_rigged.glb"
const WeaponGLB = "res://assets/models/aten_ra_staff.glb"

func _init():
	print("\n=== Weapon Attachment Headless Test ===\n")
	
	# Load character
	print("Loading character: ", CharacterGLB)
	var char_scene = load(CharacterGLB)
	if not char_scene:
		print("ERROR: Could not load character GLB")
		quit()
		return
	
	var character = char_scene.instantiate()
	if not character:
		print("ERROR: Could not instantiate character")
		quit()
		return
	
	print("Character instantiated: ", character.name)
	
	# Find skeleton and mesh
	var skeleton = _find_node_of_type(character, "Skeleton3D")
	var mesh_inst = _find_node_of_type(character, "MeshInstance3D")
	
	if not skeleton:
		print("ERROR: No Skeleton3D found")
		_print_tree(character, 0)
		quit()
		return
	
	print("Skeleton3D found: ", skeleton)
	print("Skeleton bone count: ", skeleton.get_bone_count())
	print("MeshInstance3D found: ", mesh_inst)
	
	if mesh_inst:
		var aabb = mesh_inst.get_aabb()
		print("Mesh AABB: position=", aabb.position, " size=", aabb.size)
		print("Mesh height: ", aabb.size.y, "m")
	
	# List all bones
	print("\n--- All Bones ---")
	for i in range(skeleton.get_bone_count()):
		var name = skeleton.get_bone_name(i)
		var rest = skeleton.get_bone_global_rest(i)
		var pos = rest.origin
		print("  [", i, "] ", name, "  rest_pos=(", pos.x, ", ", pos.y, ", ", pos.z, ")")
	
	# Test hand bone detection
	print("\n--- Hand Bone Detection ---")
	var hand_names = ["LeftHand", "RightHand"]
	for hname in hand_names:
		var idx = skeleton.find_bone(hname)
		if idx >= 0:
			var rest = skeleton.get_bone_global_rest(idx)
			print("  ", hname, " (idx=", idx, "): pos=(", rest.origin.x, ", ", rest.origin.y, ", ", rest.origin.z, ")")
			var basis = rest.basis
			print("    basis_x=(", basis.x.x, ", ", basis.x.y, ", ", basis.x.z, ")")
			print("    basis_y=(", basis.y.x, ", ", basis.y.y, ", ", basis.y.z, ")")
			print("    basis_z=(", basis.z.x, ", ", basis.z.y, ", ", basis.z.z, ")")
	
	# Test scale factor calculation
	print("\n--- Scale Factor ---")
	var hips_idx = skeleton.find_bone("Hips")
	var head_idx = skeleton.find_bone("Head")
	if hips_idx >= 0 and head_idx >= 0 and mesh_inst:
		var hips_pos = skeleton.get_bone_global_rest(hips_idx).origin
		var head_pos = skeleton.get_bone_global_rest(head_idx).origin
		var skel_height = abs(head_pos.y - hips_pos.y)
		var mesh_height = mesh_inst.get_aabb().size.y
		var scale_factor = mesh_height / skel_height
		print("  Hips Y: ", hips_pos.y)
		print("  Head Y: ", head_pos.y)
		print("  Skeleton height: ", skel_height)
		print("  Mesh height: ", mesh_height)
		print("  Scale factor (mesh/bone): ", scale_factor)
	
	# Load weapon and calculate
	print("\n--- Weapon Analysis ---")
	var weapon_scene = load(WeaponGLB)
	if weapon_scene:
		var weapon = weapon_scene.instantiate()
		var waabb = _get_aabb_recursive(weapon)
		print("  Weapon AABB: pos=", waabb.position, " size=", waabb.size)
		print("  Weapon height: ", waabb.size.y, "m")
		print("  Weapon center: ", waabb.position + waabb.size * 0.5)
		
		# Calculate grip point (22% from bottom)
		var grip_y = waabb.position.y + waabb.size.y * 0.22
		print("  Grip Y (22% from bottom): ", grip_y)
		
		# Calculate scale
		if mesh_inst:
			var desired_height = 0.75 * mesh_inst.get_aabb().size.y
			var w_scale = desired_height / (waabb.size.y * scale_factor)
			print("  Desired weapon world height: ", desired_height, "m")
			print("  Calculated weapon scale: ", w_scale)
			print("  Final weapon world height: ", waabb.size.y * w_scale * scale_factor, "m")
	else:
		print("  ERROR: Could not load weapon")
	
	print("\n=== Test Complete ===\n")
	quit()

func _find_node_of_type(node: Node, type_name: String) -> Node:
	if node.is_class(type_name):
		return node
	for child in node.get_children():
		var result = _find_node_of_type(child, type_name)
		if result:
			return result
	return null

func _get_aabb_recursive(node: Node3D) -> AABB:
	var aabb = AABB()
	var found = false
	for child in node.get_children():
		if child is MeshInstance3D:
			var mi = child as MeshInstance3D
			var child_aabb = mi.get_aabb()
			if child_aabb.size.length() > 0.001:
				if not found:
					aabb = child_aabb
					found = true
				else:
					aabb = aabb.merge(child_aabb)
	if not found:
		for child in node.get_children():
			if child is Node3D:
				var sub = _get_aabb_recursive(child)
				if sub.size.length() > 0.001:
					if not found:
						aabb = sub
						found = true
					else:
						aabb = aabb.merge(sub)
	return aabb

func _print_tree(node: Node, depth: int):
	print("  ".repeat(depth), node.name, " (", node.get_class(), ")")
	for child in node.get_children():
		_print_tree(child, depth + 1)
