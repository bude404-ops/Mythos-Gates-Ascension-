import fs from 'node:fs';

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const economy = read('data/free-to-play-economy.json');
const migration = read('data/economy-migration-audit.json');
const monetization = read('data/monetization-policy.json');
const progression = read('data/progression-system.json');
const commandHub = read('data/command-hub-contract.json');
const rewardSystem = read('data/reward-system.json');
const season = read('data/season-system.json');
const runtime = fs.readFileSync('game/economy-runtime.mjs', 'utf8');
const panel = fs.readFileSync('mini-app/mythos-gates-ascension.html', 'utf8');
const issues = [];
const warnings = [];
const push = (arr, code, detail) => arr.push({ code, detail });

if (economy.philosophy.businessModel !== 'FREE_TO_PLAY') push(issues, 'NOT_FREE_TO_PLAY', 'Business model must be free-to-play.');
if (!economy.philosophy.freePlayerPromise?.includes('Campaign playable')) push(issues, 'FREE_CAMPAIGN_PROMISE_MISSING', 'Campaign must be playable for free.');
if (economy.deityUnlocking?.allDeitiesGameplayObtainable !== true) push(issues, 'TITANS_NOT_EARNABLE', 'All deities must remain gameplay obtainable.');
if (economy.deityPower?.directPowerSales !== false) push(issues, 'DIRECT_POWER_SALES', 'Direct combat power sales are forbidden.');
if (economy.cosmetics?.noCombatStats !== true) push(issues, 'COSMETIC_STATS_FOUND', 'Cosmetics must not grant combat stats.');
if (economy.rewardedAds?.forcedAds !== false) push(issues, 'FORCED_ADS', 'Ads must be optional only.');
if (economy.environment?.productionPaymentsConnected !== false) push(warnings, 'PAYMENTS_MARKED_CONNECTED', 'Real payments should not be connected until provider exists.');
if (economy.purchaseArchitecture?.verification !== 'SERVER_SIDE_REQUIRED_FOR_PRODUCTION') push(issues, 'SERVER_VERIFY_MISSING', 'Production purchases require server-side verification.');
if (!economy.antiExploit?.detect?.includes('duplicate purchases')) push(issues, 'DUP_PURCHASE_DETECT_MISSING', 'Duplicate purchase detection required.');

const requiredCurrencies = ['GOLD', 'PREMIUM_CURRENCY', 'SHARDS'];
for (const key of requiredCurrencies) if (!economy.coreCurrencies?.[key]) push(issues, 'CORE_CURRENCY_MISSING', `${key} missing.`);
if ((economy.coreCurrencies?.PREMIUM_CURRENCY?.earnable || '').toString().toUpperCase() !== 'LIMITED') push(issues, 'PREMIUM_NOT_EARNABLE_LIMITED', 'Premium currency must be earnable in limited gameplay amounts.');
if (!economy.energy?.maxEnergy || !economy.energy?.regenIntervalSeconds || !economy.energy?.costs?.campaign) push(issues, 'ENERGY_CONFIG_INCOMPLETE', 'Energy cap, regen, and campaign cost must be configurable.');
if (economy.energy?.refill?.dailyPaidRefillLimit > 6) push(warnings, 'ENERGY_REFILL_LIMIT_HIGH', 'Paid refill daily limit may be too high.');

const refs = [monetization.centralEconomyRef, progression.centralEconomyRef, commandHub.centralEconomyRef, rewardSystem.centralEconomyRef, season.centralEconomyRef];
if (refs.some((r) => r !== 'data/free-to-play-economy.json')) push(issues, 'SYSTEM_NOT_CONSOLIDATED', 'Existing economy-bearing systems must point to unified economy config.');
if (!migration.findings || migration.findings.length < 10) push(issues, 'AUDIT_REPORT_TOO_SMALL', 'Migration audit must cover the requested economy systems.');
if (!commandHub.defaultPlayerState?.economy?.wallets) push(issues, 'PLAYER_ECONOMY_STATE_MISSING', 'Command hub default player state must include economy wallets.');

for (const fn of ['addCurrency','spendCurrency','grantReward','consumeEnergy','regenerateEnergy','unlockDeity','purchaseItem','claimDailyReward']) {
  if (!runtime.includes(`function ${fn}`)) push(issues, 'RUNTIME_FUNCTION_MISSING', `${fn} missing from central economy runtime.`);
}
if (!runtime.includes('SERVER_VERIFICATION_REQUIRED')) push(issues, 'RUNTIME_VERIFY_MISSING', 'Runtime must block production purchases without verification.');
if (!runtime.includes('duplicate')) push(issues, 'IDEMPOTENCY_MISSING', 'Runtime must handle duplicate claims or purchases safely.');
if (!panel.includes('Economy Lab') || !panel.includes('FREE PLAYERS GET THE GAME')) push(issues, 'PANEL_ECONOMY_LAB_MISSING', 'Panel must expose F2P Economy Lab without centering store.');

const productTypes = new Set((economy.purchaseArchitecture?.productCatalog || []).map((p) => p.PRODUCT_TYPE));
for (const type of ['ENERGY','SHARDS','BATTLE_PASS','COSMETIC']) if (!productTypes.has(type)) push(issues, 'SHOP_CATEGORY_PRODUCT_MISSING', `${type} product missing.`);
if ((economy.purchaseArchitecture?.productCatalog || []).some((p) => p.REWARD?.power || p.REWARD?.combatStats)) push(issues, 'PRODUCT_GRANTS_POWER', 'Shop product grants combat stats/power.');

const ok = issues.length === 0;
console.log(JSON.stringify({ ok, issueCount: issues.length, warningCount: warnings.length, checked: { currencies: Object.keys(economy.coreCurrencies||{}).length, products: economy.purchaseArchitecture.productCatalog.length, dailyRewards: economy.dailyRewards.freeTrack.length, migrationFindings: migration.findings.length, runtimeFunctions: 8 }, issues, warnings }, null, 2));
if (!ok) process.exit(1);
