extends Control
## Ability HUD — 3 touch buttons for the selected deity's ability slots,
## an HP bar, and a status banner (WAVE CLEARED / DEFEATED). Casts route
## through the combat loop with auto-aim at the nearest enemy.
## Grim-dark palette to match the deity select.

const GOLD := Color(0.85, 0.70, 0.25)
const INK := Color(0.04, 0.05, 0.09, 0.85)
const BONE := Color(0.92, 0.90, 0.84)
const SLOT_KEYS := {"active_1": KEY_1, "active_2": KEY_2, "ultimate": KEY_3}
const AIM_RANGE := 30.0

var loop: Node
var deity_select: Node
var slot_buttons: Dictionary = {}   # slot -> Button
var hp_bar: ProgressBar
var hp_label: Label
var status_label: Label
var last_cast: Dictionary = {}       # slot -> {"result": ..., "flash": seconds left}

func _ready() -> void:
	set_anchors_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	loop = get_node_or_null("../../CombatLoop")
	deity_select = get_node_or_null("../DeitySelect")
	_build_hp()
	_build_slots()
	_build_switch_button()
	if loop:
		loop.connect("deity_changed", func(_id): _refresh_slot_labels())
		loop.connect("ability_cast", func(_id, slot, result): _on_ability_cast(slot, result))
		loop.connect("player_down", func(): _set_status("DEFEATED", Color(0.9, 0.2, 0.15)))
		loop.connect("wave_cleared", func(): _set_status("WAVE CLEARED", GOLD))
	_refresh_slot_labels()

# ------------------------------------------------------------------ layout
func _build_hp() -> void:
	hp_bar = ProgressBar.new()
	hp_bar.position = Vector2(16, 16)
	hp_bar.size = Vector2(240, 20)
	hp_bar.min_value = 0.0
	hp_bar.max_value = 1.0
	hp_bar.value = 1.0
	hp_bar.show_percentage = false
	var fill := StyleBoxFlat.new()
	fill.bg_color = Color(0.75, 0.18, 0.12)
	fill.set_corner_radius_all(4)
	hp_bar.add_theme_stylebox_override("fill", fill)
	add_child(hp_bar)

	hp_label = Label.new()
	hp_label.position = Vector2(16, 40)
	hp_label.add_theme_font_size_override("font_size", 14)
	hp_label.add_theme_color_override("font_color", BONE)
	add_child(hp_label)

	status_label = Label.new()
	status_label.set_anchors_preset(Control.PRESET_CENTER_TOP)
	status_label.offset_top = 60
	status_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	status_label.add_theme_font_size_override("font_size", 30)
	add_child(status_label)
	status_label.text = ""

func _build_slots() -> void:
	# bottom-right, stacked ABOVE the legacy attack/spellcast touch buttons
	# (joystick lives bottom-left in touch_controls.gd) — MOBA thumb layout
	var row := HBoxContainer.new()
	row.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
	row.offset_left = -16 - 3 * 96 - 2 * 12
	row.offset_right = -16
	row.offset_bottom = -180
	row.offset_top = -180 + 96
	row.add_theme_constant_override("separation", 12)
	add_child(row)
	for slot: String in ["active_1", "active_2", "ultimate"]:
		var btn := Button.new()
		btn.custom_minimum_size = Vector2(96, 96)
		btn.text = "%s\n—" % slot.to_upper()
		btn.add_theme_font_size_override("font_size", 13)
		btn.add_theme_color_override("font_color", BONE)
		btn.add_theme_color_override("font_hover_color", GOLD)
		btn.add_theme_color_override("font_disabled_color", Color(0.4, 0.4, 0.42))
		btn.add_theme_stylebox_override("normal", _box(Color(0.10, 0.11, 0.17, 0.92)))
		btn.add_theme_stylebox_override("hover", _box(Color(0.22, 0.19, 0.08, 0.95)))
		btn.add_theme_stylebox_override("pressed", _box(Color(0.30, 0.25, 0.10, 1.0)))
		if slot == "ultimate":
			btn.add_theme_stylebox_override("normal", _box(Color(0.16, 0.12, 0.05, 0.95)))
			btn.add_theme_stylebox_override("hover", _box(Color(0.32, 0.24, 0.08, 1.0)))
		btn.pressed.connect(func(): cast_slot(slot))
		row.add_child(btn)
		slot_buttons[slot] = btn

