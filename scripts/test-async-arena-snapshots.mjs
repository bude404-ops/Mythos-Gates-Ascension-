import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const arena = read('data/async-arena-system.json');
const deitys = read('data/deitys.json');
const solo = read('data/solo-deity-roster-redesign.json');
const dashboard = read('data/endgame-dashboard.json');
const tasks = read('data/development-tasks.json');
const mini = fs.readFileSync('mini-app/mythos-gates-ascension.html', 'utf8');
const deityIds = new Set(deitys.map(t => t.id));
const soloIds = new Set(solo.deities.map(t => t.id));

assert.equal(arena.status, 'IMPLEMENTED');
assert.equal(arena.mode, 'ASYNCHRONOUS');
assert.equal(arena.livePvpImplemented, false);
assert.equal(arena.standardSquadSize, 1);
assert.equal(arena.snapshotRules.oneActiveDefenderDeity, true);
assert.equal(arena.snapshotRules.checksumRequired, true);
assert.equal(arena.snapshotRules.noFabricatedProgression, true);
assert.equal(arena.defenseSnapshots.length, arena.sampleOpponents.length);
assert.deepEqual(dashboard.sampleState, {});
assert.equal(dashboard.systemReadiness.asyncArena, 'Snapshot Model Ready');
assert.equal(dashboard.systemReadiness.livePvp, 'Not Implemented');

for (const snap of arena.defenseSnapshots) {
  for (const field of arena.defenseSnapshotFields) assert.ok(snap[field] !== undefined && snap[field] !== null && snap[field] !== '', `${snap.snapshotId} missing ${field}`);
  assert.ok(deityIds.has(snap.sourceDeityId), `${snap.snapshotId} invalid Deity`);
  assert.ok(soloIds.has(snap.sourceDeityId), `${snap.snapshotId} missing solo redesign`);
  assert.equal(snap.stanceLoadout.length, 3);
  assert.ok(snap.stanceLoadout.includes('Ascendant'));
  assert.ok(snap.reactionLoadout.length >= 2);
  assert.equal(snap.progressionState.payToWinBonus, false);
  const withoutChecksum = Object.fromEntries(Object.entries(snap).filter(([k]) => k !== 'checksum'));
  const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
  const expected = 'sha256:' + crypto.createHash('sha256').update(JSON.stringify(stable(withoutChecksum))).digest('hex');
  assert.equal(snap.checksum, expected);
}
for (const token of ['Lore Continuity Sweep', 'one-active-Deity canon', 'One active deity in standard combat', 'The Hollow is a non-playable campaign threat']) assert.ok(mini.includes(token), `mini missing ${token}`);
assert.equal(tasks.find(t => t.id === 'MG-TASK-SOLO-004')?.status, 'COMPLETED');
console.log(JSON.stringify({ ok: true, asyncArenaSnapshots: 'PASS', snapshots: arena.defenseSnapshots.length, livePvpImplemented: arena.livePvpImplemented, standardSquadSize: arena.standardSquadSize }, null, 2));
