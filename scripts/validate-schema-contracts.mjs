import fs from 'node:fs';
import path from 'node:path';
import { listJsonRecords } from '../src/data-loaders/content-loader.mjs';
import { validateContract } from '../src/data-loaders/schema-contracts.mjs';

const contracts = [
  { name: 'titan', schemaPath: 'schemas/titan.schema.json', records: JSON.parse(fs.readFileSync('data/titans.json', 'utf8')) },
  { name: 'mission', schemaPath: 'schemas/mission.schema.json', records: [...listJsonRecords('missions/normal'), ...listJsonRecords('missions/elite')].map(file => JSON.parse(fs.readFileSync(file, 'utf8'))) },
  {
    name: 'asset-manifest',
    schemaPath: 'schemas/asset-manifest.schema.json',
    records: listJsonRecords(path.join('manifests', 'assets'))
      .filter(file => path.basename(file) === 'manifest.json')
      .map(file => JSON.parse(fs.readFileSync(file, 'utf8')))
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
