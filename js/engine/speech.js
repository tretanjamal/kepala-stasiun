/* Suara pengumuman: speechSynthesis en-US. Bila tak tersedia, teks langsung tampil. */
(function () {
  'use strict';
  var KS = window.KS, ok = 'speechSynthesis' in window, voices = [];
  function load() { try { voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; } }
  if (ok) { load(); try { speechSynthesis.onvoiceschanged = load; } catch (e) {} }
  function pick(pref) {
    var us = voices.filter(function (v) { return /^en[-_]US/i.test(v.lang); });
    var en = voices.filter(function (v) { return /^en/i.test(v.lang); });
    var want = us.filter(function (v) { return pref === 'f' ? /(female|zira|aria|jenny|samantha|google us)/i.test(v.name) : /(male|david|guy|mark|alex|daniel)/i.test(v.name); });
    return want[0] || us[0] || en[0] || null;
  }
  var token = 0;
  KS.speech = {
    available: function () { return ok && !!pick('f') && KS.settings.suara; },
    cancel: function () { token++; if (ok) try { speechSynthesis.cancel(); } catch (e) {} KS.audio && KS.audio.duck(false); },
    /* mengembalikan Promise<boolean> (true bila benar-benar terdengar) */
    say: function (text, o) {
      o = o || {}; var my = ++token;
      return new Promise(function (res) {
        if (KS.test || !ok || !KS.settings.suara || !pick('f')) { setTimeout(function () { res(false); }, KS.test ? 0 : 500); return; }
        try { speechSynthesis.cancel(); } catch (e) {}
        var u = new SpeechSynthesisUtterance(text), v = pick(o.voice || 'f');
        u.voice = v; u.lang = (v && v.lang) || 'en-US'; u.rate = o.rate || 0.9; u.pitch = o.pitch || 1.05;
        var done = false;
        function fin(r) { if (done) return; done = true; clearTimeout(wd); if (my === token) KS.audio.duck(false); res(r); }
        var wd = setTimeout(function () { fin(true); }, text.length * 110 / (o.rate || 0.9) + 2500);
        u.onend = function () { fin(true); }; u.onerror = function () { fin(false); };
        KS.audio.duck(true);
        try { speechSynthesis.speak(u); } catch (e) { fin(false); }
      });
    }
  };
})();
