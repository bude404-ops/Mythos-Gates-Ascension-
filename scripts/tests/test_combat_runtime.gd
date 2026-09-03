extends SceneTree
## Headless test for the combat runtime (scripts/combat_runtime.gd).
## Run: godot --headless --script res://scripts/tests/test_combat_runtime.gd

var pass_count := 0
var fail_count := 0

func _initialize() -> void:
	_run()

func _run() -> void:
	var root := get_root()
	var rt : Node = load("res://scripts/combat_runtime.gd").new()
	rt.name = "CombatManager"
	root.add_child(rt)

	# -- snare roots, then expires ------------------------------------
	var e1 := _mk(root, 0, 0)
	rt.register(e1)
	e1.set_meta("snared", true); e1.set_meta("snare_timer", 0.5)
	_check("snare: move 0 while rooted", rt.move_multiplier(e1) == 0.0)
	for i in 10: rt._tick(0.1)   # 1.0s
	_check("snare: expires, move restored", e1.get_meta("snared") == false
		and rt.move_multiplier(e1) == 1.0)

	# -- melt amplifies damage, then clears ----------------------------
	var e2 := _mk(root, 1, 0)
	rt.register(e2)
	e2.set_meta("hp", 1000.0); e2.set_meta("hp_max", 1000.0)
	e2.set_meta("melt", 0.60); e2.set_meta("melt_timer", 0.5)
	var dealt: float = rt.apply_damage(null, e2, 100.0)
	_check("melt: 100 base -> 160 applied", is_equal_approx(dealt, 160.0))
	for i in 10: rt._tick(0.1)
	_check("melt: clears, multiplier back to 1.0",
		e2.get_meta("melt") == 0.0 and rt.damage_taken_multiplier(e2) == 1.0)

	# -- writ debt compounds per second, caps --------------------------
	var e3 := _mk(root, 2, 0)
	rt.register(e3)
	e3.set_meta("writmarked", true)
	for i in 50: rt._tick(0.1)   # 5s
	_check("writ: 5s held = 1.25x multiplier",
		is_equal_approx(rt.damage_taken_multiplier(e3), 1.25))
	for i in 200: rt._tick(0.1)  # +20s
	_check("writ: capped at 1.60x",
		is_equal_approx(rt.damage_taken_multiplier(e3), 1.60))

	# -- debtfire burns 1x/s with 20% interest -------------------------
	var e4 := _mk(root, 3, 0)
	rt.register(e4)
	e4.set_meta("hp", 1000.0); e4.set_meta("hp_max", 1000.0)
	e4.set_meta("debt_dot", 40.0)
	for i in 20: rt._tick(0.1)   # 2.0s -> 2 burns (40 + 48)
	_check("debtfire: 2 burns applied (88 damage)",
		is_equal_approx(e4.get_meta("hp"), 912.0))
	_check("debtfire: value compounded to 57.6",
		is_equal_approx(e4.get_meta("debt_dot"), 57.6))

	# -- omen scales with missing health ------------------------------
	var e5 := _mk(root, 4, 0)
	rt.register(e5)
	e5.set_meta("hp", 500.0); e5.set_meta("hp_max", 1000.0)
	e5.set_meta("hp_frac", 0.5); e5.set_meta("omenmarked", true)
	_check("omen: half health = 1.35x",
		is_equal_approx(rt.damage_taken_multiplier(e5), 1.35))

	# -- i-frames block damage -----------------------------------------
	var e6 := _mk(root, 5, 0)
	rt.register(e6)
	e6.set_meta("hp", 100.0); e6.set_meta("hp_max", 100.0)
	e6.set_meta("iframes", 0.3)
	_check("iframes: damage returns 0", rt.apply_damage(null, e6, 50.0) == 0.0)
	for i in 5: rt._tick(0.1)
	_check("iframes: expire, damage lands",
		rt.targetable(e6) and rt.apply_damage(null, e6, 10.0) == 10.0)

	# -- barriers: pool + fog sight -----------------------------------
	var b1: Dictionary = rt.spawn_barrier(Vector3.ZERO, Vector2(1, 0), 8.0, 150.0, "fog")
	var b2: Dictionary = rt.spawn_barrier(Vector3(2, 0, 2), Vector2(1, 0), 8.0, 250.0, "stone")
	_check("barriers: fog blocks sight, stone does not",
		b1["blocks_sight"] == true and b2["blocks_sight"] == false)
	rt.damage_barrier(b1, 150.0)
	_check("barriers: destroyed when hp hits 0",
		b1["hp"] == 0.0 and not rt.barriers.has(b1))

	# -- bargains: open and resolve -------------------------------------
	var g: Dictionary = rt.open_bargain("MG-DEITY-026", {"offer": "power now", "price": "20% later"})
	_check("bargain: opens with unique id", g["open"] == true and g["id"].begins_with("MG-DEITY-026"))
	rt.resolve_bargain(g, true)
	_check("bargain: resolve closes and records acceptance",
		g["open"] == false and g["accepted"] == true and not rt.bargains.has(g))

	print("=== COMBAT RUNTIME HEADLESS: %d passed, %d failed ===" % [pass_count, fail_count])
	quit(1 if fail_count > 0 else 0)

func _mk(root: Node, x: float, z: float) -> Node3D:
	var n := Node3D.new()
	n.position = Vector3(x, 0, z)
	root.add_child(n)
	return n

func _check(label: String, ok: bool) -> void:
	if ok: pass_count += 1
	else: fail_count += 1
	print("[%s] %s" % ["PASS" if ok else "FAIL", label])
