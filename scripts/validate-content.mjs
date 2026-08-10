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
  maps: read('data/maps.json'),
  campaigns: read('data/campaigns.json'),
  chapters: read('data/chapters.json'),
  visualScreens: read('data/visual-screens.json'),
  visualChangeRules: read('data/visual-change-rules.json'),
  visualBaselines: read('data/visual-baselines.json'),
  index: read('data/index.json')
};

for (const [name, arr] of Object.entries(data)) {
  if(Array.isArray(arr)) arr.forEach(item => register(name, item, `data/${name}.json`));
}
register('project', data.project, 'data/project.json');

const factionIds = new Set(data.factions.map(f => f.id));
const titanIds = new Set(data.titans.map(t => t.id));
const promptIds = new Set(data.prompts.map(p => p.id));
const artworkIds = new Set(data.artworks.map(a => a.id));
const npcIds = new Set(data.npcs.map(n => n.id));
const creatureIds = new Set(data.creatures.map(c => c.id));
const mapIds = new Set(data.maps.map(m => m.id));
const campaignIds = new Set(data.campaigns.map(c => c.id));
const chapterIds = new Set(data.chapters.map(c => c.id));
const visualScreenIds = new Set(data.visualScreens.map(s => s.id));

if(data.factions.length !== 7) fail(`Expected 7 factions, found ${data.factions.length}`);
if(data.titans.length !== 63) fail(`Expected 63 Titans, found ${data.titans.length}`);

for (const titan of data.titans) {
  if(!factionIds.has(titan.factionId)) fail(`${titan.id}: invalid factionId ${titan.factionId}`);
  if(!promptIds.has(titan.artPromptId)) fail(`${titan.id}: missing prompt ${titan.artPromptId}`);
  if(titan.artworkId && !artworkIds.has(titan.artworkId)) fail(`${titan.id}: invalid artworkId ${titan.artworkId}`);
  for (const field of ['name','faction','rarity','role','lore','visualDescription','developmentStatus']) if(!titan[field]) fail(`${titan.id}: missing ${field}`);
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
  if(!exists(`npcs/${npc.id}.json`)) fail(`${npc.id}: missing individual NPC file`);
}

for (const creature of data.creatures) {
  if(creature.playable !== false) fail(`${creature.id}: creature must be non-playable`);
  if(!promptIds.has(creature.artPromptId)) fail(`${creature.id}: missing prompt ${creature.artPromptId}`);
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

for (const file of ['index.html','game/index.html','titan-gates-dev-platform.html']) if(!exists(file)) fail(`Missing required HTML file ${file}`);
const game = fs.readFileSync(path.join(root,'game/index.html'),'utf8');
if(!game.includes('OPEN THE TITAN GATE') || !game.includes('function enemyTurn')) fail('Playable game integrity check failed');
const home = fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const token of ['Art Studio','Lore Codex','Directors','Copy Prompt','Game Preview','Visual QA','data/${f}.json']) if(!home.includes(token)) fail(`Dashboard missing ${token}`);

console.log(JSON.stringify({ok:true, ids:ids.size, factions:data.factions.length, titans:data.titans.length, npcs:data.npcs.length, creatures:data.creatures.length, maps:data.maps.length, campaigns:data.campaigns.length, chapters:data.chapters.length, prompts:data.prompts.length, tasks:data.tasks.length, visualScreens:data.visualScreens.length, visualRules:data.visualChangeRules.length}, null, 2));
