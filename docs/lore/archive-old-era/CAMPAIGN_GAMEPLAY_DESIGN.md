# Campaign Gameplay Design — Mythos Gates: Ascension

**Version:** 1.0.0  
**Locked:** Aug 31, 2026  
**Design:** Campaigns that test deity abilities, role mechanics, and weapon skill tree builds  

---

## Design Philosophy

Campaigns aren't just story — they're **gameplay tests**. Each mission should make you use your deity's abilities in a way that feels meaningful. The campaign teaches you your deity's kit, challenges you to master it, and rewards you for using it well.

### Core Principles
1. **Every mission uses a role mechanic** — Warriors block, Casters combo, Archers mark, Assassins execute
2. **Bosses test specific abilities** — each boss is designed to counter one playstyle and reward another
3. **Difficulty scales with your build** — enemies adapt to your weapon path and faction buff
4. **Each faction's campaign feels different** — because each faction's buff changes how you play

---

## Mission Design Framework

### Mission Objectives by Role

Each mission has a primary objective that naturally leverages the role's unique mechanics:

| Role | Objective Types | Why It Works |
|------|----------------|--------------|
| Warrior | Hold the Line, Survive X seconds, Protect the Shrine | Warriors excel at absorbing damage and controlling space |
| Caster | Clear All Enemies, Chain Combos, Destroy Structures | Casters excel at AoE and terrain manipulation |
| Archer | Hunt the Target, Kill Before Escape, Mark & Detonate | Archers excel at precision and sustained DPS |
| Assassin | Kill Before Timer, Stealth Infiltration, Execute All | Assassins excel at burst and speed kills |

### Mission Modifiers (Per Difficulty Tier)

| Tier | Modifier | Effect on Gameplay |
|------|----------|-------------------|
| 1 — Gate Breath | None | Learn your deity's kit at base difficulty |
| 2 — Gate Echo | +25% HP/damage | Test your weapon path choices |
| 3 — Gate Strain | +50% HP/damage, new enemies | Forces faction buff optimization |
| 4 — Gate Collapse | +75% HP/damage, boss phases | Tests full build synergy |
| 5 — Gate Failure | +100% HP/damage, death penalty | Ultimate test — Level 30 builds only |

---

## 19-Chapter Campaign Structure

### ACT I — The First Reopening (Ch 1-6)
**Factions:** Aten Ra, Asgardian, Olympian  
**Tone:** Discovery — the Gate is open, the Hollow are coming, learn your power

#### Chapter 1 — Gate Fracture (Tutorial)
- **Location:** Nile Delta (Aten Ra territory)
- **Story:** The Mythos Gate cracks open. Hollow creatures pour through. Your deity's avatar is projected for the first time.
- **Gameplay:** Tutorial mission — learn basic attacks, movement, and one ability
- **Role Integration:** Each role gets a different tutorial:
  - Warrior: Learn to block and counter (timed block tutorial)
  - Caster: Learn to cast zones and chain abilities (zone placement tutorial)
  - Archer: Learn to kite and stack marks (shoot-move tutorial)
  - Assassin: Learn to stealth and backstab (positioning tutorial)
- **Enemies:** 3-5 Hollow Drifters (basic melee, low HP)
- **Boss:** None — tutorial ends with a lore reveal
- **Deity Specifics:**
  - Aten Ra: Practice Sun-Scale Decree zone — learn to control space
  - Thor: Practice Storm Hammer throw — learn ranged melee
  - Athena: Practice Phalanx Formation — learn shield wall
  - Amaterasu: Practice Mirror Flash — learn blind + reposition
  - Dagda: Practice Harp of Seasons — learn zone cycling
  - Michael: Practice Divine Verdict — learn bind + strike
  - Asmodeus: Practice Infernal Throne — learn lava zone

#### Chapter 2 — First Blood
- **Location:** Desert Necropolis
- **Story:** Hollow have entrenched in ancient tombs. Clear them out.
- **Gameplay:** First real combat — 5-7 rooms, 1 mini-boss
- **Role Integration:**
  - Warrior: Hold a corridor against waves (block practice)
  - Caster: Clear rooms with AoE (zone placement)
  - Archer: Kill marked targets before they escape (mark + detonate)
  - Assassin: Stealth past patrols, assassinate elite (stealth + execute)
