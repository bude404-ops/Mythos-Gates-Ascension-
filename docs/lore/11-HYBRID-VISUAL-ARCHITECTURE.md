# Hybrid 2D Sprite + 3D Campaign Visual Architecture

**Codex ID:** MG-VISUAL-ARCH-001  
**Director:** Development Director  
**Status:** Canon Locked  
**Updated:** 2026-08-10

## Non-Negotiable Rule

Mythos Gates: Ascension is intentionally hybrid.

- **2D sprites** are used for player avatars (divine projections of Deities), player characters, enemy characters, enemy deities, battlefield units, and combatants.
- **3D environments** are used for campaign maps, Realms, locations, exploration spaces, tactical battle environments where appropriate, campaign progression spaces, and major environmental scenes.
- Battlefield characters must **not** become 3D models just because the environment is 3D.
- Realm travel is handled through **Mythos Gates / Stargates**, not futuristic craft or sci-fi spacecraft.

## Campaign Map Architecture

Campaign maps are elongated 3D journey environments, not flat level-select menus.

The player's Avatar should visually travel through a Realm:

**Start → Encounter → Battle → Event → Elite Battle → Treasure / Reward → Boss → Next Region**

The path physically exists inside the 3D environment. The map must communicate distance, direction, terrain, Realm identity, locations, battle sites, boss objectives, Gates, and progression.

## Mobile Campaign Camera

Use a controlled third-person / diorama-style camera:

- Slightly elevated perspective
- Clear path visibility
- Cinematic environment framing
- Controlled camera movement
- Limited unnecessary rotation
- No complicated open-world camera unless gameplay truly requires it

## 2D Sprites on 3D Battlefields

Tactical encounters use 3D battlefields with 2D sprites for all combatants.

Sprites must feel grounded with:

- Contact shadows
- Ground shadows
- Selection circles
- Movement indicators
- Tile/grid positioning
- Perspective-aware scale
- Ability effects that connect to terrain

Deities may be larger than normal characters, but scale must be intentional and consistent.

## Campaign to Battle Flow

1. 3D campaign map
2. Encounter reached
3. Location reveal camera push
4. Battle initialization
5. 3D tactical environment loads
6. 2D sprites appear
7. Combat begins
8. Victory / reward
9. Return to 3D campaign map

The battle must feel like it exists inside the campaign world.

## Asset Pipeline

Assets are separated by purpose:

```text
art/
  sprites/
    deitys/
    characters/
    enemies/
  3d/
    realms/
    campaign/
    battlefields/
    locations/
    gates/
    environment/
  portraits/
  cinematic/
```

Every asset declares one type: **SPRITE**, **PORTRAIT**, **CINEMATIC**, **ENVIRONMENT**, **LOCATION**, or **GATE**.

## Visual QA Requirements

Visual QA must test:

- Sprite readability
- Sprite scale
- Sprite grounding
- Environment performance
- Camera framing
- Terrain visibility
- UI visibility
- Mobile performance
- Asset loading
- Lighting
- Map navigation
- Campaign path clarity
- Gate landmark visibility
- Battle transition continuity

## Director Ruling

This architecture is now canon. The Development Platform must preview Campaign, Battle, and Full Flow using this hybrid rule before major visual approval.
