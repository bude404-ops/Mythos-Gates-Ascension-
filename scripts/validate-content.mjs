import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const fail = msg => { throw new Error(msg); };
const exists = file => fs.existsSync(path.join(root, file));
const ids = new Map();
function register(collection, item, file){
  if(!item.id) fail(`${file}: missing id`);
  if(ids.has(item.id)) fail(`Duplicate ID ${item.id} in ${file} and ${ids.get(item.id)}`);
  ids.set(item.id, file);
}

const data = {
  project: read('data/project.json'),
  factions: read('data/factions.json'),
  hollowThreatFaction: read('data/hollow-faction.json'),
  titans: read('data/titans.json'),
  characters: read('data/characters.json'),
  units: read('data/units.json'),
  prompts: read('data/art-prompts.json'),
  artworks: read('data/artworks.json'),
  directors: read('data/directors.json'),
  tasks: read('data/development-tasks.json'),
  lore: read('data/lore-index.json'),
  npcs: read('data/npcs.json'),
  creatures: read('data/creatures.json'),
  hollowEncounterSystem: read('data/hollow-encounter-system.json'),
  backstories: read('data/character-backstories.json'),
  maps: read('data/maps.json'),
  campaigns: read('data/campaigns.json'),
  chapters: read('data/chapters.json'),
  visualScreens: read('data/visual-screens.json'),
  visualChangeRules: read('data/visual-change-rules.json'),
  visualBaselines: read('data/visual-baselines.json'),
  visualQaBaselineApproval: read('visual/reviews/TG-VISUAL-QA-BASELINE-APPROVAL-001.json'),
  realmCodex: read('data/realm-codex.json'),
  factionVisualBible: read('data/faction-visual-bible.json'),
  hybridVisualArchitecture: read('data/hybrid-visual-architecture.json'),
  assetPipeline: read('data/asset-pipeline.json'),
  artApprovalManifest: read('data/art-approval-manifest.json'),
  githubSyncPolicy: read('data/github-sync-policy.json'),
  githubSyncStatus: read('data/github-sync-status.json'),
  changeHistory: read('data/change-history.json'),
  index: read('data/index.json'),
  campaignArchitecture: read('data/campaign-architecture.json'),
  campaignChapters: read('data/campaign-chapter-registry.json'),
  missions: read('data/mission-registry.json'),
  missionDialogue: read('data/mission-dialogue.json'),
  missionArtPackages: read('data/mission-art-packages.json'),
  objectiveSystem: read('data/objective-system.json'),
  rewardSystem: read('data/reward-system.json'),
  campaignAudit: read('data/campaign-audit.json'),
  storylineArcs: read('data/storyline-arc-registry.json'),
  campaignConsequences: read('data/campaign-consequence-registry.json'),
  soloBattleStateSchema: read('data/solo-battle-state-schema.json'),
  soloVerticalSlice: read('data/solo-vertical-slice.json'),
  asyncArenaSystem: read('data/async-arena-system.json'),
  weeklyTrials: read('data/weekly-trials.json'),
  raidSystem: read('data/raid-system.json'),
  titanTrialSystem: read('data/deity-trial-system.json'),
  missionTacticalProfileSystem: read('data/mission-tactical-profile-system.json'),
  enemyArchetypeRegistry: read('data/enemy-archetype-registry.json'),
  creatureBehaviorRuntime: read('data/creature-behavior-runtime-contract.json'),
  endgameDashboard: read('data/endgame-dashboard.json'),
  commandHubContract: read('data/command-hub-contract.json'),
  assetRegistry: read('data/asset-registry.json'),
  githubAssetRepository: read('data/github-asset-repository.json'),
  githubAssetRegistry: read('asset_registry/github-asset-registry.json'),
  githubAssetDependencyGraph: read('asset_registry/asset-dependency-graph.json'),
  blueprint3dSystem: read('data/3d-blueprint-system.json'),
  blueprint3dProductionQueue: read('data/3d-production-queue.json'),
  blueprint3dRegistry: read('3D_Blueprints/Registry/blueprint-registry.json'),
  worldScaleReference: read('data/world-scale-reference.json'),
  artDirectorScaleSheets: read('data/art-director-scale-sheets.json'),
  battlefieldRuntimeArchitecture: read('data/battlefield-runtime-architecture.json'),
  battlefieldVerticalSlice: read('data/battlefield-vertical-slice.json'),
  battlefieldCanonRegistry: read('data/battlefield-canon-registry.json')
};

for (const [name, arr] of Object.entries(data)) {
  if(Array.isArray(arr)) arr.forEach(item => register(name, item, `data/${name}.json`));
}
register('project', data.project, 'data/project.json');
register('soloBattleStateSchema', data.soloBattleStateSchema, 'data/solo-battle-state-schema.json');
register('soloVerticalSlice', data.soloVerticalSlice, 'data/solo-vertical-slice.json');
register('asyncArenaSystem', data.asyncArenaSystem, 'data/async-arena-system.json');
register('weeklyTrials', data.weeklyTrials, 'data/weekly-trials.json');
register('raidSystem', data.raidSystem, 'data/raid-system.json');
register('titanTrialSystem', data.titanTrialSystem, 'data/deity-trial-system.json');
register('missionTacticalProfileSystem', data.missionTacticalProfileSystem, 'data/mission-tactical-profile-system.json');
register('enemyArchetypeRegistry', data.enemyArchetypeRegistry, 'data/enemy-archetype-registry.json');
register('creatureBehaviorRuntime', data.creatureBehaviorRuntime, 'data/creature-behavior-runtime-contract.json');
register('endgameDashboard', data.endgameDashboard, 'data/endgame-dashboard.json');
register('commandHubContract', data.commandHubContract, 'data/command-hub-contract.json');
register('assetRegistry', data.assetRegistry, 'data/asset-registry.json');
register('githubAssetRepository', data.githubAssetRepository, 'data/github-asset-repository.json');
register('githubAssetRegistry', data.githubAssetRegistry, 'asset_registry/github-asset-registry.json');
register('githubAssetDependencyGraph', data.githubAssetDependencyGraph, 'asset_registry/asset-dependency-graph.json');
register('blueprint3dSystem', data.blueprint3dSystem, 'data/3d-blueprint-system.json');
register('blueprint3dProductionQueue', data.blueprint3dProductionQueue, 'data/3d-production-queue.json');
register('blueprint3dRegistry', data.blueprint3dRegistry, '3D_Blueprints/Registry/blueprint-registry.json');
register('worldScaleReference', data.worldScaleReference, 'data/world-scale-reference.json');
register('artDirectorScaleSheets', data.artDirectorScaleSheets, 'data/art-director-scale-sheets.json');
register('battlefieldRuntimeArchitecture', data.battlefieldRuntimeArchitecture, 'data/battlefield-runtime-architecture.json');
register('battlefieldCanonRegistry', data.battlefieldCanonRegistry, 'data/battlefield-canon-registry.json');
register('visualQaBaselineApproval', data.visualQaBaselineApproval, 'visual/reviews/TG-VISUAL-QA-BASELINE-APPROVAL-001.json');
register('artApprovalManifest', data.artApprovalManifest, 'data/art-approval-manifest.json');
register('factionVisualBible', data.factionVisualBible, 'data/faction-visual-bible.json');
register('battlefieldVerticalSlice', data.battlefieldVerticalSlice, 'data/battlefield-vertical-slice.json');

const factionIds = new Set(data.factions.map(f => f.id));
const titanIds = new Set(data.titans.map(t => t.id));
const promptIds = new Set(data.prompts.map(p => p.id));
const artworkIds = new Set(data.artworks.map(a => a.id));
const npcIds = new Set(data.npcs.map(n => n.id));
const creatureIds = new Set(data.creatures.map(c => c.id));
const backstoryIds = new Set(data.backstories.map(b => b.id));
const backstoryEntityIds = new Set(data.backstories.map(b => b.entityId));
const mapIds = new Set(data.maps.map(m => m.id));
const campaignIds = new Set(data.campaigns.map(c => c.id));
const chapterIds = new Set(data.chapters.map(c => c.id));
const visualScreenIds = new Set(data.visualScreens.map(s => s.id));
const realmIds = new Set(data.realmCodex.map(r => r.id));
const assetTypes = new Set(data.assetPipeline.assetTypes.map(a => a.type));
const missionIds = new Set(data.missions.map(m => m.id));
const missionDialogueIds = new Set(data.missionDialogue.map(d => d.id));
const missionArtPackageIds = new Set(data.missionArtPackages.map(a => a.id));
const campaignChapterIds = new Set(data.campaignChapters.map(c => c.id));
const storylineArcIds = new Set(data.storylineArcs.map(s => s.id));
const allowedMissionProblemTags = new Set(['large_enemy_groups','heavily_armored_enemies','fast_enemies','ranged_enemies','enemy_casters','long_survival','boss_duel','terrain_heavy','environmental_hazard','swarm_battle','execution_chain','objective_pressure']);
const allowedDeityRoles = new Set(data.titans.map(t => t.role));
const missionTagCounts = new Map();
const missionRoleCounts = new Map();
const enemyArchetypeKeys = new Set((data.enemyArchetypeRegistry.archetypes || []).map(a => a.key));
const difficultyBudgetTiers = new Set((data.enemyArchetypeRegistry.difficultyBudgets || []).map(b => b.tier));
const requiredScaleSheetTypes = new Set(['normal_enemy','elite_enemy','player_titan','titan_scale_enemy','colossal_boss','titan_gate','architecture','battlefield_object']);

