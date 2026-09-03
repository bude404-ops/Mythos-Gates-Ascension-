extends Node3D

func _ready():
    print("=== RENDER SCENE START ===")
    
    var dir = DirectionalLight3D.new()
    dir.position = Vector3(5, 10, 5)
    dir.light_energy = 1.5
    dir.shadow_enabled = true
    add_child(dir)
    
    var fill = DirectionalLight3D.new()
    fill.position = Vector3(-3, 2, -3)
    fill.light_energy = 0.5
    fill.light_color = Color(0.8, 0.6, 0.3)
    add_child(fill)
    
    var camera = Camera3D.new()
    camera.position = Vector3(0, 1.8, 5)
    camera.fov = 35
    add_child(camera)
    camera.make_current()
    
    # Load character
    var model_res = load("res://assets/models/aten_ra.glb")
    if model_res and model_res is PackedScene:
        var character = model_res.instantiate()
        character.name = "Player"
        character.scale = Vector3(1.5, 1.5, 1.5)
        add_child(character)
        print("Character loaded")
        
        var skeleton = _find_node(character, "Skeleton3D")
        var anim_player = _find_node(character, "AnimationPlayer")
        
        if anim_player and anim_player is AnimationPlayer:
            for anim_name in ["Idle", "Walk", "CombatSwing"]:
                if anim_player.has_animation(anim_name):
                    anim_player.play(anim_name)
                    print("Playing: ", anim_name)
                    break
        
        # Load and attach weapon
        var weapon_res = load("res://assets/models/aten_ra_staff.glb")
        if weapon_res and weapon_res is PackedScene:
            var weapon_node = weapon_res.instantiate()
            weapon_node.name = "SunDiscAegisStaff"
            
            if skeleton:
                var bone_attach = BoneAttachment3D.new()
                bone_attach.name = "WeaponHand"
                var found = false
                for bname in ["Hand.R", "RightHand", "hand_R"]:
                    var bidx = skeleton.find_bone(bname)
                    if bidx >= 0:
                        bone_attach.bone_name = bname
                        bone_attach.bone_idx = bidx
                        found = true
                        print("Weapon -> bone: ", bname)
                        break
                
                if found:
                    skeleton.add_child(bone_attach)
                    bone_attach.add_child(weapon_node)
                    weapon_node.scale = Vector3(0.8, 0.8, 0.8)
                    print("Weapon ATTACHED!")
                else:
                    character.add_child(weapon_node)
                    weapon_node.position = Vector3(0.5, 1.0, 0)
        else:
            print("FAILED to load weapon")
    else:
        print("FAILED to load character")
    
    # Wait for render
    await get_tree().create_timer(2.0).timeout
    
    var img = get_viewport().get_texture().get_image()
    if img:
        if img.get_width() > 1280:
            img.resize(1280, int(img.get_height() * 1280.0 / img.get_width()))
        img.save_png("res://screenshot.png")
        print("SCREENSHOT SAVED! Size: ", img.get_size())
    else:
        print("ERROR: No image")
    
    print("=== DONE ===")
    get_tree().quit()

func _find_node(node: Node, type_name: String) -> Node:
    if node.get_class() == type_name:
        return node
    for child in node.get_children():
        var result = _find_node(child, type_name)
        if result:
            return result
    return null
