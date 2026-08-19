#!/usr/bin/env python3
"""
Mythos Gates: Ascension — Full Migration Script
Transforms the entire repo from Titans Gate (63 titans) to Mythos Gates: Ascension (28 deities)

Changes:
1. Title: Titans Gate → Mythos Gates: Ascension
2. Roster: 63 titans → 28 deities (4 per faction × 7 factions)
3. Language: Titan → Deity/Divine Champion/Ascendant
4. Combat: one-titan-vs-many → one-deity-vs-many
5. Campaign: 8 campaigns → 7 realm campaigns
6. Tone: generic fantasy → mythological dark-fantasy / divine-cinematic
7. Terminology: gates, realms, trials, Hollow, ascension, relics, pantheon
"""

import json
import os
import re
import shutil

BASE = os.path.dirname(os.path.abspath(__file__))

# === 28 DEITY SELECTION (4 per faction) ===
KEEP_IDS = [
    # Aten Ra
    "MG-TITAN-001", "MG-TITAN-002", "MG-TITAN-003", "MG-TITAN-004",
    # Asgardian
    "MG-TITAN-010", "MG-TITAN-011", "MG-TITAN-012", "MG-TITAN-013",
    # Olympian
    "MG-TITAN-019", "MG-TITAN-020", "MG-TITAN-021", "MG-TITAN-022",
    # Kami
    "MG-TITAN-028", "MG-TITAN-029", "MG-TITAN-030", "MG-TITAN-031",
    # Tuatha
    "MG-TITAN-037", "MG-TITAN-038", "MG-TITAN-039", "MG-TITAN-040",
    # Empyrean
    "MG-TITAN-046", "MG-TITAN-047", "MG-TITAN-048", "MG-TITAN-049",
    # Infernal Dominion
    "MG-TITAN-055", "MG-TITAN-056", "MG-TITAN-057", "MG-TITAN-058",
]

# Map old titan IDs to new deity IDs
ID_MAP = {}
for old_id in KEEP_IDS:
    num = old_id.split('-')[-1]
    new_num = str(int(num))  # Remove leading zeros for clean IDs
    new_id = f"MG-DEITY-{new_num.zfill(3)}"
    ID_MAP[old_id] = new_id

# === LANGUAGE REPLACEMENTS ===
# Order matters — longer patterns first
REPLACEMENTS = [
    # Title
    ("Titans Gate: Ascension", "Mythos Gates: Ascension"),
    ("Titans Gate", "Mythos Gates: Ascension"),
    ("TITANS GATE", "MYTHOS GATES: ASCENSION"),
    ("titans gate", "mythos gates: ascension"),
    
    # Combat system
    ("one-titan-vs-many", "one-deity-vs-many"),
    ("One-Titan-vs-Many", "One-Deity-vs-Many"),
    ("one titan vs many", "one deity vs many"),
    ("One Titan vs Many", "One Deity vs Many"),
    ("solo-titan", "solo-deity"),
    ("Solo-Titan", "Solo-Deity"),
    ("solo titan", "solo deity"),
    ("Solo Titan", "Solo Deity"),
    
    # ID replacements
    ("MG-TITAN-", "MG-DEITY-"),
    ("MG-SOLO-TITAN-", "MG-SOLO-DEITY-"),
    
    # Plural forms first
    ("active Titans", "active deities"),
    ("active titans", "active deities"),
    ("many Titans", "many deities"),
    ("many titans", "many deities"),
    ("all Titans", "all deities"),
    ("all titans", "all deities"),
    ("other Titans", "other deities"),
    ("other titans", "other deities"),
    ("63 Titans", "28 Deities"),
    ("63 titans", "28 deities"),
    ("nine Titans", "four Deities"),
    ("Nine Titans", "Four Deities"),
    ("Three Titans", "Active Deity"),
    ("three Titans", "active deity"),
    
    # Titan-specific compound terms
    ("titan-art-identity", "deity-art-identity"),
    ("Titan-Art-Identity", "Deity-Art-Identity"),
    ("titan-role-matrix", "deity-role-matrix"),
    ("Titan-Role-Matrix", "Deity-Role-Matrix"),
    ("titan-trial-system", "deity-trial-system"),
    ("Titan-Trial-System", "Deity-Trial-System"),
    ("titan-enemy-balance", "deity-enemy-balance"),
    ("titan-art-dna", "deity-art-dna"),
    ("titanArtDna", "deityArtDna"),
    ("TitanArtDna", "DeityArtDna"),
    ("titan-gate", "mythos-gate"),
    ("Titan-Gate", "Mythos-Gate"),
    ("Titan Gate", "Mythos Gate"),
    
    # Core Titan → Deity (playable character references)
    ("Titan roster", "Deity roster"),
    ("titan roster", "deity roster"),
    ("Titan Roster", "Deity Roster"),
    ("Titan slot", "Deity slot"),
    ("titan slot", "deity slot"),
    ("Titan Slot", "Deity Slot"),
    ("Titan campaign", "Realm campaign"),
    ("titan campaign", "realm campaign"),
    ("Titan Campaign", "Realm Campaign"),
    ("playable Titan", "playable Deity"),
    ("playable titan", "playable deity"),
    ("Playable Titan", "Playable Deity"),
    ("unlock this Titan", "unlock this Deity"),
    ("unlock this titan", "unlock this deity"),
    ("command this Titan", "command this Deity"),
    ("commanding Titans", "commanding Deities"),
    ("commanding titans", "commanding deities"),
    ("each Titan", "each Deity"),
    ("Each Titan", "Each Deity"),
    ("every Titan", "every Deity"),
    ("Every Titan", "Every Deity"),
    ("a Titan", "a Deity"),
    ("a titan", "a deity"),
    ("the Titan", "the Deity"),
    ("The Titan", "The Deity"),
    ("this Titan", "this Deity"),
    ("This Titan", "This Deity"),
    ("your Titan", "your Deity"),
    ("Your Titan", "Your Deity"),
    ("new Titan", "new Deity"),
    ("New Titan", "New Deity"),
    
    # Standalone capitalized (careful — only when clearly referring to the character type)
    ("Titans", "Deities"),
    ("titan", "deity"),
    ("Titan", "Deity"),
]