if(data.factions.length !== 7) fail(`Expected 7 playable factions, found ${data.factions.length}`);
if(data.hollowThreatFaction.playable !== false || data.hollowThreatFaction.classification !== 'Hostile Threat Faction') fail('Hollow must remain a non-playable threat faction');
<<<<<<< HEAD
if(data.titans.length !== 28) fail(`Expected 28 playable deities, found ${data.titans.length}`);
const factionGodCounts = new Map();
for (const deity of data.titans) factionGodCounts.set(deity.factionId, (factionGodCounts.get(deity.factionId) || 0) + 1);
for (const faction of data.factions) if ((factionGodCounts.get(faction.id) || 0) !== 4) fail(`${faction.name}: expected 4 playable deities`);
=======
if(data.titans.length !== 63) fail(`Expected 28 Deities, found ${data.titans.length}`);
>>>>>>> 919bdc51 (Mythos Gates: Ascension — Full repo migration)
if(data.artApprovalManifest.status !== 'IMPLEMENTED' || data.artApprovalManifest.approvalStatus !== 'APPROVED_FOR_GENERATION') fail('Art approval manifest must be approved for generation');

if(data.factionVisualBible.status !== 'IMPLEMENTED') fail('Faction visual bible must be IMPLEMENTED');
if(!Array.isArray(data.factionVisualBible.entries) || data.factionVisualBible.entries.length !== data.factions.length) fail('Faction visual bible must cover every playable faction');
const factionVisualBibleByFactionId = new Map(data.factionVisualBible.entries.map(e => [e.factionId, e]));
const requiredVisualBibleLists = ['bodyAnatomyRules','armorShapeLanguage','materialHierarchy','textureLanguage','colorPalette','sacredSymbols','armorConstructionRules','titanRules','npcRules','creatureRules','environmentRules','avoid'];
for (const faction of data.factions) {
  const entry = factionVisualBibleByFactionId.get(faction.id);
  if(!entry) fail(`Faction visual bible missing ${faction.id}`);
  if(entry.faction !== faction.name) fail(`${entry.id}: faction name mismatch`);
  if(!entry.visualThesis || entry.visualThesis.length < 120) fail(`${entry.id}: visual thesis too thin`);
  for (const list of requiredVisualBibleLists) {
    if(!Array.isArray(entry[list]) || entry[list].length < 3) fail(`${entry.id}: ${list} too thin`);
  }
  for (const applies of ['Deities','NPCs','Creatures','Battlefields','Artwork prompts']) if(!(entry.appliesTo || []).includes(applies)) fail(`${entry.id}: missing appliesTo ${applies}`);
}
for (const taskId of ['TG-DEV-001','TG-DEV-007']) {
  if(!(data.artApprovalManifest.gatesClosed || []).includes(taskId)) fail(`Art approval manifest must close ${taskId}`);
  if(!data.tasks.some(t => t.id === taskId && t.status === 'COMPLETED' && (t.relatedFiles || []).includes('data/art-approval-manifest.json'))) fail(`${taskId}: completion must reference art approval manifest`);
}
if(!(data.artApprovalManifest.stillBlocked || []).includes('TG-DEV-004')) fail('Art approval manifest must keep final image import blocked until real generated assets exist');
if(!Array.isArray(data.artApprovalManifest.approvalBatches) || data.artApprovalManifest.approvalBatches.length < 2) fail('Art approval manifest must include Deity and NPC/map approval batches');
const approvedPromptIds = new Set();
for (const batch of data.artApprovalManifest.approvalBatches) {
  if(batch.status !== 'APPROVED_FOR_GENERATION') fail(`${batch.id}: batch must be approved for generation`);
  if(!batch.taskId || !(data.artApprovalManifest.gatesClosed || []).includes(batch.taskId)) fail(`${batch.id}: batch taskId must be a closed approval gate`);
  if(!Array.isArray(batch.promptIds) || batch.promptIds.length !== batch.count) fail(`${batch.id}: prompt count mismatch`);
  for (const promptId of batch.promptIds) {
    if(!promptIds.has(promptId)) fail(`${batch.id}: unknown approved prompt ${promptId}`);
    approvedPromptIds.add(promptId);
  }
  if(!batch.approvalNotes) fail(`${batch.id}: missing approvalNotes`);
}
for (const required of ['TG-PROMPT-001','TG-PROMPT-NPC-001','TG-PROMPT-MAP-001']) if(!approvedPromptIds.has(required)) fail(`Art approval manifest missing required prompt ${required}`);
if(!Array.isArray(data.artApprovalManifest.qualityGates) || data.artApprovalManifest.qualityGates.length < 6) fail('Art approval manifest quality gates too thin');
if(!Array.isArray(data.artApprovalManifest.rejectionTriggers) || data.artApprovalManifest.rejectionTriggers.length < 6) fail('Art approval manifest rejection triggers too thin');
if(data.artworks.length !== 0 && !data.artApprovalManifest.handoff?.nextAction?.includes('real approved image assets')) fail('Art approval manifest cannot bypass real image import gate');
if(data.characters.length < data.npcs.length) fail(`Character registry must mirror campaign NPC canon: ${data.characters.length}/${data.npcs.length}`);
if(!data.directors.some(d => d.id === 'TG-DIR-006' && d.name === '3D Asset Director')) fail('Missing 3D Asset Director');
if(data.blueprint3dSystem.status !== 'IMPLEMENTED') fail('3D Blueprint System must be IMPLEMENTED');
if(data.blueprint3dSystem.assetCounts.registryTotal !== data.blueprint3dRegistry.assets.length) fail('3D Blueprint registry count mismatch');
if(data.blueprint3dRegistry.assets.filter(a => a.assetType === 'DEITY').length !== data.titans.length) fail('3D deity blueprint count must match canon deities');
if(data.blueprint3dRegistry.assets.filter(a => a.assetType === 'CHARACTER').length !== data.characters.length) fail('3D Character blueprint count must match canon Characters');
if(data.blueprint3dRegistry.assets.filter(a => a.assetType === 'CREATURE').length !== data.creatures.length) fail('3D Creature blueprint count must match canon Creatures');
if(data.blueprint3dRegistry.assets.filter(a => a.assetType === 'BATTLEFIELD').length !== data.maps.length) fail('3D Battlefield blueprint count must match canon Maps');
if(data.blueprint3dRegistry.assets.filter(a => a.assetType === 'GATE').length !== data.realmCodex.length) fail('3D Gate blueprint count must match canon Realm Gates');
if(data.blueprint3dProductionQueue.status !== 'IMPLEMENTED' || data.blueprint3dProductionQueue.taskId !== 'TG-DEV-032') fail('3D production queue must complete TG-DEV-032');
if(data.blueprint3dProductionQueue.sourceRegistry !== '3D_Blueprints/Registry/blueprint-registry.json') fail('3D production queue source registry mismatch');
if(data.blueprint3dProductionQueue.coverage?.total !== data.blueprint3dRegistry.assets.length) fail('3D production queue coverage total mismatch');
if((data.blueprint3dProductionQueue.queue || []).length !== data.blueprint3dRegistry.assets.length) fail('3D production queue must cover every registry asset');
const blueprintAssetIds = new Set(data.blueprint3dRegistry.assets.map(a => a.assetId));
const blueprintPathsById = new Map(data.blueprint3dRegistry.assets.map(a => [a.assetId, a.path]));
const queueIds = new Set();
for (const row of data.blueprint3dProductionQueue.queue || []) {
  if(!blueprintAssetIds.has(row.assetId)) fail(`3D production queue references unknown asset ${row.assetId}`);
  if(queueIds.has(row.assetId)) fail(`3D production queue duplicate asset ${row.assetId}`);
  queueIds.add(row.assetId);
  if(row.sourcePackage !== blueprintPathsById.get(row.assetId)) fail(`${row.assetId}: queue sourcePackage must match registry path`);
  for (const field of ['priority','lane','phase','director','handoffInstruction']) if(!row[field]) fail(`${row.assetId}: queue missing ${field}`);
  if(row.director !== '3D Asset Director') fail(`${row.assetId}: queue row must belong to 3D Asset Director`);
  if(!Array.isArray(row.acceptanceCriteria) || row.acceptanceCriteria.length < 1) fail(`${row.assetId}: queue missing acceptanceCriteria`);
  if(row.assetType !== 'GLOBAL_REFERENCE') {
    for (const ref of ['GLOBAL_REF_001','GLOBAL_REF_002','GLOBAL_REF_003']) if(!(row.dependsOn || []).includes(ref)) fail(`${row.assetId}: queue row missing global reference dependency ${ref}`);
  }
}
if((data.blueprint3dProductionQueue.firstHandoffBatch || []).length < 8) fail('3D production queue first handoff batch too small');
for (const row of data.blueprint3dProductionQueue.firstHandoffBatch || []) {
  if(!queueIds.has(row.assetId)) fail(`${row.assetId}: first handoff row not present in queue`);
  if(row.assetType === 'GLOBAL_REFERENCE') fail(`${row.assetId}: first handoff batch must contain production assets, not references`);
}
if(!data.tasks.some(t => t.id === 'TG-DEV-032' && t.status === 'COMPLETED' && t.relatedEntity === data.blueprint3dProductionQueue.id)) fail('TG-DEV-032 completion task missing for 3D production queue');
if (!data.visualBaselines.length || data.visualBaselines.some(b => b.status !== 'APPROVED')) fail('Visual baselines must all be APPROVED after TG-DEV-009');
if (data.visualQaBaselineApproval.status !== 'APPROVED' || data.visualQaBaselineApproval.taskId !== 'TG-DEV-009' || data.visualQaBaselineApproval.screens.length !== data.visualBaselines.length) fail('Visual QA baseline approval artifact invalid');
for (const b of data.visualBaselines) {
  if (!visualScreenIds.has(b.screenId)) fail(`${b.id}: invalid visual baseline screenId ${b.screenId}`);
  if (b.reviewArtifact !== 'visual/reviews/TG-VISUAL-QA-BASELINE-APPROVAL-001.json') fail(`${b.id}: missing Visual QA approval artifact`);
}
const characterSourceNpcIds = new Set(data.characters.map(c => c.sourceNpcId));
for (const npc of data.npcs) if(!characterSourceNpcIds.has(npc.id)) fail(`${npc.id}: missing promoted non-playable character record`);
for (const character of data.characters) {
  if(character.playable !== false || character.recruitable !== false || character.combatUnit !== false) fail(`${character.id}: character registry must preserve non-playable canon locks`);
  if(character.heroCanonLock !== 'NO_PLAYABLE_HERO_CANON') fail(`${character.id}: missing no-playable-Hero canon lock`);
  if(!npcIds.has(character.sourceNpcId)) fail(`${character.id}: invalid sourceNpcId ${character.sourceNpcId}`);
  if(character.factionId && !factionIds.has(character.factionId)) fail(`${character.id}: invalid factionId ${character.factionId}`);
  if(character.artPromptId && !promptIds.has(character.artPromptId)) fail(`${character.id}: invalid artPromptId ${character.artPromptId}`);
  if(character.backstoryId && !backstoryIds.has(character.backstoryId)) fail(`${character.id}: invalid backstoryId ${character.backstoryId}`);
  for (const field of ['name','characterKind','status','director','role','lore','gameplayFunction']) if(!character[field]) fail(`${character.id}: missing ${field}`);
}

