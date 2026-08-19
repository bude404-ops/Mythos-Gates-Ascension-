#!/usr/bin/env python3
"""
Mythos Gates: Ascension — Comprehensive Migration Script
Transforms from "Titans Gate" (63 titans) to "Mythos Gates: Ascension" (28 deities)
"""

import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))

SELECTED_DEITY_IDS = [
    "MG-TITAN-001", "MG-TITAN-002", "MG-TITAN-003", "MG-TITAN-004",
    "MG-TITAN-010", "MG-TITAN-011", "MG-TITAN-012", "MG-TITAN-013",
    "MG-TITAN-019", "MG-TITAN-020", "MG-TITAN-021", "MG-TITAN-022",
    "MG-TITAN-028", "MG-TITAN-029", "MG-TITAN-030", "MG-TITAN-031",
    "MG-TITAN-037", "MG-TITAN-038", "MG-TITAN-039", "MG-TITAN-040",
    "MG-TITAN-046", "MG-TITAN-047", "MG-TITAN-048", "MG-TITAN-049",
    "MG-TITAN-055", "MG-TITAN-056", "MG-TITAN-057", "MG-TITAN-058",
]

LANGUAGE_RULES = [
    ("Titans Gate: Ascension", "Mythos Gates: Ascension"),
    ("Titans Gate", "Mythos Gates: Ascension"),
    ("Titans-Gate", "Mythos-Gates-Ascension"),
    ("titans-gate", "mythos-gates-ascension"),
    ("titans gate", "Mythos Gates: Ascension"),
    ("TitansGate", "MythosGatesAscension"),
    ("Titan Voice", "Deity Voice"),
    ("Titan voice", "Deity voice"),
    ("titan voice", "deity voice"),
    ("Titan Gate", "Mythos Gate"),
    ("titan gate", "mythos gate"),
    ("Titan Gates", "Mythos Gates"),
    ("titan gates", "mythos gates"),
    ("Titan-centric", "deity-centric"),
    ("Titan focused", "deity-focused"),
    ("Titan-focused", "Deity-focused"),
    ("solo-titan", "solo-deity"),
    ("Solo Titan", "Solo Deity"),
    ("SoloTitan", "SoloDeity"),
    ("one-titan-vs-many", "one-deity-vs-many"),
    ("One-Titan-Vs-Many", "One-Deity-Vs-Many"),
    ("one active Titan", "one active deity"),
    ("One active Titan", "One active deity"),
    ("active Titan", "active deity"),
    ("Three Titans", "One active deity"),
    ("three Titans", "one active deity"),
    ("three titans", "one active deity"),
    ("many Titans", "multiple deities"),
    ("Many Titans", "Multiple deities"),
    ("playable Titan", "playable deity"),
    ("Playable Titan", "Playable Deity"),
    ("unlock and play this Titan", "unlock and play this deity"),
    ("this Titan", "this deity"),
    ("This Titan", "This deity"),
    ("each Titan", "each deity"),
    ("Each Titan", "Each deity"),
    ("all Titans", "all deities"),
    ("All Titans", "All deities"),
    ("all titans", "all deities"),
    ("other Titans", "other deities"),
    ("Other Titans", "Other deities"),
    ("other titans", "other deities"),
    ("no other Titan", "no other deity"),
    ("No other Titan", "No other deity"),
    ("no other titan", "no other deity"),
    ("63 titans", "28 deities"),
    ("63 Titans", "28 Deities"),
    ("63 Titan", "28 Deity"),
    ("nine Titans", "four deities"),
    ("Nine Titans", "Four deities"),
    ("9 Titans", "4 deities"),
    ("9 titans", "4 deities"),
    ("Aten Ra Titan Voice", "Aten Ra Deity Voice"),
    ("Asgardian Titan Voice", "Asgardian Deity Voice"),
    ("Olympian Titan Voice", "Olympian Deity Voice"),
    ("Kami Titan Voice", "Kami Deity Voice"),
    ("Tuatha Titan Voice", "Tuatha Deity Voice"),
    ("Empyrean Titan Voice", "Empyrean Deity Voice"),
    ("Infernal Dominion Titan Voice", "Infernal Dominion Deity Voice"),
    ("Titan roster", "deity roster"),
    ("titan roster", "deity roster"),
    ("Titan Roster", "Deity Roster"),
    ("Titan combat", "deity combat"),
    ("titan combat", "deity combat"),
    ("Titan Combat", "Deity Combat"),
    ("Titan role", "deity role"),
    ("titan role", "deity role"),
    ("Titan Role", "Deity Role"),
    ("Titan identity", "deity identity"),
    ("Titan Identity", "Deity Identity"),
    ("titan identity", "deity identity"),
    ("Titan concept art", "deity concept art"),
    ("titan concept art", "deity concept art"),
    ("Titan Concept Art", "Deity Concept Art"),
    ("Titan art", "deity art"),
    ("titan art", "deity art"),
    ("titanArtDna", "deityArtDna"),
    ("TitanArtDna", "DeityArtDna"),
    ("titan-art", "deity-art"),
    ("Titan-Art", "Deity-Art"),
    ("Titan backstory", "deity backstory"),
    ("titan backstory", "deity backstory"),
    ("Titan Backstory", "Deity Backstory"),
    ("titan-backstory", "deity-backstory"),
    ("Titan-Backstory", "Deity-Backstory"),
    ("Titan migration", "deity migration"),
    ("titan migration", "deity migration"),
    ("Titan Migration", "Deity Migration"),
    ("Titan redesign", "deity redesign"),
    ("titan redesign", "deity redesign"),
    ("Titan Redesign", "Deity Redesign"),
    ("titan-redesign", "deity-redesign"),
]