func _build_switch_button() -> void:
	var btn := Button.new()
	btn.set_anchors_preset(Control.PRESET_TOP_RIGHT)
	btn.offset_left = -128
	btn.offset_top = 16
	btn.offset_right = -16
	btn.offset_bottom = 52
	btn.text = "SWITCH DEITY"
	btn.add_theme_color_override("font_color", BONE)
	btn.add_theme_color_override("font_hover_color", GOLD)
	btn.add_theme_stylebox_override("normal", _box(INK))
	btn.add_theme_stylebox_override("hover", _box(Color(0.22, 0.19, 0.08, 0.95)))
	btn.pressed.connect(func():
		if deity_select: deity_select.show())
	add_child(btn)

# ------------------------------------------------------------------ data flow
## Labels track the selected kit's real ability names from the DataLayer.
func _refresh_slot_labels() -> void:
	if loop == null or loop.kit == null: return
	var d: Dictionary = DataLayer.deities.get(loop.deity_id, {})
	var i := 0
	for slot: String in ["active_1", "active_2", "ultimate"]:
		var ab: Dictionary = DataLayer.abilities.get(d.get("ability_ids", ["", "", ""])[i], {})
		var btn: Button = slot_buttons.get(slot)
		if btn:
			btn.text = "%s\n%s" % [slot.to_upper().replace("_", " "), ab.get("name", "—")]
		i += 1

func _on_ability_cast(slot: String, result: Dictionary) -> void:
	last_cast[slot] = {"result": result, "flash": 0.35}
	var btn: Button = slot_buttons.get(slot)
	if btn and result.get("cast", false) == false:
		btn.text += "\n✕"

# ------------------------------------------------------------------ casting
## Auto-aim: nearest living enemy, else straight ahead. Public for tests.
func aim_point() -> Vector3:
	if loop == null or loop.player == null:
		return Vector3.ZERO
	var nearest = loop._nearest(loop.player.position, AIM_RANGE)
	if nearest != null:
		return nearest.position
	return loop.player.position + Vector3(0, 0, -10.0)

func cast_slot(slot: String) -> Dictionary:
	if loop == null: return {"cast": false, "why": "no loop"}
	var result: Dictionary = loop.cast(slot, aim_point())
	return result

# ------------------------------------------------------------------ update
func _process(delta: float) -> void:
	# HP bar tracks player hp fraction
	if loop and loop.player != null:
		var frac: float = loop.player.get_meta("hp_frac", 1.0)
		hp_bar.value = frac
		hp_label.text = "%s — %d / %d HP" % [
			DataLayer.deities.get(loop.deity_id, {}).get("name", "?"),
			int(loop.player.get_meta("hp", 0.0)),
			int(loop.player.get_meta("hp_max", 1000.0))]
	# cast flash fade
	for slot in last_cast.keys():
		last_cast[slot]["flash"] = maxf(last_cast[slot]["flash"] - delta, 0.0)

func _box(color: Color) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(8)
	sb.set_border_width_all(1)
	sb.border_color = Color(0.55, 0.45, 0.15, 0.8)
	return sb

func _set_status(text: String, color: Color) -> void:
	status_label.text = text
	status_label.add_theme_color_override("font_color", color)

## Desktop keys 1/2/3 fire the slots; Q reopens deity select.
func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		for slot: String in SLOT_KEYS:
			if event.keycode == SLOT_KEYS[slot]:
				cast_slot(slot)
		if event.keycode == KEY_Q and deity_select:
			deity_select.show()
