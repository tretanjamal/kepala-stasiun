/* Layar muat: memuat gambar dan font lokal, lalu masuk ke judul. */
(function () {
  'use strict';
  var KS = window.KS, S = window.KS_STR, h = KS.h;
  KS.scene('muat', function (root) {
    root.classList.add('muat');
    var bar = h('i', { class: 'fill' }), txt = h('div', { class: 'mt' }, S.ui.muat);
    root.append(h('div', { class: 'mtitle' }, S.judul), h('div', { class: 'mtag' }, S.tagline),
      h('div', { class: 'mtrack' }, bar, h('div', { class: 'mtrain', html: KS.trainHTML('beach', 130) })), txt);
    var urls = Object.keys(KS_ASSETS.img).map(function (k) { return KS_ASSETS.img[k]; }), done = 0, total = urls.length + 1, shown = 0, finished = false, t0 = Date.now();
    function tick() { done++; }
    urls.forEach(function (u) { var im = new Image(); im.onload = im.onerror = tick; im.src = u; });
    var fp = (document.fonts && document.fonts.load) ? Promise.all([document.fonts.load('700 20px "Poppins KS"'), document.fonts.load('500 20px "Poppins KS"')]) : Promise.resolve();
    fp.then(tick, tick);
    var off = KS.onUpdate(function (dt) {
      var target = Math.min(1, done / total); shown += (target - shown) * Math.min(1, dt * 6);
      bar.style.width = (shown * 100).toFixed(1) + '%'; root.querySelector('.mtrain').style.left = (shown * 560) + 'px';
      var minMs = KS.test ? 0 : 700;
      if (!finished && done >= total && shown > 0.97 && Date.now() - t0 > minMs) { finished = true; off(); KS.go('title'); }
    });
    setTimeout(function () { if (!finished) { finished = true; off(); KS.go('title'); } }, 8000);
    return { exit: function () { off(); } };
  });
})();
