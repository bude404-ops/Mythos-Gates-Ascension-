# 07 — Belief System

## Overview

The Belief System is the primary progression mechanic for Avatars in Mythos Gates: Ascension. Belief is the spiritual fuel that strengthens an Avatar's connection to its Deity, increasing base stats (HP, DE, ATK, DEF, SPD).

## Architecture: Faction Base + Deity Specialty (Hybrid)

Each Avatar earns Belief through three layers:

| Layer | Modifier | Source |
|-------|----------|--------|
| Base | 100 Belief per standard victory | All deities — shared baseline |
| Faction Belief | +10% passive bonus from all victories | Shared by all deities in the same faction |
| Deity Specialty | +20% bonus from role-specific triggers | Unique to each deity's combat role |
| Fallback | +5% flat bonus from ANY victory | Ensures minimum progression even off-specialty |

### Earning Rates

| Scenario | Belief per Win | Formula |
|----------|---------------|---------|
| Optimal play (specialty triggered) | 130 | 100 + 10 (faction) + 20 (specialty) |
| Standard play (no specialty trigger) | 115 | 100 + 10 (faction) + 5 (fallback) |
| Enemy Realm bonus | +50% modifier | Risk-reward for invading |
| Earth neutral bonus | +25% modifier | Balanced ground bonus |

### Balance Principle

All 28 deities reach the same level milestones at the same pace IF played to their specialty. The gap between optimal and casual play is only ~13% — enough to reward mastery without punishing experimentation.

---

## Level Milestones

| Avatar Level | Belief Cost | Cumulative Total | Stat Bonus |
|-------------|------------|-----------------|------------|
| 1 → 10 | 500 each | 5,000 | +10% base stats |
| 11 → 20 | 1,000 each | 15,000 | +25% base stats |
| 21 → 30 | 1,500 each | 30,000 | +50% base stats |
| 31 → 40 | 2,500 each | 55,000 | +75% base stats |
| 41 → 50 | 4,000 each | 95,000 | +100% base stats (doubled) |
| Ascension 1-10 | 10,000 each | 195,000 max | +5% per tier (up to +150%) |

---

## Faction Beliefs (7)

### 1. Aten Ra — "Ma'at Devotion"
**Theme:** Sacred order and cosmic balance
**Passive:** +10% Belief from all victories
**Lore:** The Solar Dominion believes Ma'at — divine balance — is what holds civilization together. Avatars who fight with purpose and maintain order earn the devotion of their people. Belief flows from the certainty that the Avatar is enforcing cosmic law.

### 2. Asgardian — "Oath Keeping"
**Theme:** Sacred vows and honor
**Passive:** +10% Belief from all victories
**Lore:** The Aesir Holds believe an oath is not language — it is weather, weapon, and law. Avatars who hold their vows in battle earn the trust of the storm. Belief flows from the unwavering commitment to the oath that bound the Avatar to the fight.

### 3. Olympian — "Arete Excellence"
**Theme:** Mastery, victory, and witnessed glory
**Passive:** +10% Belief from all victories
**Lore:** The Celestial Heights believe excellence is sacred only when witnessed. Avatars who demonstrate mastery and dominance earn the adoration of those who watch. Belief flows from the glory of proven superiority — the crowd's awe becomes divine fuel.

### 4. Kami — "Wa Harmony"
**Theme:** Balance, precision, and threshold respect
**Passive:** +10% Belief from all victories
**Lore:** The Sacred Kingdoms believe every boundary is alive. Avatars who respect the threshold between order and chaos, spirit and matter, earn the blessing of the shrine. Belief flows from the harmony of perfectly balanced action — no wasted motion, no broken boundary.

### 5. Tuatha — "Sovereign Memory"
**Theme:** Memory, heritage, and living tradition
**Passive:** +10% Belief from all victories
**Lore:** Avalora believes memory grows roots. Avatars who honor their heritage and fight for the living world earn the devotion of the old forest. Belief flows from the ancient connection between the Avatar and the land that remembers every battle ever fought upon it.

