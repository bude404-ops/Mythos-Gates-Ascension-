#!/usr/bin/env python3
"""
Mythos Gates: Ascension — Combat System Rework
Transforms from turn-based tactical RPG to one-deity-vs-many action RPG

New Combat Model:
- Real-time action combat (not turn-based)
- One active deity vs waves of enemies
- Mobile controls: movement, basic attack, 2 active abilities, dodge, signature, ultimate
- Divine Energy resource (built from attacks, spent on abilities)
- Ascension Gauge (built throughout battle, unleashes ultimate)
- Each deity: Basic Attack, Active 1, Active 2, Signature Divine Skill, Ultimate/Ascension
"""

import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))

# === ROLE MAPPING ===
# Old tactical roles → New action RPG roles
ROLE_MAP = {
    "Defender": "Tank",
    "Battery": "Bruiser", 
    "Controller": "Controller",
    "Breaker": "Breaker",
    "Disruptor": "Assassin",
    "Sustain": "Support",
    "Artillery": "Ranger",
    "Guardian": "Guardian",
    "Assassin": "Assassin",
}

# === ELEMENT/DOMAIN PER FACTION ===
FACTION_ELEMENT = {
    "Aten Ra": {"element": "Solar", "domain": "Judgment", "resource": "Solar Charge"},
    "Asgardian": {"element": "Storm", "domain": "Oath", "resource": "Oath Fury"},
    "Olympian": {"element": "Thunder", "domain": "Glory", "resource": "Divine Glory"},
    "Kami": {"element": "Spirit", "domain": "Sacred", "resource": "Kami Energy"},
    "Tuatha": {"element": "Nature", "domain": "Wild", "resource": "Wild Growth"},
    "Empyrean": {"element": "Holy", "domain": "Order", "resource": "Holy Light"},
    "Infernal Dominion": {"element": "Shadow", "domain": "Chains", "resource": "Infernal Fury"},
}

# === COMBAT KIT TEMPLATES PER ROLE ===
# Each role defines the combat feel and ability archetypes
ROLE_COMBAT_KITS = {
    "Tank": {
        "playstyle": "Absorb punishment, control enemy positioning, protect objectives",
        "basicAttack": "Heavy melee combo with wide arc — cleaves through multiple enemies",
        "ability1Archetype": "Crowd Control / Taunt — force enemies to focus you",
        "ability2Archetype": "Shield / Fortify — temporary damage reduction or barrier",
        "signatureArchetype": "Zone Control — create a sacred zone that slows/damages enemies",
        "ultimateArchetype": "Bastion Form — become immovable, reflect damage, knock back all nearby enemies",
        "statPriority": ["hp", "armor", "resistance"],
    },
    "Bruiser": {
        "playstyle": "Sustained fighter that builds power over time, balanced damage and durability",
        "basicAttack": "Medium-speed combo with escalating damage — each hit hits harder than the last",
        "ability1Archetype": "Power Strike — burst damage that builds resource",
        "ability2Archetype": "Empower — buff self with increased damage and defense",
        "signatureArchetype": "Crescendo — unleash accumulated power in a devastating area attack",
        "ultimateArchetype": "Frenzy Form — enter berserk state with massive speed and damage boost",
        "statPriority": ["hp", "attack", "armor"],
    },
    "Controller": {
        "playstyle": "Area denial and crowd control — dictate where enemies can move",
        "basicAttack": "Ranged projectile or wave that applies slow on hit",
        "ability1Archetype": "Terrain Manipulation — create hazardous zones or walls",
        "ability2Archetype": "Crowd Control — freeze, slow, stun, or displace enemies",
        "signatureArchetype": "Field Command — reshape the battlefield to your advantage",
        "ultimateArchetype": "Domain Expansion — claim a large area as your divine territory, debuffing all enemies within",
        "statPriority": ["attack", "energy", "resistance"],
    },
    "Breaker": {
        "playstyle": "Burst damage specialist — break through armor and execute weakened foes",
        "basicAttack": "Heavy single-target strikes with armor-piercing property",
        "ability1Archetype": "Armor Break — strip enemy defense and expose weakness",
        "ability2Archetype": "Execution Strike — massive damage to low-HP or debuffed enemies",
        "signatureArchetype": "Verdict — deliver a devastating finishing blow that refunds resources on kill",
        "ultimateArchetype": "Judgment Form — enter executioner state where every hit is a critical strike",
        "statPriority": ["attack", "critChance", "guardBreak"],
    },
    "Assassin": {
        "playstyle": "High mobility, burst damage, strike and fade",
        "basicAttack": "Fast dual strikes with high crit chance",
        "ability1Archetype": "Dash / Teleport — blink through enemies leaving damage behind",
        "ability2Archetype": "Stealth / Concealment — become invisible and gain bonus damage on next hit",
        "signatureArchetype": "Shadow Strike — appear behind target and deliver massive burst",
        "ultimateArchetype": "Death Mark — mark all visible enemies, then unleash a chain of teleporting strikes",
        "statPriority": ["attack", "speed", "critChance"],
    },
    "Ranger": {
        "playstyle": "Long-range damage dealer, keep distance, kite enemies",
        "basicAttack": "Rapid-fire projectiles with piercing capability",
        "ability1Archetype": "Sniper Shot — powerful long-range single-target hit",
        "ability2Archetype": "Scatter Shot — spread multiple projectiles in a cone",
        "signatureArchetype": "Rain of Fire — bombard a large area with multiple projectiles",
        "ultimateArchetype": "Bombardment — call down divine artillery across the entire battlefield",
        "statPriority": ["attack", "range", "accuracy"],
    },
    "Support": {
        "playstyle": "Sustain allies and debuff enemies — not a pure healer but a force multiplier",
        "basicAttack": "Energy pulse that damages enemies and pulses healing to nearby allies",
        "ability1Archetype": "Restore — heal self and nearby allies, cleanse debuffs",
        "ability2Archetype": "Weaken — debuff enemy damage and defense in an area",
        "signatureArchetype": "Ritual Circle — create a sacred zone that empowers allies and suppresses enemies",
        "ultimateArchetype": "Divine Restoration — massive team-wide heal, cleanse, and buff",
        "statPriority": ["energy", "resistance", "hp"],
    },
    "Guardian": {
        "playstyle": "Defensive interceptor — protect area, block attacks, counter",
        "basicAttack": "Shield bash combo that knocks back enemies",
        "ability1Archetype": "Intercept — dash to block incoming damage to a target area",
        "ability2Archetype": "Counter Stance — enter defensive pose, reflect next attack",
        "signatureArchetype": "Sacred Ground — create a protected zone that blocks enemy projectiles",
        "ultimateArchetype": "Guardian Form — become a massive shield, absorbing all damage for a duration",
        "statPriority": ["hp", "armor", "resistance"],
    },
}

# === UNIQUE COMBAT KITS FOR ALL 28 DEITIES ===
# Each deity gets a unique set of abilities reflecting their mythology and combat role