- **Boss:** Hollow Husk — a consumed Egyptian guardian
  - Warrior counter: Boss charges — block to stun, counter with heavy combo
  - Caster counter: Boss summons adds — AoE clear, then focus boss
  - Archer counter: Boss shields — stack marks on shield, detonate to break
  - Assassin counter: Boss telegraphs — dodge, backstab during recovery frames
- **Deity Specifics:**
  - Sutekh (if unlocked): Desert Storm Form covers the tomb in sand — synergy with environment
  - Odin (if unlocked): Rune-marks stack on tomb guardians — bonus damage
  - Zeus: Chain Lightning bounces between sarcophagi — multi-hit combo

#### Chapter 3 — Aten Ra Faction Unlock
- **Location:** Temple Complex
- **Story:** The Aten Ra faction deities unlock. The solar judgment system must be restored.
- **Gameplay:** 3 deity-specific challenges that teach each Aten Ra deity's kit:
  - **Sutekh Challenge:** Sand storm form — clear 3 rooms while maintaining storm form (teaches resource management)
  - **Iset Challenge:** Mark and heal — kill 5 marked targets while keeping HP above 50% (teaches lifesteal kiting)
  - **Amunet Challenge:** Shadow infiltration — stealth through a patrol zone, assassinate the elite (teaches stealth + execute)
- **Enemies:** Solar Judges (counter-attackers), Uraeus Serpents (poison), Khepri Scarabs (swarmers)
- **Boss:** Misweighed Judge — a Hollow-corrupted Egyptian judge
  - Phase 1: Scales attack — heavy melee, must block/dodge
  - Phase 2: Summons scarab swarm — AoE required
  - Phase 3: Judgment beam — must interrupt with CC or out-heal with lifesteal
- **Faction Buff Test:** Solar Edict stacks build naturally in this prolonged fight — teaches the player how damage escalation works

#### Chapter 4 — Asgardian Faction Unlock
- **Location:** Storm-carved Oathground (ancient Norse territory on Earth)
- **Story:** The Asgardian deities unlock. The World-Tree's roots are bleeding.
- **Gameplay:** 3 deity-specific challenges:
  - **Odin Challenge:** Rune-marks on 5 enemies, then detonate all simultaneously (teaches mark management)
  - **Skadi Challenge:** Freeze 3 enemies, then kill all while frozen (teaches freeze stacking)
  - **Freyja Challenge:** Battle-fate storm — maintain max attack speed for 10 seconds while killing (teaches snowball)
- **Enemies:** Frost Wraiths (ice attacks), Berserkers (high damage, telegraphed), Ravens (flying scouts)
- **Boss:** The Oathbreaker — a Hollow-corrupted Norse warrior
  - Phase 1: Heavy hammer strikes — must block or dodge (Warrior advantage)
  - Phase 2: Summons frost wraiths — AoE clear needed (Caster advantage)
  - Phase 3: Enrages, charges blindly — dodge and backstab (Assassin advantage)
  - Phase 4: Shield phase — must stack marks and detonate to break (Archer advantage)
- **Faction Buff Test:** Rune Oath builds from taking hits — teaches players that Asgardian deities WANT to get hit

#### Chapter 5 — Olympian Faction Unlock
- **Location:** Laurel-Sky Citadel (ancient Greek territory on Earth)
- **Story:** The Olympian deities unlock. The oracle has gone silent.
- **Gameplay:** 3 deity-specific challenges:
  - **Zeus Challenge:** Chain lightning through 5 connected enemies (teaches chaining)
  - **Artemis Challenge:** Hunt a fleeing target across 3 rooms (teaches kiting pursuit)
  - **Ares Challenge:** Build max rage and execute 3 enemies in 10 seconds (teaches burst + execute)
- **Enemies:** Hoplite Phantoms (shielded), Harpies (flying), Gorgon Echoes (petrification gaze)
- **Boss:** The Oracle's Silence — a Hollow-corrupted Greek oracle
  - Phase 1: Silence field — abilities disabled, must use basic attacks only
  - Phase 2: Petrification gaze — must dodge or be stunned
  - Phase 3: Summons pillars — must use terrain to LoS the gaze
  - Phase 4: Oracle's lament — AoE damage everywhere, must out-heal or out-burst
