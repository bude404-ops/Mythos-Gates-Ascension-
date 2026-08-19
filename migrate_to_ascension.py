#!/usr/bin/env python3
"""
Mythos Gates: Ascension — Comprehensive Migration Script
Transforms from "Mythos Gates" (63 deitys) to "Mythos Gates: Ascension" (28 deities)
"""

import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))

SELECTED_DEITY_IDS = [
    "MG-DEITY-001", "MG-DEITY-002", "MG-DEITY-003", "MG-DEITY-004",
    "MG-DEITY-010", "MG-DEITY-011", "MG-DEITY-012", "MG-DEITY-013",
    "MG-DEITY-019", "MG-DEITY-020", "MG-DEITY-021", "MG-DEITY-022",
    "MG-DEITY-028", "MG-DEITY-029", "MG-DEITY-030", "MG-DEITY-031",
    "MG-DEITY-037", "MG-DEITY-038", "MG-DEITY-039", "MG-DEITY-040",
    "MG-DEITY-046", "MG-DEITY-047", "MG-DEITY-048", "MG-DEITY-049",
    "MG-DEITY-055", "MG-DEITY-056", "MG-DEITY-057", "MG-DEITY-058",
]

LANGUAGE_RULES = [
    ("Mythos Gates: Ascension", "Mythos Gates: Ascension"),
    ("Mythos Gates", "Mythos Gates: Ascension"),
    ("Deities-Gate", "Mythos-Gates-Ascension"),
    ("deitys-gate", "mythos-gates-ascension"),
    ("deitys gate", "Mythos Gates: Ascension"),
    ("MythosGates", "MythosGatesAscension"),
    ("Deity Voice", "Deity Voice"),
    ("Deity voice", "Deity voice"),
    ("deity voice", "deity voice"),
    ("Deity Gate", "Mythos Gate"),
    ("deity gate", "mythos gate"),
    ("Deity Gates", "Mythos Gates"),
    ("deity gates", "mythos gates"),
    ("Deity-centric", "deity-centric"),
    ("Deity focused", "deity-focused"),
    ("Deity-focused", "Deity-focused"),
    ("solo-deity", "solo-deity"),
    ("Solo Deity", "Solo Deity"),
    ("SoloDeity", "SoloDeity"),
    ("one-deity-vs-many", "one-deity-vs-many"),
    ("One-Deity-Vs-Many", "One-Deity-Vs-Many"),
    ("one active Deity", "one active deity"),
    ("One active Deity", "One active deity"),
    ("active Deity", "active deity"),
    ("Three Deities", "One active deity"),
    ("three Deities", "one active deity"),
    ("three deitys", "one active deity"),
    ("many Deities", "multiple deities"),
    ("Many Deities", "Multiple deities"),
    ("playable Deity", "playable deity"),
    ("Playable Deity", "Playable Deity"),
    ("unlock and play this Deity", "unlock and play this deity"),
    ("this Deity", "this deity"),
    ("This Deity", "This deity"),
    ("each Deity", "each deity"),
    ("Each Deity", "Each deity"),
    ("all Deities", "all deities"),
    ("All Deities", "All deities"),
    ("all deitys", "all deities"),
    ("other Deities", "other deities"),
    ("Other Deities", "Other deities"),
    ("other deitys", "other deities"),
    ("no other Deity", "no other deity"),
    ("No other Deity", "No other deity"),
    ("no other deity", "no other deity"),
    ("63 deitys", "28 deities"),
    ("63 Deities", "28 Deities"),
    ("63 Deity", "28 Deity"),
    ("nine Deities", "four deities"),
    ("Nine Deities", "Four deities"),
    ("9 Deities", "4 deities"),
    ("9 deitys", "4 deities"),
    ("Aten Ra Deity Voice", "Aten Ra Deity Voice"),
    ("Asgardian Deity Voice", "Asgardian Deity Voice"),
    ("Olympian Deity Voice", "Olympian Deity Voice"),
    ("Kami Deity Voice", "Kami Deity Voice"),
    ("Tuatha Deity Voice", "Tuatha Deity Voice"),
    ("Empyrean Deity Voice", "Empyrean Deity Voice"),
    ("Infernal Dominion Deity Voice", "Infernal Dominion Deity Voice"),
    ("Deity roster", "deity roster"),
    ("deity roster", "deity roster"),
    ("Deity Roster", "Deity Roster"),
    ("Deity combat", "deity combat"),
    ("deity combat", "deity combat"),
    ("Deity Combat", "Deity Combat"),
    ("Deity role", "deity role"),
    ("deity role", "deity role"),
    ("Deity Role", "Deity Role"),
    ("Deity identity", "deity identity"),
    ("Deity Identity", "Deity Identity"),
    ("deity identity", "deity identity"),
    ("Deity concept art", "deity concept art"),
    ("deity concept art", "deity concept art"),
    ("Deity Concept Art", "Deity Concept Art"),
    ("Deity art", "deity art"),
    ("deity art", "deity art"),
    ("deityArtDna", "deityArtDna"),
    ("DeityArtDna", "DeityArtDna"),
    ("deity-art", "deity-art"),
    ("Deity-Art", "Deity-Art"),
    ("Deity backstory", "deity backstory"),
    ("deity backstory", "deity backstory"),
    ("Deity Backstory", "Deity Backstory"),
    ("deity-backstory", "deity-backstory"),
    ("Deity-Backstory", "Deity-Backstory"),
    ("Deity migration", "deity migration"),
    ("deity migration", "deity migration"),
    ("Deity Migration", "Deity Migration"),
    ("Deity redesign", "deity redesign"),
    ("deity redesign", "deity redesign"),
    ("Deity Redesign", "Deity Redesign"),
    ("deity-redesign", "deity-redesign"),
]

