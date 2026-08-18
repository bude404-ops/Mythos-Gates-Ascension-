#!/usr/bin/env python3
"""
Mythos Gates: Ascension — Faction Lore & Art Prompt Rework
Updates all 7 factions and 28 deity art prompts to match the new action RPG combat system
"""

import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))

# === NEW COMBAT ROLES ===
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

# === FACTION COMBAT IDENTITIES ===
FACTION_COMBAT = {
    "Aten Ra": {
        "combatStyle": "Solar Judgment — zone control, weighted strikes, and sacred ground denial. Aten Ra deities hold territory through Ma'at, turning positioning into power.",
        "combatAesthetic": "Solar hand-rays extend every strike, Ma'at scales pulse from chest anatomy, pylon shields form from light, scarab cores glow with stored dawn energy. Combat is measured, authoritative, and devastating.",
        "weaponArchetypes": "Was-sceptre blades, sun-disc khopeshes, Ma'at weighing-scale weapons, pylon shields, scarab-core resonators",
    },
    "Asgardian": {
        "combatStyle": "Storm Oath — aggressive, oath-charged combat where every strike carries thunder. Asgardian deities wade into the fray with storm power and never retreat.",
        "combatAesthetic": "Rune-carved weapons crackle with lightning, oath-shields shimmer with aurora energy, ravens trail from attacks, fate-threads weave through combos. Combat is brutal, direct, and thunderous.",
        "weaponArchetypes": "Rune-carved blades, Mjolnir-class hammers, spear-wings, oath-stone shields, fate-thread weapons",
    },
    "Olympian": {
        "combatStyle": "Divine Glory — spectacular, dominant combat where every hit is a statement. Olympian deities fight with overwhelming power and visual spectacle.",
        "combatAesthetic": "Thunder chains from every strike, aegis shields flash gold, marble-energy projectiles pierce lines, glory radiates from the body. Combat is flashy, powerful, and glorious.",
        "weaponArchetypes": "Thunder-charged spears, aegis shields, marble-energy bows, war-spears, divine lances",
    },
    "Kami": {
        "combatStyle": "Sacred Threshold — precise, spirit-charged combat that respects boundaries. Kami deities fight with millimeter precision and spiritual devastation.",
        "combatAesthetic": "Torii gates manifest in combat, moon-shadow trails behind dashes, storm-talismans stick to enemies, shrine-tides flood the battlefield. Combat is precise, elegant, and otherworldly.",
        "weaponArchetypes": "Mirror-weapons, moon-charged blades, storm-script talismans, shrine-tide weapons, Totsuka swords",
    },
    "Tuatha": {
        "combatStyle": "Living Wild — adaptive, nature-charged combat where the battlefield itself fights for you. Tuatha deities grow stronger as terrain changes.",
        "combatAesthetic": "Root growths erupt from every strike, cauldron-energy heals allies, thorn-vines entangle enemies, the ground itself becomes a weapon. Combat is organic, growing, and relentless.",
        "weaponArchetypes": "Cauldron-clubs, root-iron claws, thorn-vine projectiles, forge-fire weapons, light-spears",
    },
    "Empyrean": {
        "combatStyle": "Holy Order — disciplined, radiant combat that burns away corruption. Empyrean deities fight with absolute authority and divine light.",
        "combatAesthetic": "Holy beams pierce enemies, wings of fire manifest during ultimates, sacred barriers block all darkness, light reflects from every surface. Combat is righteous, blinding, and absolute.",
        "weaponArchetypes": "Flaming swords, holy lances, opal-glass projectiles, divine spears, aegis trumpets",
    },
    "Infernal Dominion": {
        "combatStyle": "Chain Dominion — aggressive, controlling combat that pulls enemies in and never lets go. Infernal deities fight with chains, fire, and shadow.",
        "combatAesthetic": "Black-iron chains extend from the body, shadow-step trails linger, infernal fire burns the ground, obsidian fields swallow enemies. Combat is oppressive, consuming, and inescapable.",
        "weaponArchetypes": "Black-iron execution blades, chain-wrapped weapons, obsidian-shadow projectiles, charm-energy, infernal hammers",
    },
}

