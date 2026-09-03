extends Node3D

## Weapon Attachment System — Mythos Gates
## Attaches a weapon prop to the character's hand bone with correct
## position, rotation, scale, and finger grip pose.
##
## LOCKED SETTINGS (confirmed by BudE404, Sept 2 2026):
##   Hand: RightHand
##   Tilt: Fwd 30° + Right Lean 15°
##   Height offset: -0.80 (below wrist bone to actual grip)
##   Grip: All fingers closed around staff

signal weapon_attached(weapon_node: Node3D)

@export var character_path: String = ""
@export var weapon_path: String = ""
@export var hand_bone_name: String = "RightHand"
@export var run_animation_path: String = ""

# Locked weapon transform
const TILT_FORWARD_DEG: float = 30.0
const TILT_SIDE_DEG: float = 15.0
const HEIGHT_OFFSET: float = -0.80
const LATERAL_X: float = 0.05
const LATERAL_Z: float = 0.03
const WEAPON_PROPORTION: float = 0.75
const GRIP_RATIO: float = 0.22

# Finger grip curl amounts (radians) — locked
const FINGER_CURLS: Dictionary = {
	"Thumb":  [0.3, 0.4, 0.3],
	"Index":  [0.5, 0.7, 0.5],
	"Middle": [0.5, 0.7, 0.5],
	"Ring":   [0.5, 0.7, 0.5],
	"Pinky":  [0.6, 0.8, 0.5],
}

var _character: Node3D
var _skeleton: Skeleton3D
var _weapon: Node3D
var _hand_bone_idx: int = -1
var _finger_bone_indices: Array[int] = []
var _mixer: AnimationMixer
var _mesh_height: float = 1.8
var _weapon_height: float = 1.9

func _ready() -> void:
	if character_path.is_empty() or weapon_path.is_empty():
		push_warning("WeaponAttachment: missing character_path or weapon_path")
		return
	
	_load_character()
	_load_weapon()
	_apply_finger_grip()

func _load_character() -> void:
	var packed_scene: PackedScene = ResourceLoader.load(character_path)
	if packed_scene == null:
		push_error("WeaponAttachment: failed to load character at " + character_path)
		return
	
	_character = packed_scene.instantiate()
	add_child(_character)
	
	# Find Skeleton3D
	_skeleton = _find_skeleton(_character)
	if _skeleton == null:
		push_error("WeaponAttachment: no Skeleton3D found in character")
		return
	
	# Find hand bone
	_hand_bone_idx = _skeleton.find_bone(hand_bone_name)
	if _hand_bone_idx == -1:
		_hand_bone_idx = _find_bone_by_pattern(_skeleton, ["RightHand", "Hand_R", "hand.R"])
	
	if _hand_bone_idx == -1:
		push_error("WeaponAttachment: hand bone not found")
		return
	
	# Find all finger bones on the same hand
	var hand_prefix = hand_bone_name.replace("Hand", "")
	_finger_bone_indices = _find_finger_bones(_skeleton, hand_prefix)
	
	# Get mesh height from AABB
	_mesh_height = _get_mesh_height(_character)
	
	# Find AnimationMixer
	_mixer = _find_mixer(_character)
	
	print("[WeaponAttachment] Hand bone: %s (idx %d), mesh height: %.2f, fingers: %d" % [
		hand_bone_name, _hand_bone_idx, _mesh_height, _finger_bone_indices.size()
	])

func _load_weapon() -> void:
	var packed_scene: PackedScene = ResourceLoader.load(weapon_path)
	if packed_scene == null:
		push_error("WeaponAttachment: failed to load weapon at " + weapon_path)
		return
	
	_weapon = packed_scene.instantiate()
	add_child(_weapon)
	
	# Get weapon AABB height
	_weapon_height = _get_mesh_height(_weapon)
	
	print("[WeaponAttachment] Weapon loaded, height: %.2f" % _weapon_height)

func _process(_delta: float) -> void:
	if _skeleton == null or _weapon == null or _hand_bone_idx == -1:
		return
	
	_update_weapon_position()
	_apply_finger_grip()

