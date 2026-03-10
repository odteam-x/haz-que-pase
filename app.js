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