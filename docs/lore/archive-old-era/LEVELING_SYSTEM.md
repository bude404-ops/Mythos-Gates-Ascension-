# Leveling System & Weapon Skill Tree — Mythos Gates: Ascension

**Version:** 1.0.0  
**Locked:** Aug 31, 2026  
**Design:** Solo progression — 30 levels per deity, weapon evolves at key milestones  

---

## Leveling Overview

| Level Range | Milestone | Unlock |
|-------------|-----------|--------|
| 1-5 | Base Form | Basic Attack + 2 Abilities + Ultimate (all unlocked from start) |
| 5 | Weapon Path Choice | Choose 1 of 2 weapon upgrade paths |
| 10 | Weapon Ascension | Weapon evolves — new passive + visual upgrade |
| 15 | Ability Enhancement | Choose 1 ability to enhance (upgraded effect) |
| 20 | Second Weapon Path | Choose second path branch (or double down on first) |
| 25 | Ultimate Enhancement | Ultimate gains secondary effect |
| 30 | Divine Ascension | Full weapon transformation + stat cap boost |

### Stat Growth Per Level

| Stat | Per Level | At Level 30 (Total) |
|------|-----------|---------------------|
| HP | +5% | +150% |
| ATK | +4% | +120% |
| Armor | +3% | +90% |
| ATK Speed | +2% | +60% |
| Cooldown Reduction | +1% | +30% cap |
| Lifesteal | +0.5% | +15% |

---

## Weapon System

Every deity has a unique named weapon tied to their mythology. Weapons evolve through the skill tree as you level.

### Weapon Progression

```
Level 1: Base Weapon (starter form)
    ↓
Level 5: PATH CHOICE
    ├── Path A (Aggressive) ──→ Level 10: Ascended Form A
    │                              ↓
    │                         Level 20: Branch A1 or A2
    │
    └── Path B (Defensive/Utility) ──→ Level 10: Ascended Form B
                                      ↓
                                 Level 20: Branch B1 or B2
    ↓
Level 25: Ultimate Enhancement
    ↓
Level 30: Divine Ascension (final form — unique per path chosen)
```

### Skill Tree Choices

At each milestone, the player chooses from 2 options. This creates **4 possible build paths** per deity:

1. Path A → Branch A1 → Divine A1
2. Path A → Branch A2 → Divine A2
3. Path B → Branch B1 → Divine B1
4. Path B → Branch B2 → Divine B2

This means every deity can be built 4 different ways, adding massive replay depth.

---

## Aten Ra Faction

### Aten Ra — Warrior
**Base Weapon:** Sun-Disc Khopesh "Ma'at's Edge" + Radiant Law Shield "Akhentop"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Ma'at's Edge — solar khopesh, 3-hit combo |
| 5 | Path Choice | **A) Blade of Judgment** — +30% basic damage, cleaves on 3rd hit / **B) Shield of Ma'at** — shield blocks 2 hits, reflects 20% |
| 10 | Ascension | A: Edge glows gold, frontal cone widens 50% / B: Shield gains solar aura, damages nearby enemies |
| 15 | Ability Enhance | Choose: Sun-Scale Decree (zone lasts +3s) or Ma'at Verdict (barrier absorbs 2 hits) |
| 20 | Branch | A1: **Dawnbreaker** — 4th combo hit, solar explosion / A2: **Judgment Lord** — +50% damage vs marked / B1: **Bastion** — shield regenerates 5s / B2: **Solar Aegis** — reflect 40% + heal 10% on block |
| 25 | Ultimate Enhance | Source Radiance gains: blind duration +2s or damage zone lingers 3s |
| 30 | Divine | A1: **Eye of Ra** — every 5th hit is a solar blast 3x / A2: **Final Judgment** — marked enemies take 4x / B1: **Fortress of Ma'at** — immune while shielded + 20% lifesteal / B2: **Radiant Bastion** — shield blocks all CC + heal 25% on block |

### Sutekh — Caster
**Base Weapon:** Desert Storm-Scepter "Khepri's Spine" + Lightning-Wand Blade "Set's Fang"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Khepri's Spine — storm-scepter, sand stacks |
| 5 | Path Choice | **A) Storm Surge** — +25% ability damage, larger AoE / **B) Sand Guardian** — 10% lifesteal, sand armor stacks |
| 10 | Ascension | A: Scepter crackles red lightning, AoE +30% / B: Carapace armor visible, 15% damage reduction |
| 15 | Ability Enhance | Choose: Desert Storm Form (+2s duration) or Red Land's Wrath (vortex +pull strength) |
| 20 | Branch | A1: **Red Lord** — abilities cost no cooldown when in storm form / A2: **Chaos Storm** — sand stacks explode at 5 / B1: **Scarab Shell** — 20% lifesteal, armor +50% / B2: **Dawn Engine** — heal 5% per stack consumed |
| 25 | Ultimate Enhance | Red Lord Ascension gains: +2s duration or blind becomes stun |
| 30 | Divine | A1: **Khepri Ascended** — permanent storm form, 3x damage / A2: **Chaos Incarnate** — sand stacks infinite, explode on death / B1: **Immortal Scarab** — death revives at 30% HP, 60s CD / B2: **Eternal Dawn** — all damage healed 25%, unstoppable |

