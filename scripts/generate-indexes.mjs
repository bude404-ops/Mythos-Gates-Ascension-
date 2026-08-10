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
  'art-import-pipeline.json': 'artImportPipeline',
  'development-tasks.json': 'developmentTasks',
  'lore-index.json': 'loreEntries',
  'npcs.json': 'npcs',
  'creatures.json': 'creatures',
  'maps.json': 'maps',
  'campaigns.json': 'campaigns',
  'chapters.json': 'chapters',
  'dialogue-scripts.json': 'dialogueScripts',
  'visual-screens.json': 'visualScreens',
  'visual-change-rules.json': 'visualChangeRules',
  'visual-baselines.json': 'visualBaselines',
  'realm-codex.json': 'realmCodex',
  'hybrid-visual-architecture.json': 'hybridVisualArchitecture',
  'asset-pipeline.json': 'assetPipeline',
  'github-sync-policy.json': 'githubSyncPolicy',
  'github-sync-status.json': 'githubSyncStatus',
  'change-history.json': 'changeHistory',
  'campaign-architecture.json': 'campaignArchitecture',
  'campaign-chapter-registry.json': 'campaignChapters',
  'mission-registry.json': 'missions',
  'mission-dialogue.json': 'missionDialogue',
  'mission-art-packages.json': 'missionArtPackages',
  'objective-system.json': 'objectiveSystem',
  'reward-system.json': 'rewardSystem',
  'campaign-audit.json': 'campaignAudit',
  'endgame-architecture.json': 'endgameArchitecture',
  'squad-system.json': 'squadSystem',
  'progression-system.json': 'progressionSystem',
  'ascension-system.json': 'ascensionSystem',
  'async-arena-system.json': 'asyncArenaSystem',
  'weekly-trials.json': 'weeklyTrials',
  'raid-system.json': 'raidSystem',
  'faction-mastery.json': 'factionMastery',
  'season-system.json': 'seasonSystem',
  'achievement-system.json': 'achievementSystem',
  'balance-analytics.json': 'balanceAnalytics',
  'endgame-dashboard.json': 'endgameDashboard',
  'monetization-policy.json': 'monetizationPolicy'
};
const counts = {};
for (const [file, key] of Object.entries(files)) {
  const value = read(`data/${file}`);
  counts[key] = Array.isArray(value) ? value.length : 1;
}
const sourceFiles = Object.fromEntries(Object.keys(files).map(f => [f, `data/${f}`]));
const artPrompts = read('data/art-prompts.json');
const artPromptCategories = artPrompts.reduce((acc, prompt) => {
  const key = prompt.category || 'Uncategorized';
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});
const artMapPrompts = artPrompts
  .filter(prompt => prompt.category === 'Map')
  .map(prompt => ({
    id: prompt.id,
    entityId: prompt.entityId,
    entity: prompt.entity,
    category: prompt.category,
    status: prompt.status,
    prompt: prompt.prompt,
    negativePrompt: prompt.negativePrompt
  }));
counts.artMapPrompts = artMapPrompts.length;
counts.artCampaignPrompts = artPrompts.filter(prompt => prompt.category === 'Campaign').length;
const index = { generated, counts, files: sourceFiles, artPromptCategories, artMapPrompts };
write('data/index.json', index);
console.log(JSON.stringify(index, null, 2));
