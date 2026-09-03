extends Control
## Deity Select — full-screen overlay listing all 32 deities grouped by
## faction, straight from the DataLayer. Tap a deity to take them into
## the combat loop. Grim-dark palette: ink navy, gold, bone.

signal deity_selected(deity_id: String)

const FACTION_HEADER_COLOR := Color(0.85, 0.70, 0.25)          # gold
const PANEL_BG := Color(0.04, 0.05, 0.09, 0.96)               # ink navy
const BUTTON_BG := Color(0.10, 0.11, 0.17, 1.0)
const BUTTON_HOVER := Color(0.22, 0.19, 0.08, 1.0)             # gold-tinged
const TEXT_BONE := Color(0.92, 0.90, 0.84)

var loop: Node
var deity_buttons: Dictionary = {}   # deity_id -> Button
var faction_sections: int = 0

func _ready() -> void:
	set_anchors_preset(Control.PRESET_FULL_RECT)
	loop = get_node_or_null("../../CombatLoop")
	_build()
	if loop and loop.kit != null:
		hide()   # a deity is already locked in — HUD's switch button reopens this

## Build the grid: one section per faction, 4 deity buttons each.
## Data-driven — everything comes from the DataLayer.
func _build() -> void:
	for c in get_children(): c.queue_free()
	var facade := PanelContainer.new()
	facade.set_anchors_preset(Control.PRESET_FULL_RECT)
	var sb := StyleBoxFlat.new()
	sb.bg_color = PANEL_BG
	facade.add_theme_stylebox_override("panel", sb)
	add_child(facade)

	var scroll := ScrollContainer.new()
	scroll.set_anchors_preset(Control.PRESET_FULL_RECT)
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	facade.add_child(scroll)

	var list := VBoxContainer.new()
	list.add_theme_constant_override("separation", 18)
	scroll.add_child(list)

	var title := Label.new()
	title.text = "CHOOSE YOUR DEITY"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 34)
	title.add_theme_color_override("font_color", FACTION_HEADER_COLOR)
	list.add_child(title)

	faction_sections = 0
	for fid: String in DataLayer.factions.keys():
		var faction: Dictionary = DataLayer.factions[fid]
		var section := VBoxContainer.new()
		section.add_theme_constant_override("separation", 6)
		list.add_child(section)
		faction_sections += 1

		var header := Label.new()
		header.text = "%s   ·   %s" % [faction.get("name", fid), faction.get("epithet", "")]
		header.add_theme_font_size_override("font_size", 22)
		header.add_theme_color_override("font_color", FACTION_HEADER_COLOR)
		section.add_child(header)

		var row := HBoxContainer.new()
		row.add_theme_constant_override("separation", 8)
		section.add_child(row)

		for did: String in _deities_of(fid):
			var d: Dictionary = DataLayer.deities[did]
			var btn := Button.new()
			btn.custom_minimum_size = Vector2(0, 64)
			btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			btn.text = "%s\n%s" % [d.get("name", did), d.get("epithet", "")]
			btn.tooltip_text = "%s — %s (%s)" % [d.get("name", ""), d.get("role", ""), d.get("weapon", "")]
			btn.add_theme_color_override("font_color", TEXT_BONE)
			btn.add_theme_color_override("font_hover_color", FACTION_HEADER_COLOR)
			btn.add_theme_stylebox_override("normal", _box(BUTTON_BG))
			btn.add_theme_stylebox_override("hover", _box(BUTTON_HOVER))
			btn.add_theme_stylebox_override("pressed", _box(BUTTON_HOVER))
			btn.set_meta("deity_id", did)
			btn.pressed.connect(func(): select_deity(String(btn.get_meta("deity_id"))))
			row.add_child(btn)
			deity_buttons[did] = btn

## Deity ids belonging to a faction, in registry order.
func _deities_of(fid: String) -> Array:
	var out: Array = []
	for did: String in DataLayer.deities.keys():
		if DataLayer.deities[did].get("faction_id", "") == fid:
			out.append(did)
	return out

## Select + route into the loop. Public so headless tests drive it directly.
func select_deity(did: String) -> bool:
	if loop == null or not loop.select_deity(did):
		return false
	emit_signal("deity_selected", did)
	hide()
	return true

func _box(color: Color) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(6)
	sb.set_border_width_all(1)
	sb.border_color = Color(0.55, 0.45, 0.15, 0.8)
	return sb

func _input(event: InputEvent) -> void:
	if visible and event is InputEventKey and event.pressed:
		if event.keycode == KEY_ESCAPE:
			hide()
