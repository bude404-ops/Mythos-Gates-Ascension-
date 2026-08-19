
import json, os, re, math
from datetime import datetime, timezone
ROOT = '/home/reaper/repos/Deities-Gate-sync'
DATA = os.path.join(ROOT, 'data')

def slugify(s):
    return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')

def read_json(path):
    with open(path, encoding='utf-8') as f: return json.load(f)

def write_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
        f.write('\n')

factions = read_json(os.path.join(DATA, 'factions.json'))
faction_by_id = {f['id']: f for f in factions}
deitys = read_json(os.path.join(DATA, 'deitys.json'))
creatures = read_json(os.path.join(DATA, 'creatures.json'))
roster = read_json(os.path.join(DATA, 'solo-deity-roster-redesign.json'))
roster_by_id = {t['id']: t for t in roster.get('deitys', [])}
role_matrix = read_json(os.path.join(DATA, 'deity-role-matrix.json'))
role_by_id = {t['id']: t for t in role_matrix.get('deitys', [])}

role_profiles = {
    'Defender':   dict(hp=46, attack=9,  range=2, energy=4, speed=2, crit=5,  armor=16, resistance=10, accuracy=82, evasion=4,  guardBreak=8,  roleBudget=104, primary='hold objectives and survive pressure'),
    'Battery':    dict(hp=38, attack=10, range=3, energy=5, speed=3, crit=7,  armor=8,  resistance=13, accuracy=84, evasion=7,  guardBreak=6,  roleBudget=105, primary='generate Momentum and Divinity under pressure'),
    'Controller': dict(hp=36, attack=9,  range=4, energy=5, speed=3, crit=6,  armor=7,  resistance=15, accuracy=86, evasion=8,  guardBreak=9,  roleBudget=105, primary='reshape terrain and deny enemy plans'),
    'Breaker':    dict(hp=42, attack=13, range=2, energy=3, speed=2, crit=9,  armor=12, resistance=8,  accuracy=81, evasion=4,  guardBreak=18, roleBudget=106, primary='break armor, shields, and boss windows'),
    'Disruptor':  dict(hp=34, attack=10, range=3, energy=5, speed=3, crit=8,  armor=6,  resistance=16, accuracy=85, evasion=9,  guardBreak=10, roleBudget=105, primary='interrupt resources, casts, reactions, and elite mechanics'),
    'Sustain':    dict(hp=44, attack=8,  range=2, energy=4, speed=2, crit=5,  armor=11, resistance=18, accuracy=82, evasion=5,  guardBreak=7,  roleBudget=104, primary='win attrition and cleanse hazard pressure'),
    'Artillery':  dict(hp=32, attack=14, range=5, energy=4, speed=2, crit=10, armor=4,  resistance=10, accuracy=88, evasion=5,  guardBreak=11, roleBudget=106, primary='project damage into crowds and objective zones'),
    'Guardian':   dict(hp=48, attack=9,  range=1, energy=4, speed=2, crit=5,  armor=18, resistance=12, accuracy=80, evasion=3,  guardBreak=12, roleBudget=105, primary='counter bosses and protect survival windows'),
    'Assassin':   dict(hp=34, attack=13, range=1, energy=4, speed=4, crit=16, armor=5,  resistance=8,  accuracy=89, evasion=14, guardBreak=9,  roleBudget=106, primary='execute priority targets and reposition through danger')
}
rarity_mod = {
    'Rare': dict(hp=0, attack=0, energy=0, crit=0, armor=0, resistance=0, budget=0, maxLevel=50, gearTierCap='Epic'),
    'Epic': dict(hp=2, attack=1, energy=0, crit=1, armor=1, resistance=1, budget=4, maxLevel=55, gearTierCap='Legendary'),
    'Legendary': dict(hp=4, attack=1, energy=1, crit=2, armor=2, resistance=2, budget=8, maxLevel=60, gearTierCap='Mythic')
}
faction_terms = {
    'Aten Ra': dict(resource='Solar Charge', terrain='illuminated terrain', dmg='Radiant', verbs=['Verdict','Sunseal','Pylon','Horizon'], relic='Aten', passive='Solar Law'),
    'Asgardian': dict(resource='Oathstorm', terrain='storm-marked terrain', dmg='Storm', verbs=['Oath','Rune','Anvil','Thunder'], relic='Runebound', passive='Oathbound'),
    'Olympian': dict(resource='Laurel Glory', terrain='honor-marked terrain', dmg='Ichor', verbs=['Laurel','Aegis','Summit','Contest'], relic='Olympian', passive='Laurel Supremacy'),
    'Kami': dict(resource='Spirit Balance', terrain='shrine terrain', dmg='Spirit', verbs=['Shrine','Moonveil','Seal','Mist'], relic='Kami', passive='Sacred Balance'),
    'Tuatha': dict(resource='Grove Pulse', terrain='living terrain', dmg='Verdant', verbs=['Root','Moonwell','Thorn','Barrow'], relic='Tuatha', passive='Living Grove'),
    'Empyrean': dict(resource='Edict Charge', terrain='ordered terrain', dmg='Celestial', verbs=['Edict','Choir','Throne','Axis'], relic='Empyrean', passive='Radiant Edict'),
    'Infernal Dominion': dict(resource='Dominion Heat', terrain='burning terrain', dmg='Infernal', verbs=['Chain','Cinder','Wound','Crown'], relic='Dominion', passive='Dominion Flame')
}
role_moves = {
    'Defender': ('Anchor Strike','Bastion Protocol','Law of Holding','hold-zone shield, taunt, counterstance'),
    'Battery': ('Generator Strike','Resonance Engine','Overflow Mandate','resource acceleration, refund, controlled overcharge'),
    'Controller': ('Vector Strike','Field Rewrite','Terrain Edict','root, pull, slow, lane denial'),
    'Breaker': ('Sundering Strike','Armor Rupture','Gate-Sundering Decree','armor break, shield collapse, boss phase pressure'),
    'Disruptor': ('Null Strike','Rite Severance','Interdiction Decree','cast interrupt, meter drain, reaction lockout'),
    'Sustain': ('Restoring Strike','Renewal Circuit','Survival Covenant','cleanse, heal-over-time, attrition defense'),
    'Artillery': ('Longshot Strike','Zone Bombardment','Horizon Cataclysm','ranged area damage and objective-zone denial'),
    'Guardian': ('Sentinel Strike','Punishing Guard','Oath of Intercept','parry, brace, boss counter, intercept'),
    'Assassin': ('Execution Strike','Shadow Pursuit','Final Name Cut','mark, execute, teleport, priority burst')
}