def apply_language_rules(text):
    for old, new in LANGUAGE_RULES:
        text = text.replace(old, new)
    return text

def update_deitys_to_deities():
    path = os.path.join(BASE, 'data', 'deitys.json')
    with open(path) as f:
        deitys = json.load(f)
    selected = [t for t in deitys if t.get('id') in SELECTED_DEITY_IDS]
    for d in selected:
        d['entityType'] = 'Deity'
        d['formerDeityId'] = d.get('id', '')
        d['ascensionTier'] = 'Base'
        d['combatModel'] = 'one-deity-vs-many'
    with open(path, 'w') as f:
        json.dump(selected, f, indent=2, ensure_ascii=False)
    deities_path = os.path.join(BASE, 'data', 'deities.json')
    with open(deities_path, 'w') as f:
        json.dump(selected, f, indent=2, ensure_ascii=False)
    print(f"  deitys.json: {len(deitys)} -> {len(selected)} deities")
    print(f"  deities.json: created with {len(selected)} entries")
    dropped = [t for t in deitys if t.get('id') not in SELECTED_DEITY_IDS]
    print(f"  Dropped {len(dropped)} deitys:")
    for t in dropped:
        print(f"    {t['id']} {t['name']} ({t['faction']})")
    return selected

def update_project_json():
    path = os.path.join(BASE, 'data', 'project.json')
    with open(path) as f:
        d = json.load(f)
    d['name'] = 'Mythos Gates: Ascension'
    d['formerName'] = 'Mythos Gates'
    d['gameType'] = 'Mythic realm-hopping action RPG'
    d['deityCount'] = 28
    d['factionCount'] = 7
    d['combatModel'] = 'one-deity-vs-many'
    d['tone'] = 'Epic, sacred, dangerous, cinematic'
    d['vision'] = 'A mythic realm-hopping action RPG where the player controls divine champions battling through fractured mythological worlds connected by ancient gates.'
    d['lastUpdate'] = '2026-08-18'
    d['phase'] = 'Transformation: Mythos Gates -> Mythos Gates: Ascension'
    d['buildStatus'] = 'In transformation - migrating from 63-deity roster to 28-deity roster'
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
        "transformation": "Mythos Gates -> Mythos Gates: Ascension",
        "formerTitle": "Mythos Gates",
        "newTitle": "Mythos Gates: Ascension",
        "formerRosterSize": 63,
        "newRosterSize": 28,
        "combatModel": "one-deity-vs-many",
        "gameType": "Mythic realm-hopping action RPG",
        "tone": "Epic, sacred, dangerous, cinematic",
        "changes": [
            "Title changed from Mythos Gates to Mythos Gates: Ascension",
            "Roster reduced from 63 deitys to 28 deities (4 per faction)",
            "Deity language reframed as Deity, Champion, Ascendant, Divine Avatar",
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
        "droppedEntities": [f"MG-DEITY-{i:03d}" for i in range(1, 64) if f"MG-DEITY-{i:03d}" not in SELECTED_DEITY_IDS],
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
    selected = update_deitys_to_deities()
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
