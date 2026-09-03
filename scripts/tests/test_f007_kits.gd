extends SceneTree
## Headless test for the 4 Black-Iron Dominion kits (Kraxus/Orivax/Mazka/Syrrax).
## Run: godot --headless --script res://scripts/tests/test_f007_kits.gd

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
	for n: String in ["kraxus_kit", "orivax_kit", "mazka_kit", "syrrax_kit"]:
		var k: Node = load("res://scripts/kits/%s.gd" % n).new()
		root.add_child(k)
		kits[n] = k
	await process_frame

	# -- Kraxus ---------------------------------------------------------
	var kr: Node = kits["kraxus_kit"]
	_check("Kraxus: DataLayer wiring", kr.deity.get("name") == "Kraxus" and kr.ability_db.size() == 3)
	var debtor = _mk(root, 6, 0)
	var writ = kr.writ_of_war(debtor)
	_check("Kraxus: writ of war marks with debt hook",
		writ["marked"] == true and debtor.get_meta("debt_hook") == "MG-BUFF-DEBT-STACK")
	_check("Kraxus: writ compounds 10s=1.50x, caps 1.60x",
		kr.writ_multiplier(10.0) == 1.50 and kr.writ_multiplier(20.0) == 1.60)
	var near = _mk(root, 12, 0); var beyond = _mk(root, 15, 0)
	_check("Kraxus: chainstroke pulls from 12m, not 15m",
		kr.chainstroke(Vector3.ZERO, near)["pulled"] == true
		and kr.chainstroke(Vector3.ZERO, beyond)["pulled"] == false)
	debtor.set_meta("debt_seconds", 10.0)
	var col = kr.involuntary_collection(Vector3.ZERO, [debtor, near])
	_check("Kraxus: involuntary collection drags marked in, debt executes",
		col["collected"].size() == 1
		and col["collected"][0]["debt_multiplier"] == 1.50)

	# -- Orivax ------------------------------------------------------------
	var or: Node = kits["orivax_kit"]
	_check("Orivax: DataLayer wiring", or.deity.get("name") == "Orivax" and or.ability_db.size() == 3)
	var burning = _mk(root, 3, 3)
	var df = or.debtfire(burning)
	_check("Orivax: debtfire applies interest burn hook",
		df["burning"] == true and burning.get_meta("dot_grow_hook") == "MG-BUFF-DOT-GROW")
	_check("Orivax: debtfire compounds 40->48->57.6->69.12",
		or.debtfire_tick(40.0) == 48.0 and or.debtfire_tick(or.debtfire_tick(48.0)) == 69.12)
	_check("Orivax: debtfire total across 4 ticks = 257.664",
		is_equal_approx(or.debtfire_total(), 257.664))
	var rf = or.refinance(["slow", "mark", "melt"])
	_check("Orivax: refinance consolidates 3 debuffs into one 120 burst",
		rf["consolidated"] == 3 and rf["delayed_burst"] == 120.0 and rf["self_only"] == true)
	var loan = or.the_original_loan()
	_check("Orivax: the original loan — 1.8x power, 20% comes due",
		loan["power"] == 1.80 and loan["repayment_frac"] == 0.20 and loan["temptation"] == true)

	# -- Mazka ----------------------------------------------------------------
	var ma: Node = kits["mazka_kit"]
	_check("Mazka: DataLayer wiring", ma.deity.get("name") == "Mazka" and ma.ability_db.size() == 3)
	var pay = ma.payment_collection(1000.0)
	_check("Mazka: payment collection 2% self-heal per strike",
		pay["heal"] == 20.0 and pay["heal_hook"] == "MG-BUFF-HEAL-SELF")
	var shielded = _mk(root, 2, 2); shielded.set_meta("shield_value", 80.0)
	var bare = _mk(root, 3, 3)
	var terms = ma.terms_of_trade([shielded, bare, bare])
	_check("Mazka: terms of trade shatters 1 shield, transfers 80 to you",
		terms["shots"].size() == 4 and terms["transferred"] == 80.0
		and shielded.get_meta("shield_value") == 0.0)
	_check("Mazka: closing costs detonates payments x1.5",
		is_equal_approx(ma.closing_costs()["blast"], 30.0))

	# -- Syrrax ------------------------------------------------------------------
	var sy: Node = kits["syrrax_kit"]
	_check("Syrrax: DataLayer wiring", sy.deity.get("name") == "Syrrax" and sy.ability_db.size() == 3)
	var lp = sy.loophole(Vector3.ZERO, Vector3(10, 0, 0))
	_check("Syrrax: loophole 10m blink through enemies with i-frames",
		lp["blink"] == true and lp["iframes"] == 0.4 and lp["phases_through"] == true)
	var stacked = _mk(root, 4, 0)
	stacked.set_meta("writmarked", true)
	var fresh = _mk(root, 5, 0)
	_check("Syrrax: default +50% vs debt-stacked, 0 vs clean",
		sy.strike(stacked)["bonus"] == 0.50 and sy.strike(fresh)["bonus"] == 0.0)
	var am = sy.amnesty(["slow", "mark"])
	_check("Syrrax: amnesty erases 2 debuffs, untargetable, guaranteed crit",
		am["erased"] == 2 and am["untargetable_hook"] == "MG-BUFF-UNTARGETABLE"
		and am["next_strike_crit"] == true)

	print("=== F007 HEADLESS: %d passed, %d failed ===" % [pass_count, fail_count])
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
