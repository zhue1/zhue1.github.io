import { createEgg } from './egg.js';
import { palette } from './palette.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrow = matchMedia('(max-width: 900px)');
window.bgStars?.('230,220,255', { n: narrow.matches ? 160 : 320 });

// role line types through a few titles
const roles = ['Founder & engineer @ Orbi Labs', 'Full-stack & AI engineer', 'CS @ University of Florida', 'Backend & data systems'];
const roleEl = document.getElementById('role');
if (!reduce) (async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let r = 0; ; r = (r + 1) % roles.length) {
    await wait(2800);
    for (let k = roles[r].length; k >= 0; k--) { roleEl.textContent = '> ' + roles[r].slice(0, k); await wait(16); }
    const n = roles[(r + 1) % roles.length];
    for (let k = 1; k <= n.length; k++) { roleEl.textContent = '> ' + n.slice(0, k); await wait(34); }
  }
})();

// If the particle script didn't load, keep the page working without the orb.
const noop = { assemble: () => false, disperse: () => {}, hit: () => false };
const field = typeof window.makeOrb !== 'function' ? noop : window.makeOrb(document.getElementById('orb'), { n: narrow.matches ? 1100 : 1700, r: narrow.matches ? 0.3 : 0.225, speed: reduce ? 0.03 : 0.12 });
const stage = document.getElementById('stage'), planets = [...document.querySelectorAll('.planet')];
let t = 0.02, paused = false, focus = 1, focusT = 1;
planets.forEach((p) => { p.addEventListener('pointerenter', () => (paused = true)); p.addEventListener('pointerleave', () => (paused = false)); p.addEventListener('focus', () => (paused = true)); p.addEventListener('blur', () => (paused = false)); });
(function loop() {
  requestAnimationFrame(loop);
  if (narrow.matches) return; // phones get a plain list
  focus += (focusT - focus) * 0.08;
  if (!paused && !reduce) t += 0.00035 * focus;
  const w = stage.clientWidth, h = stage.clientHeight, rx = Math.min(385, w / 2 - 150), ry = Math.min(255, h / 2 - 110);
  planets.forEach((p, i) => {
    const a = t * Math.PI * 2 + (i / planets.length) * Math.PI * 2 - Math.PI / 4, d = (Math.sin(a) + 1) / 2;
    p.style.transform = `translate(${w / 2 + Math.cos(a) * rx - 135}px, ${h / 2 + Math.sin(a) * ry - 40}px) scale(${0.88 + d * 0.14})`;
    p.style.zIndex = 2 + Math.round(d * 10);
    p.style.opacity = (0.72 + d * 0.28) * (0.07 + 0.93 * focus);
  });
})();

// Orbi easter egg: particles -> ring -> surge -> Orbi launches and slams down; closing turns him back.
const cv = document.getElementById('orb'), psst = document.getElementById('psst');
let state = 'orb';
const egg = createEgg({ pop: reduce ? 'elastic' : 'slam', dialog: 'rpg', jump: 0.4, shakeEl: document.querySelector('.layout'), onClose: () => turnBack() });
(window.requestIdleCallback || setTimeout)(() => egg.prepare(), { timeout: 1500 });
const center = () => { const r = cv.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
function hatch() {
  if (state === 'orbi') return egg.hop();
  if (state !== 'orb') return;
  if (narrow.matches) cv.scrollIntoView({ block: 'center', behavior: 'smooth' });
  if (!field.assemble(() => { egg.show(...center()); state = 'orbi'; }, () => {})) return;
  focusT = 0; state = 'busy'; cv.classList.remove('armed'); psst.style.opacity = 0;
}
function turnBack() {
  if (state !== 'orbi') return;
  state = 'busy';
  egg.hide(() => field.disperse(() => { state = 'orb'; }));
  setTimeout(() => (focusT = 1), 700);
}
cv.addEventListener('pointermove', (e) => cv.classList.toggle('armed', state === 'orb' && field.hit(e.clientX, e.clientY)));
cv.addEventListener('click', (e) => { if (field.hit(e.clientX, e.clientY)) hatch(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && state === 'orbi' && !document.querySelector('.pal-bg.on')) turnBack(); });

const pal = palette({ onOrbi: hatch });
document.getElementById('kbtn').addEventListener('click', () => pal.open());
