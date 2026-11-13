/* Layar judul + pilih level. */
(function () {
  'use strict';
  var KS = window.KS, S = window.KS_STR, h = KS.h, A = KS_ASSETS.img;

  KS.scene('title', function (root) {
    root.classList.add('title');
    root.appendChild(h('img', { class: 'bg kenburns', src: A.keyart, alt: S.judul + ': ' + S.tagline }));
    root.appendChild(h('div', { class: 'tagline' }, S.tagline));
    KS.corner(root);
    var go = function (mode) { KS.audio.unlock(); KS.go('select', { mode: mode }); };
    var strip = h('div', { class: 'panel strip' },
      KS.btn(S.btn.santai, 'g santai', function () { go('santai'); }),
      KS.btn(S.btn.mulai, 'e mulai', function () { go('normal'); }),
      h('div', { class: 'trio' }, KS.btn(S.btn.info, 'k', KS.openInfo), KS.btn(S.btn.ref, 'k', KS.openRef), KS.btn(S.btn.dev, 'k', KS.openDev)));
    root.appendChild(strip);
    KS.audio.play('judul');
    KS.wait(0.1, function () { var m = root.querySelector('.mulai'); if (m && !KS.modalOpen) try { m.focus({ preventScroll: true }); } catch (e) {} });
    return {};
  });

  KS.scene('select', function (root, P) {
    P = P || {}; var mode = P.mode || 'normal', prog = KS.store.get('prog', {}), SL = S.level;
    root.classList.add('select');
    root.appendChild(h('img', { class: 'bg', src: A.bgJudul, alt: '' }));
    root.appendChild(h('div', { class: 'ribbon' }, SL.judul));
    KS.corner(root);
    var modeBtn = KS.btn('', 'k modebtn', function () { mode = mode === 'normal' ? 'santai' : 'normal'; upd(); });
    function upd() { modeBtn.textContent = SL.mode + ': ' + (mode === 'normal' ? SL.normal : SL.santai); }
    upd(); root.appendChild(modeBtn);
    root.appendChild(KS.btn(S.main.kamus, 'k kamusbtn2', KS.openKamus));
    var toast = h('div', { class: 'panel lvtoast', role: 'status', 'aria-live': 'polite' }), toastT = null;
    function say(text, cls) {
      toast.textContent = text; toast.className = 'panel lvtoast on ' + (cls || ''); void toast.offsetWidth;
      if (toastT) toastT.cancel(); toastT = KS.wait(2.6, function () { toast.classList.remove('on'); });
    }
    /* level berikutnya yang perlu dimainkan */
    var nextId = 0; KS_JADWAL.level.forEach(function (L) { if (!nextId && KS.levelOpen(L.id) && !KS.levelDone(L.id)) nextId = L.id; });
    /* level yang baru terbuka sejak kunjungan terakhir -> animasi buka gembok (sekali saja) */
    var openIds = KS_JADWAL.level.filter(function (L) { return KS.levelOpen(L.id); }).map(function (L) { return L.id; });
    var seen = KS.store.get('seenOpen', null) || openIds.slice(), fresh = openIds.filter(function (id) { return seen.indexOf(id) < 0; });
    KS.store.set('seenOpen', openIds);
    var row = h('div', { class: 'cards' }), cardEls = {};
    function lockedTap(L) {
      var need = L.id - 1, direct = KS.levelOpen(need), tgt = direct ? need : nextId, c = cardEls[L.id], nc = cardEls[tgt];
      KS.audio.sfx('wrong');
      c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake');
      say((direct ? SL.kunciPesan : SL.kunciMulai).replace('{a}', L.id).replace('{n}', tgt), 'warn');
      if (nc) { nc.classList.remove('needed'); void nc.offsetWidth; nc.classList.add('needed'); KS.wait(2.4, function () { nc.classList.remove('needed'); }); }
    }
    KS_JADWAL.level.forEach(function (L, i) {
      var pv = prog['L' + L.id], stars = (typeof pv === 'number') ? pv : (pv && pv.s) || 0, open = KS.levelOpen(L.id), done = KS.levelDone(L.id);
      var clock = KS.makeClock({ start: [7 * 60, 7 * 60 + 30, 8 * 60 + 45, 9 * 60 + 30, 10 * 60 + 15][i], label: '' });
      var st = h('div', { class: 'stars', html: [0, 1, 2].map(function (k) { return KS.starSVG(k < stars, 34); }).join('') });
      var c = KS.btn('', 'card' + (open ? '' : ' locked') + (L.id === nextId ? ' next' : '') + (done ? ' done' : ''),
        function () { if (KS.levelOpen(L.id)) KS.go('play', { mode: mode, level: L.id }); else lockedTap(L); },
        { 'aria-label': 'Level ' + L.id + ' ' + L.nama + (open ? (done ? ', ' + SL.selesai : '') : ', ' + SL.terkunci + '. ' + SL.kunci + (L.id - 1)), 'aria-disabled': open ? false : 'true' });
      c.append(h('div', { class: 'cn' }, 'Level ' + L.id), clock.el, h('div', { class: 'cname' }, L.nama),
        open ? st : h('div', { class: 'soon' }, h('span', { class: 'lock', html: KS.icons.lock }), SL.kunci + (L.id - 1)));
      if (done) c.appendChild(h('span', { class: 'badge ok', html: KS.icons.check }));
      if (L.id === nextId) c.appendChild(h('span', { class: 'badge go' }, SL.main));
      if (fresh.indexOf(L.id) >= 0 && L.id > 1) c.appendChild(h('span', { class: 'unlockfx', html: KS.icons.lockOpen }));
      cardEls[L.id] = c; row.appendChild(c);
    });
    root.appendChild(row); root.appendChild(toast);
    if (fresh.length && fresh[0] > 1) KS.wait(0.45, function () { KS.audio.sfx('star', 2); say(SL.terbuka.replace('{n}', fresh[fresh.length - 1]), 'good'); });
    if (P.locked && cardEls[P.locked]) KS.wait(0.4, function () { lockedTap(KS_JADWAL.level[P.locked - 1]); });
    if (KS.certReady()) root.appendChild(KS.btn(S.sertifikat.tombol, 'e certbtn', function () { KS.go('cert', { mode: mode }); }));
    root.appendChild(KS.btn(S.btn.kembali, 'e backbtn', function () { KS.go('title'); }));
    KS.audio.play('judul');
    return {};
  });
})();
