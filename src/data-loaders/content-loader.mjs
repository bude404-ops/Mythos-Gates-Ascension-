import fs from 'node:fs';
import path from 'node:path';

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function listJsonRecords(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath, { withFileTypes: true })
    .flatMap(entry => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) return listJsonRecords(fullPath);
      return entry.isFile() && entry.name.endsWith('.json') ? [fullPath] : [];
    })
    .sort();
}

export function loadSourceDataset({ root = '.', includeMissions = true } = {}) {
  const at = relative => path.join(root, relative);
  return {
    deities: readJson(at('data/deitys.json')),
    creatures: readJson(at('data/creatures.json')),
    campaigns: readJson(at('data/campaigns.json')),
    maps: readJson(at('data/maps.json')),
    missions: includeMissions
      ? [...listJsonRecords(at('missions/normal')), ...listJsonRecords(at('missions/elite'))].map(file => readJson(file))
      : []
  };
}

export function buildContentLookup(dataset) {
  const byId = records => new Map(records.map(record => [record.id, record]));
  return {
    deityById: byId(dataset.deities || []),
    creatureById: byId(dataset.creatures || []),
    campaignById: byId(dataset.campaigns || []),
    mapById: byId(dataset.maps || []),
    missionById: byId(dataset.missions || [])
  };
}
