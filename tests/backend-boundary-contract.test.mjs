import assert from 'node:assert/strict';
import { createLocalHostedBackendBoundary, validateBackendBoundaryContract } from '../src/platform/index.mjs';
import fs from 'node:fs';

const contract = JSON.parse(fs.readFileSync('data/hosted-backend-boundary.json', 'utf8'));
assert.equal(validateBackendBoundaryContract(contract).ok, true);

const backend = createLocalHostedBackendBoundary();
const createdA = backend.createProfile({ playerId: 'TG-BACKEND-PLAYER-001', displayName: 'Cloud Gatebreaker', starterDeityId: 'TG-TITAN-003' }, { idempotencyKey: 'create-player' });
const createdB = backend.createProfile({ playerId: 'TG-BACKEND-PLAYER-001', displayName: 'Cloud Gatebreaker', starterDeityId: 'TG-TITAN-003' }, { idempotencyKey: 'create-player' });
assert.deepEqual(createdA, createdB, 'profile creation must be idempotent');
assert.equal(createdA.saveVersion, 1);

const creditA = backend.creditCurrency('TG-BACKEND-PLAYER-001', 'sunshards', 50, 'CLOUD_REWARD', { idempotencyKey: 'reward-001' });
const creditB = backend.creditCurrency('TG-BACKEND-PLAYER-001', 'sunshards', 50, 'CLOUD_REWARD', { idempotencyKey: 'reward-001' });
assert.deepEqual(creditA, creditB, 'credit retry must not double spend/grant');
assert.equal(creditA.summary.currencies.sunshards, 170);

const debit = backend.debitCurrency('TG-BACKEND-PLAYER-001', 'sunshards', 20, 'CRAFT_COST', { idempotencyKey: 'craft-001' });
assert.equal(debit.summary.currencies.sunshards, 150);

const loaded = backend.loadSave('TG-BACKEND-PLAYER-001');
assert.equal(loaded.saveVersion, 3);
assert.throws(() => backend.commitSave('TG-BACKEND-PLAYER-001', loaded.state, { expectedVersion: 2, idempotencyKey: 'stale-save' }), /Save version conflict/);
const committed = backend.commitSave('TG-BACKEND-PLAYER-001', loaded.state, { expectedVersion: 3, idempotencyKey: 'commit-001' });
assert.equal(committed.saveVersion, 4);

const exported = backend.exportSave('TG-BACKEND-PLAYER-001');
const imported = backend.importSave('TG-BACKEND-PLAYER-001', exported.serialized, { expectedVersion: 4, idempotencyKey: 'import-001' });
assert.equal(imported.saveVersion, 5);
const telemetry = backend.ingestEventBatch([{ playerId: 'TG-BACKEND-PLAYER-001', type: 'MISSION_RUNTIME', payload: { missionId: 'TG-F01-C01-M01' } }], { idempotencyKey: 'telemetry-001' });
assert.equal(telemetry.accepted, 1);
assert.ok(backend.queryPlayerEventCount('TG-BACKEND-PLAYER-001').events >= 4);

console.log(JSON.stringify({ ok: true, backendBoundaryContract: 'PASS', final: imported.summary, telemetry }, null, 2));
