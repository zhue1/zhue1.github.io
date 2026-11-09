const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- hero name: split into letters ---------- */
let i = 0;
$$('.name .line').forEach((line) => {
  const nodes = [...line.childNodes];
  line.textContent = '';
  nodes.forEach((n) => {
    if (n.nodeType === 3) {
      [...n.textContent].forEach((c) => {
        const s = document.createElement('span');
        s.className = 'ch'; s.textContent = c; s.style.setProperty('--i', i++);
        line.appendChild(s);
      });
    } else {
      n.classList.add('ch'); n.style.setProperty('--i', i++); line.appendChild(n);
    }
  });
});
const hero = $('.hero');
(document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(() => hero.classList.add('ready')));
setTimeout(() => hero.classList.add('ready'), 1200);

/* ---------- role typer ---------- */
const roles = ['Founder & engineer @ Orbi Labs', 'Full-stack & AI engineer', 'CS @ University of Florida', 'Backend & data systems'];
const roleEl = $('#role');
if (!reduce) {
  let r = 0;
  const type = async () => {
    await wait(2600);
    const cur = roles[r];
    for (let k = cur.length; k >= 0; k--) { roleEl.textContent = cur.slice(0, k); await wait(18); }
    r = (r + 1) % roles.length;
    const next = roles[r];
    for (let k = 1; k <= next.length; k++) { roleEl.textContent = next.slice(0, k); await wait(38); }
    type();
  };
  type();
}
function wait(ms) { return new Promise((res) => setTimeout(res, ms)); }

