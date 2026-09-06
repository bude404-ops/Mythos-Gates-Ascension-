/* ============================================================
   MYTHOS UI SYSTEM v1 — behaviors
   Tactile feedback · hold-reveal tooltips · parallax · unfold
   ============================================================ */
(function(){
  const MUI = window.MUI = {};

  /* ---------- sound: soft stone-tick & ember swell (WebAudio, no assets) ---------- */
  let AC=null; MUI.mute=false;
  const ctx=()=>{ if(!AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){} } if(AC&&AC.state==='suspended')AC.resume(); return AC; };
  MUI.tick = function()vol=.12){ const a=ctx(); if(!a)return;
    const t=a.currentTime, buf=a.createBuffer(1, a.sampleRate*.05, a.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.2);
    const src=a.createBufferSource(); src.buffer=buf;
    const f=a.createBiquadFilter(); f.type='bandpass'; f.frequency.value=900; f.Q.value=1.4;
    const g=a.createGain(); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+.05);
    src.connect(f).connect(g).connect(a.destination); src.start(t); };
  MUI.swell = function()){ const a=ctx(); if(!a)return;
    const t=a.currentTime, o=a.createOscillator(), g=a.createGain();
    o.type='sine'; o.frequency.setValueAtTime(70,t); o.frequency.exponentialRampToValueAtTime(34,t+.5);
    g.gain.setValueAtTime(.16,t); g.gain.exponentialRampToValueAtTime(.001,t+.55);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t+.6); };
  MUI.chime = function()){ const a=ctx(); if(!a)return;
    const t=a.currentTime, o=a.createOscillator(), g=a.createGain();
    o.type='sine'; o.frequency.setValueAtTime(392,t); o.frequency.setValueAtTime(523.25,t+.09);
    g.gain.setValueAtTime(.05,t); g.gain.exponentialRampToValueAtTime(.001,t+.4);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t+.42); };

  /* ---------- tactile press: physical buttons ---------- */
  function press(el,on){ el.classList.toggle('pressed',on); if(on){ MUI.tick(); if(navigator.vibrate)try{navigator.vibrate(9)}catch(e){} } }
  function bindTactile(el){
    if(el._mtactile)return; el._mtactile=1;
    el.addEventListener('pointerdown',e=>{ if(el.classList.contains('off'))return; press(el,true); });
    el.addEventListener('pointerup',()=>press(el,false));
    el.addEventListener('pointerleave',()=>press(el,false));
    el.addEventListener('pointercancel',()=>press(el,false));
  }
  MUI.bindTactile=bindTactile;

  /* ---------- tooltips: tertiary detail on hold (never clutter the face) ---------- */
  let tipEl=null, holdT=null;
  function ensureTip(){ if(!tipEl){ tipEl=document.createElement('div'); tipEl.className='m-tip'; document.body.appendChild(tipEl);} return tipEl; }
  function showTip(anchor,html){
    const t=ensureTip(); t.innerHTML=html;
    const r=anchor.getBoundingClientRect();
    t.style.left=Math.min(Math.max(10,r.left+r.width/2-140), innerWidth-290)+'px';
    t.style.top =(r.top>innerHeight/2? r.top-t.offsetHeight-12 : r.bottom+12)+'px';
    requestAnimationFrame(()=>t.classList.add('show'));
  }
  function hideTip(){ if(tipEl){tipEl.classList.remove('show')} }
  MUI.tip=function(anchor,html){
    if(anchor._mtip)return; anchor._mtip=1;
    const start=e=>{ holdT=setTimeout(()=>showTip(anchor,html),380); };
    const cancel=()=>{ clearTimeout(holdT); hideTip(); };
    anchor.addEventListener('pointerdown',start);
    ['pointerup','pointerleave','pointercancel'].forEach(ev=>anchor.addEventListener(ev,cancel));
  };

  /* ---------- parallax: the world breathes under the UI ---------- */
  MUI.parallax=function(el,strength=10){
    let tx=0,ty=0,cx=0,cy=0,raf=null;
    const loop=()=>{ cx+=(tx-cx)*.06; cy+=(ty-cy)*.06;
      el.style.transform=`translate(${cx}px,${cy}px) scale(1.02)`;
      if(Math.abs(cx-tx)>.1||Math.abs(cy-ty)>.1) raf=requestAnimationFrame(loop); else raf=null; };
    const kick=()=>{ if(!raf) raf=requestAnimationFrame(loop); };
    addEventListener('pointermove',e=>{ tx=(e.clientX/innerWidth-.5)*strength*2; ty=(e.clientY/innerHeight-.5)*strength; kick(); },{passive:true});
    addEventListener('deviceorientation',e=>{ if(e.gamma==null)return; tx=Math.max(-1,Math.min(1,e.gamma/28))*strength*2; ty=Math.max(-1,Math.min(1,(e.beta-40)/40))*strength; kick(); },{passive:true});
  };

  /* ---------- unfold: panels rise from the stone ---------- */
  MUI.unfold=function(el){ el.classList.remove('m-unfold'); void el.offsetWidth; el.classList.add('m-unfold'); };
  MUI.step=function(el){ el.classList.remove('m-fade-step'); void el.offsetWidth; el.classList.add('m-fade-step'); };

  /* ---------- auto-bind everything already on the page ---------- */
  function sweep(){
    document.querySelectorAll('.m-btn,.m-card,.m-btn-sm').forEach(bindTactile);
    document.querySelectorAll('[data-tip]').forEach(el=>MUI.tip(el,el.getAttribute('data-tip')));
  }
  MUI.sweep=sweep;
  document.addEventListener('DOMContentLoaded',sweep);
})();
