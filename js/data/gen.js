/* Generator jadwal & soal (dengan seed agar bisa diuji). */
(function () {
  'use strict';
  var KS = (typeof window !== 'undefined') ? (window.KS = window.KS || {}) : {};
  var W = (typeof window !== 'undefined') ? window.KS.waktu : require('../engine/waktu.js');
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(arr, r) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var ABBR = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  var LV = {
    1: { n: 4, mins: [0], hmax: 10, q: [], need: function () { return true; } },
    2: { n: 5, mins: [0, 30], hmax: 11, q: [[1, 'when'], [3, 'now'], [4, 'when']], need: function (c) { return c(30) >= 2 && c(0) >= 1; } },
    3: { n: 6, mins: [0, 15, 30, 45], hmax: 11, q: [[1, 'when'], [3, 'now'], [5, 'when']], need: function (c) { return c(15) >= 1 && c(45) >= 1 && c(0) >= 1; } },
    5: { n: 8, mins: [0, 15, 30, 45], hmax: 11, q: [[1, 'when'], [3, 'now'], [5, 'when'], [7, 'when']], need: function (c) { return c(15) >= 1 && c(45) >= 1 && c(30) >= 1 && c(0) >= 1; } },
    4: { n: 6, mins: [0, 30], hmax: 11, q: [[0, 'is'], [2, 'when'], [3, 'is'], [5, 'is']], need: function (c) { return c(0) >= 2 && c(30) >= 2; }, days: true }
  };
  function slots(mins, hmax) { var a = []; for (var h = 6; h <= hmax; h++) mins.forEach(function (m) { if (h * 60 + m <= hmax * 60) a.push({ h: h, m: m }); }); return a; }
  var G = {
    rng: rng, shuffle: shuffle, DAYS: DAYS, ABBR: ABBR, LV: LV,
    ids: function () { return (typeof window !== 'undefined' ? window.KS_JADWAL : G._cfg).tujuan.map(function (t) { return t.id; }); },
    mins: function (t) { return t.h * 60 + t.m; },
    /* urutan item sebuah level: kereta (naik waktu) disisipi pertanyaan penumpang */
    level: function (level, seed) {
      var cfg = LV[level], r = rng(seed), sl = slots(cfg.mins, cfg.hmax), tr, tries = 0;
      do {
        tr = shuffle(sl, r).slice(0, cfg.n).sort(function (a, b) { return G.mins(a) - G.mins(b); });
        var ok = true; for (var i = 1; i < tr.length; i++) if (G.mins(tr[i]) - G.mins(tr[i - 1]) < 15) ok = false;
        var cnt = function (m) { return tr.filter(function (t) { return t.m === m; }).length; };
        if (ok && cfg.need(cnt)) break;
      } while (++tries < 500);
      var ids = shuffle(G.ids(), r), flip = r() < 0.5, c30 = 0;
      var dayPool = shuffle(DAYS.slice(0, 5).concat(['Saturday']), r);
      var trains = tr.map(function (t, i) {
        var v = 0; if (t.m === 30) { v = (c30++ % 2 === 0) === flip ? 0 : 1; }
        var o = { kind: 'train', dest: ids[i], h: t.h, m: t.m, tag: G.tag(t.m), v: v, attn: r() < 0.35 };
        if (cfg.days) { o.days = [dayPool[i]]; }
        return o;
      });
      if (cfg.days) { var w = trains[Math.floor(r() * trains.length)]; var used = trains.map(function (t) { return t.days[0]; });
        w.days = ['Saturday', 'Sunday']; /* satu pengumuman akhir pekan; hari lain dipilih agar tidak bentrok */
        var rest = shuffle(DAYS.slice(0, 5), r), k = 0; trains.forEach(function (t) { if (t !== w) t.days = [rest[k++ % 5]]; }); }
      var items = [], qi = 0, pax = shuffle([0, 1, 2, 3, 4, 5, 6, 7], r);
      trains.forEach(function (t, i) {
        items.push(t);
        cfg.q.forEach(function (qq) { if (qq[0] === i) items.push(G.question(level, qq[1], trains, i, r, pax[qi++ % 8])); });
      });
      return items;
    },
    tag: function (m) { return m === 0 ? 'jam-tepat' : (m === 30 ? 'setengah' : 'seperempat'); },
    /* pertanyaan tentang kereta yang sudah ada di papan (indeks <= i) */
    question: function (level, type, trains, i, r, pax) {
      var past = trains.slice(Math.max(0, i - 2), i + 1), t = past[Math.floor(r() * past.length)];
      var q = { kind: 'q', type: type, pax: pax, dest: t.dest, tag: type === 'is' ? 'hari' : 'jawab-waktu' };
      if (type === 'now') { t = trains[i]; q.h = t.h; q.m = t.m; q.v = t.v; q.dest = null; q.text = 'Excuse me, what time is it now?'; q.say = 'It\u2019s ' + W.toWords(t.h, t.m, t.v) + '.'; }
      else if (type === 'when') { q.h = t.h; q.m = t.m; q.v = t.v; q.text = 'Excuse me, what time does the train to the ' + t.dest + ' leave?'; q.say = 'It leaves at ' + W.toWords(t.h, t.m, t.v) + '.'; }
      else { /* is */
        var yes = r() < 0.5, real = t.days, day;
        if (yes) day = real[Math.floor(r() * real.length)]; else { var others = DAYS.filter(function (d) { return real.indexOf(d) < 0; }); day = others[Math.floor(r() * others.length)]; }
        q.day = day; q.yes = yes; q.text = 'Is there a train to the ' + t.dest + ' on ' + day + '?'; q.say = yes ? 'Yes, there is.' : 'No, there isn\u2019t.';
      }
      return q;
    },
    /* pilihan jawaban kartu kalimat: n pilihan, tepat satu benar */
    options: function (q, n, r) {
      if (q.type === 'is') return [{ text: 'Yes, there is.', ok: q.yes }, { text: 'No, there isn\u2019t.', ok: !q.yes }];
      var pre = q.type === 'now' ? 'It\u2019s ' : 'It leaves at ';
      var opts = [{ text: pre + W.toWords(q.h, q.m, q.v) + '.', ok: true }];
      var d = shuffle(W.distractors(q.h, q.m, q.v), r).slice(0, n - 1);
      d.forEach(function (x) { opts.push({ text: pre + x.words + '.', ok: false, h: x.h, m: x.m }); });
      return shuffle(opts, r);
    },
    /* kereta/pertanyaan ulangan (bentuk serupa) untuk yang keliru */
    reviewTrain: function (level, last, usedDests, seed, missed) {
      var r = rng(seed), cfg = LV[level], from = G.mins(last) + 15, sl = slots(cfg.mins, 12).filter(function (s) { return G.mins(s) >= from; });
      var same = sl.filter(function (s) { return s.m === missed.m; }); if (same.length) sl = same;
      var s = sl.length ? sl[Math.floor(r() * sl.length)] : { h: 12, m: 0 };
      var ids = G.ids().filter(function (i) { return usedDests.indexOf(i) < 0; }), dest = shuffle(ids, r)[0] || missed.dest;
      var o = { kind: 'train', dest: dest, h: s.h, m: s.m, tag: G.tag(s.m), v: missed.v ? 0 : 1, review: true };
      if (missed.days) o.days = [shuffle(DAYS.slice(0, 5), r)[0]];
      return o;
    },
    reviewQuestion: function (level, trains, missed, seed) {
      var r = rng(seed), pool = trains.filter(function (t) { return !missed.dest || t.dest !== missed.dest; });
      var tt = pool.length ? pool : trains, q = G.question(level, missed.type, trains.length ? tt.concat([tt[tt.length - 1]]) : trains, tt.length, r, (missed.pax + 3) % 8);
      q.review = true; return q;
    },
    announce: function (t) {
      var core = 'The train to the ' + t.dest + ' leaves at ' + W.toWords(t.h, t.m, t.v) + '.';
      if (t.days) { var d = t.days.length > 1 ? t.days[0] + ' and ' + t.days[1] : t.days[0]; return 'On ' + d + ', the train to the ' + t.dest + ' leaves at ' + W.toWords(t.h, t.m, t.v) + '.'; }
      return t.attn ? 'Attention, please. ' + core : core;
    },
    /* L1 lama (kompatibel uji): */
    level1: function (seed) { return G.level(1, seed); },
    review: function (used, seed) { return G.reviewTrain(1, { h: 10, m: 0 }, used, seed, { m: 0, v: 0 }); }
  };
  KS.gen = G;
  if (typeof module !== 'undefined') module.exports = G;
})();