- **Faction Buff Test:** Divine Favor builds from hitting enemies — teaches consistent aggression

#### Chapter 6 — Act I Boss
- **Location:** The Great Pyramid (Aten Ra territory)
- **Story:** A massive Hollow entity has nested in the Great Pyramid. All three Act I factions must be defeated to reach it.
- **Gameplay:** Multi-phase boss fight — tests everything learned in Act I
- **Boss:** The Gatekeeper — a Hollow entity that absorbs the power of defeated Gate fragments
  - Phase 1 — Solar: Uses Aten Ra-style attacks (solar beams, judgment zones) — counter with blocking/dodging
  - Phase 2 — Storm: Uses Asgardian-style attacks (lightning, frost) — counter with AoE/marks
  - Phase 3 — Divine: Uses Olympian-style attacks (chain lightning, petrification) — counter with burst/execute
  - Phase 4 — Fusion: Combines all three — must use full ability kit + faction buff + weapon path
- **Reward:** 200 Gate Shards + lore reveal about the Hollow's origin
- **Role Check:** Each phase favors a different role — but since you're solo, you must adapt your playstyle

---

### ACT II — Deeper Descent (Ch 7-13)
**Factions:** Tuatha, Kami, Empyrean  
**Tone:** Escalation — the Hollow are adapting, the war is expanding, new powers needed

#### Chapter 7 — Tuatha Faction Unlock
- **Location:** Sídhe-Root Crossings (ancient Celtic territory on Earth)
- **Story:** The Tuatha de Danann deities unlock. The fae roads are bleeding time.
- **Gameplay:** 3 deity-specific challenges:
  - **Brigid Challenge:** Maintain burn stacks on 3 enemies simultaneously for 15 seconds (teaches multi-target DoT)
  - **Morrígan Challenge:** Death-mark 5 enemies, then execute all within 5 seconds (teaches chain execution)
  - **Lugh Challenge:** Hit 10 enemies in one Long Arm zone (teaches AoE ability usage)
- **Enemies:** Fae Wraiths (teleport), Bog Beasts (tanky), Will-o'-Wisps (swarm, fast)
- **Boss:** The Time-Eater — a Hollow entity that slows time
  - Phase 1: Time slow field — your movement is slowed, must use ranged abilities
  - Phase 2: Summons fae echoes — they teleport, must use marks to track
  - Phase 3: Rewind — boss heals HP, must out-damage the heal
  - Phase 4: Time stop — 3-second windows where only you can move — burst damage opportunities
- **Faction Buff Test:** Geas Bloom builds from kills — teaches snowball momentum (time stop windows = kill chains)

#### Chapter 8 — Wild Hunt
- **Location:** Ancient Forest
- **Story:** A Hollow-possessed beast horde threatens Celtic lands.
- **Gameplay:** Wave survival — 10 waves of increasing difficulty
- **Role Integration:**
  - Warrior: Tank waves at choke points (block + zone)
  - Caster: AoE clear waves (zone + chain)
  - Archer: Kite and thin waves from range (mark + pierce)
  - Assassin: Burst down wave leaders (stealth + execute)
- **Boss:** The Horned Shadow — a Hollow-possessed divine stag
  - Charges across the arena — must dodge or block
  - Summons wolf adds — must clear or be overwhelmed
  - Enrages at 30% — speed kill required (Assassin execute window)
- **Weapon Path Test:** This mission explicitly tests both paths:
  - Path A: Can you burst down the boss before enrage?
  - Path B: Can you survive the enrage through sustain?

#### Chapter 9 — Kami Faction Unlock
- **Location:** Torii-Moon Mirror Road (ancient Japan on Earth)
- **Story:** The Kami deities unlock. The shrine gates are distorting.
- **Gameplay:** 3 deity-specific challenges:
  - **Tsukuyomi Challenge:** Silence 5 enemies in one Crescent Domain, then kill all (teaches CC + follow-up)
  - **Susanoo Challenge:** Knockback 5 enemies off a cliff edge with wind-slash (teaches positioning + push)
  - **Izanami Challenge:** Stealth through a shrine, death-mark 3 enemies, execute all (teaches infiltration + execute)
