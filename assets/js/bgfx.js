// Background layers for the round-5 color themes (mockups only).
// stars(color, {n, drift}) -> twinkling star / dust canvas behind everything.
window.bgStars = function (rgb, { n = 260, drift = 0, size = 1.2 } = {}) {
  const c = document.createElement('canvas');
  c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:0;pointer-events:none';
  document.body.prepend(c);
  const ctx = c.getContext('2d'), dpr = Math.min(devicePixelRatio, 2);
  let W, H; const fit = () => { W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; }; fit(); addEventListener('resize', fit);
  const s = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * size + 0.25, p: Math.random() * 6.28, v: 0.4 + Math.random() * 1.6 }));
  (function f(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    for (const q of s) {
      if (drift) { q.y -= drift * q.v * 0.0004; if (q.y < -0.02) { q.y = 1.02; q.x = Math.random(); } }
      const a = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 0.001 * q.v + q.p));
      ctx.fillStyle = `rgba(${rgb},${(a * 0.8).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(q.x * W, q.y * H, q.r, 0, 6.283); ctx.fill();
    }
    requestAnimationFrame(f);
  })(0);
};
