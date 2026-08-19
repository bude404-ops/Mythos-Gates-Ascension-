import json

with open('mission-dialogue.json') as f:
    data = json.load(f)

# Faction data: NPC witness, deity voice, gate name, chapter lore
faction_data = {
    'TG-FACTION-003': {
        'name': 'Olympian',
        'npc': 'Lyrion Trial-Master',
        'deity': 'Zeus Divine Voice',
        'gate': 'The Laurel-Sky Gate',
        'realm': 'Olympian Hubris Arena',
        'faction_adj': 'Laurel-Sky',
        'chapters': [
            {'name': 'Laurel-Sky Threshold', 'focus': 'Trial reactivation. Excellence requires witness. First Hollow contact through corrupted trial remnants.'},
            {'name': 'Oracle Vapor Bleed', 'focus': 'Oracle corruption. Prophecies rot mid-sentence. The deity must act on incomplete visions.'},
            {'name': 'The Labors\' Weight', 'focus': 'Cross-faction collision. Aten Ra vs Olympian. Light-verification vs witness-glory systems clash.'},
            {'name': 'Empyrean Verdict on Hubris', 'focus': 'Empyrean judgment. The sky-throne is audited. Hubris itself is put on trial.'},
            {'name': 'The Misjudged Athlete', 'focus': 'Boss: The Misjudged Athlete. Victory by earning glory through restraint, not force.'},
        ],
    },
    'TG-FACTION-004': {
        'name': 'Kami',
        'npc': 'Sayo Mirror-Keeper',
        'deity': 'Amaterasu Divine Voice',
        'gate': 'The Torii-Moon Gate',
        'realm': 'Kami Mirror Descent',
        'faction_adj': 'Torii-Moon',
        'chapters': [
            {'name': 'Moonlit First Crossing', 'focus': 'Trial reactivation. Reflections as trial architecture. First Hollow contact through false reflections.'},
            {'name': 'Festival of Falling Masks', 'focus': 'Corrupted festival. Masks that eat identities. The deity must maintain self while wearing none.'},
            {'name': 'Phased Law, Solid Judgment', 'focus': 'Cross-faction collision. Tuatha vs Kami. Phased spirit-law vs solid root-law.'},
            {'name': 'The Mirror That Refuses', 'focus': 'Empyrean judgment. The mirror rejects all reflections. The deity must act without seeing themselves.'},
            {'name': 'The Broken Mirror Sage', 'focus': 'Boss: The Broken Mirror Sage. Victory by accepting the broken reflection as truth.'},
        ],
    },
    'TG-FACTION-005': {
        'name': 'Tuatha',
        'npc': 'Maeve Root-Speaker',
        'deity': 'Dagda Divine Voice',
        'gate': 'The Silver-Root Gate',
        'realm': 'Tuatha Root Labyrinth',
        'faction_adj': 'Silver-Root',
        'chapters': [
            {'name': 'Root Threshold', 'focus': 'Trial reactivation. Roots as living trial architecture. First Hollow contact through dead roots.'},
            {'name': 'The Withering Season', 'focus': 'Unseasonal decay. Roots rot in wrong patterns. The deity must heal what is already dying.'},
            {'name': 'Root vs Thunder', 'focus': 'Cross-faction collision. Asgardian vs Tuatha. Oath-root systems vs thunder-oath systems.'},
            {'name': 'The Empyrean\'s Pruning', 'focus': 'Empyrean judgment. The root system is deemed overgrown. The deity must prove wild growth is not chaos.'},
            {'name': 'The Forgotten Gardener', 'focus': 'Boss: The Forgotten Gardener. Victory by growing without controlling, proving life is not ownership.'},
        ],
    },
    'TG-FACTION-006': {
        'name': 'Empyrean',
        'npc': 'Varak Choir-Architect',
        'deity': 'Michael Divine Voice',
        'gate': 'The Choir-Vault Gate',
        'realm': 'Empyrean Choir Ascent',
        'faction_adj': 'Choir-Vault',
        'chapters': [
            {'name': 'First Ascent', 'focus': 'Trial reactivation. Harmony as physical architecture. First Hollow contact through discord.'},
            {'name': 'The Discordant Verse', 'focus': 'Internal disharmony. The choir turns on itself. The deity must hold the melody alone.'},
            {'name': 'Olympian Verdict on the Choir', 'focus': 'Cross-faction collision. Olympian vs Empyrean. Witness-glory vs choir-harmony systems.'},
            {'name': 'The Light That Judges Light', 'focus': 'Empyrean self-judgment. The Choir judges its own radiance. The deity must prove light can self-regulate.'},
            {'name': 'The Fallen Conductor', 'focus': 'Boss: The Fallen Conductor. Victory by conducting without commanding, proving harmony is not control.'},
        ],
    },
    'TG-FACTION-007': {
        'name': 'Infernal',
        'npc': 'Celiane Debt-Recordist',
        'deity': 'Lucifer Divine Voice',
        'gate': 'The Black-Iron Gate',
        'realm': 'Infernal Debt Ledger',
        'faction_adj': 'Black-Iron',
        'chapters': [
            {'name': 'First Descent', 'focus': 'Trial reactivation. Debt as physical architecture. First Hollow contact through unpaid debts.'},
            {'name': 'The Overdue Ledger', 'focus': 'Debt corruption. Ledger entries rot and rewrite themselves. The deity must pay what was never owed.'},
            {'name': 'Debt vs Root', 'focus': 'Cross-faction collision. Tuatha vs Infernal. Root-growth vs debt-ledger systems.'},
            {'name': 'Empyrean Audit of the Pit', 'focus': 'Empyrean judgment. The Ledger is audited. The deity must prove debt is not theft.'},
            {'name': 'The Bankrupt Judge', 'focus': 'Boss: The Bankrupt Judge. Victory by forgiving without forgetting, proving mercy is not weakness.'},
        ],
    },
}

