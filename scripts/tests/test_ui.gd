extends SceneTree
## Headless test: deity select + ability HUD wired to the combat loop.
## Run: godot --headless --script res://scripts/tests/test_ui.gd

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

	# -- build the scene like main_scene does ----------------------------
	var holder := Node.new()
	holder.name = "MainScene"
	root.add_child(holder)
	var rt : Node = load("res://scripts/combat_runtime.gd").new()
	rt.name = "CombatManager"
	holder.add_child(rt)
	var loop : Node = load("res://scripts/combat_loop.gd").new()
	loop.name = "CombatLoop"   # main_scene.tscn node name — UI looks this up by path
	loop.deity_id = "MG-DEITY-001"
	holder.add_child(loop)
	var ui := CanvasLayer.new()
	ui.name = "UI"
	holder.add_child(ui)
	var ds: Control = load("res://scripts/ui/deity_select.gd").new()
	ds.name = "DeitySelect"
	ui.add_child(ds)
	var hud: Control = load("res://scripts/ui/ability_hud.gd").new()
	hud.name = "AbilityHUD"
	ui.add_child(hud)
	await process_frame

	# -- deity select: data-driven grid -----------------------------------
	_check("select: 8 faction sections built", ds.faction_sections == 8)
	_check("select: all 32 deities have buttons", ds.deity_buttons.size() == 32)
	var khaveth_btn: Button = ds.deity_buttons.get("MG-DEITY-001")
	_check("select: button shows name + epithet",
		khaveth_btn != null and "Khaveth" in khaveth_btn.text)
	var arashido_btn: Button = ds.deity_buttons.get("MG-DEITY-013")
	_check("select: F004 deity present in the grid",
		arashido_btn != null and "Arashido" in arashido_btn.text)

	# -- selection routes into the loop ------------------------------------
	var selected: Array = []
	ds.connect("deity_selected", func(id): selected.append(id))
	var ok: bool = ds.select_deity("MG-DEITY-013")
	_check("select: picking Arashido swaps the loop kit",
		ok and loop.kit != null and loop.kit.deity.get("name") == "Arashido")
	_check("select: signal fired + overlay hidden",
		selected == ["MG-DEITY-013"] and not ds.visible)
	var bad: bool = ds.select_deity("MG-DEITY-999")
	_check("select: unknown deity id rejected gracefully", bad == false)

	# -- HUD: labels follow the selected kit --------------------------------
	hud._refresh_slot_labels()
	var a1: Button = hud.slot_buttons.get("active_1")
	var a2: Button = hud.slot_buttons.get("active_2")
	var ult: Button = hud.slot_buttons.get("ultimate")
	var d13: Dictionary = DL.deities["MG-DEITY-013"]
	_check("hud: slot labels match Arashido's registry abilities",
		"Gale Step" in a1.text and "Tempest Sweep" in a2.text
		and "The Storm Crosses" in ult.text)

	# -- player + enemies, then cast through the HUD -------------------------
	var player := Node3D.new()
	player.set_meta("hp", 1000.0); player.set_meta("hp_max", 1000.0)
	player.set_meta("hp_frac", 1.0)
	holder.add_child(player)
	loop.set_player(player)
	var foe: Node3D = loop.spawn_enemy(Vector3(6, 0, 0))
	await process_frame

	var casts: Array = []
	loop.connect("ability_cast", func(_id, slot, result): casts.append([slot, result]))
	hud.cast_slot("active_1")
	_check("hud: cast routes through the loop (Gale Step fired)",
		casts.size() == 1 and casts[0][0] == "active_1"
		and casts[0][1].get("cast", false) == true)
	_check("hud: auto-aim targets the nearest enemy",
		hud.aim_point() == foe.position)

	# -- HP bar + status banner ----------------------------------------------
	player.set_meta("hp", 400.0)
	player.set_meta("hp_frac", 0.4)
	hud._process(0.1)
	_check("hud: HP bar tracks player hp fraction", is_equal_approx(hud.hp_bar.value, 0.4))
	_check("hud: HP label names the deity + exact hp",
		"Arashido" in hud.hp_label.text and "400" in hud.hp_label.text)

	hud._set_status("WAVE CLEARED", Color(1, 1, 0))
	_check("hud: status banner renders", hud.status_label.text == "WAVE CLEARED")

	# -- switch button path ----------------------------------------------------
	_check("hud: switch path resolves the deity select overlay",
		hud.deity_select != null and hud.deity_select == ds)

	print("=== UI HEADLESS: %d passed, %d failed ===" % [pass_count, fail_count])
	quit(1 if fail_count > 0 else 0)

func _check(label: String, ok: bool) -> void:
	if ok: pass_count += 1
	else: fail_count += 1
	print("[%s] %s" % ["PASS" if ok else "FAIL", label])