DEITY_COMBAT_KITS = {
    # === ATEN RA FACTION ===
    "Aten Ra": {
        "basicAttack": "Solar Edge — Aten-Ra swings his was-sceptre blade in a 3-hit combo. Each strike releases Aten hand-rays that extend the hit arc, damaging enemies in a wide frontal cone. Third hit plants a small Ma'at judgment zone that slows enemies.",
        "ability1": {"name": "Pylon Bastion", "type": "Shield", "cd": 6, "divineCost": 30, "effect": "Raise pylon-shaped energy barriers on both sides, creating a fortified position. Enemies inside the barrier take Solar damage. Lasts 4 seconds."},
        "ability2": {"name": "Ma'at Verdict", "type": "Crowd Control", "cd": 10, "divineCost": 40, "effect": "Emit a weighing-scale pulse from the chest prism. All enemies in range are weighed — heavier/slower enemies are stunned, lighter/faster ones are slowed. Exposed enemies take bonus damage for 3 seconds."},
        "signature": {"name": "Sun-Scale Decree", "type": "Zone Control", "cd": 18, "divineCost": 70, "effect": "Plant the was-sceptre blade into the ground, creating a large Aten-lit judgment zone. Inside the zone, Aten-Ra gains armor, enemies are slowed, and all Solar damage is amplified. Lasts 6 seconds."},
        "ultimate": {"name": "Source Radiance", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Enter Ascendant form for 8 seconds: Aten-Ra's body radiates blinding solar light. All attacks become AoE solar blasts, all damage is amplified 2x, and enemies entering his aura are blinded and take burn damage. The ground transforms to Aten-lit judgment ground for the duration."},
        "passive": {"name": "Solar Edict", "effect": "Aten-Ra builds Solar Charge when blocking or taking damage near his judgment zones. At 3 stacks, his next ability gains a Ma'at balance rider (bonus damage). At 5 stacks, his Signature is empowered and the meter resets."},
    },
    "Sutekh": {
        "basicAttack": "Dawn Strike — Sutekh pushes forward with scarab-carapace blows. Each hit stores a small amount of dawn energy in his amber core. Third hit releases a stored burst of solar renewal that damages nearby enemies and slightly heals Sutekh.",
        "ability1": {"name": "Scarab Push", "type": "Crowd Control", "cd": 5, "divineCost": 25, "effect": "Charge forward like Khepri pushing the sun, knocking back all enemies in path and leaving a trail of amber energy that damages enemies who cross it."},
        "ability2": {"name": "Renewal Cycle", "type": "Empower", "cd": 12, "divineCost": 45, "effect": "Enter renewal state for 5 seconds: all damage taken is converted to stored dawn energy. When the state ends, release the stored energy as a healing burst that damages nearby enemies and restores HP."},
        "signature": {"name": "Dawn Reforged", "type": "Burst", "cd": 20, "divineCost": 75, "effect": "Unleash all stored dawn energy in a massive amber explosion. The more energy stored, the larger the blast. Heals Sutekh for 15% of damage dealt."},
        "ultimate": {"name": "Khepri Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Transform into the Dawn Scarab for 10 seconds: become a massive rolling force that deals contact damage, is immune to crowd control, and leaves a trail of dawn energy that heals allies and damages enemies."},
        "passive": {"name": "Renewal Engine", "effect": "Sutekh stores dawn energy from every basic attack and damage taken. At 10 stacks, his next basic attack releases a free Renewal burst."},
    },
    "Iset": {
        "basicAttack": "Threshold Pulse — Iset fires obsidian mirror shards from her hands. Each shard pierces one enemy and leaves a small void mark. Third hit detonates all void marks on screen for bonus damage.",
        "ability1": {"name": "Gate Step", "type": "Mobility", "cd": 5, "divineCost": 20, "effect": "Phase through the Duat — teleport a short distance, leaving behind an obsidian mirror that taunts nearby enemies for 2 seconds before shattering for damage."},
        "ability2": {"name": "Dusk Veil", "type": "Crowd Control", "cd": 9, "divineCost": 35, "effect": "Create a zone of controlled darkness around her. Enemies inside are blinded and their attacks have 50% miss chance. Iset gains invisibility within the zone."},
        "signature": {"name": "Duat Threshold", "type": "Field Control", "cd": 16, "divineCost": 65, "effect": "Open a Duat gate beneath a large area. All enemies in the zone are pulled toward the center and take void damage. The gate remains open for 5 seconds, continuously damaging and slowing enemies inside."},
        "ultimate": {"name": "Obsidian Dawn", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Iset becomes the threshold itself for 8 seconds: she transforms into living obsidian, immune to all damage. Her body absorbs all enemy projectiles and spells, then fires them back as void-charged blasts. All enemies near her are slowed by 50%."},
        "passive": {"name": "Threshold Keeper", "effect": "Iset gains a void stack every time an enemy enters or exits her zones. At 5 stacks, her next ability creates an additional void zone."},
    },
    "Amunet": {
        "basicAttack": "Verdict Combo — Amunet strikes with amber glass blades in a fast 4-hit combo. Each hit refracts light, creating a spectrum line that damages enemies in a line behind the primary target. The fourth hit shatters the blades, dealing AoE damage.",
        "ability1": {"name": "Prism Refract", "type": "Debuff", "cd": 6, "divineCost": 30, "effect": "Fire a prism beam from the chest crystal that splits into 5 spectrum rays on impact. Each ray applies a different debuff: one slows, one reduces armor, one reduces attack, one marks for execution, one causes burn."},
        "ability2": {"name": "Truth Reveal", "type": "Execute", "cd": 10, "divineCost": 40, "effect": "All enemies within range are weighed by the prism — those below 30% HP are marked for execution. Marked enemies take 3x damage from Amunet's next attack and are visible through walls."},
        "signature": {"name": "Judgment Prism", "type": "Burst", "cd": 18, "divineCost": 70, "effect": "Shatter the prism heart — release a massive refraction explosion that hits all enemies in a large radius. Damage scales with the number of debuffs on each enemy. Resets all debuffs."},
        "ultimate": {"name": "Divine Verdict", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Amunet becomes the Living Scale for 10 seconds: every enemy on screen is constantly weighed. Their true weight (HP, buffs, debuffs) is visible. All of Amunet's attacks become piercing prism beams that deal bonus damage equal to the enemy's missing HP percentage."},
        "passive": {"name": "Truth-Prism", "effect": "Every debuff Amunet applies adds a prism stack. At 5 stacks, his next basic attack becomes a piercing prism beam that passes through all enemies in a line."},
    },
    
    # === ASGARDIAN FACTION ===
    "Odin": {
        "basicAttack": "Rune Edge — The Odin swings his rune-carved blade in a heavy 3-hit combo. The first two hits are wide cleaves; the third plants a rune on the ground that explodes after 1 second, damaging enemies standing on it.",
        "ability1": {"name": "Raven Sight", "type": "Buff", "cd": 8, "divineCost": 25, "effect": "Send out Huginn and Muninn as thought-crows that reveal all enemies in a large radius for 5 seconds. Revealed enemies take bonus damage from all sources."},
        "ability2": {"name": "Oath Shield", "type": "Shield", "cd": 10, "divineCost": 40, "effect": "Raise a shield of oath-stone that absorbs damage for 4 seconds. If the shield is broken, it explodes, stunning all nearby enemies and refunding divine energy."},
        "signature": {"name": "Storm Sovereignty", "type": "Zone Control", "cd": 18, "divineCost": 70, "effect": "Channel the power of the Aesir throne — create a storm circle around himself. Inside the circle, the Odin gains super armor, enemies are struck by lightning every second, and his attacks gain thunder damage. Lasts 6 seconds."},
        "ultimate": {"name": "Odin Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Open the rune-sealed eye for 8 seconds: time slows for all enemies while the Odin moves at normal speed. Every attack during this state leaves a rune-mark that detonates when the ascension ends, dealing accumulated damage."},
        "passive": {"name": "Oath-Bound", "effect": "The Odin gains Oath Fury every time he blocks or takes damage. At 5 stacks, his next attack gains thunder damage and knocks back all enemies hit."},
    },
    "Thor": {
        "basicAttack": "Fate Reaver — Thor swings in a medium-speed 3-hit combo. Each hit harvests a small amount of battle-fate energy from enemies. Third hit releases the harvested energy as a shockwave.",
        "ability1": {"name": "Valkyrie Dash", "type": "Mobility/Damage", "cd": 5, "divineCost": 25, "effect": "Dash through enemies with blade-wings spread. Enemies hit are marked with fate-energy and take bonus damage from subsequent attacks for 3 seconds."},
        "ability2": {"name": "Fate Harvest", "type": "Burst", "cd": 10, "divineCost": 40, "effect": "Detonate all fate marks on screen. Each mark explodes for damage based on how much damage the marked enemy has dealt since being marked. Thor heals for 10% of total damage dealt."},
        "signature": {"name": "Battle-Fate Storm", "type": "Empower", "cd": 18, "divineCost": 70, "effect": "Enter Valkyrie Frenzy for 6 seconds: attack speed doubled, every third attack releases a fate-marked shockwave, and Thor is immune to crowd control."},
        "ultimate": {"name": "Chooser Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Thor chooses the slain — all enemies below 50% HP are marked for death. For 8 seconds, Thor gains massive speed and damage against marked targets. Killing a marked target during ascension refunds 2 seconds of duration."},
        "passive": {"name": "Fate Weighing", "effect": "Thor gains Oath Fury every time an enemy near him dies. At 5 stacks, his next attack heals him and releases a fate shockwave."},
    },
    "Frigg": {
        "basicAttack": "Root Strike — Frigg attacks with root-iron claws in a 3-hit combo. Each hit extends root tendrils into the ground, creating a small root patch that slows enemies who step on it. Third hit causes all root patches to constrict, damaging and rooting enemies.",
        "ability1": {"name": "Root Wall", "type": "Terrain", "cd": 7, "divineCost": 30, "effect": "Raise a wall of living roots from the ground. The wall blocks movement and projectiles. After 3 seconds, the wall erupts outward, damaging and knocking back enemies on both sides."},
        "ability2": {"name": "World-Root Grasp", "type": "Crowd Control", "cd": 10, "divineCost": 40, "effect": "Root tendrils erupt from the ground in a large area, grabbing all enemies and holding them for 2 seconds. Held enemies take bonus nature damage."},
        "signature": {"name": "Nine-World Crossing", "type": "Field Control", "cd": 20, "divineCost": 75, "effect": "Open root-gates to all nine worlds — the entire battlefield becomes root-infested terrain for 6 seconds. All enemies are slowed, all root patches deal damage, and Frigg gains massive regeneration while standing on roots."},
        "ultimate": {"name": "Yggdrasil Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Frigg becomes the World Tree for 8 seconds: he roots into the ground, becoming immobile but gaining a massive health pool. While rooted, he can fire root-tendrils in all directions, each one dealing heavy damage and pulling enemies toward him."},
        "passive": {"name": "Root-Sight", "effect": "Frigg gains Oath Fury every time an enemy is rooted or slowed by his terrain. At 5 stacks, his next root patch explodes instead of slowing."},
    },
    "Freyja": {
        "basicAttack": "Shatter Combo — Freyja swings her war-judge maul in a heavy 2-hit combo. First hit shatters enemy armor (reduces defense). Second hit deals bonus damage based on how much armor was shattered.",
        "ability1": {"name": "Feast Call", "type": "Buff", "cd": 8, "divineCost": 30, "effect": "Ring the feast-horn — all nearby allies gain 20% damage boost and 10% damage reduction for 5 seconds. Freyja gains double the bonus."},
        "ability2": {"name": "Shatter Verdict", "type": "Debuff/Execute", "cd": 10, "divineCost": 40, "effect": "Slam the maul into the ground, creating a shockwave that strips all buffs from enemies and applies Shatter. Shattered enemies take 50% more damage from all sources for 3 seconds."},
        "signature": {"name": "Valhalla's Test", "type": "Zone", "cd": 18, "divineCost": 70, "effect": "Create a trial arena around herself. Inside the arena, all healing is disabled for enemies, all buffs are suppressed, and Freyja gains super armor. Lasts 6 seconds. Enemies who flee the arena take damage."},
        "ultimate": {"name": "Death-Feast Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Freyja becomes the Chooser of the Slain for 8 seconds: her maul grows to colossal size, every hit is guaranteed critical, and every kill during ascension heals her for 25% of her max HP. She leaves a trail of honored-dead energy that empowers allies."},
        "passive": {"name": "Breaker of False Sanctuary", "effect": "Freyja gains Oath Fury every time she strips a buff or shatters armor. At 5 stacks, her next attack is unblockable and deals 2x damage to buffed enemies."},
    },
    
    # === OLYMPIAN FACTION ===
    "Zeus": {
        "basicAttack": "Thunder Cleave — Zeus swings his thunder-charged spear in a 3-hit combo. Each hit releases a bolt of lightning that chains to nearby enemies. Third hit plants the spear, creating a thunder zone that damages enemies inside.",
        "ability1": {"name": "Olympian Shield", "type": "Shield", "cd": 8, "divineCost": 25, "effect": "Raise the aegis — a divine shield that blocks all frontal damage for 3 seconds. When the shield ends, it releases a shockwave that damages and pushes back enemies."},
        "ability2": {"name": "Thunder Step", "type": "Mobility/Damage", "cd": 6, "divineCost": 35, "effect": "Teleport to a target location in a flash of lightning, damaging all enemies at both the origin and destination. Leaves a thunder charge at both locations."},
        "signature": {"name": "Sky Throne", "type": "Zone Control", "cd": 18, "divineCost": 70, "effect": "Summon the throne of Olympus — create a sacred platform that elevates Zeus above the battlefield. From the throne, his range and damage are increased, and he rains thunder on all enemies below. Lasts 6 seconds."},
        "ultimate": {"name": "Thunder King Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Zeus becomes the Thunder Verdict for 8 seconds: every attack calls down a thunderbolt on the target, his basic attacks become ranged lightning blasts, and all enemies near him are continuously struck by chain lightning."},
        "passive": {"name": "Glory Accumulated", "effect": "Zeus gains Divine Glory every time his abilities hit enemies. At 5 stacks, his next basic attack releases a thunder chain that hits all enemies in range."},
    },
    "Athena": {
        "basicAttack": "Marble Storm — Athena fires rapid marble-energy projectiles in a 3-shot burst. Each projectile pierces one enemy. Third shot is a charged blast that explodes on impact, damaging all nearby enemies.",
        "ability1": {"name": "Renewal Engine", "type": "Resource/Buff", "cd": 6, "divineCost": 25, "effect": "Charge with divine energy — instantly gain 50 Divine Glory and increase attack speed by 30% for 4 seconds. During this time, basic attacks have no cooldown between bursts."},
        "ability2": {"name": "Ambrosia Burst", "type": "Heal/Damage", "cd": 10, "divineCost": 40, "effect": "Release a burst of ambrosial energy that heals Athena for 15% max HP and damages all nearby enemies. Enemies hit are marked with glory, taking bonus damage from all sources for 3 seconds."},
        "signature": {"name": "Marble Volley", "type": "Burst", "cd": 16, "divineCost": 65, "effect": "Unleash a barrage of 12 marble-energy projectiles in a wide arc. Each projectile homes toward the nearest enemy. All enemies hit are knocked back and stunned for 1 second."},
        "ultimate": {"name": "Ambrosia Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Athena becomes the Ambrosia Font for 8 seconds: he continuously emits healing energy that restores nearby allies, his attacks become homing marble-storm blasts, and he gains immunity to crowd control. All kills during ascension extend the duration by 1 second."},
        "passive": {"name": "Glory Engine", "effect": "Athena generates Divine Glory faster than other deities — every 3rd basic attack refunds 10 Divine Glory. At max Divine Glory, his next ability is free."},
    },
    "Artemis": {
        "basicAttack": "Aegis Wave — Artemis fires golden aegis shields that bounce between enemies. Each bounce reduces enemy movement speed. Third hit creates a large shield that damages and pushes back all enemies in front.",
        "ability1": {"name": "Golden Bulwark", "type": "Shield/Zone", "cd": 7, "divineCost": 30, "effect": "Plant a golden aegis in the ground that creates a protective zone. Allies inside gain 30% damage reduction. Enemies who touch the barrier are knocked back and take damage."},
        "ability2": {"name": "Reflect Stance", "type": "Counter", "cd": 9, "divineCost": 35, "effect": "Enter a defensive stance for 3 seconds. All incoming projectiles are reflected back at the sender with 150% damage. Melee attacks are blocked and countered with a golden shockwave."},
        "signature": {"name": "Aegis Dominion", "type": "Field Control", "cd": 18, "divineCost": 70, "effect": "Create a massive golden barrier around a large area. Enemies inside are trapped and take continuous golden damage. Allies inside gain shields. The barrier lasts 5 seconds, then collapses inward, damaging all enemies inside."},
        "ultimate": {"name": "Golden Aegis Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Artemis becomes the Golden Aegis for 8 seconds: her body radiates golden shield energy. All nearby allies gain continuous shields. She gains super armor and reflects all projectiles. Her attacks become wide golden waves that push enemies back."},
        "passive": {"name": "Aegis Mastery", "effect": "Artemis gains Divine Glory every time she blocks or reflects damage. At 5 stacks, her next shield ability covers a 50% larger area."},
    },
    "Ares": {
        "basicAttack": "Moon Hunt — Ares fires moon-tipped arrows in a rapid 3-shot sequence. Each arrow pierces and leaves a moon-mark on the target. Third shot is a charged arrow that detonates all moon-marks for bonus damage.",
        "ability1": {"name": "Laurel Trap", "type": "Terrain/Control", "cd": 6, "divineCost": 25, "effect": "Fire an arrow that creates a laurel snare on impact. Enemies caught in the snare are rooted for 2 seconds and take burn damage from laurel flames."},
        "ability2": {"name": "Hunter's Mark", "type": "Debuff/Buff", "cd": 8, "divineCost": 35, "effect": "Mark the nearest enemy as prey. For 5 seconds, Ares's attacks against the marked target have 100% crit chance and deal 50% bonus damage. The mark transfers on kill."},
        "signature": {"name": "Moon Volley", "type": "Burst", "cd": 16, "divineCost": 65, "effect": "Leap into the air and rain down 15 moon-tipped arrows in a large area. Each arrow creates a moon-mark on impact. All marks detonate simultaneously after the volley lands."},
        "ultimate": {"name": "Artemis Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Ares becomes the Moon Huntress for 8 seconds: her arrows become piercing moon-beams that pass through all enemies, her attack speed is tripled, and every shot applies a moon-mark that detonates immediately. She gains 100% dodge chance during ascension."},
        "passive": {"name": "Huntress Focus", "effect": "Ares gains Divine Glory for every moon-mark detonation. At 5 stacks, her next charged arrow is a guaranteed critical hit that creates a moon-explosion on impact."},
    },
    
    # === KAMI FACTION ===
    "Amaterasu": {
        "basicAttack": "Sun Mirror — Amaterasu fires concentrated sunlight from his mirror in a 3-hit beam combo. Each beam is narrow but pierces all enemies in a line. Third hit widens the beam to a cone, damaging all enemies in front.",
        "ability1": {"name": "Sacred Gate", "type": "Shield/Zone", "cd": 7, "divineCost": 30, "effect": "Open a torii gate that creates a sacred zone. Allies inside gain damage reduction and healing over time. Enemies who pass through the gate are pushed back and take spirit damage."},
        "ability2": {"name": "Sun Brand", "type": "Debuff/Damage", "cd": 9, "divineCost": 40, "effect": "Brand all enemies in front with a sacred sun-mark. Marked enemies take continuous burn damage and their attacks have 30% reduced damage for 4 seconds. The mark can be consumed by basic attacks for bonus damage."},
        "signature": {"name": "Spirit Sun", "type": "Zone Control", "cd": 18, "divineCost": 70, "effect": "Summon a miniature sun above the battlefield. The sun radiates spirit damage to all enemies in a large radius and empowers all allies with bonus damage. After 5 seconds, the sun explodes, dealing massive damage to all enemies in range."},
        "ultimate": {"name": "Amaterasu Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Amaterasu becomes the Sun Mirror for 8 seconds: his body radiates blinding sunlight in all directions. All enemies in range are continuously burned, all ally abilities are empowered, and Amaterasu's basic attacks become massive solar beams that sweep across the battlefield."},
        "passive": {"name": "Sacred Authority", "effect": "Amaterasu gains Kami Energy every time an enemy is inside one of his zones. At 5 stacks, his next beam attack is 3x wider and deals 2x damage."},
    },
    "Tsukuyomi": {
        "basicAttack": "Moon Order — Tsukuyomi strikes with moon-charged blades in a fast 4-hit combo. Each hit applies a moon-shadow debuff. Fourth hit detonates all moon-shadows, dealing bonus damage and healing Tsukuyomi.",
        "ability1": {"name": "Moon Step", "type": "Mobility", "cd": 4, "divineCost": 20, "effect": "Dash through moon-shadow, appearing behind the nearest enemy. Leaves a moon-shadow trail that damages enemies who pass through it."},
        "ability2": {"name": "Order Strike", "type": "Debuff", "cd": 8, "divineCost": 35, "effect": "Strike with moon-order energy, applying a silence debuff to all enemies in a cone. Silenced enemies cannot use special abilities for 3 seconds."},
        "signature": {"name": "Moonlit Domain", "type": "Field Control", "cd": 16, "divineCost": 65, "effect": "Create a domain of moonlight over a large area. Inside the domain, enemies are slowed and their cooldowns are extended. Tsukuyomi gains invisibility when not attacking and his attacks deal bonus moon damage."},
        "ultimate": {"name": "Tsukuyomi Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Tsukuyomi becomes the Moon Order Lord for 8 seconds: he gains massive speed, every attack applies 3 moon-shadows, all moon-shadows detonate automatically, and he can teleport to any moon-shadow on the battlefield."},
        "passive": {"name": "Moon Cycle", "effect": "Tsukuyomi gains Kami Energy every time a moon-shadow detonates. At 5 stacks, his next dash creates 3 moon-shadow trails instead of 1."},
    },
    "Susanoo": {
        "basicAttack": "Storm Script — Susanoo fires lightning-charged talismans in a 3-shot burst. Each talisman sticks to an enemy and pulses storm damage. Third shot fires a chain lightning bolt between all stuck talismans.",
        "ability1": {"name": "Storm Gate", "type": "Zone/Damage", "cd": 7, "divineCost": 30, "effect": "Place a storm-gate talisman that creates a lightning zone. Enemies inside take continuous storm damage and have their movement speed reduced. The zone lasts 5 seconds."},
        "ability2": {"name": "Thunder Call", "type": "Burst", "cd": 9, "divineCost": 40, "effect": "Call down a thunderbolt on a target area, dealing massive storm damage. The thunderbolt chains to all enemies with talisman marks, extending the damage."},
        "signature": {"name": "Raijin's Drum", "type": "Burst/CC", "cd": 18, "divineCost": 70, "effect": "Summon a massive thunder drum that creates 5 shockwave pulses over 3 seconds. Each pulse damages all enemies in range and knocks them back. Enemies hit by multiple pulses are stunned."},
        "ultimate": {"name": "Storm Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Susanoo becomes the Storm itself for 8 seconds: his body crackles with lightning, every movement leaves a storm trail, his basic attacks become thunder-chains that hit all enemies in range, and he gains 100% dodge chance."},
        "passive": {"name": "Storm Charge", "effect": "Susanoo gains Kami Energy every time his lightning chains to multiple enemies. At 5 stacks, his next thunder call hits twice."},
    },
    "Izanami": {
        "basicAttack": "Shrine Tide — Izanami attacks with water-charged shrine weapons in a 3-hit combo. Each hit creates a water ripple that damages enemies in a small area. Third hit releases a wave that pushes enemies back.",
        "ability1": {"name": "Mirror Lake", "type": "Zone/Counter", "cd": 7, "divineCost": 30, "effect": "Create a mirror-lake zone on the ground. Enemies inside are slowed and their projectiles are reflected back. Izanami gains invisibility when standing inside the lake."},
        "ability2": {"name": "Tide Break", "type": "Burst/CC", "cd": 9, "divineCost": 40, "effect": "Release a massive water burst that damages all nearby enemies and knocks them back. Enemies hit are soaked, taking bonus storm damage from all sources for 3 seconds."},
        "signature": {"name": "Sacred Tide", "type": "Field Control", "cd": 18, "divineCost": 70, "effect": "Summon a shrine-tide that floods a large area. Enemies in the flood are pushed toward the center, take continuous damage, and cannot use dash abilities. Izanami gains increased attack speed while inside the flood."},
        "ultimate": {"name": "Mirror Lake Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Izanami becomes the Mirror Lake for 8 seconds: the entire battlefield floods with sacred water. All enemies are slowed by 50%, all projectiles are reflected, and Izanami can teleport to any point in the flood. Her attacks become massive water blasts."},
        "passive": {"name": "Tide Keeper", "effect": "Izanami gains Kami Energy every time she reflects a projectile or knocks back an enemy. At 5 stacks, her next water attack creates a wave that hits all enemies on screen."},
    },
    
    # === TUATHA FACTION ===
    "Dagda": {
        "basicAttack": "Root Crown — Dagda swings his cauldron-club in a heavy 3-hit combo. Each hit creates a small root growth on the ground. Third hit causes all root growths to erupt, damaging and rooting enemies standing on them.",
        "ability1": {"name": "Cauldron Feast", "type": "Heal/Buff", "cd": 8, "divineCost": 30, "effect": "Summon the good god's cauldron, creating a feast zone. Allies inside gain healing over time and 20% damage boost. Enemies inside are slowed and take nature damage."},
        "ability2": {"name": "Root Armor", "type": "Shield", "cd": 10, "divineCost": 40, "effect": "Encase in living root armor for 4 seconds. Gain 50% damage reduction and reflect nature damage to attackers. When the armor breaks, it regenerates nearby allies."},
        "signature": {"name": "Good God's Bounty", "type": "Zone/Empower", "cd": 18, "divineCost": 70, "effect": "Create a massive sacred grove. Inside the grove, all allies gain continuous healing, damage boost, and energy regeneration. Enemies are entangled by roots and take continuous damage. Lasts 6 seconds."},
        "ultimate": {"name": "Dagda Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Dagda becomes the Good God for 8 seconds: the entire battlefield becomes a sacred grove. All allies are continuously healed, all enemies are continuously damaged by roots, and Dagda's club grows to colossal size, each swing covering a massive area."},
        "passive": {"name": "Living World", "effect": "Dagda gains Wild Growth every time a root growth erupts. At 5 stacks, his next attack plants a grove that auto-erupts."},
    },
    "Brigid": {
        "basicAttack": "Oak Pulse — Brigid fires living-oak energy in a 3-hit combo. Each hit stores a small amount of life energy. Third hit releases stored energy as a burst that heals Brigid and damages nearby enemies.",
        "ability1": {"name": "Wild Growth", "type": "Zone/Damage", "cd": 6, "divineCost": 25, "effect": "Cause thorn vines to erupt in a line, damaging and entangling enemies. The vines persist for 4 seconds as a terrain hazard."},
        "ability2": {"name": "Life Harvest", "type": "Heal/Damage", "cd": 10, "divineCost": 40, "effect": "Drain life from all nearby enemies, healing Brigid for 100% of damage dealt. Enemies hit are weakened, dealing 30% less damage for 3 seconds."},
        "signature": {"name": "Fae Restoration", "type": "Empower/Heal", "cd": 18, "divineCost": 70, "effect": "Channel fae energy into a massive restoration pulse. All allies in range are healed for 25% max HP, cleansed of debuffs, and gain 30% damage boost. All enemies in range take nature damage and are pushed back."},
        "ultimate": {"name": "Wild Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Brigid becomes the Living Oak for 8 seconds: he transforms into a massive tree-form, gaining 200% HP and becoming immobile. While in tree form, he continuously heals allies, fires homing thorn-volleys at all enemies, and all terrain near him becomes entangling roots."},
        "passive": {"name": "Adaptive Endurance", "effect": "Brigid gains Wild Growth every time he heals or is healed. At 5 stacks, his next life harvest hits all enemies on screen."},
    },
    "Morrigan": {
        "basicAttack": "Thorn Song — Morrigan fires thorn-vine projectiles in a 3-shot burst. Each projectile applies a thorn-stack. At 3 stacks, the enemy is rooted and takes continuous nature damage for 2 seconds.",
        "ability1": {"name": "Fae Glass", "type": "Shield/Counter", "cd": 7, "divineCost": 30, "effect": "Create a fae-glass barrier that blocks the next attack. When the barrier is hit, it shatters, dealing fae damage to all nearby enemies and applying 3 thorn-stacks to each."},
        "ability2": {"name": "Mist Veil", "type": "Stealth/Debuff", "cd": 9, "divineCost": 40, "effect": "Create a mist zone that grants invisibility to allies and blinds enemies. Enemies in the mist have 50% reduced accuracy and cannot target allies."},
        "signature": {"name": "Wild Domain", "type": "Field Control", "cd": 18, "divineCost": 70, "effect": "Transform a large area into a fae wild. Inside the wild, enemies are continuously damaged by thorns, their movement is erratic (random direction changes), and Morrigan gains fae-glass shields that regenerate. Lasts 6 seconds."},
        "ultimate": {"name": "Fae Queen Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Morrigan becomes the Fae Queen for 8 seconds: her body radiates fae energy. Every attack automatically applies max thorn-stacks. All enemies near her are continuously blinded and rooted. She can teleport between any fae-wild zones on the battlefield."},
        "passive": {"name": "Thorn Accumulation", "effect": "Morrigan gains Wild Growth every time a thorn-stack triggers. At 5 stacks, her next projectile volley applies 3 stacks to each enemy hit."},
    },
    "Bran": {
        "basicAttack": "Stone Break — Bran swings his massive stone weapon in a 3-hit combo. First two hits are wide cleaves. Third hit is an overhead smash that creates a shockwave, damaging all enemies in a line.",
        "ability1": {"name": "Blessing Strike", "type": "Burst/Buff", "cd": 7, "divineCost": 30, "effect": "Deliver a charged strike that deals 3x damage and applies a blessing to Bran: +20% damage for 4 seconds. The blessing stacks up to 3 times."},
        "ability2": {"name": "Stone Form", "type": "Armor/Buff", "cd": 10, "divineCost": 40, "effect": "Transform skin to living stone for 5 seconds: gain 80% damage reduction, immune to crowd control, but move at 50% speed. Attacks during stone form deal bonus damage and knock back."},
        "signature": {"name": "Bran's Blessing", "type": "AoE Empower", "cd": 18, "divineCost": 70, "effect": "Unleash a massive shockwave that damages all enemies in a huge radius and applies Bran's Blessing to all allies: +30% damage, +20% damage reduction, and immune to knockback for 5 seconds."},
        "ultimate": {"name": "Stone King Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Bran becomes the Stone King for 8 seconds: his body grows to colossal size, his weapon becomes a massive stone pillar, and each swing creates earthquakes that damage and stun all enemies on screen. He is immune to all crowd control."},
        "passive": {"name": "Blessing Accumulation", "effect": "Bran gains Wild Growth every time he applies a blessing. At 5 stacks, his next attack automatically triggers at 3x damage with no cooldown."},
    },
    
    # === EMPYREAN FACTION ===
    "Michael": {
        "basicAttack": "Holy Edge — Michael swings a white-gold blade in a 3-hit combo. Each hit releases a holy spark that damages nearby enemies. Third hit creates a holy flash that blinds all enemies in a cone for 1 second.",
        "ability1": {"name": "Holy Bastion", "type": "Shield/Zone", "cd": 8, "divineCost": 30, "effect": "Create a holy barrier around Michael that blocks all projectiles and damages enemies who touch it. Allies inside gain 30% damage reduction. Lasts 4 seconds."},
        "ability2": {"name": "Radiant Smite", "type": "Burst/Debuff", "cd": 9, "divineCost": 40, "effect": "Smite with holy fire, dealing damage in a large area. Enemies hit are branded with holy fire, taking continuous damage and having their defense reduced for 4 seconds."},
        "signature": {"name": "Seraph Throne", "type": "Zone Control", "cd": 18, "divineCost": 70, "effect": "Summon a radiant throne that creates a holy domain. Inside the domain, Michael gains super armor, his attacks become ranged holy beams, and all enemies take continuous holy damage. Lasts 6 seconds."},
        "ultimate": {"name": "Seraph Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Michael becomes the Seraph for 8 seconds: six wings of holy fire manifest, all attacks become sweeping holy beams, he gains 100% flight speed, and the entire battlefield is bathed in holy light that damages enemies and heals allies."},
        "passive": {"name": "Holy Authority", "effect": "Michael gains Holy Light every time he blocks or smites. At 5 stacks, his next holy flash becomes a screen-wide blind that damages all enemies."},
    },
    "Gabriel": {
        "basicAttack": "Opal Bolt — Gabriel fires opal-glass projectiles in a rapid 3-shot burst. Each projectile pierces and applies a holy-mark. Third shot detonates all holy-marks for bonus damage.",
        "ability1": {"name": "Holy Renewal", "type": "Resource/Heal", "cd": 6, "divineCost": 25, "effect": "Channel holy energy: instantly gain 50 Holy Light and heal for 10% max HP. Nearby allies are also healed for 5% max HP."},
        "ability2": {"name": "Sacred Lance", "type": "Burst/Pierce", "cd": 9, "divineCost": 40, "effect": "Fire a massive holy lance that pierces all enemies in a line. Enemies hit are knocked back and take bonus damage equal to their missing HP percentage."},
        "signature": {"name": "Hierarch's Decree", "type": "Zone/Empower", "cd": 18, "divineCost": 70, "effect": "Create a radiant hierarchy zone. Inside the zone, Gabriel gains +50% damage and his basic attacks become holy lances. Enemies inside are branded and take continuous holy damage. Lasts 6 seconds."},
        "ultimate": {"name": "Holy Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Gabriel becomes the Radiant Hierarch for 8 seconds: his body becomes pure holy light, his attacks become infinite-range holy beams that pierce everything, and he gains 100% dodge. All holy-marks on screen detonate continuously."},
        "passive": {"name": "Light Engine", "effect": "Gabriel gains Holy Light faster than other deities — every 3rd basic attack refunds 10 Holy Light. At max Holy Light, his next ability is free and deals 2x damage."},
    },
    "Raphael": {
        "basicAttack": "Pearl Wave — Raphael fires pearl-energy waves in a 3-hit combo. Each wave is wide but short-range. Third hit creates a large wave that pushes enemies back and applies a pearl-mark.",
        "ability1": {"name": "Holy Mirror", "type": "Counter/Reflect", "cd": 7, "divineCost": 30, "effect": "Create a holy mirror that reflects the next 3 incoming projectiles back at 200% damage. The mirror also reflects AoE abilities."},
        "ability2": {"name": "Pearl Prison", "type": "Crowd Control", "cd": 9, "divineCost": 40, "effect": "Encase all nearby enemies in pearl energy, rooting them for 2 seconds. Rooted enemies take bonus holy damage from all sources."},
        "signature": {"name": "Divine Order", "type": "Field Control", "cd": 18, "divineCost": 70, "effect": "Establish divine order in a large area. All enemies inside are forced to walk (no dashes, no teleports) and their attack speed is halved. Allies inside gain 30% movement speed and attack speed. Lasts 6 seconds."},
        "ultimate": {"name": "Order Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Raphael becomes the Divine Order for 8 seconds: all enemy movement is slowed to 30%, all enemy abilities are locked, and her pearl waves become massive screen-clearing tsunamis. She gains super armor and reflects all damage."},
        "passive": {"name": "Mirror Mastery", "effect": "Raphael gains Holy Light every time she reflects or roots an enemy. At 5 stacks, her next pearl wave covers the entire screen."},
    },
    "Uriel": {
        "basicAttack": "Black Silence — Uriel swings a black-iron blade in a 3-hit combo. Each hit applies a silence-stack. At 3 stacks, the enemy is silenced for 2 seconds and takes bonus holy damage.",
        "ability1": {"name": "Silent Strike", "type": "Debuff/Burst", "cd": 6, "divineCost": 30, "effect": "Dash through an enemy, applying 3 silence-stacks instantly. The enemy is silenced and Uriel's next attack against them is a guaranteed critical."},
        "ability2": {"name": "Black Chains", "type": "Crowd Control", "cd": 9, "divineCost": 40, "effect": "Summon black-iron chains that grab all enemies in a large area, pulling them toward Uriel. Pulled enemies are stunned for 1 second and take bonus damage."},
        "signature": {"name": "Judgment Lock", "type": "Zone/Execute", "cd": 18, "divineCost": 70, "effect": "Create a zone of black silence. All enemies inside are silenced, their abilities are locked, and they take continuous holy damage. Enemies below 30% HP inside the zone are marked for execution — Uriel's attacks against them deal 5x damage. Lasts 5 seconds."},
        "ultimate": {"name": "Black Silence Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Uriel becomes the Black Silence for 8 seconds: all enemies on screen are silenced, all enemy abilities are locked, Uriel's attacks become teleporting execution strikes that appear behind each enemy, and every kill refunds 2 seconds of duration."},
        "passive": {"name": "Silence Accumulation", "effect": "Uriel gains Holy Light every time a silence-stack triggers. At 5 stacks, his next attack silences all enemies in range for 3 seconds."},
    },
    
    # === INFERNAL DOMINION FACTION ===
    "Lucifer": {
        "basicAttack": "Black Iron Cleave — Lucifer swings a massive black-iron blade in a 3-hit combo. First two hits are wide cleaves. Third hit is a ground-slam that creates a fissure, damaging enemies in a line and applying burn.",
        "ability1": {"name": "Iron Bastion", "type": "Shield/Zone", "cd": 8, "divineCost": 30, "effect": "Raise black-iron walls on both sides, creating a fortified corridor. Enemies inside the corridor take continuous fire damage. Lucifer gains 50% damage reduction while inside. Lasts 4 seconds."},
        "ability2": {"name": "Infernal Grasp", "type": "Crowd Control/Damage", "cd": 10, "divineCost": 40, "effect": "Summon infernal chains from the ground that grab all enemies in a large area, pulling them to the center and stunning them for 2 seconds. Chain damage applies burn."},
        "signature": {"name": "Black Iron Dominion", "type": "Zone Control", "cd": 18, "divineCost": 70, "effect": "Transform the ground into black-iron court. All enemies inside are slowed by 50%, take continuous fire damage, and their defense is reduced. Lucifer gains super armor and his attacks deal bonus fire damage. Lasts 6 seconds."},
        "ultimate": {"name": "Infernal Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Lucifer becomes the Black Iron Lord for 8 seconds: his body grows to massive size, his blade becomes a colossal execution axe, each swing creates a fissure that spans the screen, and all enemies near him are continuously chained and burned."},
        "passive": {"name": "Infernal Authority", "effect": "Lucifer gains Infernal Fury every time he chains or burns an enemy. At 5 stacks, his next ground-slam creates 3 fissures instead of 1."},
    },
    "Asmodeus": {
        "basicAttack": "Ash Strike — Asmodeus fires ash-charged projectiles in a 3-shot burst. Each projectile applies an ash-stack. At 5 ash-stacks, the enemy is stunned and takes a burst of infernal damage.",
        "ability1": {"name": "Ash Engine", "type": "Resource/Buff", "cd": 6, "divineCost": 25, "effect": "Charge with infernal energy: gain 50 Infernal Fury and increase attack speed by 40% for 4 seconds. During this state, every basic attack applies 2 ash-stacks instead of 1."},
        "ability2": {"name": "Cinder Storm", "type": "Burst/AoE", "cd": 10, "divineCost": 40, "effect": "Release a storm of cinders that damages all enemies in a large radius. Enemies hit are covered in ash, taking continuous burn damage for 4 seconds and having their defense reduced."},
        "signature": {"name": "Infernal Battery", "type": "Empower/Burst", "cd": 18, "divineCost": 70, "effect": "Enter infernal overload for 6 seconds: all abilities are free, attack speed is doubled, and every attack releases a cinder burst. At the end of the overload, release all stored energy in a massive explosion that scales with damage dealt during the state."},
        "ultimate": {"name": "Ash Lord Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Asmodeus becomes the Ash Lord for 8 seconds: his body becomes a walking inferno. Every attack automatically applies max ash-stacks. All ash-stacks on screen detonate continuously. He gains 100% attack speed and immunity to crowd control. Every kill extends duration by 1 second."},
        "passive": {"name": "Ash Accumulation", "effect": "Asmodeus gains Infernal Fury every time an ash-stack triggers. At 5 stacks, his next cinder storm covers the entire screen."},
    },
    "Lilith": {
        "basicAttack": "Shadow Pulse — Lilith fires obsidian-shadow projectiles in a 3-shot burst. Each projectile applies a shadow-mark. Third shot detonates all shadow-marks, dealing bonus damage and healing Lilith.",
        "ability1": {"name": "Shadow Step", "type": "Mobility/Stealth", "cd": 5, "divineCost": 25, "effect": "Phase through shadows, teleporting a short distance and becoming invisible for 2 seconds. Next attack from stealth deals 3x damage and applies 3 shadow-marks."},
        "ability2": {"name": "Obsidian Field", "type": "Zone/Debuff", "cd": 9, "divineCost": 40, "effect": "Create a field of obsidian shadow. Enemies inside are slowed, their attacks have 50% miss chance, and they take continuous shadow damage. Lilith gains invisibility within the field."},
        "signature": {"name": "Shadow Dominion", "type": "Field Control", "cd": 18, "divineCost": 70, "effect": "Expand obsidian shadow across a large area. All enemies inside are rooted, take continuous shadow damage, and their abilities are silenced. Lilith can teleport to any point inside the dominion. Lasts 5 seconds."},
        "ultimate": {"name": "Shadow Queen Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Lilith becomes the Shadow Queen for 8 seconds: she becomes pure shadow, untargetable by enemies. She can teleport to any shadow-mark on screen, every teleport deals massive burst damage, and all enemies near her are continuously drained of HP and healed into Lilith."},
        "passive": {"name": "Shadow Accumulation", "effect": "Lilith gains Infernal Fury every time a shadow-mark detonates. At 5 stacks, her next shadow step creates 3 shadow echoes that attack independently."},
    },
    "Naamah": {
        "basicAttack": "Chain Break — Naamah swings chain-wrapped blades in a fast 4-hit combo. Each hit applies a chain-stack. Fourth hit yanks all chained enemies toward Naamah and deals bonus damage.",
        "ability1": {"name": "Chain Grasp", "type": "Mobility/CC", "cd": 5, "divineCost": 25, "effect": "Throw chains at a target, pulling Naamah to them (if large enemy) or pulling them to Naamah (if small enemy). The chained target is stunned for 1 second and takes bonus damage."},
        "ability2": {"name": "Chain Storm", "type": "Burst/AoE", "cd": 10, "divineCost": 40, "effect": "Spin with chains extended, creating a massive whirlwind that damages all enemies in range and applies chain-stacks. All chained enemies are pulled toward Naamah when the storm ends."},
        "signature": {"name": "Execution Verdict", "type": "Burst/Execute", "cd": 18, "divineCost": 70, "effect": "Mark all chained enemies for execution. Naamah unleashes a chain-storm that hits each marked enemy with a devastating strike. Damage scales with chain-stacks on each enemy. Enemies below 30% HP are instantly executed."},
        "ultimate": {"name": "Chain Lord Ascension", "type": "Ascension", "cd": 0, "ascensionCost": 100, "effect": "Naamah becomes the Chain Lord for 8 seconds: chains extend from his body in all directions, automatically grabbing all enemies on screen. He can teleport to any chained enemy, each teleport dealing massive burst damage. All chained enemies are continuously pulled toward him and take damage."},
        "passive": {"name": "Chain Accumulation", "effect": "Naamah gains Infernal Fury every time a chain-stack triggers. At 5 stacks, his next chain grasp hits all enemies in range."},
    },
}

def update_deity_combat():
    """Update all 28 deities with new combat kits."""
    with open(os.path.join(BASE, 'data', 'titans.json')) as f:
        deities = json.load(f)
    
    for d in deities:
        name = d.get('name', '')
        faction = d.get('faction', '')
        old_role = d.get('role', '')
        new_role = ROLE_MAP.get(old_role, old_role)
        
        # Get faction element/domain/resource
        fe = FACTION_ELEMENT.get(faction, {})
        element = fe.get('element', 'Unknown')
        domain = fe.get('domain', 'Unknown')
        resource = fe.get('resource', 'Divine Energy')
        
        # Get deity-specific combat kit
        kit = DEITY_COMBAT_KITS.get(name, {})
        role_kit = ROLE_COMBAT_KITS.get(new_role, {})
        
        # Update deity with new combat data
        d['role'] = new_role
        d['element'] = element
        d['divineDomain'] = domain
        d['resourceType'] = resource
        d['combatModel'] = 'one-deity-vs-many'
        d['combatKit'] = {
            'basicAttack': kit.get('basicAttack', role_kit.get('basicAttack', '')),
            'ability1': kit.get('ability1', {}),
            'ability2': kit.get('ability2', {}),
            'signature': kit.get('signature', {}),
            'ultimate': kit.get('ultimate', {}),
            'passive': kit.get('passive', {}),
            'playstyle': role_kit.get('playstyle', ''),
        }
        
        # Update stats for action combat
        stats = d.get('stats', {})
        stats['element'] = element
        stats['resource'] = resource
        d['stats'] = stats
    
    with open(os.path.join(BASE, 'data', 'titans.json'), 'w') as f:
        json.dump(deities, f, indent=2, ensure_ascii=False)
    
    print(f"Updated combat kits for {len(deities)} deities")
    return deities

def create_combat_system_doc():
    """Create the master combat system document."""
    combat_system = {
        "id": "MG-COMBAT-SYSTEM-001",
        "version": "2.0.0",
        "name": "Mythos Gates: Ascension Combat System",
        "model": "one-deity-vs-many-action-rpg",
        "designPillar": "One-Deity Power Fantasy: The player controls one active champion who carves through many enemies with readable, spectacular combat.",
        "corePrinciples": [
            "Player controls ONE deity at a time in real-time combat",
            "Face waves of enemies, elite foes, and boss encounters",
            "Combat is weighty, divine, and spectacular but visually readable",
            "Mobile-first controls: virtual joystick + ability buttons + dodge",
            "Tactical clarity: strong silhouettes, readable telegraphs, clear AoE markers",
            "Each deity has a distinct combat identity, element, and playstyle"
        ],
        "controls": {
            "movement": "Virtual joystick — 360 degree movement",
            "basicAttack": "Tap button — auto-targets nearest enemy, combo chain",
            "ability1": "Tap button — short cooldown (5-8s), tactical use",
            "ability2": "Tap button — medium cooldown (8-12s), stronger effect",
            "signature": "Tap button — long cooldown (15-20s), big impact",
            "ultimate": "Tap button — once per battle or long cooldown (60s+), cinematic",
            "dodge": "Swipe/dash — i-frames, brief invincibility, directional dodge"
        },
        "resources": {
            "divineEnergy": "Built from basic attacks and taking damage. Spent on abilities 1, 2, and Signature.",
            "ascensionGauge": "Built throughout the battle from all combat actions. At 100%, Ultimate/Ascension is unlocked.",
            "factionResource": "Each faction has a unique resource (Solar Charge, Oath Fury, Divine Glory, etc.) that powers the deity's passive ability."
        },
        "abilityKit": {
            "basicAttack": "No cooldown. Spammable. Builds Divine Energy. Unique per deity. 3-4 hit combo chain with unique properties.",
            "ability1": "Short cooldown (5-8s). Low Divine Energy cost (20-30). Tactical ability — mobility, CC, shield, or buff.",
            "ability2": "Medium cooldown (8-12s). Medium Divine Energy cost (35-45). Stronger ability — AoE, heavy damage, or sustain.",
            "signature": "Long cooldown (15-20s). High Divine Energy cost (65-75). Signature divine skill — the deity's mythic power unleashed.",
            "ultimate": "Once per battle or 60s+ cooldown. Requires 100 Ascension Gauge. Transforms the deity or unleashes full divine power. Cinematic.",
            "passive": "Always active. Builds faction resource from combat actions. At threshold, empowers next ability or attack."
        },
        "roles": {
            "Tank": "Absorb punishment, control enemy positioning, protect objectives. High HP and armor.",
            "Bruiser": "Sustained fighter that builds power over time. Balanced damage and durability.",
            "Controller": "Area denial and crowd control. Dictate where enemies can move.",
            "Breaker": "Burst damage specialist. Break through armor and execute weakened foes.",
            "Assassin": "High mobility, burst damage, strike and fade.",
            "Ranger": "Long-range damage dealer, keep distance, kite enemies.",
            "Support": "Sustain allies and debuff enemies. Force multiplier.",
            "Guardian": "Defensive interceptor. Protect area, block attacks, counter."
        },
        "elements": FACTION_ELEMENT,
        "enemyDesign": {
            "waves": "Trash mobs — easily killed by basic attacks, come in groups of 5-15",
            "elites": "Tougher enemies with special abilities — require ability usage, come in pairs or small groups",
            "bosses": "Divine trials, gate guardians, corrupted gods — require full ability rotation and dodge timing",
            "hollow": "Hollow-corrupted variants of realm enemies — twisted, dangerous, destabilized"
        },
        "combatFantasy": "One legendary god-like deity enters enemy-controlled territory alone, fights through many coordinated enemies, grows visibly stronger, and eventually destroys forces that once seemed impossible.",
        "mobileReadability": "Strong silhouettes, clear telegraph lines for enemy attacks, obvious AoE markers on the ground, large touch targets for ability buttons, readable health bars and cooldown indicators."
    }
    
    path = os.path.join(BASE, 'data', 'combat-system.json')
    with open(path, 'w') as f:
        json.dump(combat_system, f, indent=2, ensure_ascii=False)
    print(f"Created combat-system.json")

def main():
    print("=" * 60)
    print("COMBAT SYSTEM REWORK — Mythos Gates: Ascension")
    print("=" * 60)
    
    print("\n1. UPDATING DEITY COMBAT KITS")
    update_deity_combat()
    
    print("\n2. CREATING COMBAT SYSTEM DOCUMENT")
    create_combat_system_doc()
    
    print("\n" + "=" * 60)
    print("COMBAT REWORK COMPLETE")
    print("=" * 60)
    print("""
SUMMARY:
- Shifted from turn-based tactical RPG to real-time action RPG
- One-deity-vs-many combat model
- Each deity has: Basic Attack, Ability 1, Ability 2, Signature, Ultimate, Passive
- Resources: Divine Energy + Ascension Gauge + Faction Resource
- Mobile controls: joystick + buttons + dodge
- 28 unique combat kits — one per deity
- Each kit reflects the deity's mythology and combat role
- Roles: Tank, Bruiser, Controller, Breaker, Assassin, Ranger, Support, Guardian
- Elements: Solar, Storm, Thunder, Spirit, Nature, Holy, Shadow
""")

if __name__ == '__main__':
    main()
