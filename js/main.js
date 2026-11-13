(function () {
  'use strict';
  var KS = window.KS;
  KS.init();
  if (KS.test) window.__test = { go: KS.go, step: KS.step, scene: function () { return KS.sceneName; } };
  /* pengaman ringan: tanpa menu klik-kanan, seret gambar, atau pilih teks (kecuali kolom nama) */
  document.addEventListener('contextmenu', function (e) { if (!KS.test) e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });
  document.addEventListener('selectstart', function (e) { if (!(e.target.closest && e.target.closest('input'))) e.preventDefault(); });
  KS.go('muat');
})();