### 6. Empyrean — "Choral Order"
**Theme:** Sacred order, unity, and law
**Passive:** +10% Belief from all victories
**Lore:** The Radiant Hierarchies believe order must be sung into existence every moment. Avatars who enforce divine law and maintain the choir's unity earn the radiance of the collective. Belief flows from the harmonious alignment of the Avatar's will with the cosmic order.

### 7. Infernal Dominion — "Debt of Power"
**Theme:** Power, contracts, and dominion
**Passive:** +10% Belief from all victories
**Lore:** The Black Iron Court believes power is debt with teeth. Avatars who dominate, conquer, and enforce their will earn the fear and respect of the Dominion. Belief flows from the chains of obligation — every soul the Avatar subjugates adds to its divine weight.

---

## Deity Specialties (28)

### Aten Ra Deities

| Deity | Role | Specialty Trigger | Bonus |
|-------|------|------------------|-------|
| Aten-Ra | Defender | Win while an objective is protected (no objective damage taken) | +20% Belief |
| Khemet | Battery | Win after using 3+ ability combo chains in a single encounter | +20% Belief |
| Nefra | Controller | Win while controlling 60%+ of the battlefield terrain | +20% Belief |
| Orru | Breaker | Win after breaking 3+ enemy armor stacks in a single encounter | +20% Belief |
| Sutekh | Disruptor | Win after interrupting 3+ enemy abilities | +20% Belief |
| Iset | Sustain | Win while keeping all allies above 50% HP | +20% Belief |
| Karnu | Artillery | Win with 5+ ranged kills | +20% Belief |
| Maahes | Guardian | Win after blocking 5+ attacks aimed at allies | +20% Belief |
| Amunet | Assassin | Win with 3+ stealth executions | +20% Belief |

### Asgardian Deities

| Deity | Role | Specialty Trigger | Bonus |
|-------|------|------------------|-------|
| Allfather | Defender | Win while an objective is protected | +20% Belief |
| Hrothar | Battery | Win after 3+ ability combo chains | +20% Belief |
| Skeld | Controller | Win while controlling 60%+ terrain | +20% Belief |
| Eirwyn | Breaker | Win after breaking 3+ enemy armor stacks | +20% Belief |
| Mordun | Disruptor | Win after interrupting 3+ enemy abilities | +20% Belief |
| Veyra | Sustain | Win while keeping all allies above 50% HP | +20% Belief |
| Ragnor | Artillery | Win with 5+ ranged kills | +20% Belief |
| Ullr | Guardian | Win after blocking 5+ attacks aimed at allies | +20% Belief |
| Sigrun | Assassin | Win with 3+ stealth executions | +20% Belief |

### Olympian Deities

| Deity | Role | Specialty Trigger | Bonus |
|-------|------|------------------|-------|
| Aurelion | Defender | Win while an objective is protected | +20% Belief |
| Kallix | Battery | Win after 3+ ability combo chains | +20% Belief |
| Thyressa | Controller | Win while controlling 60%+ terrain | +20% Belief |
| Ilyon | Breaker | Win after breaking 3+ enemy armor stacks | +20% Belief |
| Nikos | Disruptor | Win after interrupting 3+ enemy abilities | +20% Belief |
| Dione | Sustain | Win while keeping all allies above 50% HP | +20% Belief |
| Helior | Artillery | Win with 5+ ranged kills | +20% Belief |
| Pallas | Guardian | Win after blocking 5+ attacks aimed at allies | +20% Belief |
| Eiren | Assassin | Win with 3+ stealth executions | +20% Belief |

### Kami Deities

| Deity | Role | Specialty Trigger | Bonus |
|-------|------|------------------|-------|
| Amaterion | Defender | Win while an objective is protected | +20% Belief |
| Tsukiro | Battery | Win after 3+ ability combo chains | +20% Belief |
| Raidenko | Controller | Win while controlling 60%+ terrain | +20% Belief |
| Mizuka | Breaker | Win after breaking 3+ enemy armor stacks | +20% Belief |
| Kageyori | Disruptor | Win after interrupting 3+ enemy abilities | +20% Belief |
| Hanae | Sustain | Win while keeping all allies above 50% HP | +20% Belief |
| Onimaru | Artillery | Win with 5+ ranged kills | +20% Belief |
| Korin | Guardian | Win after blocking 5+ attacks aimed at allies | +20% Belief |
| Yamabito | Assassin | Win with 3+ stealth executions | +20% Belief |

