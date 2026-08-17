import fs from 'node:fs';
import path from 'node:path';

const requiredFiles = [
  'README.md',
  'CONTRIBUTING.md',
  '.github/CODEOWNERS',
  '.github/pull_request_template.md',
  '.github/workflows/pages.yml',
  '.github/ISSUE_TEMPLATE/canon-content.yml',
  '.github/ISSUE_TEMPLATE/asset-pipeline.yml',
  '.github/ISSUE_TEMPLATE/runtime-bug.yml',
  'docs/AAA_REPOSITORY_AUDIT.md',
  'docs/production/RELEASE_CHECKLIST.md',
  'docs/tech/REPOSITORY_ARCHITECTURE.md',
  'docs/art/ASSET_IMPORT_STANDARDS.md',
  'schemas/README.md',
  'schemas/titan.schema.json',
  'schemas/faction.schema.json',
  'schemas/map.schema.json',
  'schemas/mission.schema.json',
  'schemas/mission-dialogue.schema.json',
  'schemas/asset-manifest.schema.json',
  'schemas/economy.schema.json',
  'schemas/telemetry-contract.schema.json',
  'schemas/external-ai-packet.schema.json',
  'schemas/canon-version-manifest.schema.json',
  'data/canon-version-manifest.json',
  'docs/production/DATA_MIGRATION_VERSIONING.md',
  'scripts/validate-data-migrations.mjs',
  'tests/data-migration-contract.test.mjs',
  'data/platform-core-contract.json',
  'schemas/platform-core.schema.json',
  'scripts/validate-platform-core.mjs',
  'data/hosted-backend-boundary.json',
  'schemas/hosted-backend-boundary.schema.json',
  'scripts/validate-backend-boundary.mjs',
  'data/runtime-persistence-boundary.json',
  'data/one-deity-vs-many-combat.json',
  'data/cross-faction-encounter-pools.json',
  'schemas/runtime-persistence.schema.json',
  'scripts/validate-runtime-persistence.mjs',
  'scripts/validate-ue5-dungeon-framework.mjs',
  'scripts/validate-ue5-mobile-first.mjs',
  'scripts/validate-one-deity-vs-many-combat.mjs',
  'scripts/validate-mission-campaign-lore-run-ins.mjs',
  'scripts/run-stable-command-hub.mjs',
  'tests/platform-core-contract.test.mjs',
  'tests/backend-boundary-contract.test.mjs',
  'tests/runtime-persistence-contract.test.mjs',
  'tests/ue5-dungeon-framework-contract.test.mjs',
  'tests/ue5-mobile-first-contract.test.mjs',
  'tests/one-deity-vs-many-combat-contract.test.mjs',
  'tests/mission-campaign-lore-run-ins-contract.test.mjs',
  'src/README.md',
  'src/gameplay/index.mjs',
  'src/gameplay/solo-battle/index.mjs',
  'src/gameplay/economy/index.mjs',
  'src/platform/index.mjs',
  'src/platform/platform-core.mjs',
  'src/platform/backend-boundary.mjs',
  'src/platform/runtime-persistence.mjs',
  'src/combat/one-deity-vs-many.mjs',
  'src/lore/cross-faction-run-ins.mjs',
  'src/platform/runtime-persistence.sql',
  'src/data-loaders/index.mjs',
  'src/data-loaders/content-loader.mjs',
  'src/data-loaders/schema-contracts.mjs',
  'src/ui/index.mjs',
  'src/ui/state-presenters.mjs',
  'src/tools/production-gate-manifest.mjs',
  'tests/README.md',
  'tests/production-module-contract.test.mjs',
  'scripts/validate-schema-contracts.mjs',
  'engine/README.md',
  'engine/shared/engine-export-contract.json',
  'engine/shared/engine-exporter.mjs',
  'engine/unreal/README.md',
  'engine/unreal/adapter-manifest.json',
  'engine/unreal/dungeon-crawler-framework.json',
  'engine/unreal/first-mission-zone-template.json',
  'engine/unreal/ue5-dungeon-framework.mjs',
  'engine/unreal/mobile-first-architecture.json',
  'engine/unreal/mobile-first-architecture.mjs',
  'engine/unity/README.md',
  'engine/unity/adapter-manifest.json',
  'scripts/validate-engine-adapters.mjs',
  'tests/engine-adapter-contract.test.mjs'
];

const requiredDirs = [
  '3D_Blueprints',
  'art',
  'asset_registry',
  'assets',
  'backstories',
  'campaigns',
  'creatures',
  'data',
  'dialogue',
  'docs',
  'game',
  'handoff',
  'manifests',
  'maps',
  'mini-app',
  'missions',
  'npcs',
  'schemas',
  'scripts',
  'src',
  'tests',
  'engine',
  'titans',
  'validation',
  'visual'
];

const forbiddenRootFiles = [
  'titan-gates-dev-platform.html',
  'galaxy-reapers-ascension.html'
];