def apply_replacements(text):
    """Apply all text replacements to a string."""
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text

def process_json_file(filepath, dry_run=False):
    """Process a JSON file: apply replacements and filter titan references."""
    try:
        with open(filepath) as f:
            content = f.read()
        
        # Check if file references any titan IDs that are being dropped
        data = json.loads(content)
        
        # Apply text replacements to the raw content
        new_content = apply_replacements(content)
        
        if new_content != content:
            if not dry_run:
                with open(filepath, 'w') as f:
                    f.write(new_content)
            return True
        return False
    except Exception as e:
        print(f"  ERROR processing {filepath}: {e}")
        return False

def filter_titans_json(filepath, dry_run=False):
    """Filter titans.json to only keep the 28 selected deities."""
    with open(filepath) as f:
        titans = json.load(f)
    
    tlist = titans if isinstance(titans, list) else [titans]
    
    # Filter to 28 deities
    kept = [t for t in tlist if t.get('id') in KEEP_IDS]
    
    # Update IDs
    for t in kept:
        old_id = t.get('id', '')
        if old_id in ID_MAP:
            t['id'] = ID_MAP[old_id]
        
        # Update any titan-specific fields
        if 'titanArtDna' in t:
            t['deityArtDna'] = t.pop('titanArtDna')
        if 'artPromptId' in t:
            old_prompt = t['artPromptId']
            t['artPromptId'] = old_prompt.replace('MG-PROMPT-', 'MG-PROMPT-').replace('MG-TITAN-', 'MG-DEITY-')
        if 'backstoryId' in t:
            t['backstoryId'] = t['backstoryId'].replace('MG-BACKSTORY-TITAN-', 'MG-BACKSTORY-DEITY-')
        if 'titanArtDna' in t:
            t.pop('titanArtDna', None)
    
    # Update count
    if isinstance(titans, list):
        result = kept
    else:
        result = kept[0] if kept else {}
    
    if not dry_run:
        with open(filepath, 'w') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"  Filtered titans.json: {len(tlist)} → {len(kept)} deities")
    return kept