### Tuatha Deities

| Deity | Role | Specialty Trigger | Bonus |
|-------|------|------------------|-------|
| Dagoran | Defender | Win while an objective is protected | +20% Belief |
| Eryndor | Battery | Win after 3+ ability combo chains | +20% Belief |
| Melian | Controller | Win while controlling 60%+ terrain | +20% Belief |
| Bran | Breaker | Win after breaking 3+ enemy armor stacks | +20% Belief |
| Nimue | Disruptor | Win after interrupting 3+ enemy abilities | +20% Belief |
| Cernan | Sustain | Win while keeping all allies above 50% HP | +20% Belief |
| Ailbhe | Artillery | Win with 5+ ranged kills | +20% Belief |
| Oghma | Guardian | Win after blocking 5+ attacks aimed at allies | +20% Belief |
| Tara | Assassin | Win with 3+ stealth executions | +20% Belief |

### Empyrean Deities

| Deity | Role | Specialty Trigger | Bonus |
|-------|------|------------------|-------|
| Seraphel | Defender | Win while an objective is protected | +20% Belief |
| Caelion | Battery | Win after 3+ ability combo chains | +20% Belief |
| Aurelia | Controller | Win while controlling 60%+ terrain | +20% Belief |
| Malachor | Breaker | Win after breaking 3+ enemy armor stacks | +20% Belief |
| Elyndra | Disruptor | Win after interrupting 3+ enemy abilities | +20% Belief |
| Orison | Sustain | Win while keeping all allies above 50% HP | +20% Belief |
| Vespera | Artillery | Win with 5+ ranged kills | +20% Belief |
| Axiom | Guardian | Win after blocking 5+ attacks aimed at allies | +20% Belief |
| Theon | Assassin | Win with 3+ stealth executions | +20% Belief |

### Infernal Dominion Deities

| Deity | Role | Specialty Trigger | Bonus |
|-------|------|------------------|-------|
| Mordrath | Defender | Win while an objective is protected | +20% Belief |
| Varkul | Battery | Win after 3+ ability combo chains | +20% Belief |
| Nyxara | Controller | Win while controlling 60%+ terrain | +20% Belief |
| Azrakar | Breaker | Win after breaking 3+ enemy armor stacks | +20% Belief |
| Orryx | Disruptor | Win after interrupting 3+ enemy abilities | +20% Belief |
| Malvera | Sustain | Win while keeping all allies above 50% HP | +20% Belief |
| Kharon | Artillery | Win with 5+ ranged kills | +20% Belief |
| Sablex | Guardian | Win after blocking 5+ attacks aimed at allies | +20% Belief |
| Zerath | Assassin | Win with 3+ stealth executions | +20% Belief |

---

## Specialty Trigger Details

### Defender — "Bulwark Faith"
**Trigger:** Win the encounter without the protected objective taking any damage.
**Lore:** The Avatar's faith is rewarded when their shield holds. Defenders earn bonus Belief by being an unbreakable wall — the more damage they soak, the more their followers believe in their invincibility.

### Battery — "Conduit Faith"
**Trigger:** Win after executing 3+ ability combo chains in a single encounter.
**Lore:** The Avatar channels divine energy like a living conduit. Batteries earn bonus Belief when they demonstrate mastery of the energy flow — chain abilities together and the faithful see a god who never runs dry.

### Controller — "Domain Faith"
**Trigger:** Win while controlling 60%+ of the battlefield terrain.
**Lore:** The Avatar bends the battlefield to their will. Controllers earn bonus Belief by owning the ground — the more territory they shape, the more their followers believe in their dominion over reality.

