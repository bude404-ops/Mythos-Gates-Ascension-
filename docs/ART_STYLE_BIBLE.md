# Mythos Gates: Ascension — Art Style Bible v1.0

> **Locked:** August 18, 2026
> **Approved by:** BudE404
> **Baseline render:** Aten Ra v5 (full-body, gold solar radiance skin, white linen clothing, gold/blue/turquoise armor)

---

## 1. Overall Style: Premium Stylized Dark Fantasy

Mythos Gates: Ascension uses a **stylized dark fantasy** art direction — not photorealistic, not cartoonish. The style sits between realism and stylization, prioritizing:

- **Bold silhouettes** — each deity must be instantly recognizable by outline alone
- **Faction color identity** — strict palettes that make faction membership visible at a glance
- **Atmospheric depth** — dark, moody backgrounds with divine radiance from the deity
- **Material-driven surfaces** — every surface communicates what it IS (radiance, marble, storm, fire)
- **Mobile-readable** — silhouettes and colors must read clearly at small sizes for mobile screens

### Reference Points
- *Hades* — mythological boldness, readable silhouettes
- *Elden Ring* — dark fantasy atmosphere, divine scale
- *Diablo Immortal* — premium mobile stylized, faction color clarity
- *God of War (2018)* — material authority, divine presence

### What It Is NOT
- NOT photorealistic (too expensive across 28 deities × 3D × maps, ages poorly)
- NOT cartoonish (wrong tone for dark mythological tactical RPG)
- NOT anime (wrong market positioning)
- NOT painterly/illustrative (hard to match in 3D)
- NOT PBR-photoreal in 3D (hand-painted stylized textures instead)

---

## 2. The Three-Asset Pipeline

All three asset types must share the SAME visual language:

### A. Concept Art (2D)
- AI-generated or hand-painted stylized dark fantasy renders
- Full-body composition — head to feet, no cropping
- Deity is the focal point, background is atmospheric support
- Established by the v11.1 renders (Aten Ra v5 is the baseline)

### B. 3D Models
- Hand-painted stylized textures (NOT PBR photoreal)
- Match concept art silhouettes exactly — same proportions, same armor shapes
- Faction colors baked into textures, not dependent on lighting
- Realm-substance skin materials use stylized shaders (emissive for radiance/light/fire, etc.)
- Glowing eyes = emissive material on eyes, always on
- Ground effects = particle systems using faction color palette
- Poly count: mid-range, optimized for mobile
- Each deity must be identifiable from silhouette alone in 3D

### C. Maps & Environments
- Stylized environments matching the faction's realm aesthetic
- Same color palette as the faction — the realm IS the faction's colors
- Atmospheric lighting (dark, moody, with divine light sources)
- Hand-painted style textures, not photoreal terrain
- Scale: deities tower over environment elements (gates reach shoulders)
- Each realm has unique architectural language:
  - Aten Ra: Egyptian pylon gates, Ma'at geometry, solar radiance
  - Asgardian: Norse shield-walls, storm-iron monuments, thunder clouds
  - Olympian: Greek marble columns, olive groves, bronze statues
  - Kami: Japanese shrine torii, lacquered gates, spirit mist
  - Tuatha: Irish standing stones, misty hills, Otherworld fog
  - Empyrean: Celestial cathedral, stained-glass light, divine radiance
  - Infernal: Volcanic deep earth, obsidian architecture, hellfire glow

---

## 3. Faction Color Palettes (Strict — No Overlap)

| Faction | Primary | Secondary | Accent | Clothing Base |
|---------|---------|-----------|--------|---------------|
| Aten Ra | Electrum-gold | Lapis-blue | Turquoise faience | White linen |
| Asgardian | Storm grey-black | Blue-white lightning | Oath-red + ember orange | Wolf-fur brown |
| Olympian | White marble | Bronze-gold | Sky-blue | White cloth |
| Kami | Lacquer black | Torii-red | Foxfire blue-green + silver | White kimono |
| Tuatha | Moon-oak silver-green | Silver | Sidhe green | Earth-tone linen |
| Empyrean | Seraph-gold | Many-eye-blue | Choir-white | White raiment |
| Infernal | Hellfire black | Blood-wax red | Brass-gold | Ash-grey cloth |

