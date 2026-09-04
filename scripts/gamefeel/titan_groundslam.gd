extends Node3D
## TitanGroundSlam — windup, slam, expanding shockwave ring, crack decals, ant-launching
## Attach under the titan; assign camera_pivot, ring_mesh (MeshInstance3D w/ shockwave
## shader), crack_scene (PackedScene decal), area (Area3D for enemy overlap).

@export var camera_pivot: Node3D
@export var ring_mesh: MeshInstance3D
@export var crack_scene: PackedScene
@export var constants: Node

var _slamming := false

func slam() -> void:
    if _slamming: return
    _slamming = true
    # --- WINDUP: camera pulls back + FOV opens (dread beat) ---
    camera_pivot.pull_back(constants.SLAM_WINDUP_PULLBACK_M, constants.SLAM_WINDUP_FOV_ADD, constants.SLAM_WINDUP_S)
    await get_tree().create_timer(constants.SLAM_WINDUP_S).timeout

    # --- IMPACT ---
    camera_pivot.add_trauma(constants.SLAM_TRAUMA)
    ring_mesh.scale = Vector3.ONE * 0.01
    ring_mesh.visible = true
    var tween := create_tween().set_parallel(true)
    tween.tween_property(ring_mesh, "scale", Vector3.ONE * constants.SLAM_RING_RADIUS_M, constants.SLAM_RING_EXPAND_S)
    tween.tween_property(ring_mesh.get_active_material(0), "shader_parameter/albedo_alpha", 0.0, constants.SLAM_RING_EXPAND_S)

    # --- CRACK DECALS: 6-10 radiating cracks with 20deg jitter ---
    for i in range(randi_range(6, 10)):
        var c := crack_scene.instantiate() as Node3D
        add_child(c)
        c.position = Vector3.ZERO
        c.rotation.y = (TAU / 10.0) * i + deg_to_rad(randf_range(-20.0, 20.0))

    # --- DISPLACEMENT: stagger + launch, no kills at range (Impact > damage) ---
    for body in get_tree().get_nodes_in_group("enemies"):
        var d: float = global_position.distance_to((body as Node3D).global_position)
        if d > constants.SLAM_RING_RADIUS_M: continue
        var falloff := 1.0 - d / constants.SLAM_RING_RADIUS_M
        var dir: Vector3 = ((body as Node3D).global_position - global_position).normalized()
        if body.has_method("stagger"):
            body.stagger(dir, falloff)
        if d < constants.SLAM_LAUNCH_AIRBORNE_M and body.has_method("ragdoll_launch"):
            body.ragdoll_launch(dir, falloff)      # ants fly

    if OS.has_feature("mobile"):
        Input.vibrate_handheld(30)
        await get_tree().create_timer(0.12).timeout
        Input.vibrate_handheld(60)                # double-tap heavy

    await get_tree().create_timer(constants.SLAM_RING_EXPAND_S).timeout
    ring_mesh.visible = false
    _slamming = false
