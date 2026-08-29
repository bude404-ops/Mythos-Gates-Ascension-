#pragma once

#include "CoreMinimal.h"
#include "MGMasterSkeleton.generated.h"

// Master Skeleton Definition for Mythos Gates: Ascension
// 87 bones — shared across all 28 deities + humanoid enemies
// Optimized for mobile (UE5 ACL compression, LOD bone reduction)

/*
=== BONE HIERARCHY (87 bones) ===

Root (0)
├── Pelvis (1)
│   ├── spine_01 (2)
│   │   ├── spine_02 (3)
│   │   │   ├── spine_03 (4)
│   │   │   │   ├── clavicle_L (5) → upperarm_L (6) → lowerarm_L (7) → hand_L (8)
│   │   │   │   │   ├── thumb_01-03_L (9-11)
│   │   │   │   │   ├── index_01-03_L (12-14)
│   │   │   │   │   ├── middle_01-03_L (15-17)
│   │   │   │   │   ├── ring_01-03_L (18-20)
│   │   │   │   │   └── pinky_01-03_L (21-23)
│   │   │   │   ├── clavicle_R (24) → upperarm_R (25) → lowerarm_R (26) → hand_R (27)
│   │   │   │   │   ├── thumb_01-03_R (28-30)
│   │   │   │   │   ├── index_01-03_R (31-33)
│   │   │   │   │   ├── middle_01-03_R (34-36)
│   │   │   │   │   ├── ring_01-03_R (37-39)
│   │   │   │   │   └── pinky_01-03_R (40-42)
│   │   │   │   ├── neck_01 (43) → head (44)
│   │   │   │   │   ├── jaw (45)
│   │   │   │   │   ├── eye_L (46)
│   │   │   │   │   └── eye_R (47)
│   │   │   │   ├── shoulder_pad_L (48) [armor socket]
│   │   │   │   └── shoulder_pad_R (49) [armor socket]
│   ├── thigh_L (50) → calf_L (51) → foot_L (52) → toe_L (53)
│   ├── thigh_R (54) → calf_R (55) → foot_R (56) → toe_R (57)
│   ├── cape_01 (58) → cape_02 (59) → cape_03 (60) → cape_04 (61) [cloth physics]
│   ├── skirt_01_L (62) → skirt_02_L (63) [cloth physics L]
│   ├── skirt_01_R (64) → skirt_02_R (65) [cloth physics R]
│   ├── skirt_01_B (66) → skirt_02_B (67) [cloth physics back]
│   ├── skirt_01_F (68) → skirt_02_F (69) [cloth physics front]
│   ├── wing_L (70) → wing_02_L (71) → wing_03_L (72) [optional wings]
│   └── wing_R (73) → wing_02_R (74) → wing_03_R (75) [optional wings]
├── weapon_socket_R (76) [right hand weapon attach]
├── weapon_socket_L (77) [left hand weapon attach]
├── shield_socket_L (78) [shield attach]
├── vfx_socket_Chest (79) [chest VFX emitter]
├── vfx_socket_Head (80) [head VFX emitter]
├── vfx_socket_Ground (81) [ground effect VFX]
├── vfx_socket_Hands (82) [hand casting VFX]
├── vfx_socket_Weapon (83) [weapon trail VFX]
├── camera_anchor (84) [camera focus point]
├── look_at_target (85) [IK look target]
└── root_motion_source (86) [root motion extraction]

=== IK CHAINS ===
- Foot IK: thigh → calf → foot (2-bone IK, both legs)
- Hand IK: upperarm → lowerarm → hand (2-bone IK, both arms)
- Look-At IK: head → look_at_target (30° max rotation)
- Hand-to-Weapon IK: right hand auto-aligns to weapon grip

=== CONSTRAINTS ===
- Spine: 3-bone chain, limited rotation for upper body twist
- Clavicle: Spring constraint for natural shoulder movement
- Cape: 4-bone verlet simulation (wind + movement)
- Skirt: 4 independent 2-bone chains (L/R/B/F), gravity + movement
- Wings: Optional, 3-segment, enabled per deity

=== LOD BONE REDUCTION ===
- LOD0 (< 15m): All 87 bones active, full detail
- LOD1 (15-30m): 45 bones (fingers merged, cloth simplified)
- LOD2 (30-50m): 25 bones (arms/legs simplified, no cloth)
- LOD3 (50m+): 12 bones (basic spine + limbs only)

=== RETARGETING ===
- All 28 deity meshes use the same master skeleton
- UE5 IK Retargeter maps master skeleton to each mesh
- Per-deity adjustments: bone scale, weapon socket offset
- Any animation works on any deity (shared animation pool)
*/