# === FACTION LORE ENRICHMENT ===
# New lore elements that match the action RPG model
FACTION_LORE = {
    "Aten Ra": {
        "combatPhilosophy": "Hold the field through Ma'at: solar command zones, judgment beams, renewal engines, river sustain, desert disruption, lion interception, hidden-name execution, and anti-chaos rites against Isfet. In one-deity combat, the Aten Ra champion controls the battlefield through sacred zones — every ability plants judgment ground that punishes enemies.",
        "actionCombatRole": "Zone Controllers — Aten Ra deities excel at territorial dominance, creating sacred zones that amplify their power and weaken enemies. Their combat fantasy is an immovable solar judge who turns the battlefield into a court of Ma'at.",
        "keyCombatFantasy": "You are the judge. Enemies enter your zone and are weighed. The guilty are struck down. The battlefield is your courtroom.",
    },
    "Asgardian": {
        "combatPhilosophy": "Storm-charged aggression: oath-bound combat where every strike carries thunder and every block returns lightning. Asgardian deities wade into enemy waves with storm power, fate-weaving, and unbreakable resolve.",
        "actionCombatRole": "Storm Bruisers — Asgardian deities are frontline fighters who build power through combat, becoming unstoppable as they take and deal damage. Their combat fantasy is a storm god who grows stronger with every hit.",
        "keyCombatFantasy": "You are the storm. Every hit thunders. Every block returns lightning. The more you fight, the stronger you become.",
    },
    "Olympian": {
        "combatPhilosophy": "Glory through spectacle: every attack is a statement of divine excellence. Olympian deities fight with overwhelming power, chain lightning, and visual dominance that makes enemies falter before the hit lands.",
        "actionCombatRole": "Glory Fighters — Olympian deities blend power and spectacle, dealing massive burst damage with thunder-charged attacks. Their combat fantasy is a god whose every attack is a legendary feat.",
        "keyCombatFantasy": "You are the spectacle. Thunder chains from your spear. Your shield flashes with the power of Olympus. Every hit is a story.",
    },
    "Kami": {
        "combatPhilosophy": "Sacred precision: every boundary is alive, every threshold is a weapon. Kami deities fight with spirit-charged precision, phasing through reality and striking from impossible angles.",
        "actionCombatRole": "Spirit Strikers — Kami deities blend mobility and precision, phasing through enemies and striking from the spirit realm. Their combat fantasy is a divine being who exists between worlds.",
        "keyCombatFantasy": "You are the threshold. You step through moon-shadow and appear behind your enemy. The spirit world is your weapon.",
    },
    "Tuatha": {
        "combatPhilosophy": "Living adaptation: the battlefield is alive and fights for you. Tuatha deities grow root-growth terrain, heal through nature, and transform the ground into a weapon that entangles and consumes enemies.",
        "actionCombatRole": "Wild Shapers — Tuatha deities control terrain and sustain, growing the battlefield into a living weapon. Their combat fantasy is a nature god who makes the earth itself fight.",
        "keyCombatFantasy": "You are the wild. Roots erupt where you walk. The ground itself swallows your enemies. You grow stronger as the battle transforms.",
    },
    "Empyrean": {
        "combatPhilosophy": "Radiant authority: order must be sung into existence every moment. Empyrean deities fight with holy fire, sacred barriers, and blinding light that burns away corruption and darkness.",
        "actionCombatRole": "Holy Avengers — Empyrean deities combine righteous damage with protective barriers, burning enemies while shielding allies. Their combat fantasy is a divine being of pure light.",
        "keyCombatFantasy": "You are the light. Darkness breaks against you. Your wings burn with holy fire. You are the will of the divine made manifest.",
    },
    "Infernal Dominion": {
        "combatPhilosophy": "Chain and consume: power is debt with teeth. Infernal Dominion deities pull enemies in with chains, trap them in shadow, and burn them with infernal fire. No one escapes once the chains are out.",
        "actionCombatRole": "Chain Tyrants — Infernal Dominion deities control and execute, pulling enemies into kill zones and trapping them with shadow and fire. Their combat fantasy is an inescapable lord of chains.",
        "keyCombatFantasy": "You are the chain. You pull, you trap, you consume. No one leaves once you've marked them. The shadow takes everything.",
    },
}

