import assert from 'node:assert/strict';
import {
  createPlatformProfile,
  grantDeity,
  setActiveDeity,
  completeMission,
  debitCurrency,
  exportSave,
  importSave,
  validatePlatformState,
  platformSummary
} from '../src/platform/index.mjs';

let state = createPlatformProfile({ playerId: 'TG-PLAYER-TEST-001', displayName: 'Platform Tester', starterDeityId: 'TG-TITAN-003' });
assert.equal(validatePlatformState(state).ok, true);
assert.equal(state.roster.activeDeityId, 'TG-TITAN-003');
assert.equal(state.inventory.currencies.sunshards, 120);

state = grantDeity(state, 'TG-TITAN-001', { source: 'TEST_UNLOCK' });
state = setActiveDeity(state, 'TG-TITAN-001');
state = completeMission(state, 'TG-F01-C01-M01', { accountXp: 125, currencies: { sunshards: 40, gateKeys: 1 }, deitys: ['TG-TITAN-002'] });
state = debitCurrency(state, 'sunshards', 50, 'TEST_CRAFT');

const exported = exportSave(state);
const imported = importSave(exported);
const summary = platformSummary(imported);

assert.equal(validatePlatformState(imported).ok, true);
assert.equal(summary.level, 2);
assert.equal(summary.activeDeityId, 'TG-TITAN-001');
assert.equal(summary.ownedDeities, 3);
assert.equal(summary.completedMissions, 1);
assert.equal(summary.currencies.sunshards, 110);
assert.equal(summary.currencies.gateKeys, 2);
assert.ok(summary.ledgerEntries >= 5);
assert.ok(summary.platformEvents >= summary.ledgerEntries);
assert.ok(summary.checksum.length >= 12);

console.log(JSON.stringify({ ok: true, platformCoreContract: 'PASS', summary }, null, 2));