# Mission phases within each chapter
phases = [
    ('First Crossing', 'Entering the trial space for the first time.'),
    ('Name at the Gate', 'Establishing the deity\'s identity to the Gate.'),
    ('Forward Claim', 'Pushing deeper into the chapter\'s central conflict.'),
    ('Outer Line', 'Reaching the chapter\'s climactic confrontation.'),
]

elite_phases = [
    ('Elite Verification', 'Returning to verify the chapter\'s lesson under harder conditions.'),
    ('Elite Hazard', 'Facing escalated enemy configurations.'),
    ('Elite Lock', 'The chapter\'s mechanic at maximum difficulty.'),
    ('Elite Lore Price', 'A hidden lore fragment unlocks upon completion.'),
]

# Generate dialogue for each faction
for fid, fd in faction_data.items():
    npc = fd['npc']
    deity = fd['deity']
    gate = fd['gate']
    adj = fd['faction_adj']
    
    for entry in data:
        if entry.get('factionId') != fid:
            continue
        
        eid = entry['id']
        camp = entry.get('campaignType', 'Normal')
        
        # Parse chapter and mission from ID: TG-F0X-DLG-C0Y-M0Z
        parts = eid.split('-')
        # Normal: TG-F03-DLG-C01-M01 → 5 parts, chapter=parts[3], mission=parts[4]
        # Elite: TG-F03-ELITE-DLG-C01-M01 → 6 parts, chapter=parts[4], mission=parts[5]
        if 'ELITE' in parts:
            chapter_str = parts[4]
            mission_str = parts[5]
        else:
            chapter_str = parts[3]
            mission_str = parts[4]
        chapter_idx = int(chapter_str[1:]) - 1  # 0-4
        mission_in_chapter = int(mission_str[1:]) - (chapter_idx * 4)  # 1-4
        
        if chapter_idx < 0 or chapter_idx > 4:
            continue
            
        ch = fd['chapters'][chapter_idx]
        ch_name = ch['name']
        ch_focus = ch['focus']
        
        if camp == 'Normal':
            phase = phases[mission_in_chapter - 1]
        else:
            phase = elite_phases[mission_in_chapter - 1]
        
        phase_name = phase[0]
        phase_desc = phase[1]
        
        # Generate unique dialogue for each beat
        m_num = mission_in_chapter
        
        if camp == 'Normal':
            intro = f"{npc}: {ch_name} — {phase_name}. {ch_focus.split('.')[0]}. The {adj} Gate holds its breath."
            enemy = f"{npc}: Hollow-touched. They wear the shapes of old {fd['name'].lower()} faithful, but their purpose has been hollowed out. {phase_desc}"
            mid = f"{npc}: {ch_focus.split('.')[1].strip() if '.' in ch_focus else ch_focus}. Stay focused — the Gate is measuring conviction."
            victory = f"{deity}: {ch_name} holds. The {adj} Gate accepted the weight. {phase_name} complete — press on."
            defeat = f"{deity}: The {adj} Gate rejected the approach. Withdraw. {gate} has learned too much from this attempt."
            codex = f"{npc}: {ch_name} — {phase_name}. {ch_focus} Record archived."
        else:
            intro = f"{npc}: {ch_name} — {phase_name}. You return to the {adj} trial under harder terms. {ch_focus.split('.')[0]}."
            enemy = f"{npc}: Elite Hollow. They remember your last attempt and have adapted. {phase_desc}"
            mid = f"{npc}: {ch_focus.split('.')[1].strip() if '.' in ch_focus else ch_focus}. The Gate tightens its rules for the elite descent."
            victory = f"{deity}: {ch_name} verified. {phase_name} complete. The {adj} Gate acknowledges mastery."
            defeat = f"{deity}: The {adj} Gate held firm against the elite approach. Withdraw and recalibrate."
            codex = f"{npc}: {ch_name} — {phase_name}. Elite verification of {ch_focus.split('.')[0]}. Record archived."
        
        # Convert to [speaker, text] format (matching Aten Ra and Asgardian)
        def make_beat(text):
            if ':' in text:
                speaker, content = text.split(':', 1)
                return [speaker.strip(), content.strip()]
            return [npc, text]
        
        entry['lines'] = {
            'missionIntro': [make_beat(intro)],
            'enemyIntroduction': [make_beat(enemy)],
            'midBattle': [make_beat(mid)],
            'victory': [make_beat(victory)],
            'defeat': [make_beat(defeat)],
            'codex': [make_beat(codex)],
        }