- **Enemies:** Oni Echoes (heavy melee), Yurei (floating, phase through walls), Kitsune (illusion, teleport)
- **Boss:** The Mirror-Self — a Hollow that copies your deity's abilities
  - Phase 1: Uses YOUR abilities against you — must dodge your own kit
  - Phase 2: Creates mirror clones — must identify the real one (marks help)
  - Phase 3: Steals your faction buff — you fight without it temporarily
  - Phase 4: Mirror shatters — shards deal AoE, boss is vulnerable
- **Faction Buff Test:** Spirit Seal builds from dodging — this boss FORCES you to dodge (your own abilities)

#### Chapter 10 — Spirit Realm Breach
- **Location:** Ancient Shrine Complex
- **Story:** The boundary between spirit and physical worlds is collapsing.
- **Gameplay:** Dual-realm mission — enemies phase between visible and invisible
- **Role Integration:**
  - Warrior: Block phased attacks (enemies appear/disappear)
  - Caster: Zone the battlefield — zones hit enemies even when phased
  - Archer: Mark phased enemies — marks track through phase shifts
  - Assassin: Stealth to match enemy phasing — fight on their terms
- **Boss:** The Phase Wraith — exists in both realms simultaneously
  - Must hit it in both realms within 2 seconds or it heals
  - Archer marks + Assassin teleport are most effective
  - Caster zones cover both realms
  - Warrior must bait it into physical realm to block-and-counter

#### Chapter 11 — Empyrean Faction Unlock
- **Location:** Choir-Vault Discord (ancient Mesopotamian temple on Earth)
- **Story:** The Empyrean deities unlock. The celestial choir has gone discordant.
- **Gameplay:** 3 deity-specific challenges:
  - **Gabriel Challenge:** Silence 3 enemies, then hit all with one ability (teaches CC + AoE combo)
  - **Raphael Challenge:** Self-heal to 100% while fighting (teaches sustain during combat)
  - **Jophiel Challenge:** Isolate 3 enemies and kill each with 4x backstab (teaches isolation + burst)
- **Enemies:** Fallen Cherubim (flying, holy damage), Discordant Hymns (AoE sound waves), Void Seraphim (anti-light)
- **Boss:** The Dissonance — a Hollow-corrupted angelic entity
  - Phase 1: Sound wave AoE — must dodge or block
  - Phase 2: Silence field — no abilities, basic attacks only
  - Phase 3: Holy barrier — must stack sanctify marks to break
  - Phase 4: Choir resonance — boss heals, must out-damage or use CC to interrupt
- **Faction Buff Test:** Choir Resonance builds from ability use — teaches the rhythm of weaving abilities

#### Chapter 12 — The Holy Fall
- **Location:** Crumbled Ziggurat
- **Story:** An Empyrean deity has fallen to the Hollow. Must be saved or put down.
- **Gameplay:** Escort-style mission — protect a weakened NPC while fighting through Hollow
- **Role Integration:**
  - Warrior: Body-block enemies from reaching NPC (zone control)
  - Caster: CC enemies before they reach NPC (stun/silence/freeze)
  - Archer: Kill priority targets from range (mark + snipe)
  - Assassin: Stealth-scout ahead, eliminate threats before NPC arrives
- **Boss:** The Fallen Seraph — a Hollow-corrupted Empyrean warrior
  - Flies above melee range — Archers and Casters have advantage
  - Dive-bombs — Warriors must block, Assassins must dodge
  - Holy ground zones — Empyrean faction buff advantage here
- **Weapon Path Test:**
  - Path A: Kill the boss fast before NPC dies
  - Path B: Sustain through the fight, keep NPC alive with your presence

#### Chapter 13 — Act II Boss
- **Location:** Earth — Hollow Corridor (neutral territory)
- **Story:** The first World Boss appears. All Act II factions are needed to understand the threat.
- **Gameplay:** Multi-phase World Boss — the Hollow have evolved
- **Boss:** The Consumer — a massive Hollow entity that devours abilities
  - Phase 1: Devours your Ability 1 — fight with only basic + ability 2 + ultimate
  - Phase 2: Devours your Ability 2 — fight with only basic + ultimate
  - Phase 3: Devours your faction buff — fight without it
  - Phase 4: Regurgitates all — uses your own abilities + buff against you
  - Phase 5: Final stand — everything restored, all-out burst
