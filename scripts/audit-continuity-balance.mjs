import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const data = {
  factions: read('data/factions.json'),
  codex: read('data/realm-codex.json'),
  lore: read('data/lore-index.json'),
  campaigns: read('data/campaigns.json'),
  chapters: read('data/campaign-chapter-registry.json'),
  missions: read('data/mission-registry.json'),
  dialogue: read('data/mission-dialogue.json'),
  arts: read('data/mission-art-packages.json'),
  titans: read('data/titans.json'),
  creatures: read('data/creatures.json'),
  maps: read('data/maps.json'),
  arcs: read('data/storyline-arc-registry.json'),
  consequences: read('data/campaign-consequence-registry.json'),
  balance: read('data/balance-analytics.json')
};

const issues = [];
const warnings = [];
const info = [];
const byId = arr => new Map(arr.map(item => [item.id, item]));
const missionsById = byId(data.missions);
const mapsById = byId(data.maps);

for (const faction of data.factions) {
  const codex = data.codex.find(entry => entry.factionId === faction.id);
  if (!codex) issues.push(`${faction.id} missing Realm Codex entry`);
  else {
    for (const field of ['thesis', 'centralConflict', 'landmarks', 'realmHazards', 'campaignHooks', 'visualLanguage', 'titans']) {
      if (!codex[field] || (Array.isArray(codex[field]) && !codex[field].length)) issues.push(`${faction.name} codex missing ${field}`);
    }
    if ((codex.titans || []).length !== 9) issues.push(`${faction.name} codex must cover 9 Titans`);
  }
  const loreHits = data.lore.filter(entry => JSON.stringify(entry).includes(faction.name) || JSON.stringify(entry).includes(faction.realm) || JSON.stringify(entry).includes(faction.id));
  if (!loreHits.length) issues.push(`${faction.name} missing lore-index coverage`);
}

for (const faction of data.factions) {
  const chapters = data.chapters.filter(ch => ch.factionId === faction.id).sort((a, b) => a.chapterNumber - b.chapterNumber);
  const normal = data.missions.filter(m => m.factionId === faction.id && m.campaignType === 'Normal').sort((a, b) => a.missionNumber - b.missionNumber);
  const elite = data.missions.filter(m => m.factionId === faction.id && m.campaignType === 'Elite').sort((a, b) => a.missionNumber - b.missionNumber);
  if (normal.length || elite.length) info.push(`${faction.name}: ${normal.length} Normal / ${elite.length} Elite missions across ${chapters.length} chapters`);

  if (chapters.length !== 5) issues.push(`${faction.name} expected 5 campaign chapters, found ${chapters.length}`);
  if (normal.length !== 20) issues.push(`${faction.name} expected 20 Normal missions, found ${normal.length}`);
  if (elite.length !== 20) issues.push(`${faction.name} expected 20 Elite missions, found ${elite.length}`);

  if (normal.length) {
    const expected = [...Array(normal.length)].map((_, i) => i + 1).join(',');
    const actual = normal.map(m => m.missionNumber).join(',');
    if (actual !== expected) issues.push(`${faction.name} Normal mission numbering gap: ${actual}`);
    for (let i = 1; i < normal.length; i++) if (normal[i].recommendedPower < normal[i - 1].recommendedPower) issues.push(`${faction.name} Normal power drops ${normal[i - 1].id}->${normal[i].id}`);
    const bosses = normal.filter(m => m.boss).map(m => m.missionNumber);
    for (const milestone of [4, 8, 12, 16, 20]) if (!bosses.includes(milestone)) warnings.push(`${faction.name} Normal lacks boss at milestone ${milestone}`);
  }

  if (elite.length) {
    const expected = [...Array(elite.length)].map((_, i) => i + 1).join(',');
    const actual = elite.map(m => m.missionNumber).join(',');
    if (actual !== expected) issues.push(`${faction.name} Elite mission numbering gap: ${actual}`);
    for (const eliteMission of elite) {
      const base = missionsById.get(eliteMission.eliteRemixOf);
      if (!base) issues.push(`${eliteMission.id} missing base mission ${eliteMission.eliteRemixOf}`);
      else if (eliteMission.recommendedPower <= base.recommendedPower) issues.push(`${eliteMission.id} Elite power ${eliteMission.recommendedPower} not higher than base ${base.recommendedPower}`);
    }
  }

  for (const chapter of chapters) {
    for (const missionId of [...(chapter.missionIds || []), ...(chapter.eliteMissionIds || [])]) {
      const mission = missionsById.get(missionId);
      if (!mission) continue;
      if (mission.chapter !== chapter.chapterNumber) issues.push(`${missionId} chapter ${mission.chapter} mismatches ${chapter.id}`);
      if (mission.factionId !== chapter.factionId) issues.push(`${missionId} faction ${mission.factionId} mismatches ${chapter.id}`);
    }
  }
}