### Color Placement Rules
1. **Skin** = the deity's realm-substance (predominantly the primary color)
2. **Armor** = primary + secondary + accent (where most color variety lives)
3. **Clothing** = the clothing base color (white linen, fur, cloth — provides contrast)
4. **Weapons** = primary metal + secondary/accent inlays
5. **Ground effects** = primary + accent (glowing)
6. **Background** = primary atmosphere + secondary architecture

---

## 4. Realm-Substance Skin Standard

Each deity's body IS their realm's divine substance — NOT human flesh, NOT biological skin.

| Faction | Body Substance | Description |
|---------|---------------|-------------|
| Aten Ra | Living solar radiance | Golden divine light, the sun's fire given form |
| Asgardian | Living storm-matter | Condensed thunder, wind, and void — turbulent, shifting |
| Olympian | Living marble | White-veined Parian marble, warm, alive — the one physical material |
| Kami | Living spirit-threshold | Between material and spirit — shimmers, semi-transparent |
| Tuatha | Living Otherworld-mist | Sacred sídhe fog, moon-pale, translucent, mist-given-form |
| Empyrean | Living divine light | Pure holy radiance, semi-transparent, light IS the body |
| Infernal | Living hellfire and shadow | Fire and darkness coexisting — burning and dark simultaneously |

### Skin Rules
- NO human skin texture (no pores, no biological imperfections)
- NO human skin colors (no pink, no tan, no flesh tones)
- All markings on skin GLOW with the deity's energy
- Vein lines are MINIMAL and subtle — not busy, not cluttered
- The body material should be immediately identifiable as non-human

---

## 5. Glowing Eyes Standard

All 28 deities have glowing energy eyes — NO human eyes, NO normal pupils.

| Faction | Eye Glow Color |
|---------|----------------|
| Aten Ra | Electrum-gold with lapis-blue inner ring (solar disc eyes) |
| Asgardian | Blue-white lightning (storm eyes) |
| Olympian | Bronze-gold with sky-blue inner ring (civic glory eyes) |
| Kami | Foxfire blue-green with torii-red inner ring (spirit threshold eyes) |
| Tuatha | Silver-green sidhe light (fae memory eyes) |
| Empyrean | Seraph-gold with many-eye-blue (choir order eyes) |
| Infernal | Hellfire red-orange with brass-gold inner ring (contract power eyes) |

### Eye Rules
- Eyes must GLOW visibly — bright enough to be clearly seen in the render
- No normal human pupils or irises
- Each deity has unique eye character within their faction's color (see prompt files)
- Eyes emit actual visible light matching the faction's energy

---

## 6. Ground Effects Standard

Ground effects are color-matched to each deity's faction palette and lore.

### Rules
- Ground effects GLOW — nothing is static or dark
- Effects radiate from beneath the deity's feet outward
- Must match the faction's primary + accent colors
- Must reflect the deity's specific lore (Ma'at scales for Aten Ra, lightning for Asgardian, etc.)
- Clean and elegant — not cluttered or busy
- Effects should feel like extensions of the deity's divine power

---

## 7. Composition Standard

### Full-Body Requirement
- All deity concept art must show the FULL BODY — head to feet
- No cropping at waist, knees, or chest
- The deity must be the focal point, centered or dynamically posed
- Background is atmospheric support, never competing for attention

### Scale Communication
- Environment elements (gates, monuments, architecture) reach only to the deity's shoulders
- This communicates divine scale — the deity towers over their realm
- Background architecture should feel massive but still smaller than the deity

### Silhouette
- Each deity must have a unique silhouette identifiable to their faction
- No cross-faction silhouette bleeding
- Weapons and armor contribute to the silhouette, not just the body

---

## 8. Anti-Text Standard

**ZERO text of any kind in any visual asset.**

- No letters, words, numbers
- No hieroglyphs, runes as writing, glyphs, or fake alphabets
- No labels, captions, watermarks, or logos
- No carved inscriptions or engraved text
- No decorative lettering or sigil-like markings
- Decoration uses ONLY abstract geometric patterns
- This applies to concept art, 3D model textures, AND map/environment textures

