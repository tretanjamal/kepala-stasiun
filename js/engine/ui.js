/* Modal (Informasi, Referensi, Pengembang, Pengaturan) + tombol umum. */
(function () {
  'use strict';
  var KS = window.KS, S = window.KS_STR, h = KS.h;
  var stack = [];

  /* ikon roda gigi: 8 gigi dihitung dari geometri agar presisi */
  function gearPath() {
    var n = 8, ro = 17, ri = 12.6, tt = 0.17, tr = 0.27, d = '', i, c;
    function pt(r, a) { return (r * Math.sin(a)).toFixed(2) + ' ' + (-r * Math.cos(a)).toFixed(2); }
    for (i = 0; i < n; i++) {
      c = i * 2 * Math.PI / n;
      d += (i ? 'L' : 'M') + pt(ri, c - tr) + 'L' + pt(ro, c - tt) + 'L' + pt(ro, c + tt) + 'L' + pt(ri, c + tr) + 'A' + ri + ' ' + ri + ' 0 0 1 ' + pt(ri, c + 2 * Math.PI / n - tr);
    }
    return d + 'Z';
  }
  KS.gearSVG = '<svg width="40" height="40" viewBox="-20 -20 40 40" aria-hidden="true"><path fill="#3A2A1F" fill-rule="evenodd" d="' + gearPath() + 'M5.2 0A5.2 5.2 0 1 0-5.2 0A5.2 5.2 0 1 0 5.2 0Z"/></svg>';
  KS.icons = {
    full: '<svg width="38" height="38" viewBox="-20 -20 40 40" aria-hidden="true"><path d="M-14-5V-14H-5M5-14H14V-5M14 5V14H5M-5 14H-14V5" fill="none" stroke="#3A2A1F" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fullExit: '<svg width="38" height="38" viewBox="-20 -20 40 40" aria-hidden="true"><path d="M-14-6H-6V-14M6-14V-6H14M14 6H6V14M-6 14V6H-14" fill="none" stroke="#3A2A1F" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    musik: '<svg width="38" height="38" viewBox="-20 -20 40 40" aria-hidden="true"><path d="M-3-12L11-15V8" fill="none" stroke="#3A2A1F" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M-3-12V10" stroke="#3A2A1F" stroke-width="4.5" stroke-linecap="round"/><ellipse cx="-8" cy="11" rx="6" ry="5" fill="#3A2A1F"/><ellipse cx="6" cy="9" rx="6" ry="5" fill="#3A2A1F"/></svg>',
    musikOff: '<svg width="38" height="38" viewBox="-20 -20 40 40" aria-hidden="true"><path d="M-3-12L11-15V8" fill="none" stroke="#3A2A1F" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M-3-12V10" stroke="#3A2A1F" stroke-width="4.5" stroke-linecap="round"/><ellipse cx="-8" cy="11" rx="6" ry="5" fill="#3A2A1F"/><ellipse cx="6" cy="9" rx="6" ry="5" fill="#3A2A1F"/><path d="M-17 -17L17 17" stroke="#B5442E" stroke-width="5" stroke-linecap="round"/><path d="M-17 -17L17 17" stroke="#FFF3D6" stroke-width="1.5" stroke-linecap="round" opacity=".6"/></svg>',
    lock: '<svg width="30" height="30" viewBox="-20 -20 40 40" aria-hidden="true"><rect x="-12" y="-2" width="24" height="18" rx="4" fill="#7a6a58"/><path d="M-7-2V-8a7 7 0 0 1 14 0V-2" fill="none" stroke="#7a6a58" stroke-width="4.5"/></svg>',
    check: '<svg width="30" height="30" viewBox="-20 -20 40 40" aria-hidden="true"><path d="M-11 0L-3 8L12-9" fill="none" stroke="#FFFDF7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lockOpen: '<svg width="96" height="96" viewBox="-24 -26 48 52" aria-hidden="true"><rect x="-15" y="-1" width="30" height="23" rx="5" fill="#F4B73F" stroke="#3A2A1F" stroke-width="3.5"/><path class="shackle" d="M-9-1V-10a9 9 0 0 1 18 0V-6" fill="none" stroke="#3A2A1F" stroke-width="5" stroke-linecap="round"/><circle cy="9" r="3.5" fill="#3A2A1F"/></svg>',
    home: '<svg width="38" height="38" viewBox="-20 -20 40 40" aria-hidden="true"><path d="M-14 0L0-13L14 0M-10-3V13H-3V4H3V13H10V-3" fill="none" stroke="#3A2A1F" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  /* layar penuh */
  KS.fsSupported = function () { var d = document, e = d.documentElement; return !!(d.fullscreenEnabled || d.webkitFullscreenEnabled) && !!(e.requestFullscreen || e.webkitRequestFullscreen); };
  KS.inFS = function () { return !!(document.fullscreenElement || document.webkitFullscreenElement); };
  KS.toggleFS = function () {
    var d = document, e = d.documentElement, r;
    try { r = KS.inFS() ? (d.exitFullscreen || d.webkitExitFullscreen).call(d) : (e.requestFullscreen || e.webkitRequestFullscreen).call(e); if (r && r.catch) r.catch(function () {}); } catch (x) {}
  };
  var upd = [];
  KS.syncCorner = function () { upd = upd.filter(function (f) { return f.el.isConnected; }); upd.forEach(function (f) { f.fn(); }); };
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) { document.addEventListener(ev, KS.syncCorner); });
  /* tombol pojok kanan atas: [menu] [musik] [layar penuh] [pengaturan] */
  KS.corner = function (root, o) {
    o = o || {}; var wrap = h('div', { class: 'corner' }), U = S.ui;
    if (o.home) { var hb = KS.btn('', 'k round', o.home, { 'aria-label': U.menu }); hb.innerHTML = KS.icons.home; wrap.appendChild(hb); }
    var mb = KS.btn('', 'k round', function () { KS.settings.musik = !KS.settings.musik; KS.applySettings(); KS.audio.sync(); KS.syncCorner(); }, { 'aria-pressed': 'true' });
    function um() { var on = !!KS.settings.musik; mb.innerHTML = on ? KS.icons.musik : KS.icons.musikOff; mb.setAttribute('aria-label', on ? U.musikOn : U.musikOff); mb.setAttribute('aria-pressed', on); }
    um(); wrap.appendChild(mb); upd.push({ el: mb, fn: um });
    if (KS.fsSupported()) {
      var fb = KS.btn('', 'k round', KS.toggleFS);
      function uf() { var on = KS.inFS(); fb.innerHTML = on ? KS.icons.fullExit : KS.icons.full; fb.setAttribute('aria-label', on ? U.keluarLayar : U.layarPenuh); }
      uf(); wrap.appendChild(fb); upd.push({ el: fb, fn: uf });
    }
    var gb = KS.btn('', 'k round', function () { KS.openSettings(); }, { 'aria-label': S.btn.pengaturan }); gb.innerHTML = KS.gearSVG; wrap.appendChild(gb);
    root.appendChild(wrap); return wrap;
  };
  KS.confirmExit = function (onExit) {
    var U = S.ui, ex = KS.btn(U.keluar, 'b', function () { m.close(); onExit(); });
    ex.style.position = 'static'; ex.style.width = '260px';
    var body = h('div', { class: 'mbody' }, h('p', { class: 'cite' }, U.keluarIsi), h('div', { style: 'margin-top:20px;display:flex;justify-content:center' }, ex));
    var m = KS.modal(U.keluarJudul, body, { cls: 'set' }); return m;
  };

  /* buka modal; isi: elemen; opsi { cls, nav: {prev,next} } */
  KS.modal = function (title, content, opt) {
    opt = opt || {};
    var stage = document.getElementById('stage');
    var prevFocus = document.activeElement;
    var back = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title });
    var close = KS.btn(S.btn.kembali, 'e close', function () { api.close(); });
    var panel = h('div', { class: 'panel mpanel ' + (opt.cls || '') }, h('h2', null, title), content, h('div', { class: 'mfoot' }, close));
    back.appendChild(panel);
    if (opt.nav) {
      back.appendChild(KS.btn('\u2039', 'k round navL', function () { opt.nav(-1); }, { 'aria-label': 'Sebelumnya' }));
      back.appendChild(KS.btn('\u203A', 'k round navR', function () { opt.nav(1); }, { 'aria-label': 'Berikutnya' }));
    }
    stage.appendChild(back); KS.modalOpen++;
    requestAnimationFrame(function () { back.classList.add('in'); });
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); api.close(); }
      else if (opt.nav && e.key === 'ArrowLeft' && !e.target.closest('[role=slider]')) opt.nav(-1);
      else if (opt.nav && e.key === 'ArrowRight' && !e.target.closest('[role=slider]')) opt.nav(1);
      else if (e.key === 'Tab') {
        var f = back.querySelectorAll('button:not([disabled])'); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);
    var api = { el: back, panel: panel, closed: false,
      close: function () {
        if (api.closed) return; api.closed = true; KS.modalOpen--; document.removeEventListener('keydown', onKey, true);
        back.classList.remove('in'); setTimeout(function () { back.remove(); }, KS.reduce ? 10 : 220);
        try { prevFocus && prevFocus.focus && prevFocus.focus(); } catch (e) {}
        if (opt.onClose) opt.onClose();
      } };
    close.focus();
    return api;
  };

  KS.openInfo = function () {
    var I = S.info;
    var body = h('div', { class: 'mbody' },
      h('div', { class: 'blk' }, h('b', null, I.tpLabel), h('p', null, I.tp)),
      h('div', { class: 'two' },
        h('div', { class: 'blk' }, h('b', null, I.mapelLabel), h('p', null, I.mapel)),
        h('div', { class: 'blk' }, h('b', null, I.topikLabel), h('p', null, I.topik))),
      h('div', { class: 'blk' }, h('b', null, I.panduanLabel), h('ol', null, I.panduan.map(function (t) { return h('li', null, t); }))));
    return KS.modal(I.judul, body, { cls: 'info' });
  };
  KS.openRef = function () {
    var R = S.ref;
    var src = h('div', { class: 'rcard' }, h('div', { class: 'rhd' }, R.sumberLabel), R.sumber.map(function (x, i) {
      return h('div', { class: 'rit' }, h('span', { class: 'rn' }, String(i + 1)), h('p', null, h('b', null, x.a + ' '), h('i', null, x.t + ' '), x.p)); }));
    var ai = h('div', { class: 'rcard ai' }, h('div', { class: 'rhd' }, R.aiLabel), h('p', { class: 'rp' }, R.ai),
      h('div', { class: 'chips2' }, R.aiList.map(function (x) { return h('div', { class: 'ch' }, h('b', null, x[0]), x[1]); })));
    var ruj = h('div', { class: 'rcard ai wide' }, h('div', { class: 'rit' }, h('span', { class: 'rn' }, '\u2022'), h('p', null, h('b', null, R.aiRujukanLabel + ': '), R.aiRujukan)));
    return KS.modal(R.judul, h('div', { class: 'mbody rbody' }, h('div', { class: 'rcols' }, h('div', { class: 'rcol L' }, src, ruj), ai)), { cls: 'ref' });
  };
  KS.openDev = function () {
    var D = S.dev, idx = 0, box = h('div', { class: 'mbody devbody' }), ind = h('span', { class: 'ind' });
    var m;
    function render(dir) {
      var p = D.orang[idx];
      box.innerHTML = ''; box.classList.remove('slideL', 'slideR'); void box.offsetWidth; if (dir) box.classList.add(dir > 0 ? 'slideR' : 'slideL');
      box.appendChild(h('img', { class: 'foto', src: p.foto, alt: 'Foto ' + p.nama, width: 220, height: 220 }));
      var info = h('div', { class: 'devinfo' }, h('div', { class: 'nama' }, p.nama), h('div', { class: 'inst' }, p.instansi));
      if (p.email) info.appendChild(h('div', null, p.email));
      if (p.ig) info.appendChild(h('div', { class: 'igrow' }, h('img', { class: 'igicon', src: KS_ASSETS.img.ikonIG, alt: p.igLabel, width: 30, height: 30 }), h('span', null, p.ig)));
      if (p.prestasi) info.appendChild(h('div', { class: 'blk' }, h('b', null, p.prestasiLabel), h('ul', null, p.prestasi.map(function (t) { return h('li', null, t); }))));
      if (p.tahun) info.appendChild(h('div', { class: 'tahun' }, p.tahun));
      box.appendChild(info);
      ind.textContent = (idx + 1) + ' / ' + D.orang.length;
    }
    function nav(d) { idx = (idx + d + D.orang.length) % D.orang.length; render(d); }
    render(0);
    var wrap = h('div', null, h('div', { class: 'indrow' }, ind), box);
    m = KS.modal(D.judul, wrap, { cls: 'dev', nav: nav });
    return m;
  };
  KS.openKamus = function () {
    var K = S.kamus, W = KS.waktu, g = h('div', { class: 'kgrid' });
    K.kartu.forEach(function (t, i) {
      var c = KS.makeClock({ start: t[0] * 60 + t[1], label: W.toWords(t[0], t[1], 0) });
      g.appendChild(h('div', { class: 'kc' }, c.el, h('b', null, W.toWords(t[0], t[1], 0)), h('span', null, W.fmt(t[0], t[1])), h('span', { class: 'id' }, K.ket[i])));
    });
    var days = h('div', { class: 'kdays' });
    KS_JADWAL.hari.forEach(function (d, i) { days.appendChild(h('div', { class: 'kd' + ((i === 1 || i === 3) ? ' tt' : '') }, h('b', null, KS.gen.ABBR[i]), h('span', null, d), h('span', { class: 'id' }, K.hariId[i]))); });
    var body = h('div', { class: 'mbody' }, h('div', { class: 'blk' }, h('b', null, K.waktu)), g, h('div', { class: 'blk' }, h('b', null, K.hari)), days, h('p', { class: 'cite' }, K.catat));
    return KS.modal(K.judul, body, { cls: 'kamus' });
  };
  KS.openSettings = function () {
    var T = S.setelan, rows = h('div', { class: 'mbody setrows' });
    [['musik', T.musik], ['suara', T.suara], ['kurangi', T.kurangi], ['teks', T.teks]].forEach(function (r) {
      var b = KS.btn('', 'toggle', null, { role: 'switch' });
      function upd() { var on = !!KS.settings[r[0]]; b.textContent = on ? T.on : T.off; b.classList.toggle('g', on); b.classList.toggle('k', !on); b.setAttribute('aria-checked', on); }
      b.addEventListener('click', function () { KS.settings[r[0]] = !KS.settings[r[0]]; upd(); KS.applySettings(); KS.audio.sync(); KS.syncCorner(); if (r[0] === 'suara' && !KS.settings.suara) KS.speech.cancel(); });
      upd(); rows.appendChild(h('div', { class: 'setrow' }, h('span', null, r[1]), b));
    });
    return KS.modal(T.judul, rows, { cls: 'set' });
  };
})();
