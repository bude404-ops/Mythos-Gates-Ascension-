extends SceneTree
## Headless test for the 4 Deepgreen kits (Mawkreth/Kolweth/Selmara/Thuveka).
## Run: godot --headless --script res://scripts/tests/test_f008_kits.gd

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
	for n: String in ["mawkreth_kit", "kolweth_kit", "selmara_kit", "thuveka_kit"]:
		var k: Node = load("res://scripts/kits/%s.gd" % n).new()
		root.add_child(k)
		kits[n] = k
	await process_frame

	# -- Mawkreth -------------------------------------------------------
	var mk: Node = kits["mawkreth_kit"]
	_check("Mawkreth: DataLayer wiring", mk.deity.get("name") == "Mawkreth" and mk.ability_db.size() == 3)
	var in55 = _mk(root, 5, 0); var out55 = _mk(root, 6, 0)
	var rb = mk.ridgebreaker(Vector3.ZERO, [in55, out55])
	_check("Mawkreth: ridgebreaker slams 5m not 6m, raises 2 walls",
		rb["hits"].size() == 1 and rb["walls"].size() == 2
		and in55.get_meta("snared") == true)
	var bs = mk.basalt_skin()
	_check("Mawkreth: basalt skin — 35% reduction while standing ground",
		bs["reduction"] == 0.35 and bs["self_buff"] == true)
	_check("Mawkreth: basalt multiplier active only under move 0.2",
		mk.basalt_multiplier(0.1) == 0.65 and mk.basalt_multiplier(5.0) == 1.0)
	var rw = mk.the_ridge_wakes(Vector3.ZERO, [in55, out55])
	_check("Mawkreth: the ridge wakes — cone/ring/line vents in 12m",
		rw["vent_patterns"] == ["cone", "ring", "line"]
		and rw["affected"].size() == 2)

	# -- Kolweth ---------------------------------------------------------
	var ko: Node = kits["kolweth_kit"]
	_check("Kolweth: DataLayer wiring", ko.deity.get("name") == "Kolweth" and ko.ability_db.size() == 3)
	var vc = ko.veilcast(Vector3.ZERO, Vector2(1, 1))
	_check("Kolweth: veilcast fog wall blocks sight + projectiles",
		vc["length"] == 8.0 and vc["blocks_sight"] == true
		and vc["blocks_projectiles"] == true)
	var mi = ko.mistake(Vector3(2, 0, 2))
	_check("Kolweth: mistake deploys a 4s taunting mirage",
		mi["lifetime"] == 4.0 and mi["taunts"] == true and mi["is_illusion"] == true)
	var wo = ko.whiteout([in55, out55])
	_check("Kolweth: whiteout blinds the whole field 6s, you see clearly",
		in55.get_meta("blinded") == 6.0 and wo["you_see_clearly"] == true)

	# -- Selmara -----------------------------------------------------------
	var se: Node = kits["selmara_kit"]
	_check("Selmara: DataLayer wiring", se.deity.get("name") == "Selmara" and se.ability_db.size() == 3)
	var on_line = _mk(root, 8, 0); var off_line = _mk(root, 18, 0)
	var up = se.upstream(Vector3.ZERO, Vector2(1, 0), [on_line, off_line])
	_check("Selmara: upstream hits the line enemy twice, 18m untouched",
		up["hits"].size() == 1 and up["hits"][0]["times"] == 2)
	var wader = _mk(root, 3, 0); var dry = _mk(root, 6, 0)
	var sh = se.shallows(Vector3.ZERO, [wader, dry])
	_check("Selmara: shallows slows 5m pool to 0.60x, 6m stays dry",
		sh["wading"].size() == 1 and wader.get_meta("slow_mult") == 0.60)
	var in_channel = _mk(root, 2, 3); var out_channel = _mk(root, 2, 5)
	var sp = se.the_spawning_run(Vector3.ZERO, Vector2(1, 0), [in_channel, out_channel])
	_check("Selmara: spawning run sweeps the 8m channel only",
		sp["swept"].size() == 1 and sp["swept"][0]["enemy"] == in_channel)

	# -- Thuveka -------------------------------------------------------------
	var tu: Node = kits["thuveka_kit"]
	_check("Thuveka: DataLayer wiring", tu.deity.get("name") == "Thuveka" and tu.ability_db.size() == 3)
	var ff = tu.featherfall(Vector3.ZERO, Vector3(9, 0, 0))
	_check("Thuveka: featherfall 9m glide-strike with no warning cue",
		ff["legal"] == true and ff["no_warning_cue"] == true)
	var hollow = _mk(root, 7, 7); hollow.set_meta("hollow_disguise", true)
	var marked = _mk(root, 8, 8); marked.set_meta("moonmarked", true)
	var ne = tu.night_eye([hollow, marked, _mk(root, 1, 1)])
	_check("Thuveka: night-eye reveals Hollow disguise + marked, misses clean",
		ne["revealed"].size() == 2 and hollow.get_meta("revealed") == true)
	var qh = tu.the_quiet_hunt()
	_check("Thuveka: quiet hunt — 5s undetectable, every strike crits",
		qh["undetectable"] == 5.0 and qh["every_strike_crits"] == true
		and qh["crit_hook"] == "MG-BUFF-CRIT-CHAIN")

	print("=== F008 HEADLESS: %d passed, %d failed ===" % [pass_count, fail_count])
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