balance_rows=[]
for i,t in enumerate(deitys, start=1):
    faction = t['faction']; role=t['role']; rarity=t['rarity']; name=t['name']
    base=role_profiles[role].copy(); mod=rarity_mod[rarity]; terms=faction_terms[faction]
    # small deterministic faction offset keeps identity without creating power spread
    faction_index = int(t['factionId'].split('-')[-1])
    hp = base['hp'] + mod['hp'] + ((faction_index + i) % 3 - 1) * 2
    attack = base['attack'] + mod['attack'] + (1 if (i + faction_index) % 11 == 0 else 0)
    energy = min(5, base['energy'] + mod['energy'])
    speed = base['speed']
    rng = base['range']
    armor = base['armor'] + mod['armor'] + (1 if role in ['Defender','Guardian','Breaker'] and rarity == 'Legendary' else 0)
    resistance = base['resistance'] + mod['resistance']
    crit = base['crit'] + mod['crit']
    accuracy = base['accuracy']
    evasion = base['evasion']
    guardBreak = base['guardBreak']
    combat_power = hp + attack*6 + rng*5 + energy*7 + speed*6 + armor*2 + resistance*2 + crit
    first = re.split(r'[ ,\-]+', name)[0].replace('Aten-Ra','Aten-Ra')
    verb = terms['verbs'][(i-1) % len(terms['verbs'])]
    basic, technique, signature_base, effect_theme = role_moves[role]
    personal_resource = terms['resource']
    kit = roster_by_id.get(t['id'], {})
    matrix = role_by_id.get(t['id'], {})
    unique = kit.get('uniqueMechanic') or matrix.get('uniqueMechanic') or f"{name} builds {personal_resource} through mastery of {terms['terrain']}."
    attack_name = f"{first} {basic}"
    technique_name = f"{verb} {technique}"
    signature_name = f"{name}: {signature_base}"
    ascension_name = f"Divine Ascension — {verb} {terms['dmg']} Unbound"
    passive_name = f"{terms['passive']} — {first}'s Mastery"
    t['abilities'] = [attack_name, technique_name, signature_name, ascension_name]
    t['abilityDetails'] = [
        dict(name=attack_name, slot='Basic', unlockLevel=1, cost='Action', cooldown=0, tags=['generator', role.lower(), terms['dmg'].lower()], effect=f"Deal {terms['dmg']} damage at range {rng}; gain 8 Momentum, or 12 if used from {terms['terrain']} or into the Deity's marked target.", scaling='100% attack; +15% vs vulnerable enemies', counterplay='Line-of-sight denial, evasion, armor, or forcing low-value targets.'),
        dict(name=technique_name, slot='Technique', unlockLevel=4, cost='20 Momentum', cooldown=2, tags=['control' if role=='Controller' else 'role-technique', role.lower()], effect=f"Apply {effect_theme}; also builds 10 {personal_resource} when it changes enemy intent or breaks an objective action.", scaling='70% attack plus role utility scaling from energy', counterplay='Interrupt before resolution, spread battle patterns, or bait the cooldown.'),
        dict(name=signature_name, slot='Signature', unlockLevel=12, cost='45 Momentum + 25 Divinity', cooldown=4, tags=['signature', role.lower(), faction.lower().replace(' ','-')], effect=f"Spend stored {personal_resource} to create a two-round battlefield rule around {terms['terrain']}; enemies receive a readable counter-window before the strongest effect lands.", scaling='140% attack; utility duration +1 at mastery tier 4', counterplay='Move out of the rule zone, drain Momentum, or trigger the exposed recovery turn.'),
        dict(name=ascension_name, slot='Ascension', unlockLevel=30, cost='100 Divinity', cooldown='once per battle', tags=['ultimate','ascendant'], effect=f"Enter Ascendant stance for 2 rounds: +15% damage, +12 mitigation, empowered {personal_resource}, and one mythic reaction override. Ends with a one-round recovery risk.", scaling='Does not stack with external ultimate buffs', counterplay='Survive the window, deny objectives during recovery, or force defensive reaction spending.')
    ]
    t['passives'] = [f"{passive_name}: {unique} Counterplay remains: {', '.join((kit.get('counterplay') or matrix.get('counterplay') or ['deny favored terrain'])[:3])}."]
    weapon = f"{terms['relic']} {verb} Implement"
    armor_name = f"{name.split(',')[0]} Realmplate"
    core = f"{first} {personal_resource} Core"
    t['equipment'] = [weapon, armor_name, core]
    t['equipmentDetails'] = [
        dict(name=weapon, slot='Relic Weapon', rarityFloor=rarity, primaryStat='attack', effect=f"+{max(1, attack//3)} attack. Empowered basics against vulnerable enemies generate +4 Momentum but cannot trigger more than once per round.", balanceGuardrail='No extra action generation; damage bonus capped against bosses.'),
        dict(name=armor_name, slot='Armor Body', rarityFloor=rarity, primaryStat='armor/resistance', effect=f"+{max(1, armor//5)} armor and +{max(1, resistance//6)} resistance. First preventable hazard hit each battle is reduced by 25% if the Deity used a reaction last round.", balanceGuardrail='Hazard reduction does not prevent scripted boss mechanics.'),
        dict(name=core, slot='Resonance Core', rarityFloor=rarity, primaryStat='energy', effect=f"{personal_resource} cap +20. At 80+ {personal_resource}, the next Technique gains a role-specific rider, then drains 30 {personal_resource}.", balanceGuardrail='One empowered Technique per two rounds; cannot chain with Ascension opener.')
    ]
    t['stats'] = dict(hp=hp, attack=attack, range=rng, energy=energy, speed=speed, armor=armor, resistance=resistance, critChance=crit, accuracy=accuracy, evasion=evasion, guardBreak=guardBreak, combatPower=combat_power)
    t['leveling'] = dict(baseLevel=1, maxLevel=mod['maxLevel'], statGrowthPer10Levels=dict(hp=round(hp*.18), attack=max(1, round(attack*.13)), armor=max(1, round(armor*.12)), resistance=max(1, round(resistance*.12))), masteryBreakpoints=[5,10,20,30,45,mod['maxLevel']], gearTierCap=mod['gearTierCap'], powerFormula='hp + attack*6 + range*5 + energy*7 + speed*6 + armor*2 + resistance*2 + critChance')
    t['balanceNotes'] = dict(intendedDifficulty='Tuned for harder solo encounters: every Deity can win alone, but mistakes against counters starve Momentum/Divinity.', primaryRole=role_profiles[role]['primary'], budgetTarget=base['roleBudget']+mod['budget'], computedCombatPower=combat_power, hardCounters=(kit.get('weaknesses') or matrix.get('weaknesses') or [])[:4])
    t['developmentStatus'] = 'Combat kit, named gear, leveling hooks, and balance pass complete; artwork pending.'
    balance_rows.append(dict(id=t['id'], name=name, faction=faction, role=role, rarity=rarity, combatPower=combat_power, stats=t['stats'], gear=[g['name'] for g in t['equipmentDetails']]))

