# Mythos Gates: Ascension — Animation & Rigging Specification

**Version:** 1.0.0
**Date:** August 29, 2026
**Status:** LOCKED
**Approved by:** BudE404 (Creative Director), BIGagent404

---

## 1. Overview

### Design Principles
- **Mobile-first performance**: Skeletal meshes use a shared master skeleton for animation retargeting. Max 1 skinned mesh per character on screen at a time (avatar) + lightweight enemy meshes.
- **6 Animation Weapon Classes**: All 28 deities share 6 animation sets based on weapon type. Individual deity flavor comes from VFX, not unique animations.
- **Combat System v3.0.0 alignment**: All animation states map directly to the locked combat system (tap-to-move, auto-attack, abilities, dodge/parry, ultimate).
- **2.5D plane**: Animation is designed for a ~30° overhead camera. Forward-facing animations are primary; side views are secondary.
- **God-scale**: Characters tower over environment. Animations should feel weighty and divine — not small-scale human movement.

### Asset Counts
| Category | Count | Animation Sets |
|----------|-------|---------------|
| Deities | 28 | 6 shared (by weapon class) |
| Enemies | 10 archetypes | 4 shared (Humanoid, Brute, Quadruped, Flying) |
| Creatures | 39 | Per body type (8 body types max) |

---

## 2. Master Skeleton

All humanoid characters (deities + humanoid enemies) share a single master skeleton for animation retargeting. This allows any animation to play on any humanoid character.

### Bone Hierarchy (87 bones)

```
Root (0)
├── Pelvis (1)
│   ├── spine_01 (2)
│   │   ├── spine_02 (3)
│   │   │   ├── spine_03 (4)
│   │   │   │   ├── clavicle_L (5)
│   │   │   │   │   └── upperarm_L (6)
│   │   │   │   │       └── lowerarm_L (7)
│   │   │   │   │           └── hand_L (8)
│   │   │   │   │               ├── thumb_01_L (9)
│   │   │   │   │               │   └── thumb_02_L (10)
│   │   │   │   │               │       └── thumb_03_L (11)
│   │   │   │   │               ├── index_01_L (12)
│   │   │   │   │               │   └── index_02_L (13)
│   │   │   │   │               │       └── index_03_L (14)
│   │   │   │   │               ├── middle_01_L (15)
│   │   │   │   │               │   └── middle_02_L (16)
│   │   │   │   │               │       └── middle_03_L (17)
│   │   │   │   │               ├── ring_01_L (18)
│   │   │   │   │               │   └── ring_02_L (19)
│   │   │   │   │               │       └── ring_03_L (20)
│   │   │   │   │               └── pinky_01_L (21)
│   │   │   │   │                   └── pinky_02_L (22)
│   │   │   │   │                       └── pinky_03_L (23)
│   │   │   │   ├── clavicle_R (24)
│   │   │   │   │   └── upperarm_R (25)
│   │   │   │   │       └── lowerarm_R (26)
│   │   │   │   │           └── hand_R (27)
│   │   │   │   │               ├── thumb_01_R (28)
│   │   │   │   │               │   └── thumb_02_R (29)
│   │   │   │   │               │       └── thumb_03_R (30)
│   │   │   │   │               ├── index_01_R (31)
│   │   │   │   │               │   └── index_02_R (32)
│   │   │   │   │               │       └── index_03_R (33)
│   │   │   │   │               ├── middle_01_R (34)
│   │   │   │   │               │   └── middle_02_R (35)
│   │   │   │   │               │       └── middle_03_R (36)
│   │   │   │   │               ├── ring_01_R (37)
│   │   │   │   │               │   └── ring_02_R (38)
│   │   │   │   │               │       └── ring_03_R (39)
│   │   │   │   │               └── pinky_01_R (40)
│   │   │   │   │                   └── pinky_02_R (41)
│   │   │   │   │                       └── pinky_03_R (42)
│   │   │   │   ├── neck_01 (43)
│   │   │   │   │   └── head (44)
│   │   │   │   │       ├── jaw (45) [for facial expressions]
│   │   │   │   │       ├── eye_L (46)
│   │   │   │   │       └── eye_R (47)
│   │   │   │   ├── shoulder_pad_L (48) [armor socket]
│   │   │   │   └── shoulder_pad_R (49) [armor socket]
│   ├── thigh_L (50)
│   │   └── calf_L (51)
│   │       └── foot_L (52)
│   │           └── toe_L (53)
│   ├── thigh_R (54)
│   │   └── calf_R (55)
│   │       └── foot_R (56)
│   │           └── toe_R (57)
│   ├── cape_01 (58) [cloth physics root]
│   │   └── cape_02 (59)
│   │       └── cape_03 (60)
│   │           └── cape_04 (61)
│   ├── skirt_01_L (62) [loincloth/skirt physics]
│   │   └── skirt_02_L (63)
│   ├── skirt_01_R (64)
│   │   └── skirt_02_R (65)
│   ├── skirt_01_B (66)
│   │   └── skirt_02_B (67)
│   ├── skirt_01_F (68)
│   │   └── skirt_02_F (69)
│   ├── wing_L (70) [optional — for deities with wings]
│   │   └── wing_02_L (71)
│   │       └── wing_03_L (72)
│   └── wing_R (73)
│       └── wing_02_R (74)
│           └── wing_03_R (75)
├── weapon_socket_R (76) [right hand weapon attach]
├── weapon_socket_L (77) [left hand weapon attach]
├── shield_socket_L (78) [left hand shield attach]
├── vfx_socket_Chest (79) [chest VFX emitter]
├── vfx_socket_Head (80) [head VFX emitter]
├── vfx_socket_Ground (81) [ground effect VFX]
├── vfx_socket_Hands (82) [hand casting VFX]
├── vfx_socket_Weapon (83) [weapon trail VFX]
├── camera_anchor (84) [camera focus point]
├── look_at_target (85) [IK look target]
└── root_motion_source (86) [root motion extraction]
```

