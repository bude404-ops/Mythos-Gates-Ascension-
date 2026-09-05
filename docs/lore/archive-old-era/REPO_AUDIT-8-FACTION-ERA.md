# MYTHOS GATES: ASCENSION — Stage 1 Repository Audit
Date: 2026-09-02 | Status: COMPLETE | Auditor: BIGagent404 | Directive: Master Development & World-Building Directive (30 sections)

## A. Engine & Pipeline
**CONFLICT — TECH_STACK_DECISION.md is obsolete.** Aug 20 doc selects UE5 + TRELLIS.2. New authoritative directive: **Godot**, pipeline **Meshy → Blender → Godot**. `mythos-gates-godot/` is the production repo. Action: rewrite tech stack doc.
**Clean:** No "Star Gate"/"Stargate" terminology found.

## B. Faction & Deity Canon — 7 Existing Factions
Source: `faction_dialogue_data.json` (7 x 4 = 28 deities) + 28 MG-CLEAN refs + deity-refs art.

| ID | Faction | Deities | NPC | Gate |
|----|----------|---------|-----|------|
| TG-001 | Aten (Egyptian) | Aten Ra, Sutekh, Iset, Amunet | Mesha Gate-Scribe | Sun-Scale Gate |
| TG-002 | Asgardian (Norse) | Odin, Thor, Freyja, Frigg | Hrodda Oath-Witness | Thunder-Oath Gate |
| TG-003 | Olympian (Greek) | Zeus, Ares, Artemis, Athena | Lyrion Laurel-Envoy | Laurel-Sky Gate |
| TG-004 | Kami (Japanese) | Amaterasu, Tsukuyomi, Susanoo, Izanami | Sayo Shrine-Cartographer | Torii-Moon Gate |
| TG-005 | Tuatha (Celtic) | Dagda, Lugh, Morrigan, Brigid | Maeve Root-Memory | Silver-Root Gate |
| TG-006 | Empyrean | Michael, Gabriel, Sophia, Shekinah | Celiane White-Vault Witness | Choir-Vault Gate |
| TG-007 | Infernal | Lucifer, Asmodeus, Lilith, Naamah | Varak Chain-Magistrate | Black-Iron Gate |

**CONFLICT — Section 2 (original mythology):** All 28 deity names + faction identities are real-world figures. Per directive: all names, histories, relationships rebuilt as original canon. Per Section 3: visual/avatar designs, faction aesthetics, NPC/gate/dialogue STRUCTURE, and 3D assets carry forward as visual foundation.
**Naming:** `TG-` prefix migrates to `MG-` IDs.

## C. Combat & Controls
**CONFLICT — Section 16:** `touch_controls.gd` = virtual joystick + manual Attack/Spellcast buttons. Authoritative spec: tap-to-move, auto-attack (detect→target→auto attack), 2 abilities + Ultimate HUD. Action: full input-layer rebuild. WASD branch retained for desktop testing.

## D. Preserved (works + matches new canon)
- `dungeon_generator.gd` — modular gen (extends to Section 18)
- `character_controller.gd`, camera systems — solid
- `weapon_attachment.gd` — bone-socket weapons (extends to Section 13)
- `cel_shading.gdshader` + `cel_environment.gdshader` — matches cel-shaded visual spec
- Web build system — mobile-first deployment path
- Faction dialogue structure (intros/chapters/NPCs/gates) — content re-skinned, structure kept
- Aten Ra 3D model + staff PBR textures — first deity asset, re-identified under new canon

## E. Missing Systems (to be BUILT — Section 28)
1. Faction/deity data layer (8 factions x 4 deities, abilities, passives, ultimates, faith)
2. Faith system (Section 15, not a mana bar)
3. Hollow enemy system: 14-tier hierarchy, realm variants, AI (Section 4)
4. Auto-target/auto-attack combat core (Section 16)
5. God + Weapon progression, branching skill trees (Section 17)
6. Dungeon difficulty tiers Normal→Divine (Section 18)
7. Destructible world + mobile perf budgets (Section 19)
8. Codex with progressive unlocks + CONFIRMED/RUMOR/UNKNOWN/FALSE BELIEF/SECRET tags (Sections 25-26)
9. Central War hub, evolving early/mid/late state (Section 5)
10. Master Lore Bible (Section 26) — Stage 2
11. Foreshadowing database (Section 10)
12. 8th faction — PNW-inspired, fully original (Section 3)
13. Server-authoritative saves, multiplayer-ready (Section 23)

## F. Verdict
Early-stage repo with sound foundation. Two systemic conflicts (engine doc, real-world pantheon), one combat conflict (joystick) — all rebuildable. No duplicate/obsolete systems active. Stage 1 COMPLETE → Stage 2: Master Lore Bible + canon reconstruction.
