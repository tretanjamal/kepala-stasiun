/* Adegan main: Level 1-4 (Jam Tepat, Setengah, Seperempat, Jadwal Mingguan). */
(function () {
  'use strict';
  var KS = window.KS, S = window.KS_STR, M = S.main, B = M.bu, h = KS.h, W = KS.waktu, G = KS.gen;

  KS.scene('play', function (root, P) {
    P = P || {};
    var L = P.level || 1, LV = KS_JADWAL.level[L - 1], santai = P.mode === 'santai', A = KS_ASSETS.img;
    var two = L >= 2, daysMode = L === 4, MAXROWS = daysMode ? 3 : 4, busy = L === 5;
    var seed = P.seed || (Date.now() % 100000);
    var X = { queue: G.level(L, seed), i: 0, phase: 'init', cur: null, wrong: 0, streak: 0, wrongStreak: 0, stationMin: 6 * 60, dep: 0, speed: 1,
      running: false, coins: 0, shownCoins: 0, idle: 0, annId: 0, onboard: L === 1 && !KS.store.get('onboard', false), reviews: 0, early: 0, late: 0,
      first: 0, count: 0, hint3: 0, words: {}, departed: [], santaiReady: false, days: {}, seen: {}, tags: {}, qCount: 0, qFirst: 0, qReview: 0, lastTrain: null, opts: null, qrng: G.rng(seed + 77), elapsed: 0 };

    /* ---------- DOM ---------- */
    root.classList.add('play'); root.classList.toggle('lv-two', two); root.classList.toggle('lv-days', daysMode);
    root.appendChild(h('img', { class: 'bg', src: A.bgStasiun, alt: '' }));
    var tint = h('div', { class: 'tint' }); root.appendChild(tint);
    root.appendChild(h('div', { class: 'birds' }, h('i'), h('i')));
    var stClock = KS.makeClock({ bare: true, start: X.stationMin, label: 'Jam stasiun' });
    var stWrap = h('div', { class: 'stclock' }, stClock.el); root.appendChild(stWrap);
    var ambient = h('div', { class: 'ambient' }); root.appendChild(ambient);
    var walkers = [];
    [[3, 40, 22], [4, 520, -26], [7, 300, 16]].forEach(function (a) {
      var el = h('div', { class: 'walker', html: KS.paxHTML(a[0], 46) }); ambient.appendChild(el); walkers.push({ el: el, x: a[1], y: 400, v: a[2] });
    });
    ambient.appendChild(h('div', { class: 'vendor', html: KS.person({ w: 50, kind: 'cap', cloth: '#E0B020', scarf: '#B5442E', paper: true }) }));
    var decor = h('div', { class: 'decor' }); root.appendChild(decor);
    var trainWrap = h('div', { class: 'trainwrap' }); root.appendChild(trainWrap);
    var steam = h('div', { class: 'steamlayer' }); root.appendChild(steam);
    var pax = h('div', { class: 'paxlayer' }); root.appendChild(pax);

    var dots = h('span', { class: 'dots' });
    var topbar = h('div', { class: 'topbar' },
      h('div', { class: 'panel pill lvl' }, 'Level ' + L + ' \u00B7 ' + LV.nama),
      h('div', { class: 'panel pill dotpill' }, dots),
      h('div', { class: 'panel pill coin', 'aria-label': 'Koin' }, h('span', { class: 'coinicon' }), h('b', null, '0')),
      KS.btn(M.kamus, 'k kamusbtn', function () { KS.openKamus(); }));
    var coinEl = topbar.querySelector('.coin b');
    root.append(topbar);
    KS.corner(root, { home: function () { KS.confirmExit(function () { KS.speech.cancel(); KS.go('select', { mode: P.mode }); }); } });

    var lamp = h('i', { class: 'lamp' });
    var caption = h('div', { class: 'caption', 'aria-live': 'polite' });
    var bHear = KS.btn(S.btn.dengar, 'b', function () { replay(0.9); });
    var bSlow = KS.btn(S.btn.pelan, 'k', function () { replay(0.65); });
    var radio = h('div', { class: 'panel radio' }, h('div', { class: 'rhead' }, lamp, M.radio), caption, h('div', { class: 'rbtn' }, bHear, bSlow));
    root.appendChild(radio);

    /* papan: L4 punya tab hari */
    var boardRows = h('div', { class: 'rows' }), tabs = null, tabInfo = null;
    var board = h('div', { class: 'board' });
    if (daysMode) {
      tabs = h('div', { class: 'tabs' }); G.DAYS.forEach(function (d, i) {
        var b = KS.btn(G.ABBR[i], 'tab', function () { toggleDay(d, b); }, { 'aria-label': d, 'aria-pressed': 'false' }); b.dataset.day = d; tabs.appendChild(b);
      });
      tabInfo = h('div', { class: 'tabinfo' }, '\u00A0'); board.append(tabs, tabInfo);
    } else board.appendChild(h('div', { class: 'bhead' }, M.papan));
    board.appendChild(boardRows); root.appendChild(board);

    /* panel jam */
    var setClock = KS.makeClock({ interactive: true, two: two, mins: LV.mins || (L === 2 ? [0, 30] : (L === 3 ? [0, 15, 30, 45] : [0, 30])), step: 60, label: 'Jam di papan keberangkatan', onChange: onClockChange, start: 12 * 60 });
    setClock.el.classList.add('setclock');
    var bPasang = KS.btn(S.btn.pasang, 'g big', pasang);
    var setPanel = h('div', { class: 'panel setpanel' + (two ? ' twoh' : '') }, setClock.el);
    var bMinus, bPlus, bMMinus, bMPlus, readout, rvH, rvM;
    if (!two) {
      readout = h('div', { class: 'readout' }, '12:00');
      bMinus = KS.btn('\u2212', 'k round', function () { setClock.step(-1); }, { 'aria-label': 'Mundur satu jam' });
      bPlus = KS.btn('+', 'k round', function () { setClock.step(1); }, { 'aria-label': 'Maju satu jam' });
      setPanel.append(h('div', { class: 'chips' }, h('span', { class: 'chip hj' }, M.jamPendek), h('span', { class: 'chip mn' }, M.menitPanjang)), h('div', { class: 'ctl' }, bMinus, readout, bPlus));
    } else {
      bMinus = KS.btn('\u2212', 'k round', function () { setClock.step(-1); }, { 'aria-label': 'Mundur satu jam' });
      bPlus = KS.btn('+', 'k round', function () { setClock.step(1); }, { 'aria-label': 'Maju satu jam' });
      bMMinus = KS.btn('\u2212', 'k round', function () { setClock.stepMin(-1); }, { 'aria-label': 'Menit sebelumnya' });
      bMPlus = KS.btn('+', 'k round', function () { setClock.stepMin(1); }, { 'aria-label': 'Menit berikutnya' });
      rvH = h('b', null, '12'); rvM = h('b', null, '00');
      setPanel.append(h('div', { class: 'ctl' }, bMinus, h('div', { class: 'rv hj' }, M.jam + ' ', rvH), bPlus),
        h('div', { class: 'ctl' }, bMMinus, h('div', { class: 'rv mn' }, M.menit + ' ', rvM), bMPlus));
    }
    setPanel.appendChild(bPasang); root.appendChild(setPanel);

    var bWhistle = KS.btn(S.btn.peluit, 'e big whistle', whistle);
    var bFast = KS.btn(S.btn.percepat + ' \u00BB', 'k fast', function () { X.speed = X.speed === 1 ? 4 : 1; bFast.textContent = X.speed === 1 ? S.btn.percepat + ' \u00BB' : 'Normal'; });
    root.append(bWhistle); if (!santai) root.appendChild(bFast);

    var bu = KS.buWati(); bu.classList.add('bu'); root.appendChild(bu);
    var bubble = h('div', { class: 'panel bubble' }, h('span', { class: 'btxt' })); root.appendChild(bubble);
    var cards = h('div', { class: 'panel cards-q' }); root.appendChild(cards);
    var paxQ = null;
    var hand = h('div', { class: 'handptr', html: KS.handSVG }); root.appendChild(hand);
    var fx = h('div', { class: 'fxlayer' }); root.appendChild(fx);

    /* ---------- util ---------- */
    function say(text, expr) { bubble.querySelector('.btxt').textContent = text; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); bubble.classList.remove('bridge'); bu.set(expr || 'senang'); }
    function sayBridge(h0, m0, v, expr) {
      var b = W.bridge(h0, m0, v), t = bubble.querySelector('.btxt'); t.innerHTML = '';
      t.append(h('b', null, b.en), ' = ' + b.id + ' = ', h('mark', null, b.dig));
      bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop', 'bridge'); bu.set(expr || 'mikir');
    }
    function pointTo(el, dx, dy) { if (!el) { hand.classList.remove('on'); return; } var r = KS.rel(el); hand.style.left = (r.x + r.w / 2 - 22 + (dx || 0)) + 'px'; hand.style.top = (r.y + r.h / 2 - 6 + (dy || 0)) + 'px'; hand.classList.add('on'); }
    function unpoint() { hand.classList.remove('on'); }
    function enableSet(on) {
      [bMinus, bPlus, bMMinus, bMPlus, bPasang].forEach(function (b) { if (b) b.disabled = !on; });
      setClock.lockHour = !on; setClock.lockMin = !on; setClock.el.classList.toggle('locked', !on); setPanel.classList.toggle('dim', !on);
      if (tabs) Array.prototype.forEach.call(tabs.children, function (b) { b.disabled = !on; });
    }
    function refreshDots() { dots.innerHTML = ''; for (var i = 0; i < X.queue.length; i++) dots.appendChild(h('i', { class: (X.queue[i].kind === 'q' ? 'qd ' : '') + (i < X.i ? 'done' : (i === X.i ? 'now' : '')) })); }
    function onClockChange() { X.idle = 0; readoutUpdate(); if (X.onboard && X.phase === 'set' && !two) { if (setClock.hour() % 12 === X.cur.h % 12) { say(B.pasang, 'senang'); pointTo(bPasang); } } }
    function readoutUpdate() { if (!two) readout.textContent = W.fmt(setClock.hour(), 0); else { rvH.textContent = setClock.hour(); rvM.textContent = W.pad(setClock.minute()); } }
    function whistleEnabled(on) { bWhistle.disabled = !on; }
    function setCoins(n) { var from = X.shownCoins; X.coins = n; KS.tween(0.6, function (p) { X.shownCoins = Math.round(from + (n - from) * p); coinEl.textContent = X.shownCoins; }, KS.ease.outCubic); KS.audio.sfx('coin'); }
    function burst(x, y, n) {
      for (var i = 0; i < (n || 12); i++) (function () {
        var s = h('span', { class: 'spark', html: KS.starSVG(true, 22) }); fx.appendChild(s);
        var a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 180, vx = Math.cos(a) * v, vy = Math.sin(a) * v - 140;
        KS.tween(0.9, function (p) { s.style.transform = 'translate(' + (x + vx * p) + 'px,' + (y + vy * p + 380 * p * p) + 'px) scale(' + (1 - p * 0.6) + ')'; s.style.opacity = 1 - p * p; }, KS.ease.linear, function () { s.remove(); });
      })();
    }
    function puff(x, y, n) {
      for (var i = 0; i < (n || 4); i++) (function (k) {
        var p = h('i', { class: 'puff' }); steam.appendChild(p);
        KS.wait(k * 0.18, function () { KS.tween(1.4, function (t) { p.style.transform = 'translate(' + (x + t * 30 + k * 6) + 'px,' + (y - t * 120) + 'px) scale(' + (0.5 + t * 1.2) + ')'; p.style.opacity = 0.9 * (1 - t); }, KS.ease.outCubic, function () { p.remove(); }); });
      })(i);
    }
    function tagAdd(tag, ok) { var o = X.tags[tag] || (X.tags[tag] = { ok: 0, total: 0 }); o.total++; if (ok) o.ok++; }
    function hw(n) { return W.hourWord(n); }
    function tungguText(t) { return t.m === 0 ? B.tunggu : B.tungguJam + W.fmt(t.h, t.m) + '!'; }
    function dayList(t) { return t.days ? t.days.join(' and ') : ''; }

    /* ---------- papan ---------- */
    function dayAbbr(t) { return t.days ? t.days.map(function (d) { return G.ABBR[G.DAYS.indexOf(d)]; }).join('+') : ''; }
    function addRow(t) {
      var d = KS.dest(t.dest), row = h('div', { class: 'row', 'data-dest': t.dest },
        h('i', { class: 'sw', style: 'background:' + d.warna }), h('span', { class: 'dn' }, d.nama), t.days ? h('span', { class: 'dy' }, dayAbbr(t)) : null, h('span', { class: 'tm' }, h('b', null, '--:--')));
      boardRows.appendChild(row); t.row = row;
      while (boardRows.children.length > MAXROWS) boardRows.removeChild(boardRows.firstChild);
    }
    function flipRow(t) { var tm = t.row.querySelector('.tm b'); KS.audio.sfx('flip'); t.row.classList.add('set'); tm.classList.add('flip'); setTimeout(function () { tm.textContent = W.fmt(t.h, t.m); }, 140); setTimeout(function () { tm.classList.remove('flip'); }, 380); }
    function toggleDay(d, b) { if (X.phase !== 'set') return; X.idle = 0; if (X.days[d]) delete X.days[d]; else X.days[d] = 1; b.classList.toggle('on', !!X.days[d]); b.setAttribute('aria-pressed', !!X.days[d]); KS.audio.sfx('tick'); var on = Object.keys(X.days); tabInfo.textContent = on.length ? on.join(' + ') : '\u00A0'; }
    function setDays(arr) { X.days = {}; if (tabs) Array.prototype.forEach.call(tabs.children, function (b) { var on = arr.indexOf(b.dataset.day) >= 0; if (on) X.days[b.dataset.day] = 1; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); if (tabInfo) tabInfo.textContent = arr.length ? arr.join(' + ') : '\u00A0'; }

    /* ---------- pengumuman ---------- */
    function keyPhrase(t) { return W.toWords(t.h, t.m, t.v); }
    function showCaption(t, text) {
      var kp = keyPhrase(t), i = text.indexOf(kp); caption.innerHTML = '';
      var dp = t.days ? dayList(t) : null, j = dp ? text.indexOf(dp) : -1;
      if (j >= 0 && j < i) caption.append(text.slice(0, j), h('mark', { class: 'dmark' }, dp), text.slice(j + dp.length, i), h('mark', null, kp), text.slice(i + kp.length));
      else caption.append(text.slice(0, i), h('mark', null, kp), text.slice(i + kp.length));
    }
    function dotsCaption() { caption.innerHTML = '<span class="dotsload"><i></i><i></i><i></i></span>'; }
    function announce(rate, auto) {
      var t = X.cur, id = ++X.annId, text = G.announce(t), late = two && !KS.settings.teks && !t.captionShown;
      if (late) dotsCaption(); else showCaption(t, text);
      lamp.classList.add('on'); KS.audio.sfx('radio');
      return KS.speech.say(text, { rate: rate || 0.9 }).then(function () {
        if (id !== X.annId) return; lamp.classList.remove('on'); showCaption(t, text); t.captionShown = true;
        if (auto && X.phase === 'announce') {
          X.phase = 'set'; enableSet(true); X.idle = 0; setClock.set(12 * 60); setDays([]); readoutUpdate();
          if (two && t.m !== 0 && !X.seen[t.m]) { X.seen[t.m] = 1; sayBridge(t.h, t.m, t.v, 'senang'); }
          else if (X.onboard) { say(B.putar, 'senang'); pointTo(setClock.numEl(t.h % 12 || 12) || setClock.el); }
          else if (daysMode && X.i === 0) say(B.lv4, 'senang');
        }
      });
    }
    function replay(rate) { if (X.cur && X.cur.kind === 'train' && (X.phase === 'set' || X.phase === 'wait' || X.phase === 'announce')) { X.idle = 0; announce(rate, X.phase === 'announce'); } else if (X.phase === 'qans') { speakQ(rate); } }

    /* ---------- alur ---------- */
    function nextItem() { if (X.i >= X.queue.length) return finish(); var it = X.queue[X.i]; if (it.kind === 'q') startQuestion(it); else startTrain(it); }
    function startTrain(t) {
      X.cur = t; X.wrong = 0; X.phase = 'announce'; X.idle = 0; X.running = false; X.santaiReady = false;
      bWhistle.style.visibility = ''; cards.classList.remove('on'); setPanel.classList.remove('hide');
      refreshDots(); whistleEnabled(false); enableSet(false); setClock.set(12 * 60); setDays([]); readoutUpdate(); setClock.grow(null);
      var lead = busy ? 10 : (two ? 15 : 20), start = Math.max(X.stationMin, t.h * 60 + t.m - lead), far = start - X.stationMin > 8;
      X.dep = t.h * 60 + t.m; stClock.to(start, far ? 1.0 : 0.3); X.stationMin = start; updateTint();
      addRow(t);
      if (X.onboard && X.i === 0) { say(B.mulai, 'senang'); pointTo(bHear); }
      else if (X.i === 0 && L > 1) say(B['lv' + L], 'senang');
      else say(' ', 'senang');
      KS.wait(far ? 1.1 : 0.7, function () { if (X.cur === t) announce(0.9, true); });
    }
    function pasang() {
      if (X.phase !== 'set') return; X.idle = 0; unpoint();
      var t = X.cur, hr = setClock.hour(), mn = two ? setClock.minute() : 0;
      var timeOk = hr % 12 === t.h % 12 && mn === t.m;
      var dayOk = !t.days || (Object.keys(X.days).sort().join() === t.days.slice().sort().join());
      if (timeOk && dayOk) accept(false); else wrongAnswer(hr, mn, dayOk, timeOk);
    }
    function wrongAnswer(hr, mn, dayOk, timeOk) {
      var t = X.cur; X.wrong++; X.wrongStreak++; X.streak = 0; var wd = hw(t.h) + (t.m ? ' ' + t.m : ''); X.words[wd] = (X.words[wd] || 0) + 1;
      KS.audio.sfx('wrong'); setPanel.classList.remove('shake'); void setPanel.offsetWidth; setPanel.classList.add('shake');
      if (!dayOk) {
        if (X.wrong === 1) { say(B.hari1, 'mikir'); KS.wait(0.9, function () { if (X.phase === 'set') announce(0.75, false); }); }
        else if (X.wrong === 2) { var d0 = t.days[0], ab = G.ABBR[G.DAYS.indexOf(d0)]; say(B.hari2 + d0 + ' = ' + ab + '.', 'mikir'); caption.classList.add('hl'); Array.prototype.forEach.call(tabs.children, function (b) { if (t.days.indexOf(b.dataset.day) >= 0) { b.classList.add('hint'); } }); }
        else tier3();
        return;
      }
      if (X.wrong === 1) {
        var near = Math.abs(((hr - t.h + 18) % 12) - 6) === 5 && mn === t.m;
        var said = mn % 15 === 0 ? W.toWords(hr, mn, t.v) : hw(hr);
        say((near ? B.dekat : '') + B.itu + said + '. ' + B.salah1, 'mikir');
        KS.wait(0.9, function () { if (X.phase === 'set') announce(0.75, false); });
      } else if (X.wrong === 2) {
        if (two && t.m) sayBridge(t.h, t.m, t.v); else say(B.salah2 + hw(t.h) + ' = ' + (t.h % 12 || 12) + '.', 'mikir');
        caption.classList.add('hl'); var ne = setClock.numEl(t.h % 12 || 12); if (ne) ne.classList.add('hint');
        setClock.flash('hour'); if (two) setClock.flash('min'); setClock.grow('hour');
      } else tier3();
    }
    function tier3() {
      var t = X.cur; X.hint3++; X.phase = 'show'; enableSet(false); t.hinted = true;
      if (daysMode) setDays(t.days);
      if (two && t.m) sayBridge(t.h, t.m, t.v); else say(B.salah3 + (t.h % 12 || 12) + '.', 'mikir');
      setClock.to(t.h * 60 + t.m, 0.9, function () { readoutUpdate(); KS.wait(1.1, function () { accept(true); }); });
      if (!t.review && X.reviews < 2) { X.reviews++; var last = X.lastTrain || t; X.queue.push(G.reviewTrain(L, last, X.queue.filter(function (q) { return q.kind === 'train'; }).map(function (q) { return q.dest; }), seed + 31 * X.reviews, t)); refreshDots(); }
    }
    function clearHints() { caption.classList.remove('hl'); setClock.grow(null); var n = setClock.svg.querySelectorAll('.num.hint'); for (var i = 0; i < n.length; i++) n[i].classList.remove('hint'); if (tabs) Array.prototype.forEach.call(tabs.children, function (b) { b.classList.remove('hint'); }); }
    function accept(hinted) {
      var t = X.cur; X.phase = 'board'; enableSet(false); clearHints(); unpoint(); X.count++;
      var ok1 = !hinted && X.wrong === 0;
      if (ok1) { X.first++; X.streak++; X.wrongStreak = 0; } else X.streak = 0;
      tagAdd(t.tag, ok1); tagAdd('simak-jadwal', ok1); if (daysMode) tagAdd('hari', ok1);
      KS.audio.sfx('correct'); if (!hinted) say(' ', 'senang');
      flipRow(t); X.lastTrain = t;
      KS.wait(0.5, function () { burst(1070, 330, 8); arrive(t); });
    }
    function arrive(t) {
      trainWrap.innerHTML = KS.trainHTML(t.dest); trainWrap.style.transform = 'translateX(-640px)';
      KS.audio.sfx('arrive'); puff(560, 360, 3);
      KS.tween(1.7, function (p) { trainWrap.style.transform = 'translateX(' + (-640 + 760 * p) + 'px)'; }, KS.ease.inOutCubic, function () {
        puff(500, 360, 3); X.phase = 'wait'; X.idle = 0;
        if (santai) {
          say(B.santai, 'senang'); whistleEnabled(false);
          stClock.to(X.dep, 1.6, function () { X.stationMin = X.dep; updateTint(); X.santaiReady = true; whistleEnabled(true); say(B.siap, 'sorak'); if (X.onboard) pointTo(bWhistle); });
        } else {
          X.running = true; whistleEnabled(true);
          if (X.onboard) { say(tungguText(t), 'senang'); pointTo(stWrap); } else if (two && X.i < 2) say(tungguText(t), 'senang'); else say(' ', 'senang');
        }
      });
    }
    function whistle() {
      if (X.phase !== 'wait') return; X.idle = 0; unpoint();
      var d = X.stationMin - X.dep;
      if (!santai && d < -3) {
        KS.audio.sfx('whistle', true); KS.audio.sfx('wrong'); X.early++;
        say(B.awal, 'mikir'); stWrap.classList.add('glow'); board.classList.add('glow'); KS.wait(2.2, function () { stWrap.classList.remove('glow'); board.classList.remove('glow'); });
        runPassengers(); return;
      }
      var late = !santai && d > 8; if (late) X.late++;
      X.phase = 'depart'; X.running = false; whistleEnabled(false); KS.audio.sfx('whistle');
      say(late ? B.telat : B.hebat, late ? 'senang' : 'sorak'); bu.classList.add('whistling'); KS.wait(0.9, function () { bu.classList.remove('whistling'); });
      burst(780, 560, 14); setCoins(X.coins + 10);
      KS.wait(0.7, function () {
        KS.audio.sfx('chuff'); puff(640, 360, 4);
        KS.tween(2.0, function (p) { trainWrap.style.transform = 'translateX(' + (120 + 1500 * p) + 'px)'; }, KS.ease.inCubic, function () {
          X.departed.push(X.cur.dest); decorUpdate(); X.i++; if (X.onboard) { KS.store.set('onboard', true); X.onboard = false; }
          var gap = busy ? 0.6 : (X.streak >= 3 ? 0.8 : (X.wrongStreak >= 2 ? 2.6 : 1.5)); X.wrongStreak = X.wrongStreak >= 2 ? 0 : X.wrongStreak;
          KS.wait(gap, nextItem);
        });
      });
    }
    function runPassengers() {
      [0, 2].forEach(function (k, i) {
        var p = h('div', { class: 'runner', html: KS.paxHTML(k, 60) }); pax.appendChild(p);
        KS.wait(i * 0.35, function () { KS.tween(1.8, function (t) { p.style.transform = 'translate(' + (860 - 520 * t) + 'px,' + (470 + Math.abs(Math.sin(t * 18)) * -10) + 'px)'; p.style.opacity = t > 0.9 ? (1 - t) * 10 : 1; }, KS.ease.linear, function () { p.remove(); }); });
      });
    }

    /* ---------- pertanyaan penumpang ---------- */
    function speakQ(rate) { var q = X.cur, pr = KS.PAX[q.pax]; lamp.classList.add('on'); var id = ++X.annId; return KS.speech.say(q.text, { rate: rate || 0.9, voice: pr.voice, pitch: pr.pitch }).then(function () { if (id === X.annId) lamp.classList.remove('on'); }); }
    function startQuestion(q) {
      X.cur = q; X.phase = 'qintro'; X.wrong = 0; X.idle = 0; X.running = false; X.opts = null;
      refreshDots(); bWhistle.style.visibility = 'hidden'; whistleEnabled(false); enableSet(false); setPanel.classList.add('hide'); trainWrap.style.transform = 'translateX(-640px)';
      var pr = KS.PAX[q.pax];
      paxQ = h('div', { class: 'paxq', html: KS.paxHTML(q.pax, 110) }); root.appendChild(paxQ);
      KS.tween(0.8, function (p) { paxQ.style.transform = 'translateX(' + (-160 + 210 * p) + 'px)'; }, KS.ease.outBack);
      say(M.bu.jawab, 'senang');
      if (q.type === 'now') { var tgt = q.h * 60 + q.m; stClock.to(tgt, 0.7); X.stationMin = tgt; updateTint(); stWrap.classList.add('glow'); }
      else { var r = boardRows.querySelector('[data-dest="' + q.dest + '"]'); if (r) r.classList.add('hlq'); }
      dotsCaption(); lamp.classList.add('on');
      KS.wait(0.9, function () {
        var id = ++X.annId;
        KS.speech.say(q.text, { rate: 0.9, voice: pr.voice, pitch: pr.pitch }).then(function () { if (id !== X.annId) return; lamp.classList.remove('on'); caption.textContent = q.text; showCards(q); });
      });
    }
    function showCards(q) {
      var n = (q.type !== 'is' && X.streak >= 3) ? 4 : 3, opts = G.options(q, n, X.qrng); X.opts = opts;
      cards.innerHTML = ''; cards.classList.toggle('four', opts.length === 4);
      opts.forEach(function (o, i) { var b = KS.btn(o.text, 'k cardq', function () { answerQ(o, b); }); b.dataset.i = i; cards.appendChild(b); });
      cards.classList.add('on'); X.phase = 'qans'; X.idle = 0;
    }
    function clearQHl() { var r = boardRows.querySelectorAll('.hlq'); for (var i = 0; i < r.length; i++) r[i].classList.remove('hlq'); stWrap.classList.remove('glow'); }
    function answerQ(o, b) {
      if (X.phase !== 'qans') return; X.idle = 0; var q = X.cur;
      if (o.ok) { qDone(q, false, b); return; }
      X.wrong++; X.wrongStreak++; X.streak = 0; b.disabled = true; b.classList.add('bad'); KS.audio.sfx('wrong'); cards.classList.remove('shake'); void cards.offsetWidth; cards.classList.add('shake');
      if (X.wrong === 1) say(q.type === 'now' ? B.lihatJam : B.jwb1, 'mikir');
      else if (X.wrong === 2) {
        if (q.type === 'is') { var tr = X.queue.filter(function (z) { return z.kind === 'train' && z.dest === q.dest; })[0]; say(M.bu.jwb2 + dayList(tr), 'mikir'); }
        else sayBridge(q.h, q.m, q.v);
      } else {
        X.hint3++; X.phase = 'qshow'; say(B.jwb3, 'mikir');
        Array.prototype.forEach.call(cards.children, function (c, i) { if (X.opts[i].ok) { c.disabled = false; c.classList.add('good'); } });
        if (!q.review && X.qReview < 1) { X.qReview++; var trains = X.queue.filter(function (z) { return z.kind === 'train'; }); X.queue.push(G.reviewQuestion(L, trains, q, seed + 5)); refreshDots(); }
        KS.wait(1.6, function () { qDone(q, true, null); });
      }
    }
    function qDone(q, hinted, b) {
      X.phase = 'qdone'; var ok1 = !hinted && X.wrong === 0; X.qCount++; if (ok1) { X.qFirst++; X.streak++; X.wrongStreak = 0; } else X.streak = 0;
      tagAdd(q.tag, ok1); tagAdd('simak-jadwal', ok1);
      KS.audio.sfx('correct'); if (b) b.classList.add('good'); clearQHl(); say(B.terima, 'sorak'); setCoins(X.coins + 10); burst(300, 520, 10);
      var pr = KS.PAX[q.pax]; KS.speech.say('Thank you!', { rate: 0.95, voice: pr.voice, pitch: pr.pitch });
      KS.wait(1.3, function () {
        cards.classList.remove('on'); var el = paxQ; KS.tween(0.7, function (p) { el.style.transform = 'translateX(' + (50 - 230 * p) + 'px)'; el.style.opacity = 1 - p; }, KS.ease.inCubic, function () { el.remove(); });
        X.i++; KS.wait(1.0, nextItem);
      });
    }

    function decorUpdate() {
      var n = X.departed.length; decor.innerHTML = '';
      if (n >= 2) decor.appendChild(h('img', { class: 'dbunting pop', src: A.bendera, alt: '' }));
      if (n >= 3) decor.appendChild(h('img', { class: 'dpot pop', src: A.pot, alt: '' }));
    }
    function updateTint() { var a = Math.max(0, Math.min(1, (10 * 60 - X.stationMin) / 240)); tint.style.opacity = (a * 0.55).toFixed(3); }

    function finish() {
      X.phase = 'done'; KS.speech.cancel();
      var stars = [X.first === X.count, santai ? true : (X.early === 0 && X.late === 0 && (!busy || X.elapsed < 330)), X.hint3 === 0];
      var sk = KS.store.get('skills', []); Object.keys(X.tags).forEach(function (k) { var o = X.tags[k]; if (o.ok / o.total >= 0.6 && sk.indexOf(k) < 0) sk.push(k); }); KS.store.set('skills', sk);
      var prog = KS.store.get('prog', {}), key = 'L' + L, n = stars.filter(Boolean).length, old = prog[key]; old = (typeof old === 'number') ? old : (old && old.s) || 0;
      prog[key] = { s: Math.max(old, n), d: 1 }; KS.store.set('prog', prog);
      KS.go('result', { level: L, mode: santai ? 'santai' : 'normal', stars: stars, coins: X.coins,
        stats: { trains: X.count, first: X.first, questions: X.qCount, qfirst: X.qFirst, early: X.early, late: X.late, hint3: X.hint3, words: X.words, tags: X.tags, dests: X.departed.slice() } });
    }

    /* ---------- loop ---------- */
    var off = KS.onUpdate(function (dt) {
      if (KS.modalOpen || document.hidden) return;
      if (X.phase !== 'done') X.elapsed += dt;
      walkers.forEach(function (w) { w.x += w.v * dt; if (w.x > 1000) w.x = -80; if (w.x < -90) w.x = 990; w.el.style.transform = 'translate(' + w.x + 'px,' + (w.y + Math.abs(Math.sin(w.x / 11)) * -4) + 'px) scaleX(' + (w.v < 0 ? -1 : 1) + ')'; });
      if (X.phase === 'wait' && X.running && !santai) {
        var cap = X.dep + 12, prev = Math.floor(X.stationMin);
        X.stationMin = Math.min(cap, X.stationMin + dt * 2 * X.speed); stClock.set(X.stationMin);
        if (Math.floor(X.stationMin) !== prev && X.speed === 1) KS.audio.sfx('tick');
        updateTint(); if (X.stationMin >= cap) X.running = false;
      }
      X.idle += dt;
      if (X.idle > 8 && !hand.classList.contains('on')) {
        if (X.phase === 'set') pointTo(setClock.el);
        else if (X.phase === 'wait') { if (X.stationMin >= X.dep || X.santaiReady) pointTo(bWhistle); else pointTo(stWrap); }
        else if (X.phase === 'qans') { var c = cards.firstChild; if (c) pointTo(c); }
      }
    });
    root.addEventListener('pointerdown', function () { X.idle = 0; if (!X.onboard) unpoint(); }, true);
    document.addEventListener('keydown', onKey);
    function onKey(e) { if (KS.modalOpen) return; if (e.key === 'Enter' && X.phase === 'set' && document.activeElement && document.activeElement.tagName !== 'BUTTON') pasang(); }

    KS.audio.play('main'); refreshDots(); enableSet(false); whistleEnabled(false); readoutUpdate();
    KS.wait(0.5, nextItem);

    if (KS.test) window.__play = {
      X: X, pasang: pasang, whistle: whistle,
      setHour: function (n) { setClock.set(n * 60); readoutUpdate(); onClockChange(); },
      setTime: function (hh, mm) { setClock.setHM(hh, mm); readoutUpdate(); onClockChange(); },
      setDays: setDays,
      advance: function (m) { X.stationMin = Math.min(X.dep + 12, X.stationMin + m); stClock.set(X.stationMin); },
      cardIndex: function (ok) { for (var i = 0; i < X.opts.length; i++) if (X.opts[i].ok === ok && !cards.children[i].disabled) return i; return -1; },
      clickCard: function (i) { cards.children[i].click(); },
      angles: function () { return { hour: setClock.get() * 0.5, min: setClock.get() * 6, total: setClock.get() }; }
    };
    return { exit: function () { off(); KS.speech.cancel(); document.removeEventListener('keydown', onKey); if (window.__play) delete window.__play; } };
  });
})();