def rename_directories(base_dir, dry_run=False):
    """Rename directories containing 'Titan' or 'Titans' in their names."""
    renames = []
    
    # Rename 3D_Blueprints/Characters/Titans → Deities
    old_titans_dir = os.path.join(base_dir, '3D_Blueprints', 'Characters', 'Titans')
    new_deities_dir = os.path.join(base_dir, '3D_Blueprints', 'Characters', 'Deities')
    if os.path.exists(old_titans_dir):
        renames.append((old_titans_dir, new_deities_dir))
    
    # Rename individual TITAN_ directories to DEITY_ and filter to 28
    if os.path.exists(old_titans_dir):
        for item in os.listdir(old_titans_dir):
            if item.startswith('TITAN_'):
                # Extract the number
                parts = item.split('_')
                num = parts[1]  # e.g., "001"
                titan_id = f"MG-TITAN-{num}"
                
                old_path = os.path.join(old_titans_dir, item)
                
                if titan_id in KEEP_IDS:
                    # Rename to DEITY_
                    new_name = item.replace('TITAN_', 'DEITY_')
                    new_path = os.path.join(new_deities_dir, new_name)
                    renames.append((old_path, new_path))
                else:
                    # Remove dropped titans
                    if not dry_run:
                        shutil.rmtree(old_path)
                    print(f"  Removed dropped: {item}")
    
    # Rename battlefield with "titan-gate" in name
    bf_dir = os.path.join(base_dir, '3D_Blueprints', 'Battlefields')
    if os.path.exists(bf_dir):
        for item in os.listdir(bf_dir):
            if 'titan-gate' in item.lower() or 'titan' in item.lower():
                old_path = os.path.join(bf_dir, item)
                new_name = item.replace('titan-gate', 'mythos-gate').replace('titan', 'mythos').replace('Titan', 'Mythos')
                new_path = os.path.join(bf_dir, new_name)
                if old_path != new_path:
                    renames.append((old_path, new_path))
    
    # Execute renames
    for old_path, new_path in renames:
        if old_path != new_path and os.path.exists(old_path):
            if not dry_run:
                os.makedirs(os.path.dirname(new_path), exist_ok=True)
                shutil.move(old_path, new_path)
            print(f"  Renamed: {os.path.basename(old_path)} → {os.path.basename(new_path)}")
    
    return renames

def update_project_json(filepath, dry_run=False):
    """Update project.json with new identity."""
    with open(filepath) as f:
        d = json.load(f)
    
    d['name'] = 'Mythos Gates: Ascension'
    d['formerTitle'] = 'Titans Gate'
    d['deityCount'] = 28
    d['realmCampaignCount'] = 7
    d['missionCount'] = 280
    d['designPillars'] = [
        "Mythic Ascension: The player climbs through divine trials and fractured realms toward greater power.",
        "One-Deity Power Fantasy: The player controls one active champion who carves through many enemies with readable, spectacular combat.",
        "Realm-Hopping Campaign: The Mythos Gates connect distinct mythological worlds, each with unique missions and threats.",
        "Hollow Corruption: A dark existential pressure invades, corrupts, and destabilizes realms, enemies, gods, and gates.",
        "Premium Mobile + UE5 Feel: Understandable on mobile but visually ambitious, cinematic, and collectible.",
        "28 Divine Champions: Broad, distinct roster built for mastery, upgrades, and ascension.",
        "Tactical Clarity: Epic effects but combat readability and player control remain essential."
    ]
    d['artDirection'] = {
        "style": "mythological dark-fantasy / divine-cinematic",
        "elements": [
            "ancient mythic architecture", "divine relics", "ruined temples",
            "cosmic gates", "glowing sigils", "realm-specific biomes",
            "sacred golds and stone", "abyssal Hollow corruption",
            "cinematic lighting", "high-contrast silhouettes"
        ],
        "tone": "Premium, collectible, epic. Balance divine grandeur with dark existential threat. Not cartoonish.",
        "mobileReadability": "Strong contrast, clean UI hierarchy, simple navigation, large touch targets, readable text, obvious action states."
    }
    d['terminology'] = {
        "prefer": ["Mythos Gates", "Ascension", "deity", "divine champion", "ascendant", "realm", "gate", "trial", "Hollow", "divine skill", "mythic power", "relic", "pantheon", "mythic convergence"],
        "avoid": ["Titans Gate as current title", "Titan-only framing", "many Titans active at once", "generic fantasy party language", "overly sci-fi framing"]
    }
    
    if not dry_run:
        with open(filepath, 'w') as f:
            json.dump(d, f, indent=2, ensure_ascii=False)
    print(f"  Updated project.json: Mythos Gates: Ascension, 28 deities, 7 realm campaigns")

