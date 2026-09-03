extends SceneTree
## Headless test for the 4 Laurel Agon kits (Thrasyles/Therissa/Aethrokles/Sophrona).
## Run: godot --headless --script res://scripts/tests/test_f003_kits.gd

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
	for n: String in ["thrasyles_kit", "therissa_kit", "aethrokles_kit", "sophrona_kit"]:
		var k: Node = load("res://scripts/kits/%s.gd" % n).new()
		root.add_child(k)
		kits[n] = k
	await process_frame

	# -- Thrasyles -------------------------------------------------------
	var th: Node = kits["thrasyles_kit"]
	_check("Thrasyles: DataLayer wiring", th.deity.get("name") == "Thrasyles" and th.ability_db.size() == 3)
	var foe = _mk(root, 4, 0)
	var claim = th.duelists_claim(foe, Vector3.ZERO)
	_check("Thrasyles: duelist's claim marks the foe", claim["claimed"] == foe)
	_check("Thrasyles: claim multiplier +25% from him, -25% from others",
		is_equal_approx(th.claim_multiplier(th, foe), 1.25)
		and is_equal_approx(th.claim_multiplier(_mk(root, 9, 9), foe), 0.75))
	var fl = th.flourish()
	_check("Thrasyles: flourish opens a 3s guaranteed-crit window",
		fl["crit_window"] == 3.0 and fl["crit_hook"] == "MG-BUFF-CRIT-CHAIN")
	var vd = th.champions_verdict(Vector3.ZERO, Vector3.ZERO)
	_check("Thrasyles: champion's verdict +100% inside the duel circle",
		vd["bonus"] == 1.00 and vd["radius"] == 6.0)

	# -- Therissa ----------------------------------------------------------
	var te: Node = kits["therissa_kit"]
	_check("Therissa: DataLayer wiring", te.deity.get("name") == "Therissa" and te.ability_db.size() == 3)
	var snared = _mk(root, 3, 0)
	var ls = te.laurel_snare(snared)
	_check("Therissa: laurel snare roots for 2s",
		ls["snared"] == true and snared.get_meta("snare_timer") == 2.0)
	var stacks = 0
	for i in 5: stacks = te.hunters_pace_hit()
	_check("Therissa: hunter's pace caps at 3 stacks, +10% each",
		stacks == 3 and is_equal_approx(te.pace_multiplier(), 1.30))
	var wsl = te.the_witness_shot(snared, 250.0)
	_check("Therissa: witness shot kills under 300, restores 10 faith",
		wsl["kills"] == true and wsl["faith"] == 10.0)

	# -- Aethrokles ---------------------------------------------------------
	var ae: Node = kits["aethrokles_kit"]
	_check("Aethrokles: DataLayer wiring", ae.deity.get("name") == "Aethrokles" and ae.ability_db.size() == 3)
	var silenced = _mk(root, 2, 2)
	var oz = ae.ostracize(silenced)
	_check("Aethrokles: ostracize silences + strips buffs, 5s exile",
		silenced.get_meta("silenced") == true and oz["duration"] == 5.0)
	var burned = _mk(root, 6, 0)
	ae.sky_writ(burned)
	_check("Aethrokles: sky-writ applies a growing DOT",
		burned.get_meta("dot_grow_hook") == "MG-BUFF-DOT-GROW")
	var sky = ae.the_uncontested_sky([{"type": "pillar"}, {"type": "arch"}], [burned])
	_check("Aethrokles: uncontested sky sweeps from cover, enemies airborne",
		sky["airborne"].size() == 1)

	# -- Sophrona ------------------------------------------------------------
	var so: Node = kits["sophrona_kit"]
	_check("Sophrona: DataLayer wiring", so.deity.get("name") == "Sophrona" and so.ability_db.size() == 3)
	var marked = _mk(root, 5, 5)
	var pr = so.premise(marked)
	_check("Sophrona: premise marks the target", pr["marked"] == true)
	var cn = so.conclusion(Vector3.ZERO, marked)
	_check("Sophrona: conclusion bonus vs marked", cn["bonus"] > 0.0)
	var plan = so.the_perfect_plan(3)
	_check("Sophrona: perfect plan scales with tracked kills", plan["kills"] == 3)

	print("=== F003 HEADLESS: %d passed, %d failed ===" % [pass_count, fail_count])
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
