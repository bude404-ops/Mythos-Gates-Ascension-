# MIXAMO PLACEHOLDER GUIDE — Playable Prototype Build (BudE404 go: Sept 5 2026)

**Strategy:** prove the game loop on FREE Mixamo placeholder rigs. Zero canon risk. When the
loop feels right, canon Meshy models swap in over the same Animator states — no code changes.

## STEP 1 — Download the placeholder rigs (mixamo.com, free)
Log in → Characters → download TWO rigs (FBX, "With Skin", 30fps):
1. **Player giant:** any tall armored humanoid (e.g. "Vanguard By T. Choonyung" or "Knight")
2. **T1 swarm:** a small creepy character (e.g. "Pumpkinhulk" or any low-poly monster) — duplicate 10-20x
3. **T2 brute:** a bulky monster (e.g. "Ogre" or "The Butcher")

## STEP 2 — Download the ANIMATION SET (Mixamo, free, FBX "Without Skin" for each rig)
Player giant: `Idle` / `Walking` / `Running` / `Sword Slash` (or `Punching`) / `Death`
T2 brute: `Idle` / `Walking` / `Hit React` / `Death`

## STEP 3 — WEIGHT LAW (titan weight = timescale 0.55–0.7)
In Unity: select each imported animation clip → Inspector → **Samples: 30 → ~18-21** (or add an
Animator State speed of 0.6). Every animation must move at 60-70% speed. This is the single
biggest feel-law — the giant must feel HEAVY.

## STEP 4 — Scene assembly (20 minutes)
1. New Unity 6 project → **3D (URP)**
2. Copy this whole `Assets/` folder into your project's Assets
3. **Ground:** 3D Object → Plane, scale to taste; add worship zone: another smaller plane/cylinder
   with `BoxCollider (isTrigger)` + `WorshipZone` script
4. **Player:** drop the giant FBX in scene → scale so he's **~9m tall** (combat manifest scale) →
   add `CharacterController`, `PlayerTitan`, `TitanCamera`, `TitanFootstep`, `TitanGroundSlam`, `FaithSystem`
   - Create an `AnimatorController`: states named EXACTLY `idle` / `walking` / `running` / `slash`,
     wire your Mixamo clips into them. Assign it to `PlayerTitan.anim`.
   - Layers: Edit → Project Settings → Tags and Layers → add layers `Enemy`; set every enemy
     to that layer; set `PlayerTitan.enemyMask` = Enemy.
5. **Enemies:** drop T1 rig in → add `EnemyAnt` (collider on it). Duplicate for a swarm.
   T2 rig → `EnemyBrute` (set `enemyMask` includes its layer).
6. **Shockwave:** create a quad (flat) with `MythosGates/ShockwaveRing` material, scale to 36m
   (2x the 18m ring), attach under `TitanGroundSlam.ringPrefab`.
7. **Camera:** TitanCamera grabs Camera.main; position it at mortal eye height looking at the giant.

## STEP 5 — The test loop (what "it works" means)
- Click ground → giant walks (4 m/s), Shift+W → charges (8 m/s), each footfall shakes the camera
- Right-click → L1 swing → ants within the 7m arc DIE IN ONE TAP + ragdoll, +1 FAITH each
- Ground-slam → 18m ring wipes the swarm, camera trauma
- Brutes take 5 hits, stagger, +5 FAITH
- Stand in the worship zone → FAITH trickles
- **Game-feel verdict questions:** Does the weight read? Does the one-tap feel good?
  Does the slam feel like a $@#! moment? → that's the green light for canon 3D.

## WHAT'S NOT IN THIS PASS (intentional)
Player HP/damage, T3 boss duels, UI, sprites, realms, Gate Rite ults (FAITH 80) — next pass
after the loop verdict.