creature_tiers = {
    'Minor': dict(levelBand=[1,25], hp=42, damage=7, armor=2, resistance=2, movement=4, initiative=40, accuracy=72, evasion=8, countWeight=1.0, xp=10, archetype='SWARMER'),
    'Major': dict(levelBand=[15,55], hp=95, damage=13, armor=7, resistance=5, movement=3, initiative=48, accuracy=78, evasion=6, countWeight=2.0, xp=28, archetype='BRUTE'),
    'Elite': dict(levelBand=[35,85], hp=155, damage=18, armor=11, resistance=10, movement=3, initiative=58, accuracy=82, evasion=9, countWeight=4.0, xp=70, archetype='ELITE'),
    'World Boss': dict(levelBand=[70,100], hp=520, damage=28, armor=18, resistance=18, movement=2, initiative=65, accuracy=86, evasion=5, countWeight=12.0, xp=350, archetype='CHAMPION')
}
# per-creature archetype hints
archetype_by_name = {
    'wretch':'SWARMER','choirling':'DISRUPTOR','needle':'HUNTER','standard':'GUARDIAN','colossus':'BRUTE','maneater':'EXECUTIONER','bearer':'GUARDIAN','mouth':'DISRUPTOR','prince':'ELITE','leviathan':'CHAMPION','behemoth':'CHAMPION','anchor':'CONTROLLER','storm':'CONTROLLER','keeper':'GUARDIAN','shade':'ASSASSIN','hunger':'EXECUTIONER'
}
creature_rows=[]
for idx,c in enumerate(creatures, start=1):
    tier = c.get('threatTier','Major')
    prof = creature_tiers[tier].copy()
    nlow = c['name'].lower()
    archetype = next((v for k,v in archetype_by_name.items() if k in nlow), prof['archetype'])
    if archetype == 'HUNTER': prof.update(range=5, movement=max(prof['movement'],4), evasion=prof['evasion']+3)
    elif archetype == 'CONTROLLER': prof.update(range=4, resistance=prof['resistance']+3)
    elif archetype == 'DISRUPTOR': prof.update(range=4, initiative=prof['initiative']+6, resistance=prof['resistance']+4)
    elif archetype == 'GUARDIAN': prof.update(armor=prof['armor']+5, hp=prof['hp']+20)
    elif archetype == 'EXECUTIONER': prof.update(damage=prof['damage']+4, movement=prof['movement']+1, evasion=prof['evasion']+4)
    elif archetype == 'ASSASSIN': prof.update(damage=prof['damage']+5, movement=prof['movement']+2, evasion=prof['evasion']+7)
    elif archetype == 'BRUTE': prof.update(hp=prof['hp']+30, armor=prof['armor']+4, damage=prof['damage']+2)
    rangev = prof.get('range', 1 if archetype in ['BRUTE','SWARMER','EXECUTIONER'] else 3)
    level_min, level_max = prof['levelBand']
    c['combatRole'] = archetype
    c['stats'] = dict(levelBand=prof['levelBand'], hp=prof['hp'] + idx*3, damage=prof['damage'] + idx%4, range=rangev, armor=prof['armor'], resistance=prof['resistance'], movement=prof['movement'], initiative=prof['initiative'], accuracy=prof['accuracy'], evasion=prof['evasion'], guardBreak=8 + int(prof['countWeight']*2), threatWeight=prof['countWeight'], xpValue=prof['xp'])
    c['scaling'] = dict(campaign='Fixed mission bands; old wins should become easier as Deity level and gear rise.', eliteRemix=f"+12% hp, +10% damage, +1 mechanic layer, +{max(1, idx%3)} tactical AI priority.", endgame='Dynamic scaling is capped at player effective level +8; adds mechanics before raw hp.', levelFormula=f"hp = baseHp * (1 + 0.045 * missionLevel); damage = baseDamage * (1 + 0.035 * missionLevel), capped by tier budget")
    c['aiProfile'] = dict(archetype=archetype, priority=['deny Momentum','contest objective','punish exposed Deity'] if archetype in ['DISRUPTOR','CONTROLLER'] else ['survive Ascension window','force reaction spending','attack marked weakness'], counterplayWindow='Every major action has a telegraph or setup turn unless spawned as a minor swarmer.')
    c['balanceNotes'] = f"Harder solo tuning: {tier} {archetype} pressures one active Deity through behavior first, stats second; threatWeight {prof['countWeight']} controls encounter budgets."
    creature_rows.append(dict(id=c['id'], name=c['name'], tier=tier, combatRole=archetype, stats=c['stats']))