### Iset — Archer
**Base Weapon:** Throne Light-Bow "Seshat's Crescent" + River-Linen Fan "Nile's Breath"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Seshat's Crescent — light-bow, restoration energy, 15% lifesteal |
| 5 | Path Choice | **A) Throne Hunter** — +30% arrow damage, pierce 2 enemies / **B) Restoration Queen** — lifesteal 25%, cleanse on hit |
| 10 | Ascension | A: Bow glows blue-gold, arrows leave light trails / B: Golden aura, self-heal visual on hit |
| 15 | Ability Enhance | Choose: Throne Sovereignty (+2s, self-heal 25%) or Nile Ward (pool +50% heal, 2s stun on enemies) |
| 20 | Branch | A1: **Phantom Arrows** — 3rd arrow pierces all / A2: **Throne Sniper** — +50% range, 2x first hit / B1: **Life Wellspring** — heal 20%/s in pool / B2: **Nile Cleansing** — immune to CC 3s after pool |
| 25 | Ultimate Enhance | Isis Ascension gains: self-heal 50% or throne beams stun 1s |
| 30 | Divine | A1: **Throne of Light** — every 3rd arrow 3x damage + pierce all / A2: **Isis Eternal** — arrows mark, marked take 2x / B1: **River of Life** — pool permanent, 30%/s heal / B2: **Throne Immortal** — death revives at 40% HP, 60s CD |

### Amunet — Assassin
**Base Weapon:** Paired Obsidian Name-Knives "Ren of the Hidden"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Ren of the Hidden — dual obsidian knives, void-marks |
| 5 | Path Choice | **A) Shadow Killer** — +40% crit damage, 2x void-mark damage / **B) Void Walker** — 10% lifesteal, void-marks heal on detonate |
| 10 | Ascension | A: Knives drip void energy, crit visual / B: Void aura, shadow trail on movement |
| 15 | Ability Enhance | Choose: Veil of the Hidden (+1s invis) or Secret Name (teleport +3x damage) |
| 20 | Branch | A1: **Silent Death** — backstab 4x, invis +1s / A2: **Void Assassin** — marks explode for AoE / B1: **Hidden Life** — lifesteal 25%, void-marks heal 8% / B2: **Phantom Step** — teleport CD halved, heal on teleport |
| 25 | Ultimate Enhance | Amunet Ascension gains: +1s untargetable or 4x damage per mark |
| 30 | Divine | A1: **Name of Death** — backstab executes below 20% / A2: **Void Storm** — all marks detonate 3x AoE / B1: **Eternal Hidden** — permanent 15% lifesteal, death revives 30% / B2: **Between Worlds** — teleport every 4s, heal 10% per teleport |

---

## Asgardian Faction

### Thor — Warrior
**Base Weapon:** Storm Hammer "Mjölnir's Echo" + Iron Wrist Loops

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Mjölnir's Echo — storm hammer, lightning on 3rd hit |
| 5 | Path Choice | **A) Thunder God** — +30% hammer damage, lightning jumps 2 enemies / **B) Storm Wall** — hammer blocks, 10% lifesteal on lightning hit |
| 10 | Ascension | A: Hammer crackles constant lightning / B: Hammer surrounded by storm shield |
| 15 | Ability Enhance | Choose: Storm Hammer (+2s field, 2x lightning) or Thunder Step (stun +1s, armor +50%) |
| 20 | Branch | A1: **Might of Thor** — 4th throw, hammer returns with explosion / A2: **Lightning Bringer** — lightning chains 4 enemies / B1: **Stormbreaker** — 20% lifesteal, armor +60% / B2: **Thunder God's Vigor** — lightning heals 10% per jump |
| 25 | Ultimate Enhance | Thor Ascension gains: +2s screen lightning or stun on hit |
| 30 | Divine | A1: **Godblood Mjölnir** — every throw is screen-wide lightning 3x / A2: **Storm Caller** — permanent storm field, 2x all damage / B1: **Unbreakable Storm** — immune + 25% lifesteal 5s / B2: **Thunder's Blessing** — all lightning heals 20%, unstoppable |

### Odin — Caster
**Base Weapon:** Gungnir Rune-Spear "Spear of Sacrifice" + Oath-Bound Spell-Shield

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Spear of Sacrifice — rune-spear, rune-marks, channels magic |
| 5 | Path Choice | **A) Rune Lord** — +25% ability damage, 2 rune-marks per hit / **B) Allfather** — 10% lifesteal, spell-shield absorbs 1 ability |
| 10 | Ascension | A: Spear glows with rune-script (abstract fracture patterns) / B: Raven orbits, shield visible |
| 15 | Ability Enhance | Choose: Storm Sovereignty (+2s, 2x lightning) or Raven's Sight (marks +2s, +50% damage to marked) |
| 20 | Branch | A1: **Wisdom of the Runes** — abilities refund 20% CD on kill / A2: **Rune Storm** — 3 rune-marks = explosion / B1: **One-Eye's Sight** — 20% lifesteal, see all stealth / B2: **Sacrifice's Reward** — take 5% HP, deal 3x damage 3s |
| 25 | Ultimate Enhance | Odin Ascension gains: time slow 70% or rune-marks stun on detonate |
| 30 | Divine | A1: **Allfather's Rune** — all abilities 50% CD, 3x damage / A2: **Ragnarok Spear** — rune-marks infinite, Gungnir pierces all / B1: **Eternal Sacrifice** — immune 3s, 25% lifesteal / B2: **Wisdom Incarnate** — every 10s, next ability free + heal 20% |

