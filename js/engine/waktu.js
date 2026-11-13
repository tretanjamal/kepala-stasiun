/* Pengubah waktu <-> kata Inggris, sudut jarum. Dipakai gim dan uji (node). */
(function () {
  'use strict';
  var HOUR = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
  var W = {
    hourWord: function (h) { return HOUR[((h % 12) + 12) % 12]; },
    // variant: 0 = half past / bentuk utama, 1 = seven thirty
    toWords: function (h, m, variant) {
      var hw = W.hourWord(h), nx = W.hourWord(h + 1);
      if (m === 0) return hw + " o'clock";
      if (m === 15) return 'quarter past ' + hw;
      if (m === 30) return variant ? hw + ' thirty' : 'half past ' + hw;
      if (m === 45) return 'quarter to ' + nx;
      throw new Error('menit tidak didukung: ' + m);
    },
    ID_HOUR: ['dua belas', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'],
    idHour: function (h) { return W.ID_HOUR[((h % 12) + 12) % 12]; },
    /* kartu jembatan: Inggris = Indonesia = angka */
    bridge: function (h, m, variant) {
      var id;
      if (m === 0) id = 'jam ' + W.idHour(h) + ' tepat';
      else if (m === 15) id = 'jam ' + W.idHour(h) + ' lewat seperempat';
      else if (m === 30) id = 'setengah ' + W.idHour(h + 1);
      else id = 'jam ' + W.idHour(h + 1) + ' kurang seperempat';
      return { en: W.toWords(h, m, variant), id: id, dig: W.fmt(h, m) };
    },
    /* pengecoh kalimat waktu: dari miskonsepsi nyata. Mengembalikan daftar {h,m,words} unik, bukan waktu benar */
    distractors: function (h, m, variant) {
      var cand = [];
      function add(hh, mm) { hh = ((hh - 1 + 12) % 12) + 1; cand.push({ h: hh, m: mm }); }
      if (m === 0) { add(h, 30); add(h + 1, 0); add(h - 1, 0); add(h, 15); }
      else if (m === 30) { add(h - 1, 30); add(h, 0); add(h + 1, 30); add(h, 45); }
      else if (m === 15) { add(h, 45); add(h + 1, 15); add(h - 1, 45); add(h, 30); }
      else { add(h + 1, 45); add(h, 15); add(h + 1, 15); add(h, 0); }
      var seen = {}, out = [], good = W.toWords(h, m, variant);
      seen[good] = 1; seen[W.toWords(h, m, 0)] = 1; seen[W.toWords(h, m, 1)] = 1;
      cand.forEach(function (c) { var w = W.toWords(c.h, c.m, variant & 1); if (!seen[w] && !(c.h === ((h - 1) % 12) + 1 && c.m === m && false)) { seen[w] = 1; out.push({ h: c.h, m: c.m, words: w }); } });
      return out;
    },
    angles: function (h, m) { return { hour: (h % 12) * 30 + m * 0.5, min: m * 6 }; },
    pad: function (n) { return (n < 10 ? '0' : '') + n; },
    fmt: function (h, m) { return h + ':' + W.pad(m); },        // 7:30 (Inggris, titik dua)
    fmtId: function (h, m) { return W.pad(h) + '.' + W.pad(m); } // 07.30 (Indonesia)
  };
  var root = (typeof window !== 'undefined') ? (window.KS = window.KS || {}) : {};
  root.waktu = W;
  if (typeof module !== 'undefined') module.exports = W;
})();