const obsoleteStandardCombatTerms = ['three-Titan', 'five-Titan', 'five Titan', 'five Titans', 'strike force', 'standard squad', 'adjacent Titans'];
for (const mission of data.missions) {
  if (mission.teamSize !== 1) issues.push(`${mission.id} teamSize ${mission.teamSize} should be 1 for one active Titan combat`);
  const missionText = JSON.stringify({ objectives: mission.objectives, specialRules: mission.specialRules, victoryConditions: mission.victoryConditions });
  for (const term of obsoleteStandardCombatTerms) if (missionText.includes(term)) issues.push(`${mission.id} uses obsolete standard-combat wording: ${term}`);
  if (mission.activeTitanPolicy?.standardCombat !== 'ONE_PLAYER_CONTROLLED_TITAN') issues.push(`${mission.id} missing one active Titan policy`);
  if (!mission.chapterId) issues.push(`${mission.id} missing chapterId link`);
  if (mission.turnLimit != null && !(mission.turnLimit >= 8 && mission.turnLimit <= 20)) warnings.push(`${mission.id} turnLimit ${mission.turnLimit} outside expected 8-20`);
  if (mission.campaignType === 'Normal' && mission.turnLimit == null) issues.push(`${mission.id} Normal mission missing turnLimit`);
  if (!mission.rewards?.firstClear?.length || !mission.rewards?.replay?.length) issues.push(`${mission.id} rewards incomplete`);
  const dialogue = data.dialogue.find(item => item.id === mission.dialogueId);
  if (!dialogue) issues.push(`${mission.id} missing dialogue object`);
  else if (dialogue.missionId !== mission.id) issues.push(`${mission.id} dialogue points to ${dialogue.missionId}`);
  if (dialogue) for (const term of obsoleteStandardCombatTerms) if (JSON.stringify(dialogue).includes(term)) issues.push(`${mission.id} dialogue uses obsolete wording: ${term}`);
  const art = data.arts.find(item => item.id === mission.artPackageId);
  if (!art) issues.push(`${mission.id} missing art package object`);
  else if (art.missionId !== mission.id) issues.push(`${mission.id} art package points to ${art.missionId}`);
  if (!mapsById.has(mission.mapId)) issues.push(`${mission.id} missing map ${mission.mapId}`);
}

const titanBudgetsByFaction = {};
const titanRoles = {};
const titanRarities = {};
for (const titan of data.titans) {
  const stats = titan.stats || {};
  const budget = (stats.hp || 0) + (stats.attack || 0) * 3 + (stats.range || 0) * 4 + (stats.energy || 0) * 5 + (stats.speed || 0) * 4;
  if (stats.hp < 20 || stats.hp > 55) issues.push(`${titan.id} hp out of band ${stats.hp}`);
  if (stats.attack < 5 || stats.attack > 16) issues.push(`${titan.id} attack out of band ${stats.attack}`);
  if (stats.range < 1 || stats.range > 5) issues.push(`${titan.id} range out of band ${stats.range}`);
  if (stats.energy < 2 || stats.energy > 5) issues.push(`${titan.id} energy out of band ${stats.energy}`);
  if (stats.speed < 2 || stats.speed > 5) issues.push(`${titan.id} speed out of band ${stats.speed}`);
  (titanBudgetsByFaction[titan.faction] ??= []).push(budget);
  titanRoles[titan.role] = (titanRoles[titan.role] || 0) + 1;
  titanRarities[titan.rarity] = (titanRarities[titan.rarity] || 0) + 1;
}

const factionBudgetAverages = {};
for (const [faction, budgets] of Object.entries(titanBudgetsByFaction)) {
  factionBudgetAverages[faction] = Number((budgets.reduce((a, b) => a + b, 0) / budgets.length).toFixed(1));
  if (budgets.length !== 9) issues.push(`${faction} has ${budgets.length} Titans, expected 9`);
}
const budgetValues = Object.values(factionBudgetAverages);
const budgetSpread = Number((Math.max(...budgetValues) - Math.min(...budgetValues)).toFixed(1));
if (budgetSpread > 12) warnings.push(`Faction stat budget spread ${budgetSpread} exceeds 12`);

const powerCurves = {};
for (const faction of data.factions) {
  const normal = data.missions.filter(m => m.factionId === faction.id && m.campaignType === 'Normal').sort((a, b) => a.missionNumber - b.missionNumber);
  const elite = data.missions.filter(m => m.factionId === faction.id && m.campaignType === 'Elite').sort((a, b) => a.missionNumber - b.missionNumber);
  if (normal.length || elite.length) powerCurves[faction.name] = {
    normal: normal.length ? [normal[0].recommendedPower, normal.at(-1).recommendedPower] : null,
    elite: elite.length ? [elite[0].recommendedPower, elite.at(-1).recommendedPower] : null
  };
}

const report = {
  id: 'TG-CONTINUITY-BALANCE-AUDIT-001',
  generated: new Date().toISOString(),
  status: issues.length ? 'FAIL' : warnings.length ? 'PASS_WITH_WARNINGS' : 'PASS',
  issues,
  warnings,
  summary: {
    factions: data.factions.length,
    realmCodexEntries: data.codex.length,
    loreEntries: data.lore.length,
    campaigns: data.campaigns.length,
    campaignChapters: data.chapters.length,
    missions: data.missions.length,
    missionDialogue: data.dialogue.length,
    missionArtPackages: data.arts.length,
    titans: data.titans.length,
    statBudgetSpread: budgetSpread
  },
  flow: {
    implementedFactionCampaigns: info,
    powerCurves
  },
  balance: {
    factionBudgetAverages,
    roleCounts: titanRoles,
    rarityCounts: titanRarities,
    policy: data.balance.policy
  }
};

fs.writeFileSync(path.join(root, 'data/continuity-balance-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (issues.length) process.exit(1);
