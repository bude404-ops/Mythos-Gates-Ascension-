import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, data) => fs.writeFileSync(path.join(root, file), JSON.stringify(data, null, 2) + '\n');
const generated = new Date().toISOString().slice(0,10);
const files = {
  'project.json': 'project',
  'factions.json': 'factions',
  'titans.json': 'titans',
  'characters.json': 'characters',
  'units.json': 'units',
  'art-prompts.json': 'artPrompts',
  'artworks.json': 'artworks',
  'development-tasks.json': 'developmentTasks',
  'lore-index.json': 'loreEntries',
  'npcs.json': 'npcs',
  'creatures.json': 'creatures',
  'maps.json': 'maps',
  'campaigns.json': 'campaigns',
  'chapters.json': 'chapters',
  'visual-screens.json': 'visualScreens',
  'visual-change-rules.json': 'visualChangeRules',
  'visual-baselines.json': 'visualBaselines',
  'realm-codex.json': 'realmCodex',
  'hybrid-visual-architecture.json': 'hybridVisualArchitecture',
  'asset-pipeline.json': 'assetPipeline',
  'github-sync-policy.json': 'githubSyncPolicy',
  'github-sync-status.json': 'githubSyncStatus',
  'change-history.json': 'changeHistory'
};
const counts = {};
for (const [file, key] of Object.entries(files)) {
  const value = read(`data/${file}`);
  counts[key] = Array.isArray(value) ? value.length : 1;
}
const index = { generated, counts, files: Object.fromEntries(Object.keys(files).map(f => [f, `data/${f}`])) };
write('data/index.json', index);
console.log(JSON.stringify(index, null, 2));
