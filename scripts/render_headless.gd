extends SceneTree

func _init():
    print("=== RENDER START ===")
    
    var root = get_root()
    
    # Create main scene node
    var scene = Node3D.new()
    scene.name = "RenderScene"
    root.add_child(scene)
    
    # Lighting
    var dir = DirectionalLight3D.new()
    dir.position = Vector3(5, 10, 5)
    dir.light_energy = 1.5
    dir.shadow_enabled = true
    scene.add_child(dir)
    
    var fill = DirectionalLight3D.new()
    fill.position = Vector3(-3, 2, -3)
    fill.light_energy = 0.5
    fill.light_color = Color(0.8, 0.6, 0.3)
    scene.add_child(fill)
    
    # Camera
    var camera = Camera3D.new()
    camera.position = Vector3(0, 1.8, 5)
    camera.fov = 35
    scene.add_child(camera)
    camera.make_current()
    
    # World environment
    var env = Environment.new()
    env.background_mode = Environment.BG_COLOR
    env.background_color = Color(0.05, 0.05, 0.08, 1)
    env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
    env.ambient_light_color = Color(0.15, 0.12, 0.08, 1)
    env.ambient_light_energy = 0.4
    var world_env = WorldEnvironment.new()
    world_env.environment = env
    scene.add_child(world_env)
    
    # Load character
    var model_res = load("res://assets/models/aten_ra.glb")
    if model_res and model_res is PackedScene:
        var character = model_res.instantiate()
        character.name = "Player"
        character.scale = Vector3(1.5, 1.5, 1.5)
        scene.add_child(character)
        print("Character loaded")
        
        var skeleton = _find_node(character, "Skeleton3D")
        var anim_player = _find_node(character, "AnimationPlayer")
        
        if skeleton:
            print("Bones: ", skeleton.get_bone_count())
            # Print first 30 bone names
            for i in range(min(skeleton.get_bone_count(), 30)):
                print("  bone[", i, "]: ", skeleton.get_bone_name(i))
        
        if anim_player and anim_player is AnimationPlayer:
            print("Anims: ", anim_player.get_animation_list())
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
            print("Weapon model loaded")
            
            if skeleton:
                var bone_attach = BoneAttachment3D.new()
                bone_attach.name = "WeaponHand"
                var found = false
                for bname in ["Hand.R", "RightHand", "hand_R", "right_hand"]:
                    var bidx = skeleton.find_bone(bname)
                    if bidx >= 0:
                        bone_attach.bone_name = bname
                        bone_attach.bone_idx = bidx
                        found = true
                        print("Weapon -> bone: ", bname, " (", bidx, ")")
                        break
                
                if found:
                    skeleton.add_child(bone_attach)
                    bone_attach.add_child(weapon_node)
                    weapon_node.scale = Vector3(0.8, 0.8, 0.8)
                    weapon_node.position = Vector3(0, 0, 0.02)
                    print("Weapon ATTACHED to bone!")
                else:
                    print("No hand bone found, listing all bones:")
                    for i in range(skeleton.get_bone_count()):
                        print("  ", skeleton.get_bone_name(i))
                    character.add_child(weapon_node)
                    weapon_node.position = Vector3(0.5, 1.0, 0)
            else:
                print("No skeleton found!")
                character.add_child(weapon_node)
                weapon_node.position = Vector3(0.5, 1.0, 0)
        else:
            print("FAILED to load weapon GLB")
    else:
        print("FAILED to load character GLB")
    
    # Process frames
    for i in range(180):  # 3 seconds at 60fps
        await process_frame
        if i == 60:
            print("Processing...")
    
    # Take screenshot
    var vp = root.get_viewport()
    var img = vp.get_texture().get_image()
    if img:
        # Convert to a reasonable size
        if img.get_width() > 1280:
            img.resize(1280, int(img.get_height() * 1280.0 / img.get_width()))
        
        img.save_png("res://screenshot.png")
        print("Screenshot saved! Size: ", img.get_size())
        
        # Also save as user://
        img.save_png("user://screenshot.png")
        print("Also saved to user://")
    else:
        print("ERROR: Could not get viewport image")
    
    print("=== RENDER DONE ===")
    quit()

func _find_node(node: Node, type_name: String) -> Node:
    if node.get_class() == type_name:
        return node
    for child in node.get_children():
        var result = _find_node(child, type_name)
        if result:
            return result
    return null
