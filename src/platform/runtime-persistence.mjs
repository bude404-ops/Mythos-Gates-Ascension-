import fs from 'node:fs';

export const REQUIRED_RUNTIME_TABLES = Object.freeze(['players', 'player_saves', 'economy_ledger', 'telemetry_events', 'idempotency_keys', 'admin_audit_log']);
export const REQUIRED_RUNTIME_ROUTES = Object.freeze(['createProfile', 'getProfile', 'loadSave', 'commitSave', 'creditCurrency', 'debitCurrency', 'ingestEventBatch', 'getPlayerAuditTrail']);

export function loadRuntimePersistenceSql(path = 'src/platform/runtime-persistence.sql') {
  return fs.readFileSync(path, 'utf8');
}

export function validateRuntimePersistenceContract(contract, sql = '') {
  const issues = [];
  if (contract?.schema !== 'TG_RUNTIME_PERSISTENCE_V1') issues.push('schema must be TG_RUNTIME_PERSISTENCE_V1');
  if (contract?.database?.migrationPolicy !== 'additive-idempotent') issues.push('database migration policy must be additive-idempotent');
  for (const table of REQUIRED_RUNTIME_TABLES) {
    if (!contract?.database?.tables?.some(entry => entry.name === table)) issues.push(`missing runtime table contract: ${table}`);
    if (sql && !sql.includes(`CREATE TABLE IF NOT EXISTS ${table}`)) issues.push(`SQL missing idempotent table creation: ${table}`);
  }
  for (const handler of REQUIRED_RUNTIME_ROUTES) if (!contract?.routeBindings?.some(route => route.handler === handler)) issues.push(`missing runtime route binding: ${handler}`);
  for (const claim of ['subject', 'wallet', 'roles']) if (!contract?.authBoundary?.trustedClaims?.includes(claim)) issues.push(`missing trusted auth claim: ${claim}`);
  for (const field of ['request_id', 'player_id', 'route', 'latency_ms', 'status_code']) if (!contract?.observability?.includes(field)) issues.push(`missing observability field: ${field}`);
  if (sql && /DROP TABLE|ALTER TABLE\s+\w+\s+DROP|TRUNCATE/i.test(sql)) issues.push('runtime SQL contains destructive migration statement');
  return { ok: issues.length === 0, issues };
}

export function authorizeRuntimeRequest(binding, actor, targetPlayerId) {
  if (!binding) throw new Error('route binding is required');
  if (!actor?.subject) return { ok: false, reason: 'MISSING_SUBJECT' };
  const roles = new Set(actor.roles || []);
  if (binding.auth === 'OWNER' || binding.auth === 'OWNER_OR_ADMIN_READ') {
    if (actor.playerId === targetPlayerId) return { ok: true, reason: 'OWNER' };
    if (binding.auth === 'OWNER_OR_ADMIN_READ' && roles.has('ADMIN_READ')) return { ok: true, reason: 'ADMIN_READ' };
    return { ok: false, reason: 'NOT_OWNER' };
  }
  if (binding.auth === 'SERVICE_OR_ADMIN_WRITE') return { ok: roles.has('SERVICE') || roles.has('ADMIN_WRITE'), reason: roles.has('SERVICE') ? 'SERVICE' : roles.has('ADMIN_WRITE') ? 'ADMIN_WRITE' : 'MISSING_WRITE_ROLE' };
  if (binding.auth === 'ADMIN_READ') return { ok: roles.has('ADMIN_READ'), reason: roles.has('ADMIN_READ') ? 'ADMIN_READ' : 'MISSING_ADMIN_READ' };
  if (binding.auth === 'PLAYER_OR_SERVICE') return { ok: roles.has('PLAYER') || roles.has('SERVICE'), reason: roles.has('SERVICE') ? 'SERVICE' : roles.has('PLAYER') ? 'PLAYER' : 'MISSING_PLAYER_OR_SERVICE' };
  return { ok: roles.has(binding.auth), reason: roles.has(binding.auth) ? binding.auth : 'MISSING_ROLE' };
}

export function runtimePersistenceSummary(contract) {
  return {
    version: contract.version,
    tables: contract.database.tables.length,
    routes: contract.routeBindings.length,
    adminOperations: contract.adminOperations.length,
    environments: contract.environments.map(env => env.name),
    observabilityFields: contract.observability.length
  };
}
