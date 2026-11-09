// 2D stand-in for the live site's particle field (mockups only).
// Draws in batches (one fill per color/alpha bucket) so the transitions stay smooth.
// orb(canvas, opts) -> { assemble(onForm, onDone), disperse(onDone), hit(x, y) }
//   assemble: sphere -> spinning ring -> surge to center (onForm fires as the core fills) -> flash
//   disperse: burst from the center -> explode outward -> surge back into the sphere
window.makeOrb = function makeOrb(canvas, { n = 1600, r = 0.38, speed = 0.12 } = {}) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio, 2);
  const pts = [], g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, rr = Math.sqrt(1 - y * y), th = g * i;
    const s = i % 9 === 0 ? 0.3 + Math.random() * 0.35 : 1 + (Math.random() - 0.5) * 0.04;
    const k = Math.random();
    pts.push({ p: [Math.cos(th) * rr * s, y * s, Math.sin(th) * rr * s], k, col: k > 0.93 ? 2 : k > 0.5 ? 1 : 0,
      j: 0.9 + Math.random() * 0.2, d: Math.random(), w: Math.random() - 0.5,
      ea: Math.random() * Math.PI * 2, er: 0.75 + Math.random() * 0.9, a: 0 });
  }
  const COLS = window.ORB_COLS || ['91,124,255', '92,225,230', '245,199,107'], LV = [0.3, 0.45, 0.6, 0.75, 0.92];
  const STY = COLS.map((c) => LV.map((a) => `rgba(${c},${a})`));
  let W, H, mx = -1e4, my = -1e4, t = 0, mode = 'idle', t0 = 0, cb = {}, fired = false;
  const size = () => { const b = canvas.getBoundingClientRect(); W = b.width; H = b.height; canvas.width = W * dpr; canvas.height = H * dpr; };
  size(); addEventListener('resize', size);
  canvas.addEventListener('pointermove', (e) => { const b = canvas.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; });
  canvas.addEventListener('pointerleave', () => { mx = my = -1e4; });
  const clamp = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const outBack = (x) => { const c = 1.5; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const outExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const inOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  // assemble timeline (ms)
  const RING = 800, HOLD = 260, SURGE = 560, SPREAD = 300, FLASH = 420, SURGE_AT = RING + HOLD, A_END = SURGE_AT + SURGE + SPREAD;
  // disperse timeline (ms)
  const BLAST = 620, BACK = 900, BACK_SPREAD = 320, D_END = BLAST + BACK + BACK_SPREAD;
  let raf = 0;
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  function frame(now) {
    raf = 0;
    if (mode === 'hidden') return; // nothing drawn while Orbi is out
    t += 0.016 * speed * 6;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const R = Math.min(W, H) * r, cx = W / 2, cy = H / 2, c = Math.cos(t), s = Math.sin(t), ct = Math.cos(0.25), st = Math.sin(0.25);
    const e = now - t0, ringR = Math.min(W, H) * 0.46, spin = e * 0.0032;
    const paths = STY.map((row) => row.map(() => new Path2D()));
    const trails = [new Path2D(), new Path2D()];
    let glow = 0, glowR = 0;

    for (const q of pts) {
      const [x0, y0, z0] = q.p;
      const x = x0 * c + z0 * s, z = -x0 * s + z0 * c;
      const y2 = y0 * ct - z * st, z2 = y0 * st + z * ct, p = 3 / (3.4 - z2);
      let px = cx + x * R * p, py = cy + y2 * R * p, rad = (0.6 + q.k * 1.1) * p, al = 0.25 + 0.6 * (z2 + 1) / 2;

      if (mode === 'idle') {
        const dx = px - mx, dy = py - my, d = Math.hypot(dx, dy);
        if (d < 90) { px += dx / d * (90 - d) * 0.5; py += dy / d * (90 - d) * 0.5; }
      } else if (mode === 'assemble') {
        if (!q.a) q.a = Math.atan2(py - cy, px - cx) || 0.001;
        const a = q.a + spin, rr = ringR * q.j;
        const rx = cx + Math.cos(a) * rr, ry = cy + Math.sin(a) * rr * 0.36 + q.w * 10;
        const p1 = outBack(clamp(e / RING));
        let fx = px + (rx - px) * p1, fy = py + (ry - py) * p1;
        al += (0.92 - al) * clamp(e / RING);
        const u = clamp((e - SURGE_AT - q.d * SPREAD) / SURGE);
        if (u > 0) {
          if (u >= 1) continue;
          const v = u * u * u, tx = fx + (cx - fx) * v, ty = fy + (cy - fy) * v;
          const len = 30 * Math.sin(u * Math.PI), dx = fx - tx, dy = fy - ty, dl = Math.hypot(dx, dy) || 1;
          trails[q.col === 2 ? 1 : 0].moveTo(tx, ty); trails[q.col === 2 ? 1 : 0].lineTo(tx + dx / dl * len, ty + dy / dl * len);
          fx = tx; fy = ty; rad *= 1 - 0.6 * v;
        }
        px = fx; py = fy;
      } else if (mode === 'disperse') {
        // explode from the center, then fly home to the (rotating) sphere
        const ex = cx + Math.cos(q.ea) * ringR * q.er, ey = cy + Math.sin(q.ea) * ringR * q.er * 0.72;
        const b = outExpo(clamp(e / BLAST));
        let fx = cx + (ex - cx) * b, fy = cy + (ey - cy) * b;
        if (e < BLAST * 0.6) { // streaks flying outward
          const len = 34 * (1 - e / (BLAST * 0.6)), dx = fx - cx, dy = fy - cy, dl = Math.hypot(dx, dy) || 1;
          trails[q.col === 2 ? 1 : 0].moveTo(fx, fy); trails[q.col === 2 ? 1 : 0].lineTo(fx - dx / dl * len, fy - dy / dl * len);
        }
        const v = inOut(clamp((e - BLAST - q.d * BACK_SPREAD) / BACK));
        fx += (px - fx) * v; fy += (py - fy) * v;
        al = 0.92 + (al - 0.92) * v;
        px = fx; py = fy;
      }
      const lv = al < 0.37 ? 0 : al < 0.52 ? 1 : al < 0.67 ? 2 : al < 0.83 ? 3 : 4;
      const pa = paths[q.col][lv]; pa.moveTo(px + rad, py); pa.arc(px, py, rad, 0, 6.283);
    }
    for (let ci = 0; ci < 3; ci++) for (let li = 0; li < 5; li++) { ctx.fillStyle = STY[ci][li]; ctx.fill(paths[ci][li]); }
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = 'rgba(92,225,230,.35)'; ctx.stroke(trails[0]);
    ctx.strokeStyle = 'rgba(245,199,107,.45)'; ctx.stroke(trails[1]);

    if (mode === 'assemble' && e > SURGE_AT) {
      const bb = clamp((e - SURGE_AT) / (SURGE + SPREAD)), f = clamp((e - A_END) / FLASH);
      glowR = 30 + bb * 100 + f * 200; glow = Math.min(1, bb * 1.3) * (1 - f);
      if (!fired && e >= SURGE_AT + SURGE * 0.7) { fired = true; cb.onForm?.(); }
      if (f >= 1) { mode = 'hidden'; cb.onDone?.(); ctx.clearRect(0, 0, W, H); return; }
    }
    if (mode === 'disperse') {
      const f = clamp(e / 380); glowR = 60 + f * 260; glow = 1 - f;
      if (e > D_END) { mode = 'idle'; cb.onDone?.(); }
    }
    if (glow > 0.01) {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      gr.addColorStop(0, `rgba(220,240,255,${0.85 * glow})`); gr.addColorStop(0.35, `rgba(92,160,255,${0.45 * glow})`); gr.addColorStop(1, 'rgba(30,120,250,0)');
      ctx.fillStyle = gr; ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2);
    }
    kick();
  }
  kick();
  return {
    assemble(onForm, onDone) { if (mode !== 'idle') return false; mode = 'assemble'; t0 = performance.now(); fired = false; cb = { onForm, onDone }; pts.forEach((q) => (q.a = 0)); kick(); return true; },
    disperse(onDone) { mode = 'disperse'; t0 = performance.now(); cb = { onDone }; kick(); },
    hit(x, y) { const b = canvas.getBoundingClientRect(); return Math.hypot(x - (b.left + b.width / 2), y - (b.top + b.height / 2)) < Math.min(b.width, b.height) * r * 1.15; },
    get mode() { return mode; },
  };
};
