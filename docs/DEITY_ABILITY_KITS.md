# Deity Ability Kits — Mythos Gates: Ascension

**Version:** 4.1.0  
**Locked:** Aug 31, 2026  
**Format:** 1 Basic Attack + 2 Abilities + 1 Ultimate (4 total per deity)  
**Control:** Tap-to-move + auto basic attacks + 3 ability buttons + 1 dodge button  

---

## Scaling Framework

All abilities scale from Level 1 to Level 10. Each level increases:

| Stat | Scaling Per Level |
|------|-------------------|
| Basic Attack Damage | +8% base damage |
| Ability Damage | +12% base damage |
| Ultimate Damage | +15% base damage |
| Ability Cooldown | -3% (faster at higher levels) |
| HP / Armor | +6% base |
| Ultimate Cooldown | -2% |

### Role Baselines (Level 5 benchmark)

| Role | HP | Armor | ATK Speed | Range | Role Identity |
|------|-----|-------|-----------|-------|---------------|
| Warrior | High (120%) | High (120%) | Medium | Melee (short) | Sustained frontline, zone control |
| Caster | Medium (90%) | Low (70%) | Medium | Ranged (long) | AoE damage, crowd control, buffs |
| Archer | Low-Med (85%) | Low (75%) | Fast | Ranged (longest) | Sustained DPS, kiting, marks |
| Assassin | Low (80%) | Low (70%) | Fast | Melee (short) | Burst damage, mobility, executes |

### Balance Rules
- Every Ultimate has comparable impact: either (AoE + 2x multiplier) or (Single-target + 3x multiplier) or (Utility + team-wide buff)
- No deity has more than 2 hard CC abilities (stun/root/freeze)
- Every role has roughly equal total damage output over a 20-second fight
- Healing deities trade personal damage for team sustain
- Assassins have highest burst but lowest sustained DPS
- Archers have highest sustained DPS but lowest burst

---

## Aten Ra (Solar / Judgment / Solar Fire)

| Deity | Role | Basic Attack | Ability 1 (CD: 8s) | Ability 2 (CD: 12s) | Ultimate (CD: 60s) |
|-------|------|-------------|---------------------|----------------------|---------------------|
| Aten Ra | Warrior | Solar Edge — 3-hit khopesh combo, frontal cone, light stacks (+8%/lvl) | Sun-Scale Decree — judgment zone, armor +30% + slow 40%, 4s | Ma'at Verdict — shield bash knocks back, barrier absorbs 1 incoming hit, 5s | Source Radiance — blinding solar AoE, 2x damage to all enemies in zone |
| Sutekh | Caster | Desert Storm — storm-scepter strikes, storm-sand stacks (+8%/lvl) | Desert Storm Form — living sandstorm, immune to CC, +25% damage 5s | Red Land's Wrath — sand vortex pulls enemies to center, DoT 3s | Red Lord Ascension — body becomes storm, push + blind all, 2x damage 4s |
| Iset | Archer | Throne Pulse — light-bow arrows, restoration energy (+8%/lvl) | Throne Sovereignty — buff zone, heal 15% + damage boost 20%, 6s | Nile Ward — healing arrow creates pool, cleanses debuffs, heals 10%/s, 4s | Isis Ascension — throne beams heal allies 25% + damage all enemies 2x |
| Amunet | Assassin | Hidden Strike — obsidian knife strikes, void-marks (+8%/lvl) | Veil of the Hidden One — invisibility 3s, void damage on reveal | Secret Name — mark target, next attack teleports behind for 2x damage | Amunet Ascension — untargetable 4s, teleport to all marks, 3x damage each |

## Asgardian (Storm / Honor / Runic Storm)

| Deity | Role | Basic Attack | Ability 1 (CD: 8s) | Ability 2 (CD: 12s) | Ultimate (CD: 60s) |
|-------|------|-------------|---------------------|----------------------|---------------------|
| Thor | Warrior | Mjolnir Strike — hammer throws, lightning on 3rd hit (+8%/lvl) | Storm Hammer — charged throw creates storm field, DoT 4s | Thunder Step — slam shockwave, stun 1.5s, +30% armor 4s | Thor Ascension — colossal Mjolnir, screen-wide lightning, 2x damage all |
| Odin | Caster | Rune Edge — rune-spear cleaves, rune-marks (+8%/lvl) | Storm Sovereignty — storm circle, super armor + lightning strikes, 5s | Raven's Sight — raven scouts large area, reveals + marks enemies 6s | Odin Ascension — time slow 50% for 3s, all rune-marks detonate for 2x |
| Skadi | Archer | Frost Bow — frost arrows, freeze at 3 stacks (+8%/lvl) | Huntress Domain — frozen ground, +50% range 5s | Winter's Trap — piercing arrow leaves ice trail, slows 50% crossing | Skadi Ascension — 5-split arrows, all ground ice, 2x damage all |
| Freyja | Assassin | Fate Reaver — falcon-feather blade, harvest fate (+8%/lvl) | Battle-Fate Storm — 2x attack speed 4s, fate shockwaves | Seiðr Chains — bind enemy, root 2s, drain 8% HP to self | Chooser Ascension — mark enemies below 50% HP, instant execute |

