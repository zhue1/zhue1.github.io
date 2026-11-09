// Project pages: reveals, counters, the Ora phone, the EricOS log, ⌘K.
import { palette } from './palette.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

window.bgStars?.('230,220,255', { n: innerWidth < 700 ? 140 : 260 });
const pal = palette();
$('#kbtn')?.addEventListener('click', () => pal.open());

/* reveal, counters, scramble */
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  $$('[data-count]', e.target).forEach(countUp);
  $$('.scramble', e.target).forEach(scramble);
  io.unobserve(e.target);
}), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach((el) => io.observe(el));

function countUp(el) {
  const to = +el.dataset.count, t0 = performance.now(), dur = reduce ? 0 : 1500;
  const f = (t) => { const p = dur ? Math.min(1, (t - t0) / dur) : 1; el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))).toLocaleString('en-US'); if (p < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
function scramble(el) {
  if (reduce || el.dataset.done) return; el.dataset.done = 1;
  const final = el.textContent; let frame = 0; const total = 24;
  const tick = () => {
    let out = '';
    for (let k = 0; k < final.length; k++) out += frame >= (k / final.length) * total * 0.7 + 6 ? final[k] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    el.textContent = out;
    if (frame++ < total) requestAnimationFrame(tick); else el.textContent = final;
  };
  tick();
}

/* Ora phone: screens + tilt */
const phone = $('#phone');
if (phone) {
  const imgs = $$('.phone-screen img'), tabs = $$('.tabs button'), bar = $('.tabs');
  let cur = 0, timer; const DWELL = 3200;
  bar.style.setProperty('--dwell', DWELL + 'ms');
  const show = (n, user) => {
    imgs[cur].classList.remove('on'); tabs[cur].setAttribute('aria-selected', 'false');
    cur = n; imgs[cur].classList.add('on'); tabs[cur].setAttribute('aria-selected', 'true');
    clearTimeout(timer); if (user) bar.classList.add('paused');
    if (!reduce && !bar.classList.contains('paused')) timer = setTimeout(() => show((cur + 1) % imgs.length), DWELL);
  };
  tabs.forEach((b, n) => b.addEventListener('click', () => show(n, true)));
  new IntersectionObserver(([e]) => { clearTimeout(timer); if (e.isIntersecting && !reduce && !bar.classList.contains('paused')) timer = setTimeout(() => show((cur + 1) % imgs.length), DWELL); }).observe(phone);
  if (finePointer && !reduce) {
    const stage = $('.ora-stage');
    stage.addEventListener('pointermove', (e) => {
      const r = phone.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      phone.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`;
      $('.phone-shine', phone).style.setProperty('--shine', `${50 + x * 80}%`);
    });
    stage.addEventListener('pointerleave', () => { phone.style.transform = ''; });
  }
}

/* EricOS scheduler log */
const logEl = $('#log');
if (logEl) {
  const LOG = [
    ['06:58', 'morning-brief', 'built in 41s', 'ok'], ['07:00', 'deadlines', '3 due this week', 'ok'],
    ['09:00', 'job-scan', '3,300+ postings swept', ''], ['09:04', 'job-scan', 'scams dropped · ranked', 'ok'],
    ['10:12', 'planner', 'split across 3 agents', 'k'], ['10:12', 'agent wt/1', 'failing test first', ''],
    ['10:29', 'agent wt/2', 'hook blocked force-push', 'g'], ['10:31', 'linux-worker', 'suite green over ssh', 'ok'],
    ['10:34', 'verifier', 'mutation caught', 'ok'], ['10:35', 'gh', 'PR opened · checks pass', 'ok'],
  ];
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const line = ([t, who, msg, cls], partial) => `<span class="t">${t}</span> <span class="k">${who.padEnd(14)}</span>${esc(partial ?? msg)}${partial == null ? (cls === 'ok' ? ' <span class="ok">✓</span>' : cls === 'g' ? ' <span class="g">⚑</span>' : '') : ''}`;
  const run = async () => {
    if (reduce) { logEl.innerHTML = LOG.map((l) => line(l)).join('\n'); return; }
    for (;;) {
      const done = [];
      for (const l of LOG) {
        for (let k = 0; k <= l[2].length; k += 2) { logEl.innerHTML = [...done, line(l, l[2].slice(0, k))].join('\n') + '<span class="caret"></span>'; await wait(16); }
        done.push(line(l)); logEl.innerHTML = done.join('\n'); await wait(380);
      }
      await wait(3500);
    }
  };
  let started = false;
  new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { started = true; run(); } }, { threshold: 0.3 }).observe($('.term'));
}

/* card spotlight + magnetic buttons */
if (finePointer && !reduce) {
  $$('.card, .tile').forEach((c) => c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect(); c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));
}
