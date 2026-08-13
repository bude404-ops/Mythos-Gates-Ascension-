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
  weeklyTrials: read('data/weekly-trials.json'),
  raidSystem: read('data/raid-system.json'),
  titanTrialSystem: read('data/titan-trial-system.json'),
  missionTacticalProfileSystem: read('data/mission-tactical-profile-system.json'),
  enemyArchetypeRegistry: read('data/enemy-archetype-registry.json'),
  endgameDashboard: read('data/endgame-dashboard.json'),
  commandHubContract: read('data/command-hub-contract.json'),
  assetRegistry: read('data/asset-registry.json'),
  worldScaleReference: read('data/world-scale-reference.json'),
  artDirectorScaleSheets: read('data/art-director-scale-sheets.json'),
  battlefieldRuntimeArchitecture: read('data/battlefield-runtime-architecture.json'),
  battlefieldVerticalSlice: read('data/battlefield-vertical-slice.json')
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
register('titanTrialSystem', data.titanTrialSystem, 'data/titan-trial-system.json');
register('missionTacticalProfileSystem', data.missionTacticalProfileSystem, 'data/mission-tactical-profile-system.json');
register('enemyArchetypeRegistry', data.enemyArchetypeRegistry, 'data/enemy-archetype-registry.json');
register('endgameDashboard', data.endgameDashboard, 'data/endgame-dashboard.json');
register('commandHubContract', data.commandHubContract, 'data/command-hub-contract.json');
register('assetRegistry', data.assetRegistry, 'data/asset-registry.json');
register('worldScaleReference', data.worldScaleReference, 'data/world-scale-reference.json');
register('artDirectorScaleSheets', data.artDirectorScaleSheets, 'data/art-director-scale-sheets.json');
register('battlefieldRuntimeArchitecture', data.battlefieldRuntimeArchitecture, 'data/battlefield-runtime-architecture.json');
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
const allowedTitanRoles = new Set(data.titans.map(t => t.role));
const missionTagCounts = new Map();
const missionRoleCounts = new Map();
const enemyArchetypeKeys = new Set((data.enemyArchetypeRegistry.archetypes || []).map(a => a.key));
const difficultyBudgetTiers = new Set((data.enemyArchetypeRegistry.difficultyBudgets || []).map(b => b.tier));
const requiredScaleSheetTypes = new Set(['normal_enemy','elite_enemy','player_titan','titan_scale_enemy','colossal_boss','titan_gate','architecture','battlefield_object']);

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
  for (const role of tactical.advantageRoles) if(!allowedTitanRoles.has(role)) fail(`${mission.id}: invalid advantage role ${role}`);
  for (const role of tactical.advantageRoles) missionRoleCounts.set(role, (missionRoleCounts.get(role) || 0) + 1);
  if(!Array.isArray(tactical.recommendedTitanIds) || tactical.recommendedTitanIds.length < 1) fail(`${mission.id}: tacticalProfile needs recommendedTitanIds`);
  for (const id of tactical.recommendedTitanIds) if(!titanIds.has(id)) fail(`${mission.id}: invalid recommended Titan ${id}`);
  if(tactical.ownershipLock !== false || tactical.favoredNotRequired !== true) fail(`${mission.id}: tacticalProfile must stay favored-not-required with no ownership lock`);
  if(!String(tactical.rule||'').includes('any valid active Titan')) fail(`${mission.id}: tactical rule must explain no hard requirement`);
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
for (const token of ['BOOT_STAGES','validatePlayerState','getNextRecommendedAction','AssetManager','AudioManager','deriveNotifications','bottomNav','Titan Roster','Realm Network','Lore Registry','Playable Solo Battle','battleBasic','battleObjective','normalizeProgression','createRewardCache','claimReward','pendingRewards','rewardHistory','STARTER_TITAN_IDS','AWAKENING_BEATS','completeAwakeningBeat','awakeningProgress','starterTitans','ensureOnboarding','Awakening Protocol','chooseStarter','advanceAwakeningBeat','finishAwakening','TRIAL_TITAN_IDS','TRIAL_MODES','trialTitans','ensureTrials','createTrialAttempt','resolveTrialAttempt','trialsScreen','startTrial','finishTrial','Trial Favor','Temporary Loadout','borrowed gear does not','raidProgress','raidRules','stageProfiles','problemTags','preferredCounters','carryRisk','tierCaps','approachRules','createRaidAttempt','resolveRaidStage','completeRaidAttempt','resolveRaidEconomy','applyRaidMastery','Raid Tokens','Signature Alloy','Mastery Seals','raidScreen','startRaid','raidResolve','raidClaim','The Gate Warden']) if(!hubRuntime.includes(token)) fail(`Command Hub runtime missing ${token}`);
const browserBattle = fs.readFileSync(path.join(root,'game/browser-battle-engine.mjs'),'utf8');
for (const token of ['createBattleState','applyTitanAction','applyReaction','autoAdvanceEnemyTurn','summarizeBattle','chooseEnemyIntent','HOLLOW_SWARMER','GATEBORN_BRUTE','OBJECTIVE_CRUSH','enemyIntentCounts','enemyBehaviorTags','enemyCounterplay','behaviorTag','counterplay','ISOLATION_PUNISH','OBJECTIVE_DENIAL','ARCHETYPE_BUDGETS','resolveMissionScaling','scaleEnemyForMission','enemyScaling','threatBudget']) if(!browserBattle.includes(token)) fail(`Browser battle engine missing ${token}`);
const battlefieldRuntime = fs.readFileSync(path.join(root,'game/battlefield-runtime.mjs'),'utf8');
for (const token of ['createBattlefieldRuntimeState','buildBattlefieldTerrain','createBattlefieldObjectives','createBattlefieldEnemyRoster','applyBattlefieldAction','applyBattlefieldInteraction','endBattlefieldRound','advanceBattlefieldBossPhase','summarizeBattlefieldRuntime','runBattlefieldScript']) if(!battlefieldRuntime.includes(token)) fail(`Battlefield runtime missing ${token}`);
if(data.battlefieldRuntimeArchitecture.status !== 'IMPLEMENTED' || data.battlefieldRuntimeArchitecture.taskId !== 'TG-DEV-029') fail('Battlefield runtime architecture must be implemented for TG-DEV-029');
if(data.battlefieldRuntimeArchitecture.productionSlice !== data.battlefieldVerticalSlice.id) fail('Battlefield runtime architecture production slice mismatch');
for (const target of ['one active Titan','49 meaningful spaces','interactive terrain','boss phases','mobile bottom action bar','camera modes']) if(!data.battlefieldVerticalSlice.qualityTargets.includes(target)) fail(`Battlefield vertical slice missing quality target ${target}`);
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
for (const forbidden of ['livePvP','paidPowerShortcut','hiddenRandomRolls','multiTitanSquadControl','uncappedReplayRewards']) if(!raidSystem.forbiddenInitialScope?.includes(forbidden)) fail(`Raid forbidden scope missing ${forbidden}`);
if(raidSystem.economyTuning?.status !== 'IMPLEMENTED') fail('Raid economy tuning must be IMPLEMENTED');
for (const q of ['S','A','B','C']) {
  const row = raidSystem.economyTuning?.qualityRewardTable?.[q];
  if(!row || !row.tokenBase || !row.signatureAlloy || !row.masteryXpScalar || !row.gearMaterialBand) fail(`Raid economy quality table missing ${q}`);
}
if(raidSystem.economyTuning.firstClear?.tokenBonus !== 8 || raidSystem.economyTuning.firstClear?.masterySeals !== 1) fail('Raid first-clear economy tuning invalid');
if(raidSystem.economyTuning.replay?.payoutScalar >= 0.5 || raidSystem.economyTuning.replay?.minReplayTokens < 1) fail('Raid replay scalar/cap tuning invalid');
for (const tier of ['RAID_NORMAL','RAID_HARD','RAID_ELITE','RAID_ASCENDED','RAID_MYTHIC']) if(!raidSystem.economyTuning.weeklyReplayTokenCaps?.[tier]) fail(`Raid economy weekly cap missing ${tier}`);
for (const rule of ['Paid power shortcuts are forbidden.','Replay payout is capped and decays by weekly clear count.','Mastery credit applies only to the one active Titan used in the clear.']) if(!raidSystem.economyTuning.antiPayToWinRules?.includes(rule)) fail(`Raid anti-pay-to-win rule missing: ${rule}`);
if(!raidSystem.acceptanceGates?.some(g => g.includes('TG-DEV-025 raid economy tuning is IMPLEMENTED'))) fail('Raid economy acceptance gate missing TG-DEV-025');