### Skadi — Archer
**Base Weapon:** Frost-Bound Greatbow "Winter's Howl" + Blizzard-Fang Hunting Spear

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Winter's Howl — frost greatbow, freeze at 3 stacks |
| 5 | Path Choice | **A) Huntress** — +30% arrow damage, freeze at 2 stacks / **B) Winter Survival** — 15% lifesteal, freeze heals 5% |
| 10 | Ascension | A: Bow radiates permanent frost aura / B: Ice crystals form on armor, heal visual |
| 15 | Ability Enhance | Choose: Huntress Domain (+3s, +75% range) or Winter's Trap (trail freezes 1s) |
| 20 | Branch | A1: **Eternal Hunt** — 5th arrow splits 3x / A2: **Deep Freeze** — freeze = stun 1s / B1: **Winter's Embrace** — 25% lifesteal, immune to freeze / B2: **Ice Heart** — frozen enemies heal you 10% per hit |
| 25 | Ultimate Enhance | Skadi Ascension gains: 7-split arrows or all ground ice = stun zone |
| 30 | Divine | A1: **Blizzard Queen** — every arrow splits 5x, 3x damage / A2: **Absolute Zero** — freeze permanent until attacked / B1: **Winter Immortal** — death revives at 30% as ice form / B2: **Frost Mother** — 30% lifesteal, frozen enemies heal 15% |

### Freyja — Assassin
**Base Weapon:** Falcon-Feather Blade "Brísingamen's Edge" + Seiðr Chain

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Brísingamen's Edge — falcon-feather blade, harvest battle-fate |
| 5 | Path Choice | **A) Valkyrie** — +40% attack speed, fate stacks 2x / **B) Seiðr Witch** — 15% lifesteal, chain drains heal 10% |
| 10 | Ascension | A: Golden wings flash on attack / B: Seiðr chains glow amber |
| 15 | Ability Enhance | Choose: Battle-Fate Storm (+1s, 3x attack speed) or Seiðr Chains (root +3s, drain 15%) |
| 20 | Branch | A1: **Chooser of Slain** — fate stacks execute below 40% / A2: **Falcon's Dive** — dash attack 3x / B1: **Seiðr Master** — 25% lifesteal, chain 2 targets / B2: **Fate Weaver** — chain marks, marked take 2x |
| 25 | Ultimate Enhance | Chooser Ascension gains: execute below 60% or heal 30% on execute |
| 30 | Divine | A1: **Valkyrie Queen** — permanent 2x attack speed, execute 30% / A2: **Falcon God** — every 4th attack dives 4x / B1: **Seiðr Eternal** — 30% lifesteal, chain all enemies / B2: **Fate Sovereign** — all marked take 3x, heal 15% per kill |

---

## Olympian Faction

### Athena — Warrior
**Base Weapon:** Aegis Shield "Shield of Wisdom" + Long Bronze Spear "Phalanx Pike"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Shield of Wisdom — tactical spear + shield, shield stacks |
| 5 | Path Choice | **A) Strategist** — +30% spear damage, 2x shield stacks / **B) Defender** — shield blocks 2 hits, 10% lifesteal on counter |
| 10 | Ascension | A: Spear glows with golden strategy lines / B: Shield radiates aegis aura |
| 15 | Ability Enhance | Choose: Aegis Bastion (+1s invuln, reflect 75%) or Phalanx Formation (wall +5s, self-armor +50%) |
| 20 | Branch | A1: **Phalanx Commander** — 4th hit, spear pierces all / A2: **Tactical Strike** — marked enemies take 3x / B1: **Aegis Eternal** — 20% lifesteal, shield regens 4s / B2: **Reflect Master** — reflect 75% + heal 10% on block |
| 25 | Ultimate Enhance | Athena Ascension gains: +3s foresight or +75% damage to marked |
| 30 | Divine | A1: **Goddess of War** — every 3rd hit 3x + pierce all / A2: **Omniscient** — all enemies permanently marked, 3x / B1: **Unbreakable Aegis** — immune while shielded + 25% lifesteal / B2: **Mirror Shield** — reflect 100%, heal 20% per block |

### Zeus — Caster
**Base Weapon:** Forked Thunder-Scepter "Olympus Bolt" + Aegis-Edged Shield

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Olympus Bolt — thunder-scepter, lightning |
| 5 | Path Choice | **A) Storm King** — +25% ability damage, lightning jumps 3 / **B) Thunder Father** — 10% lifesteal, shield absorbs 1 hit |
| 10 | Ascension | A: Scepter crackles permanent storm / B: Shield hums with thunder |
| 15 | Ability Enhance | Choose: Olympus Decree (+2s, 2x aura) or Chain Lightning (jumps 7, +20% per jump) |
| 20 | Branch | A1: **King's Storm** — abilities 50% CD on lightning kill / A2: **Thunder God** — 3 stacks = lightning explosion / B1: **Storm Father** — 20% lifesteal, armor +50% / B2: **Lightning Well** — lightning heals 10% per jump |
| 25 | Ultimate Enhance | Zeus Ascension gains: +1s stun or 3x damage to all |
| 30 | Divine | A1: **King of Olympus** — permanent storm aura, 3x damage / A2: **Thunder Incarnate** — all attacks chain lightning, 2x / B1: **Eternal Storm** — immune 3s, 25% lifesteal / B2: **Lightning Father** — all lightning heals 20%, unstoppable |

