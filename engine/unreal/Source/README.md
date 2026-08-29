# Mythos Gates: Ascension — UE5 Source

## Combat System v3.0.0 (LOCKED — Aug 20, 2026)

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
│   │   ├── MythosGates.h              (Module header)
│   │   ├── Combat/
│   │   │   ├── MGCombatSystem.h       (Enums, structs, role definitions)
│   │   │   ├── MGPlayerController.h   (Tap-to-move controller)
│   │   │   ├── MGAvatarCharacter.h     (Avatar — divine projection)
│   │   │   ├── MGCombatComponent.h    (Abilities, auto-attack, cooldowns)
│   │   │   ├── MGBeliefComponent.h    (Belief bar — charges ultimate)
│   │   │   ├── MGDodgeParryResolver.h (Auto stat check system)
│   │   │   ├── MGGroundEffectZone.h   (Battlefield zones)
│   │   │   └── MGEnemyCharacter.h     (Base enemy + 10 archetypes)
│   │   ├── AI/
│   │   │   └── MGEnemyAIController.h  (Terrain-aware enemy AI)
│   │   ├── Data/
│   │   │   └── MGDeityDataAsset.h     (Primary data asset per deity)
│   │   └── Game/
│   │       └── MGGameMode.h           (Battle setup, waves, victory/defeat)
│   └── Private/
│       ├── MythosGates.cpp            (Module implementation)
│       ├── Combat/
│       │   ├── MGPlayerController.cpp (Tap-to-move, ability triggers, dodge)
│       │   ├── MGAvatarCharacter.cpp  (Avatar stats, damage resolution, faith)
│       │   ├── MGCombatComponent.cpp  (Ability execution, targeting, auto-attack)
│       │   ├── MGBeliefComponent.cpp  (Belief charging, decay, consumption)
│       │   ├── MGDodgeParryResolver.cpp (Dodge/parry math)
│       │   └── MGEnemyCharacter.cpp  (Enemy stats, death handling)
│       ├── AI/
│       │   └── MGEnemyAIController.cpp (10 archetype AI behaviors)
│       └── Game/
│           └── MGGameMode.cpp         (Battle flow, wave spawning, zone setup)
├── MythosGates.Build.cs               (Module build config: NavigationSystem, AI, BT)
└── MythosGates.uproject              (Project file, UE 5.4, mobile targets)
```

### Combat System Components

#### Player Avatar (MGAvatarCharacter)
- Divine projection of chosen Deity (deity safe in home Realm)
- God-scale: towers over environment
- Death = respawn at home domain (10-20% belief loss, preserve progression)
- Auto basic attacks when enemy in weapon range
- Divine Energy for abilities, Belief Bar for ultimate, Faction Resource for passive

#### Combat Component (MGCombatComponent)
- Manages all ability execution and cooldowns
- Auto-attack combo chain (3-4 hit, third hit bonus)
- Ability targeting: Single, Cleave, AoE, Line, Ultimate (screen-wide)
- Passive empowerment (2x damage at 5 faction stacks)
- Faith trigger tracking (combo chains for Caster, armor breaks for Assassin)

#### Belief Bar (MGBeliefComponent)
- Charges from: basic attacks (2), abilities (8), dodges (3), kills (10), faith triggers (20)
- Slight decay when not in combat (after 5s delay)
- At 100% → Ultimate unlocked
- Consumed when ultimate is used

#### Enemy AI (MGEnemyAIController)
- 10 archetypes: Swarmer, Brute, Hunter, Controller, Disruptor, Guardian, Executioner, Elite, Champion, EnemyDeity
- Terrain-aware: exploit buff zones, avoid hazards, deny player positioning
- Combat intelligence: track cooldowns, detect belief bar, exploit range
- Coordinated tactics: pincer, zone traps, ultimate denial, divide-and-conquer
- Each archetype has unique stats, decision loops, and target priorities

#### Dodge/Parry (MGDodgeParryResolver)
- Auto-resolved on enemy attack (not player input)
- Dodge Stat vs Attacker Accuracy → evade (0% damage)
- Parry Stat vs Attacker Power → reduced damage (50%)
- Both fail → full damage (minus armor reduction)

#### Ground Effect Zones (MGGroundEffectZone)
- 4 types: Damage, Buff, Debuff, Hazard
- Faction-specific layouts per battlefield
- Enemies interact with zones (exploit buffs, avoid hazards)

#### Game Mode (MGGameMode)
- 2.5D combat plane setup
- ~30-degree overhead camera
- Wave spawning system (trash mobs → elites → bosses)
- Victory: all waves cleared
- Defeat: avatar dies
- Realm advantage modifiers (home/neutral/enemy)

### Phase Status
- [x] Phase 1: Project Scaffold
- [x] Phase 2: Core Combat (C++ implementation)
- [ ] Phase 3: Content Pipeline (2D→3D, meshes, textures)
- [ ] Phase 4: Campaign & Progression
- [ ] Phase 5: UI & Polish
- [ ] Phase 6: NFT Integration

### Next Steps
- Create Blueprint visual layer on top of C++ classes
- Import deities.json as UE5 DataTables
- Set up 2.5D battlefield level
- Enemy AI Behavior Trees for complex encounter patterns
- Animation system (skeleton + rigging — next phase after combat lock)