- **Reward:** 300 Gate Shards + Earth dungeons unlock
- **Design Note:** This boss tests your MASTERY — can you fight without your crutches?

---

### ACT III — The Black Iron Bargain (Ch 14-19)
**Factions:** Infernal Dominion  
**Tone:** Desperation — the Hollow are winning, the only allies left are the ones you shouldn't trust

#### Chapter 14 — Infernal Dominion Faction Unlock
- **Location:** Black-Iron Debt Court (ancient underworld territory on Earth)
- **Story:** The Infernal Dominion deities unlock. The contracts are binding.
- **Gameplay:** 3 deity-specific challenges:
  - **Lucifer Challenge:** Sacrifice 5% HP for 3x damage, kill 3 enemies before buff ends (teaches risk-reward)
  - **Lilith Challenge:** Charm 3 enemies, then kill them while charmed (teaches CC + follow-up)
  - **Naamah Challenge:** Stealth, charm, execute — kill 3 enemies in 10 seconds (teaches combo chain)
- **Enemies:** Contract Bound (high armor, must break with abilities), Sin Eaters (heal from your damage), Void Lawyers (CC immune)
- **Boss:** The Debt Collector — a Hollow entity that demands payment
  - Phase 1: Debt mechanic — every hit you take adds "debt" — at 100% debt, you lose abilities for 5s
  - Phase 2: Collects your buff stacks — must rebuild quickly
  - Phase 3: Offers a "bargain" — take 50% HP damage for 3x damage (Infernal theme)
  - Phase 4: Final demand — enrage, must kill before debt fills
- **Faction Buff Test:** Blood Contract builds from taking damage — this boss REWARDS taking hits

#### Chapter 15 — The Bargain
- **Location:** Contract-Scorched Court
- **Story:** The Infernal deities offer a pact: their power for a price. The player must decide.
- **Gameplay:** Choice-based mission — 2 paths:
  - **Path of Power (Aggressive):** Sacrifice HP for damage buffs — harder but faster
  - **Path of Resistance (Defensive):** Fight without the pact — slower but safer
- **Role Integration:**
  - Warrior: Path of Power = sacrifice armor for damage, Path of Resistance = normal tanking
  - Caster: Path of Power = sacrifice HP for ability spam, Path of Resistance = normal cooldowns
  - Archer: Path of Power = sacrifice range for burst, Path of Resistance = normal kiting
  - Assassin: Path of Power = sacrifice stealth for 4x burst, Path of Resistance = normal stealth
- **Boss:** The Pact-Breaker — tests your chosen path
  - Path of Power: Boss is a DPS check — can you kill it before your sacrifice kills you?
  - Path of Resistance: Boss is an endurance test — can you outlast it without the power buff?
- **Weapon Path Synergy:** This mission explicitly connects to the weapon skill tree:
  - Path A (Aggressive) players should choose Path of Power
  - Path B (Defensive) players should choose Path of Resistance

#### Chapter 16 — The Hollowed Pantheon
- **Location:** Earth — Multiple Gate Nexus Points
- **Story:** The Hollow have consumed multiple deities from other factions. Their powers are being used against you.
- **Gameplay:** Boss rush — fight 3 Hollow-corrupted deity echoes
- **Boss 1:** Hollow Aten Ra Echo — uses solar judgment against you
  - Counter: Your faction buff overrides the Hollow version
- **Boss 2:** Hollow Odin Echo — uses rune-marks against you
  - Counter: Your weapon path ability out-damages the echo
- **Boss 3:** Hollow Amaterasu Echo — uses mirror blind against you
  - Counter: Your role mechanic (block/combo/mark/execute) breaks the mirror
- **Design Note:** This mission tests EVERYTHING — your role, your weapon path, your faction buff, and your ability kit

