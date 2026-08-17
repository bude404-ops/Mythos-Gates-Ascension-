import fs from 'node:fs';
import path from 'node:path';
import { listJsonRecords } from '../src/data-loaders/content-loader.mjs';
import { validateContract } from '../src/data-loaders/schema-contracts.mjs';

const contracts = [
  { name: 'titan', schemaPath: 'schemas/titan.schema.json', records: JSON.parse(fs.readFileSync('data/titans.json', 'utf8')) },
  { name: 'faction', schemaPath: 'schemas/faction.schema.json', records: JSON.parse(fs.readFileSync('data/factions.json', 'utf8')) },
  { name: 'map', schemaPath: 'schemas/map.schema.json', records: JSON.parse(fs.readFileSync('data/maps.json', 'utf8')) },
  { name: 'mission-dialogue', schemaPath: 'schemas/mission-dialogue.schema.json', records: JSON.parse(fs.readFileSync('data/mission-dialogue.json', 'utf8')) },
  { name: 'economy', schemaPath: 'schemas/economy.schema.json', records: [JSON.parse(fs.readFileSync('data/free-to-play-economy.json', 'utf8'))] },
  { name: 'telemetry-contract', schemaPath: 'schemas/telemetry-contract.schema.json', records: [JSON.parse(fs.readFileSync('data/battlefield-telemetry-contract.json', 'utf8'))] },
  { name: 'external-ai-packet', schemaPath: 'schemas/external-ai-packet.schema.json', records: listJsonRecords(path.join('handoff', 'external_ai')).filter(file => file.endsWith('.external-ai-packet.json')).map(file => JSON.parse(fs.readFileSync(file, 'utf8'))) },
  { name: 'mission', schemaPath: 'schemas/mission.schema.json', records: [...listJsonRecords('missions/normal'), ...listJsonRecords('missions/elite')].map(file => JSON.parse(fs.readFileSync(file, 'utf8'))) },
  {
    name: 'asset-manifest',
    schemaPath: 'schemas/asset-manifest.schema.json',
    records: listJsonRecords(path.join('manifests', 'assets'))
      .filter(file => path.basename(file) === 'manifest.json')
      .map(file => JSON.parse(fs.readFileSync(file, 'utf8')))
  },
  {
    name: 'canon-version-manifest',
    schemaPath: 'schemas/canon-version-manifest.schema.json',
    records: [JSON.parse(fs.readFileSync('data/canon-version-manifest.json', 'utf8'))]
  },
  {
    name: 'platform-core',
    schemaPath: 'schemas/platform-core.schema.json',
    records: [JSON.parse(fs.readFileSync('data/platform-core-contract.json', 'utf8'))]
  },
  {
    name: 'hosted-backend-boundary',
    schemaPath: 'schemas/hosted-backend-boundary.schema.json',
    records: [JSON.parse(fs.readFileSync('data/hosted-backend-boundary.json', 'utf8'))]
  },
  {
    name: 'runtime-persistence',
    schemaPath: 'schemas/runtime-persistence.schema.json',
    records: [JSON.parse(fs.readFileSync('data/runtime-persistence-boundary.json', 'utf8'))]
  },
  {
    name: 'ue5-dungeon-framework',
    schemaPath: 'schemas/ue5-dungeon-framework.schema.json',
    records: [JSON.parse(fs.readFileSync('engine/unreal/dungeon-crawler-framework.json', 'utf8'))]
  },
  {
    name: 'ue5-first-mission-zone-template',
    schemaPath: 'schemas/ue5-first-mission-zone-template.schema.json',
    records: [JSON.parse(fs.readFileSync('engine/unreal/first-mission-zone-template.json', 'utf8'))]
  },
  {
    name: 'ue5-mobile-first-architecture',
    schemaPath: 'schemas/ue5-mobile-first-architecture.schema.json',
    records: [JSON.parse(fs.readFileSync('engine/unreal/mobile-first-architecture.json', 'utf8'))]
  },
  {
    name: 'one-deity-vs-many-combat',
    schemaPath: 'schemas/one-deity-vs-many-combat.schema.json',
    records: [JSON.parse(fs.readFileSync('data/one-deity-vs-many-combat.json', 'utf8'))]
  },
  {
    name: 'cross-faction-encounter-pool',
    schemaPath: 'schemas/cross-faction-encounter-pool.schema.json',
    records: JSON.parse(fs.readFileSync('data/cross-faction-encounter-pools.json', 'utf8'))
  }
];

const issues = [];
for (const contract of contracts) {
  const schema = JSON.parse(fs.readFileSync(contract.schemaPath, 'utf8'));
  contract.records.forEach((record, index) => {
    const result = validateContract(record, schema, `${contract.name}:${record.id || record.asset_id || index}`);
    issues.push(...result.issues);
  });
}

const result = {
  ok: issues.length === 0,
  schemaContracts: issues.length === 0 ? 'PASS' : 'FAIL',
  checked: Object.fromEntries(contracts.map(contract => [contract.name, contract.records.length])),
  issues: issues.slice(0, 50)
};
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
