import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const forbidden = [
  'Ilyr', 'Pelagos', 'Aten-Kor', 'Atenra armor', 'Atenra ',
  'Null-Crowned', 'Prime Ancients', 'Prime Gate underworld', 'Prime Gate Underworld',
  'Abyssal', 'Abyssal Courts', 'Abyssal Anchor-Beast', 'Abyssal raiders', 'Abyss-Hymn',
  'Pearl Crown', 'Pearl-Crown', 'Grave-Sun', 'Grave oath', 'salt oath',
  'Salt Seal', 'Salt Crown', 'Grave Mark', 'Eight-Faction Storyline Spine',
  '8 FACTIONS', 'eight playable factions', '8 playable factions'
];
const exts = new Set(['.json', '.html', '.js', '.mjs', '.md', '.txt']);
const skipDirs = new Set(['.git', 'node_modules']);
const skipFiles = new Set(['scripts/audit-current-canon.mjs', 'dist/scripts/audit-current-canon.mjs']);
const findings = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(repo, full);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (skipFiles.has(rel)) continue;
    if (!entry.isFile() || !exts.has(path.extname(entry.name))) continue;
    const text = fs.readFileSync(full, 'utf8');
    for (const term of forbidden) {
      const count = text.split(term).length - 1;
      if (count > 0) findings.push({ file: rel, term, count });
    }
  }
}

walk(repo);

const mini = fs.readFileSync(path.join(repo, 'dist/mini-app/titan-gates-ascension.html'), 'utf8');
const checks = [
  ['live lore sweep app', mini.includes('Lore Continuity Sweep')],
  ['current one-active-deity heading', mini.includes('one-active-deity canon')],
  ['hollow threat layer', mini.includes('The Hollow')],
  ['current realm set', ['Aten Ra','Asgardian','Olympian','Kami','Tuatha','Empyrean','Infernal Dominion'].every(x => mini.includes(x))],
  ['no active deity gameplay copy', !/Titan Selection|SEAL THE GATE LINE|Choose one field Titan and five battle patterns|Recommended line/.test(mini)],
  ['no embedded battle pattern roster payload', !/"entityKind":"FORMATION"|"ownedUnits":\[".*unit-|"type":"battle pattern"/.test(mini)]
];

for (const [name, ok] of checks) {
  if (!ok) findings.push({ file: 'dist/mini-app/titan-gates-ascension.html', term: `failed check: ${name}`, count: 1 });
}

if (findings.length) {
  console.error(JSON.stringify({ ok: false, findings }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, scannedForbiddenTerms: forbidden.length, canonChecks: checks.map(([name]) => name) }, null, 2));