def update_faction_lore():
    """Update all 7 factions with new combat lore."""
    with open(os.path.join(BASE, 'data', 'factions.json')) as f:
        factions = json.load(f)
    
    for fac in factions:
        name = fac.get('name', '')
        
        # Add new combat identity fields
        combat = FACTION_COMBAT.get(name, {})
        lore = FACTION_LORE.get(name, {})
        
        fac['combatStyle'] = combat.get('combatStyle', '')
        fac['combatAesthetic'] = combat.get('combatAesthetic', '')
        fac['weaponArchetypes'] = combat.get('weaponArchetypes', '')
        fac['actionCombatRole'] = lore.get('actionCombatRole', '')
        fac['keyCombatFantasy'] = lore.get('keyCombatFantasy', '')
        fac['combatPhilosophy'] = lore.get('combatPhilosophy', fac.get('combatPhilosophy', ''))
        fac['combatModel'] = 'one-deity-vs-many'
        
        # Update art status
        fac['artStatus'] = 'Needs Rework'
        fac['updated'] = '2026-08-18'
    
    with open(os.path.join(BASE, 'data', 'factions.json'), 'w') as f:
        json.dump(factions, f, indent=2, ensure_ascii=False)
    
    print(f"Updated {len(factions)} faction lore entries")

def update_art_prompts():
    """Update all 28 deity art prompts with new combat roles and action RPG aesthetic."""
    with open(os.path.join(BASE, 'data', 'art-prompts.json')) as f:
        prompts = json.load(f)
    
    with open(os.path.join(BASE, 'data', 'titans.json')) as f:
        deities = json.load(f)
    
    # Build deity lookup
    deity_map = {d['name']: d for d in deities}
    
    updated = 0
    for prompt in prompts:
        entity = prompt.get('entity', '')
        deity = deity_map.get(entity)
        
        if not deity:
            continue
        
        # Update combat role in prompt text
        old_role = deity.get('role', '')
        # Find the old role in the prompt text and replace
        prompt_text = prompt.get('prompt', '')
        
        # Replace old role references with new roles
        for old, new in ROLE_MAP.items():
            prompt_text = prompt_text.replace(f"Combat role: {old}", f"Combat role: {new}")
            prompt_text = prompt_text.replace(f"combat role: {old}", f"combat role: {new}")
        
        # Replace "tactical RPG" with "action RPG"
        prompt_text = prompt_text.replace("tactical RPG", "action RPG")
        prompt_text = prompt_text.replace("Tactical RPG", "Action RPG")
        
        # Replace "premium stylized tactical RPG aesthetic" 
        prompt_text = prompt_text.replace("premium stylized tactical RPG aesthetic", "premium stylized action RPG aesthetic")
        
        # Add combat kit reference if not present
        kit = deity.get('combatKit', {})
        if kit and "Combat Kit:" not in prompt_text:
            combat_addition = f"\n\nCombat Kit (Action RPG): Basic Attack: {kit.get('basicAttack', 'Unique 3-hit combo').split('—')[0].strip()}. Ability 1: {kit.get('ability1', {}).get('name', '?')} [{kit.get('ability1', {}).get('type', '?')}, CD {kit.get('ability1', {}).get('cd', '?')}s]. Ability 2: {kit.get('ability2', {}).get('name', '?')} [{kit.get('ability2', {}).get('type', '?')}, CD {kit.get('ability2', {}).get('cd', '?')}s]. Signature: {kit.get('signature', {}).get('name', '?')} [{kit.get('signature', {}).get('type', '?')}, CD {kit.get('signature', {}).get('cd', '?')}s]. Ultimate/Ascension: {kit.get('ultimate', {}).get('name', '?')}. Passive: {kit.get('passive', {}).get('name', '?')}. The character's visual design must reflect their combat kit — weapons, energy effects, and body language should match their abilities."
            prompt_text += combat_addition
        
        # Add element and domain
        element = deity.get('element', '')
        domain = deity.get('divineDomain', '')
        if element and f"Element: {element}" not in prompt_text:
            prompt_text = prompt_text.replace(
                f"Combat role: {deity.get('role', '')}",
                f"Combat role: {deity.get('role', '')}. Element: {element}. Divine Domain: {domain}."
            )
        
        # Add action combat fantasy
        faction = deity.get('faction', '')
        fac_data = FACTION_COMBAT.get(faction, {})
        combat_aesthetic = fac_data.get('combatAesthetic', '')
        if combat_aesthetic and "Combat Aesthetic:" not in prompt_text:
            prompt_text += f"\n\nCombat Aesthetic: {combat_aesthetic}"
        
        prompt['prompt'] = prompt_text
        prompt['status'] = 'reworked'
        prompt['combatModel'] = 'one-deity-vs-many'
        prompt['updated'] = '2026-08-18'
        
        updated += 1
    
    with open(os.path.join(BASE, 'data', 'art-prompts.json'), 'w') as f:
        json.dump(prompts, f, indent=2, ensure_ascii=False)
    
    print(f"Updated {updated} art prompts")

