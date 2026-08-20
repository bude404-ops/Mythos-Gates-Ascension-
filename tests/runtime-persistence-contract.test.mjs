import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadRuntimePersistenceSql, validateRuntimePersistenceContract, runtimePersistenceSummary, authorizeRuntimeRequest } from '../src/platform/index.mjs';

const contract = JSON.parse(fs.readFileSync('data/runtime-persistence-boundary.json', 'utf8'));
const sql = loadRuntimePersistenceSql();
const validation = validateRuntimePersistenceContract(contract, sql);
assert.equal(validation.ok, true, validation.issues.join('; '));
const summary = runtimePersistenceSummary(contract);
assert.equal(summary.tables, 6);
assert.equal(summary.routes, 8);
assert.deepEqual(summary.environments, ['local', 'staging', 'production']);
assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS players'));
assert.ok(sql.includes('idempotency_key TEXT NOT NULL UNIQUE'));
assert.ok(!/DROP TABLE|TRUNCATE/i.test(sql));

const routes = Object.fromEntries(contract.routeBindings.map(route => [route.handler, route]));
assert.equal(authorizeRuntimeRequest(routes.commitSave, { subject: 'wallet:one', playerId: 'MG-PLAYER-001', roles: ['PLAYER'] }, 'MG-PLAYER-001').ok, true);
assert.equal(authorizeRuntimeRequest(routes.commitSave, { subject: 'wallet:two', playerId: 'MG-PLAYER-002', roles: ['PLAYER'] }, 'MG-PLAYER-001').ok, false);
assert.equal(authorizeRuntimeRequest(routes.getPlayerAuditTrail, { subject: 'admin:read', roles: ['ADMIN_READ'] }, 'MG-PLAYER-001').ok, true);
assert.equal(authorizeRuntimeRequest(routes.creditCurrency, { subject: 'service:economy', roles: ['SERVICE'] }, 'MG-PLAYER-001').ok, true);
assert.equal(authorizeRuntimeRequest(routes.creditCurrency, { subject: 'wallet:one', playerId: 'MG-PLAYER-001', roles: ['PLAYER'] }, 'MG-PLAYER-001').ok, false);
console.log(JSON.stringify({ ok: true, runtimePersistenceContract: 'PASS', summary }, null, 2));