# Save
with open('mission-dialogue.json', 'w') as f:
    json.dump(data, f, indent=2)

# Verify
for fid, fd in faction_data.items():
    unique = {}
    for beat_key in ['missionIntro', 'enemyIntroduction', 'midBattle', 'victory', 'defeat', 'codex']:
        texts = set()
        for entry in data:
            if entry.get('factionId') == fid:
                for beat in entry.get('lines', {}).get(beat_key, []):
                    if isinstance(beat, list) and len(beat) >= 2:
                        texts.add(beat[1])
        unique[beat_key] = len(texts)
    print(f"{fd['name']}: Intro={unique['missionIntro']} Enemy={unique['enemyIntroduction']} Mid={unique['midBattle']} Vic={unique['victory']} Def={unique['defeat']} Codex={unique['codex']}")

# Check for remaining issues
directors = 0
the_the = 0
for entry in data:
    for beat_key, beats in entry.get('lines', {}).items():
        for beat in beats:
            if isinstance(beat, list) and len(beat) >= 2:
                if 'Director' in beat[0]:
                    directors += 1
                if 'The The ' in beat[1]:
                    the_the += 1
            elif isinstance(beat, dict):
                if 'Director' in beat.get('speaker', ''):
                    directors += 1

print(f"\nRemaining Director speakers: {directors}")
print(f"Remaining 'The The' typos: {the_the}")