/* ---------- nav ---------- */
const nav = $('.nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- reveal, counters, scramble ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('in');
    $$('[data-count]', el).forEach(countUp);
    $$('.scramble', el).forEach(scramble);
    io.unobserve(el);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
$$('.reveal').forEach((el) => io.observe(el));

function countUp(el) {
  const to = +el.dataset.count, t0 = performance.now(), dur = reduce ? 0 : 1600;
  const f = (t) => {
    const p = dur ? Math.min(1, (t - t0) / dur) : 1;
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))).toLocaleString('en-US');
    if (p < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
function scramble(el) {
  if (reduce || el.dataset.done) return;
  el.dataset.done = 1;
  const final = el.textContent; let frame = 0;
  const total = 26;
  const tick = () => {
    let out = '';
    for (let k = 0; k < final.length; k++) {
      const settle = (k / final.length) * total * 0.7 + 6;
      out += frame >= settle ? final[k] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (frame++ < total) requestAnimationFrame(tick); else el.textContent = final;
  };
  tick();
}

/* ---------- Ora phone: screens + tilt ---------- */
const imgs = $$('.phone-screen img');
const tabs = $$('.tabs button');
const tabBar = $('.tabs');
let cur = 0, timer;
const DWELL = 3200;
function show(n, user) {
  imgs[cur].classList.remove('on'); tabs[cur].setAttribute('aria-selected', 'false');
  cur = n;
  imgs[cur].classList.add('on'); tabs[cur].setAttribute('aria-selected', 'true');
  clearTimeout(timer);
  if (user) tabBar.classList.add('paused');
  if (!reduce && !tabBar.classList.contains('paused')) timer = setTimeout(() => show((cur + 1) % imgs.length), DWELL);
}
tabBar.style.setProperty('--dwell', DWELL + 'ms');
tabs.forEach((b, n) => b.addEventListener('click', () => show(n, true)));
new IntersectionObserver(([e]) => {
  clearTimeout(timer);
  if (e.isIntersecting && !reduce && !tabBar.classList.contains('paused')) timer = setTimeout(() => show((cur + 1) % imgs.length), DWELL);
}).observe($('#phone'));

const phone = $('#phone');
if (finePointer && !reduce) {
  const stage = $('.ora-stage');
  stage.addEventListener('pointermove', (e) => {
    const r = phone.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    phone.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`;
    phone.querySelector('.phone-shine').style.setProperty('--shine', `${50 + x * 80}%`);
  });
  stage.addEventListener('pointerleave', () => { phone.style.transform = ''; });
}

/* ---------- terminal log ---------- */
const LOG = [
  ['06:58', 'morning-brief', 'built in 41s', 'ok'],
  ['07:00', 'deadlines', '3 due this week', 'ok'],
  ['09:00', 'job-scan', '3,300+ postings swept', ''],
  ['09:04', 'job-scan', 'scams dropped · ranked', 'ok'],
  ['10:12', 'planner', 'split across 3 agents', 'k'],
  ['10:12', 'agent wt/1', 'failing test first', ''],
  ['10:29', 'agent wt/2', 'hook blocked force-push', 'g'],
  ['10:31', 'linux-worker', 'suite green over ssh', 'ok'],
  ['10:34', 'verifier', 'mutation caught', 'ok'],
  ['10:35', 'gh', 'PR opened · checks pass', 'ok'],
];
const logEl = $('#log');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function lineHTML([t, who, msg, cls], partial) {
  const mark = cls === 'ok' ? ' <span class="ok">✓</span>' : cls === 'g' ? ' <span class="g">⚑</span>' : '';
  return `<span class="t">${t}</span> <span class="k">${who.padEnd(14)}</span>${esc(partial ?? msg)}${partial == null ? mark : ''}`;
}
async function runLog() {
  if (reduce) { logEl.innerHTML = LOG.map((l) => lineHTML(l)).join('\n'); return; }
  for (;;) {
    const done = [];
    for (const l of LOG) {
      for (let k = 0; k <= l[2].length; k += 2) {
        logEl.innerHTML = [...done, lineHTML(l, l[2].slice(0, k))].join('\n') + '<span class="caret"></span>';
        await wait(16);
      }
      done.push(lineHTML(l));
      logEl.innerHTML = done.join('\n');
      await wait(380);
    }
    await wait(3500);
  }
}
let logStarted = false;
new IntersectionObserver(([e]) => { if (e.isIntersecting && !logStarted) { logStarted = true; runLog(); } }, { threshold: 0.3 }).observe($('.term'));

/* ---------- pointer: glow, magnetic, spotlight ---------- */
if (finePointer && !reduce) {
  document.documentElement.classList.add('has-pointer');
  const glow = $('.glow');
  addEventListener('pointermove', (e) => { glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; }, { passive: true });

  $$('.magnetic').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; b.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)'; setTimeout(() => (b.style.transition = ''), 500); });
  });
  $$('.card, .tile').forEach((c) => c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));
}

/* ---------- WebGL particle field ---------- */
initField().catch((err) => console.warn('field off:', err));

async function initField() {
  if (reduce) return;
  const canvas = $('#field');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return;
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');

  const mobile = innerWidth < 760;
  const N = mobile ? 4200 : 9000;
  const renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight, false);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 7;

  const rnd = mulberry(7);
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  const shapes = {
    orb() { // fibonacci sphere with a thin shell + inner core
      const a = new Float32Array(N * 3), g = Math.PI * (3 - Math.sqrt(5));
      for (let k = 0; k < N; k++) {
        const y = 1 - (k / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = g * k;
        const core = k % 9 === 0;
        const R = core ? 0.5 + rnd() * 0.6 : 1.75 + gauss() * 0.04;
        a.set([Math.cos(th) * rr * R, y * R, Math.sin(th) * rr * R], k * 3);
      }
      return a;
    },
    ring() { // tilted torus + orbit dust
      const a = new Float32Array(N * 3);
      for (let k = 0; k < N; k++) {
        const u = rnd() * Math.PI * 2, v = rnd() * Math.PI * 2;
        const dust = k % 5 === 0;
        const R = dust ? 2.9 + gauss() * 0.18 : 2.15, r = dust ? 0.02 : 0.22 + gauss() * 0.03;
        let x = (R + r * Math.cos(v)) * Math.cos(u), y = r * Math.sin(v), z = (R + r * Math.cos(v)) * Math.sin(u);
        const t = 1.15; const y2 = y * Math.cos(t) - z * Math.sin(t), z2 = y * Math.sin(t) + z * Math.cos(t);
        a.set([x, y2, z2], k * 3);
      }
      return a;
    },
    network() { // node clusters joined by edges
      const a = new Float32Array(N * 3);
      const nodes = Array.from({ length: 16 }, () => [(rnd() - 0.5) * 7.5, (rnd() - 0.5) * 4.4, (rnd() - 0.5) * 2.5]);
      const edges = [];
      nodes.forEach((p, n) => {
        const near = nodes.map((q, m) => [m, Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])]).filter(([m]) => m !== n).sort((x, y) => x[1] - y[1]);
        edges.push([n, near[0][0]], [n, near[1][0]]);
      });
      for (let k = 0; k < N; k++) {
        if (k % 3 === 0) {
          const p = nodes[k % nodes.length], s = 0.13;
          a.set([p[0] + gauss() * s, p[1] + gauss() * s, p[2] + gauss() * s], k * 3);
        } else {
          const [m, n] = edges[k % edges.length], p = nodes[m], q = nodes[n], t = rnd();
          a.set([p[0] + (q[0] - p[0]) * t + gauss() * 0.012, p[1] + (q[1] - p[1]) * t + gauss() * 0.012, p[2] + (q[2] - p[2]) * t + gauss() * 0.012], k * 3);
        }
      }
      return a;
    },
    voxel() { // blocky cube surface
      const a = new Float32Array(N * 3), G = 9, S = 1.5;
      for (let k = 0; k < N; k++) {
        const f = k % 6, ax = f >> 1, sign = f & 1 ? 1 : -1;
        const u = Math.floor(rnd() * G), v = Math.floor(rnd() * G);
        const cu = ((u + 0.5) / G * 2 - 1) * S + (rnd() - 0.5) * 0.11;
        const cv = ((v + 0.5) / G * 2 - 1) * S + (rnd() - 0.5) * 0.11;
        const p = [0, 0, 0]; p[ax] = sign * S; p[(ax + 1) % 3] = cu; p[(ax + 2) % 3] = cv;
        a.set(p, k * 3);
      }
      return a;
    },
    galaxy() { // spiral disk
      const a = new Float32Array(N * 3), arms = 3;
      for (let k = 0; k < N; k++) {
        const r = Math.pow(rnd(), 1.6) * 4.2, arm = (k % arms) / arms * Math.PI * 2, spin = r * 1.25;
        const sc = 0.32 * (1 - r / 5);
        const x = Math.cos(arm + spin) * r + gauss() * sc, z = Math.sin(arm + spin) * r + gauss() * sc, y = gauss() * 0.08 * (1.2 - r / 4.2);
        a.set([x, y, z], k * 3);
      }
      return a;
    },
  };
  const targets = Object.fromEntries(Object.entries(shapes).map(([k, f]) => [k, f()]));
  // where each shape sits on screen, as a fraction of half-width (desktop)
  const layout = { orb: [0.5, 0.05, 0.12, 0], ring: [0.45, 0, 0.35, 0], network: [0, 0, 0.2, 0], voxel: [0.55, 0, 0.6, 0.5], galaxy: [0.2, -0.38, 0.55, 0] };

  const pos = new Float32Array(N * 3);
  const start = targets.orb;
  for (let k = 0; k < N * 3; k++) pos[k] = start[k] * (2.5 + rnd() * 3); // burst in from outside
  const speed = new Float32Array(N), rand = new Float32Array(N);
  for (let k = 0; k < N; k++) { speed[k] = 0.025 + rnd() * 0.045; rand[k] = rnd(); }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));

  const uniforms = {
    uTime: { value: 0 }, uSize: { value: mobile ? 34 : 30 }, uPR: { value: renderer.getPixelRatio() },
    uMouse: { value: new THREE.Vector2(99, 99) }, uOpacity: { value: mobile ? 0.55 : 0.95 },
    uA: { value: new THREE.Color('#5b7cff') }, uB: { value: new THREE.Color('#5ce1e6') }, uC: { value: new THREE.Color('#f5c76b') },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime, uSize, uPR; uniform vec2 uMouse;
      attribute float aRand; varying float vRand; varying float vFade;
      void main() {
        vec3 p = position;
        p += 0.035 * vec3(sin(uTime * .9 + aRand * 40.), cos(uTime * .7 + aRand * 25.), sin(uTime * .8 + aRand * 13.));
        vec4 w = modelMatrix * vec4(p, 1.);
        vec2 d = w.xy - uMouse; float L = length(d);
        w.xy += normalize(d + 1e-4) * smoothstep(1.3, 0., L) * .55;
        vec4 mv = viewMatrix * w;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPR * (.45 + aRand * .9) / -mv.z;
        vRand = aRand; vFade = smoothstep(12., 4., -mv.z);
      }`,
    fragmentShader: `
      uniform vec3 uA, uB, uC; uniform float uOpacity; varying float vRand; varying float vFade;
      void main() {
        float d = length(gl_PointCoord - .5); if (d > .5) discard;
        float a = smoothstep(.5, .0, d);
        vec3 c = mix(uA, uB, smoothstep(.2, .9, vRand));
        if (vRand > .93) c = uC;
        gl_FragColor = vec4(c, a * uOpacity * (.35 + .65 * vFade));
      }`,
  });
  const pts = new THREE.Points(geo, mat);
  const group = new THREE.Group(); group.add(pts); scene.add(group);

  let shape = 'orb';
  const setShape = (s) => { if (targets[s]) shape = s; };
  const secIO = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setShape(e.target.dataset.shape)), { rootMargin: '-45% 0px -45% 0px' });
  $$('[data-shape]').forEach((s) => secIO.observe(s));

  const mouse = { x: 0, y: 0, wx: 99, wy: 99, active: false };
  addEventListener('pointermove', (e) => {
    mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = -(e.clientY / innerHeight) * 2 + 1; mouse.active = true;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.active = false; });

  const halfH = Math.tan(THREE.MathUtils.degToRad(22.5)) * 7;
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
  });

  document.documentElement.classList.add('webgl');
  const pc = $('#pcount'); if (pc) pc.textContent = `${N.toLocaleString('en-US')} particles.`;

  let last = performance.now(), rotY = 0;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    uniforms.uTime.value += dt;
    const tgt = targets[shape];
    for (let k = 0, j = 0; k < N; k++, j += 3) {
      const s = speed[k];
      pos[j] += (tgt[j] - pos[j]) * s; pos[j + 1] += (tgt[j + 1] - pos[j + 1]) * s; pos[j + 2] += (tgt[j + 2] - pos[j + 2]) * s;
    }
    geo.attributes.position.needsUpdate = true;

    const [fx, fy, , tilt] = layout[shape], halfW = halfH * camera.aspect;
    const narrow = innerWidth < 960;
    const tx = narrow ? 0 : fx * halfW, ty = narrow ? 0 : fy * halfH;
    group.position.x += (tx - group.position.x) * 0.04;
    group.position.y += (ty - group.position.y) * 0.04;
    const sc = narrow ? Math.min(1, camera.aspect * 1.25) : 1;
    group.scale.setScalar(group.scale.x + (sc - group.scale.x) * 0.05);

    rotY += dt * (shape === 'galaxy' ? 0.12 : 0.09);
    group.rotation.y = rotY + mouse.x * 0.35;
    group.rotation.x += ((shape === 'galaxy' ? 0.55 : tilt) - mouse.y * 0.25 - group.rotation.x) * 0.04;

    const mx = mouse.active ? mouse.x * halfH * camera.aspect : 99, my = mouse.active ? mouse.y * halfH : 99;
    mouse.wx += (mx - mouse.wx) * 0.12; mouse.wy += (my - mouse.wy) * 0.12;
    uniforms.uMouse.value.set(mouse.wx, mouse.wy);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function mulberry(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
