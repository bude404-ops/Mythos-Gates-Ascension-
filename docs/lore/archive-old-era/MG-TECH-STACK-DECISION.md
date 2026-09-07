# Mythos Gates: Ascension — Tech Stack Decision

## Status: RECOMMENDATION READY FOR CREATOR APPROVAL
## Date: August 20, 2026

---

## Executive Summary

After analyzing the game design (one-deity-vs-many action RPG, mobile-first, 28 deities, 39 creatures, 7 factions, campaign + endgame systems), three engine options were evaluated. **Unreal Engine 5** is recommended for the production build, with **Unity** as a viable alternative and **Web (WebGL/WebGPU)** as a prototyping/preview layer only.

---

## Option A: Unreal Engine 5 (RECOMMENDED)

### Why UE5
- **Nanite + Lumen** handle the colossal deity scale (hundreds of feet tall) with dynamic lighting without baked lightmap overhead
- **Niagara particle system** for divine auras, faction energy effects, Hollow void-mist, Gate-light bleeding
- **Chaos physics** for destructible mythic terrain (ruins, temple columns, Gate structures)
- **Gameplay Ability System (GAS)** maps directly to our 4-ability kit (basicAttack, ability1, ability2, signature, ultimate, passive)
- **Mobile scalability** via UE5's Forward+ renderer and device profiles
- **3D pipeline**: TRELLIS.2 outputs are compatible with UE5's FBX/glTF import
- **Marketplace**: Existing action RPG templates, boss fight frameworks

### Architecture
- **Frontend**: UE5 mobile build (iOS/Android) + PC build
- **Backend**: Base44 entities + backend functions (already built)
- **Data**: JSON data files → UE5 Data Tables via import pipeline
- **Art**: 2D concept art → TRELLIS.2 3D models → UE5 materials/particles

### Concerns
- Larger build size (~2GB mobile)
- Steeper learning curve for team
- Mobile performance requires careful LOD and material optimization

### Mitigation
- Use UE5's mobile previewer for device profiling
- Nanite for static meshes only; dynamic meshes use traditional LODs
- Pak chunking for downloadable content

---

## Option B: Unity (VIABLE ALTERNATIVE)

### Why Unity
- **Better mobile footprint** — smaller builds, more devices supported
- **Easier team onboarding** — C# vs C++, larger developer pool
- **VFX Graph + Shader Graph** for divine effects
- **Addressables** for content streaming (28 deities + 39 creatures + campaigns)
- **2D + 3D in same pipeline** — useful for concept-to-3D iteration
- **DOTS** for large-scale enemy waves (hundreds of trash mobs)

### Architecture
- Same backend (Base44 entities + functions)
- Data Tables via ScriptableObjects
- Art pipeline: 2D → TRELLIS.2 → Unity prefabs

### Concerns
- No Nanite equivalent — colossal scale requires manual LOD management
- Lighting requires baked lightmaps for mobile (slower iteration)
- VFX Graph less mature than Niagara for complex particle behaviors

---

## Option C: Web (WebGL/WebGPU) — PROTOTYPE ONLY

### Why Web
- **Zero install** — shareable via URL, great for investor demos
- **Fast iteration** — existing mini-app HTML (436KB) already works
- **WebGPU** maturing for real-time 3D in browser

### Why NOT production
- Mobile WebGL performance is poor for action combat
- No access to device GPU features (compute shaders limited)
- Texture/memory limits on mobile browsers
- Can't deliver the "divine power fantasy" visual quality

### Recommended Use
- Keep the existing HTML mini-app as a **campaign map viewer and tactical preview**
- Use Three.js/Babylon.js for 3D preview of deity models
- Production builds ship on UE5 (or Unity)

---

## Recommendation: Unreal Engine 5

| Criteria | UE5 | Unity | Web |
|---|---|---|---|
| Visual quality | ★★★★★ | ★★★★ | ★★ |
| Mobile performance | ★★★ | ★★★★★ | ★★ |
| Art pipeline (TRELLIS.2) | ★★★★★ | ★★★★ | ★★ |
| Combat system (GAS) | ★★★★★ | ★★★★ | ★★ |
| Team scalability | ★★★ | ★★★★★ | ★★★★ |
| Colossal scale rendering | ★★★★★ | ★★★ | ★★ |
| Time to vertical slice | 4-6 months | 3-5 months | 1-2 months |

### Decision needed from: BudE404

---

## Hybrid Pipeline (Recommended)

```
Phase 1 (Now): Web prototype for mechanics validation
  └── Existing HTML mini-app + Three.js 3D preview
  └── Validate combat feel, progression loop, campaign flow

Phase 2 (Months 1-3): UE5 vertical slice
  └── Import 2D art → TRELLIS.2 → UE5
  └── One faction (Aten Ra) fully playable
  └── 4 deities, 1 campaign, basic combat + leveling

Phase 3 (Months 4-9): Full production
  └── All 7 factions, 28 deities, 39 creatures
  └── Campaign + endgame (arena, raids, trials)
  └── Mobile optimization pass

Phase 4 (Months 10-12): Launch
  └── Soft launch → polish → global release
  └── NFT launchpad integration
```