for (const deity of data.titans) {
  if(!factionIds.has(deity.factionId)) fail(`${deity.id}: invalid factionId ${deity.factionId}`);
  if(!promptIds.has(deity.artPromptId)) fail(`${deity.id}: missing prompt ${deity.artPromptId}`);
  if(deity.artworkId && !artworkIds.has(deity.artworkId)) fail(`${deity.id}: invalid artworkId ${deity.artworkId}`);
  for (const field of ['name','faction','rarity','role','lore','visualDescription','developmentStatus','backstoryId']) if(!deity[field]) fail(`${deity.id}: missing ${field}`);
  if(!backstoryIds.has(deity.backstoryId) || !backstoryEntityIds.has(deity.id)) fail(`${deity.id}: missing linked backstory ${deity.backstoryId}`);
}

for (const prompt of data.prompts) {
  if(prompt.category === 'Deity' && !titanIds.has(prompt.entityId)) fail(`${prompt.id}: invalid Deity entity ${prompt.entityId}`);
  if(prompt.category === 'NPC' && !npcIds.has(prompt.entityId)) fail(`${prompt.id}: invalid NPC entity ${prompt.entityId}`);
  if(prompt.category === 'Creature' && !creatureIds.has(prompt.entityId)) fail(`${prompt.id}: invalid creature entity ${prompt.entityId}`);
  if(prompt.category === 'Map' && !mapIds.has(prompt.entityId)) fail(`${prompt.id}: invalid map entity ${prompt.entityId}`);
  if(!exists(`art/prompts/${prompt.id}.json`)) fail(`${prompt.id}: missing per-prompt JSON file`);
  const per = read(`art/prompts/${prompt.id}.json`);
  if(per.id !== prompt.id || per.version < 1) fail(`${prompt.id}: invalid prompt file content`);
  if(!prompt.prompt || !prompt.negativePrompt) fail(`${prompt.id}: prompt text missing`);
  if((prompt.category === 'Deity' || prompt.category === 'NPC' || prompt.category === 'FactionScreen') && prompt.factionVisualBibleId && !data.factionVisualBible.entries.some(e => e.id === prompt.factionVisualBibleId)) fail(`${prompt.id}: invalid factionVisualBibleId ${prompt.factionVisualBibleId}`);
}

for (const npc of data.npcs) {
  if(npc.playable !== false) fail(`${npc.id}: NPC must be non-playable`);
  if(npc.factionId && !factionIds.has(npc.factionId)) fail(`${npc.id}: invalid factionId ${npc.factionId}`);
  if(!promptIds.has(npc.artPromptId)) fail(`${npc.id}: missing prompt ${npc.artPromptId}`);
  if(!npc.backstoryId || !backstoryIds.has(npc.backstoryId) || !backstoryEntityIds.has(npc.id)) fail(`${npc.id}: missing linked backstory ${npc.backstoryId}`);
  if(!exists(`npcs/${npc.id}.json`)) fail(`${npc.id}: missing individual NPC file`);
}

for (const creature of data.creatures) {
  if(creature.playable !== false) fail(`${creature.id}: creature must be non-playable`);
  if(creature.threatFactionId && creature.threatFactionId !== data.hollowThreatFaction.id) fail(`${creature.id}: invalid threatFactionId ${creature.threatFactionId}`);
  if(!promptIds.has(creature.artPromptId)) fail(`${creature.id}: missing prompt ${creature.artPromptId}`);
  if(!creature.backstoryId || !backstoryIds.has(creature.backstoryId) || !backstoryEntityIds.has(creature.id)) fail(`${creature.id}: missing linked backstory ${creature.backstoryId}`);
  if(!creature.combatRole || !enemyArchetypeKeys.has(creature.combatRole)) fail(`${creature.id}: invalid combatRole ${creature.combatRole}`);
  if(!creature.aiProfile || creature.aiProfile.archetype !== creature.combatRole) fail(`${creature.id}: aiProfile must match combatRole`);
  if(!Array.isArray(creature.aiProfile.priority) || creature.aiProfile.priority.length < 3) fail(`${creature.id}: aiProfile priority too thin`);
  if(!creature.aiProfile.counterplayWindow) fail(`${creature.id}: missing AI counterplay window`);
  if(!exists(`creatures/${creature.id}.json`)) fail(`${creature.id}: missing individual creature file`);
}

for (const map of data.maps) {
  if(!campaignIds.has(map.campaignId)) fail(`${map.id}: invalid campaignId ${map.campaignId}`);
  if(!promptIds.has(map.artPromptId)) fail(`${map.id}: missing prompt ${map.artPromptId}`);
  if(!exists(`maps/${map.id}.json`)) fail(`${map.id}: missing individual map file`);
}

const playableFactionNames = new Set(data.factions.map(f => f.name));
if(data.battlefieldCanonRegistry.status !== 'IMPLEMENTED') fail('Battlefield canon registry must be IMPLEMENTED');
if(data.battlefieldCanonRegistry.canonBoundary?.playableFactionCount !== 7) fail('Battlefield canon registry must lock exactly seven playable factions');
for (const faction of data.battlefieldCanonRegistry.canonBoundary?.playableFactionIds || []) if(!factionIds.has(faction)) fail(`Battlefield canon registry invalid playable faction ${faction}`);
if(data.battlefieldCanonRegistry.canonBoundary?.existentialThreat?.id !== data.hollowThreatFaction.id || data.battlefieldCanonRegistry.canonBoundary?.existentialThreat?.playable !== false) fail('Battlefield canon registry must preserve The Hollow as non-playable existential threat');
if(data.battlefieldCanonRegistry.battlefieldCount !== (data.battlefieldCanonRegistry.battlefields || []).length) fail('Battlefield canon registry count mismatch');
if((data.battlefieldCanonRegistry.battlefields || []).length < 7) fail('Battlefield canon registry must cover at least one battlefield route per playable faction');
for (const battlefield of data.battlefieldCanonRegistry.battlefields || []) {
  if(!mapIds.has(battlefield.mapId)) fail(`${battlefield.id}: invalid mapId ${battlefield.mapId}`);
  if(battlefield.primaryFactionId && !factionIds.has(battlefield.primaryFactionId)) fail(`${battlefield.id}: invalid primaryFactionId ${battlefield.primaryFactionId}`);
  if(battlefield.primaryFactionName && !playableFactionNames.has(battlefield.primaryFactionName) && battlefield.primaryFactionName !== 'Contested by all seven playable factions') fail(`${battlefield.id}: invalid primaryFactionName ${battlefield.primaryFactionName}`);
  if(battlefield.hollowIncursionRules?.threatFactionId !== data.hollowThreatFaction.id || battlefield.hollowIncursionRules?.playable !== false) fail(`${battlefield.id}: Hollow rules must keep threat non-playable`);
  for (const field of ['name','dominantResonance','canonDescription','tacticalIdentity','hollowCorruptionLevel']) if(!battlefield[field]) fail(`${battlefield.id}: missing ${field}`);
  for (const list of ['objectives','terrainHazards','factionAffinity','canonLocks']) if(!Array.isArray(battlefield[list]) || battlefield[list].length < 1) fail(`${battlefield.id}: ${list} cannot be empty`);
  for (const view of ['overviewView','tacticalGridView','encounterView','loreView','blueprintView']) if(battlefield.viewReadiness?.[view] !== 'READY_FOR_VIEW_FILE') fail(`${battlefield.id}: ${view} must be ready for view file`);
}
for (const requiredName of playableFactionNames) {
  if(!data.battlefieldCanonRegistry.battlefields.some(b => b.primaryFactionName === requiredName)) fail(`Battlefield canon registry missing primary battlefield for ${requiredName}`);
}