## Olympian (Divine / Command / Divine Storm)

| Deity | Role | Basic Attack | Ability 1 (CD: 8s) | Ability 2 (CD: 12s) | Ultimate (CD: 60s) |
|-------|------|-------------|---------------------|----------------------|---------------------|
| Athena | Warrior | Spear of Wisdom — spear thrusts, shield stacks (+8%/lvl) | Aegis Bastion — invulnerable 2s, reflect 50% damage | Phalanx Formation — shield wall blocks projectiles 4s, protects allies | Athena Ascension — foresight reveals all attacks 5s, +50% damage to marked |
| Zeus | Caster | Thunder Fist — thunder-scepter strikes (+8%/lvl) | Olympus Decree — storm throne, lightning aura DoT 5s | Chain Lightning — bolt arcs to 5 enemies, -20% per jump | Zeus Ascension — chain lightning all enemies, 2x damage, stun 1s |
| Artemis | Archer | Moonshot — silver arrows, hunt-mark stacks (+8%/lvl) | Huntress Moon — tracking arrow, +50% damage to marked | Forest Ambush — stealth volley, first hit 2x + root 1.5s | Artemis Ascension — rain of arrows all enemies, 2x damage, 3s |
| Ares | Assassin | Wrath Blades — dual wrath-blades, rage stacks (+8%/lvl) | War Frenzy — unkillable 3s, lifesteal 20%, +50% damage | Spear Wall — hurl war-kopis barrier, blocks movement 3s | Ares Ascension — berserker mode 5s, all enemies take 2x damage |

## Kami (Spiritual / Balance / Spirit Storm)

| Deity | Role | Basic Attack | Ability 1 (CD: 8s) | Ability 2 (CD: 12s) | Ultimate (CD: 60s) |
|-------|------|-------------|---------------------|----------------------|---------------------|
| Amaterasu | Warrior | Sun Spear — radiance blade thrusts, light stacks (+8%/lvl) | Sacred Light Field — blinding zone, allies +20% damage 5s | Mirror Flash — reflect light, blind cone 2s, reveal stealthed | Amaterasu Ascension — eternal sun, blind all 3s, 2x damage |
| Tsukuyomi | Caster | Moon Edge — crescent naginata strikes, phase marks (+8%/lvl) | Crescent Domain — night zone, silence 3s + phase damage | Tide of Tsukuyomi — lunar wave pushes back, marks for 2x damage 4s | Tsukuyomi Ascension — eclipse, freeze all in shadow 2.5s, 2x damage |
| Susanoo | Archer | Storm Blade — tempest greatbow wind-slashes (+8%/lvl) | Hurricane Slash — wind zone, push enemies + DoT 3s | Serpent Slayer — armor-piercing arrow, 2x vs high-defense targets | Susanoo Ascension — living hurricane, scatter all, 2x damage 4s |
| Izanami | Assassin | Death Touch — shrine fan strikes, death-mark stacks (+8%/lvl) | Underworld Gate — death zone, execute below 20% HP | Yomi's Grasp — spectral hands root 2s, drain 10% HP | Izanami Ascension — all marked enemies executed, 3x if below 30% |

## Tuatha (Nature / Wild / Wild Growth)

| Deity | Role | Basic Attack | Ability 1 (CD: 8s) | Ability 2 (CD: 12s) | Ultimate (CD: 60s) |
|-------|------|-------------|---------------------|----------------------|---------------------|
| Dagda | Warrior | Club of Life — oak club strikes, ground cracks (+8%/lvl) | Harp of Seasons — zone cycles: buff allies / debuff enemies, 6s | Cauldron's Bounty — shield slam, healing zone 8%/s, damages enemies 4s | Dagda Ascension — earth-shaker, knockdown all 2s, 2x damage |
| Brigid | Caster | Flame Touch — sacred flame-staff, burn stacks (+8%/lvl) | Sacred Flame — healing fire zone, allies heal 10%/s 5s | Forge's Blessing — ally weapon +burn damage 25%, 8s | Brigid Ascension — eternal flame, all enemies burn 5s, allies +50% HP |
| Morrígan | Archer | Phantom Bow — crow-feather arrows, death-mark (+8%/lvl) | Battle Crow Form — fly over battlefield 4s, dive attacks 2x | Phantom Strike — spectral arrow pierces all, marks for 2x next hit | Morrígan Ascension — queen of phantoms, fear all 2s, 2x damage 4s |
| Lugh | Assassin | Spear of Light — fast light-spear thrusts, light stacks (+8%/lvl) | Long Arm — extended reach zone, hit all in line 3s | Sling of Dawn — radiant projectile, blind 2s + 2x damage | Lugh Ascension — master of arts, all abilities empowered 2x for 5s |