### Artemis — Archer
**Base Weapon:** Silver Crescent Bow "Moonhunter" + Short Hunting Spear "Stag Spear"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Moonhunter — silver bow, hunt-mark stacks |
| 5 | Path Choice | **A) Goddess of the Hunt** — +30% arrow damage, 2x marks / **B) Moon Survivor** — 15% lifesteal, marks heal 5% |
| 10 | Ascension | A: Bow glows silver-blue, arrows leave moon trails / B: Moon aura, heal glow on marked targets |
| 15 | Ability Enhance | Choose: Huntress Moon (+50% damage, auto-track) or Forest Ambush (stealth +1s, root 2s) |
| 20 | Branch | A1: **Eternal Huntress** — 5th arrow 3x + pierce / A2: **Moon Sniper** — +75% range, 2x first hit / B1: **Wild Hunter** — 25% lifesteal, immune in stealth / B2: **Moon's Blessing** — marked enemies heal you 10% per hit |
| 25 | Ultimate Enhance | Artemis Ascension gains: 3s rain duration or 3x vs all marked |
| 30 | Divine | A1: **Moon Goddess** — every arrow splits 3x, 3x damage / A2: **Hunt Eternal** — all enemies auto-marked, 3x / B1: **Wild Immortal** — death revives 30% in stealth / B2: **Moon Mother** — 30% lifesteal, marks heal 15% |

### Ares — Assassin
**Base Weapon:** Dual Wrath-Blades "Fury Twins" + War-Kopis "Slaughter's Edge"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Fury Twins — dual blades, rage stacks |
| 5 | Path Choice | **A) Berserker** — +40% damage at max rage, 2x rage gain / **B) War Master** — 15% lifesteal, rage heals 8% |
| 10 | Ascension | A: Blades drip blood-red energy / B: Golden war aura, heal visual |
| 15 | Ability Enhance | Choose: War Frenzy (+1s, 3x attack speed) or Spear Wall (barrier +2s, blocks projectiles) |
| 20 | Branch | A1: **Killing Frenzy** — rage stacks execute below 30% / A2: **Bloodlust** — kills reset all cooldowns / B1: **Warrior's Vigor** — 25% lifesteal, unkillable +1s / B2: **Battle Heal** — every kill heals 15% |
| 25 | Ultimate Enhance | Ares Ascension gains: +2s berserker or 3x damage to all |
| 30 | Divine | A1: **God of War** — permanent berserker, 3x damage / A2: **Blood God** — kills heal 30%, no cooldown / B1: **Immortal Warrior** — death revives 40%, 25% lifesteal / B2: **War Eternal** — every kill heals 25%, reset CDs |

---

## Kami Faction

### Amaterasu — Warrior
**Base Weapon:** Mirror-Disc Shield "Yata no Kagami" + Radiant Ceremonial Blade "Kusanagi"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Yata no Kagami — mirror shield + radiant blade, light stacks |
| 5 | Path Choice | **A) Sun Goddess** — +30% blade damage, light stacks 2x / **B) Radiant Mirror** — shield reflects 30%, 10% lifesteal |
| 10 | Ascension | A: Blade burns with solar fire / B: Mirror blinds all nearby, shield aura |
| 15 | Ability Enhance | Choose: Sacred Light Field (+2s, self +30% damage) or Mirror Flash (blind +1s, reveal 5s) |
| 20 | Branch | A1: **Dawn Bringer** — 4th hit, solar explosion 2x / A2: **Light Sovereign** — light stacks 3x at max / B1: **Radiant Guardian** — 20% lifesteal, shield regens 4s / B2: **Solar Mirror** — reflect 50% + heal 10% |
| 25 | Ultimate Enhance | Amaterasu Ascension gains: +2s blind or 3x damage |
| 30 | Divine | A1: **Supreme Sun** — every 3rd hit 3x + solar blast / A2: **Eternal Dawn** — permanent light field, 2x all / B1: **Radiant Immortal** — immune 3s, 25% lifesteal / B2: **Mirror Goddess** — reflect 100%, heal 25% per block |