---

## 9. Weapon & Armor Standards

### Weapons
- Each deity has a UNIQUE weapon based on deep mythological research
- No shared weapons across deities or factions
- Weapons carry faction colors (primary metal + secondary/accent inlays)
- Weapons should look like divine artifacts, not generic fantasy gear

### Armor
- Each deity has UNIQUE armor based on their mythological identity
- No cross-faction armor sharing
- Armor is where most faction color variety lives (primary + secondary + accent)
- Armor is fused to the divine body — grown into it, not worn over flesh
- No text or inscriptions on armor — abstract patterns only

### Clothing
- Clothing provides the contrast color (white linen, fur, cloth)
- Clothing breaks up the metallic/material gold or dominant colors
- Clothing should match the mythological culture (Egyptian linen, Norse fur, Greek cloth, etc.)

---

## 10. Divine Status Background

Each deity's background communicates their divine status:

- **Scale**: Architecture reaches only to shoulders — deity is massive
- **Realm**: Background shows the deity's realm architecture and atmosphere
- **Mood**: Dark fantasy atmosphere with divine radiance from the deity
- **Simplicity**: Background is support, not competing — minimal, atmospheric
- **Faction colors**: Background uses the faction palette

---

## 11. Faction Aesthetic Separation

**STRICT RULE: No cross-pollination of faction aesthetics.**

- Aten Ra deities do NOT have storm-iron, marble, or lacquer elements
- Asgardian deities do NOT have gold faience, marble, or spirit-threshold elements
- Each faction's materials, architecture, weapons, and visual language are UNIQUE
- Silhouettes must be faction-distinct
- A player should identify a deity's faction from silhouette + color alone

---

## 12. Approved Baseline

- **Aten Ra v5** is the locked baseline for the Aten Ra faction
- Style: premium stylized dark fantasy
- Full-body, gold solar radiance skin, white linen clothing, gold/blue/turquoise armor
- Glowing gold+lapis eyes, Ma'at ground effects, pylon gate background
- All subsequent deities must match this quality level and style approach

---

## 13. 3D Model Translation Guide

For 3D artists converting concept art to models:

1. **Match silhouette exactly** — same proportions, same armor shapes, same weapon design
2. **Hand-painted textures** — stylized, NOT PBR photoreal
3. **Emissive materials** for: eyes (always on), skin glow markings, ground effects, vein energy
4. **Faction colors baked into textures** — not dependent on post-processing
5. **Cloth simulation** for flowing garments (linen, mantles, capes)
6. **Optimized for mobile** — mid-range poly count, baked lighting where possible
7. **Material shaders**: 
   - Solar radiance = emissive gold shader with subtle pulse
   - Storm-matter = dark turbulent shader with lightning emissive
   - Marble = subsurface scattering with warm tint
   - Spirit-threshold = transparency/dithering shader
   - Otherworld-mist = volumetric fog shader on body edges
   - Divine light = strong emissive with transparency
   - Hellfire/shadow = dark base with emissive cracks

---

## 14. Map/Environment Translation Guide

For level designers and environment artists:

1. **Each realm uses the faction palette** — the realm IS the faction's colors
2. **Stylized hand-painted textures** — match concept art material approach
3. **Architecture matches realm** — pylon gates (Aten Ra), shield-walls (Asgardian), marble columns (Olympian), torii gates (Kami), standing stones (Tuatha), cathedrals (Empyrean), volcanic structures (Infernal)
4. **Atmospheric lighting** — dark, moody, with divine light sources matching faction energy
5. **Scale reference**: environment elements should be large but deities tower over them
6. **No text** — abstract geometric patterns for all decorative elements
7. **Mobile-optimized** — baked lighting, stylized textures, efficient geometry

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-08-18 | Initial Art Style Bible. Locked stylized dark fantasy direction, faction palettes, realm-substance skin, glowing eyes, ground effects, full-body composition, anti-text, 3D and map translation guides. Aten Ra v5 as baseline. |