## Empyrean (Holy / Order / Holy Light)

| Deity | Role | Basic Attack | Ability 1 (CD: 8s) | Ability 2 (CD: 12s) | Ultimate (CD: 60s) |
|-------|------|-------------|---------------------|----------------------|---------------------|
| Michael | Warrior | Holy Blade — flaming sword strikes, sanctify stacks (+8%/lvl) | Divine Verdict — judgment zone, bind enemies 2s | Wings of Justice — leap to target, stun 1.5s, holy circle DoT 3s | Michael Ascension — archangel form 5s, 2x damage, +50% armor |
| Gabriel | Caster | Trumpet Strike — trumpet-spear sound waves, resonance stacks (+8%/lvl) | Divine Message — silence zone, block abilities 4s | Herald's Decree — slow target 60% 2s, +50% holy damage taken | Gabriel Ascension — final trumpet, stun all 1.5s, 2x damage |
| Raphael | Archer | Seraph Arrows — seraph light-bow holy arrows, sanctify stacks (+8%/lvl) | Sanctuary Volley — arrow rain zone, disable enemies 3s | Healing Shot — heal ally 20% + cleanse, or 2x damage to enemy | Raphael Ascension — healing arrows 5s, 50% damage converts to team heal |
| Jophiel | Assassin | Blade of Light — twin radiance-blades, radiance-marks (+8%/lvl) | Beauty Takedown — 2x attack speed 3s, detonate marks | Radiance Flash — blind nearby 2s, backstabs deal 3x for 3s | Jophiel Ascension — teleport strikes 5s, 2x damage, hit all isolated enemies |

## Infernal Dominion (Shadow / Chains / Infernal Fury)

| Deity | Role | Basic Attack | Ability 1 (CD: 8s) | Ability 2 (CD: 12s) | Ultimate (CD: 60s) |
|-------|------|-------------|---------------------|----------------------|---------------------|
| Asmodeus | Warrior | Hellfire Club — execution glaive strikes, burn stacks (+8%/lvl) | Infernal Throne — lava zone, +40% armor 5s | Chain Lord — pull enemy to you, stun 1.5s | Asmodeus Ascension — demon lord 5s, all burn, immune to damage 2s |
| Lucifer | Caster | Fallen Light — morningstar scepter beams, fall-marks (+8%/lvl) | Morning Star — meteor zone, trap enemies 3s | Pact of Flame — sacrifice 10% HP, 2x damage to all in line | Lucifer Ascension — light-bearer 5s, all enemies burn 2x, fallen light AoE |
| Lilith | Archer | Shadow Bow — shadow-moon greatbow night arrows, seduction-marks (+8%/lvl) | Garden of Night — shadow zone, charm enemies 3s | Moon-Thorn Trap — thorned trap roots 2s, drains will | Lilith Ascension — mother of night, all enemies fight each other 3s |
| Naamah | Assassin | Velvet Blades — harp-blade strikes, pleasure-marks (+8%/lvl) | Whispering Death — stealth 3s, execute below 30% HP | Song of Seduction — charm enemy, walk toward you 2s | Naamah Ascension — shadow temptress 4s, untargetable, 2x vs charmed |

---

## Balance Summary

**All ultimates normalized to equivalent power tiers:**
- AoE damage ults: 2x multiplier to all enemies (Thor, Zeus, Amaterasu, Susanoo, Dagda, Gabriel, Lucifer, Morrígan, Aten Ra, Sutekh, Odin)
- Single-target/burst ults: 3x multiplier or execute mechanic (Amunet, Skadi, Ares, Izanami, Lugh, Jophiel)
- Utility/healing ults: team-wide effect + secondary damage (Iset, Brigid, Raphael, Athena, Freyja, Lilith, Naamah, Asmodeus, Michael)

**CC limits per deity:** Max 2 hard CC (stun/root/freeze/charm) across all abilities  
**Healing:** 5 deities have healing (Iset, Brigid, Raphael, Dagda, Freyja) — balanced by lower personal damage  
**Mobility:** 4 deities have mobility (Amunet teleport, Morrígan fly, Michael leap, Jophiel teleport) — balanced by lower armor  
**Scaling:** All abilities +8%/level (basic), +12%/level (abilities), +15%/level (ultimate) — cooldowns reduce 3%/level  

**Source:** `combat_kits_v4.py` — Full implementation details  
**Format:** 1 Basic (auto) + 2 Abilities (8s/12s cooldowns) + 1 Ultimate (60s cooldown)  
**Controls:** Tap-to-move, auto basic attacks, 3 ability buttons + 1 dodge — no joystick
