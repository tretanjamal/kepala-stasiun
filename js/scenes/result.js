/* Layar Hasil Belajarku. */
(function () {
  'use strict';
  var KS = window.KS, S = window.KS_STR, H = S.hasil, h = KS.h, A = KS_ASSETS.img;

  KS.scene('result', function (root, P) {
    root.classList.add('result');
    root.appendChild(h('img', { class: 'bg', src: A.bgJudul, alt: '' }));
    var st = P.stats || {}, stars = P.stars || [false, false, false], n = stars.filter(Boolean).length;
    var starRow = h('div', { class: 'bigstars' });
    var starEls = [0, 1, 2].map(function (i) { var s = h('div', { class: 'bs', html: KS.starSVG(false, 96) }); s.appendChild(h('small', null, H.bintangNama[i])); starRow.appendChild(s); return s; });
    var coinNum = h('b', null, '0');
    var LV = KS_JADWAL.level[(P.level || 1) - 1] || { nama: '' };
    var buw = KS.buWati(); buw.classList.add('rbuw'); buw.set(n >= 2 ? 'sorak' : 'senang');
    var left = h('div', { class: 'panel rl' }, h('h2', null, H.judul),
      h('div', { class: 'rsub' }, 'Level ' + P.level + ' · ' + LV.nama + ' · ' + (P.mode === 'santai' ? S.level.santai : S.level.normal)), starRow,
      h('div', { class: 'coinrow' }, h('span', { class: 'coinicon' }), h('span', null, H.koin + ': '), coinNum),
      h('div', { class: 'rbu' }, buw, h('div', { class: 'rbubble' }, H.pesan[n])));
    var skills = h('ul', { class: 'skills' }), tg = st.tags || {}, mast = [], todo = [];
    Object.keys(H.skill).forEach(function (k) { var o = tg[k]; if (!o) return; (o.ok / o.total >= 0.6 ? mast : todo).push(k); });
    mast.forEach(function (k) { skills.appendChild(h('li', null, H.skill[k])); });
    if (!mast.length) skills.appendChild(h('li', null, H.belum));
    if (todo.length) skills.appendChild(h('li', { class: 'todo' }, H.ulang + todo.map(function (k) { return H.nama[k]; }).join(', ') + '.'));
    var cards = h('div', { class: 'kartu' });
    var seen = {}; (st.dests || []).forEach(function (d) { if (seen[d]) return; seen[d] = 1; var t = KS.dest(d);
      cards.appendChild(h('div', { class: 'kcard' }, (KS.sprite('kartu-' + d) || (d === 'beach' && A.kartuBeach)) ? h('img', { src: KS.sprite('kartu-' + d) || A.kartuBeach, alt: 'Kartu ' + t.nama }) : h('div', { class: 'mini', html: KS.trainHTML(d, 150) }), h('small', null, t.nama))); });
    var wordsTxt = Object.keys(st.words || {}).map(function (k) { return k + ' (' + st.words[k] + 'x)'; }).join(', ') || '-';
    var teacher = h('div', { class: 'panel teacher' }, h('h3', null, H.guru),
      h('p', null, 'Level ' + P.level + ' (' + (P.mode === 'santai' ? 'Santai' : 'Normal') + '): ' + st.trains + ' kereta, ' + (st.questions || 0) + ' pertanyaan. Benar pada percobaan pertama: kereta ' + st.first + '/' + st.trains + ', pertanyaan ' + (st.qfirst || 0) + '/' + (st.questions || 0) + '. Petunjuk tingkat 3: ' + st.hint3 + 'x.'),
      h('p', null, 'Per tag (benar pertama kali): ' + Object.keys(tg).map(function (k) { return k + ' ' + tg[k].ok + '/' + tg[k].total; }).join('; ') + '.'),
      h('p', null, 'Peluit terlalu cepat ' + st.early + 'x, terlambat ' + st.late + 'x.' + (wordsTxt === '-' ? '' : ' Perlu diulang: ' + wordsTxt + '.')),
      h('p', { class: 'small' }, 'Papan memakai format Inggris 7:30 (Indonesia: 07.30).'));
    var right = h('div', { class: 'rr' }, h('div', { class: 'panel know' }, h('b', null, H.kuasai), skills, h('b', { class: 'kt' }, H.kartu), cards), teacher);
    root.append(left, right);
    var btns = h('div', { class: 'rbtns' }, KS.btn(S.btn.lagi, 'g', function () { KS.go('play', { mode: P.mode, level: P.level }); }));
    if (P.level < KS_JADWAL.level.length && KS.levelOpen(P.level + 1)) btns.appendChild(KS.btn(S.sertifikat.lanjut, 'b', function () { KS.go('play', { mode: P.mode, level: P.level + 1 }); }));
    if (KS.certReady()) btns.appendChild(KS.btn(S.sertifikat.tombol, 'e', function () { KS.go('cert', { mode: P.mode }); }));
    btns.appendChild(KS.btn(S.btn.menu, 'k', function () { KS.go('select', { mode: P.mode }); }));
    root.appendChild(btns);
    KS.audio.play('hasil');
    stars.forEach(function (on, i) { if (!on) return; var k = stars.slice(0, i).filter(Boolean).length;
      KS.wait(0.7 + k * 0.7, function () { starEls[i].querySelector('svg').outerHTML = KS.starSVG(true, 96); starEls[i].classList.add('pop'); KS.audio.sfx('star', k); }); });
    KS.wait(0.5, function () { KS.tween(1.4, function (p) { coinNum.textContent = Math.round(P.coins * p); }, KS.ease.outCubic); });
    return {};
  });
})();
