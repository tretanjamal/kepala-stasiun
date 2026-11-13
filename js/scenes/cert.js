/* Sertifikat akhir: digambar di kanvas (bisa disimpan PNG dan dicetak). Nama opsional, hanya di perangkat. */
(function () {
  'use strict';
  var KS = window.KS, S = window.KS_STR, C = S.sertifikat, h = KS.h;

  KS.certStars = function () { var p = KS.store.get('prog', {}), n = 0; for (var i = 1; i <= 5; i++) { var v = p['L' + i]; n += (typeof v === 'number') ? v : (v && v.s) || 0; } return n; };
  KS.certReady = function () { return [1, 2, 3, 4].every(KS.levelDone); };

  function wrap(c, text, max) { var words = text.split(' '), lines = [], cur = ''; words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > max && cur) { lines.push(cur); cur = w; } else cur = t; }); if (cur) lines.push(cur); return lines; }
  function draw(cv, bg, name) {
    var c = cv.getContext('2d'), FF = '"Poppins KS","Poppins","Trebuchet MS","Segoe UI",sans-serif', T = '#3A2A1F';
    c.clearRect(0, 0, 1280, 720); if (bg) c.drawImage(bg, 0, 0, 1280, 720); else { c.fillStyle = '#FFF3D6'; c.fillRect(0, 0, 1280, 720); }
    c.textAlign = 'center'; c.fillStyle = T;
    c.font = '700 40px ' + FF; c.fillStyle = '#B5442E'; c.fillText(C.judul, 640, 86);
    c.fillStyle = '#1F5F4A'; c.font = '700 34px ' + FF; c.fillText(C.sub, 640, 200);
    c.fillStyle = T; c.font = '500 24px ' + FF; c.fillText(C.beri, 640, 240);
    var nm = (name || '').trim() || C.anon, size = 62; c.font = '700 ' + size + 'px ' + FF; while (c.measureText(nm).width > 760 && size > 28) { size -= 2; c.font = '700 ' + size + 'px ' + FF; }
    c.fillText(nm, 640, 306); c.fillStyle = '#F4B73F'; c.fillRect(380, 320, 520, 5);
    c.fillStyle = T; c.font = '500 23px ' + FF; c.fillText(C.selesai, 640, 362);
    var tags = KS.store.get('skills', []), order = ['jam-tepat', 'setengah', 'seperempat', 'hari', 'jawab-waktu'], y = 398;
    var sk = order.filter(function (k) { return tags.indexOf(k) >= 0; }); if (!sk.length) sk = ['jam-tepat'];
    c.textAlign = 'left'; c.font = '500 23px ' + FF;
    sk.slice(0, 5).forEach(function (k) { c.fillText('\u2022 ' + C.skill[k], 300, y); y += 27; });
    c.textAlign = 'center'; c.font = '700 23px ' + FF; c.fillStyle = '#1F5F4A'; c.fillText(C.bintang + ': ' + KS.certStars() + ' / 15', 640, 526);
    var d = new Date(); c.fillStyle = T; c.font = '500 22px ' + FF;
    c.fillText(C.tanggal + ': ' + d.getDate() + ' ' + C.bulan[d.getMonth()] + ' ' + d.getFullYear(), 815, 606);
    c.font = 'italic 700 30px ' + FF; c.fillText(C.bu, 430, 600); c.fillStyle = T; c.fillRect(350, 608, 160, 3);
    c.font = '500 20px ' + FF; c.fillText(C.buJab, 430, 632);
    c.fillStyle = '#6b5a48'; c.font = '500 20px ' + FF; c.fillText(C.pengembang, 640, 556);
  }

  KS.scene('cert', function (root, P) {
    root.classList.add('cert');
    var cv = h('canvas', { width: 1280, height: 720, class: 'certcv', role: 'img', 'aria-label': C.judul }); root.appendChild(cv);
    var bg = null, name = KS.store.get('nama', '');
    var input = h('input', { type: 'text', class: 'nameinput', maxlength: '24', placeholder: C.nama, 'aria-label': C.nama, autocomplete: 'off', value: name });
    function redraw() { draw(cv, bg, input.value); }
    var img = new Image(); img.onload = function () { bg = img; redraw(); }; img.src = window.KS_CERT_BG; redraw();
    if (document.fonts && document.fonts.load) { document.fonts.load('700 40px "Poppins KS"').then(redraw); document.fonts.load('500 24px "Poppins KS"').then(redraw); }
    input.addEventListener('input', function () { KS.store.set('nama', input.value); redraw(); });
    input.addEventListener('keydown', function (e) { e.stopPropagation(); });
    var note = h('div', { class: 'certnote', 'aria-live': 'polite' });
    function save() { try { cv.toBlob(function (b) { if (!b) { note.textContent = C.gagal; return; } var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'sertifikat-kepala-stasiun.png'; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); URL.revokeObjectURL(a.href); }, 500); }, 'image/png'); } catch (e) { note.textContent = C.gagal; } }
    function print() { try { var im = document.getElementById('printimg') || document.body.appendChild(h('img', { id: 'printimg', alt: C.judul })); im.src = cv.toDataURL('image/png'); setTimeout(function () { window.print(); }, 200); } catch (e) { note.textContent = C.gagal; } }
    var bar = h('div', { class: 'panel certbar' }, input, KS.btn(C.simpan, 'g', save), KS.btn(C.cetak, 'b', print), KS.btn(S.btn.kembali, 'e', function () { KS.go('select', { mode: P.mode }); }));
    root.append(h('div', { class: 'certpriv' }, C.privasi), bar, note);
    KS.audio.play('hasil');
    if (KS.test) window.__cert = { canvasOk: function () { try { cv.toDataURL('image/png'); return true; } catch (e) { return false; } }, name: function (t) { input.value = t; input.dispatchEvent(new Event('input')); } };
    return { exit: function () { if (window.__cert) delete window.__cert; } };
  });
})();
