import assert from 'node:assert/strict';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('data/canon-version-manifest.json', 'utf8'));
const policy = fs.readFileSync('docs/production/DATA_MIGRATION_VERSIONING.md', 'utf8');
const audit = fs.readFileSync('scripts/audit-aaa-structure.mjs', 'utf8');

assert.equal(manifest.status, 'ACTIVE');
assert.equal(manifest.schema, 'MG_CANON_VERSION_MANIFEST_V1');
assert.ok(manifest.migrations.length >= 4);
assert.equal(manifest.migrations.at(-1).toVersion, manifest.currentCanonVersion);
assert.ok(manifest.rules.migrationRequiredWhen.some(rule => rule.includes('schema required field')));
assert.ok(manifest.rules.migrationRequiredWhen.some(rule => rule.includes('engine adapters')));
assert.ok(manifest.rules.immutability.includes('append-only'));
assert.ok(policy.includes('Applied migrations are append-only'));
assert.ok(policy.includes('Release gate'));
assert.ok(audit.includes('data/canon-version-manifest.json'));

const ids = manifest.migrations.map(m => m.id);
assert.equal(new Set(ids).size, ids.length);
for (let i = 1; i < manifest.migrations.length; i++) {
  assert.equal(manifest.migrations[i].fromVersion, manifest.migrations[i - 1].toVersion);
}

console.log(JSON.stringify({
  ok: true,
  migrationContract: 'PASS',
  currentCanonVersion: manifest.currentCanonVersion,
  migrations: manifest.migrations.length,
  latest: manifest.migrations.at(-1).id
}, null, 2));