### Bone Design Notes
- **87 bones total** — optimized for mobile (UE5 Mannequin has ~75, we add 12 for divine features)
- **Cloth bones**: Cape (4 segments) + Skirt (4 panels L/R/B/F) for divine robes/cloaks
- **Wing bones**: Optional 3-segment wings (L/R) — enabled per deity, disabled by default
- **VFX sockets**: 5 dedicated VFX attachment points for ability effects
- **Facial**: Jaw + eyes for minimal facial animation (divine expressions, not full lip-sync)
- **Armor sockets**: Shoulder pads as separate bones for physics-enabled armor pieces

---

## 3. Animation Weapon Classes

All 28 deities are assigned to 1 of 6 animation weapon classes. Each class has a unique animation set. Deities within the same class share all combat animations — individuality comes from VFX, scale, and weapon mesh.

### Class Distribution
| Class | Deities | Weapon Types |
|-------|---------|--------------|
| GreatWeapon | 4 | War Club, War Axe, War Hammer, Thunderbolt |
| SwordShield | 5 | Divine Sword, Kopis, Xiphos, Tachi, Phantom Blade |
| StaffCaster | 6 | Rune Staff, Fire Staff, Divine Staff, Dark Sceptre, War Khopesh, Magic Sceptre |
| SpearPolearm | 1 | Lunar Naginata |
| BowRanged | 7 | Hunting Bow, Celtic Bow, Light Bow, Poison Bow, Solar Bow |
| DualDagger | 5 | Hidden Blade, Seax Dagger, Shadow Daggers, Divine Dagger, Kusarigama |

### Per-Class Deity Assignment
**GreatWeapon**: Thor, Zeus, Dagda, Asmodeus
**SwordShield**: Athena, Ares, Susanoo, Morrigan, Michael
**StaffCaster**: Sutekh, Iset, Odin, Brigid, Gabriel, Lucifer
**SpearPolearm**: Tsukuyomi
**BowRanged**: Aten-Ra, Skadi, Artemis, Amaterasu, Lugh, Jophiel, Naamah
**DualDagger**: Amunet, Freyja, Izanami, Raphael, Lilith

> **Note**: SpearPolearm has only 1 deity (Tsukuyomi). If future deities are added, this class can expand. For now, Tsukuyomi's SpearPolearm set can borrow from GreatWeapon for heavy strikes and DualDagger for fast strikes.

---

## 4. Animation State Machine

### Avatar (Player) States