for (const campaign of data.campaigns) {
  for (const id of campaign.chapters || []) if(!chapterIds.has(id)) fail(`${campaign.id}: invalid chapter ${id}`);
  for (const id of campaign.maps || []) if(!mapIds.has(id)) fail(`${campaign.id}: invalid map ${id}`);
  for (const id of campaign.npcs || []) if(!npcIds.has(id)) fail(`${campaign.id}: invalid npc ${id}`);
  for (const id of campaign.creatures || []) if(!creatureIds.has(id)) fail(`${campaign.id}: invalid creature ${id}`);
  if(!exists(`campaigns/${campaign.id}.json`)) fail(`${campaign.id}: missing individual campaign file`);
}

for (const chapter of data.chapters) {
  if(!campaignIds.has(chapter.campaignId)) fail(`${chapter.id}: invalid campaignId ${chapter.campaignId}`);
  if(!mapIds.has(chapter.mapId)) fail(`${chapter.id}: invalid mapId ${chapter.mapId}`);
  if(!exists(`campaigns/chapters/${chapter.id}.json`)) fail(`${chapter.id}: missing individual chapter file`);
}



for (const chapter of data.campaignChapters) {
  if(!factionIds.has(chapter.factionId)) fail(`${chapter.id}: invalid factionId ${chapter.factionId}`);
  if(!chapter.missionIds || chapter.missionIds.length !== 4) fail(`${chapter.id}: must have 4 Normal missions`);
  if(!chapter.eliteMissionIds || chapter.eliteMissionIds.length !== 4) fail(`${chapter.id}: must have 4 Elite missions`);
  for (const id of [...chapter.missionIds, ...chapter.eliteMissionIds]) if(!missionIds.has(id)) fail(`${chapter.id}: invalid mission ${id}`);
}
const missionRequired = ['id','factionId','campaignType','chapter','missionNumber','title','description','lore','recommendedPower','mapId','terrain','objectives','enemyWaves','specialRules','victoryConditions','defeatConditions','rewards','artPackageId','dialogueId','completionState'];
for (const mission of data.missions) {
  for (const field of missionRequired) if(mission[field] === undefined || mission[field] === null || mission[field] === '') fail(`${mission.id}: missing ${field}`);
  if(!factionIds.has(mission.factionId)) fail(`${mission.id}: invalid factionId ${mission.factionId}`);
  if(!['Normal','Elite'].includes(mission.campaignType)) fail(`${mission.id}: invalid campaignType ${mission.campaignType}`);
  if(!mapIds.has(mission.mapId)) fail(`${mission.id}: invalid mapId ${mission.mapId}`);
  if(!mission.objectives.primary || !mission.objectives.optional || mission.objectives.optional.length < 2) fail(`${mission.id}: objectives incomplete`);
  if(!Array.isArray(mission.enemyWaves) || mission.enemyWaves.length < 1) fail(`${mission.id}: enemy waves missing`);
  for (const wave of mission.enemyWaves) for (const enemyId of wave.enemyIds || []) if(!creatureIds.has(enemyId)) fail(`${mission.id}: invalid enemy ${enemyId}`);
  if(mission.boss && !creatureIds.has(mission.boss.enemyId)) fail(`${mission.id}: invalid boss ${mission.boss.enemyId}`);
  if(!missionDialogueIds.has(mission.dialogueId)) fail(`${mission.id}: missing dialogue ${mission.dialogueId}`);
  if(!missionArtPackageIds.has(mission.artPackageId)) fail(`${mission.id}: missing art package ${mission.artPackageId}`);
  const tactical = mission.tacticalProfile;
  if(!tactical) fail(`${mission.id}: missing tacticalProfile`);
  if(!Array.isArray(tactical.problemTags) || tactical.problemTags.length < 3) fail(`${mission.id}: tacticalProfile needs at least three problemTags`);
  for (const tag of tactical.problemTags) if(!allowedMissionProblemTags.has(tag)) fail(`${mission.id}: invalid tactical problem tag ${tag}`);
  for (const tag of tactical.problemTags) missionTagCounts.set(tag, (missionTagCounts.get(tag) || 0) + 1);
  if(!Array.isArray(tactical.advantageRoles) || tactical.advantageRoles.length < 2) fail(`${mission.id}: tacticalProfile needs advantageRoles`);
  for (const role of tactical.advantageRoles) if(!allowedDeityRoles.has(role)) fail(`${mission.id}: invalid advantage role ${role}`);
  for (const role of tactical.advantageRoles) missionRoleCounts.set(role, (missionRoleCounts.get(role) || 0) + 1);
  if(!Array.isArray(tactical.recommendedDeityIds) || tactical.recommendedDeityIds.length < 1) fail(`${mission.id}: tacticalProfile needs recommendedDeityIds`);
  for (const id of tactical.recommendedDeityIds) if(!titanIds.has(id)) fail(`${mission.id}: invalid recommended Deity ${id}`);
  if(tactical.ownershipLock !== false || tactical.favoredNotRequired !== true) fail(`${mission.id}: tacticalProfile must stay favored-not-required with no ownership lock`);
  if(!String(tactical.rule||'').includes('any valid active deity')) fail(`${mission.id}: tactical rule must explain no hard requirement`);
  if(!exists(`missions/${mission.campaignType === 'Elite' ? 'elite' : 'normal'}/${mission.id}.json`)) fail(`${mission.id}: missing individual mission file`);
  if(mission.campaignType === 'Elite') {
    if(!mission.eliteRemixOf || !missionIds.has(mission.eliteRemixOf)) fail(`${mission.id}: missing valid eliteRemixOf`);
    if(!mission.meaningfulDifferences || mission.meaningfulDifferences.length < 4) fail(`${mission.id}: Elite remix not meaningfully different`);
  }
}
for (const dialogue of data.missionDialogue) {
  if(!missionIds.has(dialogue.missionId)) fail(`${dialogue.id}: invalid missionId ${dialogue.missionId}`);
  for (const beat of ['missionIntro','enemyIntroduction','midBattle','victory','defeat','codex']) if(!dialogue.lines?.[beat]?.length) fail(`${dialogue.id}: missing beat ${beat}`);
  if(!exists(`dialogue/missions/${dialogue.id}.json`)) fail(`${dialogue.id}: missing individual dialogue file`);
}
for (const art of data.missionArtPackages) {
  if(!missionIds.has(art.missionId)) fail(`${art.id}: invalid missionId ${art.missionId}`);
  for (const field of ['mapEnvironmentPrompt','backgroundPrompt','enemyPlacementGuidance','bossArtworkRequirements','objectiveArtworkRequirements','vfxRequirements','uiRequirements','missionThumbnail','chapterArtwork']) if(!art[field] || (Array.isArray(art[field]) && !art[field].length)) fail(`${art.id}: missing art requirement ${field}`);
  if(!exists(`art/mission-packages/${art.id}.json`)) fail(`${art.id}: missing individual art package file`);
}

for (const backstory of data.backstories) {
  if(!['Deity','Deity','NPC','Creature'].includes(backstory.entityType)) fail(`${backstory.id}: invalid entityType ${backstory.entityType}`);
  const validEntity = (backstory.entityType === 'Deity' || backstory.entityType === 'Deity') ? titanIds.has(backstory.entityId) : backstory.entityType === 'NPC' ? npcIds.has(backstory.entityId) : creatureIds.has(backstory.entityId);
  if(!validEntity) fail(`${backstory.id}: invalid entityId ${backstory.entityId}`);
  if(!backstory.shortBackstory || !Array.isArray(backstory.chapters) || backstory.chapters.length < 5) fail(`${backstory.id}: incomplete readable backstory`);
  if(!Array.isArray(backstory.storyArcIds) || !backstory.storyArcIds.length) fail(`${backstory.id}: missing story arc tie`);
  for (const arcId of backstory.storyArcIds) if(!storylineArcIds.has(arcId)) fail(`${backstory.id}: invalid story arc ${arcId}`);
  if(!Array.isArray(backstory.loreTies) || backstory.loreTies.length < 2) fail(`${backstory.id}: missing lore ties`);
  const folder = (backstory.entityType === 'Deity' || backstory.entityType === 'Deity') ? 'titans' : backstory.entityType === 'NPC' ? 'npcs' : 'creatures';
  if(!exists(`backstories/${folder}/${backstory.id}.json`)) fail(`${backstory.id}: missing individual backstory file`);
}
if(data.backstories.length !== data.titans.length + data.npcs.length + data.creatures.length) fail(`Backstory coverage mismatch: ${data.backstories.length}`);


const hollowCreatureIds = data.creatures.filter(c => c.threatFactionId === data.hollowThreatFaction.id).map(c => c.id);
if(hollowCreatureIds.length < 16) fail(`Hollow creature roster too small: ${hollowCreatureIds.length}`);
for (const id of data.hollowEncounterSystem.roster || []) if(!creatureIds.has(id)) fail(`Hollow encounter roster invalid creature ${id}`);
if((data.hollowEncounterSystem.roster || []).length !== hollowCreatureIds.length) fail('Hollow encounter roster does not cover all Hollow creatures');
for (const pool of Object.values(data.hollowEncounterSystem.pools || {})) for (const id of pool || []) if(!creatureIds.has(id)) fail(`Hollow encounter pool invalid creature ${id}`);
for (const injector of data.hollowEncounterSystem.sampleMissionInjectors || []) for (const id of injector.enemyIds || []) if(!creatureIds.has(id)) fail(`Hollow injector invalid creature ${id}`);

