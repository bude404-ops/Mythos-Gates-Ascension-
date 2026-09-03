# ABILITY FEASIBILITY AUDIT — all 32 kits vs. the locked toolchain (BudE404 directive, Sept 2 2026)
Toolchain constraints: Godot 4 mobile • tap-to-move + auto-attack (no joystick) • Meshy mesh → Mixamo rig + free Mixamo animation library (Blender retarget, 24-bone skeleton) • solo-first (self-only heals/buffs) • server-authoritative saves • cosmetics-only F2P • must run on mid-range phones.

## VERDICT SUMMARY
28 of 32 kits are buildable with stock Godot nodes + existing Mixamo animation set. 4 items are flagged YELLOW — none need cutting; all have simplifications that preserve the fantasy. Details below.

## PER-FACTION FEASIBILITY (verdicts per kit)
- F001 MERIDIAN COURT: dashes, AOEs, marks, mirage clones — GREEN. Mirage = duplicated mesh with flicker shader, standard.
- F002 STORMMOOT: lightning strikes, taunt-pull, buff-strip ("erasing enemy abilities" = debuff flag) — GREEN. Buff-strip is one function call on the unified buff system.
- F003 LAUREL AGON: auto-targeting weak points (lock-on + hitbox priority), escalating marks, "everyone else deals less" (solo: flat enemy damage-down debuff) — GREEN.
- F004 THOUSAND TORII: self-shields, half-out-of-body pull (custom status: disable + float anim — Mixamo has it) — GREEN.
- F005 SILVERROOT KINDRED: Tolveth terrain regrowth — see FLAG 1. Arrow-type swapping (one projectile class + element enum), buff-inversion wave (unified buff system, inverted) — GREEN.
- F006 RADIANT VIGIL: undying + taunt (invuln flag + AI target override), refraction-around-cover shots (bezier projectile curve), light-node teleport swaps, simultaneous multi-node strikes (delayed replicated hit events) — GREEN. Sothiel's "mirror enemy's last ability" — see FLAG 2. The Dimmed "only move when illuminated" — see FLAG 3.
- F007 BLACK-IRON DOMINION: chain-pull (physics constraint + root motion), growing DoT (stacking tick), lifesteal accumulation + detonation (counter variable), debt-cleanse + i-frame blink — GREEN. Mid-fight Hollow bargains — see FLAG 4.
- F008 DEEPGREEN: see FLAG 1 (same terrain-wall tech as Tolveth, shared system). Returning arrows (projectile reverses velocity), decoy mirage (same tech as F001 Shemris), stealth window (AI perception toggle) — GREEN.

## FLAGS & FIXES (preserving the fantasy, simplifying the tech)
1. **TERRAIN WALLS (Tolveth root-ridges, Mawkreth stone walls + lava vents)** — real-time terrain deformation is too heavy for mid-range mobile. FIX: grid-snapped prefab barrier meshes spawned from a small pool (root-wall, stone-wall, lava-vent), navmesh rebake on placement. Same gameplay, phone-friendly. "Pattern you choose" for Mawkreth's ult simplifies to 3 preset patterns (cone / ring / line) — tap to pick.
2. **SOTHIEL'S REFRACTION (mirror enemy's last ability)** — requires every enemy ability in a data-driven registry. FIX: this is already what the unified MG- data layer build provides; Sothiel ships in Phase 2 of her kit (Phase 1: her own two actives work day one; Refraction reads the registry when the data layer is populated). No redesign needed — sequencing only.
3. **THE DIMMED light-activation (F006)** — sampling real-time light levels per enemy is expensive on mobile. FIX: a "player glow radius" variable + burning-terrain flags — the Dimmed wake when inside glow radius or flagged light zones. Same horror loop, one variable instead of per-frame light probes.
4. **HOLLOW BARGAINS (F007 mid-fight deals)** — a real-time modal in combat. FIX: 2-second slow-motion prompt with two tap buttons (TAKE / REFUSE), server-authoritative debt ledger entry. Uses the same save pipeline as the Debt Ledger dungeon; no new systems.

## ANIMATION BUDGET CHECK (Mixamo free library covers all 32)
Every kit's verbs map to existing Mixamo animations: idle/run/attack/cast/taunt/leap/fall/glide/hit/death are all in the free library. Thuveka's glide-strike = jump + fall anims with root motion; Kraxus's chain-pull = reach + pull anim. No custom mocap needed for any of the 32. Weapon prop swapping stays per the locked Meshy→Mixamo→Godot pipeline.

## CONTROL SCHEME CHECK (tap-to-move + auto-attack)
Every ability is a single tap-button action: no aimed joysticks, no skillshots requiring dual-thumb precision. Ranges/patterns are lock-on or preset-shape. All 32 kits are one-thumb playable, per directive.

## SOLO-FIRST COMPLIANCE RECHECK
All 32 kits re-verified: every heal and buff is self-targeted. The only ally-referencing text left anywhere is Hollow/enemy flavor (severing bonds etc.), which is enemy-facing and unaffected per the rule.

## RECOMMENDATION
No kit changes. Build order recommendation: shared systems first (unified buff/status registry → glow-radius & light flags → prefab barrier pool → bargain prompt UI), then faction kits in dungeon order (F001→F008). The MG- data layer build already planned for next stage covers FLAG 2's dependency.
