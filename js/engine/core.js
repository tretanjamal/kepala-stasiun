/* Inti: pembantu DOM, simpan, tween, loop, skala, adegan. */
(function () {
  'use strict';
  var KS = window.KS = window.KS || {};
  KS.test = /[?&]test=1/.test(location.search);
  KS.modalOpen = 0;

  KS.h = function (tag, props) {
    var e = document.createElement(tag);
    if (props) for (var k in props) {
      var v = props[k];
      if (k === 'class') e.className = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v);
    }
    for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  };
  function add(e, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); return; }
    e.appendChild(c.nodeType ? c : document.createTextNode(c));
  }
  KS.btn = function (label, cls, onclick, extra) {
    var b = KS.h('button', Object.assign({ class: 'btn ' + (cls || ''), type: 'button' }, extra || {}), label);
    if (onclick) b.addEventListener('click', function (ev) { if (!b.disabled) onclick(ev); });
    return b;
  };

  /* simpan */
  var mem = {};
  KS.store = {
    get: function (k, d) { try { var v = localStorage.getItem('ks222:' + k); if (v != null) return JSON.parse(v); } catch (e) {} return (k in mem) ? mem[k] : d; },
    set: function (k, v) { mem[k] = v; try { localStorage.setItem('ks222:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  /* kunci level: Level 1 selalu terbuka; level N terbuka bila level N-1 sudah selesai (mode apa pun) */
  KS.levelDone = function (id) { var v = KS.store.get('prog', {})['L' + id]; return !!(v && (typeof v === 'number' || v.d)); };
  KS.levelOpen = function (id) { return id === 1 || (id > 1 && id <= KS_JADWAL.level.length && KS.levelDone(id - 1)); };

  var defSet = { musik: true, suara: true, kurangi: false, teks: false };
  KS.settings = Object.assign({}, defSet, KS.store.get('set', {}));
  KS.applySettings = function () {
    var reduce = KS.settings.kurangi || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    document.body.classList.toggle('reduce', !!reduce);
    KS.reduce = !!reduce;
    KS.store.set('set', KS.settings);
  };

  /* easing + tween */
  KS.ease = {
    linear: function (t) { return t; },
    outCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
    inCubic: function (t) { return t * t * t; },
    inOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    outBack: function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  var tweens = [];
  KS.tween = function (dur, fn, ease, done) {
    if (KS.reduce) dur = Math.min(dur, 0.08);
    var tw = { t: 0, dur: dur, fn: fn, ease: ease || KS.ease.outCubic, done: done, dead: false, cancel: function () { tw.dead = true; } };
    tweens.push(tw); return tw;
  };
  KS.wait = function (sec, fn) { return KS.tween(sec, function () {}, KS.ease.linear, fn); };

  /* loop berbasis delta, berhenti saat tab tersembunyi */
  var subs = [], last = 0;
  KS.onUpdate = function (fn) { subs.push(fn); return function () { var i = subs.indexOf(fn); if (i >= 0) subs.splice(i, 1); }; };
  function frame(ts) {
    requestAnimationFrame(frame);
    var dt = last ? Math.min(0.1, (ts - last) / 1000) : 0; last = ts;
    if (document.hidden) return;
    if (KS.manual) return;
    step(dt);
  }
  function step(dt) {
    for (var i = tweens.length - 1; i >= 0; i--) {
      var tw = tweens[i];
      if (tw.dead) { tweens.splice(i, 1); continue; }
      tw.t += dt; var p = Math.min(1, tw.t / (tw.dur || 0.0001));
      tw.fn(tw.ease(p), p);
      if (p >= 1) { tw.dead = true; tweens.splice(i, 1); if (tw.done) tw.done(); }
    }
    subs.slice().forEach(function (f) { f(dt); });
  }
  KS.step = step; // untuk uji
  document.addEventListener('visibilitychange', function () {
    last = 0;
    if (KS.audio) KS.audio.visibility(!document.hidden);
    if (document.hidden && window.speechSynthesis) speechSynthesis.cancel();
  });

  /* skala kanvas logis 1280x720 */
  KS.scale = 1;
  function fit() {
    var w = window.innerWidth, h = window.innerHeight, s = Math.min(w / 1280, h / 720);
    KS.scale = s;
    var st = document.getElementById('stage');
    st.style.transform = 'translate(' + ((w - 1280 * s) / 2) + 'px,' + ((h - 720 * s) / 2) + 'px) scale(' + s + ')';
    document.getElementById('rotate').classList.toggle('on', h > w);
  }
  window.addEventListener('resize', fit); window.addEventListener('orientationchange', fit);
  KS.rel = function (el) { // kotak elemen dalam koordinat kanvas
    var a = el.getBoundingClientRect(), b = document.getElementById('stage').getBoundingClientRect(), s = KS.scale;
    return { x: (a.left - b.left) / s, y: (a.top - b.top) / s, w: a.width / s, h: a.height / s };
  };

  /* adegan */
  var scenes = {}, cur = null;
  KS.scene = function (name, def) { scenes[name] = def; };
  KS.go = function (name, params) {
    /* gerbang tunggal: level terkunci tidak bisa dimainkan dari jalur mana pun */
    if (name === 'play' && !KS.levelOpen((params && params.level) || 1)) { params = { mode: params && params.mode, locked: params.level }; name = 'select'; }
    var stage = document.getElementById('stage'), old = cur;
    var root = KS.h('div', { class: 'scene', 'data-scene': name });
    stage.appendChild(root);
    var inst = scenes[name](root, params || {});
    cur = { name: name, root: root, inst: inst };
    KS.sceneName = name;
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('in'); }); });
    if (old) {
      if (old.inst && old.inst.exit) old.inst.exit();
      old.root.classList.remove('in');
      setTimeout(function () { if (old.root.parentNode) old.root.parentNode.removeChild(old.root); }, KS.reduce ? 30 : 320);
    }
    return inst;
  };
  KS.current = function () { return cur; };

  /* tombol: bunyi klik untuk semua .btn */
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.btn');
    if (b && !b.disabled && KS.audio) KS.audio.sfx('click');
  }, true);

  KS.init = function () { KS.applySettings(); fit(); requestAnimationFrame(frame); };
})();
