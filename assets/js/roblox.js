// Charts for the Roblox case study. Every curve uses the game's own formulas.
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent?.appendChild(e); return e; };

function lineChart(svg, { xs, ys, xMax, yMax, xTicks, yTicks, xFmt, yFmt, dots = [], step = false }) {
  const W = 560, H = 260, L = 54, R = 16, T = 16, B = 34;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const X = (x) => L + (x / xMax) * (W - L - R), Y = (y) => H - B - (y / yMax) * (H - T - B);
  const defs = el('defs', {}, svg), g = el('linearGradient', { id: 'gA', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el('stop', { offset: 0, 'stop-color': '#4ee6ff', 'stop-opacity': .35 }, g); el('stop', { offset: 1, 'stop-color': '#4ee6ff', 'stop-opacity': 0 }, g);
  for (const t of yTicks) { el('line', { x1: L, x2: W - R, y1: Y(t), y2: Y(t), class: 'grid' }, svg); el('text', { x: L - 8, y: Y(t) + 4, 'text-anchor': 'end' }, svg).textContent = yFmt(t); }
  for (const t of xTicks) el('text', { x: X(t), y: H - 12, 'text-anchor': 'middle' }, svg).textContent = xFmt(t);
  el('line', { x1: L, x2: W - R, y1: H - B, y2: H - B, class: 'axis' }, svg);
  let d = '';
  xs.forEach((x, i) => { if (!i) d = `M${X(x)},${Y(ys[i])}`; else d += step ? `H${X(x)}V${Y(ys[i])}` : `L${X(x)},${Y(ys[i])}`; });
  el('path', { d: `${d}V${Y(0)}H${X(xs[0])}Z`, class: 'areaA' }, svg);
  const p = el('path', { d, class: 'lineA' }, svg);
  const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
  new IntersectionObserver(([e], o) => { if (!e.isIntersecting) return; p.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.3,.7,.2,1)'; p.style.strokeDashoffset = 0; o.disconnect(); }, { threshold: .4 }).observe(svg);
  for (const { x, y, label, dy = -10, anchor = 'middle' } of dots) {
    el('circle', { cx: X(x), cy: Y(y), r: 4.5, class: 'dot' }, svg);
    el('text', { x: X(x), y: Y(y) + dy, 'text-anchor': anchor, class: 'lbl' }, svg).textContent = label;
  }
}

// Max health by level: floor((25 * level)^1.1) + 150  (EnemyController / MainServerScript)
const hp = (L) => Math.floor(Math.pow(L * 25, 1.1)) + 150;
const hpSvg = document.getElementById('hpChart');
if (hpSvg) {
  const xs = Array.from({ length: 126 }, (_, i) => i * 2);
  lineChart(hpSvg, {
    xs, ys: xs.map(hp), xMax: 250, yMax: 16000, xTicks: [0, 50, 100, 150, 200, 250], yTicks: [0, 4000, 8000, 12000, 16000],
    xFmt: (t) => 'Lv ' + t, yFmt: (t) => (t / 1000) + 'k',
    dots: [
      { x: 0, y: hp(0), label: '' },
      { x: 20, y: hp(20), label: '' },
      { x: 50, y: hp(50), label: 'Thugs Lv 0–50', anchor: 'end', dy: -14 },
      { x: 75, y: hp(75), label: 'Rogue Samurai 75', anchor: 'start', dy: 22 },
      { x: 250, y: hp(250), label: 'Cursed Flame Samurai 250', anchor: 'end', dy: -12 },
    ],
  });
  document.querySelectorAll('[data-hp]').forEach((n) => (n.textContent = hp(+n.dataset.hp).toLocaleString('en-US')));
}

// Block: 90% damage reduction, then -5% every 0.2 s while held, floor 40%  (BlockService)
const blkSvg = document.getElementById('blockChart');
if (blkSvg) {
  const xs = [], ys = [];
  for (let t = 0, r = 0.9; t <= 3.0001; t += 0.2) { xs.push(+t.toFixed(1)); ys.push(Math.round(r * 100)); if (r > 0.4 + 1e-9) r -= 0.05; }
  lineChart(blkSvg, {
    xs, ys, xMax: 3, yMax: 100, xTicks: [0, 1, 2, 3], yTicks: [0, 25, 50, 75, 100], step: true,
    xFmt: (t) => t + ' s', yFmt: (t) => t + '%',
    dots: [{ x: 0, y: 90, label: 'tap block: 90%', anchor: 'start', dy: -12 }, { x: 2, y: 40, label: 'held 2 s: 40% floor', dy: 22 }],
  });
}

// One in-game day: the sky tint table + cosine brightness from TimeController, sampled every in-game 15 minutes
const strip = document.getElementById('dayStrip');
if (strip) {
  const R = [0,0,0,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,0,0,0,0];
  const G = [165,165,165,165,165,255,215,230,255,255,255,255,255,255,255,245,230,215,255,165,165,165,165,165];
  const B = [255,255,255,255,255,255,110,135,255,255,255,255,255,255,255,215,135,110,255,255,255,255,255,255];
  const stops = [];
  for (let m = 0; m <= 24; m += 0.25) {
    const p = Math.min(24, Math.max(1, Math.ceil(m))), f = m - p + 1, i = p - 1, j = p % 24;
    const lerp = (A) => (A[j] - A[i]) * f + A[i];
    const bright = (Math.cos(m * Math.PI / 12 + Math.PI) + 2) / 3; // 1/3 .. 1
    const night = [14, 10, 40];
    const c = [lerp(R), lerp(G), lerp(B)].map((v, k) => Math.round(night[k] + (v * 0.85 - night[k]) * Math.pow(bright, 1.6)));
    stops.push(`rgb(${c}) ${(m / 24 * 100).toFixed(2)}%`);
  }
  strip.style.background = `linear-gradient(90deg, ${stops.join(',')})`;
}
