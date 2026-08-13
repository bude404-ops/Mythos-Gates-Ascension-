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
  realmCodex: read('data/realm-codex.json'),
  hybridVisualArchitecture: read('data/hybrid-visual-architecture.json'),
  assetPipeline: read('data/asset-pipeline.json'),
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
  endgameDashboard: read('data/endgame-dashboard.json'),
  commandHubContract: read('data/command-hub-contract.json'),
  assetRegistry: read('data/asset-registry.json')
};

for (const [name, arr] of Object.entries(data)) {
  if(Array.isArray(arr)) arr.forEach(item => register(name, item, `data/${name}.json`));
}
register('project', data.project, 'data/project.json');
register('soloBattleStateSchema', data.soloBattleStateSchema, 'data/solo-battle-state-schema.json');
register('soloVerticalSlice', data.soloVerticalSlice, 'data/solo-vertical-slice.json');
register('asyncArenaSystem', data.asyncArenaSystem, 'data/async-arena-system.json');
register('endgameDashboard', data.endgameDashboard, 'data/endgame-dashboard.json');
register('commandHubContract', data.commandHubContract, 'data/command-hub-contract.json');
register('assetRegistry', data.assetRegistry, 'data/asset-registry.json');

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

if(data.factions.length !== 7) fail(`Expected 7 playable factions, found ${data.factions.length}`);
if(data.hollowThreatFaction.playable !== false || data.hollowThreatFaction.classification !== 'Hostile Threat Faction') fail('Hollow must remain a non-playable threat faction');
if(data.titans.length !== 63) fail(`Expected 63 Titans, found ${data.titans.length}`);

for (const titan of data.titans) {
  if(!factionIds.has(titan.factionId)) fail(`${titan.id}: invalid factionId ${titan.factionId}`);
  if(!promptIds.has(titan.artPromptId)) fail(`${titan.id}: missing prompt ${titan.artPromptId}`);
  if(titan.artworkId && !artworkIds.has(titan.artworkId)) fail(`${titan.id}: invalid artworkId ${titan.artworkId}`);
  for (const field of ['name','faction','rarity','role','lore','visualDescription','developmentStatus','backstoryId']) if(!titan[field]) fail(`${titan.id}: missing ${field}`);
  if(!backstoryIds.has(titan.backstoryId) || !backstoryEntityIds.has(titan.id)) fail(`${titan.id}: missing linked backstory ${titan.backstoryId}`);
}

for (const prompt of data.prompts) {
  if(prompt.category === 'Titan' && !titanIds.has(prompt.entityId)) fail(`${prompt.id}: invalid Titan entity ${prompt.entityId}`);
  if(prompt.category === 'NPC' && !npcIds.has(prompt.entityId)) fail(`${prompt.id}: invalid NPC entity ${prompt.entityId}`);
  if(prompt.category === 'Creature' && !creatureIds.has(prompt.entityId)) fail(`${prompt.id}: invalid creature entity ${prompt.entityId}`);
  if(prompt.category === 'Map' && !mapIds.has(prompt.entityId)) fail(`${prompt.id}: invalid map entity ${prompt.entityId}`);
  if(!exists(`art/prompts/${prompt.id}.json`)) fail(`${prompt.id}: missing per-prompt JSON file`);
  const per = read(`art/prompts/${prompt.id}.json`);
  if(per.id !== prompt.id || per.version < 1) fail(`${prompt.id}: invalid prompt file content`);
  if(!prompt.prompt || !prompt.negativePrompt) fail(`${prompt.id}: prompt text missing`);
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
  if(!exists(`creatures/${creature.id}.json`)) fail(`${creature.id}: missing individual creature file`);
}