```
                    ┌─────────┐
                    │  Spawn  │
                    └────┬────┘
                         ▼
                    ┌─────────┐
              ┌────│  Idle   │────┐
              │    └────┬────┘    │
              │         │         │
         Move │    Combat│    Ability
              │         │         │
              ▼         ▼         ▼
         ┌────────┐ ┌────────┐ ┌──────────┐
         │  Walk  │ │BasicAtk│ │ Ability  │
         └────┬───┘ └────┬───┘ └────┬─────┘
              │         │         │
              └────┬────┘         │
                   ▼              │
              ┌─────────┐         │
              │  Blend  │◄────────┘
              └────┬────┘
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
     ┌─────────┐┌────────┐┌──────────┐
     │DodgeEvade││ParryBlk││ HitReact │
     └────┬────┘└────┬───┘└────┬─────┘
          │         │         │
          └────────┬┘         │
                   ▼          │
              ┌─────────┐    │
              │  Idle   │◄───┘
              └────┬────┘
                   ▼
              ┌─────────┐
              │  Death  │
              └─────────┘
```

### Animation States (Avatar)

| State | Trigger | Duration | Notes |
|-------|---------|----------|-------|
| Spawn | Battle start | 1.5s | Divine materialization VFX |
| Idle | No input, no enemy in range | Loop | Combat-ready stance, weapon drawn |
| Walk | Tap-to-move | Loop | Walk cycle, upper body in combat pose |
| BasicAttack_Hit1 | Auto-attack (enemy in range) | 0.4s | Combo step 1 |
| BasicAttack_Hit2 | Auto-attack chain | 0.4s | Combo step 2 |
| BasicAttack_Hit3 | Auto-attack chain | 0.5s | Combo step 3 (heavier, 1.5x bonus) |
| Ability1_Cast | Ability 1 button | 0.6-0.8s | Per weapon class |
| Ability2_Cast | Ability 2 button | 0.8-1.0s | Per weapon class |
| Signature_Cast | Signature button | 1.2-1.5s | Cinematic, camera zoom |
| Ultimate_Cast | Ultimate (100% belief) | 2.0s | Full cinematic, screen-wide VFX |
| DodgeEvade | Auto dodge stat check | 0.3s | Quick sidestep/backstep |
| ParryBlock | Auto parry stat check | 0.4s | Weapon block animation |
| HitReact | Damage taken (both fail) | 0.3s | Stagger, upper body recoil |
| DodgeDash | Dodge button | 0.25s | Quick forward/side dash |
| Death | HP reaches 0 | 1.5s | Divine dissolution (not ragdoll) |
| Respawn | Return to home domain | 1.0s | Re-materialization |

### Animation States (Enemies)

| State | Trigger | Duration | Notes |
|-------|---------|----------|-------|
| Idle | No avatar in aggro range | Loop | Combat idle |
| Walk | Moving toward avatar | Loop | Per archetype (swarmer = skitter, brute = stomp) |
| Attack | In range, cooldown ready | 0.5-1.0s | Per archetype |
| Telegraph | Pre-attack wind-up | 0.5s | Readable warning for player |
| HitReact | Damage taken | 0.2s | Short stagger |
| Death | HP reaches 0 | 1.0s | Dissolve/decay VFX |

---

## 5. Animation Set per Weapon Class

### GreatWeapon (Thor, Zeus, Dagda, Asmodeus)
Heavy, weighty 2-handed swings. Slow windup, massive impact.

| Animation | Description |
|-----------|-------------|
| Idle | Weapon resting on shoulder, wide stance |
| Walk | Heavy march, weapon swings at side |
| BasicAttack_1 | Overhead chop (right to left) |
| BasicAttack_2 | Horizontal cleave (left to right) |
| BasicAttack_3 | Jump + ground slam (both hands) |
| Ability1 | Wide arc swing (360° telegraph) |
| Ability2 | Weapon plant + shockwave |
| Signature | Multi-hit combo (3 swings + slam) |
| Ultimate | Weapon raised to sky, ground eruption |
| DodgeEvade | Heavy side-step with weapon drag |
| ParryBlock | Weapon raised as shield |
| HitReact | Stumble backward |
| DodgeDash | Shoulder charge dash |

### SwordShield (Athena, Ares, Susanoo, Morrigan, Michael)
Fast 1-handed slashes with optional shield.