#### Chapter 17 — The Last Gate
- **Location:** The Mythos Gate — Center of Earth
- **Story:** The source of the Hollow invasion. The Gate itself must be closed.
- **Gameplay:** The longest mission in the game — 15+ rooms, no checkpoints
- **Role Integration:**
  - Warrior: Endurance test — survive 15 rooms of combat
  - Caster: Efficiency test — manage cooldowns across 15 rooms
  - Archer: Sustain test — maintain marks and DPS across 15 rooms
  - Assassin: Reset test — chain kills to reset cooldowns across 15 rooms
- **Mini-Bosses:** 4 Hollow champions, one testing each role mechanic
- **Faction Buff Test:** Your buff must carry you — stack management is critical over 15 rooms

#### Chapter 18 — The Black Iron Bargain
- **Location:** The Throne of Contracts
- **Story:** The Hollow's leader offers a final bargain: close the Gate and lose your divine power, or keep your power and let the Hollow consume Earth.
- **Gameplay:** Two-ending mission — your choice affects the ending:
  - **Seal the Gate:** Sacrifice your deity's power — cinematic ending, lose all abilities, start New Game+
  - **Keep the Power:** Fight the Hollow leader at full power — harder fight, different ending
- **Boss (if you fight):** The Hollow King — the ultimate test
  - Phase 1: Uses all 7 faction buff mechanics against you
  - Phase 2: Uses all 4 role mechanics against you
  - Phase 3: Uses your own weapon path abilities against you
  - Phase 4: Final phase — pure stat check, no gimmicks, just you vs the Hollow King
- **Reward:** Ending-specific cosmetic + 500 Gate Shards + New Game+ unlock

#### Chapter 19 — Epilogue: The Reopened Gate
- **Location:** The Crossroads (Hub)
- **Story:** After the final battle, the Gate reopens — but differently. New threats emerge.
- **Gameplay:** Post-game content unlock:
  - Earth dungeons unlock (all factions, neutral territory)
  - Realm Raids unlock (faction-specific limited-time events)
  - World Bosses unlock (server-wide encounters)
  - Daily and Weekly challenges unlock
  - New Game+ unlocks (if you sealed the Gate)
- **No Boss:** This is a narrative chapter that sets up endgame content

---

## Boss Design Philosophy

### Every Boss Tests Something Specific

