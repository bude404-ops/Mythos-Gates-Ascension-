extends SceneTree
## Headless integration test: combat loop + cast_slot dispatch across kits.
## Run: godot --headless --script res://scripts/tests/test_combat_loop.gd

var pass_count := 0
var fail_count := 0

func _initialize() -> void:
	_run()

func _run() -> void:
	var root := get_root()
	var dl : Node = load("res://scripts/data_layer.gd").new()
	dl.name = "DataLayer"
	var DL: Node = dl
	root.add_child(dl)
	await process_frame

	# -- every kit exposes cast_slot and dispatches all 3 slots ---------
	var slots := ["active_1", "active_2", "ultimate"]
	var dispatched := 0
	for did: String in DL.deities.keys():
		var d: Dictionary = DL.deities[did]
		var kit_name: String = String(d["name"]).to_lower() + "_kit"
		var k: Node = load("res://scripts/kits/%s.gd" % kit_name).new()
		root.add_child(k)
		await process_frame
		var foe := Node3D.new()
		foe.position = Vector3(6, 0, 0)
		foe.set_meta("hp", 300.0); foe.set_meta("hp_max", 300.0)
		foe.set_meta("hp_frac", 1.0)
		root.add_child(foe)
		var ctx := {"player_pos": Vector3.ZERO, "target_pos": Vector3(6, 0, 0),
			"facing": Vector2(1, 0), "enemies": [foe], "target": foe,
			"max_hp": 1000.0}
		var all_ok := true
		for slot: String in slots:
			var res: Dictionary = k.cast_slot(slot, ctx)
			if not res.get("cast", false):
				all_ok = false
		# cleanup: reset foe metas between kits
		if all_ok: dispatched += 1
		k.queue_free()
		foe.queue_free()
	_check("cast dispatch: all 32 kits cast all 3 slots via ctx",
		dispatched == 32)

	# -- combat loop: auto-attack through the runtime ---------------------
	var holder := Node.new()
	root.add_child(holder)
	var rt : Node = load("res://scripts/combat_runtime.gd").new()
	rt.name = "CombatManager"
	holder.add_child(rt)
	var loop : Node = load("res://scripts/combat_loop.gd").new()
	loop.deity_id = "MG-DEITY-001"
	holder.add_child(loop)
	await process_frame
	_check("loop: selects deity kit from DataLayer",
		loop.kit != null and loop.kit.deity.get("name") == "Khaveth")
	# freeze engine-side ticking: this test drives _process manually for determinism
	loop.set_process(false)

	var player := Node3D.new()
	player.position = Vector3.ZERO
	player.set_meta("hp", 1000.0); player.set_meta("hp_max", 1000.0)
	player.set_meta("hp_frac", 1.0)
	holder.add_child(player)
	loop.set_player(player)
	var foe1: Node3D = loop.spawn_enemy(Vector3(4, 0, 0))
	await process_frame
	var foe2: Node3D = loop.spawn_enemy(Vector3(8, 0, 0))
	await process_frame
	_check("loop: spawns enemies registered with the runtime",
		foe1 != null and rt.combatants.has(foe1))

	# simulate 4 seconds of auto-attack (40 ticks of 0.1)
	var dealt_log: Array = []
	loop.ability_cast.connect(func(_did, slot, result):
		if slot == "auto_attack": dealt_log.append(result))
	for i in 40: loop._process(0.1)
	_check("loop: auto-attack lands ~4 hits in 4s, foe1 at 60hp",
		dealt_log.size() == 4 and is_equal_approx(foe1.get_meta("hp"), 60.0))
	_check("loop: out-of-range foe2 untouched (5m range)",
		is_equal_approx(foe2.get_meta("hp"), 300.0))

	# -- cast an ability through the loop (Khaveth: Noon Sentence) -------
	var cast_res: Dictionary = loop.cast("active_2", Vector3(4, 0, 0))
	_check("loop: cast() returns the kit's dispatch result",
		cast_res.get("cast", false) == true and cast_res.get("slot") == "active_2")

	# -- enemy AI walks + melees through the runtime -----------------------
	for i in 40: loop._process(0.1)
	_check("loop: enemy AI closes in on the player",
		foe2.position.length() < 8.0)

	print("=== COMBAT LOOP HEADLESS: %d passed, %d failed ===" % [pass_count, fail_count])
	quit(1 if fail_count > 0 else 0)

func _check(label: String, ok: bool) -> void:
	if ok: pass_count += 1
	else: fail_count += 1
	print("[%s] %s" % ["PASS" if ok else "FAIL", label])
