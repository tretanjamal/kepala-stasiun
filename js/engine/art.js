/* Komponen grafik SVG yang dipakai ulang: kereta, orang, Bu Wati, jam, bintang. */
(function () {
  'use strict';
  var KS = window.KS, T = '#3A2A1F';
  var ICON = {
    wave: '<path d="M-20 4 q10 -20 20 0 t20 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-20 15 q10 -14 20 0 t20 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>',
    mountain: '<path d="M-22 16 L-5 -14 L4 2 L11 -8 L24 16Z" fill="#fff" stroke="' + T + '" stroke-width="3" stroke-linejoin="round"/>',
    paw: '<g fill="#fff"><ellipse cx="0" cy="8" rx="11" ry="9"/><circle cx="-14" cy="-3" r="5"/><circle cx="-5" cy="-12" r="5"/><circle cx="6" cy="-12" r="5"/><circle cx="15" cy="-3" r="5"/></g>',
    boat: '<path d="M-20 6 H20 L12 18 H-12Z" fill="#fff"/><path d="M-1 -18 V3 H15Z" fill="#fff"/><path d="M-3 -14 L-17 3 H-3Z" fill="#fff" opacity=".8"/>',
    barn: '<path d="M-18 16 V-4 L0 -18 L18 -4 V16Z" fill="#fff"/><rect x="-7" y="2" width="14" height="14" fill="none" stroke="' + T + '" stroke-width="3"/><path d="M-7 2 L7 16 M7 2 L-7 16" stroke="' + T + '" stroke-width="2.5"/>',
    city: '<g fill="#fff"><rect x="-20" y="-2" width="12" height="18"/><rect x="-6" y="-16" width="13" height="32"/><rect x="9" y="-8" width="12" height="24"/></g><g fill="' + T + '"><rect x="-3" y="-11" width="3" height="4"/><rect x="2" y="-11" width="3" height="4"/><rect x="-3" y="-3" width="3" height="4"/><rect x="2" y="-3" width="3" height="4"/></g>',
    plane: '<g fill="#fff"><ellipse cx="0" cy="0" rx="20" ry="5"/><path d="M-4 0 L-14 -17 L-8 -17 L6 0Z"/><path d="M-4 0 L-14 17 L-8 17 L6 0Z"/><path d="M-17 0 L-22 -9 L-17 -9 L-11 0Z"/></g>',
    basket: '<path d="M-20 -3 H20 L14 16 H-14Z" fill="#fff"/><path d="M-12 -3 Q0 -24 12 -3" fill="none" stroke="#fff" stroke-width="4"/><circle cx="-6" cy="-5" r="4" fill="#E04B3A"/><circle cx="5" cy="-6" r="4" fill="#9BD24E"/>'
  };
  KS.icon = function (id) { return ICON[id] || ''; };
  KS.dest = function (id) { return KS_JADWAL.tujuan.filter(function (t) { return t.id === id; })[0]; };

  /* gambar opsional dari js/data/assets.js; bila kuncinya tidak ada, dipakai SVG bawaan */
  KS.sprite = function (key) { var A = window.KS_ASSETS && KS_ASSETS.img; return (A && A[key]) || null; };
  KS.trainHTML = function (id, w) {
    var src = KS.sprite('kereta-' + id), W = w || 520; if (!src) return KS.trainSVG(id, w);
    return '<img class="train" src="' + src + '" width="' + W + '" height="' + Math.round(W * 170 / 520) + '" alt="" draggable="false">';
  };
  KS.paxHTML = function (i, w) {
    var src = KS.sprite('penumpang-' + (i + 1)), W = w || 60; if (!src) return KS.person(Object.assign({ w: W }, KS.PAX[i]));
    return '<img class="person pimg" src="' + src + '" style="height:' + Math.round(W * 1.7) + 'px;width:auto" alt="" draggable="false">';
  };

  /* kereta samping 520x170 */
  KS.trainSVG = function (destId, w) {
    var d = KS.dest(destId) || KS_JADWAL.tujuan[0], c = d.warna, W = w || 520;
    return '<svg class="train" width="' + W + '" height="' + (W * 170 / 520) + '" viewBox="0 0 520 170" aria-hidden="true">' +
      '<g stroke="' + T + '" stroke-width="5" stroke-linejoin="round">' +
      '<rect x="6" y="6" width="430" height="128" rx="30" fill="' + c + '"/>' +
      '<path d="M436 6 h40 a34 34 0 0 1 34 34 v94 h-74z" fill="' + c + '"/>' +
      '<path d="M436 6 h40 a34 34 0 0 1 34 34 v94 h-74z" fill="#000" opacity=".16" stroke="none"/>' +
      '<rect x="14" y="108" width="496" height="14" rx="4" fill="#fff" stroke="none" opacity=".92"/>' +
      '<rect x="30" y="26" width="64" height="52" rx="12" fill="#BFE3F2"/><rect x="108" y="26" width="64" height="52" rx="12" fill="#BFE3F2"/>' +
      '<rect x="262" y="26" width="64" height="52" rx="12" fill="#BFE3F2"/><rect x="340" y="26" width="64" height="52" rx="12" fill="#BFE3F2"/>' +
      '<rect x="448" y="24" width="48" height="54" rx="12" fill="#BFE3F2"/>' +
      '<circle cx="216" cy="52" r="34" fill="#FFF3D6"/>' +
      '<circle cx="500" cy="98" r="10" fill="#F4B73F"/>' +
      '<rect x="6" y="134" width="504" height="10" rx="4" fill="#4a3a30"/>' +
      '<circle cx="90" cy="148" r="20" fill="#3A2A1F"/><circle cx="90" cy="148" r="7" fill="#d8c8a8" stroke="none"/>' +
      '<circle cx="330" cy="148" r="20" fill="#3A2A1F"/><circle cx="330" cy="148" r="7" fill="#d8c8a8" stroke="none"/>' +
      '<circle cx="440" cy="148" r="20" fill="#3A2A1F"/><circle cx="440" cy="148" r="7" fill="#d8c8a8" stroke="none"/></g>' +
      '<g transform="translate(216 52) scale(.78)" stroke="none"><g fill="' + c + '">' + '<circle r="0"/></g><g>' + ICON[d.ikon].replace(/#fff/g, c) + '</g></g>' +
      '</svg>';
  };

  /* orang sederhana (penumpang) */
  KS.person = function (o) {
    o = o || {};
    var skin = o.skin || '#E8B48A', cloth = o.cloth || '#E86C8F', hair = o.hair || '#2a2018', kind = o.kind || 'short';
    var head = '<circle cx="30" cy="22" r="17" fill="' + skin + '"/>';
    var top = '';
    if (kind === 'hijab') top = '<path d="M10 24 Q10 0 30 2 Q50 0 50 24 Q50 44 44 52 L16 52 Q10 44 10 24Z" fill="' + (o.scarf || '#F4B73F') + '"/><ellipse cx="30" cy="24" rx="13" ry="15" fill="' + skin + '"/>';
    else if (kind === 'cap') top = head + '<path d="M12 18 Q14 2 30 3 Q46 2 48 18Z" fill="' + (o.scarf || '#2F6FD0') + '"/><rect x="28" y="14" width="26" height="6" rx="3" fill="' + (o.scarf || '#2F6FD0') + '"/>';
    else if (kind === 'elder') top = head + '<path d="M13 16 Q15 3 30 4 Q45 3 47 16 Q40 8 30 9 Q20 8 13 16Z" fill="#cfcfd6"/>';
    else top = head + '<path d="M13 18 Q13 3 30 4 Q47 3 47 18 Q40 10 30 11 Q20 10 13 18Z" fill="' + hair + '"/>';
    var glass = o.glasses ? '<g fill="none" stroke="' + T + '" stroke-width="2.5"><circle cx="24" cy="23" r="6"/><circle cx="37" cy="23" r="6"/><path d="M30 23h1"/></g>' : '';
    var eyes = '<circle cx="25" cy="23" r="2.2" fill="' + T + '"/><circle cx="36" cy="23" r="2.2" fill="' + T + '"/><path d="M26 31 Q30.5 35 35 31" fill="none" stroke="' + T + '" stroke-width="2.5" stroke-linecap="round"/>';
    return '<svg class="person" width="' + (o.w || 60) + '" height="' + ((o.w || 60) * 1.7) + '" viewBox="0 0 60 102" aria-hidden="true"><g stroke="' + T + '" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">' +
      (o.wheel ? '<g class="legs"><rect x="14" y="70" width="34" height="12" rx="6" fill="#3b3b4f"/><rect x="40" y="72" width="8" height="26" rx="4" fill="#3b3b4f"/></g><g fill="none" stroke="' + T + '" stroke-width="4"><circle cx="26" cy="86" r="14" fill="#cfd4da"/><circle cx="26" cy="86" r="4" fill="' + T + '"/><path d="M8 66 V84 M8 66 H20"/></g>' : '<g class="legs"><rect x="17" y="68" width="10" height="30" rx="5" fill="#3b3b4f"/><rect x="33" y="68" width="10" height="30" rx="5" fill="#3b3b4f"/></g>') +
      '<rect x="12" y="46" width="36" height="30" rx="12" fill="' + cloth + '"/>' + top + '</g>' + eyes + glass + (o.paper ? '<g stroke="' + T + '" stroke-width="3"><rect x="34" y="52" width="24" height="30" rx="3" fill="#fff"/><path d="M38 60h16M38 67h16M38 74h10" stroke-width="2.5"/></g>' : '') + '</svg>';
  };

  /* 8 penumpang beragam (usia, gender, penampilan) */
  KS.PAX = [
    { nama: 'Sari', kind: 'hijab', cloth: '#E86C8F', scarf: '#F4B73F', voice: 'f', pitch: 1.12 },
    { nama: 'Pak Harto', kind: 'elder', cloth: '#8c6b3f', voice: 'm', pitch: 0.9 },
    { nama: 'Dimas', kind: 'cap', cloth: '#2F6FD0', scarf: '#F4B73F', glasses: true, voice: 'm', pitch: 1.15 },
    { nama: 'Bu Rina', kind: 'short', hair: '#5a3a22', cloth: '#7A5BB5', voice: 'f', pitch: 1.0 },
    { nama: 'Pak Anton', kind: 'short', cloth: '#1AA5A0', skin: '#C98E63', voice: 'm', pitch: 0.95 },
    { nama: 'Rafi', kind: 'cap', cloth: '#3DAA62', scarf: '#E86C8F', wheel: true, voice: 'm', pitch: 1.05 },
    { nama: 'Nenek Aminah', kind: 'hijab', scarf: '#cfcfd6', cloth: '#5B7289', skin: '#D9A27A', voice: 'f', pitch: 0.95 },
    { nama: 'Nia', kind: 'short', hair: '#2a2018', cloth: '#F08A24', skin: '#C98E63', glasses: true, voice: 'f', pitch: 1.2 }
  ];

  /* Bu Wati: 3 ekspresi (senang, mikir, sorak) + napas/kedip lewat CSS */
  KS.buWati = function () {
    var e = KS.h('div', { class: 'buwati e-senang' });
    e.innerHTML = '<svg width="150" height="230" viewBox="-14 -20 160 250" aria-hidden="true"><g class="body" stroke="' + T + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">' +
      '<ellipse cx="60" cy="222" rx="56" ry="9" fill="#000" opacity=".18" stroke="none"/>' +
      '<rect x="24" y="168" width="28" height="52" rx="10" fill="#2a2018"/><rect x="68" y="168" width="28" height="52" rx="10" fill="#2a2018"/>' +
      '<g class="armL"><path d="M6 104 Q-8 130 4 156" fill="none" stroke="#1F5F4A" stroke-width="22"/><circle cx="4" cy="158" r="11" fill="#E8B48A"/></g>' +
      '<path d="M2 176 V104 Q2 84 28 84 H92 Q118 84 118 104 V176Z" fill="#1F5F4A"/><rect x="50" y="88" width="20" height="84" fill="#FFFDF7"/>' +
      '<rect x="12" y="132" width="26" height="9" rx="3" fill="#F4B73F" stroke-width="3"/><rect x="82" y="132" width="26" height="9" rx="3" fill="#F4B73F" stroke-width="3"/>' +
      '<g class="armR"><path d="M114 104 Q134 120 128 86" fill="none" stroke="#1F5F4A" stroke-width="22"/><circle cx="128" cy="82" r="11" fill="#E8B48A"/><circle cx="128" cy="62" r="13" fill="#F4B73F"/><path d="M128 74 v6" stroke="#F4B73F" stroke-width="6"/></g>' +
      '<g class="head"><circle cx="60" cy="48" r="42" fill="#E8B48A"/><path d="M16 40 Q60 -22 104 40 Q96 14 60 10 Q24 14 16 40Z" fill="#B8B8C8"/>' +
      '<path d="M10 28 H110 Q100 -8 60 -10 Q20 -8 10 28Z" fill="#1F5F4A"/><rect x="10" y="26" width="100" height="10" rx="5" fill="#F4B73F"/>' +
      '<g class="eyes" stroke="none"><circle cx="44" cy="54" r="5.5" fill="' + T + '"/><circle cx="76" cy="54" r="5.5" fill="' + T + '"/></g>' +
      '<g class="blink" stroke="' + T + '" stroke-width="4" fill="none"><path d="M38 54 H50 M70 54 H82"/></g>' +
      '<path class="m-senang" d="M46 70 Q60 84 74 70" fill="none"/>' +
      '<path class="m-mikir" d="M48 74 Q56 70 66 74" fill="none"/><path class="b-mikir" d="M34 47 L52 41 M86 47 L68 41" fill="none" stroke-width="4"/>' +
      '<path class="m-sorak" d="M44 68 Q60 92 76 68Z" fill="#fff"/></g></g></svg>';
    e.set = function (x) { ['senang', 'mikir', 'sorak'].forEach(function (k) { e.classList.remove('e-' + k); }); e.classList.add('e-' + x); };
    if (KS.sprite('bu-senang') && KS.sprite('bu-mikir') && KS.sprite('bu-sorak')) {
      /* versi gambar: satu berkas per ekspresi + bingkai kedip opsional */
      var im = KS.h('img', { class: 'buimg', src: KS.sprite('bu-senang'), alt: '', draggable: 'false' }), cur = 'senang';
      e.innerHTML = ''; e.classList.add('buwati-img'); e.appendChild(im);
      e.set = function (x) { cur = x; ['senang', 'mikir', 'sorak'].forEach(function (k) { e.classList.remove('e-' + k); }); e.classList.add('e-' + x); im.src = KS.sprite('bu-' + x); };
      if (KS.sprite('bu-kedip')) {
        var t = 0, off = KS.onUpdate(function (dt) {
          if (!e.isConnected) { off(); return; } t += dt;
          if (t > 4.4 && cur === 'senang' && !KS.reduce) { im.src = KS.sprite('bu-kedip'); if (t > 4.55) { im.src = KS.sprite('bu-senang'); t = 0; } }
          else if (t > 4.6) t = 0;
        });
      }
    }
    return e;
  };

  KS.starSVG = function (on, size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="-17 -17 34 34" aria-hidden="true"><path d="M0-14 4-4 15-4 6 3 9 14 0 8-9 14-6 3-15-4-4-4Z" fill="' + (on ? '#F4B73F' : '#FFF3D6') + '" stroke="' + T + '" stroke-width="3" stroke-linejoin="round"/></svg>';
  };
  KS.handSVG = '<svg width="70" height="90" viewBox="0 0 70 90" aria-hidden="true"><path d="M26 6 a8 8 0 0 1 16 0 V38 h6 a8 8 0 0 1 8 8 v22 a18 18 0 0 1-18 18 h-8 a18 18 0 0 1-18-18 V52 a8 8 0 0 1 16 0Z" fill="#FFFDF7" stroke="#3A2A1F" stroke-width="4" stroke-linejoin="round"/></svg>';
})();
