/* O fio: um path medido do novelo até o ponto de cada caderno e até o rodapé. */
(function(){
  var wrap = document.getElementById('topo');
  var svg = wrap.querySelector('.fio'), path = svg.querySelector('path');
  var knot = wrap.querySelector('[data-fio="inicio"]');
  var dots = Array.prototype.slice.call(wrap.querySelectorAll('[data-fio="ponto"]'));
  var end = wrap.querySelector('[data-fio="fim"]');
  var lastD = '', lastH = -1;

  function round(raw, r){
    var p = raw.reduce(function(acc, q){ var l = acc[acc.length - 1]; if (!l || Math.hypot(q.x - l.x, q.y - l.y) > 0.5) acc.push(q); return acc; }, []);
    var d = 'M' + p[0].x + ',' + p[0].y;
    for (var i = 1; i < p.length - 1; i++) {
      var a = p[i - 1], b = p[i], c = p[i + 1];
      var l1 = Math.hypot(b.x - a.x, b.y - a.y), l2 = Math.hypot(c.x - b.x, c.y - b.y);
      var rr = Math.min(r, l1 / 2, l2 / 2);
      d += ' L' + (b.x + (a.x - b.x) * rr / l1) + ',' + (b.y + (a.y - b.y) * rr / l1) +
           ' Q' + b.x + ',' + b.y + ' ' + (b.x + (c.x - b.x) * rr / l2) + ',' + (b.y + (c.y - b.y) * rr / l2);
    }
    var z = p[p.length - 1];
    return d + ' L' + z.x + ',' + z.y;
  }

  function measure(){
    var wr = wrap.getBoundingClientRect();
    var c = function(el){ var r = el.getBoundingClientRect(); return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 }; };
    var pts = [c(knot)];
    dots.forEach(function(dot){
      var b = c(dot), a = pts[pts.length - 1];
      /* Mesma coluna: o novelo e os pontos diferem por 1px no centro; o fio segue reto, sem degrau. */
      if (Math.abs(b.x - a.x) < 4) b.x = a.x;
      var gy = dot.parentElement.getBoundingClientRect().top - wr.top - 40;
      pts.push({ x: a.x, y: gy });
      var dx = b.x - a.x;
      if (Math.abs(dx) > 70) { var m = a.x + dx / 2; pts.push({ x: m - 12, y: gy }, { x: m - 12, y: gy - 18 }, { x: m + 12, y: gy - 18 }, { x: m + 12, y: gy }); }
      pts.push({ x: b.x, y: gy }, b);
    });
    var e = c(end), a = pts[pts.length - 1], gy = e.y - 36;
    if (Math.abs(e.x - a.x) < 4) e.x = a.x;
    pts.push({ x: a.x, y: gy }, { x: e.x, y: gy }, e);
    var d = round(pts, 14);
    if (d !== lastD) { path.setAttribute('d', d); lastD = d; }
    if (wr.height !== lastH) { svg.style.height = wr.height + 'px'; lastH = wr.height; }
  }

  measure();
  if (window.ResizeObserver) new ResizeObserver(measure).observe(wrap);
  else window.addEventListener('resize', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  setTimeout(function(){ svg.classList.add('drawn'); }, 150);
})();
