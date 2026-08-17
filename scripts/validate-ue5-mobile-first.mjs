import fs from 'node:fs';
import { validateContract } from '../src/data-loaders/schema-contracts.mjs';
import { loadUe5DungeonFramework, loadFirstMissionZoneTemplate } from '../engine/unreal/ue5-dungeon-framework.mjs';
import { loadMobileFirstArchitecture, validateMobileFirstArchitecture, mobileFirstSummary } from '../engine/unreal/mobile-first-architecture.mjs';

const contract = loadMobileFirstArchitecture();
const framework = loadUe5DungeonFramework();
const firstTemplate = loadFirstMissionZoneTemplate();
const schema = JSON.parse(fs.readFileSync('schemas/ue5-mobile-first-architecture.schema.json', 'utf8'));
const issues = [
  ...validateContract(contract, schema, contract.id).issues,
  ...validateMobileFirstArchitecture(contract, framework, firstTemplate).issues
];
const result = { ok: issues.length === 0, ue5MobileFirst: issues.length === 0 ? 'PASS' : 'FAIL', summary: mobileFirstSummary(contract, firstTemplate), issues };
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