for (const map of data.maps) {
  if(!campaignIds.has(map.campaignId)) fail(`${map.id}: invalid campaignId ${map.campaignId}`);
  if(!promptIds.has(map.artPromptId)) fail(`${map.id}: missing prompt ${map.artPromptId}`);
  if(!exists(`maps/${map.id}.json`)) fail(`${map.id}: missing individual map file`);
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
  if(!['Titan','NPC','Creature'].includes(backstory.entityType)) fail(`${backstory.id}: invalid entityType ${backstory.entityType}`);
  const validEntity = backstory.entityType === 'Titan' ? titanIds.has(backstory.entityId) : backstory.entityType === 'NPC' ? npcIds.has(backstory.entityId) : creatureIds.has(backstory.entityId);
  if(!validEntity) fail(`${backstory.id}: invalid entityId ${backstory.entityId}`);
  if(!backstory.shortBackstory || !Array.isArray(backstory.chapters) || backstory.chapters.length < 5) fail(`${backstory.id}: incomplete readable backstory`);
  if(!Array.isArray(backstory.storyArcIds) || !backstory.storyArcIds.length) fail(`${backstory.id}: missing story arc tie`);
  for (const arcId of backstory.storyArcIds) if(!storylineArcIds.has(arcId)) fail(`${backstory.id}: invalid story arc ${arcId}`);
  if(!Array.isArray(backstory.loreTies) || backstory.loreTies.length < 2) fail(`${backstory.id}: missing lore ties`);
  const folder = backstory.entityType === 'Titan' ? 'titans' : backstory.entityType === 'NPC' ? 'npcs' : 'creatures';
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
if(soloSchema.verticalSliceDefault.starterTitanId !== 'TG-TITAN-001') fail('Solo battle starter Titan must remain canonical Aten-Ra');
if(!titanIds.has(soloSchema.verticalSliceDefault.starterTitanId)) fail('Solo battle schema references invalid starter Titan');
for (const enemyId of soloSchema.verticalSliceDefault.starterEnemies || []) if(!creatureIds.has(enemyId)) fail(`Solo battle schema invalid starter enemy ${enemyId}`);
for (const reducer of ['createInitialSoloBattleState','applyTitanAction','revealEnemyIntents','resolveEnemyPhase','applyReaction','applyTerrainTick','evaluateObjectives']) if(!soloSchema.reducers.some(r => r.name === reducer)) fail(`Solo battle schema missing reducer ${reducer}`);
const soloSlice = data.soloVerticalSlice;
if(soloSlice.status !== 'IMPLEMENTED') fail('Solo vertical slice must be IMPLEMENTED');
if(soloSlice.faction?.id !== 'TG-FACTION-001') fail('Solo vertical slice must stay anchored to Aten Ra');
if(soloSlice.starterTitan?.id !== soloSchema.verticalSliceDefault.starterTitanId) fail('Solo vertical slice starter Titan mismatch');
if(!Array.isArray(soloSlice.missionTypes) || soloSlice.missionTypes.length !== 5) fail('Solo vertical slice must contain exactly five pre-boss mission types');
if(!soloSlice.bossEncounter || !Array.isArray(soloSlice.bossEncounter.phasePlan) || soloSlice.bossEncounter.phasePlan.length !== 5) fail('Solo vertical slice boss must contain five phases');
for (const mission of soloSlice.missionTypes) {
  for (const enemyId of mission.enemyIds || []) if(!creatureIds.has(enemyId)) fail(`${mission.id}: invalid solo slice enemy ${enemyId}`);
  for (const reducer of mission.requiredReducers || []) if(!soloSchema.reducers.some(r => r.name === reducer)) fail(`${mission.id}: invalid solo slice reducer ${reducer}`);
  for (const objectiveId of mission.objectiveIds || []) if(!(soloSlice.objectiveStateDefaults || []).some(o => o.id === objectiveId)) fail(`${mission.id}: missing solo slice objective default ${objectiveId}`);
}
if(!creatureIds.has(soloSlice.bossEncounter.enemyId)) fail('Solo vertical slice boss references invalid creature');
for (const objectiveId of soloSlice.bossEncounter.objectiveIds || []) if(!(soloSlice.objectiveStateDefaults || []).some(o => o.id === objectiveId)) fail(`Solo vertical slice boss objective missing ${objectiveId}`);
for (const gate of ['Exactly one active player Titan','Exactly five pre-boss mission types','Exactly one boss encounter with five readable phases']) if(!(soloSlice.qualityGates || []).includes(gate)) fail(`Solo vertical slice missing quality gate ${gate}`);
const soloEngine = fs.readFileSync(path.join(root,'game/solo-battle-engine.mjs'),'utf8');
for (const token of ['createInitialSoloBattleState','applyTitanAction','revealEnemyIntents','resolveEnemyPhase','applyReaction','applyTerrainTick','evaluateObjectives','runReducerScript']) if(!soloEngine.includes(`export function ${token}`)) fail(`Solo battle engine missing ${token}`);

const asyncArena = data.asyncArenaSystem;
if(asyncArena.status !== 'IMPLEMENTED') fail('Async arena snapshot model must be IMPLEMENTED');
if(asyncArena.mode !== 'ASYNCHRONOUS' || asyncArena.livePvpImplemented !== false || asyncArena.standardSquadSize !== 1) fail('Async arena must remain asynchronous one-Titan snapshot model');
if(!asyncArena.snapshotRules?.oneActiveDefenderTitan || !asyncArena.snapshotRules?.checksumRequired || asyncArena.snapshotRules?.noFabricatedProgression !== true) fail('Async arena snapshot rules incomplete');
if(!Array.isArray(asyncArena.defenseSnapshots) || asyncArena.defenseSnapshots.length !== asyncArena.sampleOpponents.length) fail('Async arena snapshot coverage mismatch');
for (const snap of asyncArena.defenseSnapshots) {
  if(!titanIds.has(snap.sourceTitanId)) fail(`${snap.snapshotId}: invalid sourceTitanId`);
  for (const field of asyncArena.defenseSnapshotFields) if(snap[field] === undefined || snap[field] === null || snap[field] === '') fail(`${snap.snapshotId}: missing snapshot field ${field}`);
  if(!Array.isArray(snap.stanceLoadout) || !snap.stanceLoadout.includes('Ascendant')) fail(`${snap.snapshotId}: incomplete stance loadout`);
  if(!Array.isArray(snap.reactionLoadout) || snap.reactionLoadout.length < 2) fail(`${snap.snapshotId}: incomplete reaction loadout`);
  if(!String(snap.checksum).startsWith('sha256:')) fail(`${snap.snapshotId}: checksum missing`);
}
if(data.endgameDashboard.sampleState && JSON.stringify(data.endgameDashboard.sampleState) !== '{}') fail('Endgame dashboard must not fabricate player progression');



for (const file of ['index.html','game/index.html','game/tactical-map-prototype.html','titan-gates-dev-platform.html']) if(!exists(file)) fail(`Missing required HTML file ${file}`);
const game = fs.readFileSync(path.join(root,'game/index.html'),'utf8');
const hubRuntime = fs.readFileSync(path.join(root,'game/command-hub-runtime.mjs'),'utf8');
if(!game.includes('OPEN THE TITAN GATE') || !game.includes('createCommandHubRuntime') || !game.includes('Command Hub')) fail('Playable Command Hub integrity check failed');
for (const token of ['BOOT_STAGES','validatePlayerState','getNextRecommendedAction','AssetManager','AudioManager','deriveNotifications','bottomNav','Titan Roster','Realm Network','Lore Registry','Playable Solo Battle','battleBasic','battleObjective','normalizeProgression','createRewardCache','claimReward','pendingRewards','rewardHistory']) if(!hubRuntime.includes(token)) fail(`Command Hub runtime missing ${token}`);
const browserBattle = fs.readFileSync(path.join(root,'game/browser-battle-engine.mjs'),'utf8');
for (const token of ['createBattleState','applyTitanAction','applyReaction','autoAdvanceEnemyTurn','summarizeBattle','chooseEnemyIntent','HOLLOW_SWARMER','GATEBORN_BRUTE','OBJECTIVE_CRUSH','enemyIntentCounts','ARCHETYPE_BUDGETS','resolveMissionScaling','scaleEnemyForMission','enemyScaling','threatBudget']) if(!browserBattle.includes(token)) fail(`Browser battle engine missing ${token}`);
const hub = data.commandHubContract;
if(hub.status !== 'IMPLEMENTED' || hub.canonFirst !== true) fail('Command Hub contract must be IMPLEMENTED and canon-first');
if(!Array.isArray(hub.startupPipeline) || hub.startupPipeline.length < 9 || hub.startupPipeline[0] !== 'BOOT' || !hub.startupPipeline.includes('MAIN_COMMAND_HUB')) fail('Command Hub startup pipeline incomplete');
if(!hub.defaultPlayerState?.selectedTitans?.every(id => titanIds.has(id))) fail('Command Hub default PlayerState references invalid Titan');
if(!missionIds.has(hub.defaultPlayerState?.campaignProgress?.currentMissionId)) fail('Command Hub default PlayerState references invalid mission');
if((hub.navigationTabs || []).length !== 5) fail('Command Hub must expose five bottom navigation sections');
if(!hub.qualityGates?.some(g => g.includes('BOOT -> LOAD -> HUB -> TITANS -> BACK -> BATTLE -> RETURN -> HUB'))) fail('Command Hub smoke quality gate missing');
const assetRegistry = data.assetRegistry;
if(assetRegistry.status !== 'IMPLEMENTED' || !Array.isArray(assetRegistry.assets) || assetRegistry.assets.length < data.factions.length * 3) fail('Command Hub asset registry incomplete');
for (const asset of assetRegistry.assets) {
  if(!asset.assetId || !asset.entityId || !asset.assetType || !asset.path || !asset.status || !asset.fallback) fail(`Invalid asset registry row ${asset.assetId || 'unknown'}`);
  if(!assetRegistry.assetStatuses.includes(asset.status)) fail(`${asset.assetId}: invalid asset status`);
}
const tactical = fs.readFileSync(path.join(root,'game/tactical-map-prototype.html'),'utf8');
for (const token of ['__TG_TACTICAL_MAP_READY__','const REALMS','const TITANS','function getMovableTiles','function enemyTurn','toggleCamera','realm-selector']) if(!tactical.includes(token)) fail(`Tactical prototype missing ${token}`);
if(!data.visualScreens.some(s => s.id === 'TG-SCREEN-TACTICAL-MAP-PROTOTYPE' && s.slug === 'tactical-map-prototype')) fail('Visual QA missing tactical map prototype screen');
const home = fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const token of ['Art Studio','Lore Codex','Directors','Copy Prompt','Game Preview','Visual QA','Tactical Map Prototype','data/${f}.json']) if(!home.includes(token)) fail(`Dashboard missing ${token}`);

console.log(JSON.stringify({ok:true, ids:ids.size, factions:data.factions.length, titans:data.titans.length, npcs:data.npcs.length, creatures:data.creatures.length, hollowCreatures:hollowCreatureIds.length, maps:data.maps.length, campaigns:data.campaigns.length, chapters:data.chapters.length, prompts:data.prompts.length, backstories:data.backstories.length, tasks:data.tasks.length, visualScreens:data.visualScreens.length, visualRules:data.visualChangeRules.length, realmCodex:data.realmCodex.length, hybridLayers:data.hybridVisualArchitecture.visualLayers.length, assetTypes:data.assetPipeline.assetTypes.length, missions:data.missions.length, missionDialogue:data.missionDialogue.length, missionArtPackages:data.missionArtPackages.length, githubSync:data.githubSyncStatus.status, soloBattleSchema:data.soloBattleStateSchema.status, soloVerticalSlice:data.soloVerticalSlice.status, asyncArena:data.asyncArenaSystem.status, commandHub:data.commandHubContract.status}, null, 2));