### Tsukuyomi — Caster
**Base Weapon:** Crescent Naginata "Moon's Scythe" + Moon-Calendar Talismans

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Moon's Scythe — crescent naginata, phase marks |
| 5 | Path Choice | **A) Moon God** — +25% ability damage, 2 phase marks per hit / **B) Tide Master** — 10% lifesteal, phase marks heal 5% |
| 10 | Ascension | A: Naginata glows with lunar energy / B: Moon aura, talismans orbit |
| 15 | Ability Enhance | Choose: Crescent Domain (+2s silence, 2x damage) or Tide of Tsukuyomi (push +stun 1s, 3x mark damage) |
| 20 | Branch | A1: **Eclipse Lord** — abilities 50% CD in night zone / A2: **Phase Storm** — 3 marks = AoE explosion / B1: **Lunar Vitality** — 20% lifesteal, heal 10% in zone / B2: **Moon's Grace** — phase marks heal 15% on detonate |
| 25 | Ultimate Enhance | Tsukuyomi Ascension gains: +1s freeze or 3x damage in eclipse |
| 30 | Divine | A1: **Moon Sovereign** — permanent night zone, 3x damage / A2: **Eclipse God** — all enemies phase-marked, 3x / B1: **Eternal Moon** — 25% lifesteal, immune in zone / B2: **Lunar Immortal** — death revives 30%, heal 20%/s |

### Susanoo — Archer
**Base Weapon:** Tempest Greatbow "Stormfang" + Storm Katana "Ame-no-Habakiri"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Stormfang — tempest greatbow, wind-slashes, knockback |
| 5 | Path Choice | **A) Storm God** — +30% arrow damage, wind-slash 2x / **B) Tempest Guardian** — 15% lifesteal, wind pushes heal 5% |
| 10 | Ascension | A: Greatbow channels constant wind / B: Wind aura, heal on knockback |
| 15 | Ability Enhance | Choose: Hurricane Slash (+2s wind zone, 2x push) or Serpent Slayer (pierce +50%, 3x vs high-defense) |
| 20 | Branch | A1: **Dragon Slayer** — every 5th arrow 3x + pierce all / A2: **Storm Bringer** — wind-slash chains 3 enemies / B1: **Tempest Survival** — 25% lifesteal, immune to push / B2: **Wind's Blessing** — knockback heals 15% |
| 25 | Ultimate Enhance | Susanoo Ascension gains: +2s hurricane or 3x damage scattered |
| 30 | Divine | A1: **God of Storms** — every arrow 3x + wind-slash all / A2: **Orochi Slayer** — 3x vs all, pierce infinite / B1: **Eternal Tempest** — 25% lifesteal, permanent wind aura / B2: **Storm Immortal** — death revives 30%, knockback all |

### Izanami — Assassin
**Base Weapon:** Bone-White Shrine Fan "Yomi's Veil" + Underworld Cord Blade "Death Thread"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Yomi's Veil — shrine fan, death-mark stacks |
| 5 | Path Choice | **A) Queen of Death** — +40% damage, 2x death-mark stacks / **B) Underworld Mother** — 15% lifesteal, death-marks heal 8% |
| 10 | Ascension | A: Fan drips shadow energy / B: Underworld aura, heal on mark |
| 15 | Ability Enhance | Choose: Underworld Gate (execute below 25%, +2s zone) or Yomi's Grasp (root +3s, drain 15%) |
| 20 | Branch | A1: **Death Sovereign** — marks execute below 35% / A2: **Underworld Storm** — 3 marks = AoE death / B1: **Life in Death** — 25% lifesteal, drain 15% / B2: **Yomi's Embrace** — root heals 20%, immune 1s |
| 25 | Ultimate Enhance | Izanami Ascension gains: execute below 40% or 4x if below 30% |
| 30 | Divine | A1: **Goddess of Death** — marks execute below 50% / A2: **Underworld Eternal** — all marked 3x, explode on death / B1: **Immortal Queen** — death revives 40%, 25% lifesteal / B2: **Mother of Yomi** — root all, heal 25%, immune 3s |

---

## Tuatha Dé Faction

### Dagda — Warrior
**Base Weapon:** Great Life-Death Oak Club "Lorg Mór" + Cauldron-Lid Shield "Coire"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Lorg Mór — oak club, ground cracks |
| 5 | Path Choice | **A) Earth Father** — +30% club damage, 4th hit ground slam / **B) Cauldron Guardian** — 15% lifesteal, shield heals 8% |
| 10 | Ascension | A: Club radiates earth energy / B: Cauldron shield glows green, heal aura |
| 15 | Ability Enhance | Choose: Harp of Seasons (+3s, 2x buff) or Cauldron's Bounty (self-heal 15%/s, 2x enemy damage) |
| 20 | Branch | A1: **Earthshaker** — ground slam 3x AoE / A2: **Life-Death** — kills heal 15% / B1: **Cauldron of Plenty** — 25% lifesteal, heal zone permanent / B2: **Father's Vigor** — shield blocks 2 hits + heal 15% |
| 25 | Ultimate Enhance | Dagda Ascension gains: +2s knockdown or 3x damage |
| 30 | Divine | A1: **Good God** — every 3rd hit 3x + screen quake / A2: **Life and Death Lord** — kills heal 30%, reset CDs / B1: **Eternal Cauldron** — 30% lifesteal, immune 3s / B2: **Father Eternal** — death revives 40%, heal 20%/s |