def update_solo_combat_docs(base_dir, dry_run=False):
    """Update combat documentation to one-deity-vs-many language."""
    combat_files = [
        'data/one-titan-vs-many-combat.json',
        'data/solo-combat-design-document.json',
        'data/solo-titan-migration-report.json',
        'data/solo-titan-roster-redesign.json',
        'data/solo-vertical-slice.json',
        'data/solo-battle-state-schema.json',
        'data/combat-first-gameplay-doctrine.json',
        'data/titan-enemy-balance-pass.json',
        'data/titan-trial-system.json',
        'data/titan-role-matrix.json',
        'data/titan-art-identity-audit.json',
    ]
    
    for f in combat_files:
        fpath = os.path.join(base_dir, f)
        if os.path.exists(fpath):
            process_json_file(fpath, dry_run)
    
    # Rename files
    renames = [
        ('data/one-titan-vs-many-combat.json', 'data/one-deity-vs-many-combat.json'),
        ('data/solo-titan-migration-report.json', 'data/solo-deity-migration-report.json'),
        ('data/solo-titan-roster-redesign.json', 'data/solo-deity-roster-redesign.json'),
        ('data/titan-enemy-balance-pass.json', 'data/deity-enemy-balance-pass.json'),
        ('data/titan-trial-system.json', 'data/deity-trial-system.json'),
        ('data/titan-role-matrix.json', 'data/deity-role-matrix.json'),
        ('data/titan-art-identity-audit.json', 'data/deity-art-identity-audit.json'),
    ]
    
    for old_rel, new_rel in renames:
        old_path = os.path.join(base_dir, old_rel)
        new_path = os.path.join(base_dir, new_rel)
        if os.path.exists(old_path) and old_path != new_path:
            if not dry_run:
                shutil.move(old_path, new_path)
            print(f"  Renamed: {old_rel} → {new_rel}")

def update_roster_depth_map(base_dir, dry_run=False):
    """Update roster depth map to 28 deities."""
    fpath = os.path.join(base_dir, 'data/roster-depth-map.json')
    if not os.path.exists(fpath):
        return
    
    with open(fpath) as f:
        d = json.load(f)
    
    # Update count
    d['count'] = 28
    
    # Filter role coverage to only kept deities
    if 'roleCoverage' in d:
        for role, info in d['roleCoverage'].items():
            if 'titanIds' in info:
                # Map old IDs to new, filter to kept
                new_ids = [ID_MAP.get(tid, tid) for tid in info['titanIds'] if tid in KEEP_IDS]
                info['titanIds'] = new_ids
                info['count'] = len(new_ids)
                # Rename key
                if 'titanIds' in info:
                    info['deityIds'] = info.pop('titanIds')
    
    if not dry_run:
        with open(fpath, 'w') as f:
            json.dump(d, f, indent=2, ensure_ascii=False)
    print(f"  Updated roster-depth-map.json: 28 deities")

def remove_dropped_titan_files(base_dir, dry_run=False):
    """Remove art prompts, backstories, and 3D blueprints for dropped titans."""
    removed = 0
    
    # Art prompts
    art_dir = os.path.join(base_dir, 'art', 'prompts')
    if os.path.exists(art_dir):
        for f in os.listdir(art_dir):
            if f.startswith('MG-PROMPT-') and f.endswith('.json'):
                num = f.replace('MG-PROMPT-', '').replace('.json', '')
                titan_id = f"MG-TITAN-{num}"
                if titan_id not in KEEP_IDS:
                    fpath = os.path.join(art_dir, f)
                    if not dry_run:
                        os.remove(fpath)
                    removed += 1
    
    # Backstories
    bs_dir = os.path.join(base_dir, 'backstories', 'titans')
    if os.path.exists(bs_dir):
        for f in os.listdir(bs_dir):
            if f.startswith('MG-BACKSTORY-TITAN-') and f.endswith('.json'):
                num = f.replace('MG-BACKSTORY-TITAN-', '').replace('.json', '')
                titan_id = f"MG-TITAN-{num}"
                if titan_id not in KEEP_IDS:
                    fpath = os.path.join(bs_dir, f)
                    if not dry_run:
                        os.remove(fpath)
                    removed += 1
    
    # Rename kept backstory files
    bs_dir = os.path.join(base_dir, 'backstories', 'titans')
    bs_new_dir = os.path.join(base_dir, 'backstories', 'deities')
    if os.path.exists(bs_dir):
        if not dry_run:
            os.makedirs(bs_new_dir, exist_ok=True)
        for f in os.listdir(bs_dir):
            if f.startswith('MG-BACKSTORY-TITAN-') and f.endswith('.json'):
                num = f.replace('MG-BACKSTORY-TITAN-', '').replace('.json', '')
                titan_id = f"MG-TITAN-{num}"
                if titan_id in KEEP_IDS:
                    old_path = os.path.join(bs_dir, f)
                    new_name = f.replace('MG-BACKSTORY-TITAN-', 'MG-BACKSTORY-DEITY-')
                    new_path = os.path.join(bs_new_dir, new_name)
                    if not dry_run:
                        shutil.move(old_path, new_path)
    
    # Rename kept art prompt files
    art_dir = os.path.join(base_dir, 'art', 'prompts')
    if os.path.exists(art_dir):
        for f in list(os.listdir(art_dir)):
            if f.startswith('MG-PROMPT-') and f.endswith('.json'):
                num = f.replace('MG-PROMPT-', '').replace('.json', '')
                titan_id = f"MG-TITAN-{num}"
                if titan_id in KEEP_IDS:
                    old_path = os.path.join(art_dir, f)
                    new_name = f.replace('MG-PROMPT-', 'MG-PROMPT-')
                    new_path = os.path.join(art_dir, new_name)
                    if not dry_run:
                        shutil.move(old_path, new_path)
    
    print(f"  Removed {removed} dropped titan files, renamed kept files")
    return removed

