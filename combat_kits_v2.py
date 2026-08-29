#!/usr/bin/env python3
"""
Mythos Gates: Ascension — Combat Kits for 28 Mythological Deities
Real-time action RPG combat with unique kits per deity
"""

import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))

# Faction resources and elements
FACTION_DATA = {
    "Aten Ra": {"element": "Solar", "domain": "Judgment", "resource": "Solar Charge"},
    "Asgardian": {"element": "Storm", "domain": "Oath", "resource": "Oath Fury"},
    "Olympian": {"element": "Thunder", "domain": "Glory", "resource": "Divine Glory"},
    "Kami": {"element": "Spirit", "domain": "Sacred", "resource": "Kami Energy"},
    "Tuatha": {"element": "Nature", "domain": "Wild", "resource": "Wild Growth"},
    "Empyrean": {"element": "Holy", "domain": "Order", "resource": "Holy Light"},
    "Infernal Dominion": {"element": "Shadow", "domain": "Chains", "resource": "Infernal Fury"},
}

COMBAT_KITS = {
    # ===== ATEN RA =====
    "Aten Ra": {
        "role": "Warrior",
        "basicAttack": "Solar Edge — 3-hit combo with was-sceptre blade. Each strike releases Aten hand-rays extending the hit arc into a frontal cone. Third hit plants a Ma'at judgment zone that slows enemies.",
        "ability1": {"name": "Pylon Bastion", "type": "Shield", "cd": 6, "energyCost": 30, "effect": "Raise pylon barriers on both sides, creating a fortified position. Enemies inside take Solar damage. 4s duration."},
        "ability2": {"name": "Ma'at Verdict", "type": "Crowd Control", "cd": 10, "energyCost": 40, "effect": "Emit a weighing-scale pulse. Heavier enemies are stunned, lighter ones slowed. Exposed enemies take 50% bonus damage for 3s."},
        "signature": {"name": "Sun-Scale Decree", "type": "Zone Control", "cd": 18, "energyCost": 70, "effect": "Plant the sceptre, creating a large Aten-lit judgment zone. Aten-Ra gains armor, enemies slowed, Solar damage amplified. 6s."},
        "ultimate": {"name": "Source Radiance", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Ascendant form 8s: body radiates blinding solar light. All attacks become AoE solar blasts, damage 2x, enemies in aura blinded and burned."},
        "passive": {"name": "Solar Edict", "effect": "Builds Solar Charge when blocking near judgment zones. At 3 stacks, next ability gains bonus damage. At 5 stacks, Signature empowered."},
    },
    "Sutekh": {
        "role": "Caster",
        "basicAttack": "Desert Storm — Fast dual blade strikes infused with storm-sand. Each hit applies a storm-stack. At 3 stacks, the enemy is knocked back and takes burst storm damage.",
        "ability1": {"name": "Sand Step", "type": "Mobility", "cd": 4, "energyCost": 20, "effect": "Dash through a sandstorm, becoming intangible for 0.5s. Enemies at the destination take storm damage and are knocked back."},
        "ability2": {"name": "Chaos Disruption", "type": "Debuff", "cd": 8, "energyCost": 35, "effect": "Release a chaos pulse that strips all enemy buffs and reverses their movement controls for 2s. Enemies take bonus storm damage while disoriented."},
        "signature": {"name": "Desert Storm Form", "type": "Empower", "cd": 16, "energyCost": 65, "effect": "Become a living sandstorm for 5s: immune to crowd control, movement speed +50%, every dash leaves a storm trail that damages enemies. Basic attacks become storm blasts hitting all in front."},
        "ultimate": {"name": "Red Lord Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Sutekh becomes the Storm Incarnate for 8s: his body IS the desert storm. All nearby enemies are continuously damaged, blinded, and pushed away. His attacks become massive storm-slash waves. He can teleport through any storm trail instantly."},
        "passive": {"name": "Necessary Violence", "effect": "Sutekh gains Solar Charge when he strips buffs or interrupts enemies. At 5 stacks, his next attack deals 3x damage and cannot be blocked."},
    },
    "Iset": {
        "role": "Archer",
        "basicAttack": "Throne Pulse — Iset fires restoration energy in a 3-hit combo. Each hit damages enemies and creates a small healing pulse for nearby allies. Third hit releases a wider pulse.",
        "ability1": {"name": "Throne Gate", "type": "Heal/Zone", "cd": 6, "energyCost": 25, "effect": "Open a throne-gate that creates a healing zone. Allies inside gain HP regen and cleanse. Enemies inside are slowed. 4s duration."},
        "ability2": {"name": "Restoration Tendrils", "type": "Heal/Damage", "cd": 9, "energyCost": 40, "effect": "Fire golden restoration tendrils at all nearby enemies. Damage dealt heals the lowest-HP ally for 100% of damage. Cleanses all debuffs on allies in range."},
        "signature": {"name": "Throne Sovereignty", "type": "Field Control", "cd": 18, "energyCost": 70, "effect": "Manifest the living throne — a large zone where allies gain 30% damage boost, continuous healing, and debuff immunity. Enemies inside are weakened and take 20% more damage. 6s."},
        "ultimate": {"name": "Isis Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Iset becomes the Throne Queen for 8s: her body radiates restoration energy. All allies on screen gain continuous healing. Her attacks become ranged throne-beams that damage enemies and heal allies simultaneously. She can revive one fallen ally."},
        "passive": {"name": "Reassembly", "effect": "Iset gains Solar Charge every time she heals or cleanses an ally. At 5 stacks, her next restoration tendrils hit all enemies on screen."},
    },
    "Amunet": {
        "role": "Assassin",
        "basicAttack": "Hidden Strike — Amunet fires void-shadow projectiles in a 3-shot burst. Each shot partially phases through reality, hitting enemies from an angle they can't predict. Third shot applies void-mark.",
        "ability1": {"name": "Conceal", "type": "Stealth", "cd": 5, "energyCost": 25, "effect": "Phase into the void for 3s, becoming invisible and untargetable. Next attack from stealth deals 3x damage and applies 3 void-marks."},
        "ability2": {"name": "Hidden Execution", "type": "Burst/Execute", "cd": 9, "energyCost": 40, "effect": "Detonate all void-marks on screen. Each mark explodes for damage. If the enemy is below 25% HP, the detonation executes them instantly."},
        "signature": {"name": "Veil of the Hidden One", "type": "Field Control", "cd": 16, "energyCost": 65, "effect": "Create a large veil of concealment. Allies inside gain invisibility. Enemies inside are confused (controls reversed) and take continuous void damage. 5s."},
        "ultimate": {"name": "Amunet Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Amunet becomes the Hidden One for 8s: she exists partially in the void, untargetable by all enemies. She can teleport to any void-mark instantly. Every attack applies 5 void-marks that detonate immediately. She deals 3x damage to isolated enemies."},
        "passive": {"name": "Concealment Power", "effect": "Amunet gains Solar Charge every time she attacks from stealth. At 5 stacks, her next stealth attack hits all enemies in range."},
    },

    # ===== ASGARDIAN =====
    "Odin": {
        "role": "Warrior",
        "basicAttack": "Rune Edge — 3-hit combo with rune-carved blade. Wide cleaves that leave rune marks on the ground. Third hit detonates all runes for area damage.",
        "ability1": {"name": "Raven Sight", "type": "Buff/Reveal", "cd": 8, "energyCost": 25, "effect": "Send Huginn and Muninn to reveal all enemies in a large radius for 5s. Revealed enemies take 30% bonus damage. Odin gains +50% crit chance against revealed targets."},
        "ability2": {"name": "Oath Shield", "type": "Shield", "cd": 10, "energyCost": 40, "effect": "Raise oath-stone shield absorbing damage for 4s. If broken, it explodes stunning nearby enemies and refunding divine energy."},
        "signature": {"name": "Storm Sovereignty", "type": "Zone Control", "cd": 18, "energyCost": 70, "effect": "Create a storm circle. Odin gains super armor, enemies struck by lightning every second, his attacks gain thunder damage. 6s."},
        "ultimate": {"name": "Odin Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Open the rune-sealed eye for 8s: time slows for all enemies. Every attack leaves a rune-mark that detonates when ascension ends for accumulated damage. Odin sees all enemy positions."},
        "passive": {"name": "Oath-Bound", "effect": "Gains Oath Fury when blocking or taking damage. At 5 stacks, next attack gains thunder damage and knocks back all hit."},
    },
    "Freyja": {
        "role": "Assassin",
        "basicAttack": "Fate Reaver — 3-hit combo. Each hit harvests battle-fate energy. Third hit releases harvested energy as a shockwave that damages and heals Freyja.",
        "ability1": {"name": "Valkyrie Dash", "type": "Mobility/Damage", "cd": 5, "energyCost": 25, "effect": "Dash through enemies with blade-wings spread. Hit enemies are fate-marked and take bonus damage for 3s."},
        "ability2": {"name": "Fate Harvest", "type": "Burst/Heal", "cd": 10, "energyCost": 40, "effect": "Detonate all fate marks. Each explodes for damage based on damage the enemy dealt since being marked. Freyja heals 10% of total damage."},
        "signature": {"name": "Battle-Fate Storm", "type": "Empower", "cd": 18, "energyCost": 70, "effect": "Valkyrie Frenzy 6s: attack speed 2x, every third attack releases a fate shockwave, immune to crowd control."},
        "ultimate": {"name": "Chooser Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Choose the slain — all enemies below 50% HP marked for death. 8s of massive speed and damage vs marked. Killing marked target refunds 2s duration."},
        "passive": {"name": "Fate Weighing", "effect": "Gains Oath Fury when enemy near her dies. At 5 stacks, next attack heals and releases fate shockwave."},
    },
    "Skadi": {
        "role": "Archer",
        "basicAttack": "Frost Bow — Skadi fires frost-tipped arrows in a 3-shot burst. Each arrow applies a frost-stack. At 3 stacks, the enemy is frozen for 1s.",
        "ability1": {"name": "Winter Step", "type": "Mobility", "cd": 5, "energyCost": 25, "effect": "Skating dash across ice. Leaves a frost trail that slows enemies. If Skadi dashes through her own frost trail, cooldown reduced by 2s."},
        "ability2": {"name": "Avalanche Shot", "type": "AoE/CC", "cd": 10, "energyCost": 40, "effect": "Fire a massive frost arrow that creates an avalanche zone on impact. Enemies in zone are slowed 50% and take continuous frost damage. 5s."},
        "signature": {"name": "Huntress Domain", "type": "Zone Control", "cd": 18, "energyCost": 70, "effect": "Transform the battlefield into a frozen hunting ground. Skadi gains +50% attack range and movement speed on ice. Enemies slide uncontrollably. 6s."},
        "ultimate": {"name": "Skadi Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Skadi becomes the Winter Huntress for 8s: every arrow splits into 5 frost arrows seeking enemies. All ground becomes ice. Frozen enemies take 3x damage from next hit."},
        "passive": {"name": "Frost Mastery", "effect": "Gains Oath Fury when hitting frozen or slowed enemies. At 5 stacks, next attack fires 3 arrows simultaneously."},
    },
    "Thor": {
        "role": "Caster",
        "basicAttack": "Mjolnir Strike — 3-hit combo with Mjolnir. Each hit throws the hammer in a short arc. Third hit calls down a lightning bolt on the target for bonus storm damage.",
        "ability1": {"name": "Thunder Clap", "type": "AoE/CC", "cd": 6, "energyCost": 25, "effect": "Slam Mjolnir down, creating a thunder shockwave. Enemies in radius are stunned for 1.5s and take storm damage."},
        "ability2": {"name": "Mjolnir Throw", "type": "Line/Recall", "cd": 9, "energyCost": 40, "effect": "Throw Mjolnir in a straight line, hitting all enemies in path. Mjolnir returns to Thor, hitting again on the way back. Enemies hit twice take 50% bonus damage."},
        "signature": {"name": "Storm Hammer", "type": "Empower/Zone", "cd": 18, "energyCost": 70, "effect": "Charge Mjolnir with storm energy for 6s: every throw creates a storm field on impact. Storm fields deal continuous lightning damage to enemies inside. Thor gains super armor."},
        "ultimate": {"name": "Thor Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Thor becomes the God of Thunder for 8s: Mjolnir grows colossal, every throw hits all enemies on screen. Lightning strikes every enemy every 2s. Thor is immune to all crowd control."},
        "passive": {"name": "Thunder God", "effect": "Gains Oath Fury when hitting multiple enemies with one attack. At 5 stacks, next Mjolnir throw creates a lightning storm on impact."},
    },

    # ===== OLYMPIAN =====
    "Zeus": {
        "role": "Warrior",
        "basicAttack": "Thunder Cleave — 3-hit combo with thunder-charged spear. Each hit releases lightning chains to nearby enemies. Third hit plants the spear, creating a thunder zone.",
        "ability1": {"name": "Olympian Shield", "type": "Shield", "cd": 8, "energyCost": 25, "effect": "Raise the aegis — blocks all frontal damage for 3s. When it ends, shockwave damages and pushes back enemies."},
        "ability2": {"name": "Thunder Step", "type": "Mobility/Damage", "cd": 6, "energyCost": 35, "effect": "Teleport in a lightning flash, damaging enemies at origin and destination. Leaves thunder charges at both spots."},
        "signature": {"name": "Sky Throne", "type": "Zone Control", "cd": 18, "energyCost": 70, "effect": "Summon the throne of Olympus — elevated platform. From throne, range and damage increased, rains thunder on enemies below. 6s."},
        "ultimate": {"name": "Thunder King Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Zeus becomes the Thunder Verdict for 8s: every attack calls down thunderbolts, basic attacks become ranged lightning blasts, chain lightning strikes all enemies near him continuously."},
        "passive": {"name": "Glory Accumulated", "effect": "Gains Divine Glory when abilities hit enemies. At 5 stacks, next basic attack releases a thunder chain hitting all in range."},
    },
    "Artemis": {
        "role": "Archer",
        "basicAttack": "Moon Hunt — 3-shot arrow sequence. Each pierces and leaves a moon-mark. Third shot is a charged arrow detonating all moon-marks.",
        "ability1": {"name": "Laurel Trap", "type": "Terrain/Control", "cd": 6, "energyCost": 25, "effect": "Fire an arrow that creates a laurel snare on impact. Rooted 2s with burn damage."},
        "ability2": {"name": "Hunter's Mark", "type": "Debuff/Buff", "cd": 8, "energyCost": 35, "effect": "Mark nearest enemy as prey. 5s of 100% crit chance and 50% bonus damage. Mark transfers on kill."},
        "signature": {"name": "Moon Volley", "type": "Burst", "cd": 16, "energyCost": 65, "effect": "Leap into the air, rain 15 moon arrows. Each creates a moon-mark. All marks detonate when volley lands."},
        "ultimate": {"name": "Huntress Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Artemis becomes the Moon Huntress for 8s: arrows become piercing moon-beams, attack speed 3x, every shot detonates immediately. 100% dodge chance."},
        "passive": {"name": "Huntress Focus", "effect": "Gains Divine Glory per moon-mark detonation. At 5 stacks, next charged arrow is guaranteed critical with moon-explosion."},
    },
    "Ares": {
        "role": "Assassin",
        "basicAttack": "War Frenzy — 4-hit fast combo with spear and shield. Each hit builds frenzy-stack. At 4 stacks, Ares enters micro-frenzy: next attack is unblockable and deals 2x damage.",
        "ability1": {"name": "Phalanx Charge", "type": "Mobility/Damage", "cd": 5, "energyCost": 25, "effect": "Charge forward with shield raised, knocking back all enemies. Enemies hit are taunted (forced to target Ares) for 2s."},
        "ability2": {"name": "War Cry", "type": "Buff/Debuff", "cd": 9, "energyCost": 40, "effect": "Release a war cry: allies gain 30% attack speed and 20% damage. Enemies in range are feared (flee from Ares) for 2s."},
        "signature": {"name": "Battlefield Dominion", "type": "Field Control", "cd": 18, "energyCost": 70, "effect": "Claim a battlefield domain. Inside: Ares gains 50% damage and 30% lifesteal. Enemies take 30% more damage and are slowed. 6s."},
        "ultimate": {"name": "War God Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Ares becomes the War Incarnate for 8s: every attack is a guaranteed critical, every kill heals 25% max HP, immune to crowd control. His spear grows, each swing hitting all enemies in a 360 degree arc."},
        "passive": {"name": "Violence Feeds", "effect": "Gains Divine Glory every time he takes or deals damage. At 5 stacks, next attack is unblockable with 2x damage."},
    },
    "Athena": {
        "role": "Caster",
        "basicAttack": "Aegis Bash — 3-hit combo with shield and spear. First two are shield bashes that knock back. Third is a spear thrust that pierces all enemies in a line.",
        "ability1": {"name": "Aegis Wall", "type": "Shield/Zone", "cd": 7, "energyCost": 30, "effect": "Plant the aegis creating a protective wall. Blocks all enemy projectiles. Allies behind the wall gain 40% damage reduction. 4s."},
        "ability2": {"name": "Wisdom Counter", "type": "Counter", "cd": 9, "energyCost": 40, "effect": "Enter strategic stance for 3s. Next attack against Athena is blocked and countered with a divine strike that deals 200% damage and stuns."},
        "signature": {"name": "Strategic Dominion", "type": "Field Control", "cd": 18, "energyCost": 70, "effect": "Create a tactical zone. Inside: allies gain +40% damage, enemies have -40% damage. Enemy abilities inside are 50% weaker. 6s."},
        "ultimate": {"name": "Wisdom Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Athena becomes the Strategist for 8s: she predicts all enemy movements (100% dodge). Her shield reflects all projectiles at 3x damage. She can redirect any ally's attack for maximum effect."},
        "passive": {"name": "Strategic Mind", "effect": "Gains Divine Glory every time she blocks or counters. At 5 stacks, her next counter strikes all enemies in range."},
    },

    # ===== KAMI =====
    "Amaterasu": {
        "role": "Warrior",
        "basicAttack": "Sun Mirror — 3-hit beam combo from sacred mirror. Each beam pierces in a line. Third hit widens to a cone, damaging all in front.",
        "ability1": {"name": "Sacred Gate", "type": "Shield/Zone", "cd": 7, "energyCost": 30, "effect": "Open a torii gate creating a sacred zone. Allies gain damage reduction and healing. Enemies passing through are pushed back and take spirit damage."},
        "ability2": {"name": "Sun Brand", "type": "Debuff/Damage", "cd": 9, "energyCost": 40, "effect": "Brand enemies with sun-mark. Continuous burn damage, 30% reduced attack for 4s. Basic attacks consume marks for bonus damage."},
        "signature": {"name": "Spirit Sun", "type": "Zone Control", "cd": 18, "energyCost": 70, "effect": "Summon a miniature sun above the battlefield. Radiates spirit damage to all enemies, empowers allies. After 5s, sun explodes for massive damage."},
        "ultimate": {"name": "Sun Goddess Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Amaterasu becomes the Sun Mirror for 8s: body radiates blinding sunlight. Continuous burn to all enemies, all ally abilities empowered, basic attacks become massive solar beams sweeping the battlefield."},
        "passive": {"name": "Sacred Authority", "effect": "Gains Kami Energy when enemies are in her zones. At 5 stacks, next beam attack is 3x wider and 2x damage."},
    },
    "Tsukuyomi": {
        "role": "Caster",
        "basicAttack": "Moon Order — 4-hit fast combo with moon-charged blades. Each hit applies moon-shadow. Fourth hit detonates all moon-shadows for bonus damage and healing.",
        "ability1": {"name": "Moon Step", "type": "Mobility", "cd": 4, "energyCost": 20, "effect": "Dash through moon-shadow, appearing behind nearest enemy. Leaves moon-shadow trail that damages enemies who cross it."},
        "ability2": {"name": "Order Strike", "type": "Debuff/Silence", "cd": 8, "energyCost": 35, "effect": "Strike with moon-order energy, silencing all enemies in a cone for 3s. Silenced enemies cannot use special abilities."},
        "signature": {"name": "Moonlit Domain", "type": "Field Control", "cd": 16, "energyCost": 65, "effect": "Create a moonlight domain. Enemies slowed, cooldowns extended. Tsukuyomi gains invisibility when not attacking, attacks deal bonus moon damage."},
        "ultimate": {"name": "Moon God Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Tsukuyomi becomes the Moon Order Lord for 8s: massive speed, every attack applies 3 moon-shadows, all shadows detonate automatically, teleport to any shadow on screen."},
        "passive": {"name": "Moon Cycle", "effect": "Gains Kami Energy per shadow detonation. At 5 stacks, next dash creates 3 shadow trails."},
    },
    "Susanoo": {
        "role": "Archer",
        "basicAttack": "Storm Blade — 3-hit combo with the Totsuka sword. Each hit releases a storm-blade arc. Third hit creates a tornado that pulls enemies in and damages them.",
        "ability1": {"name": "Storm Dash", "type": "Mobility/Damage", "cd": 4, "energyCost": 25, "effect": "Dash forward as a storm, becoming intangible. Enemies hit take storm damage and are knocked up. Can dash again within 2s for no cost."},
        "ability2": {"name": "Sea Split", "type": "Crowd Control/Burst", "cd": 9, "energyCost": 40, "effect": "Slam the sword down, splitting the ground in a line. Enemies in the fissure are knocked up and take massive storm damage. Fissure persists as terrain hazard for 3s."},
        "signature": {"name": "Storm God's Wrath", "type": "Burst", "cd": 18, "energyCost": 70, "effect": "Summon a massive tornado around Susanoo. All enemies in a large radius are pulled inward and take continuous storm damage for 5s. Susanoo gains super armor during the tornado."},
        "ultimate": {"name": "Storm God Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Susanoo becomes the Storm for 8s: his body IS the typhoon. Every movement creates a storm trail. His attacks become massive storm-slashes that hit all enemies in a 360 degree arc. Immune to crowd control. Enemies near him are continuously knocked up."},
        "passive": {"name": "Storm Surge", "effect": "Gains Kami Energy every time he knocks up or pulls an enemy. At 5 stacks, next storm dash creates a tornado at the destination."},
    },
    "Izanami": {
        "role": "Assassin",
        "basicAttack": "Underworld Pulse — 3-hit combo firing shadow-death energy. Each hit applies a death-stack. At 3 stacks, the enemy takes burst damage and Izanami heals for the damage dealt.",
        "ability1": {"name": "Underworld Gate", "type": "Zone/Heal", "cd": 7, "energyCost": 30, "effect": "Open a gate to the underworld. Allies inside gain healing and energy regen. Enemies inside are slowed and take continuous shadow damage. 5s."},
        "ability2": {"name": "Death's Embrace", "type": "Debuff/Damage", "cd": 9, "energyCost": 40, "effect": "Embrace all nearby enemies with shadow tendrils. For 4s, they take continuous damage and their healing is inverted (healing becomes damage). Enemies below 20% HP are executed."},
        "signature": {"name": "Underworld Domain", "type": "Field Control", "cd": 18, "energyCost": 70, "effect": "Transform the ground into the underworld. All enemies inside take continuous shadow damage, their abilities are 50% weaker, and their movement is reversed. Allies gain shadow-armor. 6s."},
        "ultimate": {"name": "Death Goddess Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Izanami becomes the Underworld Queen for 8s: the entire battlefield becomes the underworld. All enemies continuously take shadow damage and their healing is inverted. Izanami is immune to all damage. Every enemy that dies extends duration by 1s."},
        "passive": {"name": "Death Accumulation", "effect": "Gains Kami Energy every time a death-stack triggers. At 5 stacks, her next attack applies max stacks to all enemies hit."},
    },

    # ===== TUATHA =====
    "Dagda": {
        "role": "Warrior",
        "basicAttack": "Cauldron Club — 3-hit heavy combo. Each hit creates a root growth. Third hit causes all root growths to erupt, damaging and rooting enemies.",
        "ability1": {"name": "Cauldron Feast", "type": "Heal/Buff", "cd": 8, "energyCost": 30, "effect": "Summon the cauldron, creating a feast zone. Allies heal over time and gain 20% damage boost. Enemies are slowed and take nature damage."},
        "ability2": {"name": "Root Armor", "type": "Shield", "cd": 10, "energyCost": 40, "effect": "Encase in root armor for 4s. 50% damage reduction, reflect nature damage to attackers. When it breaks, regenerate nearby allies."},
        "signature": {"name": "Good God's Bounty", "type": "Zone/Empower", "cd": 18, "energyCost": 70, "effect": "Create a massive sacred grove. Allies: continuous healing, damage boost, energy regen. Enemies: entangled, continuous damage. 6s."},
        "ultimate": {"name": "Good God Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Dagda becomes the Good God for 8s: battlefield becomes a sacred grove. All allies continuously healed, enemies continuously damaged by roots. His club grows colossal, each swing covers a massive area."},
        "passive": {"name": "Living World", "effect": "Gains Wild Growth per root eruption. At 5 stacks, next attack plants a grove that auto-erupts."},
    },
    "Morrigan": {
        "role": "Archer",
        "basicAttack": "Crow Strike — 3-hit fast combo with shadow-crow blades. Each hit applies a doom-mark. Third hit sends shadow crows to all marked enemies.",
        "ability1": {"name": "Crow Flight", "type": "Mobility/Damage", "cd": 4, "energyCost": 25, "effect": "Transform into a crow and dash through enemies, becoming intangible. Enemies hit take shadow damage and are marked with doom. Can cast again within 2s to return."},
        "ability2": {"name": "Doom Prophecy", "type": "Debuff/Execute", "cd": 9, "energyCost": 40, "effect": "Mark all nearby enemies with doom prophecy for 5s. Marked enemies have their defense reduced by 50% and take bonus damage. If a marked enemy drops below 20% HP, the prophecy executes them."},
        "signature": {"name": "Phantom Queen", "type": "Burst/Empower", "cd": 18, "energyCost": 70, "effect": "Summon phantom crows that circle Morrigan for 6s. Each crow automatically attacks nearby enemies. Morrigan gains 50% attack speed and her attacks apply doom-marks. At the end, all marks detonate."},
        "ultimate": {"name": "War Goddess Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Morrigan becomes the Phantom Queen for 8s: she transforms into a massive crow of shadow. Every flight deals massive damage. She can teleport to any doom-mark. Every kill during ascension creates a phantom crow that fights alongside her."},
        "passive": {"name": "Doom Accumulation", "effect": "Gains Wild Growth per doom-mark detonation. At 5 stacks, next crow flight hits all enemies on screen."},
    },
    "Brigid": {
        "role": "Caster",
        "basicAttack": "Forge Fire — 3-hit combo with flame-charged weapons. Each hit applies a burn-stack. Third hit releases a forge burst that detonates all burn-stacks.",
        "ability1": {"name": "Forge Step", "type": "Mobility/Damage", "cd": 4, "energyCost": 25, "effect": "Dash forward leaving a trail of forge fire. Enemies crossing the trail take burn damage. Brigid's next attack after the dash deals 2x damage."},
        "ability2": {"name": "Sacred Flame", "type": "Zone/Debuff", "cd": 9, "energyCost": 40, "effect": "Create a zone of sacred fire. Enemies inside take continuous burn damage and their armor is reduced by 30%. Allies inside gain 20% damage boost. 5s."},
        "signature": {"name": "Forge Master", "type": "Empower/Burst", "cd": 18, "energyCost": 70, "effect": "Enter forge mode for 6s: every basic attack is empowered with fire, dealing AoE damage. Every third attack releases a forge explosion. All burn-stacks on screen deal double damage during this state."},
        "ultimate": {"name": "Fire Goddess Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Brigid becomes the Sacred Flame for 8s: her body IS living fire. Every movement leaves a fire trail. Every attack creates a forge explosion. All enemies near her continuously burn. Immune to all crowd control."},
        "passive": {"name": "Forge Accumulation", "effect": "Gains Wild Growth per burn-stack detonation. At 5 stacks, next forge step leaves a permanent fire trail."},
    },
    "Lugh": {
        "role": "Assassin",
        "basicAttack": "Spear of Light — 3-shot ranged combo. Each spear throw pierces enemies in a line. Third throw is a charged spear that explodes on impact.",
        "ability1": {"name": "Many-Skills", "type": "Buff/Swap", "cd": 6, "energyCost": 25, "effect": "Swap combat style: switch between Spear (ranged pierce), Sling (AoE stun), and Harp (heal allies). Each style changes basic attack for 6s."},
        "ability2": {"name": "Lightning Spear", "type": "Burst/Pierce", "cd": 9, "energyCost": 40, "effect": "Throw a spear of pure light that pierces all enemies in a line and continues through the entire screen. All enemies hit are knocked back and take bonus light damage."},
        "signature": {"name": "Lugh's Mastery", "type": "Burst/Adapt", "cd": 16, "energyCost": 65, "effect": "Unleash all three combat styles simultaneously: fire piercing spears, sling AoE stuns, and emit healing pulses — all at once. Massive damage to all enemies in front, stun to all in a cone, and heal all nearby allies."},
        "ultimate": {"name": "Many-Skilled Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Lugh becomes the Master of All for 8s: all three combat styles active simultaneously. His basic attacks fire piercing spears, AoE sling-stuns, and healing pulses at the same time. Attack speed 3x. Every 3rd attack is a guaranteed critical."},
        "passive": {"name": "Skillful Adaptation", "effect": "Gains Wild Growth every time he swaps combat styles. At 5 stacks, his next ability activates all three styles at once."},
    },

    # ===== EMPYREAN =====
    "Michael": {
        "role": "Warrior",
        "basicAttack": "Holy Edge — 3-hit combo with flaming sword. Each hit releases holy sparks. Third hit creates a holy flash that blinds enemies in a cone for 1s.",
        "ability1": {"name": "Holy Bastion", "type": "Shield/Zone", "cd": 8, "energyCost": 30, "effect": "Create a holy barrier that blocks projectiles and damages enemies who touch it. Allies inside gain 30% damage reduction. 4s."},
        "ability2": {"name": "Radiant Smite", "type": "Burst/Debuff", "cd": 9, "energyCost": 40, "effect": "Smite with holy fire in a large area. Enemies branded with holy fire: continuous damage, defense reduced 4s."},
        "signature": {"name": "Seraph Throne", "type": "Zone Control", "cd": 18, "energyCost": 70, "effect": "Summon a radiant throne creating a holy domain. Michael gains super armor, attacks become ranged holy beams, enemies take continuous holy damage. 6s."},
        "ultimate": {"name": "Archangel Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Michael becomes the Seraph for 8s: six wings of holy fire manifest. All attacks become sweeping holy beams. 100% flight speed. Entire battlefield bathed in holy light — damages enemies, heals allies."},
        "passive": {"name": "Holy Authority", "effect": "Gains Holy Light when blocking or smiting. At 5 stacks, next holy flash becomes screen-wide blind that damages all enemies."},
    },
    "Raphael": {
        "role": "Archer",
        "basicAttack": "Seraph Arrows — Raphael fires holy-light arrows in a 3-shot burst. Each arrow applies a sanctify-stack. At 3 stacks, the enemy takes bonus holy damage for 3s.",
        "ability1": {"name": "Wings of Mercy", "type": "Mobility/Heal", "cd": 5, "energyCost": 25, "effect": "Dash on radiant wings. Allies passed through gain a small heal. Enemies passed through are knocked back and take holy damage."},
        "ability2": {"name": "Purge Shot", "type": "Debuff/Damage", "cd": 9, "energyCost": 40, "effect": "Fire a purifying arrow that strips all enemy buffs and shields. Stripped enemies take 50% bonus holy damage for 3s."},
        "signature": {"name": "Sanctuary Volley", "type": "Zone Control", "cd": 18, "energyCost": 70, "effect": "Rain holy arrows across a large zone. Enemies in zone take continuous holy damage and cannot use abilities. Allies in zone gain damage reduction. 6s."},
        "ultimate": {"name": "Raphael Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Raphael becomes the Archangel of Healing for 8s: every arrow hits all enemies on screen. 50% of damage dealt heals the player. Enemies hit are sanctified and take 2x damage from all sources."},
        "passive": {"name": "Divine Physician", "effect": "Gains Holy Light when healing or purging enemies. At 5 stacks, next attack heals player for 100% of damage dealt."},
    },
    "Jophiel": {
        "role": "Assassin",
        "basicAttack": "Blade of Light — Jophiel strikes with twin light-blades in a 3-hit combo. Each hit applies a radiance-mark. Third hit detonates all marks for burst holy damage.",
        "ability1": {"name": "Radiant Step", "type": "Mobility/Stealth", "cd": 5, "energyCost": 25, "effect": "Dash through light, becoming briefly invisible. Next attack from stealth applies 3 radiance-marks and deals 2x damage."},
        "ability2": {"name": "Judgment Cut", "type": "Burst/Execute", "cd": 9, "energyCost": 40, "effect": "Detonate all radiance-marks on a target. Each mark explodes for holy damage. If target is below 30% HP, the detonation executes instantly."},
        "signature": {"name": "Beauty Takedown", "type": "Empower", "cd": 16, "energyCost": 65, "effect": "Jophiel enters a radiant stance for 5s: attack speed 2x, every third attack detonates all marks on screen, immune to crowd control."},
        "ultimate": {"name": "Jophiel Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Jophiel becomes the Blade of Paradise for 8s: every attack teleports her to the target and detonates 5 marks instantly. She is untargetable between attacks. Isolated enemies take 3x damage."},
        "passive": {"name": "Radiant Insight", "effect": "Gains Holy Light when executing or marking enemies. At 5 stacks, next stealth attack hits all enemies in range."},
    },
    "Gabriel": {
        "role": "Caster",
        "basicAttack": "Trumpet Strike — 3-hit combo with divine spear. First two hits are shield-piercing thrusts. Third hit releases a trumpet shockwave that damages all enemies in a cone and knocks them back.",
        "ability1": {"name": "Intercept", "type": "Mobility/Defense", "cd": 7, "energyCost": 30, "effect": "Dash to a target area, creating a protective zone. Allies inside gain shields. Enemies who enter are knocked back. Blocks projectiles."},
        "ability2": {"name": "Counter Stance", "type": "Counter/Reflect", "cd": 9, "energyCost": 40, "effect": "Enter defensive pose for 3s. Next attack blocked and reflected at 200% damage. Gabriel heals for 10% of reflected damage."},
        "signature": {"name": "Sacred Ground", "type": "Zone Control", "cd": 18, "energyCost": 70, "effect": "Create a large protected zone. All enemy projectiles blocked. Allies inside gain shields and healing. Enemies inside are pushed outward continuously. 6s."},
        "ultimate": {"name": "Messenger Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Gabriel becomes the Messenger for 8s: his trumpet sounds continuously, creating shockwaves that push back all enemies and damage them. He gains 200% HP and becomes a massive shield, absorbing all damage for nearby allies."},
        "passive": {"name": "Guardian Authority", "effect": "Gains Holy Light every time he blocks or intercepts. At 5 stacks, next intercept zone covers 50% larger area."},
    },

    # ===== INFERNAL DOMINION =====
    "Lucifer": {
        "role": "Caster",
        "basicAttack": "Fallen Star — 3-hit combo with black-iron blade. Each hit releases a shadow-flame arc. Third hit is a downward slam that creates a fissure of hellfire.",
        "ability1": {"name": "Iron Bastion", "type": "Shield/Zone", "cd": 8, "energyCost": 30, "effect": "Raise black-iron walls creating a corridor. Enemies inside take continuous fire damage. Lucifer gains 50% damage reduction. 4s."},
        "ability2": {"name": "Pride's Grasp", "type": "Crowd Control/Damage", "cd": 10, "energyCost": 40, "effect": "Summon infernal chains that grab all enemies in a large area, pulling them to center and stunning 2s. Chain damage applies burn."},
        "signature": {"name": "Black Iron Dominion", "type": "Zone Control", "cd": 18, "energyCost": 70, "effect": "Transform ground into black-iron court. Enemies slowed 50%, continuous fire damage, defense reduced. Lucifer gains super armor and fire-damage boost. 6s."},
        "ultimate": {"name": "Fallen Star Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Lucifer becomes the Morning Star for 8s: his body grows massive, blade becomes colossal execution axe. Each swing creates a screen-spanning fissure. All enemies near him continuously chained and burned. Immune to crowd control."},
        "passive": {"name": "Infernal Authority", "effect": "Gains Infernal Fury per chain or burn. At 5 stacks, next ground-slam creates 3 fissures."},
    },
    "Lilith": {
        "role": "Archer",
        "basicAttack": "Shadow Pulse — 3-shot burst of obsidian-shadow projectiles. Each applies a shadow-mark. Third shot detonates all marks, dealing bonus damage and healing Lilith.",
        "ability1": {"name": "Shadow Step", "type": "Mobility/Stealth", "cd": 5, "energyCost": 25, "effect": "Phase through shadows, teleporting and becoming invisible for 2s. Next attack from stealth deals 3x damage and applies 3 shadow-marks."},
        "ability2": {"name": "Obsidian Field", "type": "Zone/Debuff", "cd": 9, "energyCost": 40, "effect": "Create a field of obsidian shadow. Enemies slowed, 50% miss chance, continuous shadow damage. Lilith gains invisibility within."},
        "signature": {"name": "Shadow Dominion", "type": "Field Control", "cd": 18, "energyCost": 70, "effect": "Expand obsidian shadow across a large area. Enemies rooted, continuous shadow damage, abilities silenced. Lilith can teleport to any point. 5s."},
        "ultimate": {"name": "Night Queen Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Lilith becomes the Night Queen for 8s: pure shadow, untargetable. Teleport to any shadow-mark. Every teleport deals massive burst damage. All enemies near her continuously drained of HP and healed into Lilith."},
        "passive": {"name": "Shadow Accumulation", "effect": "Gains Infernal Fury per shadow-mark detonation. At 5 stacks, next shadow step creates 3 shadow echoes that attack independently."},
    },
    "Asmodeus": {
        "role": "Warrior",
        "basicAttack": "Chain Break — 4-hit fast combo with chain-wrapped blades. Each hit applies a chain-stack. Fourth hit yanks all chained enemies toward Asmodeus and deals bonus damage.",
        "ability1": {"name": "Chain Grasp", "type": "Mobility/CC", "cd": 5, "energyCost": 25, "effect": "Throw chains at target, pulling Asmodeus to large enemies or pulling small enemies to him. Stunned 1s, bonus damage."},
        "ability2": {"name": "Chain Storm", "type": "Burst/AoE", "cd": 10, "energyCost": 40, "effect": "Spin with chains extended, creating a whirlwind damaging all in range and applying chain-stacks. All chained enemies pulled when storm ends."},
        "signature": {"name": "Execution Verdict", "type": "Burst/Execute", "cd": 18, "energyCost": 70, "effect": "Mark all chained enemies for execution. Chain-storm hits each marked enemy with a devastating strike. Damage scales with chain-stacks. Enemies below 30% HP instantly executed."},
        "ultimate": {"name": "Chain Lord Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Asmodeus becomes the Chain Lord for 8s: chains extend in all directions, auto-grabbing all enemies on screen. Teleport to any chained enemy, each teleport dealing massive burst. Chained enemies continuously pulled and damaged."},
        "passive": {"name": "Chain Accumulation", "effect": "Gains Infernal Fury per chain-stack trigger. At 5 stacks, next chain grasp hits all enemies in range."},
    },
    "Naamah": {
        "role": "Assassin",
        "basicAttack": "Charm Pulse — 3-hit combo firing charm-energy projectiles. Each applies a charm-stack. At 3 stacks, the enemy is charmed (attacks allies) for 2s.",
        "ability1": {"name": "Seduction", "type": "Crowd Control/Heal", "cd": 7, "energyCost": 30, "effect": "Charm all enemies in a cone for 3s. Charmed enemies walk toward Naamah and take bonus shadow damage. Naamah heals for 5% max HP per charmed enemy."},
        "ability2": {"name": "Ember Veil", "type": "Stealth/Debuff", "cd": 9, "energyCost": 40, "effect": "Create a veil of ember and ash. Naamah gains invisibility. Enemies inside are charmed and their attack speed is halved. 4s."},
        "signature": {"name": "Succubus Domain", "type": "Field Control", "cd": 18, "energyCost": 70, "effect": "Create a domain of charm and shadow. All enemies inside are charmed, their damage is reduced by 50%, and they take continuous shadow damage. Naamah gains 30% lifesteal inside the domain. 6s."},
        "ultimate": {"name": "Temptation Ascension", "type": "Ascension", "cd": 0, "beliefCost": 100, "effect": "Naamah becomes the Temptress for 8s: all enemies on screen are charmed. Their attacks heal instead of damage allies. Naamah gains 100% lifesteal and invisibility. Every charmed enemy that dies extends duration by 1s."},
        "passive": {"name": "Charm Accumulation", "effect": "Gains Infernal Fury per charm-stack trigger. At 5 stacks, her next seduction charms all enemies on screen."},
    },
}

def update_combat_kits():
    with open(os.path.join(BASE, 'data', 'deitys.json')) as f:
        deities = json.load(f)
    
    updated = 0
    for d in deities:
        name = d.get('name', '')
        faction = d.get('faction', '')
        
        fd = FACTION_DATA.get(faction, {})
        d['element'] = fd.get('element', 'Unknown')
        d['divineDomain'] = fd.get('domain', 'Unknown')
        d['resourceType'] = fd.get('resource', 'Divine Energy')
        d['combatModel'] = 'one-deity-vs-many'
        
        kit = COMBAT_KITS.get(name)
        if kit:
            d['combatKit'] = kit
            d['combatIdentity'] = {
                'mythicElement': fd.get('element', ''),
                'divineDomain': fd.get('domain', ''),
                'weapon': kit.get('basicAttack', '').split('—')[0].strip(),
                'role': d.get('role', ''),
            }
            updated += 1
        else:
            print(f"  WARNING: No combat kit for {name}")
    
    with open(os.path.join(BASE, 'data', 'deitys.json'), 'w') as f:
        json.dump(deities, f, indent=2, ensure_ascii=False)
    
    print(f"Updated {updated}/{len(deities)} deity combat kits")

def main():
    print("=" * 60)
    print("COMBAT KITS — 28 Mythological Deities")
    print("=" * 60)
    update_combat_kits()
    
    # Verify
    with open(os.path.join(BASE, 'data', 'deitys.json')) as f:
        deities = json.load(f)
    
    print(f"\nVerification:")
    for d in deities:
        kit = d.get('combatKit', {})
        has_kit = bool(kit.get('basicAttack'))
        ab1 = kit.get('ability1', {}).get('name', 'MISSING')
        sig = kit.get('signature', {}).get('name', 'MISSING')
        ult = kit.get('ultimate', {}).get('name', 'MISSING')
        print(f"  {d['name']:12s} | {d['role']:10s} | {d.get('element','?'):8s} | A1:{ab1:20s} | Sig:{sig:20s} | Ult:{ult}")

if __name__ == '__main__':
    main()
