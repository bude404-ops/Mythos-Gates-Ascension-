import fs from 'node:fs';
import { validateContract } from '../src/data-loaders/schema-contracts.mjs';
import { loadSourceDataset } from '../src/data-loaders/index.mjs';
import { loadUe5DungeonFramework, loadFirstMissionZoneTemplate, validateUe5DungeonFramework, ue5DungeonSummary } from '../engine/unreal/ue5-dungeon-framework.mjs';

const framework = loadUe5DungeonFramework();
const template = loadFirstMissionZoneTemplate();
const frameworkSchema = JSON.parse(fs.readFileSync('schemas/ue5-dungeon-framework.schema.json', 'utf8'));
const templateSchema = JSON.parse(fs.readFileSync('schemas/ue5-first-mission-zone-template.schema.json', 'utf8'));
const dataset = loadSourceDataset({ includeMissions: true });
const sourceMission = dataset.missions.find(row => row.id === 'TG-F01-C01-M01');
const sourceFaction = JSON.parse(fs.readFileSync('data/factions.json', 'utf8')).find(row => row.id === 'TG-FACTION-001');
const issues = [];
issues.push(...validateContract(framework, frameworkSchema, framework.id).issues);
issues.push(...validateContract(template, templateSchema, template.id).issues);
issues.push(...validateUe5DungeonFramework(framework, template, sourceMission, sourceFaction).issues);
const result = { ok: issues.length === 0, ue5DungeonFramework: issues.length === 0 ? 'PASS' : 'FAIL', summary: ue5DungeonSummary(framework, template), issues };
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