### Brigid — Caster
**Base Weapon:** Sacred Flame-Staff "Hearth's Light" + Poet's Fire-Censer "Ember Verses"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Hearth's Light — flame-staff, burn stacks |
| 5 | Path Choice | **A) Flame Goddess** — +25% ability damage, burn 2x / **B) Hearth Keeper** — 15% lifesteal, burn heals 5% |
| 10 | Ascension | A: Staff burns with sacred fire / B: Healing flame aura, green-gold glow |
| 15 | Ability Enhance | Choose: Sacred Flame (self-heal 15%/s, +2s) or Forge's Blessing (+burn 50%, lifesteal 20%, 10s) |
| 20 | Branch | A1: **Eternal Flame** — burn stacks infinite, explode at 5 / A2: **Forge Mistress** — abilities 50% CD / B1: **Hearth Mother** — 25% lifesteal, immune to burn / B2: **Flame Healer** — burn heals 15%, self-heal 10%/s |
| 25 | Ultimate Enhance | Brigid Ascension gains: +2s immunity or self-heal 75% |
| 30 | Divine | A1: **Goddess of Flame** — permanent burn, 3x ability damage / A2: **Sacred Forge** — all attacks burn, abilities free / B1: **Immortal Hearth** — 30% lifesteal, immune 5s / B2: **Flame Eternal** — permanent self-heal 20%/s, cleanse on hit |

### Morrígan — Archer
**Base Weapon:** Phantom Crow-Bow "Battle Cry" + Black Spear of Fate "Doomshaft"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Battle Cry — phantom crow-bow, death-mark |
| 5 | Path Choice | **A) Phantom Queen** — +30% arrow damage, 2x death-marks / **B) Crow Mother** — 15% lifesteal, death-marks heal 8% |
| 10 | Ascension | A: Bow manifests crow feathers on draw / B: Crow aura, heal on mark detonation |
| 15 | Ability Enhance | Choose: Battle Crow Form (+2s flight, 3x dive) or Phantom Strike (pierces all, marks 3x next hit) |
| 20 | Branch | A1: **Phantom Storm** — every 5th arrow 3x + pierce all / A2: **Death Marks** — marks execute below 35% / B1: **Crow's Vigor** — 25% lifesteal, flight heals 10%/s / B2: **Phantom Life** — marks heal 15%, fear heals 10% |
| 25 | Ultimate Enhance | Morrígan Ascension gains: +2s fear or 3x damage |
| 30 | Divine | A1: **Queen of Phantoms** — every arrow 3x + crow swarm / A2: **Battle Raven** — all enemies marked, execute 40% / B1: **Phantom Immortal** — death revives 30%, 25% lifesteal / B2: **Crow Goddess** — fear all, heal 25%, immune 3s |

### Lugh — Assassin
**Base Weapon:** Radiant Light-Spear "Lúin of Dawn" + Sling of Dawn "Lia Fáil"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Lúin of Dawn — light-spear, fast thrusts, light stacks |
| 5 | Path Choice | **A) Many-Skilled** — +40% damage, 2x light stacks / **B) Radiant Master** — 15% lifesteal, light stacks heal 8% |
| 10 | Ascension | A: Spear radiates blinding light / B: Golden aura, heal visual |
| 15 | Ability Enhance | Choose: Long Arm (+2s, hit all in zone) or Sling of Dawn (blind +2s, 3x damage) |
| 20 | Branch | A1: **Master of All** — every 4th attack 3x + all abilities empowered / A2: **Light Storm** — 3 light stacks = AoE / B1: **Radiant Vitality** — 25% lifesteal, light heals 15% / B2: **Dawn's Blessing** — sling heals 15%, blind = heal |
| 25 | Ultimate Enhance | Lugh Ascension gains: +2s empowered or all abilities 3x |
| 30 | Divine | A1: **Samildánach** — all abilities 3x permanent, every 3rd hit 3x / A2: **Light Incarnate** — all attacks AoE, 2x / B1: **Eternal Radiance** — 30% lifesteal, immune in light / B2: **Dawn Immortal** — death revives 40%, heal 20%/s |

---

## Empyrean Faction

### Michael — Warrior
**Base Weapon:** Flaming Judgement Sword "Sword of Heaven" + Choir Shield

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Sword of Heaven — flaming sword, sanctify stacks |
| 5 | Path Choice | **A) Archangel** — +30% sword damage, 4th hit holy blast / **B) Divine Guardian** — 15% lifesteal, shield blocks 2 hits |
| 10 | Ascension | A: Sword burns with white-gold flame / B: Wings visible, shield aura |
| 15 | Ability Enhance | Choose: Divine Verdict (bind +2s, +50% holy damage) or Wings of Justice (leap +stun 2s, circle 2x) |
| 20 | Branch | A1: **Heaven's Blade** — every 5th hit 3x + holy explosion / A2: **Demon Slayer** — 3x vs shadow enemies / B1: **Archangel's Vigor** — 25% lifesteal, armor +50% / B2: **Holy Aegis** — shield blocks all CC + heal 15% |
| 25 | Ultimate Enhance | Michael Ascension gains: +2s archangel or 3x vs all |
| 30 | Divine | A1: **Sword of God** — every 3rd hit 3x + screen holy blast / A2: **Demon's Bane** — 4x vs shadow, permanent / B1: **Eternal Archangel** — immune 3s, 25% lifesteal / B2: **Heaven's Guardian** — shield blocks all, heal 25% per block |

