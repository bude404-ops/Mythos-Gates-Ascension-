# Mythos Gates: Ascension — Master Rigging Checklist (Phase 2.5)

**Version:** 1.0.0
**Created:** 2026-08-29
**Status:** READY FOR UE5 EDITOR
**Director:** BudE404
**Engine:** UE5 (target mobile + PC)

---

## 1. SHARED MASTER SKELETON (87 BONES)

All 28 playable deities + humanoid enemies share ONE master skeleton.

### IK Chains
| Chain | Bones | Type | Notes |
|-------|-------|------|-------|
| Foot IK L | thigh_L -> calf_L -> foot_L | 2-bone | Foot placement on terrain |
| Foot IK R | thigh_R -> calf_R -> foot_R | 2-bone | Foot placement on terrain |
| Hand IK L | upperarm_L -> lowerarm_L -> hand_L | 2-bone | Left weapon grip / shield |
| Hand IK R | upperarm_R -> lowerarm_R -> hand_R | 2-bone | Right weapon grip |
| Look-At | head -> look_at_target | 30 max | Combat target tracking |

### Cloth Physics (Per Faction)
| Faction | Cloth Bones | Sim Type | Notes |
|---------|-------------|----------|-------|
| Aten Ra | cape (4-bone), skirt (4x2-bone) | Verlet | Linen -- light flow, sand-wind |
| Asgardian | cape (4-bone), skirt (4x2-bone) | Verlet | Fur-lined -- heavier sway |
| Olympian | cape (4-bone), skirt (4x2-bone) | Verlet | Marble-drape -- stiffer, gravity-heavy |
| Kami | cape (4-bone) | Verlet | Spirit trail -- translucent, mist dissolve at edges |
| Tuatha | cape (4-bone), skirt (4x2-bone) | Verlet | Organic -- vines/leaves can grow through cloth |
| Empyrean | cape (4-bone) | Verlet | Templar mantle -- heavy cloth, minimal sway, light bleed through seams |
| Infernal Dominion | cape (4-bone) | Verlet | Living shadow -- anti-physics, moves against wind, predatory |

### LOD Bone Reduction (All Deities)
| LOD | Distance | Bones | What's Cut |
|-----|----------|-------|-----------|
| LOD0 | < 15m | 87 | Nothing -- full detail |
| LOD1 | 15-30m | 45 | Fingers merged, cloth simplified |
| LOD2 | 30-50m | 25 | Arms/legs simplified, no cloth |
| LOD3 | 50m+ | 12 | Basic spine + limbs only |

### Wing Bones (Optional Per Deity)
| Deity | Wing Type | Bones | Notes |
|-------|-----------|-------|-------|
| Michael (Empyrean) | Light-tether wings | wing_L/R (3-seg) | Diablo-style energy strands |
| Gabriel (Empyrean) | Light-tether wings | wing_L/R (3-seg) | Diablo-style energy strands |
| Raphael (Empyrean) | Light-tether wings | wing_L/R (3-seg) | From behind mantle |
| Jophiel (Empyrean) | Light-tether wings | wing_L/R (3-seg) | From behind mantle |
| Freyja (Asgardian) | Falcon-feather wings | wing_L/R (3-seg) | Optional, lore-accurate |
| Lilith (Infernal) | Shadow wings (optional) | wing_L/R (3-seg) | Living shadow tendrils |

---

## 2. WEAPON ANIMATION CLASSES (6 TOTAL)

### Class 1: GREAT WEAPON (4 deities)
Deities: Thor, Zeus, Dagda, Asmodeus
- Dagda: Oak Club + Cauldron-Lid Shield (dual-weapon, shield socket)
- Thor: Mjolnir (war hammer)
- Zeus: Thunderbolt
- Asmodeus: War Axe
13 montage sections: Spawn, Idle, Walk, BasicAttack1-3, Ability1-2, Signature, Ultimate, DodgeDash, HitReact, Death

### Class 2: SWORD & SHIELD (5 deities)
Deities: Athena, Ares, Susanoo, Morrigan, Michael
- Athena: Aegis Shield + Bronze Spear (APPROVED ART)
- Ares: War Spear + Kopis (Spartan helm pushed back)
- Susanoo: Storm Katana (no shield, left hand free for storm gestures)
- Morrigan: Black Spear + Crow-Feather Sickle (APPROVED ART v6, dual-weapon)
- Michael: Flaming Sword + Choir Shield (Empyrean Templar standard)
13 montage sections

### Class 3: STAFF / CASTER (6 deities)
Deities: Sutekh, Iset, Odin, Brigid, Gabriel, Lucifer
- Iset: Throne Sceptre (APPROVED ART v7)
- Odin: Gungnir as walking staff (wanderer aesthetic, APPROVED ART)
- Brigid: Smith Hammer + Fire Sickle (APPROVED ART, dual-weapon)
- Sutekh: Storm-Spear + Hooked Blade (dual-weapon)
- Gabriel: Trumpet-Spear + Buckler (Empyrean)
- Lucifer: Black Star Longsword + Obsidian Shield (Infernal)
13 montage sections

