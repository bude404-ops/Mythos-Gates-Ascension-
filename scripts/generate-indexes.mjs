import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, data) => fs.writeFileSync(path.join(root, file), JSON.stringify(data, null, 2) + '\n');
const hashFile = file => createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const generated = new Date().toISOString().slice(0,10);
const files = {
  'project.json': 'project',
  'factions.json': 'factions',
  'hollow-faction.json': 'hollowThreatFaction',
  'titans.json': 'titans',
  'characters.json': 'characters',
  'units.json': 'units',
  'art-prompts.json': 'artPrompts',
  'artworks.json': 'artworks',
  'art-import-pipeline.json': 'artImportPipeline',
  'art-approval-manifest.json': 'artApprovalManifest',
  'development-tasks.json': 'developmentTasks',
  'lore-index.json': 'loreEntries',
  'npcs.json': 'npcs',
  'creatures.json': 'creatures',
  'hollow-encounter-system.json': 'hollowEncounterSystem',
  'character-backstories.json': 'characterBackstories',
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
  'storyline-arc-registry.json': 'storylineArcs',
  'campaign-consequence-registry.json': 'campaignConsequences',
  'endgame-architecture.json': 'endgameArchitecture',
  'squad-system.json': 'squadSystem',
  'progression-system.json': 'progressionSystem',
  'ascension-system.json': 'ascensionSystem',
  'async-arena-system.json': 'asyncArenaSystem',
  'weekly-trials.json': 'weeklyTrials',
  'raid-system.json': 'raidSystem',
  'titan-trial-system.json': 'titanTrialSystem',
  'faction-mastery.json': 'factionMastery',
  'season-system.json': 'seasonSystem',
  'achievement-system.json': 'achievementSystem',
  'balance-analytics.json': 'balanceAnalytics',
  'continuity-balance-audit.json': 'continuityBalanceAudit',
  'endgame-dashboard.json': 'endgameDashboard',
  'monetization-policy.json': 'monetizationPolicy',
  'solo-titan-migration-report.json': 'soloTitanMigrationReport',
  'solo-combat-design-document.json': 'soloCombatDesignDocument',
  'solo-titan-roster-redesign.json': 'soloTitanRosterRedesign',
  'enemy-scaling-design-document.json': 'enemyScalingDesignDocument',
  'enemy-archetype-registry.json': 'enemyArchetypeRegistry',
  'raid-design-document.json': 'raidDesignDocument',
  'canon-faction-matrix.json': 'canonFactionMatrix',
  'titan-role-matrix.json': 'titanRoleMatrix',
  'roster-depth-map.json': 'rosterDepthMap',
  'mission-tactical-profile-system.json': 'missionTacticalProfileSystem',
  'player-onboarding-roster-journey.json': 'playerOnboardingRosterJourney',
  'battlefield-director.json': 'battlefieldDirector',
  'world-scale-reference.json': 'worldScaleReference',
  'art-director-scale-sheets.json': 'artDirectorScaleSheets',
  'battlefield-vertical-slice.json': 'battlefieldVerticalSlice',
  'battlefield-runtime-architecture.json': 'battlefieldRuntimeArchitecture',
  'battlefield-quality-gate.json': 'battlefieldQualityGate',
  'faction-mission-dialogue-completion-audit.json': 'factionMissionDialogueCompletionAudit',
  'tactical-blueprint-layouts.json': 'tacticalBlueprintLayouts',
  'tactical-blueprint-placements.json': 'tacticalBlueprintPlacements',
  'titan-enemy-balance-pass.json': 'titanEnemyBalancePass',
  'solo-battle-state-schema.json': 'soloBattleStateSchema',
  'solo-vertical-slice.json': 'soloVerticalSlice',
  'battlefield-telemetry-contract.json': 'battlefieldTelemetryContract',
  'campaign-playflow-contract.json': 'campaignPlayflowContract',
  'command-hub-contract.json': 'commandHubContract',
  'asset-registry.json': 'assetRegistry',
  '3d-blueprint-system.json': 'blueprint3dSystem',
  '3d-production-queue.json': 'blueprint3dProductionQueue'
};
const counts = {};
for (const [file, key] of Object.entries(files)) {
  const value = read(`data/${file}`);
  counts[key] = Array.isArray(value) ? value.length : 1;
}
const sourceFiles = Object.fromEntries(Object.keys(files).map(f => [f, `data/${f}`]));
const sourceFileFingerprints = Object.fromEntries(Object.keys(files).map(f => {
  const file = `data/${f}`;
  const stat = fs.statSync(path.join(root, file));
  return [f, { path: file, bytes: stat.size, sha256: hashFile(file) }];
}));
const hollowEncounterSystem = read('data/hollow-encounter-system.json');
const blueprint3dSystem = read('data/3d-blueprint-system.json');
const blueprint3dRegistry = read('3D_Blueprints/Registry/blueprint-registry.json');
const blueprint3dProductionQueue = read('data/3d-production-queue.json');
const artApprovalManifest = read('data/art-approval-manifest.json');
counts.hollowCreatures = (hollowEncounterSystem.roster || []).length;
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
counts.blueprint3dAssets = blueprint3dRegistry.assets.length;
counts.blueprint3dTitans = blueprint3dRegistry.assets.filter(asset => asset.assetType === 'TITAN').length;
counts.blueprint3dBattlefields = blueprint3dRegistry.assets.filter(asset => asset.assetType === 'BATTLEFIELD').length;
counts.blueprint3dGates = blueprint3dRegistry.assets.filter(asset => asset.assetType === 'GATE').length;
counts.blueprint3dProductionQueue = blueprint3dProductionQueue.queue.length;
counts.blueprint3dFirstHandoffBatch = blueprint3dProductionQueue.firstHandoffBatch.length;
counts.artApprovalBatches = artApprovalManifest.approvalBatches.length;
counts.artApprovedPromptPackages = artApprovalManifest.approvalBatches.reduce((sum, batch) => sum + (batch.promptIds || []).length, 0);
const index = { generated, counts, files: sourceFiles, sourceFileFingerprints, artPromptCategories, artMapPrompts, artApprovalManifest: { status: artApprovalManifest.status, approvalStatus: artApprovalManifest.approvalStatus, gatesClosed: artApprovalManifest.gatesClosed, stillBlocked: artApprovalManifest.stillBlocked, approvedPromptPackages: counts.artApprovedPromptPackages }, blueprint3dSystem: { status: blueprint3dSystem.status, director: blueprint3dSystem.director, registryTotal: blueprint3dRegistry.assets.length, registry: blueprint3dSystem.registry, productionQueue: 'data/3d-production-queue.json', firstHandoffBatch: blueprint3dProductionQueue.firstHandoffBatch.map(item => item.assetId) } };
write('data/index.json', index);
console.log(JSON.stringify(index, null, 2));