# write aggregate and individual files
write_json(os.path.join(DATA,'deitys.json'), deitys)
for t in deitys:
    write_json(os.path.join(ROOT,'deitys',f"{t['id']}.json"), t)
write_json(os.path.join(DATA,'creatures.json'), creatures)
for c in creatures:
    write_json(os.path.join(ROOT,'creatures',f"{c['id']}.json"), c)

# progression system expansion
progress = read_json(os.path.join(DATA,'progression-system.json'))
progress['version'] = '0.9.7'
progress['difficultyAndLevelingBalance'] = {
    'directive': 'Increase difficulty by making enemies smarter and encounter budgets tighter while letting leveling and gear create visible mastery growth.',
    'deityLevelBands': [
        {'band':'Awakening','levels':'1-10','enemyPressure':'teaches positioning and Momentum loss','gear':'Common/Rare starter relics'},
        {'band':'Trial','levels':'11-25','enemyPressure':'adds controllers, hunters, and first elite mechanics','gear':'Rare/Epic role gear'},
        {'band':'Dominion','levels':'26-45','enemyPressure':'resource denial, shield windows, and boss phase counters','gear':'Epic/Legendary faction gear'},
        {'band':'Ascendant','levels':'46-60','enemyPressure':'multi-layer elites, enemy Deities, capped endgame scaling','gear':'Legendary/Mythic signature gear'}
    ],
    'powerFormula': 'effectivePower = combatPower + level*12 + gearScore*0.85 + masteryTier*35',
    'gearScoreBands': {'starter':30,'rare':70,'epic':130,'legendary':210,'mythic':320},
    'antiPayToWinGuardrail': 'Gear widens tactical options and progression speed; hard counters, telegraphs, and objective reads still decide difficult missions.'
}
write_json(os.path.join(DATA,'progression-system.json'), progress)