| Animation | Description |
|-----------|-------------|
| Idle | Sword at side, shield forward (if equipped) |
| Walk | Quick step, sword ready |
| BasicAttack_1 | Diagonal slash (R to L) |
| BasicAttack_2 | Diagonal slash (L to R) |
| BasicAttack_3 | Thrust + spin slash |
| Ability1 | Shield bash + slash (or quick dash slash) |
| Ability2 | Rising slash (launcher) |
| Signature | Blade storm (rapid multi-hit) |
| Ultimate | Jump + downward stab (divine blade) |
| DodgeEvade | Quick sidestep with sword parry |
| ParryBlock | Shield raised (or sword block) |
| HitReact | Flinch, sword drops slightly |
| DodgeDash | Combat roll forward |

### StaffCaster (Sutekh, Iset, Odin, Brigid, Gabriel, Lucifer)
2-handed staff casting. Slower, more deliberate, magical.

| Animation | Description |
|-----------|-------------|
| Idle | Staff planted, glowing tip, hands on shaft |
| Walk | Deliberate steps, staff used as walking stick |
| BasicAttack_1 | Staff swing (arc strike) |
| BasicAttack_2 | Staff thrust (energy pulse) |
| BasicAttack_3 | Staff plant + ground pulse (AoE) |
| Ability1 | Staff raise + cast (projectile/beam) |
| Ability2 | Staff spin + cast (AoE/zone) |
| Signature | Staff slam + divine eruption |
| Ultimate | Staff to sky + cosmic ray (screen-wide) |
| DodgeEvade | Staff plant + fade step |
| ParryBlock | Staff held horizontally as barrier |
| HitReact | Staff drops, stumble |
| DodgeDash | Float/glide dash (more magical) |

### SpearPolearm (Tsukuyomi)
Thrust + sweep polearm. Medium speed, wide reach.

| Animation | Description |
|-----------|-------------|
| Idle | Spear held vertically, moon-glow tip |
| Walk | Spear carried across body |
| BasicAttack_1 | Forward thrust |
| BasicAttack_2 | Sweep (horizontal arc) |
| BasicAttack_3 | Spin + thrust (extended reach) |
| Ability1 | Spear throw + recall |
| Ability2 | Sweep + plant (zone creation) |
| Signature | Multi-thrust combo (rapid jabs) |
| Ultimate | Spear raised + moon beam (screen-wide) |
| DodgeEvade | Backstep with spear guard |
| ParryBlock | Spear held diagonally as parry |
| HitReact | Spear drops tip, step back |
| DodgeDash | Pole vault dash |

### BowRanged (Aten-Ra, Skadi, Artemis, Amaterasu, Lugh, Jophiel, Naamah)
Bow draw + release. Ranged combat, light melee backup.

| Animation | Description |
|-----------|-------------|
| Idle | Bow held at side, arrow materialized on draw |
| Walk | Quick step, bow forward |
| BasicAttack_1 | Quick draw + release |
| BasicAttack_2 | Quick draw + release (opposite side) |
| BasicAttack_3 | Full draw + charged release (piercing) |
| Ability1 | Multi-arrow fan shot |
| Ability2 | Rain arrow (AoE marker + volley) |
| Signature | Divine arrow (homing, pierces all) |
| Ultimate | Sky arrow (rain of arrows, screen-wide) |
| DodgeEvade | Quick backstep + nock arrow |
| ParryBlock | Bow held as melee guard (desperate) |
| HitReact | Flinch, bow arm drops |
| DodgeDash | Quick dash + arrow trail |

### DualDagger (Amunet, Freyja, Izanami, Raphael, Lilith)
Fast dual-wield strikes. Very fast, low recovery.

| Animation | Description |
|-----------|-------------|
| Idle | Crouched, blades forward, one high one low |
| Walk | Quick low stance, blades ready |
| BasicAttack_1 | R blade slash (high) |
| BasicAttack_2 | L blade slash (low) |
| BasicAttack_3 | Dual cross slash (X pattern) |
| Ability1 | Dash strike (dash through enemy) |
| Ability2 | Blade flurry (rapid multi-hit) |
| Signature | Shadow strike (teleport + multi-hit) |
| Ultimate | Death dance (screen-wide dual slashes) |
| DodgeEvade | Spin dodge (low, fast) |
| ParryBlock | Crossed blades block |
| HitReact | Quick flinch, recover fast |
| DodgeDash | Shadow dash (smoke trail) |

---

## 6. Enemy Animation Body Types

Enemies are grouped into 4 body types for shared animation:

### Humanoid (Swarmer, Disruptor, Guardian, Executioner, Elite, EnemyDeity)
Shares the master skeleton. Different scaling and speed per archetype.

