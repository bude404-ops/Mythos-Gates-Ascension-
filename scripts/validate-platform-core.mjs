import fs from 'node:fs';
import { validateContract } from '../src/data-loaders/schema-contracts.mjs';
import { createPlatformProfile, completeMission, debitCurrency, exportSave, importSave, platformSummary, REQUIRED_EVENT_TYPES, validatePlatformState } from '../src/platform/index.mjs';

const contract = JSON.parse(fs.readFileSync('data/platform-core-contract.json', 'utf8'));
const schema = JSON.parse(fs.readFileSync('schemas/platform-core.schema.json', 'utf8'));
const issues = [];
issues.push(...validateContract(contract, schema, contract.id).issues);
for (const eventType of REQUIRED_EVENT_TYPES) {
  if (!contract.requiredPlatformEvents.includes(eventType)) issues.push(`Contract missing required platform event ${eventType}`);
}
let state = createPlatformProfile(contract.defaultPlayer);
state = completeMission(state, 'MG-F01-C01-M01', { accountXp: 85, currencies: { sunshards: 30, signatureAlloy: 1 } });
state = debitCurrency(state, 'sunshards', 25, 'CRAFTING_TEST');
const imported = importSave(exportSave(state));
const validation = validatePlatformState(imported);
issues.push(...validation.issues);
const summary = platformSummary(imported);
if (summary.completedMissions !== 1) issues.push('Mission completion did not persist.');
if (summary.currencies.sunshards !== 125) issues.push(`Unexpected sunshards balance ${summary.currencies.sunshards}`);
if (summary.currencies.signatureAlloy !== 1) issues.push('Signature alloy reward did not persist.');
if (summary.ledgerEntries < 5) issues.push('Ledger did not capture starter, reward, and debit entries.');
const result = { ok: issues.length === 0, platformCore: issues.length === 0 ? 'PASS' : 'FAIL', summary, requiredEvents: REQUIRED_EVENT_TYPES.length, issues };
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
