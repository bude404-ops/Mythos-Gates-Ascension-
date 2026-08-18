import fs from 'node:fs';
import { buildEngineExportSummary } from '../engine/shared/engine-exporter.mjs';

const requiredFiles = [
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
  'engine/unity/adapter-manifest.json'
];

const issues = [];
for (const file of requiredFiles) if (!fs.existsSync(file)) issues.push(`Missing engine adapter file: ${file}`);

const contract = JSON.parse(fs.readFileSync('engine/shared/engine-export-contract.json', 'utf8'));
if (contract.schema !== 'TG_ENGINE_EXPORT_CONTRACT_V1') issues.push('Invalid engine export contract schema marker.');
if (!contract.guardrails?.includes('one active deity standard combat remains canonical')) issues.push('Engine contract must preserve one active deity canon.');
for (const engine of ['unreal', 'unity']) {
  const manifest = JSON.parse(fs.readFileSync(`engine/${engine}/adapter-manifest.json`, 'utf8'));
  if (manifest.schema !== 'TG_ENGINE_ADAPTER_MANIFEST_V1') issues.push(`${engine} adapter manifest has invalid schema marker.`);
  if (!manifest.canonicalInput?.includes('engine/shared/engine-export-contract.json')) issues.push(`${engine} adapter must consume the shared engine contract.`);
}
const summary = buildEngineExportSummary({ includeMissions: true });
if (summary.counts.titans !== 63) issues.push(`Engine export expected 28 Deities, found ${summary.counts.titans}.`);
if (summary.counts.missions !== 280) issues.push(`Engine export expected 280 missions, found ${summary.counts.missions}.`);
<<<<<<< HEAD
if (summary.canonicalRules.activeDeityCount !== 1) issues.push('Engine export must preserve one-active-deity combat.');
=======
if (summary.canonicalRules.activeTitanCount !== 1) issues.push('Engine export must preserve one-active-deity combat.');
>>>>>>> 919bdc51 (Mythos Gates: Ascension — Full repo migration)

const result = { ok: issues.length === 0, engineAdapters: issues.length === 0 ? 'PASS' : 'FAIL', summary, issues };
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