balance_doc = {
    'id':'MG-DEITY-ENEMY-BALANCE-PASS-001',
    'version':'1.0.0',
    'generated': datetime.now(timezone.utc).isoformat(),
    'directive':'Named all Deity combat kits and gear, added leveling hooks, gave every enemy stat/scaling/AI profiles, and increased difficulty without requiring inflated health pools.',
    'deityCount': len(deitys),
    'enemyCount': len(creatures),
    'deityBudget': {
        'combatPowerMin': min(r['combatPower'] for r in balance_rows),
        'combatPowerMax': max(r['combatPower'] for r in balance_rows),
        'combatPowerAverage': round(sum(r['combatPower'] for r in balance_rows)/len(balance_rows),2),
        'roleBands': {role: {'count': sum(1 for r in balance_rows if r['role']==role), 'avgPower': round(sum(r['combatPower'] for r in balance_rows if r['role']==role)/max(1,sum(1 for r in balance_rows if r['role']==role)),2)} for role in sorted(role_profiles)}
    },
    'difficultyModel': {
        'campaignNormal':'Enemies stay mostly fixed by mission so leveling feels meaningful; later missions introduce denial and elite mechanics earlier than before.',
        'eliteRemix':'Elite variants add +12% hp, +10% damage, one extra mechanic layer, and smarter objective/resource targeting.',
        'endgame':'Dynamic scaling capped at effective player level +8; boss difficulty comes from phases, adds, counters, and arena rules.'
    },
    'gearRules': {
        'slots':['Relic Weapon','Armor Body','Resonance Core'],
        'upgradeRisks':['No extra action loops','Boss damage bonuses capped','Ascension windows create recovery risk','Empowered Techniques cannot chain every round'],
        'rarityCaps': rarity_mod
    },
    'deitys': balance_rows,
    'enemies': creature_rows
}
write_json(os.path.join(DATA,'deity-enemy-balance-pass.json'), balance_doc)