if(hub.onboardingFlow?.status !== 'IMPLEMENTED' || hub.onboardingFlow?.taskId !== 'TG-DEV-026') fail('TG-DEV-026 onboarding flow must be implemented');
if(!Array.isArray(hub.onboardingFlow.starterTitanIds) || hub.onboardingFlow.starterTitanIds.length !== 3) fail('TG-DEV-026 requires exactly three starter Titans');
for (const id of hub.onboardingFlow.starterTitanIds) if(!titanIds.has(id)) fail(`TG-DEV-026 invalid starter Titan ${id}`);
if(hub.onboardingFlow.beatCount !== 12 || hub.onboardingFlow.fullRosterHiddenUntilComplete !== true) fail('TG-DEV-026 onboarding beat/roster guardrail invalid');
for (const rule of ['Starter choice is canon-safe and limited to three roles.','Full roster is hidden during onboarding to prevent roster flood.','Second Titan desire is created through trials and story, not mandatory purchase pressure.']) if(!hub.onboardingFlow.antiPayToWinRules?.includes(rule)) fail(`TG-DEV-026 onboarding rule missing: ${rule}`);
if(!hub.qualityGates?.some(g => g.includes('TG-DEV-026 Awakening onboarding'))) fail('Command Hub quality gate missing TG-DEV-026');
const trialSystem = data.titanTrialSystem;
if(trialSystem.status !== 'IMPLEMENTED' || trialSystem.taskId !== 'TG-DEV-027') fail('Titan Trial system must complete TG-DEV-027');
if(!Array.isArray(trialSystem.trialTitanIds) || trialSystem.trialTitanIds.length < 3) fail('TG-DEV-027 requires at least three showcase Titans');
for (const id of trialSystem.trialTitanIds) if(!titanIds.has(id)) fail(`TG-DEV-027 invalid trial Titan ${id}`);
if(!Array.isArray(trialSystem.trialModes) || trialSystem.trialModes.length !== 3) fail('TG-DEV-027 must define three trial modes');
for (const mode of trialSystem.trialModes) if(!mode.id || !mode.label || !mode.rule || !Array.isArray(mode.scoreFocus) || mode.scoreFocus.length < 2) fail(`TG-DEV-027 trial mode incomplete: ${mode.id || 'unknown'}`);
if(!String(trialSystem.activeTitanRule || '').includes('one temporary Titan')) fail('TG-DEV-027 one temporary Titan rule missing');
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
for (const role of tacticalProfileSystem.allowedTitanRoles || []) if(!allowedTitanRoles.has(role)) fail(`TG-DEV-028 invalid allowed role ${role}`);
for (const tag of allowedMissionProblemTags) if((missionTagCounts.get(tag) || 0) < 1) fail(`TG-DEV-028 tag has no mission coverage: ${tag}`);
for (const role of allowedTitanRoles) if((missionRoleCounts.get(role) || 0) < 1) fail(`TG-DEV-028 Titan role has no mission recommendation coverage: ${role}`);
for (const rule of ['Mission tactical profiles may recommend roles and Titans, but never require ownership.','Every tagged mission must keep ownershipLock=false and favoredNotRequired=true.']) if(!tacticalProfileSystem.antiPayToWinRules?.includes(rule)) fail(`TG-DEV-028 rule missing: ${rule}`);
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
const scaleSheets = data.artDirectorScaleSheets;
if(scaleSheets.status !== 'IMPLEMENTED' || scaleSheets.taskId !== 'TG-DEV-030') fail('Art Director scale sheets must complete TG-DEV-030');
if(scaleSheets.coverage?.implemented !== 8 || scaleSheets.coverage?.missing?.length !== 0) fail('TG-DEV-030 scale sheet coverage mismatch');
const implementedScaleSheetTypes = new Set((scaleSheets.sheets || []).map(sheet => sheet.type));
for (const type of requiredScaleSheetTypes) if(!implementedScaleSheetTypes.has(type)) fail(`TG-DEV-030 missing scale sheet type ${type}`);
for (const sheet of scaleSheets.sheets || []) {
  if(!sheet.id || !sheet.title || !sheet.primarySubject || !sheet.composition || !sheet.camera) fail(`TG-DEV-030 incomplete scale sheet ${sheet.id || 'unknown'}`);
  if(typeof sheet.ratioToTitan !== 'number' || sheet.ratioToTitan <= 0) fail(`${sheet.id}: invalid ratioToTitan`);
  if(!Array.isArray(sheet.compareAgainst) || sheet.compareAgainst.length < 3) fail(`${sheet.id}: compareAgainst too thin`);
  if(!Array.isArray(sheet.promptOverlay) || sheet.promptOverlay.length < 3) fail(`${sheet.id}: prompt overlay too thin`);
  if(!Array.isArray(sheet.qaChecks) || sheet.qaChecks.length < 3) fail(`${sheet.id}: QA checks too thin`);
}
for (const rule of ['Never shrink Titans to solve composition; enlarge Gates, architecture, and battlefield space instead.','Terrain and hazards must be physical art features, never neon board-game overlays.']) if(!scaleSheets.globalRules?.includes(rule)) fail(`TG-DEV-030 global rule missing: ${rule}`);
if(hub.artDirectorScaleSheets?.status !== 'IMPLEMENTED' || hub.artDirectorScaleSheets?.taskId !== 'TG-DEV-030') fail('Command Hub art scale summary must implement TG-DEV-030');
if(!hub.qualityGates?.some(g => g.includes('TG-DEV-030 all 8 Art Director scale sheet types'))) fail('Command Hub quality gate missing TG-DEV-030');
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

console.log(JSON.stringify({ok:true, ids:ids.size, factions:data.factions.length, titans:data.titans.length, npcs:data.npcs.length, creatures:data.creatures.length, hollowCreatures:hollowCreatureIds.length, maps:data.maps.length, campaigns:data.campaigns.length, chapters:data.chapters.length, prompts:data.prompts.length, backstories:data.backstories.length, tasks:data.tasks.length, visualScreens:data.visualScreens.length, visualRules:data.visualChangeRules.length, realmCodex:data.realmCodex.length, hybridLayers:data.hybridVisualArchitecture.visualLayers.length, assetTypes:data.assetPipeline.assetTypes.length, missions:data.missions.length, missionDialogue:data.missionDialogue.length, missionArtPackages:data.missionArtPackages.length, githubSync:data.githubSyncStatus.status, soloBattleSchema:data.soloBattleStateSchema.status, soloVerticalSlice:data.soloVerticalSlice.status, asyncArena:data.asyncArenaSystem.status, commandHub:data.commandHubContract.status, battlefieldRuntime:data.battlefieldRuntimeArchitecture.status}, null, 2));