for (const arc of data.storylineArcs) {
  for (const id of arc.factionFocus || []) if(!factionIds.has(id)) fail(`${arc.id}: invalid faction focus ${id}`);
  for (const id of arc.campaignIds || []) if(!campaignIds.has(id)) fail(`${arc.id}: invalid campaign ${id}`);
  for (const id of arc.chapterIds || []) if(!campaignChapterIds.has(id)) fail(`${arc.id}: invalid campaign chapter ${id}`);
  for (const id of [...(arc.normalMissionIds || []), ...(arc.eliteMissionIds || [])]) if(!missionIds.has(id)) fail(`${arc.id}: invalid mission ${id}`);
}
for (const consequence of data.campaignConsequences) {
  if(!storylineArcIds.has(consequence.storyArcId)) fail(`${consequence.id}: invalid storyArcId ${consequence.storyArcId}`);
  for (const field of ['trigger','effect','scope']) if(!consequence[field]) fail(`${consequence.id}: missing ${field}`);
}
const asgardNormal = data.missions.filter(m => m.factionId === 'TG-FACTION-002' && m.campaignType === 'Normal');
const asgardElite = data.missions.filter(m => m.factionId === 'TG-FACTION-002' && m.campaignType === 'Elite');
if(asgardNormal.length !== 20 || asgardElite.length !== 20) fail(`Asgardian campaign incomplete: ${asgardNormal.length} Normal, ${asgardElite.length} Elite`);

const atenNormal = data.missions.filter(m => m.factionId === 'TG-FACTION-001' && m.campaignType === 'Normal');
const atenElite = data.missions.filter(m => m.factionId === 'TG-FACTION-001' && m.campaignType === 'Elite');
if(atenNormal.length !== 20 || atenElite.length !== 20) fail(`Aten Ra campaign incomplete: ${atenNormal.length} Normal, ${atenElite.length} Elite`);

for (const art of data.artworks) {
  if(!/\.(png|jpe?g|webp)$/i.test(art.file || '')) fail(`${art.id}: invalid image extension`);
  if(!/^(art\/(imported|approved|concepts|reference)\/)/.test(art.file || '')) fail(`${art.id}: unsafe artwork path`);
  if(art.entityId && !titanIds.has(art.entityId) && !data.characters.some(c => c.id === art.entityId) && !factionIds.has(art.entityId)) fail(`${art.id}: invalid entity reference`);
}

for (const entry of data.lore) {
  if(!exists(entry.file)) fail(`${entry.id}: missing lore file ${entry.file}`);
}

for (const task of data.tasks) {
  for (const field of ['description','director','priority','status']) if(!task[field]) fail(`${task.id}: missing ${field}`);
  if(!['ACTIVE','NEXT','BLOCKED','COMPLETED'].includes(task.status)) fail(`${task.id}: invalid status ${task.status}`);
}

const soloSchema = data.soloBattleStateSchema;
if(soloSchema.status !== 'IMPLEMENTED') fail('Solo battle state schema must be IMPLEMENTED');
for (const field of ['stateShape','reducers','resourceRules','qualityGates','verticalSliceDefault']) if(!soloSchema[field]) fail(`Solo battle state schema missing ${field}`);
if(soloSchema.verticalSliceDefault.starterDeityId !== 'TG-TITAN-001') fail('Solo battle starter Titan must remain canonical Aten-Ra');
if(!titanIds.has(soloSchema.verticalSliceDefault.starterDeityId)) fail('Solo battle schema references invalid starter Deity');
for (const enemyId of soloSchema.verticalSliceDefault.starterEnemies || []) if(!creatureIds.has(enemyId)) fail(`Solo battle schema invalid starter enemy ${enemyId}`);
for (const reducer of ['createInitialSoloBattleState','applyDeityAction','revealEnemyIntents','resolveEnemyPhase','applyReaction','applyTerrainTick','evaluateObjectives']) if(!soloSchema.reducers.some(r => r.name === reducer)) fail(`Solo battle schema missing reducer ${reducer}`);
const soloSlice = data.soloVerticalSlice;
if(soloSlice.status !== 'IMPLEMENTED') fail('Solo vertical slice must be IMPLEMENTED');
if(soloSlice.faction?.id !== 'TG-FACTION-001') fail('Solo vertical slice must stay anchored to Aten Ra');
if(soloSlice.starterDeity?.id !== soloSchema.verticalSliceDefault.starterDeityId) fail('Solo vertical slice starter Deity mismatch');
if(!Array.isArray(soloSlice.missionTypes) || soloSlice.missionTypes.length !== 5) fail('Solo vertical slice must contain exactly five pre-boss mission types');
if(!soloSlice.bossEncounter || !Array.isArray(soloSlice.bossEncounter.phasePlan) || soloSlice.bossEncounter.phasePlan.length !== 5) fail('Solo vertical slice boss must contain five phases');
for (const mission of soloSlice.missionTypes) {
  for (const enemyId of mission.enemyIds || []) if(!creatureIds.has(enemyId)) fail(`${mission.id}: invalid solo slice enemy ${enemyId}`);
  for (const reducer of mission.requiredReducers || []) if(!soloSchema.reducers.some(r => r.name === reducer)) fail(`${mission.id}: invalid solo slice reducer ${reducer}`);
  for (const objectiveId of mission.objectiveIds || []) if(!(soloSlice.objectiveStateDefaults || []).some(o => o.id === objectiveId)) fail(`${mission.id}: missing solo slice objective default ${objectiveId}`);
}
if(!creatureIds.has(soloSlice.bossEncounter.enemyId)) fail('Solo vertical slice boss references invalid creature');
for (const objectiveId of soloSlice.bossEncounter.objectiveIds || []) if(!(soloSlice.objectiveStateDefaults || []).some(o => o.id === objectiveId)) fail(`Solo vertical slice boss objective missing ${objectiveId}`);
for (const gate of ['Exactly one active player deity','Exactly five pre-boss mission types','Exactly one boss encounter with five readable phases']) if(!(soloSlice.qualityGates || []).includes(gate)) fail(`Solo vertical slice missing quality gate ${gate}`);
const soloEngine = fs.readFileSync(path.join(root,'game/solo-battle-engine.mjs'),'utf8');
for (const token of ['createInitialSoloBattleState','applyDeityAction','revealEnemyIntents','resolveEnemyPhase','applyReaction','applyTerrainTick','evaluateObjectives','runReducerScript']) if(!soloEngine.includes(`export function ${token}`)) fail(`Solo battle engine missing ${token}`);

const asyncArena = data.asyncArenaSystem;
if(asyncArena.status !== 'IMPLEMENTED') fail('Async arena snapshot model must be IMPLEMENTED');
if(asyncArena.mode !== 'ASYNCHRONOUS' || asyncArena.livePvpImplemented !== false || asyncArena.standardSquadSize !== 1) fail('Async arena must remain asynchronous one-Deity snapshot model');
if(!asyncArena.snapshotRules?.oneActiveDefenderDeity || !asyncArena.snapshotRules?.checksumRequired || asyncArena.snapshotRules?.noFabricatedProgression !== true) fail('Async arena snapshot rules incomplete');
if(!Array.isArray(asyncArena.defenseSnapshots) || asyncArena.defenseSnapshots.length !== asyncArena.sampleOpponents.length) fail('Async arena snapshot coverage mismatch');
for (const snap of asyncArena.defenseSnapshots) {
  if(!titanIds.has(snap.sourceDeityId)) fail(`${snap.snapshotId}: invalid sourceDeityId`);
  for (const field of asyncArena.defenseSnapshotFields) if(snap[field] === undefined || snap[field] === null || snap[field] === '') fail(`${snap.snapshotId}: missing snapshot field ${field}`);
  if(!Array.isArray(snap.stanceLoadout) || !snap.stanceLoadout.includes('Ascendant')) fail(`${snap.snapshotId}: incomplete stance loadout`);
  if(!Array.isArray(snap.reactionLoadout) || snap.reactionLoadout.length < 2) fail(`${snap.snapshotId}: incomplete reaction loadout`);
  if(!String(snap.checksum).startsWith('sha256:')) fail(`${snap.snapshotId}: checksum missing`);
}
if(data.endgameDashboard.sampleState && JSON.stringify(data.endgameDashboard.sampleState) !== '{}') fail('Endgame dashboard must not fabricate player progression');



