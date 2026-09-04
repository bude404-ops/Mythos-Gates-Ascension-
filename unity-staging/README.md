# Mythos Gates — Unity Staging (Game-Feel Top-3)

Unity was added as a second engine (Sept 4, BudE404). This folder STAGES the game-feel
top-3 for Unity — no project files committed yet, no builds, no migrations, per the
standing restraint until BudE404's explicit go.

## Contents
- `Assets/Scripts/GameFeelConstants.cs` — single source of tuning truth, mirrored from
  `docs/GAMEFEEL_TOP3_SPEC.md` and the Godot `scripts/gamefeel/` headers.
- `Assets/Scripts/TitanCamera.cs` — trauma shake + low titan camera (mortal eye height).
- `Assets/Scripts/TitanFootstep.cs` — footstep weight (shake + dust + falling bass).
- `Assets/Scripts/TitanGroundSlam.cs` — shockwave (windup + ring + cracks + displacement).

## Wiring (when the Unity project scaffold goes live)
1. Add the four scripts to the player titan prefab.
2. Assign `cam` (TitanCamera), `dustPrefab`, `bassThump`, `ringPrefab`, `crackDecalPrefab`,
   and set `enemyMask` to the enemy layer.
3. Call `TitanFootstep.FootContact(footWorldPos)` from a walk-animation Animation Event
   at each foot-plant frame; call `TitanGroundSlam.TriggerSlam()` from the mobile
   slam ability button.
4. Tuning stays in `GameFeelConstants.cs` — keep it byte-identical with the Godot values.

## Pipeline compatibility (confirmed earlier)
- Meshy → Mixamo exports (FBX/GLB) import into Unity natively — no rework needed.
- The Godot scripts in `scripts/gamefeel/` implement the identical constants; retune in
  one place per engine, but keep the SPEC as the cross-engine contract.
