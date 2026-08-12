import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const slice = read('data/solo-vertical-slice.json');
const creatures = read('data/creatures.json');
const schema = read('data/solo-battle-state-schema.json');
const tasks = read('data/development-tasks.json');
const creatureIds = new Set(creatures.map(c => c.id));
const reducerNames = new Set(schema.reducers.map(r => r.name));

assert.equal(slice.id, 'TG-SOLO-VERTICAL-SLICE-ATEN-RA-001');
assert.equal(slice.status, 'IMPLEMENTED');
assert.equal(slice.faction.id, 'TG-FACTION-001');
assert.equal(slice.starterTitan.id, schema.verticalSliceDefault.starterTitanId);
assert.equal(slice.missionTypes.length, 5, 'slice must have exactly five pre-boss mission types');
assert.equal(slice.bossEncounter.phasePlan.length, 5, 'boss must expose five readable phases');
assert.ok(slice.qualityGates.includes('Exactly one active player Titan'));
assert.ok(slice.telemetryContract.includes('reactionSuccessRate'));
assert.ok(slice.telemetryContract.includes('bossPhaseReached'));

const missionTypeIds = new Set();
for (const mission of slice.missionTypes) {
  assert.ok(!missionTypeIds.has(mission.id), `duplicate mission id ${mission.id}`);
  missionTypeIds.add(mission.id);
  assert.ok(mission.primaryObjective.length > 20, `${mission.id}: primary objective too thin`);
  assert.ok(mission.teaches.length >= 3, `${mission.id}: needs at least three teaching beats`);
  assert.ok(mission.requiredReducers.length >= 3, `${mission.id}: reducer linkage too thin`);
  for (const reducer of mission.requiredReducers) assert.ok(reducerNames.has(reducer), `${mission.id}: invalid reducer ${reducer}`);
  for (const enemyId of mission.enemyIds) assert.ok(creatureIds.has(enemyId), `${mission.id}: invalid enemy ${enemyId}`);
  for (const objectiveId of mission.objectiveIds) assert.ok(slice.objectiveStateDefaults.some(o => o.id === objectiveId), `${mission.id}: missing objective default ${objectiveId}`);
}

assert.ok(creatureIds.has(slice.bossEncounter.enemyId), 'boss enemy id must resolve to creature roster');
for (const objectiveId of slice.bossEncounter.objectiveIds) {
  assert.ok(slice.objectiveStateDefaults.some(o => o.id === objectiveId), `boss objective default missing ${objectiveId}`);
}
for (const phase of slice.bossEncounter.phasePlan) {
  assert.ok(phase.mechanic.length > 30, `boss phase ${phase.phase}: mechanic too thin`);
  assert.ok(phase.telemetryKey.startsWith('boss_phase_'), `boss phase ${phase.phase}: telemetry key malformed`);
}

const soloTask = tasks.find(t => t.id === 'TG-TASK-SOLO-003');
assert.equal(soloTask.status, 'COMPLETED');
assert.ok(soloTask.relatedFiles.includes('data/solo-vertical-slice.json'));
assert.ok(soloTask.relatedFiles.includes('scripts/test-solo-vertical-slice.mjs'));

console.log(JSON.stringify({
  ok: true,
  soloVerticalSlice: 'PASS',
  missions: slice.missionTypes.length,
  bossPhases: slice.bossEncounter.phasePlan.length,
  objectives: slice.objectiveStateDefaults.length,
  telemetry: slice.telemetryContract.length
}, null, 2));