def update_all_json_content(base_dir, dry_run=False):
    """Apply text replacements to all JSON files in the repo."""
    updated = 0
    errors = 0
    
    for root, dirs, files in os.walk(base_dir):
        # Skip .git
        if '.git' in root:
            continue
        
        for f in files:
            if f.endswith('.json'):
                fpath = os.path.join(root, f)
                if process_json_file(fpath, dry_run):
                    updated += 1
    
    return updated

def create_ascension_system(base_dir, dry_run=False):
    """Create/update the ascension progression system."""
    ascension = {
        "id": "MG-ASCENSION-SYSTEM-001",
        "version": "2.0.0",
        "name": "Mythos Gates: Ascension Progression System",
        "designPillar": "Mythic Ascension: The player climbs through divine trials and fractured realms toward greater power.",
        "progressionStages": [
            {
                "stage": "Awakening",
                "description": "The deity awakens through the first Mythos Gate, gaining base power and combat identity.",
                "unlockRequirements": "Complete first realm campaign mission",
                "rewards": "Base abilities, first weapon unlock"
            },
            {
                "stage": "Trials",
                "description": "The deity proves worth through divine trials in each realm, mastering combat and mythic power.",
                "unlockRequirements": "Complete realm campaign",
                "rewards": "Ability upgrades, relic unlocks, ascension materials"
            },
            {
                "stage": "Convergence",
                "description": "The deity faces mythic convergence — multiple realm threats merging through the Gates.",
                "unlockRequirements": "Complete 3 realm campaigns",
                "rewards": "Signature divine skill, enhanced ultimate"
            },
            {
                "stage": "Ascension",
                "description": "The deity achieves full ascension, unlocking ultimate power and the final gate threshold.",
                "unlockRequirements": "Complete all 7 realm campaigns",
                "rewards": "Full ascension form, ultimate divine skill, endgame content access"
            }
        ],
        "deityProgression": {
            "levels": "1-60 per deity",
            "ascensionTiers": ["Awakened", "Trial-Bound", "Convergence-Marked", "Ascendant"],
            "upgradePaths": ["Combat abilities", "Divine skills", "Relics", "Mythic power"],
            "masterySystem": "Each deity has unique mastery breakpoints at levels 10, 20, 30, 40, 50, 60"
        },
        "gateSystem": {
            "function": "Mythos Gates connect realms, serve as campaign entrances, fast travel, trials, boss locks, and ascension thresholds",
            "gateTypes": ["Realm Gate", "Trial Gate", "Boss Gate", "Ascension Gate", "Fast Travel Gate"],
            "gateMechanics": "Gates unlock as the player progresses through realm campaigns and proves worth in divine trials"
        }
    }
    
    fpath = os.path.join(base_dir, 'data', 'ascension-system.json')
    if not dry_run:
        with open(fpath, 'w') as f:
            json.dump(ascension, f, indent=2, ensure_ascii=False)
    print(f"  Created ascension-system.json")