### Gabriel — Caster
**Base Weapon:** Long Silver Trumpet-Spear "Herald's Call" + Bell-Metal Buckler

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Herald's Call — trumpet-spear, sound waves, resonance stacks |
| 5 | Path Choice | **A) Messenger** — +25% ability damage, resonance 2x / **B) Herald's Guard** — 10% lifesteal, buckler reflects 20% |
| 10 | Ascension | A: Spear-trumpet glows with holy sound waves / B: Buckler hums, shield aura |
| 15 | Ability Enhance | Choose: Divine Message (silence +2s, +50% damage) or Herald's Decree (slow +75%, +75% holy damage) |
| 20 | Branch | A1: **Final Messenger** — resonance 5 = AoE sound blast / A2: **Divine Voice** — abilities 50% CD / B1: **Herald's Vigor** — 20% lifesteal, heal on silence / B2: **Holy Resonance** — resonance heals 10% per stack |
| 25 | Ultimate Enhance | Gabriel Ascension gains: +1s stun or 3x damage |
| 30 | Divine | A1: **Voice of God** — permanent resonance, 3x ability damage / A2: **Eternal Herald** — abilities free, all stun 1s / B1: **Immortal Herald** — 25% lifesteal, immune 3s / B2: **Resonance Eternal** — all damage heals 20%, cleanse on hit |

### Raphael — Archer
**Base Weapon:** Seraph Light-Bow "Sanctuary" + Compass-Staff "Healer's Compass"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Sanctuary — seraph light-bow, holy arrows, sanctify stacks |
| 5 | Path Choice | **A) Healer's Bow** — +25% arrow damage, sanctify 2x / **B) Seraph Guardian** — 20% lifesteal, sanctify heals 8% |
| 10 | Ascension | A: Bow glows with pure white-gold light / B: Seraph aura, heal on every sanctify stack |
| 15 | Ability Enhance | Choose: Sanctuary Volley (+2s, 2x disable) or Healing Shot (self-heal 30%, 2x damage) |
| 20 | Branch | A1: **Holy Rain** — every 5th arrow 3x + rain / A2: **Sanctify Lord** — 5 stacks = AoE holy blast / B1: **Seraph's Grace** — 30% lifesteal, immune to CC 2s / B2: **Healing Arrow** — every arrow heals 10%, sanctify = cleanse |
| 25 | Ultimate Enhance | Raphael Ascension gains: +2s healing arrows or 75% damage to self-heal |
| 30 | Divine | A1: **Archangel's Bow** — every arrow 3x + holy rain / A2: **Sanctify Eternal** — all enemies sanctified, 3x / B1: **Immortal Seraph** — 35% lifesteal, death revives 40% / B2: **Healing God** — permanent 20%/s self-heal, all damage heals 25% |

### Jophiel — Assassin
**Base Weapon:** Twin Radiance-Blades "Beauty's Edge" + Veil of Living Flame

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Beauty's Edge — twin light-blades, radiance-marks |
| 5 | Path Choice | **A) Radiant Killer** — +40% crit damage, 2x radiance-marks / **B) Light Guardian** — 15% lifesteal, marks heal 8% |
| 10 | Ascension | A: Blades radiate blinding light / B: Flame aura, heal on mark detonation |
| 15 | Ability Enhance | Choose: Beauty Takedown (+1s, 3x attack speed) or Radiance Flash (blind +2s, 4x backstab) |
| 20 | Branch | A1: **Radiance Storm** — every 4th attack 3x + AoE / A2: **Isolation Killer** — 4x vs isolated / B1: **Light's Vitality** — 25% lifesteal, blind heals 10% / B2: **Radiant Life** — marks heal 15%, teleport heals 10% |
| 25 | Ultimate Enhance | Jophiel Ascension gains: +2s teleport or 4x vs isolated |
| 30 | Divine | A1: **Beauty Incarnate** — every 3rd attack 3x + AoE blast / A2: **Radiance God** — isolated enemies 4x permanent / B1: **Eternal Radiance** — 30% lifesteal, immune in light / B2: **Light Immortal** — death revives 40%, heal 20%/s |

---

## Infernal Dominion Faction

### Asmodeus — Warrior
**Base Weapon:** Barbed Execution Glaive "Hellfire's Verdict" + Ember Contract Hooks

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Hellfire's Verdict — execution glaive, burn stacks |
| 5 | Path Choice | **A) Demon Lord** — +30% glaive damage, 4th hit burn explosion / **B) Infernal Guardian** — 15% lifesteal, burn heals 5% |
| 10 | Ascension | A: Glaive burns with hellfire / B: Lava aura, heal on burn |
| 15 | Ability Enhance | Choose: Infernal Throne (+2s lava, +50% armor) or Chain Lord (pull +stun 2s, 2x damage on arrival) |
| 20 | Branch | A1: **Hellfire Executioner** — every 5th hit 3x + burn all / A2: **Throne of Ash** — burn stacks explode at 5 / B1: **Infernal Vigor** — 25% lifesteal, armor +60% / B2: **Chain Master** — pull 2 enemies, heal 15% per pull |
| 25 | Ultimate Enhance | Asmodeus Ascension gains: +2s immune or 3x burn damage |
| 30 | Divine | A1: **King of Hellfire** — every 3rd hit 3x + lava explosion / A2: **Eternal Throne** — permanent lava, 2x all / B1: **Immortal Demon** — immune 3s, 25% lifesteal / B2: **Chain Sovereign** — pull all, heal 25%, stun 2s |