const issues = [];
for (const dir of requiredDirs) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) issues.push(`Missing required production directory: ${dir}`);
}
for (const file of requiredFiles) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) issues.push(`Missing required production file: ${file}`);
}
for (const file of forbiddenRootFiles) {
  if (fs.existsSync(file)) issues.push(`Forbidden legacy root file remains: ${file}`);
}
if (fs.existsSync('dist')) {
  const trackedDistMarker = fs.existsSync(path.join('dist', '.gitkeep'));
  if (trackedDistMarker) issues.push('dist contains a tracked marker; generated output must stay non-canonical.');
}

const pages = fs.readFileSync('.github/workflows/pages.yml', 'utf8');
if (!pages.includes('npm run precommit:verify')) issues.push('Pages workflow must run the full precommit gate.');
if (pages.includes('npm run build') && !pages.includes('npm run precommit:verify')) issues.push('Pages workflow is using build without full gate.');

const readme = fs.readFileSync('README.md', 'utf8');
for (const token of ['schemas/', 'src/', 'tests/', 'AAA repository audit', 'one active deity']) {
  if (!readme.includes(token)) issues.push(`README missing production structure token: ${token}`);
}

const schemas = [
  'schemas/titan.schema.json',
  'schemas/faction.schema.json',
  'schemas/map.schema.json',
  'schemas/mission.schema.json',
  'schemas/mission-dialogue.schema.json',
  'schemas/asset-manifest.schema.json',
  'schemas/economy.schema.json',
  'schemas/telemetry-contract.schema.json',
  'schemas/external-ai-packet.schema.json',
  'schemas/canon-version-manifest.schema.json',
  'schemas/platform-core.schema.json',
  'schemas/hosted-backend-boundary.schema.json',
  'schemas/runtime-persistence.schema.json',
  'schemas/ue5-dungeon-framework.schema.json',
  'schemas/ue5-first-mission-zone-template.schema.json',
  'schemas/ue5-mobile-first-architecture.schema.json',
  'schemas/one-deity-vs-many-combat.schema.json',
  'schemas/cross-faction-encounter-pool.schema.json'
];
for (const schema of schemas) {
  const parsed = JSON.parse(fs.readFileSync(schema, 'utf8'));
  if (!parsed.$schema || !parsed.title || parsed.type !== 'object') issues.push(`Invalid schema scaffold: ${schema}`);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const script of ['validate:schemas', 'test:production-modules', 'validate:engine-adapters', 'test:engine-adapters', 'validate:migrations', 'test:migration-contracts', 'validate:platform-core', 'test:platform-core', 'validate:backend-boundary', 'test:backend-boundary', 'validate:runtime-persistence', 'test:runtime-persistence', 'validate:ue5-dungeon-framework', 'test:ue5-dungeon-framework', 'validate:ue5-mobile-first', 'test:ue5-mobile-first', 'validate:one-deity-vs-many-combat', 'test:one-deity-vs-many-combat', 'validate:mission-campaign-lore-run-ins', 'test:mission-campaign-lore-run-ins']) {
  if (!packageJson.scripts?.[script]) issues.push(`Missing production script: ${script}`);
}
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:schemas')) issues.push('precommit:verify must enforce schema contract validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:production-modules')) issues.push('precommit:verify must enforce production module contracts.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:engine-adapters')) issues.push('precommit:verify must enforce engine adapter validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:engine-adapters')) issues.push('precommit:verify must enforce engine adapter contracts.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:migrations')) issues.push('precommit:verify must enforce migration validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:migration-contracts')) issues.push('precommit:verify must enforce migration contract tests.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:platform-core')) issues.push('precommit:verify must enforce platform core validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:platform-core')) issues.push('precommit:verify must enforce platform core contracts.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:backend-boundary')) issues.push('precommit:verify must enforce hosted backend boundary validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:backend-boundary')) issues.push('precommit:verify must enforce hosted backend boundary contracts.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:runtime-persistence')) issues.push('precommit:verify must enforce runtime persistence validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:runtime-persistence')) issues.push('precommit:verify must enforce runtime persistence contracts.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:ue5-dungeon-framework')) issues.push('precommit:verify must enforce UE5 dungeon framework validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:ue5-dungeon-framework')) issues.push('precommit:verify must enforce UE5 dungeon framework contracts.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:ue5-mobile-first')) issues.push('precommit:verify must enforce UE5 mobile-first validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:ue5-mobile-first')) issues.push('precommit:verify must enforce UE5 mobile-first contracts.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:one-deity-vs-many-combat')) issues.push('precommit:verify must enforce one-Deity-vs-many combat validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:one-deity-vs-many-combat')) issues.push('precommit:verify must enforce one-Deity-vs-many combat contracts.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:mission-campaign-lore-run-ins')) issues.push('precommit:verify must enforce mission/campaign lore run-in validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:mission-campaign-lore-run-ins')) issues.push('precommit:verify must enforce mission/campaign lore run-in contracts.');

const result = {
  ok: issues.length === 0,
  aaaStructureAudit: issues.length === 0 ? 'PASS' : 'FAIL',
  checks: {
    requiredDirs: requiredDirs.length,
    requiredFiles: requiredFiles.length,
    schemas: schemas.length,
    pagesRunsFullGate: pages.includes('npm run precommit:verify'),
    generatedDistTracked: false
  },
  issues
};

console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
