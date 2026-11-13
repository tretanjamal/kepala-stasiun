/* Audio: efek suara disintesis WebAudio, musik mp3 dengan ducking. */
(function () {
  'use strict';
  var KS = window.KS;
  var ctx = null, master = null, noiseBuf = null;
  var el = null, cur = null, vol = 0, ducked = 0, hiddenNow = false;
  var BASE = 0.42;

  function unlock() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
        noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (el && el.paused && KS.settings.musik && !hiddenNow) { var p = el.play(); if (p && p.catch) p.catch(function () {}); }
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, unlock, { passive: true }); });

  function ok() { return ctx && KS.settings.suara; }
  function tone(f, dur, type, v, delay, f2) {
    var t0 = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v || 0.15, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(dur, v, delay, freq, type, q) {
    var t0 = ctx.currentTime + (delay || 0), s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; f.type = type || 'lowpass'; f.frequency.value = freq || 800; if (q) f.Q.value = q;
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v || 0.2, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t0); s.stop(t0 + dur + 0.02);
  }
  var S = {
    click: function () { tone(560, 0.07, 'triangle', 0.14, 0, 380); },
    flip: function () { [0, 0.07, 0.13, 0.2].forEach(function (d) { noise(0.04, 0.18, d, 2400, 'highpass'); tone(200, 0.03, 'square', 0.04, d); }); },
    whistle: function (soft) {
      var t0 = ctx.currentTime, o = ctx.createOscillator(), l = ctx.createOscillator(), lg = ctx.createGain(), g = ctx.createGain(), v = soft ? 0.08 : 0.2;
      o.type = 'sine'; o.frequency.setValueAtTime(2150, t0); o.frequency.linearRampToValueAtTime(2450, t0 + 0.12); o.frequency.linearRampToValueAtTime(2300, t0 + 1.0);
      l.frequency.value = 34; lg.gain.value = 110; l.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + 0.03); g.gain.setValueAtTime(v, t0 + 0.8); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.05);
      o.connect(g); g.connect(master); o.start(t0); l.start(t0); o.stop(t0 + 1.1); l.stop(t0 + 1.1);
      noise(1.0, v * 0.25, 0, 3200, 'bandpass', 4);
    },
    bell: function () { [0, 0.5].forEach(function (d) { tone(880, 0.9, 'sine', 0.12, d); tone(1320, 0.6, 'sine', 0.05, d); tone(660, 0.9, 'sine', 0.08, d + 0.02); }); },
    chuff: function () { for (var i = 0; i < 7; i++) noise(0.14, 0.2, i * (0.34 - i * 0.025), 600 + i * 40, 'lowpass'); },
    arrive: function () { noise(1.4, 0.22, 0, 500, 'lowpass'); tone(260, 0.5, 'sawtooth', 0.04, 1.0, 180); noise(0.6, 0.08, 1.2, 4000, 'highpass'); },
    correct: function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.28, 'triangle', 0.14, i * 0.08); }); },
    wrong: function () { tone(330, 0.28, 'triangle', 0.1, 0, 247); tone(247, 0.3, 'sine', 0.07, 0.12); },
    star: function (n) { var f = [523, 659, 784][n || 0] || 784; tone(f, 0.5, 'triangle', 0.16); tone(f * 2, 0.35, 'sine', 0.06, 0.02); },
    coin: function () { tone(1318, 0.05, 'square', 0.05); },
    tick: function () { tone(1800, 0.015, 'square', 0.025); },
    radio: function () { noise(0.18, 0.1, 0, 3000, 'bandpass', 2); tone(900, 0.1, 'sine', 0.06); }
  };
  KS.audio = {
    unlock: unlock,
    sfx: function (name, a) { if (!ok() || KS.test) return; try { S[name](a); } catch (e) {} },
    play: function (name) {
      if (cur === name) return;
      if (el) { var old = el; old.pause(); }
      cur = name;
      try { el = new Audio(KS_ASSETS.audio[name]); el.loop = true; el.volume = 0; vol = 0; } catch (e) { el = null; return; }
      if (KS.test) return;
      if (KS.settings.musik) { var p = el.play(); if (p && p.catch) p.catch(function () {}); }
    },
    stop: function () { if (el) el.pause(); el = null; cur = null; },
    duck: function (on) { ducked = on ? 1 : 0; },
    sync: function () { if (el) { if (KS.settings.musik && !hiddenNow) { if (el.paused) { var p = el.play(); if (p && p.catch) p.catch(function () {}); } } else el.pause(); } },
    visibility: function (vis) { hiddenNow = !vis; if (el) { if (vis && KS.settings.musik) { var p = el.play(); if (p && p.catch) p.catch(function () {}); } else el.pause(); } if (ctx) { vis ? ctx.resume() : ctx.suspend(); } }
  };
  KS.onUpdate(function (dt) {
    if (!el) return;
    var target = (KS.settings.musik && !hiddenNow) ? BASE * (ducked ? 0.25 : 1) : 0;
    vol += (target - vol) * Math.min(1, dt * 5);
    try { el.volume = Math.max(0, Math.min(1, vol)); } catch (e) {}
  });
})();
