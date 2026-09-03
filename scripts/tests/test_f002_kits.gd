extends SceneTree
## Headless test for the 4 Stormmoot kits (Halmarr/Falwyn/Vargrim/Estrith).
## Run: godot --headless --script res://scripts/tests/test_f002_kits.gd

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
	for n: String in ["halmarr_kit", "falwyn_kit", "vargrim_kit", "estrith_kit"]:
		var k: Node = load("res://scripts/kits/%s.gd" % n).new()
		root.add_child(k)
		kits[n] = k
	await process_frame

	# -- Halmarr --------------------------------------------------------
	var ha: Node = kits["halmarr_kit"]
	_check("Halmarr: DataLayer wiring", ha.deity.get("name") == "Halmarr" and ha.ability_db.size() == 3)
	var e1 = _mk(root, 7, 0); var e2 = _mk(root, 9, 1); var e3 = _mk(root, 1, 1)
	var ts = ha.thunderstep(Vector3.ZERO, Vector2(1, 0), [e1, e2, e3])
	_check("Halmarr: thunderstep lands at (7,0), snares 2 of 3",
		is_equal_approx(ts["landing"].x, 7.0) and ts["hits"].size() == 2
		and e1.get_meta("snared") == true and not e3.get_meta("snared", false))
	var og = ha.oathguard()
	_check("Halmarr: oathguard 40% self-reduction + taunt",
		og["damage_reduction"] == 0.40 and og["self_buff"] == true)
	e1.set_meta("hp_max", 500.0); e3.set_meta("hp_max", 80.0)
	var verdict = ha.verdict_of_the_sky([e1, e3])
	_check("Halmarr: verdict targets biggest enemy", verdict["condemned"] == e1)

	# -- Falwyn ---------------------------------------------------------
	var fa: Node = kits["falwyn_kit"]
	_check("Falwyn: DataLayer wiring", fa.deity.get("name") == "Falwyn" and fa.ability_db.size() == 3)
	var df = fa.duskflight(Vector3.ZERO, Vector3(0, 0, -1), [e1, e3])
	_check("Falwyn: duskflight glides 6m, 3 shots", df["shots"].size() == 3
		and is_equal_approx(df["glide_to"].length(), 6.0))
	var fm = fa.feathermark(e1)
	var s1 = fa.fire_seeking_shot(e1); var s2 = fa.fire_seeking_shot(e1)
	var s3 = fa.fire_seeking_shot(e1); var s4 = fa.fire_seeking_shot(e1)
	_check("Falwyn: exactly 3 seeking shots at 1.20x, 4th fails",
		s1["seeks"] and s2["seeks"] and s3["seeks"] and not s4["seeks"]
		and is_equal_approx(s1["damage_mult"], 1.20))
	var fp = fa.the_falcons_price([e1, e3])
	_check("Falwyn: falcon barrage — untargetable, 8 shots, 4s",
		fp["untargetable"] == true and fp["volley"].size() == 8 and fp["duration"] == 4.0)

	# -- Vargrim ----------------------------------------------------------
	var va: Node = kits["vargrim_kit"]
	_check("Vargrim: DataLayer wiring", va.deity.get("name") == "Vargrim" and va.ability_db.size() == 3)
	e1.set_meta("enemy_buff", {"storm_might": true, "wind_skin": true})
	var ru = va.rune_of_undoing(e1)
	_check("Vargrim: rune of undoing strips 2 buffs -> 1.20x",
		ru["stripped"] == 2 and is_equal_approx(ru["damage_mult"], 1.20))
	var ss = va.stormsight(Vector3.ZERO, [e1, e2])
	_check("Vargrim: stormsight reveals in 20m", ss["revealed"].size() == 2)
	var uw = va.the_unwriting([e1, e2, e3])
	_check("Vargrim: unwriting silences all 3 for 6s",
		uw["silenced"] == 3 and uw["duration"] == 6.0
		and e2.get_meta("silenced") == true)

	# -- Estrith -----------------------------------------------------------
	var es: Node = kits["estrith_kit"]
	_check("Estrith: DataLayer wiring", es.deity.get("name") == "Estrith" and es.ability_db.size() == 3)
	var e2v := CharacterBody3D.new()
	e2v.position = Vector3(5, 0, 5); e2v.velocity = Vector3(3, 0, 4); root.add_child(e2v)
	var th = es.threadstep(e2v)
	_check("Estrith: threadstep predicts future position (6.5, 7.0)",
		is_equal_approx(th["destination"].x, 6.5) and is_equal_approx(th["destination"].z, 7.0))
	var us = es.unspool(e1)
	_check("Estrith: unspool -30% slow + next dodge fails",
		is_equal_approx(es.slow_multiplier(e1), 0.70) and e1.get_meta("dodge_fails_next") == true)
	var pr = es.the_predetermined([e1, e3])
	_check("Estrith: predetermined — 5s fated hits on marked only",
		pr["duration"] == 5.0 and pr["fated"] == 2)

	print("=== F002 KITS TEST: %d passed, %d failed ===" % [pass_count, fail_count])
	quit(1 if fail_count > 0 else 0)

func _mk(root: Node, x: float, z: float) -> Node3D:
	var e = Node3D.new()
	e.position = Vector3(x, 0, z)
	root.add_child(e)
	return e

func _check(label: String, ok: bool) -> void:
	print(("[PASS] " if ok else "[FAIL] ") + label)
	if ok: pass_count += 1
	else: fail_count += 1