### Class 4: SPEAR / POLEARM (1 deity)
Deities: Tsukuyomi
- Tsukuyomi: Crescent Naginata (Kami spirit-body)
13 montage sections
Note: Only 1 deity. Keep separate for now, may merge with GreatWeapon later.

### Class 5: BOW / RANGED (7 deities)
Deities: Aten-Ra, Skadi, Artemis, Amaterasu, Lugh, Jophiel, Lilith
- Lilith: Shadow Bow (APPROVED v5, shadow-formed bow VFX, anti-light, bare feet)
- Skadi: Frost Bow (APPROVED v4)
- Artemis: Hunting Bow (APPROVED v5)
- Amaterasu: Solar Bow (APPROVED v7, spirit-body translucency)
- Jophiel: Light Bow (APPROVED v1, Empyrean Templar)
- Aten-Ra: Solar Bow staff-bow hybrid
- Lugh: Celtic Bow + Sling
13 montage sections

### Class 6: DUAL WIELD / DAGGER (5 deities)
Deities: Amunet, Freyja, Izanami, Raphael, Asmodeus(alt)
- Amunet: Obsidian Name-Knives (APPROVED v7)
- Freyja: Seax Dagger (APPROVED v6, Seidr magic)
- Izanami: Kusarigama (APPROVED v8, CHAIN PHYSICS needed)
- Raphael: Divine Dagger (APPROVED v18, THE locked Empyrean Templar standard)
- Asmodeus: Barbed Glaive + Ember Hooks
13 montage sections

---

## 3. MONTAGE CREATION ORDER

Build montage sets in this order to maximize reuse:
1. SwordShield Montage -> rig Athena first (approved art)
2. BowRanged Montage -> rig Lilith first (approved art, unique VFX)
3. StaffCaster Montage -> rig Iset first (approved art)
4. DualDagger Montage -> rig Amunet first (approved art)
5. GreatWeapon Montage -> rig Dagda first (approved art)
6. SpearPolearm Montage -> rig Tsukuyomi (no approved art yet, last priority)

Total: 6 classes x 13 sections = 78 unique animations
Total montage assets: 6 (one per weapon class)

---

## 4. UE5 EDITOR IMPORT STEPS (PER DEITY)

1. [ ] Import approved 2D art as texture reference
2. [ ] Generate 3D mesh via TRELLIS.2 (from approved 2D image)
3. [ ] Import mesh into UE5
4. [ ] Run IK Retargeter to bind to 87-bone master skeleton
5. [ ] Assign weapon mesh to weapon_socket_R (or _L for shield)
6. [ ] Assign AnimBP with correct weapon class
7. [ ] Apply faction cloth physics asset
8. [ ] Configure VFX emitters on sockets
9. [ ] Set up LODs (87 -> 45 -> 25 -> 12)
10. [ ] Test in preview (idle, walk, attack, dodge, death)
11. [ ] Verify mobile performance (LOD transitions, bone count)
12. [ ] Sign off

---

## 5. SPECIAL CASES

### Chain Physics
- Izanami (kusarigama) -- UE5 physics constraint on chain segment

### Spirit-Body Translucency
- All Kami deities (Amaterasu, Tsukuyomi, Susanoo, Izanami) -- fresnel-based opacity, mist dissolve

### Anti-Light / Inverted Glow
- All Infernal deities (Lilith, Lucifer, Asmodeus, Naamah) -- light absorption shader

### Light-Tether Wings
- All Empyrean deities (Michael, Gabriel, Raphael, Jophiel) -- particle-driven, NOT skeletal animation

### Templar Armor Standard
- All Empyrean deities -- follow Raphael v18 locked standard, shared armor material template

### Dual-Weapon Handling
- Dagda (club+shield), Morrigan (spear+sickle), Brigid (hammer+sickle), Sutekh (spear+blade)
- Both weapon sockets active, left-hand IK for shield/secondary

---

## 6. SUMMARY

| Metric | Count |
|--------|-------|
| Total deities to rig | 28 |
| Weapon animation classes | 6 |
| Animations per class | 13 |
| Total unique animations | 78 |
| Montage assets needed | 6 |
| Shared master skeleton bones | 87 |
| LOD levels | 4 |
| Cloth physics types | 7 (one per faction) |
| Deities with wings | 6+ |
| Deities with approved art | 14 |
| Deities needing 3D mesh generation | 28 |

---

## NEXT ACTIONS

1. Build SwordShield montage first (Athena is approved, sets the pattern)
2. Import Athena mesh -> retarget -> assign montage -> test
3. Repeat for next SwordShield deity
4. Move to BowRanged batch (Lilith first)
5. Continue through all 6 batches

BudE404 approves each deity rig before moving to the next.
