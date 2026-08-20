import fs from 'node:fs';

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const issues = [];
const warnings = [];
const framework = read('data/gameplay-balance-framework.json');
const deitys = read('data/deitys.json');
const roleMatrix = read('data/deity-role-matrix.json').factions.flatMap(f => f.deities || []);
const missions = read('data/mission-registry.json');
const enemies = read('data/enemy-archetype-registry.json');
const raid = read('data/raid-system.json');

const roles = [...new Set(deitys.map((t) => t.role))].sort();
const factions = [...new Set(deitys.map((t) => t.faction))].sort();
const mechanicFamilies = ['Solar Edict', 'Rune Oath', 'Aegis Favor', 'Spirit Seal', 'Geas Bloom', 'Choir Edict', 'Blood Contract'];

for (const role of roles) {
  if (!framework.roleContracts?.[role]) issues.push(`Missing role contract: ${role}`);
  const count = deitys.filter((t) => t.role === role).length;
  if (count < factions.length) warnings.push(`Role ${role} has only ${count} deities; expected at least one per faction.`);
}

for (const family of mechanicFamilies) {
  const count = roleMatrix.filter((t) => t.uniqueMechanic?.includes(family)).length;
  if (count !== 9) issues.push(`Mechanic family ${family} expected 4 deities, found ${count}.`);
}

for (const t of roleMatrix) {
  const text = `${t.uniqueMechanic} ${t.counterplay?.join(' ') || ''}`;
  if (!text.includes('Momentum') || !text.includes('Divinity')) issues.push(`${t.id} mechanic does not mention Momentum/Divinity.`);
  if (!/Counterplay:/i.test(t.uniqueMechanic || '')) issues.push(`${t.id} mechanic missing counterplay clause.`);
}

const requiredModes = ['campaignMission', 'chapterBoss', 'raid', 'weeklyTrial', 'ascension', 'asyncArena', 'futureModes'];
for (const mode of requiredModes) {
  const contract = framework.modeContracts?.[mode];
  if (!contract) issues.push(`Missing mode contract: ${mode}`);
  if (!contract?.requiredHooks?.length) issues.push(`Mode contract ${mode} missing required hooks.`);
  if (!contract?.balanceRule) issues.push(`Mode contract ${mode} missing balance rule.`);
}

const missionWithoutRoles = missions.filter((m) => !m.encouragedDeityRoles?.length);
if (missionWithoutRoles.length) issues.push(`${missionWithoutRoles.length} missions missing encouragedDeityRoles.`);
const missionWithoutProfiles = missions.filter((m) => !m.tacticalProfile);
if (missionWithoutProfiles.length) issues.push(`${missionWithoutProfiles.length} missions missing tacticalProfile.`);

const powers = deitys.map((t) => t.stats?.combatPower || 0);
const minPower = Math.min(...powers);
const maxPower = Math.max(...powers);
if (maxPower - minPower > 60) warnings.push(`deity combat power spread is ${maxPower - minPower}; watch roster dominance.`);

if (!Array.isArray(enemies.archetypes) || enemies.archetypes.length < 9) issues.push('Enemy archetype registry must cover at least 9 pressure types.');
if (!raid.stageProfiles || raid.stageProfiles.length < 5) issues.push('Raid system needs at least 5 stage profiles for scalable challenge.');
if (!framework.telemetry?.rebalanceTriggers?.length) issues.push('Framework missing rebalance triggers.');
if (!framework.antiPatterns?.includes('raw HP sponge scaling')) issues.push('Framework must explicitly ban raw HP sponge scaling.');

const report = {
  ok: issues.length === 0,
  issueCount: issues.length,
  warningCount: warnings.length,
  checked: {
    deitys: deitys.length,
    roles: roles.length,
    factions: factions.length,
    mechanicFamilies: mechanicFamilies.length,
    missions: missions.length,
    enemyArchetypes: Array.isArray(enemies.archetypes) ? enemies.archetypes.length : 0,
    raidStageProfiles: raid.stageProfiles?.length || 0,
    modeContracts: Object.keys(framework.modeContracts || {}).length,
    difficultyBands: framework.difficultyBands?.length || 0,
  },
  issues,
  warnings,
};
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