### Brute (Brute, Champion)
Modified skeleton — wider shoulders, shorter legs, heavy upper body. Separate animation set with stomping walk, overhead smash, charge.

### Quadruped (Hunter — if beast-like)
4-legged skeleton. Different walk, attack (pounce/lunge), and death.

### Flying (Controller — if hovering)
Modified skeleton with wing bones enabled. Float idle, dive attack, withdraw.

---

## 7. Rigging Specification

### IK Setup
- **Foot IK**: 2-bone IK on both legs (thigh → calf → foot). Target = foot bone, pole vector = knee.
- **Hand IK**: 2-bone IK on both arms (upperarm → lowerarm → hand). Used for weapon grip alignment.
- **Look-At IK**: Head bone tracks look_at_target (camera or enemy). Subtle, 30° max rotation.
- **Hand-to-Weapon IK**: Right hand auto-aligns to weapon grip socket.

### Constraints
- **Spine**: 3-bone IK chain (spine_01 → spine_02 → spine_03). Limited rotation for upper body twist.
- **Clavicle**: Spring constraint for natural shoulder movement during swings.
- **Cape**: 4-bone verlet simulation (cape_01 → cape_04). Wind and movement affect drape.
- **Skirt**: 4 independent 2-bone chains (L, R, B, F). Gravity + movement simulation.

### Retargeting
- UE5 IK Retargeter maps the master skeleton to each deity mesh
- All 28 deity meshes use the same skeleton → any animation works on any deity
- Per-deity adjustments: bone scale (god-scale varies), weapon socket offset

### LOD Strategy (Mobile)
| LOD | Distance | Bones Active | Notes |
|-----|----------|-------------|-------|
| LOD0 | < 15m | All 87 | Full detail, finger bones active |
| LOD1 | 15-30m | 45 | Fingers merged, cloth simplified |
| LOD2 | 30-50m | 25 | Arms/legs simplified, no cloth |
| LOD3 | 50m+ | 12 | Basic spine + limbs, no fingers/cloth |

---

## 8. Animation Blending

### Blend Spaces
| Blend Space | Axes | Purpose |
|-------------|------|---------|
| Movement | Speed (0-600) × Direction (-180° to 180°) | Walk/run directional |
| Combat Stance | Combat intensity (0-1) | Idle → combat ready → aggressive |
| Hit Direction | Angle (-180° to 180°) | Hit react direction |

### Blend Rules
- Walk → Idle: 0.2s blend
- Idle → BasicAttack: 0.05s blend (snappy combat)
- BasicAttack chain: 0.1s blend between hits (combo window)
- Any → DodgeEvade/ParryBlock: 0.0s (instant — these are auto-resolved)
- Any → HitReact: 0.05s blend
- Any → Death: 0.2s blend then lock

### Root Motion
- Walk: Root motion ON (precise tap-to-move positioning)
- Combat attacks: Root motion OFF (avatar stays in place, VFX sells the hit)
- Dodge dash: Root motion ON (dash distance is precise)
- Ultimate: Root motion OFF (cinematic camera takes over)

---

## 9. Animation Montage Structure

Each weapon class has an Animation Montage containing all combat animations:

```
Montage_MG_GreatWeapon
├── Section: BasicAttack_1 (0.0s - 0.4s)
├── Section: BasicAttack_2 (0.4s - 0.8s)
├── Section: BasicAttack_3 (0.8s - 1.3s)
├── Section: Ability1 (1.3s - 2.1s)
├── Section: Ability2 (2.1s - 3.1s)
├── Section: Signature (3.1s - 4.6s)
├── Section: Ultimate (4.6s - 6.6s)
├── Section: DodgeEvade (6.6s - 6.9s)
├── Section: ParryBlock (6.9s - 7.3s)
├── Section: HitReact (7.3s - 7.6s)
├── Section: DodgeDash (7.6s - 7.85s)
├── Section: Death (7.85s - 9.35s)
└── Section: Spawn (9.35s - 10.85s)
```

Montages are played via the C++ combat system using `PlayAnimMontage()` with section jumps for combo chains.

---

## 10. Animation Blueprint Structure (UE5)

