// ⌘K command palette shared by the round-2 mockups.
const css = `
.pal-bg{position:fixed;inset:0;z-index:50;background:rgba(3,4,8,.55);backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;padding-top:16vh}
.pal-bg.on{display:flex}
.pal{width:600px;max-width:92vw;border-radius:18px;background:rgba(14,17,28,.92);border:1px solid rgba(255,255,255,.12);box-shadow:0 40px 80px -20px #000;overflow:hidden;animation:palin .25s cubic-bezier(.2,.8,.2,1)}
@keyframes palin{from{transform:translateY(-8px) scale(.98);opacity:0}}
.pal input{width:100%;height:58px;padding:0 20px;background:none;border:0;border-bottom:1px solid rgba(255,255,255,.08);color:#eef0f7;font:400 17px var(--body);outline:0}
.pal ul{list-style:none;margin:0;padding:8px;max-height:360px;overflow:auto}
.pal li{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;cursor:pointer;color:#cfd3e1;font-size:15px}
.pal li .g{font:500 11px var(--mono);color:#5a6075;margin-left:auto;text-transform:uppercase;letter-spacing:.08em}
.pal li .i .ic{width:15px;height:15px}
.pal li .i{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;font:700 12px var(--mono);background:rgba(91,124,255,.18);color:#9fb4ff}
.pal li.sel{background:rgba(91,124,255,.16);color:#fff}
.pal li.secret .i{background:linear-gradient(140deg,#1e78fa,#0b3c9a);color:#fff}
.pal .ft{display:flex;gap:16px;padding:10px 16px;border-top:1px solid rgba(255,255,255,.08);font:500 11.5px var(--mono);color:#5a6075}
`;
export const ITEMS = [
  ['Ora', 'Project', 'O', '/ora/'], ['EricOS', 'Project', '>_', '/ericos/'], ['Roblox MMORPG', 'Project', '<svg class="ic" aria-hidden="true"><use href="/assets/icons.svg#i-roblox"/></svg>', '/roblox/'],
  ['Resume (PDF)', 'Download', '<svg class="ic" aria-hidden="true"><use href="/assets/icons.svg#i-resume"/></svg>', '/resume.pdf', true], ['About me', 'Page', 'EZ', '/about/'], ['IEEE SPS', 'Experience', 'IE', '/about/#ieee'],
  ['Email', 'Contact', '<svg class="ic" aria-hidden="true"><use href="/assets/icons.svg#i-mail"/></svg>', 'mailto:imericzhu@gmail.com'], ['LinkedIn', 'Contact', '<svg class="ic" aria-hidden="true"><use href="/assets/icons.svg#i-linkedin"/></svg>', 'https://linkedin.com/in/ezhu05', true], ['GitHub', 'Contact', '<svg class="ic" aria-hidden="true"><use href="/assets/icons.svg#i-github"/></svg>', 'https://github.com/zhue1', true],
  ['Home', 'Page', '⌂', '/'],
];
export function palette({ onOrbi, items = ITEMS } = {}) {
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  const bg = document.createElement('div'); bg.className = 'pal-bg';
  bg.innerHTML = `<div class="pal"><input aria-label="Search the site" placeholder="Jump to a project, resume, contact…"><ul></ul><div class="ft"><span>↑↓ move</span><span>↵ open</span><span>esc close</span></div></div>`;
  document.body.appendChild(bg);
  const input = bg.querySelector('input'), ul = bg.querySelector('ul');
  let sel = 0, shown = [];
  const render = () => {
    const q = input.value.toLowerCase().trim();
    shown = items.filter(([n, g]) => !q || (n + g).toLowerCase().includes(q));
    if (q.includes('orb') && onOrbi) shown.unshift(['Summon Orbi', 'Secret', '✦', null, false, true]);
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    ul.innerHTML = shown.map(([n, g, i, , , secret], k) => `<li class="${k === sel ? 'sel' : ''} ${secret ? 'secret' : ''}" data-k="${k}"><span class="i">${i}</span>${n}<span class="g">${g}</span></li>`).join('') || '<li>No matches</li>';
  };
  const pick = (k) => { const it = shown[k]; if (!it) return; close(); if (it[5]) return onOrbi?.(); if (it[4]) window.open(it[3], '_blank', 'noopener'); else location.href = it[3]; };
  const open = (q = '') => { bg.classList.add('on'); input.value = q; sel = 0; render(); setTimeout(() => input.focus(), 10); };
  const close = () => bg.classList.remove('on');
  input.oninput = () => { sel = 0; render(); };
  ul.onclick = (e) => { const li = e.target.closest('li'); if (li) pick(+li.dataset.k); };
  bg.onclick = (e) => { if (e.target === bg) close(); };
  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); bg.classList.contains('on') ? close() : open(); }
    if (!bg.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowDown') { sel = Math.min(shown.length - 1, sel + 1); render(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); render(); e.preventDefault(); }
    if (e.key === 'Enter') pick(sel);
  });
  return { open, close };
}
