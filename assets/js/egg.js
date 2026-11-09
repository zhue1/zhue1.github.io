// Orbi easter egg, round 3: preloaded 3D Orbi, 5 pop-outs, 5 dialog styles.
import { createOrbi } from './orbi3d.js';

export const LINES = [
  "Hi! I'm Orbi, the AI coach inside Ora.",
  'Eric built me to coach lifters. I suggest the changes, and real code does the math.',
  'Click me to hop, or drag to spin me.',
];

const CSS = `
.oe{position:fixed;z-index:60;width:480px;height:480px;transform:translate(-50%,-50%);display:none;pointer-events:none}
.oe.on{display:block}
.oe-body{position:absolute;inset:0;pointer-events:auto;transform-origin:50% 64%}
.oe-fx{position:absolute;inset:0;pointer-events:none}
.oe.warm{display:block;opacity:0}
/* --- pop-outs --- */
.pop-elastic .oe-body{animation:oe-elastic 1.15s cubic-bezier(.2,.7,.3,1) both}
@keyframes oe-elastic{0%{transform:scale(0)}40%{transform:scale(1.5,1.3)}58%{transform:scale(.8,1.14)}72%{transform:scale(1.13,.93)}86%{transform:scale(.97,1.03)}100%{transform:scale(1)}}
.wave{position:absolute;left:50%;top:64%;width:180px;height:60px;margin:-30px 0 0 -90px;border-radius:50%;border:2px solid rgba(92,225,230,.8);opacity:0;animation:oe-wave 1s cubic-bezier(.1,.7,.3,1) forwards}
@keyframes oe-wave{0%{opacity:.9;transform:scale(.2)}100%{opacity:0;transform:scale(3.4)}}
.pop-burst .oe-body{animation:oe-burst 1s cubic-bezier(.2,.8,.3,1) both}
@keyframes oe-burst{0%{transform:scale(0) rotate(-30deg)}48%{transform:scale(1.4) rotate(10deg)}70%{transform:scale(.9) rotate(-3deg)}100%{transform:scale(1) rotate(0)}}
.spark{position:absolute;left:50%;top:52%;width:3px;height:26px;margin-left:-1.5px;border-radius:3px;background:linear-gradient(var(--c),transparent);transform-origin:50% 0;opacity:0;animation:oe-spark .8s cubic-bezier(.1,.8,.3,1) forwards;animation-delay:var(--d)}
@keyframes oe-spark{0%{opacity:1;transform:rotate(var(--a)) translateY(20px) scaleY(.4)}100%{opacity:0;transform:rotate(var(--a)) translateY(var(--r)) scaleY(1.4)}}
.pop-holo .oe-body{animation:oe-holo 1.2s steps(1,end) both, oe-holo2 1.2s cubic-bezier(.2,.8,.3,1) both}
@keyframes oe-holo{0%{opacity:0}10%{opacity:1}22%{opacity:.25}30%{opacity:1}38%{opacity:.45}46%{opacity:1}60%{opacity:.7}66%{opacity:1}}
@keyframes oe-holo2{0%{transform:scale(1.5,.02);filter:hue-rotate(-40deg) brightness(3)}20%{transform:scale(1.2,.06)}42%{transform:scale(.9,1.25);filter:hue-rotate(30deg) brightness(1.6)}62%{transform:scale(1.12,.95);filter:none}100%{transform:scale(1)}}
.scan{position:absolute;inset:8% 14%;border-radius:40%;background:repeating-linear-gradient(0deg,rgba(92,225,230,.28) 0 2px,transparent 2px 5px);mix-blend-mode:screen;animation:oe-scan 1.6s ease-out forwards}
@keyframes oe-scan{0%{opacity:1;transform:translateY(-12%)}70%{opacity:.6}100%{opacity:0;transform:translateY(8%)}}
.pop-slam .oe-body{animation:oe-slam 1.25s both}
@keyframes oe-slam{0%{transform:translateY(0) scale(.15);animation-timing-function:cubic-bezier(.2,.9,.3,1)}32%{transform:translateY(-250px) scale(1.12) rotate(-8deg);animation-timing-function:cubic-bezier(.7,0,1,.6)}52%{transform:translateY(0) scale(1.4,.66)}66%{transform:scale(.86,1.15)}80%{transform:scale(1.06,.96)}100%{transform:scale(1)}}
.dust{position:absolute;left:50%;top:70%;width:220px;height:46px;margin:-23px 0 0 -110px;border-radius:50%;background:radial-gradient(closest-side,rgba(160,200,255,.55),rgba(91,124,255,.15) 60%,transparent);opacity:0;animation:oe-dust .9s .62s cubic-bezier(.1,.7,.3,1) forwards}
@keyframes oe-dust{0%{opacity:1;transform:scale(.3)}100%{opacity:0;transform:scale(2.8,1.6)}}
.oe-shake{animation:oe-shake .45s .62s}
@keyframes oe-shake{0%,100%{transform:none}20%{transform:translate(-7px,5px)}40%{transform:translate(6px,-4px)}60%{transform:translate(-4px,2px)}80%{transform:translate(2px,-1px)}}
.pop-rays .oe-body{animation:oe-elastic 1.05s .12s cubic-bezier(.2,.7,.3,1) both}
.rays{position:absolute;left:50%;top:55%;width:760px;height:760px;margin:-380px 0 0 -380px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(120,170,255,.22) 0 7deg,transparent 7deg 22deg);-webkit-mask:radial-gradient(closest-side,#000 25%,transparent);mask:radial-gradient(closest-side,#000 25%,transparent);animation:oe-rays 3.4s ease-out forwards}
@keyframes oe-rays{0%{opacity:0;transform:scale(.2) rotate(0)}18%{opacity:1;transform:scale(1) rotate(30deg)}70%{opacity:.8}100%{opacity:0;transform:scale(1.1) rotate(120deg)}}
.conf{position:absolute;left:50%;top:50%;width:7px;height:11px;border-radius:2px;background:var(--c);opacity:0;animation:oe-conf 1.6s cubic-bezier(.1,.6,.4,1) forwards;animation-delay:var(--d)}
@keyframes oe-conf{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--rot))}}
/* --- leaving: implode into light --- */
.oe.out .oe-body{animation:oe-out .34s cubic-bezier(.5,0,.8,.4) forwards}
@keyframes oe-out{0%{transform:scale(1);filter:none}35%{transform:scale(1.18,.86);filter:brightness(1.8)}100%{transform:scale(0);filter:brightness(5)}}

/* --- dialogs (shared) --- */
.dl{position:fixed;z-index:61;font-family:var(--body)}
.dl button{font:inherit;cursor:pointer}
.dl.out{opacity:0!important;transform:translateY(6px) scale(.97)!important;transition:.25s}
.dl .x{position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#9097ab;font-size:15px;line-height:1;display:grid;place-items:center;transition:.2s}
.dl .x:hover{color:#fff;border-color:#5ce1e6;transform:rotate(90deg)}
.caret{display:inline-block;width:7px;height:1em;background:currentColor;vertical-align:-2px;margin-left:2px;animation:oe-blink 1s steps(1) infinite}
@keyframes oe-blink{50%{opacity:0}}

/* 1 HUD card */
.hud{width:330px;padding:16px 18px 16px;border-radius:18px;background:linear-gradient(160deg,rgba(22,27,45,.92),rgba(10,12,20,.92));border:1px solid rgba(92,225,230,.35);box-shadow:0 0 0 1px rgba(91,124,255,.15) inset,0 30px 60px -20px #000,0 0 50px -10px rgba(92,225,230,.35);backdrop-filter:blur(14px);opacity:0;transform:translateX(-14px);transition:.45s cubic-bezier(.2,.8,.2,1)}
.hud.on{opacity:1;transform:none}
.hud::before{content:"";position:absolute;right:100%;top:34px;width:64px;height:1px;background:linear-gradient(90deg,transparent,#5ce1e6)}
.hud::after{content:"";position:absolute;right:calc(100% + 60px);top:31px;width:7px;height:7px;border-radius:50%;background:#5ce1e6;box-shadow:0 0 10px #5ce1e6}
.hud .hd{display:flex;align-items:center;gap:8px;font:500 11.5px var(--mono);letter-spacing:.1em;color:#5ce1e6;margin-bottom:10px}
.hud .hd i{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px #4ade80}
.hud p{margin:0 0 6px;color:#e6e9f3;font-size:15px;line-height:1.5;min-height:1.5em}
.hud p.dim{color:#9097ab;font-size:14px}
.hud .acts{display:flex;gap:8px;margin-top:12px;opacity:0;transition:.3s}
.hud .acts.on{opacity:1}
.hud .acts a,.hud .acts button{height:32px;padding:0 12px;border-radius:999px;font-size:13px;display:inline-flex;align-items:center;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);color:#eef0f7;text-decoration:none}
.hud .acts a{background:#eef0f7;color:#06070c;border-color:#eef0f7;font-weight:600}

/* 2 chat (Ora app style) */
.chat{width:340px;display:flex;flex-direction:column;gap:8px}
.chat .head{align-self:flex-start;display:flex;align-items:center;gap:10px;padding:6px 14px 6px 6px;border-radius:999px;border:1.5px solid #c9a96a;background:rgba(14,24,48,.9);opacity:0;transform:scale(.8);transition:.35s cubic-bezier(.34,1.56,.64,1)}
.chat .head.on{opacity:1;transform:none}
.chat .head img{width:30px;height:30px}
.chat .head b{display:block;font:700 15px var(--body)}.chat .head small{font-size:11.5px;color:#4ade80}
.chat .x{position:static;margin-left:6px}
.msg{align-self:flex-start;max-width:320px;padding:11px 14px;border-radius:6px 16px 16px 16px;background:rgba(20,34,64,.95);border:1.5px solid #3a5687;color:#eef0f7;font-size:14.5px;line-height:1.45;box-shadow:0 14px 30px -14px #000;opacity:0;transform:translateY(8px) scale(.96);transform-origin:0 0;transition:.3s cubic-bezier(.2,.8,.2,1)}
.msg.on{opacity:1;transform:none}
.msg .tag{display:inline-block;font:700 11px var(--body);color:#1a1205;background:#f6e3a6;border-radius:6px;padding:1px 7px;margin-bottom:5px}
.typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;border-radius:6px 16px 16px 16px;background:rgba(20,34,64,.95);border:1.5px solid #3a5687}
.typing i{width:6px;height:6px;border-radius:50%;background:#9fb4ff;animation:oe-dot 1s infinite}.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}
@keyframes oe-dot{0%,60%,100%{transform:none;opacity:.4}30%{transform:translateY(-4px);opacity:1}}
.chat .qr{display:flex;gap:7px;opacity:0;transition:.3s}.chat .qr.on{opacity:1}
.chat .qr button{height:32px;padding:0 13px;border-radius:999px;border:1.5px solid #c9a96a;background:rgba(14,24,48,.85);color:#f6e3a6;font-size:13px;font-weight:600}
.chat .qr button:hover{background:#c9a96a;color:#14100a}

/* 3 hologram */
.holo{width:300px;padding:18px 20px;color:#c9fbff;background:linear-gradient(180deg,rgba(92,225,230,.12),rgba(91,124,255,.06));border:1px solid rgba(92,225,230,.55);border-radius:6px;box-shadow:0 0 40px rgba(92,225,230,.2),inset 0 0 30px rgba(92,225,230,.1);transform:perspective(900px) rotateY(-16deg) rotateX(4deg);transform-origin:0 50%;opacity:0;font-family:var(--mono);text-shadow:0 0 8px rgba(92,225,230,.7)}
.holo.on{animation:oe-holoin .8s steps(1,end) forwards}
@keyframes oe-holoin{0%{opacity:0}15%{opacity:.8}25%{opacity:.1}40%{opacity:.9}50%{opacity:.4}60%,100%{opacity:1}}
.holo::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(92,225,230,.08) 0 1px,transparent 1px 4px);animation:oe-roll 4s linear infinite}
@keyframes oe-roll{to{background-position:0 40px}}
.holo .hd{font-size:11px;letter-spacing:.18em;opacity:.8;margin-bottom:10px;display:flex;justify-content:space-between}
.holo p{margin:0 0 8px;font-size:14px;line-height:1.55}
.holo .acts{display:flex;gap:14px;margin-top:12px;font-size:12px;letter-spacing:.06em;white-space:nowrap}
.holo .acts a,.holo .acts button{color:#5ce1e6;background:none;border:0;padding:0;text-decoration:none;text-shadow:inherit}
.holo .acts a:hover,.holo .acts button:hover{color:#fff}
.holo .x{border-radius:3px;border-color:rgba(92,225,230,.5);color:#5ce1e6;font-family:var(--mono);font-size:13px}
.beam{position:fixed;z-index:59;height:150px;pointer-events:none;background:linear-gradient(90deg,rgba(92,225,230,.45),rgba(92,225,230,.04));clip-path:polygon(0 47%,100% 0,100% 100%,0 53%);opacity:0;transition:opacity .4s .1s;filter:blur(1px)}
.beam.on{opacity:1}

/* 4 RPG dialogue */
.rpg{display:grid;grid-template-columns:96px 1fr;gap:18px;padding:18px 22px 18px 18px;border-radius:var(--panel-r,14px);background:linear-gradient(180deg,var(--panel-a,#121a33),var(--panel-b,#0a0f20));border:2px solid var(--panel-border,#2b3c6b);box-shadow:0 0 0 4px var(--panel-b,#0a0f20),0 0 0 5px var(--tag-ring,rgba(245,199,107,.45)),0 30px 70px -20px #000,0 0 60px -20px var(--tag-glow,transparent);opacity:0;transform:translateY(30px);transition:.45s cubic-bezier(.2,.8,.2,1)}
.rpg.on{opacity:1;transform:none}
.rpg .por{width:96px;height:96px;border-radius:12px;background:radial-gradient(circle at 50% 40%,#2a4cb8,#0b1430);border:2px solid var(--tag,#f5c76b);display:grid;place-items:center;overflow:hidden}
.rpg .por img{width:84%}
.rpg .name{position:absolute;top:-16px;left:130px;padding:3px 14px;border-radius:8px;background:var(--tag,#f5c76b);color:var(--tag-ink,#1a1205);font:800 14px var(--display);letter-spacing:.06em;box-shadow:0 6px 14px -4px #000}
.rpg p{margin:4px 0 0;color:var(--ink,#eef0f7);font:500 18px/1.5 var(--body);min-height:3em;padding-right:30px}
.rpg .nx{position:absolute;right:20px;bottom:14px;color:var(--tag,#f5c76b);font-size:14px;animation:oe-bob 1s infinite;cursor:pointer}
@keyframes oe-bob{50%{transform:translateY(4px)}}
.rpg .choices{display:flex;gap:10px;margin-top:10px}
.rpg .choices[hidden]{display:none}
.rpg .hint{position:absolute;right:44px;bottom:14px;font:500 11px var(--mono);color:#5a6075;letter-spacing:.06em}
.rpg .choices button,.rpg .choices a{font:600 14px var(--body);padding:6px 14px;border-radius:8px;border:1.5px solid var(--panel-border,#3a5687);background:var(--panel-b,#0f1730);color:var(--ink,#eef0f7);text-decoration:none}
.rpg .choices :hover{border-color:var(--tag,#f5c76b);color:var(--tag,#f5c76b)}
.rpg .choices :first-child::before{content:"▸ ";color:var(--tag,#f5c76b)}
.rpg .x{top:10px;right:12px}

/* 5 caption */
.cap{width:330px;opacity:1}
.cap .lab{font:500 12px var(--mono);letter-spacing:.14em;color:#5ce1e6;margin-bottom:10px;opacity:0;transition:.4s}.cap .lab.on{opacity:1}
.cap .lab::before{content:"";display:inline-block;width:28px;height:1px;background:#5ce1e6;vertical-align:4px;margin-right:10px}
.cap h3{margin:0 0 14px;font:800 31px/1.06 var(--display);letter-spacing:-.03em;color:#eef0f7}
.cap h3 span{display:inline-block;opacity:0;transform:translateY(14px) rotate(3deg);filter:blur(4px);transition:.5s cubic-bezier(.2,.8,.2,1)}
.cap h3 span.on{opacity:1;transform:none;filter:none}
.cap h3 .hl{background:linear-gradient(100deg,#5b7cff,#5ce1e6 60%,#f5c76b);-webkit-background-clip:text;background-clip:text;color:transparent}
.cap p{margin:0 0 16px;color:#9097ab;font-size:15.5px;line-height:1.5;opacity:0;transition:.5s}.cap p.on{opacity:1}
.cap .acts{display:flex;gap:16px;font:500 13.5px var(--body);white-space:nowrap;opacity:0;transition:.4s}.cap .acts.on{opacity:1}
.cap .acts a,.cap .acts button{background:none;border:0;padding:0 0 3px;color:#eef0f7;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.3)}
.cap .acts :hover{color:#5ce1e6;border-color:#5ce1e6}
.cap .acts .bye{color:#9097ab}
`;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function type(el, text, speed = 18, token) {
  el.textContent = '';
  for (let i = 1; i <= text.length; i++) { if (token.dead) return; el.textContent = text.slice(0, i); await wait(speed); }
}

