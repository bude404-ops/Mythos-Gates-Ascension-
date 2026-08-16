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
  'schemas/mission.schema.json',
  'schemas/asset-manifest.schema.json',
  'src/README.md',
  'src/gameplay/index.mjs',
  'src/gameplay/solo-battle/index.mjs',
  'src/gameplay/economy/index.mjs',
  'src/data-loaders/index.mjs',
  'src/data-loaders/content-loader.mjs',
  'src/data-loaders/schema-contracts.mjs',
  'src/ui/index.mjs',
  'src/ui/state-presenters.mjs',
  'src/tools/production-gate-manifest.mjs',
  'tests/README.md',
  'tests/production-module-contract.test.mjs',
  'scripts/validate-schema-contracts.mjs'
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
for (const token of ['schemas/', 'src/', 'tests/', 'AAA repository audit', 'one active Titan']) {
  if (!readme.includes(token)) issues.push(`README missing production structure token: ${token}`);
}

const schemas = ['schemas/titan.schema.json', 'schemas/mission.schema.json', 'schemas/asset-manifest.schema.json'];
for (const schema of schemas) {
  const parsed = JSON.parse(fs.readFileSync(schema, 'utf8'));
  if (!parsed.$schema || !parsed.title || parsed.type !== 'object') issues.push(`Invalid schema scaffold: ${schema}`);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const script of ['validate:schemas', 'test:production-modules']) {
  if (!packageJson.scripts?.[script]) issues.push(`Missing production script: ${script}`);
}
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run validate:schemas')) issues.push('precommit:verify must enforce schema contract validation.');
if (!packageJson.scripts?.['precommit:verify']?.includes('npm run test:production-modules')) issues.push('precommit:verify must enforce production module contracts.');

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