def create_realm_campaign_structure(base_dir, dry_run=False):
    """Create the 7 realm campaign structure."""
    factions = [
        ("MG-REALM-001", "The Solar Dominion of Khepra", "Aten Ra", "Egyptian solar myth, desert temples, sun-forged architecture"),
        ("MG-REALM-002", "The Storm-Rooted Aesir Holds", "Asgardian", "Norse myth, storm-wrought halls, frost landscapes"),
        ("MG-REALM-003", "The Celestial Heights of Olympus", "Olympian", "Greek myth, marble heights, divine arenas"),
        ("MG-REALM-004", "The Sacred Kingdoms", "Kami", "Japanese myth, shrine architecture, foxfire groves"),
        ("MG-REALM-005", "Avalora", "Tuatha", "Celtic myth, moon groves, standing stones, fae wilds"),
        ("MG-REALM-006", "The Radiant Hierarchies", "Empyrean", "Angelic myth, choir vaults, holy architecture"),
        ("MG-REALM-007", "The Infernal Dominion", "Infernal Dominion", "Infernal myth, black iron courts, volcanic abyss")
    ]
    
    campaigns = []
    for i, (rid, realm, faction, desc) in enumerate(factions, 1):
        campaigns.append({
            "id": rid,
            "campaignNumber": i,
            "name": f"{realm} Campaign",
            "realm": realm,
            "faction": faction,
            "description": f"The {realm} realm campaign. {desc}. The player enters through a Mythos Gate and must survive divine trials, Hollow corruption, and mythic threats.",
            "missionCount": 40,
            "bossEncounters": 4,
            "trialEncounters": 8,
            "narrativeArc": f"Ascension through {realm}",
            "hollowPressure": "Hollow corruption intensifies as the player progresses deeper into the realm",
            "gateConnection": f"Mythos Gate at campaign start connects to {'previous realm' if i > 1 else 'hub'} and {'next realm' if i < 7 else 'endgame'}",
            "mood": desc,
            "enemies": f"Realm-specific enemies + Hollow-corrupted variants",
            "architecture": desc,
            "progressionArc": f"Gate Entry → Trials → Boss Lock → Realm Boss → Ascension Threshold"
        })
    
    fpath = os.path.join(base_dir, 'data', 'realm-campaigns.json')
    if not dry_run:
        with open(fpath, 'w') as f:
            json.dump(campaigns, f, indent=2, ensure_ascii=False)
    print(f"  Created realm-campaigns.json: 7 realm campaigns, 280 missions total")

def main():
    print("=" * 60)
    print("MYTHOS GATES: ASCENSION — FULL REPO MIGRATION")
    print("=" * 60)
    print(f"\nBase: {BASE}")
    print(f"Keeping {len(KEEP_IDS)} deities (4 per faction × 7 factions)")
    
    # 1. Update project.json
    print("\n[1/8] Updating project.json...")
    update_project_json(os.path.join(BASE, 'data', 'project.json'))
    
    # 2. Filter titans.json to 28 deities
    print("\n[2/8] Filtering titans.json to 28 deities...")
    filter_titans_json(os.path.join(BASE, 'data', 'titans.json'))
    
    # 3. Update roster depth map
    print("\n[3/8] Updating roster depth map...")
    update_roster_depth_map(BASE)
    
    # 4. Update combat docs and rename files
    print("\n[4/8] Updating combat documentation...")
    update_solo_combat_docs(BASE)
    
    # 5. Remove dropped titan files and rename kept ones
    print("\n[5/8] Removing dropped titan files...")
    remove_dropped_titan_files(BASE)
    
    # 6. Rename 3D blueprint directories
    print("\n[6/8] Renaming 3D blueprint directories...")
    rename_directories(BASE)
    
    # 7. Create new systems
    print("\n[7/8] Creating new systems...")
    create_ascension_system(BASE)
    create_realm_campaign_structure(BASE)
    
    # 8. Apply text replacements to ALL remaining JSON files
    print("\n[8/8] Applying language replacements to all JSON files...")
    updated = update_all_json_content(BASE)
    print(f"  Updated {updated} JSON files with language replacements")
    
    print("\n" + "=" * 60)
    print("MIGRATION COMPLETE")
    print("=" * 60)
    
    # Summary
    print(f"""
SUMMARY:
- Title: Titans Gate → Mythos Gates: Ascension
- Roster: 63 titans → 28 deities (4 per faction)
- Combat: one-titan-vs-many → one-deity-vs-many
- Campaign: 7 realm campaigns, 280 missions
- Tone: Mythological dark-fantasy / divine-cinematic
- Language: Titan → Deity/Divine Champion throughout
- New systems: Ascension progression, realm campaign structure
""")

if __name__ == '__main__':
    main()