### Lucifer — Caster
**Base Weapon:** Morningstar Scepter "Light-Bearer" + Black-Star Spell-Shield "Fallen Aegis"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Light-Bearer — morningstar scepter, fallen light beams, fall-marks |
| 5 | Path Choice | **A) Morning Star** — +25% ability damage, fall-marks 2x / **B) Fallen Guardian** — 15% lifesteal, fall-marks heal 8% |
| 10 | Ascension | A: Scepter burns with dark-gold light / B: Fallen aura, shield of black star energy |
| 15 | Ability Enhance | Choose: Morning Star (meteor +2s, 2x trap) or Pact of Flame (sacrifice 5% HP, 3x AoE) |
| 20 | Branch | A1: **Light-Bearer Eternal** — fall-marks infinite, explode at 5 / A2: **Fallen Star** — abilities 50% CD / B1: **Dark Pact** — 25% lifesteal, pact heals instead of costs / B2: **Fallen Grace** — fall-marks heal 15%, cleanse on hit |
| 25 | Ultimate Enhance | Lucifer Ascension gains: +2s burn or 3x fallen light |
| 30 | Divine | A1: **King of Fall** — permanent fallen light, 3x all abilities / A2: **Light-Bearer God** — all attacks beam, 2x / B1: **Immortal Fallen** — 30% lifesteal, pact = heal / B2: **Eternal Morningstar** — death revives 40%, heal 20%/s |

### Lilith — Archer
**Base Weapon:** Shadow-Moon Greatbow "Night's Whisper" + Obsidian Mirror-Dagger "Dark Reflection"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Night's Whisper — shadow-moon greatbow, night arrows, seduction-marks |
| 5 | Path Choice | **A) Mother of Night** — +30% arrow damage, 2x seduction-marks / **B) Shadow Queen** — 15% lifesteal, seduction-marks heal 8% |
| 10 | Ascension | A: Bow drips shadow energy / B: Shadow aura, heal on charm |
| 15 | Ability Enhance | Choose: Garden of Night (charm +2s, 2x in zone) or Moon-Thorn Trap (root +stun 1s, drain 15%) |
| 20 | Branch | A1: **Night Storm** — every 5th arrow 3x + pierce all / A2: **Seduction Lord** — charmed enemies 3x / B1: **Shadow Vigor** — 25% lifesteal, charm heals 10%/s / B2: **Night's Embrace** — root heals 20%, immune 1s |
| 25 | Ultimate Enhance | Lilith Ascension gains: +2s mind control or 3x damage |
| 30 | Divine | A1: **Queen of Night** — every arrow 3x + shadow swarm / A2: **Mother of Demons** — all enemies charmed, 3x / B1: **Immortal Shadow** — death revives 30%, 25% lifesteal / B2: **Night Goddess** — charm all, heal 25%, immune 3s |

### Naamah — Assassin
**Base Weapon:** Song-Chain Harp-Blade "Velvet Song" + Blood-Wax Seal Fan "Crimson Pact"

| Level | Unlock | Description |
|-------|---------|-------------|
| 1 | Base | Velvet Song — harp-blade, pleasure-marks |
| 5 | Path Choice | **A) Velvet Killer** — +40% damage, 2x pleasure-marks / **B) Seductress Guardian** — 15% lifesteal, pleasure-marks heal 8% |
| 10 | Ascension | A: Blade sings with dark melody / B: Crimson aura, heal on mark |
| 15 | Ability Enhance | Choose: Whispering Death (stealth +1s, execute below 35%) or Song of Seduction (charm +1s, 2x damage charmed) |
| 20 | Branch | A1: **Song of Death** — every 4th attack 3x + AoE / A2: **Pleasure Storm** — 3 marks = charm AoE / B1: **Velvet Vigor** — 25% lifesteal, charm heals 10% / B2: **Crimson Life** — marks heal 15%, stealth heals 10%/s |
| 25 | Ultimate Enhance | Naamah Ascension gains: +1s untargetable or 4x vs charmed |
| 30 | Divine | A1: **Song Mistress** — every 3rd attack 3x + charm / A2: **Pleasure Eternal** — all enemies charmed, 3x / B1: **Immortal Seductress** — 30% lifesteal, death revives 40% / B2: **Crimson Goddess** — permanent stealth, heal 20%/s |

---

## Skill Tree Summary

**Every deity has 4 build paths** (2 paths × 2 branches = 4 possible builds):

| Path Type | Focus | Playstyle |
|-----------|-------|-----------|
| Path A | Aggressive/Damage | Higher burst, faster kills, glass cannon |
| Path B | Defensive/Sustain | Lifesteal, shields, survival, attrition |
| Branch 1 | Enhance Path A/B | Double down on chosen path |
| Branch 2 | Hybrid/Special | Add utility or special mechanics |

### Key Balance Points
- Path A builds deal more damage but are squishier
- Path B builds survive longer but kill slower
- Level 30 Divine forms are equally powerful regardless of path
- All paths include lifesteal or self-heal for solo viability
- No team mechanics — everything is self-sustained

**Total build combinations:** 28 deities × 4 paths = **112 unique builds**
