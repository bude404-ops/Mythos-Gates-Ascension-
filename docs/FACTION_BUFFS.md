# Faction Buffs — Mythos Gates: Ascension

**Version:** 1.0.0  
**Locked:** Aug 31, 2026  
**Design:** Solo play — each faction has a unique resource, passive, and build mechanic  

---

## How Faction Buffs Work

Every deity belongs to a faction. Each faction has a **unique resource** that builds during combat and unlocks passive bonuses at 3 and 5 stacks.

- **Max stacks:** 5
- **Stack generation:** Role-dependent (see below)
- **Stack decay:** Lose 1 stack every 5 seconds without combat
- **3-stack reward:** Mini-power (combat advantage)
- **5-stack reward:** Full-power (game-changing temporary buff)

### Role-Specific Stack Generation

| Role | How to Build Stacks | Theme |
|------|---------------------|-------|
| Warrior | Every blocked or absorbed hit generates 1 stack | Frontline soaking |
| Caster | Every ability hit on an enemy generates 1 stack | Consistent casting |
| Archer | Every 5th basic attack generates 1 stack | Sustained fire |
| Assassin | Every critical hit or backstab generates 1 stack | Burst precision |

---

## Faction Buffs

### 1. Aten Ra — Solar Edict
**Resource:** Solar Charge  
**Theme:** Damage escalation — the more you fight, the stronger your strikes  

| Stacks | Effect |
|--------|--------|
| 3 | Next ability deals +50% damage |
| 5 | Ultimate cooldown reduced 30% |

**Playstyle:** Aggressive sustained damage. Solar Charge rewards constant pressure — the longer you fight, the harder you hit. Best for players who stay in combat and never let up.

---

### 2. Asgardian — Rune Oath
**Resource:** Oathfire  
**Theme:** Tank and retaliate — pain fuels your power  

| Stacks | Effect |
|--------|--------|
| 3 | Next hit heals 10% HP |
| 5 | Gain 30% armor for 5s |

**Playstyle:** Defensive brawling. Oathfire turns incoming damage into fuel — the more you get hit, the more you heal and armor up. Best for players who trade blows and outlast enemies.

---

### 3. Olympian — Aegis Favor
**Resource:** Divine Favor  
**Theme:** Divine intervention — consistent combat earns divine rewards  

| Stacks | Effect |
|--------|--------|
| 3 | Next ability costs no cooldown |
| 5 | Gain 20% lifesteal for 5s |

**Playstyle:** Balanced aggression. Divine Favor rewards hitting enemies consistently — you get free cooldowns and lifesteal for staying active. Best for players who mix abilities and basic attacks.

---

### 4. Kami — Spirit Seal
**Resource:** Sealfire  
**Theme:** Evasion and precision — skillful dodging unlocks burst windows  

| Stacks | Effect |
|--------|--------|
| 3 | Next attack deals 2x damage |
| 5 | Immune to CC for 3s |

**Playstyle:** Hit-and-run. Sealfire rewards dodging — every successful dodge builds toward a massive burst window. Best for players who dance around enemies and strike at the right moment.

---

### 5. Tuatha — Geas Bloom
**Resource:** Geas  
**Theme:** Momentum snowball — each kill makes you stronger  

| Stacks | Effect |
|--------|--------|
| 3 | Heal 15% HP on kill |
| 5 | All cooldowns reduced 50% for 4s |

**Playstyle:** Snowball executioner. Geas rewards killing — each kill heals you and at full stacks, your cooldowns drop by half. Best for players who chain kills and build momentum.

---

### 6. Empyrean — Choir Edict
**Resource:** Choir Resonance  
**Theme:** Buildup to divine power — ability usage leads to holy bursts  

| Stacks | Effect |
|--------|--------|
| 3 | Next basic attack deals 3x damage |
| 5 | Invulnerable 2s |

**Playstyle:** Ability-first rhythm. Choir Resonance rewards ability usage — hit with abilities to charge, then unleash a 3x basic attack or go invulnerable. Best for players who weave abilities between basic attacks.

---

### 7. Infernal Dominion — Blood Contract
**Resource:** Debtfire  
**Theme:** Dark pact — pain converts to power, sacrifice fuels strength  

| Stacks | Effect |
|--------|--------|
| 3 | Next ability 2x damage + self-heal 10% |
| 5 | Gain 30% lifesteal for 5s |

**Playstyle:** Risk-reward aggression. Debtfire turns damage taken into offensive power — take hits, then unleash 2x abilities with self-heal. Best for players who trade HP for damage and heal it back.

---

## Balance Analysis

### Power Comparison (at 5 stacks, 5-second window)

| Faction | Offensive | Defensive | Utility | Overall Tier |
|---------|-----------|-----------|---------|-------------|
| Aten Ra | High (+50% ability, 30% ult CD) | None | Cooldown reduction | A |
| Asgardian | Low | High (10% heal, 30% armor) | None | A |
| Olympian | Medium (free CD) | Medium (20% lifesteal) | Cooldown free | A |
| Kami | High (2x attack) | High (CC immune) | CC immunity | A |
| Tuatha | Medium (50% CD reduction) | Medium (15% heal on kill) | Cooldown reduction | A |
| Empyrean | High (3x basic) | High (2s invuln) | Invulnerability | A |
| Infernal | High (2x ability + heal) | High (30% lifesteal) | Self-sustain | A |

### Balance Notes
- All 7 factions are **Tier A** — none is strictly better than another
- Aten Ra and Tuatha favor **aggressive playstyles** (damage + cooldown)
- Asgardian and Infernal favor **defensive/sustain playstyles** (armor + lifesteal)
- Kami and Empyrean favor **skill-based playstyles** (dodge/ability precision)
- Olympian is the **balanced all-rounder** (free cooldowns + lifesteal)
- Every buff is **solo-viable** — no team mechanics required
- Stack generation varies by role within each faction, ensuring all 4 roles can build effectively

### Synergy with Weapon Skill Tree
- **Path A (Aggressive) synergizes with:** Aten Ra, Tuatha, Infernal Dominion
- **Path B (Defensive) synergizes with:** Asgardian, Kami, Empyrean
- **Hybrid builds work with:** Olympian (balanced), any faction
- Faction buffs are **separate from weapon path** — they stack on top, adding another layer of build depth

---

## Scaling

Faction buffs scale with level:

| Level | Stack 3 Effect | Stack 5 Effect | Stack Decay |
|-------|---------------|---------------|-------------|
| 1-9 | Base values | Base duration | 5s no combat |
| 10-19 | +10% effect | +0.5s duration | 6s no combat |
| 20-29 | +20% effect | +1s duration | 7s no combat |
| 30 | +30% effect | +1.5s duration | 8s no combat |

**Example at Level 30:**
- Aten Ra 3-stack: Next ability deals +65% damage (50% base + 30% scaling)
- Asgardian 5-stack: 39% armor for 6.5s (30% base + 30% scaling, 5s + 1.5s)
- Empyrean 5-stack: Invulnerable 3.5s (2s base + 1.5s scaling)
