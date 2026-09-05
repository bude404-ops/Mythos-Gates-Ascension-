# Mythos Gates — Unity Build (ACTIVE per BudE404 go, Sept 5 2026)

**The playable prototype is GO: Mixamo free placeholders prove the loop first, canon 3D swaps in later.**
This folder is a drop-in `Assets/` bundle + guides — copy into any Unity 6 URP project.

## Contents
- `Assets/Scripts/GameFeelConstants.cs` — single tuning truth (mirrors Godot + GAMEFEEL_TOP3_SPEC)
- `Assets/Scripts/TitanCamera.cs` — trauma shake + mortal-height camera
- `Assets/Scripts/TitanFootstep.cs` — footstep weight (shake + dust + bass)
- `Assets/Scripts/TitanGroundSlam.cs` — slam shockwave (windup + ring + launch)
- `Assets/Scripts/PlayerTitan.cs` — playable giant: tap-to-move 30m, walk 4 / charge 8 m/s, L1 7m arc
- `Assets/Scripts/FaithSystem.cs` — FAITH economy (+1 ant, +5 brute, trickle in worship zones)
- `Assets/Scripts/EnemyAnt.cs` — T1 one-tap ragdoll swarm
- `Assets/Scripts/EnemyBrute.cs` — T2 stagger brute (5 hits, +5 FAITH)
- `Assets/Scripts/WorshipZone.cs` — passive FAITH trickle trigger
- `Assets/Shaders/ShockwaveRing.shader` — emissive expanding slam ring
- `MIXAMO_PLACEHOLDER_GUIDE.md` — the full build: rigs, clips, weight law, scene assembly, test loop

## Build order (the go)
1. Follow MIXAMO_PLACEHOLDER_GUIDE.md (~20 min to first play)
2. Prove the loop: weight, one-tap satisfaction, slam moment
3. Verdict → canon Meshy 3D swap-in over the SAME Animator states (no code changes)
4. Then: player HP, T3 duels, Gate Rite ults, UI

## Constants law
`GameFeelConstants.cs` stays byte-identical with the Godot values — the SPEC is the cross-engine contract.
