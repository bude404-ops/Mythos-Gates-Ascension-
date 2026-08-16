import fs from 'node:fs';
import assert from 'node:assert/strict';

const manifest = JSON.parse(fs.readFileSync('data/canon-version-manifest.json', 'utf8'));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const issues = [];
const versionPattern = /^[0-9]+\.[0-9]+\.[0-9]+-[a-z0-9-]+$/;

function issue(message){ issues.push(message); }
function exists(file){ return fs.existsSync(file) && fs.statSync(file).isFile(); }

if (manifest.id !== 'TG-CANON-VERSION-MANIFEST-001') issue('Invalid manifest id.');
if (manifest.schema !== 'TG_CANON_VERSION_MANIFEST_V1') issue('Invalid manifest schema.');
if (manifest.status !== 'ACTIVE') issue('Manifest must be ACTIVE.');
if (!versionPattern.test(manifest.currentCanonVersion || '')) issue('currentCanonVersion must use MAJOR.MINOR.PATCH-slug.');
if (!exists(manifest.policyRef || '')) issue(`Missing policyRef file: ${manifest.policyRef}`);

const allowedStatuses = new Set(manifest.rules?.allowedStatuses || []);
const allowedTypes = new Set(manifest.rules?.allowedTypes || []);
for (const status of ['PLANNED','READY','APPLIED','SUPERSEDED']) if (!allowedStatuses.has(status)) issue(`Missing allowed status ${status}`);
for (const type of ['SCHEMA_EXPANSION','CONTENT_BACKFILL','RUNTIME_PROJECTION','ENGINE_EXPORT','VALIDATION_GATE','CANON_FIX','DOC_POLICY']) if (!allowedTypes.has(type)) issue(`Missing allowed type ${type}`);

const migrations = manifest.migrations || [];
if (!Array.isArray(migrations) || migrations.length === 0) issue('At least one migration is required.');
const ids = new Set();
let latestApplied = null;
for (let i = 0; i < migrations.length; i++) {
  const m = migrations[i];
  const expectedId = `TG-MIG-${String(i + 1).padStart(3, '0')}`;
  if (m.id !== expectedId) issue(`Migration ${i + 1} must be ${expectedId}, got ${m.id}`);
  if (ids.has(m.id)) issue(`Duplicate migration id: ${m.id}`);
  ids.add(m.id);
  if (!versionPattern.test(m.fromVersion || '')) issue(`${m.id} fromVersion must use MAJOR.MINOR.PATCH-slug.`);
  if (!versionPattern.test(m.toVersion || '')) issue(`${m.id} toVersion must use MAJOR.MINOR.PATCH-slug.`);
  if (i > 0 && m.fromVersion !== migrations[i - 1].toVersion) issue(`${m.id} fromVersion must equal previous migration toVersion.`);
  if (!allowedStatuses.has(m.status)) issue(`${m.id} has unknown status ${m.status}`);
  if (!allowedTypes.has(m.type)) issue(`${m.id} has unknown type ${m.type}`);
  if (!m.owner || !m.summary || String(m.summary).length < 30) issue(`${m.id} needs owner and meaningful summary.`);
  if (!Array.isArray(m.affectedData) || m.affectedData.length === 0) issue(`${m.id} must list affectedData.`);
  for (const file of m.affectedData || []) if (!exists(file)) issue(`${m.id} affectedData missing: ${file}`);
  if (!Array.isArray(m.validation) || m.validation.length === 0) issue(`${m.id} must list validation commands.`);
  if (m.status === 'APPLIED') latestApplied = m;
}
if (latestApplied?.toVersion !== manifest.currentCanonVersion) issue('currentCanonVersion must equal the latest applied migration toVersion.');
if (!pkg.scripts?.['validate:migrations']) issue('package.json missing validate:migrations script.');
if (!pkg.scripts?.['test:migration-contracts']) issue('package.json missing test:migration-contracts script.');
if (!pkg.scripts?.['precommit:verify']?.includes('npm run validate:migrations')) issue('precommit:verify must enforce migration validation.');
if (!pkg.scripts?.['precommit:verify']?.includes('npm run test:migration-contracts')) issue('precommit:verify must enforce migration contract tests.');

const result = {
  ok: issues.length === 0,
  canonMigrations: issues.length === 0 ? 'PASS' : 'FAIL',
  currentCanonVersion: manifest.currentCanonVersion,
  migrations: migrations.length,
  latestMigration: migrations.at(-1)?.id || null,
  issues
};
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
