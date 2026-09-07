# PILGRIM COMBAT SYSTEM v1 — The Avalon Fusion
BudE404 directive (Sept 6 2026): mix Diablo Immortal + Genshin into our own style, wrapped in Avalon lore, then fix combat + stats to match.

## The Three Layers

### Layer 1 — DIABLO IMMORTAL (the action foundation)
- **Auto-face lock-on**: every attack auto-faces the nearest Hollow — no thumb gymnastics, joystick only for movement/exploration
- **Skill bar**: 3 ability slots + ultimate on cooldowns (cooldown speed scales with TEMPO)
- **Wave structure**: Thrall waves → elite (Warden Hollow) → boss (risen Echo/god-scale per Emergence Law)
- **Loot-lite**: tribute relics from the Depths (relic-gift altar already canon in Depths prototype)

### Layer 2 — GENSHIN (the reaction layer)
- **Elemental identity**: the pilgrim channels ONE element through the Mark (ember/storm/bloom/dusk/tide/stone) — re-attuned at camp/shrine (solo-first answer to Genshin's team swap). THE LANTERN IS THE LUMINARIES (BudE404, Sept 6): the lantern is a living being, never a tool or oil-swapped prop — the Luminary's flame mirrors whatever element the Mark carries, because the flame is kin to that element
- **ELEMENTAL REACTIONS**: status-on-status = burst effects:
  - ember + tide = STEAMVEIL (blind + area denial)
  - storm + stone = SHATTER (guard break)
  - bloom + dusk = SPOREBLOOM (chain damage)
  - ember + storm = ASHSTORM (damage-over-time whirl)
  - tide + stone = LODESTONE (pull/anchor)
  - bloom + tide = ROOTMERE (root + heal)
- Reactions do the big damage — re-attuning the Mark answers enemy resistances
- **Stamina dodge** with i-frames (separate from abilities)

### Layer 3 — AVALON (the lore wrapper — ours alone)
- **FAITH economy** (canon): abilities cost FAITH; the WARD converts caught damage INTO FAITH — the more you're sieged, the more you can answer. No other ARPG does ward-to-faith.
- **FAITH DROPS** (BudE404, Sept 6 — the loot feel): defeated Hollow RELEASE their faith as golden motes that visibly float and stream INTO THE LUMINARY, as if the living lantern collects them — the Diablo-gold-drop satisfaction, but the "gold" is belief and the "purse" is your companion. The Luminary gathers; the FAITH lands when the motes arrive (bar ticks per mote, soft chime), not on the kill frame. Lore-perfect: the flame feeds on deeds.
- **Debt economy** (canon from combat runtime): Hollow ACCRUE DEBT when struck; at threshold a Hollow REVENANTS (enrages) — kill fast or get swarmed by rage.
- **Void tether**: Hollow are void-element, reaction-IMMUNE until their tether is SEVERED. CANON ROLES (per the ONE COMPANION TWO LIGHTS ruling): the LUMINARY REVEALS the tether — its glow is discovery/navigation light, NEVER combat power — and the PILGRIM severs what it reveals (strike the shown tether-point). The lantern's combat-adjacent role stays PROTECTIVE only: while the Luminary shines, void-chill does not drain VIGOR. The lantern never attacks.
- **Emergence Law**: god-scale = stationary siege combat (unchanged canon).

## The Stat Block

### Pilgrim
| Stat | Meaning |
|---|---|
| VIGOR | health |
| FAITH | ability resource (regen: ward catches, lantern-rite beats) |
| MIGHT | melee/combo/finisher damage |
| WIT | ability + reaction damage |
| GUARD | damage mitigation (Cinder Roads plate) |
| TEMPO | cooldown speed + dodge cost |

### Hollow
| Type | Role | Notes |
|---|---|---|
| Thrall | swarm melee | low vigor, lunge telegraph |
| Chorister | caster | applies VOID-TETHER (reaction immunity aura) |
| Warden Hollow | elite blocker | parry-break or bash to open |
| Revenant | any type enraged | debt threshold crossed: +speed +damage |

### Slice baseline numbers (Warden-M vs Hollow Thrall)
- VIGOR 100 · FAITH 35 start · strike 22 · heavy 46 (cd 2.4s) · parry window 1.1s (+12 FAITH on catch) · bash 16 + knockback (cd 4s)
- Thrall: VIGOR 34 · lunge 9 · approach 2.4→3.0
- WARD: absorbs any caught lunge → +8 FAITH (already live in slice)

## Implementation order
1. Auto-face lock-on + cooldown HUD (slice patch 2 — replaces free-joystick combat)
2. TEMPO/GUARD stat wiring + elite Warden Hollow with guard-break
3. Void-tether severing (lantern toggle mid-fight)
4. Mark re-attunement (camp/shrine) + first 2 reactions (ember+storm, ember+tide); Luminary flame mirrors the Mark; Luminary tether-REVEAL + pilgrim-sever loop