export function createEgg({ pop = 'elastic', dialog = 'hud', jump = 0.5, shakeEl, onClose } = {}) {
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const el = document.createElement('div'); el.className = 'oe';
  el.innerHTML = '<div class="oe-fx"></div><div class="oe-body"></div>';
  document.body.appendChild(el);
  const body = el.querySelector('.oe-body'), fx = el.querySelector('.oe-fx');
  let orbi = null, dl = null, beam = null, token = { dead: true };
  const OFFSET = 66; // px from the box center down to Orbi's visual center (distance 12, target 2)

  // Build the WebGL scene early and render a few frames, so the reveal has no hitch.
  function prepare() {
    if (orbi) return;
    el.classList.add('warm');
    orbi = createOrbi(body, { hopOnLoad: false, jump, target: 2.0, distance: 12 });
    let n = 0; const warm = () => { if (++n < 4) return requestAnimationFrame(warm); el.classList.remove('warm'); };
    requestAnimationFrame(warm);
  }

  function effects(x, y) {
    fx.innerHTML = '';
    if (pop === 'elastic') fx.innerHTML = '<div class="wave"></div><div class="wave" style="animation-delay:.14s"></div><div class="wave" style="animation-delay:.28s;border-color:rgba(245,199,107,.7)"></div>';
    if (pop === 'burst') fx.innerHTML = Array.from({ length: 22 }, (_, i) => `<i class="spark" style="--a:${i * (360 / 22) + Math.random() * 8}deg;--r:${150 + Math.random() * 110}px;--d:${0.08 + Math.random() * 0.12}s;--c:${i % 4 === 0 ? '#f5c76b' : '#5ce1e6'}"></i>`).join('');
    if (pop === 'holo') fx.innerHTML = '<div class="scan"></div>';
    if (pop === 'slam') { fx.innerHTML = '<div class="dust"></div>'; const s = shakeEl || document.body; s.classList.remove('oe-shake'); void s.offsetWidth; s.classList.add('oe-shake'); }
    if (pop === 'rays') fx.innerHTML = '<div class="rays"></div>' + Array.from({ length: 26 }, (_, i) => { const a = Math.random() * Math.PI * 2, d = 160 + Math.random() * 160; return `<i class="conf" style="--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d * 0.8 + 90}px;--rot:${Math.random() * 720 - 360}deg;--d:${0.15 + Math.random() * 0.2}s;--c:${['#f5c76b', '#5ce1e6', '#5b7cff', '#eef0f7'][i % 4]}"></i>`; }).join('');
  }

  function show(x, y) {
    prepare();
    el.style.left = x + 'px'; el.style.top = (y - OFFSET) + 'px';
    el.className = `oe on pop-${pop}`;
    // restart the CSS pop
    body.style.animation = 'none'; void body.offsetWidth; body.style.animation = '';
    effects(x, y);
    if (pop === 'elastic' || pop === 'burst' || pop === 'rays') setTimeout(() => orbi.hop(), pop === 'burst' ? 60 : 180);
    if (pop === 'slam') {
      // no floor shadow while he's in the air; it lands with him (52% of the 1.25 s slam)
      orbi.setGround(0);
      setTimeout(() => { const t0 = performance.now(); const fade = (t) => { const k = Math.min(1, (t - t0) / 140); orbi.setGround(k); if (k < 1) requestAnimationFrame(fade); }; requestAnimationFrame(fade); }, 640);
      setTimeout(() => orbi.hop(), 1250);
    }
    setTimeout(() => openDialog(x, y), pop === 'slam' ? 1150 : 850);
  }

  function hide(done) {
    token.dead = true;
    dl?.classList.add('out'); beam?.classList.remove('on');
    setTimeout(() => { dl?.remove(); beam?.remove(); dl = beam = null; }, 260);
    el.classList.add('out');
    setTimeout(() => { el.className = 'oe'; fx.innerHTML = ''; done?.(); }, 330);
  }

  const close = () => onClose?.();
  function wire(root) {
    root.querySelectorAll('[data-close]').forEach((b) => (b.onclick = close));
    root.querySelectorAll('[data-hop]').forEach((b) => (b.onclick = () => orbi.hop()));
  }

  async function openDialog(x, y) {
    token = { dead: false }; const tk = token;
    dl = document.createElement('div'); dl.className = `dl ${dialog}`;
    if (dialog === 'hud') {
      dl.innerHTML = `<button class="x" data-close aria-label="Close">×</button><div class="hd"><i></i>ORBI · ONLINE</div><p class="l1"></p><p class="l2 dim"></p><div class="acts"><a href="#">See Ora →</a><button data-hop>Make me hop</button></div>`;
      dl.style.left = x + 175 + 'px'; dl.style.top = y - 130 + 'px';
      document.body.appendChild(dl); wire(dl); requestAnimationFrame(() => dl.classList.add('on'));
      await wait(250); await type(dl.querySelector('.l1'), LINES[0], 20, tk); await wait(150);
      await type(dl.querySelector('.l2'), LINES[1], 14, tk); dl.querySelector('.acts').classList.add('on');
    }
    if (dialog === 'chat') {
      dl.innerHTML = `<div class="head"><img src="/assets/orbi.webp" alt=""><span><b>Orbi</b><small>● Online</small></span><button class="x" data-close aria-label="Close">×</button></div>`;
      dl.style.left = x + 165 + 'px'; dl.style.top = y - 150 + 'px';
      document.body.appendChild(dl); wire(dl); requestAnimationFrame(() => dl.querySelector('.head').classList.add('on'));
      for (const [i, line] of LINES.entries()) {
        if (tk.dead) return;
        const ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<i></i><i></i><i></i>'; dl.appendChild(ty);
        await wait(i ? 650 : 500); ty.remove(); if (tk.dead) return;
        const m = document.createElement('div'); m.className = 'msg'; m.innerHTML = (i ? '' : '<span class="tag">Orbi</span><br>') + line; dl.appendChild(m);
        requestAnimationFrame(() => m.classList.add('on'));
      }
      const qr = document.createElement('div'); qr.className = 'qr'; qr.innerHTML = '<button>Show me Ora</button><button data-hop>Hop!</button><button data-close>Bye</button>';
      dl.appendChild(qr); wire(qr); requestAnimationFrame(() => qr.classList.add('on'));
    }
    if (dialog === 'holo') {
      dl.innerHTML = `<div class="hd"><span>◉ ORBI.SYS // LINK OK</span></div><button class="x" data-close aria-label="Close">×</button><p class="l1"></p><p class="l2"></p><div class="acts"><a href="#">[ VIEW ORA ]</a><button data-hop>[ HOP ]</button><button data-close>[ CLOSE ]</button></div>`;
      const left = x + 160, top = y - 190;
      dl.style.left = left + 'px'; dl.style.top = top + 'px';
      beam = document.createElement('div'); beam.className = 'beam';
      beam.style.left = x + 34 + 'px'; beam.style.top = y - 128 + 'px'; beam.style.width = left - x - 34 + 'px';
      document.body.appendChild(beam); document.body.appendChild(dl); wire(dl);
      requestAnimationFrame(() => { beam.classList.add('on'); dl.classList.add('on'); });
      await wait(500); await type(dl.querySelector('.l1'), '> ' + LINES[0], 16, tk); await type(dl.querySelector('.l2'), '> ' + LINES[1], 11, tk);
    }
    if (dialog === 'rpg') {
      const stage = document.querySelector('.stage').getBoundingClientRect();
      dl.innerHTML = `<span class="name">ORBI</span><button class="x" data-close aria-label="Close">×</button><div class="por"><img src="/assets/orbi.webp" alt=""></div><div><p class="t"></p><div class="choices" hidden><a href="/ora/">See Ora</a><button data-hop>Hop</button><button data-close>Goodbye</button></div></div><span class="hint">click to continue</span><span class="nx">▼</span>`;
      dl.style.left = stage.left + 60 + 'px'; dl.style.width = stage.width - 120 + 'px'; dl.style.bottom = '64px';
      document.body.appendChild(dl); wire(dl); requestAnimationFrame(() => dl.classList.add('on'));
      const t = dl.querySelector('.t'), nx = dl.querySelector('.nx');
      let i = 0, typing = false;
      const next = async () => {
        if (typing || tk.dead) return;
        if (i >= LINES.length) return;
        typing = true; nx.style.visibility = 'hidden';
        await type(t, LINES[i++], 22, tk); typing = false;
        if (i < LINES.length) nx.style.visibility = 'visible'; else { nx.remove(); dl.querySelector('.hint')?.remove(); dl.querySelector('.choices').hidden = false; }
      };
      dl.onclick = (e) => { if (!e.target.closest('button,a')) next(); };
      await wait(400); next();
    }
    if (dialog === 'cap') {
      const words = "Hi, I'm Orbi. I live inside Ora.".split(' ').map((w) => `<span class="${/Ora/.test(w) ? 'hl' : ''}">${w}</span>`).join(' ');
      dl.innerHTML = `<div class="lab">ORBI · AI COACH</div><h3>${words}</h3><p>${LINES[1]} ${LINES[2]}</p><div class="acts"><a href="#">See Ora ↗</a><button data-hop>Make me hop</button><button class="bye" data-close>Back to particles ×</button></div>`;
      dl.style.left = x + 160 + 'px'; dl.style.top = y - 130 + 'px';
      document.body.appendChild(dl); wire(dl);
      dl.querySelector('.lab').classList.add('on');
      for (const s of dl.querySelectorAll('h3 span')) { await wait(110); if (tk.dead) return; s.classList.add('on'); }
      await wait(200); dl.querySelector('p').classList.add('on'); await wait(300); dl.querySelector('.acts').classList.add('on');
    }
  }

  return { prepare, show, hide, hop: () => orbi?.hop(), get el() { return el; } };
}
