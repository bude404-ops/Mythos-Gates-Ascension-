import crypto from 'node:crypto';
import { createPlatformProfile, creditCurrency, debitCurrency, exportSave, importSave, platformSummary, validatePlatformState } from './platform-core.mjs';

export const BACKEND_BOUNDARY_SERVICES = Object.freeze(['profile-service', 'cloud-save-service', 'economy-ledger-service', 'telemetry-ingestion-service']);

export function createLocalHostedBackendBoundary({ now = () => '2026-08-16T23:20:00.000Z' } = {}) {
  const profiles = new Map();
  const saves = new Map();
  const idempotency = new Map();
  const telemetry = [];

  return Object.freeze({
    createProfile(input = {}, request = {}) {
      return once(idempotency, request.idempotencyKey || `create:${input.playerId || 'default'}`, () => {
        const state = createPlatformProfile({ ...input, now });
        const playerId = state.player.playerId;
        profiles.set(playerId, { ...state.player });
        saves.set(playerId, { saveVersion: 1, checksum: checksum(state), state });
        telemetry.push(event('PROFILE_SERVICE_CREATED', playerId, { displayName: state.player.displayName }));
        return response({ profile: profiles.get(playerId), saveVersion: 1, summary: platformSummary(state) });
      });
    },
    getProfile(playerId) {
      requireProfile(profiles, playerId);
      return response({ profile: profiles.get(playerId) });
    },
    loadSave(playerId) {
      requireProfile(profiles, playerId);
      const record = saves.get(playerId);
      return response({ saveVersion: record.saveVersion, checksum: record.checksum, state: snapshot(record.state) });
    },
    commitSave(playerId, state, { expectedVersion, idempotencyKey } = {}) {
      return once(idempotency, idempotencyKey || `save:${playerId}:${expectedVersion}`, () => {
        requireProfile(profiles, playerId);
        const record = saves.get(playerId);
        if (record.saveVersion !== expectedVersion) throw new Error(`Save version conflict: expected ${expectedVersion}, current ${record.saveVersion}`);
        const validation = validatePlatformState(state);
        if (!validation.ok) throw new Error(`Invalid save state: ${validation.issues.join('; ')}`);
        const nextVersion = record.saveVersion + 1;
        const next = snapshot(state);
        saves.set(playerId, { saveVersion: nextVersion, checksum: checksum(next), state: next });
        telemetry.push(event('CLOUD_SAVE_COMMITTED', playerId, { saveVersion: nextVersion }));
        return response({ saveVersion: nextVersion, checksum: checksum(next), summary: platformSummary(next) });
      });
    },
    creditCurrency(playerId, currency, amount, reason, request = {}) {
      return mutateEconomy(idempotency, saves, profiles, telemetry, playerId, request.idempotencyKey || `credit:${playerId}:${currency}:${amount}:${reason}`, state => creditCurrency(state, currency, amount, reason));
    },
    debitCurrency(playerId, currency, amount, reason, request = {}) {
      return mutateEconomy(idempotency, saves, profiles, telemetry, playerId, request.idempotencyKey || `debit:${playerId}:${currency}:${amount}:${reason}`, state => debitCurrency(state, currency, amount, reason));
    },
    exportSave(playerId) {
      requireProfile(profiles, playerId);
      return response({ serialized: exportSave(saves.get(playerId).state) });
    },
    importSave(playerId, serialized, { expectedVersion, idempotencyKey } = {}) {
      return this.commitSave(playerId, importSave(serialized), { expectedVersion, idempotencyKey });
    },
    ingestEventBatch(events, { idempotencyKey = `telemetry:${events?.length || 0}:${telemetry.length}` } = {}) {
      return once(idempotency, idempotencyKey, () => {
        if (!Array.isArray(events)) throw new Error('events must be an array');
        for (const input of events) telemetry.push(event(input.type || 'CLIENT_EVENT', input.playerId || 'UNKNOWN', input.payload || {}));
        return response({ accepted: events.length, totalEvents: telemetry.length });
      });
    },
    queryPlayerEventCount(playerId) {
      return response({ playerId, events: telemetry.filter(e => e.playerId === playerId).length });
    }
  });
}

export function validateBackendBoundaryContract(contract) {
  const issues = [];
  for (const serviceId of BACKEND_BOUNDARY_SERVICES) if (!contract.authoritativeServices?.some(s => s.id === serviceId)) issues.push(`missing service ${serviceId}`);
  for (const op of ['createProfile','loadSave','commitSave','creditCurrency','debitCurrency','ingestEventBatch']) {
    if (!JSON.stringify(contract).includes(op)) issues.push(`missing required operation ${op}`);
  }
  for (const rule of ['idempotency','authority','versioning','auditability','offlineCompatibility']) if (!contract.serviceLevelRules?.[rule]) issues.push(`missing service rule ${rule}`);
  return { ok: issues.length === 0, issues };
}

function mutateEconomy(idempotency, saves, profiles, telemetry, playerId, key, reducer) {
  return once(idempotency, key, () => {
    requireProfile(profiles, playerId);
    const record = saves.get(playerId);
    const next = reducer(record.state);
    const saveVersion = record.saveVersion + 1;
    saves.set(playerId, { saveVersion, checksum: checksum(next), state: next });
    telemetry.push(event('ECONOMY_LEDGER_MUTATED', playerId, { saveVersion, ledgerEntries: next.ledger.length }));
    return response({ saveVersion, checksum: checksum(next), summary: platformSummary(next), ledgerEntries: next.ledger.length });
  });
}

function once(cache, key, fn) {
  if (cache.has(key)) return snapshot(cache.get(key));
  const result = fn();
  cache.set(key, result);
  return snapshot(result);
}
function requireProfile(profiles, playerId) { if (!profiles.has(playerId)) throw new Error(`Unknown player profile: ${playerId}`); }
function response(payload) { return { ok: true, ...payload }; }
function event(type, playerId, payload) { return { id: `BEVT-${crypto.randomUUID()}`, type, playerId, payload }; }
function snapshot(value) { return JSON.parse(JSON.stringify(value)); }
function checksum(value) { return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16); }