for (const file of ['index.html','game/index.html','game/tactical-map-prototype.html','mini-app/mythos-gates-ascension.html']) if(!exists(file)) fail(`Missing required HTML file ${file}`);
const game = fs.readFileSync(path.join(root,'game/index.html'),'utf8');
const hubRuntime = fs.readFileSync(path.join(root,'game/command-hub-runtime.mjs'),'utf8');
<<<<<<< HEAD
if(!game.includes('OPEN THE MYTHOS GATE') || !game.includes('createCommandHubRuntime') || !game.includes('Command Hub')) fail('Playable Command Hub integrity check failed');
for (const token of ['BOOT_STAGES','validatePlayerState','getNextRecommendedAction','AssetManager','AudioManager','deriveNotifications','bottomNav','Deity Roster','Realm Network','Lore Registry','Playable Solo Battle','battleBasic','battleObjective','normalizeProgression','createRewardCache','claimReward','pendingRewards','rewardHistory','STARTER_DEITY_IDS','AWAKENING_BEATS','completeAwakeningBeat','awakeningProgress','starterDeitys','ensureOnboarding','Awakening Protocol','chooseStarter','advanceAwakeningBeat','finishAwakening','TRIAL_DEITY_IDS','TRIAL_MODES','trialDeities','ensureTrials','createTrialAttempt','resolveTrialAttempt','trialsScreen','startTrial','finishTrial','Trial Favor','Temporary Loadout','borrowed gear does not','raidProgress','raidRules','stageProfiles','problemTags','preferredCounters','carryRisk','tierCaps','approachRules','createRaidAttempt','resolveRaidStage','completeRaidAttempt','resolveRaidEconomy','applyRaidMastery','Raid Tokens','Signature Alloy','Mastery Seals','raidScreen','startRaid','raidResolve','raidClaim','The Gate Warden']) if(!hubRuntime.includes(token)) fail(`Command Hub runtime missing ${token}`);
=======
if(!game.includes('OPEN THE TITAN GATE') || !game.includes('createCommandHubRuntime') || !game.includes('Command Hub')) fail('Playable Command Hub integrity check failed');
for (const token of ['BOOT_STAGES','validatePlayerState','getNextRecommendedAction','AssetManager','AudioManager','deriveNotifications','bottomNav','Deity Roster','Realm Network','Lore Registry','Playable Solo Battle','battleBasic','battleObjective','normalizeProgression','createRewardCache','claimReward','pendingRewards','rewardHistory','STARTER_TITAN_IDS','AWAKENING_BEATS','completeAwakeningBeat','awakeningProgress','starterTitans','ensureOnboarding','Awakening Protocol','chooseStarter','advanceAwakeningBeat','finishAwakening','TRIAL_TITAN_IDS','TRIAL_MODES','trialTitans','ensureTrials','createTrialAttempt','resolveTrialAttempt','trialsScreen','startTrial','finishTrial','Trial Favor','Temporary Loadout','borrowed gear does not','raidProgress','raidRules','stageProfiles','problemTags','preferredCounters','carryRisk','tierCaps','approachRules','createRaidAttempt','resolveRaidStage','completeRaidAttempt','resolveRaidEconomy','applyRaidMastery','Raid Tokens','Signature Alloy','Mastery Seals','raidScreen','startRaid','raidResolve','raidClaim','The Gate Warden']) if(!hubRuntime.includes(token)) fail(`Command Hub runtime missing ${token}`);
>>>>>>> 919bdc51 (Mythos Gates: Ascension — Full repo migration)
const browserBattle = fs.readFileSync(path.join(root,'game/browser-battle-engine.mjs'),'utf8');
for (const token of ['createBattleState','applyDeityAction','applyReaction','autoAdvanceEnemyTurn','summarizeBattle','chooseEnemyIntent','HOLLOW_SWARMER','GATEBORN_BRUTE','OBJECTIVE_CRUSH','enemyIntentCounts','enemyBehaviorTags','enemyCounterplay','behaviorTag','counterplay','ISOLATION_PUNISH','OBJECTIVE_DENIAL','ARCHETYPE_BUDGETS','resolveMissionScaling','scaleEnemyForMission','enemyScaling','threatBudget']) if(!browserBattle.includes(token)) fail(`Browser battle engine missing ${token}`);
const battlefieldRuntime = fs.readFileSync(path.join(root,'game/battlefield-runtime.mjs'),'utf8');
for (const token of ['createBattlefieldRuntimeState','buildBattlefieldTerrain','createBattlefieldObjectives','createBattlefieldEnemyRoster','applyBattlefieldAction','applyBattlefieldInteraction','endBattlefieldRound','advanceBattlefieldBossPhase','summarizeBattlefieldRuntime','runBattlefieldScript']) if(!battlefieldRuntime.includes(token)) fail(`Battlefield runtime missing ${token}`);
if(data.battlefieldRuntimeArchitecture.status !== 'IMPLEMENTED' || data.battlefieldRuntimeArchitecture.taskId !== 'TG-DEV-029') fail('Battlefield runtime architecture must be implemented for TG-DEV-029');
if(data.battlefieldRuntimeArchitecture.productionSlice !== data.battlefieldVerticalSlice.id) fail('Battlefield runtime architecture production slice mismatch');
for (const target of ['one active deity','49 meaningful spaces','interactive terrain','boss phases','mobile bottom action bar','camera modes']) if(!data.battlefieldVerticalSlice.qualityTargets.includes(target)) fail(`Battlefield vertical slice missing quality target ${target}`);
const hub = data.commandHubContract;
if(hub.status !== 'IMPLEMENTED' || hub.canonFirst !== true) fail('Command Hub contract must be IMPLEMENTED and canon-first');
if(!Array.isArray(hub.startupPipeline) || hub.startupPipeline.length < 9 || hub.startupPipeline[0] !== 'BOOT' || !hub.startupPipeline.includes('MAIN_COMMAND_HUB')) fail('Command Hub startup pipeline incomplete');

const raidSystem = data.raidSystem;
if(!raidSystem || raidSystem.status !== 'IMPLEMENTED' || !['TG-DEV-024','TG-DEV-025'].includes(raidSystem.taskId)) fail('Raid system framework/economy must be implemented for TG-DEV-024/TG-DEV-025');
if(!Array.isArray(raidSystem.stageProfiles) || raidSystem.stageProfiles.length !== 5) fail('Raid framework must expose five deterministic stage profiles');
for (const s of raidSystem.stageProfiles) {
  if(!Array.isArray(s.problemTags) || s.problemTags.length < 2) fail(`Raid stage ${s.stage} missing tactical problem tags`);
  if(!Array.isArray(s.preferredCounters) || s.preferredCounters.length < 2) fail(`Raid stage ${s.stage} missing preferred counters`);
  if(!s.carryRisk || !s.baseScore) fail(`Raid stage ${s.stage} missing carry risk/base score`);
}
for (const token of ['RAID_NORMAL','RAID_HARD','RAID_ELITE','RAID_ASCENDED','RAID_MYTHIC']) if(!raidSystem.tierCaps?.[token]) fail(`Raid tier cap missing ${token}`);
for (const token of ['BALANCED','GUARDED','AGGRESSIVE']) if(!raidSystem.approachRules?.[token]) fail(`Raid approach rule missing ${token}`);
for (const forbidden of ['livePvP','paidPowerShortcut','hiddenRandomRolls','multiDeityControl','uncappedReplayRewards']) if(!raidSystem.forbiddenInitialScope?.includes(forbidden)) fail(`Raid forbidden scope missing ${forbidden}`);
if(raidSystem.economyTuning?.status !== 'IMPLEMENTED') fail('Raid economy tuning must be IMPLEMENTED');
for (const q of ['S','A','B','C']) {
  const row = raidSystem.economyTuning?.qualityRewardTable?.[q];
  if(!row || !row.tokenBase || !row.signatureAlloy || !row.masteryXpScalar || !row.gearMaterialBand) fail(`Raid economy quality table missing ${q}`);
}
if(raidSystem.economyTuning.firstClear?.tokenBonus !== 8 || raidSystem.economyTuning.firstClear?.masterySeals !== 1) fail('Raid first-clear economy tuning invalid');
if(raidSystem.economyTuning.replay?.payoutScalar >= 0.5 || raidSystem.economyTuning.replay?.minReplayTokens < 1) fail('Raid replay scalar/cap tuning invalid');
for (const tier of ['RAID_NORMAL','RAID_HARD','RAID_ELITE','RAID_ASCENDED','RAID_MYTHIC']) if(!raidSystem.economyTuning.weeklyReplayTokenCaps?.[tier]) fail(`Raid economy weekly cap missing ${tier}`);
for (const rule of ['Paid power shortcuts are forbidden.','Replay payout is capped and decays by weekly clear count.','Mastery credit applies only to the one active deity used in the clear.']) if(!raidSystem.economyTuning.antiPayToWinRules?.includes(rule)) fail(`Raid anti-pay-to-win rule missing: ${rule}`);
if(!raidSystem.acceptanceGates?.some(g => g.includes('TG-DEV-025 raid economy tuning is IMPLEMENTED'))) fail('Raid economy acceptance gate missing TG-DEV-025');

