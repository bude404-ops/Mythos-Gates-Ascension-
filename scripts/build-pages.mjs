import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const include = [
  'index.html',
  'titan-gates-dev-platform.html',
  'game',
  'mini-app',
  'data',
  'docs',
  'art',
  'artwork_import',
  'dev',
  'visual',
  'assets',
  'asset_registry',
  'blueprints',
  'manifests',
  'handoff',
  'validation',
  'tools',
  'scripts',
  '3D_Blueprints',
  'README.md'
];

function copy(src, dest){
  const st = fs.statSync(src);
  if(st.isDirectory()){
    fs.mkdirSync(dest, {recursive:true});
    for(const child of fs.readdirSync(src)) copy(path.join(src, child), path.join(dest, child));
  } else {
    fs.mkdirSync(path.dirname(dest), {recursive:true});
    fs.copyFileSync(src, dest);
  }
}

for(const rel of include){
  const src=path.join(root, rel);
  if(fs.existsSync(src)) copy(src, path.join(dist, rel));
}

fs.writeFileSync(path.join(dist,'.nojekyll'), '');
const required=['index.html','game/index.html','game/preview.html','game/shared-preview.js','game/tactical-map-prototype.html','mini-app/mythos-gates-ascension.html','data/index.json','data/titans.json','data/dialogue-scripts.json','data/visual-screens.json','data/realm-codex.json','data/faction-visual-bible.json','data/hybrid-visual-architecture.json','data/asset-pipeline.json','data/art-approval-manifest.json','data/github-sync-policy.json','data/github-sync-status.json','data/change-history.json','data/continuity-balance-audit.json','data/gameplay-balance-framework.json','data/combat-first-gameplay-doctrine.json','data/economy-migration-audit.json','data/free-to-play-economy.json','data/monetization-policy.json','data/progression-system.json','data/reward-system.json','data/season-system.json','data/solo-battle-state-schema.json','data/solo-vertical-slice.json','data/battlefield-telemetry-contract.json','data/campaign-playflow-contract.json','data/async-arena-system.json','data/deity-trial-system.json','data/mission-tactical-profile-system.json','data/enemy-archetype-registry.json','data/art-director-scale-sheets.json','data/command-hub-contract.json','data/asset-registry.json','data/3d-blueprint-system.json','data/3d-production-queue.json','data/mythos-gates-dungeon-route-registry.json','3D_Blueprints/Registry/blueprint-registry.json','3D_Blueprints/Global_References/Master_Scale_Reference/metadata.json','game/solo-battle-engine.mjs','game/economy-runtime.mjs','docs/lore/README.md','docs/GITHUB_ASSET_REPOSITORY.md','manifests/assets/ASSET_MANIFEST_TEMPLATE.json','asset_registry/asset-dependency-graph.json','asset_registry/github-asset-registry.json','data/github-asset-repository.json','scripts/test-github-asset-intake.mjs','artwork_import/ARTWORK_BUILD_QUEUE.md','artwork_import/ARTWORK_BUILD_QUEUE.json','artwork_import/MISSION_ARTWORK_GENERATION_RUNTHROUGH.md','artwork_import/mission-artwork-generation-bundles.json','artwork_import/dropbox/README.md','scripts/generate-artwork-build-queue.mjs','scripts/import-artwork-dropbox.mjs','scripts/validate-external-ai-packets.mjs','handoff/external_ai/BATTLEFIELD_001_the-first-reopening-gate.external-ai-packet.md','handoff/external_ai/BATTLEFIELD_001_the-first-reopening-gate.external-ai-packet.json'];
for(const rel of required){
  if(!fs.existsSync(path.join(dist, rel))) throw new Error(`Build missing ${rel}`);
}
console.log(JSON.stringify({ok:true, dist, files: required}, null, 2));


