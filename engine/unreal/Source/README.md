# Mythos Gates: Ascension — UE5 Source

## Combat System v3.0.0 (Locked Aug 20, 2026)

### Controls
- **Tap-to-move**: Tap battlefield → avatar walks to location (NO joystick)
- **Auto basic attacks**: Free, triggers when enemy in weapon range
- **3-4 ability buttons**: Tap when charged/cooldown ready
- **1 dodge button**: Spatial dash reposition (NOT timing-based, NOT i-frames)
- **Zero joysticks**: One-hand playable

### Dodge/Parry System
- Auto-resolved stat checks (NOT player input)
- Dodge Stat vs Enemy Accuracy → evade or fail
- Parry Stat vs Enemy Power → reduced damage or full hit
- Dodge BUTTON is separate — spatial dash for repositioning only

### File Structure
```
Source/
├── MythosGates/
│   ├── Public/
│   │   ├── MythosGates.h          (Module header)
│   │   ├── Combat/
│   │   │   ├── MGCombatSystem.h   (Enums, structs, role definitions)
│   │   │   ├── MGPlayerController.h (Tap-to-move controller)
│   │   │   ├── MGDodgeParryResolver.h (Auto stat check system)
│   │   │   └── MGGroundEffectZone.h (Battlefield zones)
│   │   └── Data/
│   │       └── MGDeityDataAsset.h (Primary data asset per deity)
│   └── Private/
│       ├── MythosGates.cpp        (Module implementation)
│       └── Combat/
│           ├── MGPlayerController.cpp (Tap-to-move, ability triggers)
│           └── MGDodgeParryResolver.cpp (Dodge/parry math)
├── MythosGates.Build.cs           (Module build config)
└── MythosGates.uproject          (Project file, UE 5.4, mobile targets)
```

### Next Steps (Phase 2)
- Import deities.json as DataTables
- Create Blueprint Actor Components for combat
- Implement enemy AI archetypes (Stalker, Brute, Caster, Swarmer, Sentinel)
- Build belief bar charging system
- Create faction ground effect zone blueprints
