/* Jam analog SVG. Sudut jarum dihitung dari waktu (menit total sejak 00.00). */
(function () {
  'use strict';
  var KS = window.KS, T = '#3A2A1F';
  /* o: { interactive, bare, step (menit per ketukan), onChange(totalMin), minuteLocked, label } */
  KS.makeClock = function (o) {
    o = o || {};
    var stepMin = o.step || 60, total = (o.start != null ? o.start : 12 * 60);
    var wrap = KS.h('div', { class: 'clock' + (o.interactive ? ' interactive' : '') });
    var nums = '', ticks = '', i;
    if (o.bare) {
      for (i = 0; i < 60; i++) { var a = i * 6 * Math.PI / 180, r1 = i % 5 ? 132 : 122; ticks += '<line x1="' + (Math.sin(a) * r1).toFixed(1) + '" y1="' + (-Math.cos(a) * r1).toFixed(1) + '" x2="' + (Math.sin(a) * 140).toFixed(1) + '" y2="' + (-Math.cos(a) * 140).toFixed(1) + '" stroke="' + T + '" stroke-width="' + (i % 5 ? 2 : 5) + '"/>'; }
      [12, 3, 6, 9].forEach(function (n) { var a = n * 30 * Math.PI / 180; nums += '<text x="' + (Math.sin(a) * 100).toFixed(1) + '" y="' + (-Math.cos(a) * 100 + 18).toFixed(1) + '" text-anchor="middle" font-size="52" font-weight="700" fill="' + T + '">' + n + '</text>'; });
    } else {
      for (i = 1; i <= 12; i++) { var b = i * 30 * Math.PI / 180; nums += '<text class="num" data-n="' + i + '" x="' + (Math.sin(b) * 106).toFixed(1) + '" y="' + (-Math.cos(b) * 106 + 10).toFixed(1) + '" text-anchor="middle" font-size="28" font-weight="700" fill="' + T + '">' + i + '</text>'; }
      for (i = 0; i < 60; i++) { var c = i * 6 * Math.PI / 180, r2 = i % 5 ? 126 : 120; ticks += '<line x1="' + (Math.sin(c) * r2).toFixed(1) + '" y1="' + (-Math.cos(c) * r2).toFixed(1) + '" x2="' + (Math.sin(c) * 130).toFixed(1) + '" y2="' + (-Math.cos(c) * 130).toFixed(1) + '" stroke="' + T + '" stroke-width="' + (i % 5 ? 1.5 : 3) + '"/>'; }
    }
    var face = o.bare ? '<circle r="146" fill="#FFFDF7"/>' : '<circle r="146" fill="#FFFDF7" stroke="' + T + '" stroke-width="6"/><circle r="134" fill="none" stroke="#F4B73F" stroke-width="5"/>';
    var svg = '<svg viewBox="-150 -150 300 300" role="' + (o.interactive ? 'slider' : 'img') + '" aria-label="' + (o.label || 'Jam') + '"' + (o.interactive ? ' tabindex="0"' : '') + '>' + face + ticks + nums +
      '<g class="hand-min"><path d="M-5 18 L-5 -100 Q0 -124 5 -100 L5 18Z" fill="#2F6FD0" stroke="' + T + '" stroke-width="3.5" stroke-linejoin="round"/><circle cy="-116" r="7" fill="#2F6FD0" stroke="' + T + '" stroke-width="3"/></g>' +
      '<g class="hand-hour"><path d="M-11 18 L-11 -44 L0 -78 L11 -44 L11 18Z" fill="#B5442E" stroke="' + T + '" stroke-width="4" stroke-linejoin="round"/></g>' +
      '<circle r="10" fill="' + T + '"/><circle r="4" fill="#F4B73F"/></svg>';
    wrap.innerHTML = svg;
    var s = wrap.firstChild, hh = s.querySelector('.hand-hour'), mh = s.querySelector('.hand-min');
    function draw() { hh.setAttribute('transform', 'rotate(' + (total * 0.5) + ')'); mh.setAttribute('transform', 'rotate(' + (total * 6) + ')'); s.setAttribute('aria-valuetext', Math.floor(total / 60 % 12 || 12) + ':' + KS.waktu.pad(Math.round(total % 60))); }
    draw();
    var api = {
      el: wrap, svg: s, hh: hh, mh: mh,
      get: function () { return total; },
      set: function (t) { total = t; draw(); },
      hour: function () { return Math.floor((total + 0.001) / 60) % 12 || 12; },
      minute: function () { return Math.round(total % 60) % 60; },
      /* animasi ke waktu tujuan (maju searah jarum jam bila fwd) */
      to: function (t, dur, done) {
        var from = total; if (t === from) { done && done(); return; }
        KS.tween(dur || 0.25, function (p) { total = from + (t - from) * p; draw(); }, KS.ease.inOutCubic, function () { total = t; draw(); done && done(); });
      },
      flash: function (which) { var g = which === 'min' ? mh : hh; g.classList.add('flash'); setTimeout(function () { g.classList.remove('flash'); }, 1600); },
      grow: function (which) { s.classList.toggle('grow-hour', which === 'hour'); s.classList.toggle('grow-min', which === 'min'); },
      numEl: function (n) { return s.querySelector('.num[data-n="' + n + '"]'); },
      lockHour: false
    };
    if (o.interactive) {
      var two = !!o.two, mins = o.mins || [0], dragT = null;
      api.lockHour = false; api.lockMin = false;
      api.minute = function () { return Math.round(total % 60) % 60; };
      api.hour = function () { return Math.floor((total + 0.001) / 60) % 12 || 12; };
      api.setHM = function (hh, mm) { total = (((hh - 1 + 12) % 12) + 1) * 60 + mm; draw(); };
      function snapMin(m) { var best = mins[0], bd = 99; mins.forEach(function (a) { var d = Math.min(Math.abs(a - m), 60 - Math.abs(a - m)); if (d < bd) { bd = d; best = a; } }); return best; }
      function emit(src) { KS.audio.sfx('tick'); o.onChange && o.onChange(total, src); }
      function fromPointer(ev) {
        var r = s.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = ev.clientX - cx, dy = ev.clientY - cy, rad = Math.sqrt(dx * dx + dy * dy) / (r.width / 300);
        var ang = Math.atan2(dx, -dy) * 180 / Math.PI; if (ang < 0) ang += 360;
        return { ang: ang, rad: rad };
      }
      function apply(ev, first) {
        var p = fromPointer(ev);
        if (first) dragT = (!two || p.rad < 88) ? 'hour' : 'min';
        if (dragT === 'hour') {
          if (api.lockHour) return; var n = Math.round(p.ang / 30) % 12 || 12;
          if (n !== api.hour()) { var m0 = api.minute(); total = n * 60 + m0; draw(); emit('drag'); }
        } else {
          if (api.lockMin) return; var m = snapMin(Math.round(p.ang / 6) % 60);
          if (m !== api.minute()) { total = api.hour() * 60 + m; draw(); emit('drag'); }
        }
      }
      s.addEventListener('pointerdown', function (ev) { drag = true; try { s.setPointerCapture(ev.pointerId); } catch (e) {} apply(ev, true); ev.preventDefault(); });
      s.addEventListener('pointermove', function (ev) { if (drag) apply(ev, false); });
      s.addEventListener('pointerup', function () { drag = false; }); s.addEventListener('pointercancel', function () { drag = false; });
      var drag = false;
      api.step = function (d) { if (api.lockHour) return; var n = ((api.hour() - 1 + d + 12) % 12) + 1; total = n * 60 + api.minute(); draw(); emit('step'); };
      api.stepMin = function (d) { if (api.lockMin) return; var i = mins.indexOf(api.minute()); if (i < 0) i = 0; i = (i + d + mins.length) % mins.length; total = api.hour() * 60 + mins[i]; draw(); emit('step'); };
      s.addEventListener('keydown', function (ev) {
        var k = ev.key;
        if (k === 'ArrowRight') api.step(1); else if (k === 'ArrowLeft') api.step(-1);
        else if (two && k === 'ArrowUp') api.stepMin(1); else if (two && k === 'ArrowDown') api.stepMin(-1); else return;
        ev.preventDefault();
      });
    }
    return api;
  };
})();
