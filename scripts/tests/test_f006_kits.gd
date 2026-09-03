extends SceneTree
## Headless test for the 4 Radiant Vigil kits (Varothiel/Thraniel/Sothiel/Tashareth).
## Run: godot --headless --script res://scripts/tests/test_f006_kits.gd

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
	for n: String in ["varothiel_kit", "thraniel_kit", "sothiel_kit", "tashareth_kit"]:
		var k: Node = load("res://scripts/kits/%s.gd" % n).new()
		root.add_child(k)
		kits[n] = k
	await process_frame

	# -- Varothiel -------------------------------------------------------
	var va: Node = kits["varothiel_kit"]
	_check("Varothiel: DataLayer wiring", va.deity.get("name") == "Varothiel" and va.ability_db.size() == 3)
	var in6 = _mk(root, 5, 0); var out6 = _mk(root, 7, 0)
	var fg = va.flareguard(Vector3.ZERO, [in6, out6])
	_check("Varothiel: flareguard blinds 5m, misses 7m",
		fg["blinded"].size() == 1 and in6.get_meta("blinded") == 1.5)
	var ir = va.ignited_resolve()
	_check("Varothiel: ignited resolve +40% atk speed, SELF-only",
		ir["atk_speed"] == 0.40 and ir["self_buff"] == true)
	var fb = va.the_final_beacon(Vector3.ZERO, [in6, out6])
	_check("Varothiel: final beacon — 8s undying, draws within 14m",
		fb["undying"] == 8.0 and fb["undying_hook"] == "MG-BUFF-UNDYING"
		and fb["drawn"].size() == 2)

	# -- Thraniel ----------------------------------------------------------
	var tt: Node = kits["thraniel_kit"]
	_check("Thraniel: DataLayer wiring", tt.deity.get("name") == "Thraniel" and tt.ability_db.size() == 3)
	var far = _mk(root, 25, 0)
	var gl = tt.far_glint(far, Vector3.ZERO)
	_check("Thraniel: far glint marks at 25m with wallhack glow",
		gl["marked"] == true and far.get_meta("glow_hook") == "MG-BUFF-GLOW-RADIUS")
	var too_far = _mk(root, 35, 0)
	_check("Thraniel: far glint out of range at 35m",
		tt.far_glint(too_far, Vector3.ZERO)["out_of_range"] == true)
	var pv = tt.prismatic_volley()
	_check("Thraniel: prismatic volley splits into 5 typed shots",
		pv["count"] == 5 and pv["shots"].size() == 5)
	var strong = _mk(root, 9, 9)
	strong.set_meta("threat", 9.0)
	var weak = _mk(root, 8, 8)
	weak.set_meta("threat", 2.0)
	var sv = tt.sunrise_verdict([weak, strong])
	_check("Thraniel: sunrise verdict names the strongest, no escape",
		sv["named"] == strong and sv["no_escape"] == true and sv["bonus"] == 0.50)

	# -- Sothiel -------------------------------------------------------------
	var so: Node = kits["sothiel_kit"]
	_check("Sothiel: DataLayer wiring", so.deity.get("name") == "Sothiel" and so.ability_db.size() == 3)
	var caster = _mk(root, 6, 6)
	caster.set_meta("last_ability", "fire_breath")
	var rf = so.refraction(caster)
	_check("Sothiel: refraction mirrors last ability at 75%",
		rf["refracted"] == true and rf["strength"] == 0.75)
	_check("Sothiel: refraction idle vs unseen enemies",
		so.refraction(_mk(root, 1, 1))["refracted"] == false)
	var lumen = _mk(root, 10, 0)
	lumen.set_meta("lumenmarked", true)
	var ar1 = so.annotated_ray(Vector3.ZERO, lumen)
	var plain = _mk(root, 10, 1)
	var ar2 = so.annotated_ray(Vector3.ZERO, plain)
	_check("Sothiel: annotated ray +30% only vs marked in 16m",
		ar1["bonus"] == 0.30 and ar2["bonus"] == 0.0)
	var buffed = _mk(root, 4, 4)
	buffed.set_meta("enemy_buff", {"atk": 1})
	var clean = _mk(root, 5, 5)
	var rev = so.the_reversal([buffed, clean])
	_check("Sothiel: the reversal inverts only buff-holders",
		rev["inverted"].size() == 1 and buffed.get_meta("inverted_debuff") == "MG-DEBUFF-BUFF-INVERT")

	# -- Tashareth ---------------------------------------------------------------
	var ta: Node = kits["tashareth_kit"]
	_check("Tashareth: DataLayer wiring", ta.deity.get("name") == "Tashareth" and ta.ability_db.size() == 3)
	for i in 4: ta.place_node(Vector3(i * 10, 0, 0))
	_check("Tashareth: node pool caps at 3, oldest dims",
		ta.nodes.size() == 3 and ta.nodes[0] == Vector3(10, 0, 0))
	var sw = ta.swap_to_node(Vector3(10, 0, 0))
	_check("Tashareth: photon-swap blinks to nearest node",
		sw["swapped"] == true and sw["to"] == Vector3(10, 0, 0))
	var victim = _mk(root, 30, 0)
	ta.irradiate(victim)
	var crit = ta.strike_from_silence(Vector3(28, 0, 0), victim)
	var miss = ta.strike_from_silence(Vector3(40, 0, 0), victim)
	_check("Tashareth: irradiate crit only from within 6m of infused target",
		crit["guaranteed_crit"] == true and miss["guaranteed_crit"] == false)
	var ev = ta.everywhere_at_once()
	_check("Tashareth: everywhere at once activates all nodes simultaneously",
		ev["duration"] == 5.0 and ev["simultaneous"] == true
		and ev["active_nodes"].size() == 3)

	print("=== F006 HEADLESS: %d passed, %d failed ===" % [pass_count, fail_count])
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
