const esc = value => String(value ?? '').replace(/[&<>"']/g, match => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[match]));

const toneForCorruption = level => {
  const key = String(level || '').toUpperCase();
  if (key === 'LOW') return 'bg-bull-950 text-bull-400 border-bull-500/30';
  if (key === 'HIGH') return 'bg-bear-950 text-bear-400 border-bear-500/30';
  return 'bg-yellow-950 text-yellow-400 border-yellow-500/30';
};

const badge = (text, tone = 'primary') => {
  const cls = tone === 'ok'
    ? 'bg-bull-950 text-bull-400 border-bull-500/30'
    : tone === 'bad'
      ? 'bg-bear-950 text-bear-400 border-bear-500/30'
      : 'bg-primary/15 text-primary border-primary/25';
  return `<span class="rounded-full border ${cls} px-3 py-1 text-xs font-black uppercase tracking-[.12em]">${esc(text)}</span>`;
};

function metric(label, value) {
  return `<div class="rounded-2xl border border-neutral-800 bg-neutral-950 p-3">
    <p class="text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">${esc(label)}</p>
    <b class="mt-1 block text-lg text-neutral-50">${esc(value)}</b>
  </div>`;
}

function listBlock(title, rows = [], tone = 'primary') {
  const items = rows.length
    ? rows.map(row => `<li class="rounded-2xl bg-neutral-950 p-3 text-sm text-neutral-300">${esc(row)}</li>`).join('')
    : '<li class="rounded-2xl bg-neutral-950 p-3 text-sm text-neutral-500">No canon entry yet.</li>';
  return `<section class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4">
    <p class="text-xs font-black uppercase tracking-[.22em] ${tone === 'bad' ? 'text-bear-400' : 'text-primary'}">${esc(title)}</p>
    <ul class="mt-3 space-y-2">${items}</ul>
  </section>`;
}

function readinessGrid(viewReadiness = {}) {
  const rows = Object.entries(viewReadiness).map(([name, status]) => `
    <div class="rounded-2xl border border-neutral-800 bg-neutral-950 p-3">
      <p class="text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">${esc(name.replace(/View$/, ' View'))}</p>
      <b class="mt-1 block text-sm text-bull-400">${esc(String(status).replaceAll('_', ' '))}</b>
    </div>`).join('');
  return rows || '<p class="rounded-2xl bg-neutral-950 p-3 text-sm text-neutral-500">No view readiness flags registered.</p>';
}

function battlefieldCard(battlefield, index) {
  const readinessCount = Object.values(battlefield.viewReadiness || {}).filter(v => String(v).includes('READY')).length;
  const corruptionTone = toneForCorruption(battlefield.hollowCorruptionLevel);
  return `<article class="rounded-[2rem] border border-neutral-800 bg-neutral-900 p-4 shadow-dark-outline">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-xs font-black uppercase tracking-[.24em] text-primary">${esc(battlefield.mapId || `MAP-${index + 1}`)} · ${esc(battlefield.battlefieldClass)}</p>
        <h3 class="mt-1 text-2xl font-black leading-none text-neutral-50">${esc(battlefield.name)}</h3>
        <p class="mt-2 text-sm text-neutral-300">${esc(battlefield.canonDescription)}</p>
      </div>
      <span class="rounded-full border ${corruptionTone} px-3 py-1 text-xs font-black uppercase tracking-[.12em]">${esc(battlefield.hollowCorruptionLevel || 'UNKNOWN')} Hollow</span>
    </div>
    <div class="mt-4 grid gap-2 sm:grid-cols-3">
      ${metric('Realm', battlefield.realm || 'Unassigned')}
      ${metric('Primary Faction', battlefield.primaryFactionName || 'Contested')}
      ${metric('Resonance', battlefield.dominantResonance || 'Unknown')}
    </div>
    <div class="mt-4 rounded-3xl border border-neutral-800 bg-neutral-950 p-4">
      <p class="text-xs font-black uppercase tracking-[.22em] text-primary">Tactical Identity</p>
      <p class="mt-2 text-sm text-neutral-300">${esc(battlefield.tacticalIdentity)}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        ${badge(battlefield.registryStatus || 'UNREGISTERED', 'ok')}
        ${badge(`${readinessCount}/5 Views Ready`, readinessCount >= 5 ? 'ok' : 'primary')}
        ${badge(battlefield.sourceMapStatus || 'Source Pending')}
      </div>
    </div>
    <div class="mt-4 grid gap-3 lg:grid-cols-3">
      ${listBlock('Objectives', battlefield.objectives || [])}
      ${listBlock('Terrain Hazards', battlefield.terrainHazards || [], 'bad')}
      ${listBlock('Faction Affinity', battlefield.factionAffinity || [])}
    </div>
    <section class="mt-4 rounded-3xl border border-neutral-800 bg-neutral-900 p-4">
      <p class="text-xs font-black uppercase tracking-[.22em] text-primary">View File Readiness</p>
      <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">${readinessGrid(battlefield.viewReadiness)}</div>
    </section>
  </article>`;
}

export function renderBattlefieldOverviewView({ registry = {}, playerHeader = '', shell = content => content } = {}) {
  const boundary = registry.canonBoundary || {};
  const threat = boundary.existentialThreat || {};
  const battlefields = Array.isArray(registry.battlefields) ? registry.battlefields : [];
  const ready = battlefields.filter(b => b.registryStatus === 'CANON_READY').length;
  const highRisk = battlefields.filter(b => String(b.hollowCorruptionLevel).toUpperCase() === 'HIGH').length;
  const factionNames = boundary.playableFactionNames || [];
  const cards = battlefields.map(battlefieldCard).join('') || '<p class="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 text-neutral-400">No battlefield canon records found.</p>';
  const content = `${playerHeader}<main class="mx-auto max-w-6xl space-y-4 px-3 pb-28 pt-3">
    <button onclick="TGHub.go('hub')" class="rounded-2xl bg-neutral-800 px-4 py-3 font-black">← Command Hub</button>
    <header class="overflow-hidden rounded-[2rem] border border-primary/40 bg-neutral-900 p-5 shadow-dark-outline">
      <p class="text-xs font-black uppercase tracking-[.28em] text-primary">Battlefield Canon Registry</p>
      <h1 class="mt-1 text-4xl font-black leading-none">Battlefield Overview</h1>
      <p class="mt-2 max-w-3xl text-neutral-300">${esc(registry.purpose || 'Canon-governed battlefield foundation for tactical map views.')}</p>
      <div class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        ${metric('Battlefields', registry.battlefieldCount || battlefields.length)}
        ${metric('Canon Ready', ready)}
        ${metric('Playable Factions', boundary.playableFactionCount || factionNames.length)}
        ${metric('High Hollow Risk', highRisk)}
      </div>
    </header>
    <section class="rounded-[2rem] border border-neutral-800 bg-neutral-900 p-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-black uppercase tracking-[.22em] text-primary">Canon Boundary</p>
          <h2 class="text-2xl font-black">Seven playable Realms. One non-playable threat.</h2>
          <p class="mt-2 text-sm text-neutral-300">The overview refuses prototype factions and keeps Hollow pressure classified as antagonist-only.</p>
        </div>
        ${badge(`${esc(threat.name || 'The Hollow')} · ${threat.playable === false ? 'Not Playable' : 'Check Threat Rule'}`, threat.playable === false ? 'bad' : 'primary')}
      </div>
      <div class="mt-4 flex flex-wrap gap-2">${factionNames.map(name => badge(name, 'ok')).join('')}</div>
    </section>
    <section class="grid gap-4">${cards}</section>
  </main>`;
  return shell(content);
}
