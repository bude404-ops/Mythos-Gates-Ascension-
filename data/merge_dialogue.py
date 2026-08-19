#!/usr/bin/env python3
"""Merge faction dialogue JSON files into mission-dialogue.json"""
import json, os, sys

def load_faction_dialogue(filepath):
    with open(filepath) as f:
        return json.load(f)

def apply_dialogue(data, faction_id, fd):
    """Apply dialogue data to all missions of a faction"""
    updated = 0
    for entry in data:
        if entry.get('factionId') != faction_id:
            continue
        
        eid = entry['id']
        is_elite = 'ELITE' in eid
        
        # Parse chapter and mission
        chapter_num = 0
        mission_num = 0
        for p in eid.split('-'):
            if p.startswith('C') and len(p) > 1 and p[1:].isdigit():
                chapter_num = int(p[1:])
            elif p.startswith('M') and len(p) > 1 and p[1:].isdigit():
                mission_num = int(p[1:])
        
        if chapter_num < 1 or chapter_num > 5 or mission_num < 1 or mission_num > 20:
            continue
        
        # Get chapter data
        chapter_key = str(chapter_num)
        if is_elite:
            chapter_data = fd.get('elite_chapters', {}).get(chapter_key, fd.get('chapters', {}).get(chapter_key, {}))
        else:
            chapter_data = fd.get('chapters', {}).get(chapter_key, {})
        
        if not chapter_data:
            continue
        
        # Map mission number to index within chapter (0-3)
        mission_in_chapter = ((mission_num - 1) % 4)
        
        # Get NPC name
        npc = fd.get('npc', 'NPC')
        
        # Build dialogue lines
        lines = {}
        for beat_key, beat_field in [('missionIntro', 'intro'), ('enemyIntroduction', 'enemy'), 
                                      ('midBattle', 'mid'), ('victory', 'victory'), 
                                      ('defeat', 'defeat'), ('codex', 'codex')]:
            texts = chapter_data.get(beat_field, [])
            idx = min(mission_in_chapter, len(texts) - 1) if texts else 0
            text = texts[idx] if texts else ''
            lines[beat_key] = [{'speaker': npc, 'text': text}]
        
        entry['lines'] = lines
        
        # Fix Titan references in meta fields
        rec = entry.get('mythosGatesDialogueRecreation', {})
        if 'speakerRule' in rec:
            rec['speakerRule'] = rec['speakerRule'].replace('Titan', 'deity')
        if 'soloRule' in rec:
            rec['soloRule'] = rec['soloRule'].replace('Titan', 'deity')
        
        if 'soloTitanPolicy' in entry:
            entry['soloTitanPolicy'] = entry['soloTitanPolicy'].replace('Titan', 'Deity')
        if 'soloDeityPolicy' in entry:
            entry['soloDeityPolicy'] = entry['soloDeityPolicy'].replace('Titan', 'Deity')
        
        updated += 1
    
    return updated

# Main
with open('mission-dialogue.json') as f:
    data = json.load(f)

total = 0
for faction_file in ['aten_ra_dialogue.json', 'asgardian_dialogue.json', 
                     'olympian_dialogue.json', 'kami_dialogue.json',
                     'tuatha_dialogue.json', 'empyrean_dialogue.json',
                     'infernal_dialogue.json']:
    if not os.path.exists(faction_file):
        print(f"  SKIP {faction_file} (not found)")
        continue
    
    fd = load_faction_dialogue(faction_file)
    faction_id = fd.get('factionId', '')
    if not faction_id:
        # Derive from filename
        name_map = {
            'aten_ra': 'TG-FACTION-001', 'asgardian': 'TG-FACTION-002',
            'olympian': 'TG-FACTION-003', 'kami': 'TG-FACTION-004',
            'tuatha': 'TG-FACTION-005', 'empyrean': 'TG-FACTION-006',
            'infernal': 'TG-FACTION-007'
        }
        for key, fid in name_map.items():
            if key in faction_file:
                faction_id = fid
                break
    
    count = apply_dialogue(data, faction_id, fd)
    total += count
    print(f"  {faction_file} → {faction_id}: {count} missions updated")

with open('mission-dialogue.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"\nTotal missions updated: {total}")
print("mission-dialogue.json saved")
