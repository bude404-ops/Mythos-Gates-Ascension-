extends Node3D
## TitanFootstep — footstep weight: dust ring-burst, sub-bass thump, 40ms-delayed trauma
## Attach under the titan; assign camera_pivot (TitanCamera), dust (GPUParticles3D),
## bass (AudioStreamPlayer3D), crack (AudioStreamPlayer3D). Call foot_down(walk_speed).

@export var camera_pivot: Node3D          # TitanCamera
@export var dust: GPUParticles3D         # one_shot ring-burst at contact point
@export var bass: AudioStreamPlayer3D    # sub-bass layer
@export var crack: AudioStreamPlayer3D   # footfall crack layer
@export var constants: Node

func foot_down(charging: bool = false) -> void:
    # 1) crack + bass at CONTACT frame (audio leads the camera)
    crack.play()
    var pitch: float = constants.BASS_START_HZ / 70.0
    bass.pitch_scale = pitch
    bass.play()
    var tween := create_tween()   # 70Hz -> 40Hz pitch fall = the "ground dropping" feel
    tween.tween_property(bass, "pitch_scale", constants.BASS_END_HZ / 70.0, 0.18)

    # 2) dust ring-burst, count scaled by walk/charge
    dust.amount = randi_range(constants.FOOTSTEP_DUST_MIN, constants.FOOTSTEP_DUST_MAX)
    dust.restart()

    # 3) camera trauma peaks 40 ms AFTER contact — ear-brain ordering sells the weight
    var trauma: float = constants.FOOTSTEP_TRAUMA_CHARGE if charging else constants.FOOTSTEP_TRAUMA_WALK
    var timer := get_tree().create_timer(constants.FOOTSTEP_IMPACT_DELAY_MS / 1000.0)
    timer.timeout.connect(func(): camera_pivot.add_trauma(trauma))

    # 4) mobile haptic (tap-to-move controls) — medium impact
    if OS.has_feature("mobile"):
        Input.vibrate_handheld(25)