if(hub.onboardingFlow?.status !== 'IMPLEMENTED' || hub.onboardingFlow?.taskId !== 'TG-DEV-026') fail('TG-DEV-026 onboarding flow must be implemented');
if(!Array.isArray(hub.onboardingFlow.starterDeityIds) || hub.onboardingFlow.starterDeityIds.length !== 3) fail('TG-DEV-026 requires exactly three starter deities');
for (const id of hub.onboardingFlow.starterDeityIds) if(!titanIds.has(id)) fail(`TG-DEV-026 invalid starter deity ${id}`);
if(hub.onboardingFlow.beatCount !== 12 || hub.onboardingFlow.fullRosterHiddenUntilComplete !== true) fail('TG-DEV-026 onboarding beat/roster guardrail invalid');
for (const rule of ['Starter choice is canon-safe and limited to three roles.','Full roster is hidden during onboarding to prevent roster flood.','Second deity desire is created through trials and story, not mandatory purchase pressure.']) if(!hub.onboardingFlow.antiPayToWinRules?.includes(rule)) fail(`TG-DEV-026 onboarding rule missing: ${rule}`);
if(!hub.qualityGates?.some(g => g.includes('TG-DEV-026 Awakening onboarding'))) fail('Command Hub quality gate missing TG-DEV-026');
const trialSystem = data.titanTrialSystem;
if(trialSystem.status !== 'IMPLEMENTED' || trialSystem.taskId !== 'TG-DEV-027') fail('Divine Trial system must complete TG-DEV-027');
if(!Array.isArray(trialSystem.trialDeityIds) || trialSystem.trialDeityIds.length < 3) fail('TG-DEV-027 requires at least three showcase deities');
for (const id of trialSystem.trialDeityIds) if(!titanIds.has(id)) fail(`TG-DEV-027 invalid trial deity ${id}`);
if(!Array.isArray(trialSystem.trialModes) || trialSystem.trialModes.length !== 3) fail('TG-DEV-027 must define three trial modes');
for (const mode of trialSystem.trialModes) if(!mode.id || !mode.label || !mode.rule || !Array.isArray(mode.scoreFocus) || mode.scoreFocus.length < 2) fail(`TG-DEV-027 trial mode incomplete: ${mode.id || 'unknown'}`);
if(!String(trialSystem.activeDeityRule || '').includes('one temporary deity')) fail('TG-DEV-027 one temporary deity rule missing');
if(!trialSystem.temporaryLoadoutRules?.some(rule => String(rule).includes('expires=END_OF_TRIAL'))) fail('TG-DEV-027 temporary loadout expiry missing');
if(!trialSystem.rewardGuardrails?.some(rule => String(rule).includes('borrowed gear does not'))) fail('TG-DEV-027 borrowed gear guardrail missing');
if(hub.trialSystem?.status !== 'IMPLEMENTED' || hub.trialSystem?.taskId !== 'TG-DEV-027') fail('Command Hub trial system must implement TG-DEV-027');
if(hub.trialSystem?.temporaryLoadoutExpires !== 'END_OF_TRIAL') fail('Command Hub trial loadout expiry mismatch');
if(!hub.qualityGates?.some(g => g.includes('TG-DEV-027'))) fail('Command Hub quality gate missing TG-DEV-027');
const tacticalProfileSystem = data.missionTacticalProfileSystem;
if(tacticalProfileSystem.status !== 'IMPLEMENTED' || tacticalProfileSystem.taskId !== 'TG-DEV-028') fail('Mission tactical profile system must complete TG-DEV-028');
if(tacticalProfileSystem.missionCoverage?.total !== data.missions.length || tacticalProfileSystem.missionCoverage?.missingProfiles !== 0) fail('TG-DEV-028 mission coverage mismatch');
if(tacticalProfileSystem.missionCoverage?.normal !== 140 || tacticalProfileSystem.missionCoverage?.elite !== 140) fail('TG-DEV-028 Normal/Elite mission coverage mismatch');
for (const tag of tacticalProfileSystem.allowedProblemTags || []) if(!allowedMissionProblemTags.has(tag)) fail(`TG-DEV-028 invalid allowed tag ${tag}`);
for (const role of tacticalProfileSystem.allowedDeityRoles || []) if(!allowedDeityRoles.has(role)) fail(`TG-DEV-028 invalid allowed role ${role}`);
for (const tag of allowedMissionProblemTags) if((missionTagCounts.get(tag) || 0) < 1) fail(`TG-DEV-028 tag has no mission coverage: ${tag}`);
<<<<<<< HEAD
for (const role of allowedDeityRoles) if((missionRoleCounts.get(role) || 0) < 1) fail(`TG-DEV-028 Deity role has no mission recommendation coverage: ${role}`);
for (const rule of ['Mission tactical profiles may recommend roles and deities, but never require ownership.','Every tagged mission must keep ownershipLock=false and favoredNotRequired=true.']) if(!tacticalProfileSystem.antiPayToWinRules?.includes(rule)) fail(`TG-DEV-028 rule missing: ${rule}`);
=======
for (const role of allowedTitanRoles) if((missionRoleCounts.get(role) || 0) < 1) fail(`TG-DEV-028 deity role has no mission recommendation coverage: ${role}`);
for (const rule of ['Mission tactical profiles may recommend roles and Titans, but never require ownership.','Every tagged mission must keep ownershipLock=false and favoredNotRequired=true.']) if(!tacticalProfileSystem.antiPayToWinRules?.includes(rule)) fail(`TG-DEV-028 rule missing: ${rule}`);
>>>>>>> 919bdc51 (Mythos Gates: Ascension — Full repo migration)
if(hub.missionTacticalProfiles?.status !== 'IMPLEMENTED' || hub.missionTacticalProfiles?.taskId !== 'TG-DEV-028') fail('Command Hub mission tactical profile summary must implement TG-DEV-028');
if(hub.missionTacticalProfiles?.ownershipLock !== false || hub.missionTacticalProfiles?.favoredNotRequired !== true) fail('Command Hub mission profile ownership rule mismatch');
if(!hub.qualityGates?.some(g => g.includes('TG-DEV-028 all 280 campaign missions'))) fail('Command Hub quality gate missing TG-DEV-028');
const enemyRegistry = data.enemyArchetypeRegistry;
if(enemyRegistry.status !== 'IMPLEMENTED' || enemyRegistry.taskId !== 'TG-DEV-023') fail('Enemy archetype registry must complete TG-DEV-023');
if(enemyRegistry.coverage?.creatures !== data.creatures.length || enemyRegistry.coverage?.missingCreatureAi?.length !== 0) fail('TG-DEV-023 creature AI coverage mismatch');
if((enemyRegistry.archetypes || []).length < 10) fail('TG-DEV-023 must cover all design archetypes');
for (const archetype of enemyRegistry.archetypes || []) {
  if(!archetype.key || !archetype.purpose || !archetype.counterplay) fail('TG-DEV-023 archetype missing purpose/counterplay');
  if(!archetype.aiProfile || !Array.isArray(archetype.aiProfile.decisionLoop) || archetype.aiProfile.decisionLoop.length < 3) fail(`${archetype.key}: missing AI decision loop`);
  if(!Array.isArray(archetype.aiProfile.targetPriority) || archetype.aiProfile.targetPriority.length < 2) fail(`${archetype.key}: missing target priorities`);
  if(!archetype.aiProfile.telegraph || !archetype.aiProfile.counterplay) fail(`${archetype.key}: missing telegraph/counterplay`);
}
for (const tier of ['NORMAL','HARD','ELITE','ASCENDED','MYTHIC']) if(!difficultyBudgetTiers.has(tier)) fail(`TG-DEV-023 missing difficulty budget ${tier}`);
for (const budget of enemyRegistry.difficultyBudgets || []) {
  if(!budget.statMultiplier || !budget.compositionBudget || !budget.hazardBudget || !budget.reactionFrequency) fail(`${budget.tier}: incomplete tactical budget`);
  if(budget.maxDynamicPowerFlexPct > 10) fail(`${budget.tier}: dynamic power flex exceeds cap`);
}
if(!enemyRegistry.runtimeRules?.some(rule => String(rule).includes('behavior, composition, hazards, and phases before raw health inflation'))) fail('TG-DEV-023 anti-stat-inflation rule missing');
if(hub.enemyArchetypeRegistry?.status !== 'IMPLEMENTED' || hub.enemyArchetypeRegistry?.taskId !== 'TG-DEV-023') fail('Command Hub enemy archetype summary must implement TG-DEV-023');
if(!hub.qualityGates?.some(g => g.includes('TG-DEV-023 every creature'))) fail('Command Hub quality gate missing TG-DEV-023');
const creatureBehaviorRuntime = data.creatureBehaviorRuntime;
if(creatureBehaviorRuntime.status !== 'IMPLEMENTED' || creatureBehaviorRuntime.taskId !== 'TG-DEV-008') fail('Creature behavior runtime contract must complete TG-DEV-008');
for (const id of ['TG-CREATURE-001','TG-CREATURE-002']) if(!creatureBehaviorRuntime.implementedCreatures?.some(c => c.creatureId === id)) fail(`TG-DEV-008 missing behavior contract for ${id}`);
for (const runtimeId of ['HOLLOW_SWARMER','GATEBORN_BRUTE']) if(!creatureBehaviorRuntime.implementedCreatures?.some(c => c.runtimeProfileId === runtimeId)) fail(`TG-DEV-008 missing runtime profile ${runtimeId}`);
for (const intent of ['SWARM_RAKE','SWARM_SURROUND','GATE_STOMP','FRACTURE_ROAR','OBJECTIVE_CRUSH']) if(!creatureBehaviorRuntime.implementedCreatures?.some(c => (c.requiredIntents || []).includes(intent))) fail(`TG-DEV-008 missing required intent ${intent}`);
for (const tag of ['MEMORY_SCRATCH','ISOLATION_PUNISH','ANCHOR_STOMP','MOMENTUM_BREAK','OBJECTIVE_DENIAL']) if(!creatureBehaviorRuntime.implementedCreatures?.some(c => (c.requiredBehaviorTags || []).includes(tag))) fail(`TG-DEV-008 missing behavior tag ${tag}`);
for (const token of ['enemyIntentCounts','enemyBehaviorTags','enemyCounterplay','objectiveProgress']) if(!creatureBehaviorRuntime.implementedCreatures?.some(c => (c.telemetry || []).includes(token)) && !creatureBehaviorRuntime.implementedCreatures?.flatMap(c => c.telemetry || []).includes(token)) fail(`TG-DEV-008 missing telemetry ${token}`);
if(!creatureBehaviorRuntime.runtimeRules?.some(rule => String(rule).includes('role / AI archetype'))) fail('TG-DEV-008 role-driven AI rule missing');
if(!creatureBehaviorRuntime.uiRequirements?.some(rule => String(rule).includes('counterplay copy'))) fail('TG-DEV-008 UI counterplay requirement missing');
if(hub.creatureBehaviorRuntime?.status !== 'IMPLEMENTED' || hub.creatureBehaviorRuntime?.taskId !== 'TG-DEV-008') fail('Command Hub creature behavior summary must implement TG-DEV-008');
for (const intent of creatureBehaviorRuntime.implementedCreatures.flatMap(c => c.requiredIntents || [])) if(!browserBattle.includes(intent)) fail(`Browser battle engine missing TG-DEV-008 intent ${intent}`);
for (const profile of creatureBehaviorRuntime.implementedCreatures.map(c => c.runtimeProfileId)) if(!browserBattle.includes(profile) && !hubRuntime.includes(profile)) fail(`Runtime missing TG-DEV-008 profile ${profile}`);
if(!hub.qualityGates?.some(g => g.includes('TG-DEV-008 Hollow Wretch'))) fail('Command Hub quality gate missing TG-DEV-008 behavior records');
const scaleSheets = data.artDirectorScaleSheets;
if(scaleSheets.status !== 'IMPLEMENTED' || scaleSheets.taskId !== 'TG-DEV-030') fail('Art Director scale sheets must complete TG-DEV-030');
if(scaleSheets.coverage?.implemented !== 8 || scaleSheets.coverage?.missing?.length !== 0) fail('TG-DEV-030 scale sheet coverage mismatch');
const implementedScaleSheetTypes = new Set((scaleSheets.sheets || []).map(sheet => sheet.type));
for (const type of requiredScaleSheetTypes) if(!implementedScaleSheetTypes.has(type)) fail(`TG-DEV-030 missing scale sheet type ${type}`);
for (const sheet of scaleSheets.sheets || []) {
  if(!sheet.id || !sheet.title || !sheet.primarySubject || !sheet.composition || !sheet.camera) fail(`TG-DEV-030 incomplete scale sheet ${sheet.id || 'unknown'}`);
  if(typeof sheet.ratioToDeity !== 'number' || sheet.ratioToDeity <= 0) fail(`${sheet.id}: invalid ratioToDeity`);
  if(!Array.isArray(sheet.compareAgainst) || sheet.compareAgainst.length < 3) fail(`${sheet.id}: compareAgainst too thin`);
  if(!Array.isArray(sheet.promptOverlay) || sheet.promptOverlay.length < 3) fail(`${sheet.id}: prompt overlay too thin`);
  if(!Array.isArray(sheet.qaChecks) || sheet.qaChecks.length < 3) fail(`${sheet.id}: QA checks too thin`);
}
for (const rule of ['Never shrink deities to solve composition; enlarge Gates, architecture, and battlefield space instead.','Terrain and hazards must be physical art features, never neon board-game overlays.']) if(!scaleSheets.globalRules?.includes(rule)) fail(`TG-DEV-030 global rule missing: ${rule}`);
if(hub.artDirectorScaleSheets?.status !== 'IMPLEMENTED' || hub.artDirectorScaleSheets?.taskId !== 'TG-DEV-030') fail('Command Hub art scale summary must implement TG-DEV-030');
if(!hub.qualityGates?.some(g => g.includes('TG-DEV-030 all 8 Art Director scale sheet types'))) fail('Command Hub quality gate missing TG-DEV-030');
if(!hub.defaultPlayerState?.selectedDeities?.every(id => titanIds.has(id))) fail('Command Hub default PlayerState references invalid Deity');
if(!missionIds.has(hub.defaultPlayerState?.campaignProgress?.currentMissionId)) fail('Command Hub default PlayerState references invalid mission');
if((hub.navigationTabs || []).length !== 5) fail('Command Hub must expose five bottom navigation sections');
if(!hub.qualityGates?.some(g => g.includes('BOOT -> LOAD -> HUB -> TITANS -> BACK -> BATTLE -> RETURN -> HUB'))) fail('Command Hub smoke quality gate missing');
const assetRegistry = data.assetRegistry;
if(assetRegistry.status !== 'IMPLEMENTED' || !Array.isArray(assetRegistry.assets) || assetRegistry.assets.length < data.factions.length * 3) fail('Command Hub asset registry incomplete');
for (const asset of assetRegistry.assets) {
  if(!asset.assetId || !asset.entityId || !asset.assetType || !asset.path || !asset.status || !asset.fallback) fail(`Invalid asset registry row ${asset.assetId || 'unknown'}`);
  if(!assetRegistry.assetStatuses.includes(asset.status)) fail(`${asset.assetId}: invalid asset status`);
  if(asset.status === 'FINAL' && (!asset.finalPath || !asset.approvedForRuntime || !asset.provenance)) fail(`${asset.assetId}: FINAL asset missing integration provenance`);
}
const finalArt = assetRegistry.finalArtIntegration;
if(finalArt?.status !== 'IMPLEMENTED') fail('Command Hub final art integration manifest missing');
const finalBg = assetRegistry.assets.filter(a => a.assetType === 'COMMAND_HUB_BACKGROUND' && a.status === 'FINAL').length;
const finalGates = assetRegistry.assets.filter(a => a.assetType === 'GATE' && a.status === 'FINAL').length;
const finalStarterDeities = assetRegistry.assets.filter(a => a.assetType === 'TITAN_PRESENTATION' && a.status === 'FINAL' && ['TG-TITAN-001','TG-TITAN-006','TG-TITAN-009'].includes(a.entityId)).length;
if(finalBg < data.factions.length) fail('Command Hub final art integration missing faction backgrounds');
if(finalGates < data.realmCodex.length) fail('Command Hub final art integration missing realm gates');
if(finalStarterDeities !== 3) fail('Command Hub final art integration missing starter Deity slots');
if(!hub.commandHubFinalArtIntegration || hub.commandHubFinalArtIntegration.status !== 'IMPLEMENTED') fail('Command Hub contract missing final art integration block');
const tactical = fs.readFileSync(path.join(root,'game/tactical-map-prototype.html'),'utf8');
for (const token of ['__TG_TACTICAL_MAP_READY__','const REALMS','const TITANS','function getMovableTiles','function enemyTurn','toggleCamera','realm-selector']) if(!tactical.includes(token)) fail(`Tactical prototype missing ${token}`);
if(!data.visualScreens.some(s => s.id === 'TG-SCREEN-TACTICAL-MAP-PROTOTYPE' && s.slug === 'tactical-map-prototype')) fail('Visual QA missing tactical map prototype screen');
const home = fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const token of ['Art Studio','Lore Codex','Directors','Copy Prompt','Game Preview','Visual QA','Tactical Map Prototype','data/${f}.json']) if(!home.includes(token)) fail(`Dashboard missing ${token}`);