| Boss | Primary Test | Role Advantage | Role Disadvantage |
|------|-------------|----------------|-------------------|
| Hollow Husk (Ch2) | Basic combat fundamentals | None (tutorial-level) | None |
| Misweighed Judge (Ch3) | Faction buff usage | Aten Ra (Solar Edict scales with fight) | Kami (dodge doesn't help vs beam) |
| The Oathbreaker (Ch4) | All 4 role mechanics | Each phase favors a different role | Each role struggles in one phase |
| The Oracle's Silence (Ch5) | Adapting without abilities | Assassin (basic attack burst) | Caster (silence removes their kit) |
| The Gatekeeper (Ch6) | Full kit mastery | None — must adapt | All — each phase counters one approach |
| The Time-Eater (Ch7) | Snowball momentum | Tuatha (kill = heal + CD reset) | Caster (slow field ruins positioning) |
| The Horned Shadow (Ch8) | Burst vs sustain | Path A (burst before enrage) | Path B (survive enrage) |
| The Mirror-Self (Ch9) | Dodging your own kit | Kami (dodge = buff stacks) | Warrior (can't block your own abilities) |
| The Phase Wraith (Ch10) | Dual-realm combat | Archer (marks track through phase) | Warrior (must bait to physical) |
| The Dissonance (Ch11) | Ability rhythm | Empyrean (Choir builds from abilities) | Assassin (silence ruins burst) |
| The Fallen Seraph (Ch12) | Escort protection | Warrior (body-block) | Caster (boss flies out of range) |
| The Consumer (Ch13) | Fighting without crutches | All equally tested | All equally disadvantaged |
| The Debt Collector (Ch14) | Risk-reward | Infernal (taking damage = buff) | Olympian (free CDs don't help vs debt) |
| The Pact-Breaker (Ch15) | Path choice validation | Path matches choice | Path conflicts with choice |
| Hollow Pantheon (Ch16) | Everything at once | None — full mastery required | None — full mastery required |
| The Last Gate (Ch17) | Marathon endurance | Warrior (tankiest) | Assassin (squishiest, needs resets) |
| The Hollow King (Ch18) | Ultimate test | None | None — pure skill check |

---

## Deity-Specific Campaign Moments

Each deity should have at least one campaign moment where their unique abilities shine:

### Aten Ra Deities
- **Aten Ra:** Ch6 Gatekeeper Phase 1 — Solar Edict at 5 stacks melts the solar phase
- **Sutekh:** Ch7 Time-Eater — Desert Storm Form ignores time slow (sand operates outside time)
- **Iset:** Ch12 Fallen Seraph — Throne Sovereignty self-heal keeps you alive through dive-bombs
- **Amunet:** Ch10 Phase Wraith — Veil of the Hidden lets you match the wraith's phasing

### Asgardian Deities
- **Thor:** Ch4 Oathbreaker — Storm Hammer stuns the charging boss, opening counter windows
- **Odin:** Ch9 Mirror-Self — Raven's Sight reveals the real boss among mirror clones
- **Skadi:** Ch8 Horned Shadow — Freeze stacks stop the charging boss dead
- **Freyja:** Ch16 Hollow Pantheon — Battle-Fate Storm at max stacks executes the echo

### Olympian Deities
- **Athena:** Ch4 Oathbreaker — Phalanx Formation blocks the hammer, Aegis reflects damage
- **Zeus:** Ch5 Oracle's Silence — Chain Lightning jumps through silenced enemies (they can't dodge)
- **Artemis:** Ch10 Phase Wraith — Huntress Moon marks track through phase shifts
- **Ares:** Ch8 Horned Shadow — War Frenzy at max rage executes the boss before enrage

### Kami Deities
- **Amaterasu:** Ch11 Dissonance — Sacred Light Field + Mirror Flash blinds the boss, creating openings
- **Tsukuyomi:** Ch9 Mirror-Self — Crescent Domain silences the mirror's ability copies
- **Susanoo:** Ch10 Phase Wraith — Hurricane Slash knocks the wraith into physical realm
- **Izanami:** Ch14 Debt Collector — Death-mark stacks bypass the debt mechanic (marks = guaranteed damage)

### Tuatha Deities
- **Dagda:** Ch17 Last Gate — Cauldron's Bounty self-heal sustains across all 15 rooms
- **Brigid:** Ch7 Time-Eater — Sacred Flame burn ticks continue during time slow (fire is eternal)
- **Morrígan:** Ch16 Hollow Pantheon — Battle Crow Form flies over the echo's ground attacks
- **Lugh:** Ch12 Fallen Seraph — Long Arm hits the flying boss from the ground

### Empyrean Deities
- **Michael:** Ch12 Fallen Seraph — Wings of Justice leap reaches the flying boss
- **Gabriel:** Ch11 Dissonance — Divine Message silence counters the boss's sound waves
- **Raphael:** Ch17 Last Gate — Healing Shot self-heal sustains the 15-room marathon
- **Jophiel:** Ch14 Debt Collector — Radiance Flash 4x backstab bypasses debt (burst before debt fills)

### Infernal Deities
- **Asmodeus:** Ch6 Gatekeeper — Infernal Throne lava zones persist through all phase transitions
- **Lucifer:** Ch18 Hollow King — Pact of Flame sacrifice deals 3x to the final phase
- **Lilith:** Ch10 Phase Wraith — Moon-Thorn Trap roots the wraith in physical realm
- **Naamah:** Ch16 Hollow Pantheon — Whispering Death stealth + execute one-shots the echo

---

## Campaign-Diode Synergy Checklist

| System | How Campaigns Use It |
|--------|---------------------|
| Role Identity | Each chapter has role-specific objectives and challenges |
| Ability Kits | Deity-specific challenges in faction unlock chapters teach each ability |
| Weapon Skill Tree | Bosses test Path A (burst) vs Path B (sustain) — Ch8, Ch15 explicitly |
| Faction Buffs | Each faction unlock chapter tests the faction buff mechanic |
| Leveling System | Difficulty tiers 1-5 scale with level — Tier 5 requires Level 30 |
| Deity Unlock System | Campaign chapters directly unlock deities (Ch3, 4, 5, 7, 9, 11, 14) |
| Faith Triggers | Each mission can trigger faith bonuses for extra Belief |
| Belief/Influence | Earned from every mission — spent on leveling and ability upgrades |