def update_faction_visual_bible():
    """Update the faction visual bible with action combat aesthetics."""
    path = os.path.join(BASE, 'data', 'faction-visual-bible.json')
    with open(path) as f:
        bible = json.load(f)
    
    # Update to reference action RPG combat
    if isinstance(bible, dict):
        bible['combatModel'] = 'one-deity-vs-many'
        bible['updated'] = '2026-08-18'
    elif isinstance(bible, list):
        for entry in bible:
            if isinstance(entry, dict):
                entry['combatModel'] = 'one-deity-vs-many'
                entry['updated'] = '2026-08-18'
    
    with open(path, 'w') as f:
        json.dump(bible, f, indent=2, ensure_ascii=False)
    
    print("Updated faction visual bible")

def update_master_art_direction():
    """Update the master art direction system for action RPG."""
    path = os.path.join(BASE, 'data', 'master-art-direction-system.json')
    with open(path) as f:
        mad = json.load(f)
    
    # Update game identity
    mad['genre'] = 'Mythology-driven action RPG (one-deity-vs-many)'
    mad['updated'] = '2026-08-18'
    
    # Update combat references
    if 'currentGameIdentity' in mad:
        mad['currentGameIdentity']['genre'] = 'Mythology-driven action RPG (one-deity-vs-many)'
    
    # Add action combat section
    mad['actionCombatArtRules'] = {
        "combatRole": "Each deity has a combat role (Tank, Bruiser, Controller, Breaker, Assassin, Ranger, Support, Guardian) that must be visible in their silhouette and weapon design",
        "abilityVisuals": "Each deity's abilities must be visually distinctive — basic attacks, active abilities, signatures, and ultimates should each have unique visual signatures",
        "elementExpression": "Each deity's element (Solar, Storm, Thunder, Spirit, Nature, Holy, Shadow) must be visible in energy effects, particle colors, and material glow",
        "ultimateTransformation": "Each deity's ultimate/ascension form should be a visual transformation that makes the deity look fundamentally different and more powerful",
        "mobileReadability": "Strong silhouettes, clear telegraph lines, obvious AoE markers — the character must be readable at mobile screen size during fast action combat",
    }
    
    with open(path, 'w') as f:
        json.dump(mad, f, indent=2, ensure_ascii=False)
    
    print("Updated master art direction system")

def main():
    print("=" * 60)
    print("FACTION LORE & ART PROMPT REWORK")
    print("Mythos Gates: Ascension — Action RPG Combat")
    print("=" * 60)
    
    print("\n1. UPDATING FACTION LORE")
    update_faction_lore()
    
    print("\n2. UPDATING ART PROMPTS (28 deities)")
    update_art_prompts()
    
    print("\n3. UPDATING FACTION VISUAL BIBLE")
    update_faction_visual_bible()
    
    print("\n4. UPDATING MASTER ART DIRECTION")
    update_master_art_direction()
    
    print("\n" + "=" * 60)
    print("REWORK COMPLETE")
    print("=" * 60)
    
    # Summary
    with open(os.path.join(BASE, 'data', 'factions.json')) as f:
        factions = json.load(f)
    
    print("\nFACTION COMBAT IDENTITIES:")
    for fac in factions:
        print(f"\n  {fac['name']}")
        print(f"    Combat Style: {fac.get('combatStyle', '')[:100]}")
        print(f"    Action Role: {fac.get('actionCombatRole', '')[:100]}")
        print(f"    Fantasy: {fac.get('keyCombatFantasy', '')[:100]}")
    
    with open(os.path.join(BASE, 'data', 'art-prompts.json')) as f:
        prompts = json.load(f)
    print(f"\n\nART PROMPTS: {len(prompts)} total, {sum(1 for p in prompts if p.get('status') == 'reworked')} reworked")

if __name__ == '__main__':
    main()
