# MYTHOS GATES — GAME-FEEL TOP-3 SPEC (Engine-Agnostic)

> Locked direction (BudE404, Sept 3): "a glow isn't going to help... playing them needs to
> feel it and fun visually." The colossal reads through WEIGHT, IMPACT and SCALE CONTRAST.
> This spec is engine-agnostic: identical parameters implemented in both Godot and Unity.
> Deliverable scripts: `scripts/gamefeel/` (Godot/GDScript) and `unity-staging/Assets/Scripts/` (Unity/C#).

---

## 1. FOOTSTEP WEIGHT — "every step is an event"

The titan's footstep must feel like a small earthquake that the PLAYER causes.

| Element | Parameter | Value |
|---|---|---|
| Camera trauma (per step) | trauma add | 0.22 (walk) / 0.34 (charge) |
| Trauma decay | per second | 1.8 (trauma² drives shake power) |
| Shake translation | max offset | 0.35 m at trauma=1, Perlin noise x/y |
| Shake rotation | max roll | 1.2° at trauma=1 |
| Impact delay | foot contact → shake peak | 40 ms (sound leads the camera) |
| Dust plume | particles per step | 36–48, ring-burst outward from contact |
| Dust lifetime | | 0.9–1.4 s, rises 0.4 m, fades |
| Dust color | per faction | F001 = warm sandstone tan, F002 = cold grey granite |
| Bass layer | frequency | 45–60 Hz sub-thump, 180 ms, -6 dB under the crack |
| Bass pitch drop | | 70 Hz → 40 Hz over the hit (the "falling" feel) |
| Haptics (mobile) | | 25 ms medium impact on foot contact |

**Rule:** the crack/step audio plays at the CONTACT frame; the camera shake peaks 40 ms later.
The ear-brain ordering is what sells "the ground just moved."

## 2. GROUND-SLAM SHOCKWAVE — "the hammer of the gods"

Ability press → windup → slam. The payoff must be readable at a glance.

| Element | Parameter | Value |
|---|---|---|
| Windup | duration | 0.45 s, camera pulls back 1.5 m + FOV +4° |
| Shockwave ring | expand radius | 0 → 18 m over 0.7 s |
| Ring visual | | torus/quad-ring mesh, faction glow color, opacity fades with radius |
| Ground crack decals | | 6–10 crack decals radiating from impact, random 20° jitter |
| Camera trauma | slam | 0.65 (the biggest shake in the game) |
| Enemy displacement | | radial launch, force ∝ (1 − dist/18 m), ragdoll on hit |
| Low-weight enemies | | launched airborne at dist < 6 m ("ants fly") |
| Audio | | sub-bass DROP (60→30 Hz), debris crackle layer, 1.2 s |
| Screen pulse | | brief 40 ms chromatic/vignette pulse at impact |
| Haptics (mobile) | | double-tap heavy impact |

**Rule:** the shockwave must KILL NOTHING BY ITSELF at range — it displaces, staggers,
launches. The titan's follow-up swing does the killing. Impact > damage.

## 3. LOW TITAN CAMERA — "you ARE the colossus"

Default camera reads "big person." Low camera reads "walking monument."

| Element | Parameter | Value |
|---|---|---|
| Camera height | | 1.6 m (mortal eye height) — NOT 3rd-person 4.5 m |
| Camera distance | | 7 m behind titan |
| Vertical FOV | | 50° |
| Pitch | | +8° up-tilt baseline (the titan's back always in frame top) |
| Look-up bias | | aiming/rotating up tilts camera up to +35° — head breaks skyline |
| Scale anchors | | mortal-height props (doorways 2.1 m, fences 1.2 m, mortals 1.7 m) placed along patrol paths |
| Dust haze | | low ground-fog layer 0.5 m tall — feet always in atmosphere |
| Sprint FOV | | +6° over 0.3 s on charge |

**Rule:** the player's eye should NEVER be higher than the titan's KNEE. When the titan
raises their weapon, the camera should be looking up at it. If the full weapon is in frame
without tilting up, the camera is too far / too high — retune.

---

## IMPLEMENTATION MAP

| Mechanic | Godot (ships now) | Unity (staged) |
|---|---|---|
| Trauma-shake camera | `scripts/gamefeel/titan_camera.gd` | `TitanCamera.cs` |
| Footstep weight | `scripts/gamefeel/titan_footstep.gd` | `TitanFootstep.cs` |
| Ground-slam shockwave | `scripts/gamefeel/titan_groundslam.gd` | `TitanGroundSlam.cs` |
| Shared tuning | constants in each script head | `GameFeelConstants.cs` |

All three Godot scripts are drop-in `Node3D` components — attach to the player titan scene
root, wire the camera path, and the top-3 is live. Unity C# mirrors the same constants so
tuning stays identical across engines. No builds compiled, no spend — staging only,
per BudE404's standing restraint until explicit go.
