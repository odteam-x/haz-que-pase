/* ══════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════ */
const cur  = document.getElementById('cur');
const curR = document.getElementById('curR');
let mx = -100, my = -100, rx = -100, ry = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function tickCursor() {
  cur.style.left  = mx + 'px';
  cur.style.top   = my + 'px';
  rx += (mx - rx) * .15;
  ry += (my - ry) * .15;
  curR.style.left = rx + 'px';
  curR.style.top  = ry + 'px';
  requestAnimationFrame(tickCursor);
})();

document
  .querySelectorAll('a, button, .hqp-card, .conv-card, .p-item, .doc, .resp-big, .resp-small')
  .forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width   = '18px';
      cur.style.height  = '18px';
      curR.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width   = '10px';
      cur.style.height  = '10px';
      curR.style.opacity = '.5';
    });
  });

/* ══════════════════════════════════════════════════
   NAV – SHRINK ON SCROLL
══════════════════════════════════════════════════ */
const mainNav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  mainNav.classList.toggle('shrunk', window.scrollY > 60);
});

/* ══════════════════════════════════════════════════
   HAMBURGER + MOBILE MENU
══════════════════════════════════════════════════ */
const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');

burger.addEventListener('click', () => {
  const isOpen = mobMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMob() {
  mobMenu.classList.remove('open');
  burger.classList.remove('open');
  document.body.style.overflow = '';
}

mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));

/* ══════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('on');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════════════
   HERO CANVAS – CONNECTED PARTICLES
══════════════════════════════════════════════════ */
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');
let W, H, pts = [];

function resizeCanvas() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.5 + .3;
    this.vx = (Math.random() - .5) * .25;
    this.vy = (Math.random() - .5) * .25;
    this.a  = Math.random() * .35 + .08;
  }

  step() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(223,176,246,${this.a})`;
    ctx.fill();
  }
}

for (let i = 0; i < 100; i++) pts.push(new Particle());

(function animateCanvas() {
  ctx.clearRect(0, 0, W, H);

  pts.forEach(p => { p.step(); p.draw(); });

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d  = Math.hypot(dx, dy);
      if (d < 90) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(223,176,246,${.07 * (1 - d / 90)})`;
        ctx.lineWidth   = .5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateCanvas);
})();
/* ══════════════════════════════════════════════════
   ESTRUCTURA ORG – TABS
══════════════════════════════════════════════════ */
(function () {
  document.querySelectorAll('.org-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.org-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.org-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('org-' + tab.dataset.tab).classList.add('active');
    });
  });
})();

/* ══════════════════════════════════════════════════
   MANUAL IMAGE – TILT / CLICK TO FLIP
══════════════════════════════════════════════════ */
(function () {
  const wrap = document.querySelector('.doc-manual-img-wrap');
  if (!wrap) return;
  wrap.addEventListener('click', () => {
    wrap.classList.toggle('flipped');
  });
})();
(function () {
  const TOTAL  = 10;
  const img    = document.getElementById('natGalleryImg');
  const curr   = document.getElementById('natCurrent');
  const prev   = document.getElementById('natPrev');
  const next   = document.getElementById('natNext');
  const dots   = document.querySelectorAll('.nat-dot');
  let   index  = 0;

  function goTo(n) {
    index = (n + TOTAL) % TOTAL;
    img.classList.add('fade');
    setTimeout(() => {
      img.src = (index + 1) + '.jpeg';
      img.alt = 'Nátaly Raposo foto ' + (index + 1);
      curr.textContent = index + 1;
      img.classList.remove('fade');
    }, 180);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

  /* Swipe support */
  let startX = 0;
  const stage = document.querySelector('.nat-gallery-stage');
  stage.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? index + 1 : index - 1);
  });
})();
/* ══════════════════════════════════════════════════
   CREDITS CANVAS – FLOATING STARS + METEORS
══════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('creditsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.2 + .2,
    a: Math.random() * .6 + .1,
    speed: Math.random() * .0003 + .0001,
    phase: Math.random() * Math.PI * 2
  }));

  class Meteor {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W * 1.5;
      this.y = -20;
      this.len = Math.random() * 120 + 60;
      this.speed = Math.random() * 3 + 2;
      this.a = Math.random() * .5 + .2;
      this.active = Math.random() > .6;
      this.delay = Math.random() * 300;
    }
    step() {
      if (this.delay > 0) { this.delay--; return; }
      this.x -= this.speed * .4;
      this.y += this.speed;
      if (this.y > H + 50) this.reset();
    }
    draw() {
      if (this.delay > 0 || !this.active) return;
      const grad = ctx.createLinearGradient(
        this.x, this.y,
        this.x + this.len * .4, this.y - this.len
      );
      grad.addColorStop(0, `rgba(223,176,246,${this.a})`);
      grad.addColorStop(1, 'rgba(223,176,246,0)');
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.len * .4, this.y - this.len);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
  const meteors = Array.from({ length: 6 }, () => new Meteor());

  let t = 0;
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    t += .008;
    stars.forEach(s => {
      const pulse = s.a + Math.sin(t * s.speed * 60 + s.phase) * .15;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(223,176,246,${Math.max(0, pulse)})`;
      ctx.fill();
    });
    meteors.forEach(m => { m.step(); m.draw(); });
    requestAnimationFrame(tick);
  })();
})();