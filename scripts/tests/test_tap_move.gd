extends SceneTree
## Headless test: tap-to-move controls (no joystick).
## Run: godot --headless --script res://scripts/tests/test_tap_move.gd

var pass_count := 0
var fail_count := 0

func _initialize() -> void:
	_run()

func _run() -> void:
	var root := get_root()
	var dl : Node = load("res://scripts/data_layer.gd").new()
	dl.name = "DataLayer"
	root.add_child(dl)
	await process_frame

	# --- scene: camera + floor + touch controls + player ------------------
	var holder := Node3D.new()
	holder.name = "MainScene"
	root.add_child(holder)

	var cam := Camera3D.new()
	holder.add_child(cam)
	await process_frame
	cam.position = Vector3(0, 8, 10)
	cam.look_at(Vector3(0, 0, 0))
	cam.make_current()
	await process_frame

	var tc : Control = load("res://scripts/touch_controls.gd").new()
	tc.name = "TouchControls"
	holder.add_child(tc)

	var player : CharacterBody3D = load("res://scripts/player_controller.gd").new()
	player.name = "Player"
	player.global_position = Vector3(0, 0, 0)
	holder.add_child(player)
	await process_frame

	# --- screen -> ground math ------------------------------------------------
	var center: Vector2 = root.get_viewport().get_visible_rect().size / 2.0
	var ground: Vector3 = tc.screen_to_ground(center)
	_check("tap: center of screen raycasts onto the floor plane",
		ground != Vector3.INF and absf(ground.y) < 0.001)
	var off: Vector3 = tc.screen_to_ground(Vector2(40, 40))
	_check("tap: corner of screen still lands on the plane",
		off != Vector3.INF and absf(off.y) < 0.001)

	# --- tap event -> move target ----------------------------------------------
	var taps: Array = []
	tc.connect("tap_move", func(target): taps.append(target))
	var press := InputEventScreenTouch.new()
	press.index = 0
	press.position = center
	press.pressed = true
	tc._unhandled_input(press)
	_check("tap: press alone does not fire tap_move", taps.is_empty())
	var release := press.duplicate()
	release.pressed = false
	tc._unhandled_input(release)
	_check("tap: quick press+release fires tap_move", taps.size() == 1)
	player._on_tap_move(taps[0])
	_check("player: move target set from the tap",
		player.move_target != Vector3.INF and player.move_target.distance_to(taps[0]) < 0.001)

	# walk test: a realistic tap point ~3.6m from the player
	var far_tap: Vector3 = player.global_position + Vector3(3, 0, 2)
	player._on_tap_move(far_tap)

	# --- walk to target ---------------------------------------------------------
	var start := player.global_position
	for i in 240:   # 4s at 60fps, walk speed 5 m/s
		player._physics_process(1.0 / 60.0)
	var dist_left: float = player.global_position.distance_to(far_tap)
	_check("player: walks to the tap point (arrived within epsilon)",
		dist_left <= player.ARRIVE_EPSILON and start.distance_to(player.global_position) > 0.5)
	_check("player: target cleared after arrival", player.move_target == Vector3.INF)

	# --- long press = camera drag, not a move ------------------------------------
	taps.clear()
	var p2 := InputEventScreenTouch.new()
	p2.index = 0; p2.position = Vector2(100, 100); p2.pressed = true
	tc._unhandled_input(p2)
	var drags: Array = []
	tc.connect("camera_drag", func(d): drags.append(d))
	var drag := InputEventScreenDrag.new()
	drag.index = 0; drag.position = Vector2(180, 100)
	drag.relative = Vector2(80, 0)
	tc._unhandled_input(drag)
	var rel2 := InputEventScreenTouch.new()
	rel2.index = 0; rel2.position = Vector2(180, 100); rel2.pressed = false
	# simulate a long hold: backdate press_time
	tc.press_time = Time.get_ticks_msec() / 1000.0 - 1.0
	tc._unhandled_input(rel2)
	_check("drag: long press + movement drags camera, never fires tap_move",
		drags.size() > 0 and taps.is_empty())

	# --- small jitter still counts as a tap ------------------------------------
	taps.clear()
	var p3 := InputEventScreenTouch.new()
	p3.index = 0; p3.position = Vector2(300, 300); p3.pressed = true
	tc._unhandled_input(p3)
	var jig := InputEventScreenDrag.new()
	jig.index = 0; jig.position = Vector2(305, 300)
	jig.relative = Vector2(5, 0)
	tc._unhandled_input(jig)
	var rel3 := InputEventScreenTouch.new()
	rel3.index = 0; rel3.position = Vector2(305, 300); rel3.pressed = false
	tc._unhandled_input(rel3)
	_check("tap: sub-threshold jitter (5px) still taps, not drags", taps.size() == 1)

	print("=== TAP-MOVE HEADLESS: %d passed, %d failed ===" % [pass_count, fail_count])
	quit(1 if fail_count > 0 else 0)

func _check(label: String, ok: bool) -> void:
	if ok: pass_count += 1
	else: fail_count += 1
	print("[%s] %s" % ["PASS" if ok else "FAIL", label])
