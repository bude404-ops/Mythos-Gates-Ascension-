export const productionGateManifest = Object.freeze({
  sourceModules: [
    'src/gameplay/solo-battle/index.mjs',
    'src/gameplay/economy/index.mjs',
    'src/platform/platform-core.mjs',
    'src/platform/backend-boundary.mjs',
    'src/platform/runtime-persistence.mjs',
    'src/combat/one-titan-vs-many.mjs',
    'src/lore/cross-faction-run-ins.mjs',
    'src/platform/runtime-persistence.sql',
    'src/data-loaders/content-loader.mjs',
    'src/data-loaders/schema-contracts.mjs',
    'src/ui/state-presenters.mjs'
  ],
  validationScripts: [
    'scripts/audit-aaa-structure.mjs',
    'scripts/validate-schema-contracts.mjs',
    'tests/production-module-contract.test.mjs'
  ],
  protectedRuntimePrinciples: [
    'one active titan standard combat',
    'browser shell remains presentation only',
    'canonical JSON contracts validate before deploy',
    'generated dist output is not canonical source'
  ]
});
