import fs from 'node:fs';
import { validateContract } from '../src/data-loaders/schema-contracts.mjs';
import { loadOneTitanVsManyCombat, validateOneTitanVsManyCombat, summarizeOneTitanVsMany } from '../src/combat/one-deity-vs-many.mjs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const contract = loadOneTitanVsManyCombat();
const schema = read('schemas/one-deity-vs-many-combat.schema.json');
const missions = read('data/mission-registry.json');
const mission = missions.find(row => row.id === contract.firstPrototype.sourceMissionId);
const mobileArchitecture = read('engine/unreal/mobile-first-architecture.json');
const firstTemplate = read('engine/unreal/first-mission-zone-template.json');
const issues = [
  ...validateContract(contract, schema, contract.id).issues,
  ...validateOneTitanVsManyCombat(contract, mission, mobileArchitecture, firstTemplate).issues
];
const result = { ok: issues.length === 0, oneTitanVsManyCombat: issues.length === 0 ? 'PASS' : 'FAIL', summary: summarizeOneTitanVsMany(contract, firstTemplate), issues };
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
