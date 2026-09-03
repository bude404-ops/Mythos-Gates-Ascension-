extends SceneTree
## Headless test for the 3 remaining Meridian kits (Djekhur/Shemris/Amekhet).
## Run: godot --headless --script res://scripts/tests/test_f001_kits.gd
## (Khaveth is covered by test_khaveth_poc.gd)

var pass_count = 0
var fail_count = 0

func _initialize() -> void:
	_run()

func _run() -> void:
	var root = get_root()
	var dl : Node = load("res://scripts/data_layer.gd").new()
	dl.name = "DataLayer"
	root.add_child(dl)
	await process_frame

	var kits = {}
	for n: String in ["djekhur_kit", "shemris_kit", "amekhet_kit"]:
		var k: Node = load("res://scripts/kits/%s.gd" % n).new()
		root.add_child(k)
		kits[n] = k
	await process_frame

	# -- Djekhur --------------------------------------------------------
	var dj: Node = kits["djekhur_kit"]
	_check("Djekhur: DataLayer wiring (name + 3 abilities)",
		dj.deity.get("name", "") == "Djekhur" and dj.ability_db.size() == 3)
	var d1 = Node3D.new(); var d2 = Node3D.new(); var d3 = Node3D.new()
	d1.position = Vector3(4, 0, 0); d2.position = Vector3(4, 0, 3); d3.position = Vector3(10, 0, 0)
	root.add_child(d1); root.add_child(d2); root.add_child(d3)
	var dash = dj.sand_gale_dash(Vector3.ZERO, Vector2(1, 0), [d1, d2, d3])
	_check("Djekhur: dash hits on-axis enemy only", dash["hits"].size() == 1 and dash["hits"][0]["enemy"] == d1)
	_check("Djekhur: shred applied (1 stack)", int(d1.get_meta("armor_shred")) == 1)
	dj.sand_gale_dash(Vector3.ZERO, Vector2(1, 0), [d1])
	dj.sand_gale_dash(Vector3.ZERO, Vector2(1, 0), [d1])
	_check("Djekhur: shred capped at 2 -> 0.60x defense", is_equal_approx(dj.shred_multiplier(d1), 0.60))
	d1.position = Vector3(6, 0, 0)
	var swept = dj.scouring_sweep(Vector3.ZERO, [d1, d3])
	_check("Djekhur: sweep hits 6m enemy, misses 10m enemy", swept.size() == 1 and swept[0]["enemy"] == d1)
	for e: Node3D in [d1, d2]:
		e.set_meta("enemy_buff", {"glare_might": true})
	var terrain = [{"hostile": true, "type": "light_patch"}, {"hostile": false, "type": "sun_spot"}]
	var wind = dj.erasing_wind([d1, d2], terrain)
	_check("Djekhur: ult strips 2 buffs + erases hostile light-patch only",
		wind["buffs_stripped"] == 2 and wind["terrain_erased"].size() == 1)

	# -- Shemris ---------------------------------------------------------
	var sh: Node = kits["shemris_kit"]
	_check("Shemris: DataLayer wiring (name + 3 abilities)",
		sh.deity.get("name", "") == "Shemris" and sh.ability_db.size() == 3)
	var de = sh.mirage_double()
	_check("Shemris: decoy spawns (50 HP, 5s)", de["active"] == true and de["hp"] == 50.0)
	var ab1 = sh.decoy_absorb(30.0)
	var ab2 = sh.decoy_absorb(30.0)
	_check("Shemris: decoy absorbs 2 hits then breaks",
		ab1["absorbed"] == true and ab2["decoy_destroyed"] == true and sh.decoy_active == false)
	var ab3 = sh.decoy_absorb(10.0)
	_check("Shemris: destroyed decoy absorbs nothing", ab3["absorbed"] == false)
	var v1 = sh.bent_light_volley(false)
	var v2 = sh.bent_light_volley(true)
	_check("Shemris: bent light 1.25x, decoy synergy 1.75x",
		is_equal_approx(v1["damage_mult"], 1.25) and is_equal_approx(v2["damage_mult"], 1.75))
	var ult = sh.mirage_volley()
	_check("Shemris: Mirage Volley = 100 + 12*15 = 280", is_equal_approx(ult["true_shot_damage"], 280.0))

	# -- Amekhet ---------------------------------------------------------
	var am: Node = kits["amekhet_kit"]
	_check("Amekhet: DataLayer wiring (name + 3 abilities)",
		am.deity.get("name", "") == "Amekhet" and am.ability_db.size() == 3)
	var spots: Array[Vector3] = [Vector3(3, 0, 0), Vector3(12, 0, 0), Vector3(7, 0, 7)]
	var step = am.shadow_step(Vector3.ZERO, spots)
	_check("Amekhet: shadow-step blinks to nearest in-range sun-spot (3m)",
		step["blinked"] == true and step["destination"] == Vector3(3, 0, 0))
	var nostep = am.shadow_step(Vector3.ZERO, [Vector3(12, 0, 0)])
	_check("Amekhet: no blink when no sun-spot within 9m", nostep["blinked"] == false)
	var am1 = am.noonshade_mark(d1)
	var am2 = am.noonshade_mark(d1)
	am.noonshade_mark(d1); am.noonshade_mark(d1); am.noonshade_mark(d1)
	_check("Amekhet: Noonshade capped at 4 stacks -> 1.60x",
		am2 == 2 and int(d1.get_meta("noonshade_stacks")) == 4
		and is_equal_approx(am.noonshade_multiplier(d1), 1.60))
	var ault = am.high_noon_eclipsed()
	_check("Amekhet: ult = 5s untargetable + all-crit",
		ault["untargetable"] == true and ault["all_critical"] == true and ault["duration"] == 5.0)

	print("=== F001 KITS TEST: %d passed, %d failed ===" % [pass_count, fail_count])
	quit(1 if fail_count > 0 else 0)

func _check(label: String, ok: bool) -> void:
	print(("[PASS] " if ok else "[FAIL] ") + label)
	if ok: pass_count += 1
	else: fail_count += 1
