extends SceneTree
## Headless test for the 4 Thousand Torii kits (Arashido/Yoruka/Hikarune/Mukage).
## Run: godot --headless --script res://scripts/tests/test_f004_kits.gd

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
	for n: String in ["arashido_kit", "yoruka_kit", "hikarune_kit", "mukage_kit"]:
		var k: Node = load("res://scripts/kits/%s.gd" % n).new()
		root.add_child(k)
		kits[n] = k
	await process_frame

	# -- Arashido -------------------------------------------------------
	var ar: Node = kits["arashido_kit"]
	_check("Arashido: DataLayer wiring", ar.deity.get("name") == "Arashido" and ar.ability_db.size() == 3)
	var e1 = _mk(root, 4, 0); var e2 = _mk(root, 4, 2); var e3 = _mk(root, 12, 0)
	var gs = ar.gale_step(Vector3.ZERO, Vector2(1, 0), [e1, e2, e3])
	_check("Arashido: gale step corridor hits 1 of 3, slow 0.70x",
		gs["hits"].size() == 1 and e1.get_meta("slow_mult") == 0.70
		and not e2.has_meta("slow_mult"))
	_check("Arashido: gale step grants self speed (solo-first)",
		gs["self_speed"] == 0.35 and gs["speed_hook"] == "MG-BUFF-SPEED-SELF")
	var sweep = ar.tempest_sweep(Vector3.ZERO, [e1, e3])
	_check("Arashido: tempest sweep knockback within 5m",
		sweep.size() == 1 and sweep[0]["distance"] <= 5.0)
	var storm = ar.the_storm_crosses(Vector3.ZERO, Vector2(1, 0), [e1, e2, e3])
	_check("Arashido: the storm crosses roots all within the front",
		storm["hits"].size() == 3 and e1.get_meta("snared") == true)

	# -- Yoruka ----------------------------------------------------------
	var yo: Node = kits["yoruka_kit"]
	_check("Yoruka: DataLayer wiring", yo.deity.get("name") == "Yoruka" and yo.ability_db.size() == 3)
	var volley = yo.crescent_volley()
	_check("Yoruka: crescent volley is exactly 3 piercing shots",
		volley["shots"].size() == 3 and volley["pierce"] == true)
	var far = _mk(root, 20, 0); var near = _mk(root, 10, 0)
	var mk = yo.moonmark(far, Vector3.ZERO)
	_check("Yoruka: moonmark grants range bonus beyond 15m",
		mk["marked"] == true and mk["range_bonus"] == 0.25
		and far.get_meta("moonmarked") == true)
	var mkn = yo.moonmark(near, Vector3.ZERO)
	_check("Yoruka: moonmark close target gets no range bonus", mkn["range_bonus"] == 0.0)
	var eclipse = yo.total_eclipse([far, near, e3])
	_check("Yoruka: total eclipse finds only marked targets",
		eclipse["marked"].size() == 1 and eclipse["marked"][0] == far
		and eclipse["arrows_always_hit_marked"] == true)

	# -- Hikarune ---------------------------------------------------------
	var hi: Node = kits["hikarune_kit"]
	_check("Hikarune: DataLayer wiring", hi.deity.get("name") == "Hikarune" and hi.ability_db.size() == 3)
	var st = hi.sunthread(Vector3.ZERO, Vector2(1, 0), [e1, e3])
	_check("Hikarune: sunthread roots forward enemy within 14m only",
		st.size() == 1 and st[0]["enemy"] == e1 and e1.get_meta("snared") == true)
	var weave = hi.radiant_weave(1000.0)
	_check("Hikarune: radiant weave 300 shield on 1000 HP, self-only",
		weave["shield"] == 300.0 and weave["shield_hook"] == "MG-BUFF-SHIELD-SELF")
	var illusion = _mk(root, 6, 0)
	illusion.set_meta("is_false_reflection", true)
	var dawn = hi.dawn_rewound(1000.0, [illusion, near])
	_check("Hikarune: dawn rewound heals 350 and purges only false reflections",
		dawn["heal"] == 350.0 and dawn["false_reflections_purged"].size() == 1
		and dawn["false_reflections_purged"][0] == illusion)

	# -- Mukage ------------------------------------------------------------
	var mu: Node = kits["mukage_kit"]
	_check("Mukage: DataLayer wiring", mu.deity.get("name") == "Mukage" and mu.ability_db.size() == 3)
	var blink = mu.spirit_step(Vector3.ZERO, Vector3(12, 0, 0))
	_check("Mukage: spirit-step 12m blink legal with 0.5s i-frames",
		blink["blink"] == true and blink["iframes"] == 0.5)
	var cut_real = mu.unmaking_cut(near)
	var cut_ref = mu.unmaking_cut(illusion)
	_check("Mukage: unmaking cut +50% only vs reflections",
		cut_ref["bonus"] == 0.50 and cut_real["bonus"] == 0.0)
	var thr = mu.the_threshold_closes([far, near, e3])
	_check("Mukage: the threshold closes catches marked only, -60% def",
		thr["caught"].size() == 1 and thr["caught"][0]["enemy"] == far
		and far.get_meta("melt") == 0.60 and thr["strikes_land_true"] == true)

	print("=== F004 HEADLESS: %d passed, %d failed ===" % [pass_count, fail_count])
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
