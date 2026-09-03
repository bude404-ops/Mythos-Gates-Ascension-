extends SceneTree
## Headless test for the 4 Silverroot Kindred kits (Tolveth/Caelvarin/Vennaith/Corveth).
## Run: godot --headless --script res://scripts/tests/test_f005_kits.gd

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
	for n: String in ["tolveth_kit", "caelvarin_kit", "vennaith_kit", "corveth_kit"]:
		var k: Node = load("res://scripts/kits/%s.gd" % n).new()
		root.add_child(k)
		kits[n] = k
	await process_frame

	# -- Tolveth --------------------------------------------------------
	var to: Node = kits["tolveth_kit"]
	_check("Tolveth: DataLayer wiring", to.deity.get("name") == "Tolveth" and to.ability_db.size() == 3)
	var in5 = _mk(root, 4, 0); var out5 = _mk(root, 6, 0)
	var rs = to.rootslam(Vector3.ZERO, [in5, out5])
	_check("Tolveth: rootslam catches 4m, misses 6m, snare applied",
		rs["hits"].size() == 1 and in5.get_meta("snared") == true)
	_check("Tolveth: root-ridge barrier raised at impact",
		rs["ridge"]["hp"] == 200.0 and rs["ridge"]["length"] == 8.0)
	var sg = to.second_growth(1000.0)
	_check("Tolveth: second growth 25% self-heal (solo-first)",
		sg["heal"] == 250.0 and sg["heal_hook"] == "MG-BUFF-HEAL-SELF")
	var fr = to.the_forest_rises(Vector3(3, 0, 3), [in5, out5])
	_check("Tolveth: the forest rises — 4 grid-snapped walls, all rooted",
		fr["walls"].size() == 4 and fr["rooted"].size() == 2 and fr["grid_snap"] == 2.0)

	# -- Caelvarin --------------------------------------------------------
	var ca: Node = kits["caelvarin_kit"]
	_check("Caelvarin: DataLayer wiring", ca.deity.get("name") == "Caelvarin" and ca.ability_db.size() == 3)
	var t1: String = ca.tradeshot()["element"]
	var t2: String = ca.tradeshot()["element"]
	var t3: String = ca.tradeshot()["element"]
	_check("Caelvarin: tradeshot cycles fire->frost->shock",
		t1 == "fire" and t2 == "frost" and t3 == "shock")
	var fw = ca.footwork(Vector3.ZERO, Vector3(7, 0, 0))
	_check("Caelvarin: footwork 7m dash sets crit window",
		fw["dash"] == true and fw["crit_window"] == 3.0
		and fw["crit_hook"] == "MG-BUFF-CRIT-CHAIN")
	var mm = ca.master_of_the_moment()
	_check("Caelvarin: master of the moment fires all skills at once",
		mm["duration"] == 6.0 and mm["all_at_once"] == true)

	# -- Vennaith ----------------------------------------------------------
	var ve: Node = kits["vennaith_kit"]
	_check("Vennaith: DataLayer wiring", ve.deity.get("name") == "Vennaith" and ve.ability_db.size() == 3)
	var in4 = _mk(root, 3, 0); var out4 = _mk(root, 5, 0)
	var cb = ve.cinderbind(Vector3.ZERO, [in4, out4])
	_check("Vennaith: cinderbind flame-roots 3m, misses 5m",
		cb.size() == 1 and in4.get_meta("snared") == true)
	var rk = ve.rekindle(1000.0)
	_check("Vennaith: rekindle 30% self-heal (solo-first)",
		rk["heal"] == 300.0 and rk["heal_hook"] == "MG-BUFF-HEAL-SELF")
	in4.set_meta("enemy_buff", {"rage": 1})
	var sm = ve.the_smelting(Vector3.ZERO, [in4, out4])
	_check("Vennaith: smelting melts 50% + strips buffs in 12m",
		sm["affected"].size() == 2 and in4.get_meta("melt") == 0.50
		and in4.get_meta("enemy_buff") == {})

	# -- Corveth -------------------------------------------------------------
	var co: Node = kits["corveth_kit"]
	_check("Corveth: DataLayer wiring", co.deity.get("name") == "Corveth" and co.ability_db.size() == 3)
	var cf = co.crowfall(Vector3.ZERO, Vector3(10, 0, 0))
	_check("Corveth: crowfall 10m dive, untargetable in crow-form",
		cf["legal"] == true and cf["untargetable_hook"] == "MG-BUFF-UNTARGETABLE")
	var om = _mk(root, 8, 0)
	var wo = co.war_omen(om)
	om.set_meta("hp_frac", 0.05)
	_check("Corveth: war-omen marks, multiplier scales to 1.575x near death",
		wo["marked"] == true and is_equal_approx(co.omen_multiplier(0.05), 1.575)
		and co.omen_multiplier(1.0) == 1.10)
	om.set_meta("hp_frac", 0.10)
	var eb = co.the_end_of_the_battle([om, in4])
	_check("Corveth: end of the battle executes marked at 10% HP",
		eb["struck"].size() == 1 and eb["struck"][0]["executed"] == true)

	print("=== F005 HEADLESS: %d passed, %d failed ===" % [pass_count, fail_count])
	quit(1 if fail_count > 0 else 0)

func _mk(root: Node, x: float, z: float) -> Node3D:
	var n = Node3D.new()
	n.position = Vector3(x, 0, z)
	root.add_child(n)
	return n

func _check(label: String, ok: bool) -> void:
	if ok: pass_count += 1
	else: fail_count += 1
	print("[%s] %s" % ["PASS" if ok else "FAIL", label])
