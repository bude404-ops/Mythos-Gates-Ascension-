#!/usr/bin/env python3
"""
Mythos Gates: UE5 Data Asset Generator
Converts JSON data files into UE5-importable format (JSON → CSV/JSON Data Tables)
"""

import json
import os
import sys

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'data-assets')
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        print(f"  ⚠ {filename} not found")
        return None
    return json.load(open(path))

def export_csv(filename, data, fields):
    """Export list of dicts to CSV for UE5 DataTable import"""
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w') as f:
        f.write(','.join(fields) + '\n')
        for row in data:
            values = []
            for field in fields:
                val = row.get(field, '')
                if isinstance(val, (list, dict)):
                    val = json.dumps(val).replace('"', '""')
                elif isinstance(val, str):
                    val = val.replace('"', '""')
                values.append(f'"{val}"')
            f.write(','.join(values) + '\n')
    print(f"  ✅ {filename} ({len(data)} rows)")

def export_json(filename, data):
    """Export as JSON for UE5 Data Asset import"""
    path = os.path.join(OUTPUT_DIR, filename)
    json.dump(data, open(path, 'w'), indent=2)
    print(f"  ✅ {filename}")

def main():
    print("\n=== Mythos Gates: UE5 Data Asset Generator ===\n")

    # 1. Deities → DeityCombatData
    deitys = load_json('deitys.json')
    if deitys:
        export_csv('DeityCombatData.csv', deitys, [
            'id', 'name', 'faction', 'role', 'sex',
            'stats', 'abilities', 'deityArtDna'
        ])
        export_json('DeityCombatData.json', deitys)

    # 2. Creatures → EnemyData
    creatures = load_json('creatures.json')
    if creatures:
        export_csv('EnemyData.csv', creatures, [
            'id', 'name', 'sourceFactionId', 'faction',
            'playable', 'encounterTags', 'stats',
            'scaling', 'balanceNotes', 'loreGuardrails'
        ])
        export_json('EnemyData.json', creatures)

    # 3. Missions → MissionDefinition
    missions = load_json('mission-registry.json')
    if missions:
        export_csv('MissionDefinition.csv', missions, [
            'id', 'title', 'factionId', 'faction',
            'activeDeityCount', 'teamSize', 'mapId',
            'combatArchitecture', 'crossFactionRunIns',
            'loreContinuityGuard'
        ])
        export_json('MissionDefinition.json', missions)

    # 4. Campaigns → CampaignData
    campaigns = load_json('campaigns.json')
    if campaigns:
        export_csv('CampaignData.csv', campaigns, [
            'id', 'name', 'factionId', 'faction',
            'mobileUe5Architecture', 'oneAvatarVsManyCombat',
            'crossFactionRunIns'
        ])
        export_json('CampaignData.json', campaigns)

    # 5. Ascension System → ProgressionData
    ascension = load_json('ascension-system.json')
    if ascension:
        export_json('ProgressionData.json', ascension)

    # 6. Deity Role Matrix → BalanceData
    role_matrix = load_json('deity-role-matrix.json')
    if role_matrix:
        export_json('BalanceData.json', role_matrix)

    # 7. Weapon System
    weapon_system = load_json('art-approval-manifest.json')
    if weapon_system:
        export_json('WeaponAssetManifest.json', weapon_system)

    print(f"\n=== Done! Assets exported to {OUTPUT_DIR} ===")

if __name__ == '__main__':
    main()