```
ABP_MG_Avatar (Animation Blueprint)
├── Event Graph
│   ├── Update Combat State (from MGCombatComponent)
│   ├── Update Movement Speed (from CharacterMovementComponent)
│   ├── Update Weapon Class (from DeityData)
│   └── Update Health State (from MGAvatarCharacter)
│
├── State Machine: Locomotion
│   ├── Spawn → Idle
│   ├── Idle ↔ Walk
│   ├── Idle/Walk → BasicAttack
│   ├── Idle/Walk → Ability
│   ├── Idle/Walk → DodgeDash
│   └── Any → Death
│
├── State Machine: Combat
│   ├── BasicAttack_1 → BasicAttack_2 → BasicAttack_3
│   ├── BasicAttack → Ability1/Ability2/Signature
│   ├── BasicAttack → Ultimate
│   └── Combo timeout → Idle (1.5s window)
│
├── State Machine: Reaction
│   ├── Any → DodgeEvade (auto-resolved, priority 1)
│   ├── Any → ParryBlock (auto-resolved, priority 2)
│   └── Any → HitReact (priority 3)
│
└── Layered Blend
    ├── Upper Body (combat animations)
    ├── Lower Body (movement/stance)
    └── Cloth (physics simulation)
```

---

## 11. Performance Budget (Mobile)

| Metric | Budget | Notes |
|--------|--------|-------|
| Avatar animations | 1 character | Only 1 avatar on screen |
| Enemy animations | Max 15 | Swarmer waves, LOD reduces cost |
| Bones per character (LOD0) | 87 | Drops to 12 at LOD3 |
| Animation memory | < 20MB total | Compressed animations |
| Blend time | 0.05-0.2s | Snappy combat, smooth locomotion |
| Animation FPS | 30fps | Mobile target (cinematic at 30) |

### Compression
- All animations use UE5 ACL (Animation Compression Library)
- Target: < 50KB per animation clip
- Total animation budget: < 20MB across all 6 weapon class sets + enemy sets

---

## 12. Production Pipeline

### Step 1: Master Skeleton Creation
1. Create master skeleton in UE5 (87 bones per spec)
2. Set up IK chains (foot, hand, look-at)
3. Configure bone constraints (spine, clavicle, cloth)
4. Create LOD bone reduction rules

### Step 2: Base Animation Set (per weapon class)
1. Blockout key poses (idle, walk, attack, death)
2. Create blend spaces (movement, combat stance)
3. Build animation montage per weapon class
4. Set up AnimBP state machine

### Step 3: Retargeting to Deity Meshes
1. Import TRELLIS.2 3D meshes (from approved 2D art)
2. Create IK Retargeter per deity mesh
3. Bind master skeleton to each deity mesh
4. Verify animations play correctly on all 28 meshes

### Step 4: Enemy Animation Sets
1. Create Humanoid enemy animations (shares master skeleton)
2. Create Brute skeleton + animations
3. Create Quadruped skeleton + animations (if needed)
4. Create Flying skeleton + animations (if needed)

### Step 5: VFX Integration
1. Attach VFX to bone sockets (chest, head, hands, weapon, ground)
2. Create VFX per ability (using ability data from combat kits)
3. Sync VFX timing with animation montages
4. Create ultimate VFX (screen-wide, cinematic)

### Step 6: Polish
1. Add cloth physics (cape, skirt)
2. Add secondary animation (hair, accessories)
3. Add facial expressions (jaw, eyes — minimal)
4. Optimize LOD transitions
5. Performance profiling on mobile

---

## 13. Deliverables Checklist

- [ ] Master skeleton (87 bones, IK chains, constraints)
- [ ] 6 Animation Montages (1 per weapon class, 13 sections each)
- [ ] ABP_MG_Avatar Animation Blueprint (3 state machines)
- [ ] ABP_MG_Enemy Animation Blueprint (per body type)
- [ ] IK Retargeter for each of 28 deity meshes
- [ ] Enemy skeletons (Humanoid shared, Brute, Quadruped, Flying)
- [ ] Enemy animation sets (per body type)
- [ ] Blend spaces (Movement, Combat Stance, Hit Direction)
- [ ] LOD configuration (4 levels)
- [ ] VFX socket attachment test
- [ ] Performance profiling (mobile target: 30fps)

---

**Document Status:** LOCKED — All animation specs, bone hierarchy, and weapon class assignments are final.
**Next Phase:** Master skeleton creation → Base animation blockout → TRELLIS.2 mesh retargeting
