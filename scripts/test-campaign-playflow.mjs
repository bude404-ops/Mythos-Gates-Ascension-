import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const contract = read('data/campaign-playflow-contract.json');
const factions = read('data/factions.json');
const campaignChapters = read('data/campaign-chapter-registry.json');
const missions = read('data/mission-registry.json');
const titans = read('data/titans.json');
const maps = read('data/maps.json');
const dialogue = read('data/mission-dialogue.json');
const artPackages = read('data/mission-art-packages.json');
const tasks = read('data/development-tasks.json');
const game = fs.readFileSync('game/index.html', 'utf8');
const hubRuntime = fs.readFileSync('game/command-hub-runtime.mjs', 'utf8');

assert.equal(contract.status, 'IMPLEMENTED');
assert.deepEqual(contract.routeStates, ['campaigns','chapters','mission','battle']);
assert.equal(contract.flow.length, factions.length);
const missionIds = new Set(missions.map(m => m.id));
const mapIds = new Set(maps.map(m => m.id));
const dialogueIds = new Set(dialogue.map(d => d.id));
const artIds = new Set(artPackages.map(a => a.id));

for (const route of contract.flow) {
  assert.ok(factions.some(f => f.id === route.factionId), `invalid faction ${route.factionId}`);
  assert.equal(route.chapterCount, 5, `${route.factionName} needs five chapters`);
  assert.equal(route.normalMissionCount, 20, `${route.factionName} normal count`);
  assert.equal(route.eliteMissionCount, 20, `${route.factionName} elite count`);
  assert.equal(route.chapterRoutes.length, 5, `${route.factionName} chapter routes`);
  for (const chapter of route.chapterRoutes) {
    const registry = campaignChapters.find(c => c.id === chapter.chapterId);
    assert.ok(registry, `missing registry ${chapter.chapterId}`);
    assert.equal(chapter.normalMissionIds.length, 4);
    assert.equal(chapter.eliteMissionIds.length, 4);
    for (const id of [...chapter.normalMissionIds, ...chapter.eliteMissionIds]) {
      assert.ok(missionIds.has(id), `missing mission ${id}`);
      const mission = missions.find(m => m.id === id);
      assert.ok(mapIds.has(mission.mapId), `${id} missing map`);
      assert.ok(dialogueIds.has(mission.dialogueId), `${id} missing dialogue`);
      assert.ok(artIds.has(mission.artPackageId), `${id} missing art package`);
      assert.ok(mission.objectives?.primary, `${id} missing primary objective`);
      assert.ok(Array.isArray(mission.objectives?.optional) && mission.objectives.optional.length >= 2, `${id} missing optional objectives`);
      assert.ok(mission.rewards, `${id} missing rewards`);
      assert.ok(mission.tacticalProfile?.favoredNotRequired === true, `${id} missing favored tactical profile`);
      assert.equal(mission.tacticalProfile?.ownershipLock, false, `${id} tactical profile must not lock ownership`);
      assert.ok(mission.tacticalProfile?.problemTags?.length >= 3, `${id} missing problem tags`);
      assert.ok(mission.tacticalProfile?.advantageRoles?.length >= 2, `${id} missing advantage roles`);
      assert.ok(mission.tacticalProfile?.recommendedTitanIds?.every(tid => titans.some(t => t.id === tid)), `${id} invalid recommended Titan`);
    }
    assert.equal(chapter.handoff.defaultMissionId || chapter.defaultMissionId, chapter.normalMissionIds[0]);
    assert.ok(chapter.handoff.battleRoute.includes(chapter.normalMissionIds[0]));
  }
}

for (const token of ['createCommandHubRuntime','function campaigns','function missionScreen','function battleScreen','openCampaign(factionId)','launchBattle(){','ENTER BATTLE','Campaign Gates','missionTacticalBrief','tacticalProfileForMission','Tactical Read','Favored Not Required','Ownership Lock']) {
  assert.ok(hubRuntime.includes(token), `hub runtime missing ${token}`);
}
for (const token of ['command-hub-runtime.mjs','Command Hub','OPEN THE MYTHOS GATE']) {
  assert.ok(game.includes(token), `game missing ${token}`);
}
assert.equal(tasks.find(t => t.id === 'TG-DEV-006')?.status, 'COMPLETED');
assert.equal(tasks.find(t => t.id === 'TG-DEV-010')?.status, 'COMPLETED');
console.log(JSON.stringify({ ok: true, campaignPlayflow: 'PASS', factions: contract.flow.length, chapters: contract.flow.reduce((s,f)=>s+f.chapterRoutes.length,0), normalMissions: contract.flow.reduce((s,f)=>s+f.normalMissionCount,0), eliteMissions: contract.flow.reduce((s,f)=>s+f.eliteMissionCount,0) }, null, 2));
