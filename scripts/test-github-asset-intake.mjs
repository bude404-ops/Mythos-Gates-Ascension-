import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const REGISTRY = path.join(ROOT, 'asset_registry/github-asset-registry.json');
const DETECTION_REPORT = path.join(ROOT, 'validation/reports/github-asset-detection-report.json');
const VALIDATION_REPORT = path.join(ROOT, 'validation/reports/github-asset-validation-report.json');
const FIXTURE_DIR = path.join(ROOT, 'assets/3d/battlefields/source/BATTLEFIELD_001/v001');
const FIXTURE = path.join(FIXTURE_DIR, 'BATTLEFIELD_001.external-intake-test.gltf');

const backups = new Map();
for (const file of [REGISTRY, DETECTION_REPORT, VALIDATION_REPORT]) {
  if (fs.existsSync(file)) backups.set(file, fs.readFileSync(file));
}

function restore() {
  if (fs.existsSync(FIXTURE)) fs.rmSync(FIXTURE, { force: true });
  if (fs.existsSync(FIXTURE_DIR) && fs.readdirSync(FIXTURE_DIR).length === 0) fs.rmSync(FIXTURE_DIR, { recursive: true, force: true });
  for (const [file, data] of backups) fs.writeFileSync(file, data);
}

try {
  fs.mkdirSync(FIXTURE_DIR, { recursive: true });
  fs.writeFileSync(FIXTURE, JSON.stringify({
    asset_id: 'BATTLEFIELD_001',
    generator: 'external-intake-test',
    asset: { version: '2.0', generator: 'Titan Gates intake smoke' },
    scenes: [{ nodes: [] }],
    nodes: []
  }, null, 2) + '\n');

  execFileSync('node', ['scripts/detect-github-assets.mjs'], { cwd: ROOT, stdio: 'pipe' });
  execFileSync('node', ['scripts/validate-github-assets.mjs'], { cwd: ROOT, stdio: 'pipe' });

  const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
  const report = JSON.parse(fs.readFileSync(DETECTION_REPORT, 'utf8'));
  const entry = registry.entries.find(asset => asset.asset_id === 'BATTLEFIELD_001');
  const relFixture = 'assets/3d/battlefields/source/BATTLEFIELD_001/v001/BATTLEFIELD_001.external-intake-test.gltf';

  const checks = {
    fixtureDetected: report.discovered.some(file => file.path === relFixture && file.asset_id === 'BATTLEFIELD_001'),
    registryUpdated: entry?.status === 'SOURCE_DISCOVERED' && entry?.validation_status === 'NEEDS_VALIDATION',
    modelLinked: entry?.model_reference === relFixture,
    sourcePreserved: fs.existsSync(FIXTURE),
    canonReviewClean: report.needsCanonReviewCount === 0
  };

  if (Object.values(checks).some(value => value !== true)) {
    throw new Error(`External asset intake smoke failed: ${JSON.stringify(checks)}`);
  }

  console.log(JSON.stringify({
    ok: true,
    test: 'github_external_asset_intake',
    asset_id: 'BATTLEFIELD_001',
    behavior: 'External source file was detected, linked to existing permanent ID, validated without source rewrite, and fixture will be removed before commit.',
    checks
  }, null, 2));
} finally {
  restore();
}
