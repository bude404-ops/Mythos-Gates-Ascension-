import playwright from '/usr/local/lib/node_modules/playwright/index.js';
const { chromium } = playwright;
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox','--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.goto('http://127.0.0.1:8141/index.html?mobilecopy=063#/art?category=Map', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[data-art-prompt-card]', { timeout: 10000 });
await page.waitForFunction(() => {
  const cards = document.querySelectorAll('[data-art-prompt-card]').length;
  const btn = document.querySelector('[data-copy-prompt]');
  if (!btn || cards !== 12) return false;
  btn.scrollIntoView({ block: 'center', inline: 'nearest' });
  const r = btn.getBoundingClientRect();
  return r.width >= 300 && r.height >= 90;
}, null, { timeout: 10000 });
const cards = await page.locator('[data-art-prompt-card]').count();
if (cards !== 12) throw new Error(`Expected 12 map prompt cards, saw ${cards}`);
const controls = await page.locator('[data-mobile-copy]').count();
if (controls < 36) throw new Error(`Expected mobile copy controls, saw ${controls}`);
const box = await page.evaluate(async()=>{
  const btn=document.querySelector('[data-copy-prompt]');
  if(!btn) return null;
  btn.scrollIntoView({block:'center', inline:'nearest'});
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const r=btn.getBoundingClientRect();
  return { x:r.x, y:r.y, width:r.width, height:r.height };
});
if (!box || box.height < 90 || box.width < 300) throw new Error(`Prompt touch target too small: ${JSON.stringify(box)}`);
const clickResult = await page.evaluate(async()=>{
  const btn=document.querySelector('[data-copy-prompt]');
  if(!btn) return { toast:'', missing:true, fallbackVisible:false };
  btn.scrollIntoView({block:'center', inline:'nearest'});
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  btn.click();
  await new Promise(r=>setTimeout(r,250));
  return { toast: document.getElementById('toast')?.textContent || '', fallbackVisible: !document.getElementById('mobileClipboardFallback')?.classList.contains('hidden') };
});
if (!/prompt copied|fallback/i.test(clickResult.toast || '')) throw new Error(`Copy click feedback missing: ${JSON.stringify(clickResult)}`);
const fallbackExists = await page.locator('#mobileClipboardFallback').count();
if (fallbackExists !== 1) throw new Error('Mobile fallback textarea missing');
const helperResult = await page.evaluate(async()=>{
  const copied = await copyText('TG_MOBILE_COPY_SMOKE','Mobile copy smoke copied');
  return { copied, toast: document.getElementById('toast')?.textContent || '', fallbackValue: document.getElementById('mobileClipboardFallback')?.value || '' };
});
if (!/Mobile copy smoke copied|fallback/i.test(helperResult.toast || '')) throw new Error(`Direct copy helper failed: ${JSON.stringify(helperResult)}`);
await browser.close();
console.log(JSON.stringify({ ok:true, mapPromptCards:cards, mobileCopyControls:controls, firstTouchHeight:Math.round(box.height), firstTouchWidth:Math.round(box.width), clickFeedback:clickResult.toast, helperFeedback:helperResult.toast }));