console.log(JSON.stringify({ok:true, ids:ids.size, factions:data.factions.length, titans:data.titans.length, npcs:data.npcs.length, creatures:data.creatures.length, hollowCreatures:hollowCreatureIds.length, maps:data.maps.length, campaigns:data.campaigns.length, chapters:data.chapters.length, prompts:data.prompts.length, backstories:data.backstories.length, tasks:data.tasks.length, visualScreens:data.visualScreens.length, visualRules:data.visualChangeRules.length, realmCodex:data.realmCodex.length, hybridLayers:data.hybridVisualArchitecture.visualLayers.length, assetTypes:data.assetPipeline.assetTypes.length, missions:data.missions.length, missionDialogue:data.missionDialogue.length, missionArtPackages:data.missionArtPackages.length, githubSync:data.githubSyncStatus.status, soloBattleSchema:data.soloBattleStateSchema.status, soloVerticalSlice:data.soloVerticalSlice.status, asyncArena:data.asyncArenaSystem.status, commandHub:data.commandHubContract.status, battlefieldRuntime:data.battlefieldRuntimeArchitecture.status, blueprint3d:data.blueprint3dSystem.status, blueprint3dAssets:data.blueprint3dRegistry.assets.length, blueprint3dProductionQueue:data.blueprint3dProductionQueue.queue.length}, null, 2));


// GitHub-centered asset repository validation
if (!data.githubAssetRepository || data.githubAssetRepository.status !== 'IMPLEMENTED') fail('GitHub asset repository contract must be implemented');
if (!data.githubAssetRegistry || !Array.isArray(data.githubAssetRegistry.entries)) fail('GitHub asset registry entries missing');
if (!data.githubAssetDependencyGraph || !Array.isArray(data.githubAssetDependencyGraph.nodes)) fail('GitHub asset dependency graph missing');
if (data.githubAssetRegistry.entries.length < 129) fail('GitHub asset registry must cover the 129 canonical 3D blueprint assets');
const githubAssetIds = new Set(data.githubAssetRegistry.entries.map(a => a.asset_id));
if (githubAssetIds.size !== data.githubAssetRegistry.entries.length) fail('GitHub asset registry contains duplicate permanent IDs');
for (const asset of data.githubAssetRegistry.entries) {
  if (!asset.asset_id || !asset.asset_type || !asset.canonical_name) fail(`GitHub asset registry incomplete row: ${asset.asset_id || 'unknown'}`);
  if (asset.asset_type !== 'GLOBAL_REFERENCE' && asset.scale_reference !== 'MASTER_SCALE') fail(`${asset.asset_id}: 3D asset missing MASTER_SCALE link`);
  if (!asset.versions || !('current' in asset.versions)) fail(`${asset.asset_id}: version contract missing`);
}
