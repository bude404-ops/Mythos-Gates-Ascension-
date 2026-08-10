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
  'data',
  'docs',
  'art',
  'dev',
  'visual',
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
const required=['index.html','game/index.html','game/preview.html','game/shared-preview.js','data/index.json','data/titans.json','data/visual-screens.json','data/realm-codex.json','docs/lore/README.md'];
for(const rel of required){
  if(!fs.existsSync(path.join(dist, rel))) throw new Error(`Build missing ${rel}`);
}
console.log(JSON.stringify({ok:true, dist, files: required}, null, 2));
