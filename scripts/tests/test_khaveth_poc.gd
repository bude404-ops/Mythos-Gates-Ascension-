extends SceneTree
## Headless PoC test: godot --headless --script res://scripts/tests/test_khaveth_poc.gd
## Verifies the Khaveth kit wires to DataLayer and the mark/beam/ultimate math is sound.

var pass_count := 0
var fail_count := 0

func _initialize() -> void:
	_run()  # coroutine: runs to completion, then quits

func _run() -> void:
	var root := get_root()
	var dl := load("res://scripts/data_layer.gd").new()
	dl.name = "DataLayer"
	root.add_child(dl)
	await process_frame  # let DataLayer._ready() load res://data

	var kit := load("res://scripts/kits/khaveth_kit.gd").new()
	root.add_child(kit)
	await process_frame

	# -- 1. DataLayer wiring --------------------------------------------
	var ok1 := kit.deity.get("name", "") == "Khaveth"
	var ok2 := kit.ability_db.size() == 3
	var ok3 := kit.ability_db["active_1"].get("name", "") == "Weigh the Deed"
	var ok4 := kit.ability_db["active_2"].get("name", "") == "Noon Sentence"
	var ok5 := kit.ability_db["ultimate"].get("name", "") == "Meridian Judgement"
	var solo_ok := true
	for a: Dictionary in kit.ability_db.values():
		solo_ok = solo_ok and a.get("feasibility", "") == "GREEN"

	# -- 2. Mark escalation ---------------------------------------------
	var dummy := Node3D.new()
	dummy.set_meta("hp", 100.0); dummy.set_meta("hp_max", 100.0)
	dummy.set_meta("threat", 2.0); dummy.set_meta("enemy_name", "Glaresworn Drifter")
	root.add_child(dummy)
	var s1: int = kit.weigh_the_deed(dummy)
	var s2: int = kit.weigh_the_deed(dummy)
	var ok6 := s1 == 1 and s2 == 2
	var ok7 := is_equal_approx(kit.mark_multiplier(dummy), 1.24)

	# -- 3. Beam geometry -------------------------------------------------
	dummy.position = Vector3(6, 0, 0)   # 6m ahead, on-axis -> hit
	var hit_res := kit.noon_sentence(Vector3.ZERO, Vector2(1, 0), [dummy])
	var ok8 := hit_res["hits"].size() == 1
	var ok8b: bool = hit_res["hits"][0]["mult"] == 1.5  # marked -> Brand multiplier
	dummy.position = Vector3(6, 0, 3.0) # 3m off-axis -> miss
	hit_res = kit.noon_sentence(Vector3.ZERO, Vector2(1, 0), [dummy])
	var ok9 := hit_res["hits"].is_empty()

	# -- 4. Ultimate condemn + execute ------------------------------------
	dummy.position = Vector3(10, 0, 0)
	var u := kit.meridian_judgement(Vector3.ZERO, [dummy])
	var ok10 := u["condemned"] != null and int(dummy.get_meta("tallied_stacks")) == 3
	dummy.set_meta("hp", 10.0)   # 10% HP -> below execute threshold
	u = kit.meridian_judgement(Vector3.ZERO, [dummy])
	var ok11 := u["executed"] == true

	var results := {
		"DataLayer: deity loaded": ok1,
		"DataLayer: 3 abilities": ok2,
		"active_1 = Weigh the Deed": ok3,
		"active_2 = Noon Sentence": ok4,
		"ultimate = Meridian Judgement": ok5,
		"feasibility GREEN + solo-first": solo_ok,
		"mark stacks apply 1,2": ok6,
		"mark multiplier 1.24": ok7,
		"beam hits on-axis": ok8,
		"beam Brand mult 1.5 on marked": ok8b,
		"beam misses off-axis": ok9,
		"ult condemns + stacks": ok10,
		"ult executes low-HP": ok11,
	}
	for label: String in results:
		_check(label, results[label])
	print("=== KHAVETH POC: %d passed, %d failed ===" % [pass_count, fail_count])
	quit(1 if fail_count > 0 else 0)

func _check(label: String, ok: bool) -> void:
	print(("[PASS] " if ok else "[FAIL] ") + label)
	if ok: pass_count += 1
	else: fail_count += 1
