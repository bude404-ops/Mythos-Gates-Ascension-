# MYTHOS GATES — GAME-FEEL TOP-3 SPEC (Engine-Agnostic)

> Locked direction (BudE404, Sept 3): "a glow isn't going to help... playing them needs to
> feel it and fun visually." The colossal reads through WEIGHT, IMPACT and SCALE CONTRAST.
> This spec is engine-agnostic: identical parameters implemented in both Godot and Unity.
> Godot scripts: `scripts/gamefeel/` — Unity staging: `unity-staging/Assets/Scripts/`.

## 1. FOOTSTEP WEIGHT — "every step is an event"

| Element | Parameter | Value |
|---|---|---|
| Camera trauma (per step) | trauma add | 0.22 (walk) / 0.34 (charge) |
| Trauma decay | per second | 1.8 (trauma squared drives shake power) |
| Shake translation | max offset | 0.35 m at trauma=1, Perlin noise x/y |
| Shake rotation | max roll | 1.2 deg at trauma=1 |
| Impact delay | foot contact -> shake peak | 40 ms (audio leads the camera) |
| Dust plume | particles per step | 36-48, ring-burst outward from contact |
| Dust lifetime | | 0.9-1.4 s, rises 0.4 m, fades |
| Dust color | per faction | F001 warm sandstone tan, F002 cold granite grey |
| Bass layer | frequency | 45-60 Hz sub-thump, 180 ms, -6 dB under the crack |
| Bass pitch drop | | 70 Hz -> 40 Hz over the hit (the "falling" feel) |
| Haptics (mobile) | | 25 ms medium impact at foot contact |

RULE: the step audio plays at the CONTACT frame; the camera shake peaks 40 ms later.

## 2. GROUND-SLAM SHOCKWAVE — "the hammer of the gods"

| Element | Parameter | Value |
|---|---|---|
| Windup | duration | 0.45 s, camera pulls back 1.5 m + FOV +4 deg |
| Shockwave ring | expand radius | 0 -> 18 m over 0.7 s |
| Ring visual | | torus/quad ring mesh, faction glow, opacity fades with radius |
| Ground crack decals | | 6-10 crack decals radiating from impact, 20 deg jitter |
| Camera trauma | slam | 0.65 (biggest shake in the game) |
| Enemy displacement | | radial launch, force scaled by (1 - dist/18 m), ragdoll on hit |
| Low-weight enemies | | launched airborne within 6 m ("ants fly") |
| Audio | | sub-bass DROP 60->30 Hz, debris crackle layer, 1.2 s |
| Screen pulse | | 40 ms chromatic/vignette pulse at impact |
| Haptics (mobile) | | double-tap heavy impact |

RULE: the shockwave displaces, staggers, launches — it does not kill at range. The titan's
follow-up swing does the killing. Impact > damage.

## 3. LOW TITAN CAMERA — "you ARE the colossus"

| Element | Parameter | Value |
|---|---|---|
| Camera height | | 1.6 m (mortal eye height), NOT the usual 4.5 m 3rd-person |
| Camera distance | | 7 m behind titan |
| Vertical FOV | | 50 deg |
| Pitch | | +8 deg up-tilt baseline (titan back always in frame top) |
| Look-up bias | | rotating/aiming up tilts camera up to +35 deg — head breaks skyline |
| Scale anchors | | mortal-height props along patrol paths: doorways 2.1 m, fences 1.2 m, mortals 1.7 m |
| Dust haze | | 0.5 m ground-fog layer — feet always in atmosphere |
| Sprint FOV | | +6 deg over 0.3 s on charge |

RULE: the player's eye should NEVER be higher than the titan's KNEE. If the full weapon is
in frame without tilting up, the camera is too far/too high — retune.

## IMPLEMENTATION MAP

| Mechanic | Godot (live) | Unity (staged) |
|---|---|---|
| Trauma-shake camera | scripts/gamefeel/titan_camera.gd | TitanCamera.cs |
| Footstep weight | scripts/gamefeel/titan_footstep.gd | TitanFootstep.cs |
| Ground-slam shockwave | scripts/gamefeel/titan_groundslam.gd | TitanGroundSlam.cs |

Godot scripts are drop-in Node3D components — attach to the player titan scene root, wire
the camera path. Unity C# mirrors identical constants (GameFeelConstants.cs) so tuning
stays identical across engines.
