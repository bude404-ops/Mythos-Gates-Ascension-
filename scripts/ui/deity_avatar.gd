extends MeshInstance3D
## Placeholder deity avatar — a faction-tinted capsule that stands in for the
## chosen deity until real GLB models arrive via the locked 3-step pipeline
## (Meshy -> Mixamo -> Godot). Model-agnostic on purpose.

const FACTION_TINT := {
	"MG-FACTION-001": Color(0.85, 0.70, 0.25),   # Meridian Court — sun-gold
	"MG-FACTION-002": Color(0.35, 0.55, 0.85),   # Stormmoot — storm-blue
	"MG-FACTION-003": Color(0.30, 0.70, 0.35),   # Laurel Agon — laurel-green
	"MG-FACTION-004": Color(0.90, 0.45, 0.25),   # Thousand Torii — vermillion
	"MG-FACTION-005": Color(0.55, 0.75, 0.45),   # Silverroot Kindred — silver-sage
	"MG-FACTION-006": Color(0.95, 0.90, 0.55),   # Radiant Vigil — radiant ivory
	"MG-FACTION-007": Color(0.45, 0.45, 0.50),   # Black-Iron Dominion — cold iron
	"MG-FACTION-008": Color(0.20, 0.55, 0.40),   # Deepgreen — deep moss
}
const DEFAULT_TINT := Color(0.85, 0.70, 0.25)

@onready var _loop: Node = get_node_or_null("../../CombatLoop")

func _ready() -> void:
	var mesh := CapsuleMesh.new()
	mesh.radius = 0.35
	mesh.height = 1.6
	self.mesh = mesh
	position.y = 0.8

	var mat := StandardMaterial3D.new()
	mat.albedo_color = DEFAULT_TINT
	mat.emission_enabled = true
	mat.emission = DEFAULT_TINT
	mat.emission_energy_multiplier = 0.35
	mat.roughness = 0.6
	mat.metallic = 0.2
	set_surface_override_material(0, mat)

	if _loop and _loop.has_signal("deity_changed"):
		_loop.deity_changed.connect(_on_deity_changed)
		set_deity(_loop.deity_id)

## Tint the capsule to the selected deity's faction color.
func set_deity(deity_id: String) -> void:
	var mat := get_active_material(0) as StandardMaterial3D
	if mat == null: return
	var tint: Color = FACTION_TINT.get(_faction_of(deity_id), DEFAULT_TINT)
	mat.albedo_color = tint
	mat.emission = tint

func _on_deity_changed(deity_id: String) -> void:
	set_deity(deity_id)

func _faction_of(deity_id: String) -> String:
	var d: Dictionary = DataLayer.deities.get(deity_id, {})
	return String(d.get("faction_id", ""))
