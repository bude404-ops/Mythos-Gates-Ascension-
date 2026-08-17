import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const titans = read('data/titans.json');
const audit = read('data/titan-art-identity-audit.json');
const prompts = read('data/art-prompts.json').filter(prompt => prompt.category === 'Titan');
const byTitan = new Map(titans.map(titan => [titan.id, titan]));
const promptByTitan = new Map(prompts.map(prompt => [prompt.entityId, prompt]));

assert.equal(audit.status, 'IMPLEMENTED');
assert.equal(audit.entries.length, titans.length);
assert.equal(prompts.length, titans.length);
assert.equal(audit.summary.totalTitans, titans.length);
assert.equal(audit.summary.pass, titans.length, 'resolution pass should leave every Titan production-ready');
assert.equal(audit.summary.refine, 0, 'no borderline designs should remain after resolution pass');
assert.equal(audit.summary.redesign, 0, 'no failed generic identities should remain after resolution pass');
assert.ok(audit.summary.female >= 21, 'female identity coverage too low');
assert.ok(audit.summary.male >= 35, 'male identity coverage too low');

for (const entry of audit.entries) {
  const titan = byTitan.get(entry.titanId);
  assert.ok(titan, `${entry.titanId}: missing Titan`);
  const prompt = promptByTitan.get(entry.titanId);
  assert.ok(prompt, `${entry.titanId}: missing prompt`);
  assert.equal(titan.sex, entry.sex);
  assert.equal(prompt.sex, entry.sex);
  assert.equal(prompt.artIdentityAuditStatus, entry.status);
  assert.ok(prompt.prompt.includes(`Titan name: ${titan.name}`), `${entry.titanId}: prompt missing explicit name`);
  assert.ok(prompt.prompt.includes(`Sex: ${entry.sex}`), `${entry.titanId}: prompt missing explicit sex`);
  assert.ok(prompt.prompt.includes('Extradimensional realm:'), `${entry.titanId}: prompt missing realm`);
  assert.ok(prompt.prompt.includes('Titan DNA:'), `${entry.titanId}: prompt missing DNA`);
  assert.ok(prompt.prompt.includes('Individual face:'), `${entry.titanId}: prompt missing face`);
  assert.ok(prompt.prompt.includes('Body proportions:'), `${entry.titanId}: prompt missing body proportions`);
  assert.ok(prompt.prompt.includes('Signature weapon:'), `${entry.titanId}: prompt missing signature weapon`);
  assert.ok(prompt.prompt.includes('approved Titan Gates premium stylized tactical RPG aesthetic'), `${entry.titanId}: prompt missing approved style lock`);
  assert.ok(prompt.negativePrompt.includes('same-face reuse'), `${entry.titanId}: negative prompt missing anti-clone guard`);
  assert.ok(prompt.negativePrompt.includes('generic faction armor'), `${entry.titanId}: negative prompt missing generic armor guard`);
  assert.ok(titan.titanArtDna?.signatureWeapon, `${entry.titanId}: missing art DNA weapon`);
}

const highest = byTitan.get(audit.summary.highestPriorityTitanId);
assert.ok(highest, 'highest-priority Titan must reference a real Titan');
assert.equal(audit.summary.highestPriorityTitanId, 'TG-TITAN-010');

console.log(JSON.stringify({
  ok: true,
  titanArtIdentityAuditContract: 'PASS',
  titans: titans.length,
  prompts: prompts.length,
  pass: audit.summary.pass,
  refine: audit.summary.refine,
  redesign: audit.summary.redesign,
  female: audit.summary.female,
  male: audit.summary.male,
  highestPriorityTitanId: audit.summary.highestPriorityTitanId,
  highestPriorityName: highest.name
}, null, 2));
