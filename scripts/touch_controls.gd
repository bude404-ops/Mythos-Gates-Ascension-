extends Control

# Mobile touch controls for Mythos Gates
# Left side: virtual joystick for movement
# Right side: drag to orbit camera
# Buttons: Attack, Spellcast

signal move_vector_changed(vector: Vector2)
signal camera_drag(delta: Vector2)
signal attack_pressed()
signal spellcast_pressed()
signal zoom_changed(delta: float)

# Joystick
var joystick_base: Control
var joystick_knob: Control
var joystick_active: bool = false
var joystick_touch_id: int = -1
var joystick_center: Vector2 = Vector2.ZERO
var joystick_max_radius: float = 80.0

# Camera drag
var camera_drag_active: bool = false
var camera_drag_id: int = -1
var last_drag_pos: Vector2 = Vector2.ZERO

# Pinch zoom
var pinch_active: bool = false
var pinch_initial_dist: float = 0.0
var pinch_last_dist: float = 0.0

# UI elements
var attack_button: Control
var spellcast_button: Control

func _ready():
	# Only show on touch devices
	if not DisplayServer.is_touchscreen_available() and OS.has_feature("pc"):
		visible = false
		return
	
	_create_joystick()
	_create_action_buttons()
	
	# Make sure this control receives input
	mouse_filter = Control.MOUSE_FILTER_STOP

func _create_joystick():
	# Joystick base (outer circle)
	joystick_base = Control.new()
	joystick_base.size = Vector2(160, 160)
	joystick_base.position = Vector2(40, DisplayServer.window_get_size().y - 200)
	joystick_base.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(joystick_base)
	
	# Draw the base circle
	var base_draw = Control.new()
	base_draw.draw.connect(_draw_joystick_base)
	base_draw.mouse_filter = Control.MOUSE_FILTER_IGNORE
	joystick_base.add_child(base_draw)
	
	# Joystick knob (inner circle)
	joystick_knob = Control.new()
	joystick_knob.size = Vector2(70, 70)
	joystick_knob.position = Vector2(45, 45) # Center of base
	joystick_knob.mouse_filter = Control.MOUSE_FILTER_IGNORE
	joystick_base.add_child(joystick_knob)
	
	var knob_draw = Control.new()
	knob_draw.draw.connect(_draw_joystick_knob)
	knob_draw.mouse_filter = Control.MOUSE_FILTER_IGNORE
	joystick_knob.add_child(knob_draw)

func _draw_joystick_base(control: Control):
	var center = control.size / 2
	var radius = 75
	# Semi-transparent dark circle
	control.draw_arc(center, radius, 0, TAU, 64, Color(0.4, 0.35, 0.2, 0.4), 4)
	control.draw_arc(center, radius, 0, TAU, 64, Color(0.6, 0.5, 0.3, 0.15), 2)

func _draw_joystick_knob(control: Control):
	var center = control.size / 2
	var radius = 30
	# Gold/bronze knob
	control.draw_circle(center, radius, Color(0.5, 0.4, 0.15, 0.6))
	control.draw_arc(center, radius, 0, TAU, 32, Color(0.7, 0.55, 0.2, 0.8), 3)

func _create_action_buttons():
	var screen_size = DisplayServer.window_get_size()
	
	# Attack button
	attack_button = _make_action_button("⚔️", Color(0.7, 0.3, 0.2, 0.7))
	attack_button.position = Vector2(screen_size.x - 130, screen_size.y - 150)
	attack_button.gui_input.connect(_on_attack_input)
	add_child(attack_button)
	
	# Spellcast button
	spellcast_button = _make_action_button("✦", Color(0.3, 0.4, 0.7, 0.7))
	spellcast_button.position = Vector2(screen_size.x - 220, screen_size.y - 110)
	spellcast_button.gui_input.connect(_on_spellcast_input)
	add_child(spellcast_button)

func _make_action_button(label: String, color: Color) -> Control:
	var btn = Control.new()
	btn.size = Vector2(80, 80)
	btn.mouse_filter = Control.MOUSE_FILTER_STOP
	
	var drawer = Control.new()
	drawer.draw.connect(func(ctrl: Control):
		var center = ctrl.size / 2
		ctrl.draw_circle(center, 36, color)
		ctrl.draw_arc(center, 36, 0, TAU, 32, Color(1, 1, 1, 0.4), 2)
		# Draw the label text
		var font = ThemeDB.fallback_font
		var text_size = font.get_string_size(label, 28)
		ctrl.draw_string(font, center + Vector2(-text_size.x/2, 10), label, HORIZONTAL_ALIGNMENT_CENTER, -1, 28, Color(1, 1, 1, 0.9))
	)
	drawer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	btn.add_child(drawer)
	
	return btn

func _on_attack_input(event: InputEvent):
	if event is InputEventScreenTouch and event.pressed:
		attack_pressed.emit()

func _on_spellcast_input(event: InputEvent):
	if event is InputEventScreenTouch and event.pressed:
		spellcast_pressed.emit()

func _input(event: InputEvent):
	if event is InputEventScreenTouch:
		_handle_touch(event)
	elif event is InputEventScreenDrag:
		_handle_drag(event)
	elif event is InputEventMagnifyGesture:
		_handle_pinch(event)

func _handle_touch(event: InputEventScreenTouch):
	var pos = event.position
	
	if event.pressed:
		# Check if touch is on left half of screen (joystick zone)
		if pos.x < DisplayServer.window_get_size().x * 0.5 and joystick_touch_id == -1:
			joystick_touch_id = event.index
			joystick_active = true
			joystick_center = pos
			joystick_base.position = pos - Vector2(80, 80)
			joystick_base.visible = true
			_update_knob(pos)
		
		# Check if touch is on right half (camera zone) and not on a button
		if pos.x >= DisplayServer.window_get_size().x * 0.5 and camera_drag_id == -1:
			# Make sure it's not on the action buttons
			if not _is_on_button(pos):
				camera_drag_id = event.index
				camera_drag_active = true
				last_drag_pos = pos
	else:
		if event.index == joystick_touch_id:
			joystick_touch_id = -1
			joystick_active = false
			move_vector_changed.emit(Vector2.ZERO)
			# Reset knob to center
			joystick_knob.position = Vector2(45, 45)
		if event.index == camera_drag_id:
			camera_drag_id = -1
			camera_drag_active = false

func _handle_drag(event: InputEventScreenDrag):
	if event.index == joystick_touch_id and joystick_active:
		_update_knob(event.position)
	elif event.index == camera_drag_id and camera_drag_active:
		var delta = event.position - last_drag_pos
		camera_drag.emit(delta)
		last_drag_pos = event.position

func _handle_pinch(event: InputEventMagnifyGesture):
	zoom_changed.emit((event.factor - 1.0) * 2.0)

func _update_knob(touch_pos: Vector2):
	var offset = touch_pos - joystick_center
	var dist = offset.length()
	
	if dist > joystick_max_radius:
		offset = offset.normalized() * joystick_max_radius
	
	# Move knob
	joystick_knob.position = Vector2(45, 45) + offset
	
	# Emit normalized movement vector
	var move_vector = offset / joystick_max_radius
	move_vector_changed.emit(move_vector)

func _is_on_button(pos: Vector2) -> bool:
	if attack_button and attack_button.get_global_rect().has_point(pos):
		return true
	if spellcast_button and spellcast_button.get_global_rect().has_point(pos):
		return true
	return false