# update balance analytics with actionable audit fields
analytics = read_json(os.path.join(DATA,'balance-analytics.json'))
analytics['version'] = '1.0.0'
analytics['latestBalancePassId'] = balance_doc['id']
analytics['tracked'] = list(dict.fromkeys(analytics.get('tracked',[]) + ['Deity combat power spread','Enemy threat weight','Gear effect pick rate','Ability cooldown use','Level-band clear rate']))
analytics['flags'] = list(dict.fromkeys(analytics.get('flags',[]) + ['Deity gear loop exploit','Enemy hp sponge risk','Elite remix overtuning','Ascension recovery bypass']))
analytics['manualReviewThresholds'] = {
    'deityWinRateWatch': '<45% or >57% over comparable mission bands',
    'gearUsageWatch': '>40% pick rate with >3% win lift',
    'enemyThreatWatch': 'Mission failure spike above +12% after elite remix',
    'combatPowerSpreadWatch': 'Role average spread above 18 effective power'
}
write_json(os.path.join(DATA,'balance-analytics.json'), analytics)

# change history append
ch_path=os.path.join(DATA,'change-history.json')
try:
    ch=read_json(ch_path)
except Exception:
    ch=[]
entry={'id':'MG-CHANGE-TITAN-ENEMY-BALANCE-001','date':datetime.now(timezone.utc).date().isoformat(),'type':'balance-content','summary':'Completed Deity names/abilities/gear pass and added enemy stat/scaling profiles for harder solo progression.','files':['data/deitys.json','deitys/*.json','data/creatures.json','creatures/*.json','data/deity-enemy-balance-pass.json','data/progression-system.json','data/balance-analytics.json']}
if isinstance(ch, list):
    if not any(e.get('id')==entry['id'] for e in ch if isinstance(e,dict)): ch.append(entry)
    write_json(ch_path,ch)
elif isinstance(ch, dict):
    ch.setdefault('entries',[])
    if not any(e.get('id')==entry['id'] for e in ch['entries']): ch['entries'].append(entry)
    write_json(ch_path,ch)

print(json.dumps({'updatedDeities':len(deitys),'updatedEnemies':len(creatures),'balanceDoc':'data/deity-enemy-balance-pass.json','deityPowerMin':balance_doc['deityBudget']['combatPowerMin'],'deityPowerMax':balance_doc['deityBudget']['combatPowerMax']}, indent=2))