### Breaker — "Fracture Faith"
**Trigger:** Win after breaking 3+ enemy armor stacks in a single encounter.
**Lore:** The Avatar shatters what cannot be shattered. Breakers earn bonus Belief by cracking open the unbreakable — every shield they destroy is proof that nothing can withstand their deity's power.

### Disruptor — "Chaos Faith"
**Trigger:** Win after interrupting 3+ enemy abilities.
**Lore:** The Avatar breaks the enemy's rhythm. Disruptors earn bonus Belief by denying the enemy's plan — every interrupted ability is proof that the Avatar controls the tempo of battle.

### Sustain — "Endurance Faith"
**Trigger:** Win while keeping all allies above 50% HP.
**Lore:** The Avatar endures and preserves. Sustains earn bonus Belief by keeping their allies alive — the faithful see a god who protects and heals, not just destroys.

### Artillery — "Range Faith"
**Trigger:** Win with 5+ ranged kills.
**Lore:** The Avatar strikes from beyond reach. Artillery earns bonus Belief by demonstrating that distance is no defense — every ranged kill proves their deity's power cannot be escaped.

### Guardian — "Aegis Faith"
**Trigger:** Win after blocking 5+ attacks aimed at allies.
**Lore:** The Avatar stands between danger and the vulnerable. Guardians earn bonus Belief by intercepting harm — every blocked attack is proof that the faithful are safe under their deity's watch.

### Assassin — "Shadow Faith"
**Trigger:** Win with 3+ stealth executions.
**Lore:** The Avatar strikes from the unseen. Assassins earn bonus Belief by eliminating threats before they know death is coming — every stealth execution proves their deity's reach extends into the shadows themselves.

---

## Belief Sources Beyond Combat

Belief is not earned only through combat. Avatars can earn Belief through:

| Source | Belief Earned | Notes |
|--------|-------------|-------|
| Standard victory | 100 base | Any encounter won |
| Faction passive | +10% | Always active |
| Deity specialty | +20% | Role-specific trigger |
| Fallback bonus | +5% | Any victory (if specialty not triggered) |
| Lore pickup | 25 per pickup | Found in dungeon rooms |
| Boss defeat | 200 base | Boss encounters give double |
| World Boss participation | 500 base | Server event participation |
| Daily challenge | 150 base | One per day |
| Realm control objective | 75 base | Territory control missions |
| Follower recruitment | 10 per follower | Passive income from controlled territory |

---

## Belief Spending

Belief is spent exclusively on Avatar core stat increases:

| Stat | Cost per +1 | Max Bonus | Effect |
|------|------------|-----------|--------|
| Health (HP) | 100 Belief | +2000 HP | Increases damage capacity |
| Divine Energy (DE) | 100 Belief | +100 DE | Increases ability resource pool |
| Attack (ATK) | 100 Belief | +200 ATK | Increases base damage |
| Defense (DEF) | 100 Belief | +100 DEF | Increases damage reduction |
| Speed (SPD) | 200 Belief | +3 SPD | Increases movement + attack speed |

Players distribute Belief across stats freely — no forced stat allocation. This allows build customization within each deity's role.

---

## Influence System (Companion Resource)

Influence is earned alongside Belief but spent differently:

| Source | Influence Earned |
|--------|-----------------|
| Mission completion | 50 base |
| Boss defeat | 100 base |
| Daily challenge | 75 base |
| Realm control | 50 per territory |
| Rival Avatar defeat (PvP) | 150 base |
| Enemy Realm invasion victory | +50% modifier |

### Influence Spending

| Unlock | Cost | Effect |
|--------|------|--------|
| Ability 1 upgrade | 500 | Enhances bread-and-butter ability |
| Ability 2 upgrade | 750 | Enhances tactical ability |
| Ability 3 upgrade | 1,000 | Enhances heavy impact ability |
| Ultimate upgrade | 2,500 | Enhances ultimate ability |
| Ascension Tier 1 | 5,000 | Unlocks first passive enhancement slot |
| Ascension Tier 2-10 | +5,000 each | Additional enhancement slots |
| Relic enhancement | 250 per level | Increases relic stat bonuses |