func _update_weapon_position() -> void:
	# Get bone world transform
	var bone_global: Transform3D = _skeleton.get_global_transform() * _skeleton.get_bone_global_pose(_hand_bone_idx)
	var bone_pos: Vector3 = bone_global.origin
	
	# Calculate scale
	var weapon_scale: float = WEAPON_PROPORTION * _mesh_height / _weapon_height
	
	# Calculate grip offset along weapon Y axis
	var grip_y_local: float = -_weapon_height / 2.0 + GRIP_RATIO * _weapon_height
	var grip_offset_up: float = -grip_y_local * weapon_scale
	
	# Position: bone pos + grip offset + height adjustment + lateral offset
	_weapon.global_position = Vector3(
		bone_pos.x + LATERAL_X,
		bone_pos.y + grip_offset_up + HEIGHT_OFFSET,
		bone_pos.z + LATERAL_Z
	)
	
	# Rotation: straight up + locked tilt
	var basis: Basis = Basis()
	basis = basis.rotated(Vector3.RIGHT, deg_to_rad(TILT_FORWARD_DEG))
	basis = basis.rotated(Vector3.BACK, deg_to_rad(TILT_SIDE_DEG))
	_weapon.global_rotation = basis.get_euler()
	
	# Scale
	_weapon.scale = Vector3(weapon_scale, weapon_scale, weapon_scale)

func _apply_finger_grip() -> void:
	if _skeleton == null or _finger_bone_indices.is_empty():
		return
	
	for bone_idx in _finger_bone_indices:
		var bone_name: String = _skeleton.get_bone_name(bone_idx)
		var curl: float = 0.5
		
		# Determine curl amount based on finger type and joint
		for finger in FINGER_CURLS.keys():
			if bone_name.contains(finger):
				var curls: Array = FINGER_CURLS[finger]
				for j in range(1, 4):
					if bone_name.ends_with(str(j)) and j - 1 < curls.size():
						curl = curls[j - 1]
						break
				break
		
		# Apply curl
		var pose: Transform3D = _skeleton.get_bone_pose(bone_idx)
		pose.basis = pose.basis.rotated(Vector3.RIGHT, curl)
		
		# Thumb also rotates on Z for opposition
		if bone_name.contains("Thumb"):
			pose.basis = pose.basis.rotated(Vector3.FORWARD, 0.2)
		
		_skeleton.set_bone_pose(bone_idx, pose)

# === Helper functions ===

func _find_skeleton(node: Node) -> Skeleton3D:
	if node is Skeleton3D:
		return node
	for child in node.get_children():
		var result: Skeleton3D = _find_skeleton(child)
		if result != null:
			return result
	return null

func _find_mixer(node: Node) -> AnimationMixer:
	if node is AnimationMixer:
		return node
	for child in node.get_children():
		var result: AnimationMixer = _find_mixer(child)
		if result != null:
			return result
	return null

func _find_bone_by_pattern(skel: Skeleton3D, patterns: Array) -> int:
	for i in range(skel.get_bone_count()):
		var name: String = skel.get_bone_name(i)
		for pattern in patterns:
			if name == pattern:
				return i
	return -1

func _find_finger_bones(skel: Skeleton3D, hand_prefix: String) -> Array[int]:
	var result: Array[int] = []
	var finger_names = ["Thumb", "Index", "Middle", "Ring", "Pinky"]
	for i in range(skel.get_bone_count()):
		var name: String = skel.get_bone_name(i)
		if name.begins_with(hand_prefix):
			for fn in finger_names:
				if name.contains(fn) and name.substr(hand_prefix.length(), fn.length()) == fn:
					result.append(i)
					break
	return result

func _get_mesh_height(node: Node) -> float:
	var aabb: AABB = AABB()
	_collect_aabb(node, aabb)
	if aabb.size == Vector3.ZERO:
		return 1.8  # fallback
	return aabb.size.y

func _collect_aabb(node: Node, aabb: AABB) -> void:
	if node is MeshInstance3D:
		var mesh_aabb: AABB = node.get_aabb()
		# Transform to node space
		mesh_aabb = node.transform * mesh_aabb
		if aabb.size == Vector3.ZERO:
			aabb.position = mesh_aabb.position
			aabb.size = mesh_aabb.size
		else:
			aabb = aabb.merge(mesh_aabb)
	for child in node.get_children():
		_collect_aabb(child, aabb)