def apply_language_rules(text):
    for old, new in LANGUAGE_RULES:
        text = text.replace(old, new)
    return text

def update_titans_to_deities():
    path = os.path.join(BASE, 'data', 'titans.json')
    with open(path) as f:
        titans = json.load(f)
    selected = [t for t in titans if t.get('id') in SELECTED_DEITY_IDS]
    for d in selected:
        d['entityType'] = 'Deity'
        d['formerTitanId'] = d.get('id', '')
        d['ascensionTier'] = 'Base'
        d['combatModel'] = 'one-deity-vs-many'
    with open(path, 'w') as f:
        json.dump(selected, f, indent=2, ensure_ascii=False)
    deities_path = os.path.join(BASE, 'data', 'deities.json')
    with open(deities_path, 'w') as f:
        json.dump(selected, f, indent=2, ensure_ascii=False)
    print(f"  titans.json: {len(titans)} -> {len(selected)} deities")
    print(f"  deities.json: created with {len(selected)} entries")
    dropped = [t for t in titans if t.get('id') not in SELECTED_DEITY_IDS]
    print(f"  Dropped {len(dropped)} titans:")
    for t in dropped:
        print(f"    {t['id']} {t['name']} ({t['faction']})")
    return selected

def update_project_json():
    path = os.path.join(BASE, 'data', 'project.json')
    with open(path) as f:
        d = json.load(f)
    d['name'] = 'Mythos Gates: Ascension'
    d['formerName'] = 'Titans Gate'
    d['gameType'] = 'Mythic realm-hopping action RPG'
    d['deityCount'] = 28
    d['factionCount'] = 7
    d['combatModel'] = 'one-deity-vs-many'
    d['tone'] = 'Epic, sacred, dangerous, cinematic'
    d['vision'] = 'A mythic realm-hopping action RPG where the player controls divine champions battling through fractured mythological worlds connected by ancient gates.'
    d['lastUpdate'] = '2026-08-18'
    d['phase'] = 'Transformation: Titans Gate -> Mythos Gates: Ascension'
    d['buildStatus'] = 'In transformation - migrating from 63-titan roster to 28-deity roster'
    with open(path, 'w') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
    print(f"  project.json: title -> Mythos Gates: Ascension, deityCount -> 28")

def global_language_update():
    changed_files = 0
    total_files = 0
    for root, dirs, files in os.walk(BASE):
        if '.git' in root:
            continue
        for fname in files:
            if fname.endswith(('.json', '.md', '.mjs', '.js', '.csv', '.txt')):
                fpath = os.path.join(root, fname)
                total_files += 1
                try:
                    with open(fpath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    new_content = apply_language_rules(content)
                    if new_content != content:
                        with open(fpath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        changed_files += 1
                except:
                    pass
    print(f"  Global language update: {changed_files}/{total_files} files updated")
    return changed_files

def create_transformation_manifest(selected_deities):
    manifest = {
        "id": "MG-TRANSFORMATION-001",
        "version": "2.0.0",
        "date": "2026-08-18",
        "transformation": "Titans Gate -> Mythos Gates: Ascension",
        "formerTitle": "Titans Gate",
        "newTitle": "Mythos Gates: Ascension",
        "formerRosterSize": 63,
        "newRosterSize": 28,
        "combatModel": "one-deity-vs-many",
        "gameType": "Mythic realm-hopping action RPG",
        "tone": "Epic, sacred, dangerous, cinematic",
        "changes": [
            "Title changed from Titans Gate to Mythos Gates: Ascension",
            "Roster reduced from 63 titans to 28 deities (4 per faction)",
            "Titan language reframed as Deity, Champion, Ascendant, Divine Avatar",
            "Combat model: one active deity vs many enemies",
            "Campaign structure: realm-based progression across multiple mythological realms",
            "The Hollow remains as central threat",
            "Player journey framed as ascension",
            "28 playable deities from 7 mythic traditions",
            "Mobile-first clarity with cinematic UE5 ambition"
        ],
        "selectedDeities": [
            {"id": d.get('id'), "name": d.get('name'), "faction": d.get('faction'), "role": d.get('role'), "mythicSource": d.get('mythicSource', '')[:80]}
            for d in selected_deities
        ],
        "droppedEntities": [f"MG-TITAN-{i:03d}" for i in range(1, 64) if f"MG-TITAN-{i:03d}" not in SELECTED_DEITY_IDS],
    }
    path = os.path.join(BASE, 'data', 'transformation-manifest.json')
    with open(path, 'w') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"  transformation-manifest.json: created")

def main():
    print("=" * 60)
    print("MYTHOS GATES: ASCENSION - COMPREHENSIVE MIGRATION")
    print("=" * 60)
    print("\n1. UPDATING CORE DATA FILES")
    selected = update_titans_to_deities()
    update_project_json()
    print("\n2. GLOBAL LANGUAGE UPDATE")
    global_language_update()
    print("\n3. CREATING TRANSFORMATION MANIFEST")
    create_transformation_manifest(selected)
    print("\n" + "=" * 60)
    print("MIGRATION COMPLETE")
    print("=" * 60)

if __name__ == '__main__':
    main()
