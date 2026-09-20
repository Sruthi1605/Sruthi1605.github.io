const nav = document.querySelector('.nav');

function onScroll() {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const progress = document.querySelector('#scrollProgress');

function onProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}

window.addEventListener('scroll', onProgress, { passive: true });
window.addEventListener('resize', onProgress, { passive: true });
onProgress();

const themeToggle = document.querySelector('#themeToggle');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    /* private mode etc., ignore */
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
  });
  themeToggle.setAttribute('aria-pressed', document.documentElement.dataset.theme === 'light' ? 'true' : 'false');
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  const taglineEl = document.querySelector('.hero-tagline');

  if (taglineEl) {
    const fullText = taglineEl.textContent;
    taglineEl.textContent = '';
    let i = 0;

    function type() {
      if (i < fullText.length) {
        taglineEl.textContent = fullText.slice(0, i + 1);
        i += 1;
        setTimeout(type, 40);
      } else {
        taglineEl.classList.add('typed');
      }
    }

    setTimeout(type, 600);
  }

  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  const canvas = document.querySelector('#cursor-trail');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COLORS = ['92, 225, 230', '123, 92, 230', '172, 240, 120'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  document.addEventListener(
    'mousemove',
    (e) => {
      for (let i = 0; i < 2; i += 1) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9,
          life: 1,
          size: Math.random() * 3 + 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
      if (particles.length > 160) {
        particles = particles.slice(-160);
      }
    },
    { passive: true }
  );

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life -= 0.018;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${(p.life * 0.85).toFixed(3)})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  draw();
}

function animateCounters(strip) {
  const nums = strip.querySelectorAll('.stat-num');
  const duration = 1400;

  nums.forEach((num) => {
    const target = parseFloat(num.dataset.target);
    const decimals = parseInt(num.dataset.decimals || '0', 10);
    const suffix = num.dataset.suffix || '';

    if (reduceMotion) {
      num.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      num.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
}

const statsStrip = document.querySelector('.stats');

if (statsStrip) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animateCounters(entry.target);
          statsObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.45 }
  );
  statsObserver.observe(statsStrip);
}

if (!reduceMotion) {
  const confettiCanvas = document.querySelector('#confetti-canvas');
  const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiBits = [];
  const CONFETTI_COLORS = ['#5ce1e6', '#7b5ce6', '#ffd873', '#ff7bab', '#8af9a2'];

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function burst(x, y, count) {
    if (!confettiCtx) return;
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 3;
      confettiBits.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size: Math.random() * 6 + 3,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        life: 1,
      });
    }
    if (confettiBits.length > 400) {
      confettiBits = confettiBits.slice(-400);
    }
  }

  function drawConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = confettiBits.length - 1; i >= 0; i -= 1) {
      const p = confettiBits[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.rot += p.vr;
      p.life -= 0.012;
      if (p.life <= 0 || p.y > confettiCanvas.height + 20) {
        confettiBits.splice(i, 1);
        continue;
      }
      confettiCtx.save();
      confettiCtx.globalAlpha = Math.max(p.life, 0);
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.fillStyle = p.color;
      if (p.shape === 'rect') {
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }
      confettiCtx.restore();
    }
    requestAnimationFrame(drawConfetti);
  }

  resizeConfetti();
  window.addEventListener('resize', resizeConfetti, { passive: true });
  drawConfetti();

  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="mailto:"]');
    if (target) {
      burst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 120);
    }
  });
}

const statusChip = document.querySelector('#statusChip');

if (statusChip) {
  const statusText = document.querySelector('#statusText');
  const savedStatus = (() => {
    try {
      return localStorage.getItem('availability') || 'open';
    } catch (e) {
      return 'open';
    }
  })();
  let availability = savedStatus === 'working' ? 'working' : 'open';

  function renderStatus() {
    const isOpen = availability === 'open';
    statusChip.classList.toggle('working', !isOpen);
    statusText.textContent = isOpen ? 'Open to work' : 'Currently working at Perficient';
    statusChip.setAttribute('aria-pressed', isOpen ? 'true' : 'false');
    try {
      localStorage.setItem('availability', availability);
    } catch (e) {
      /* ignore */
    }
  }

  function toggleStatus() {
    availability = availability === 'open' ? 'working' : 'open';
    renderStatus();
  }

  statusChip.addEventListener('click', toggleStatus);
  statusChip.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleStatus();
    }
  });
  renderStatus();
}

const toTop = document.querySelector('#toTop');

if (toTop) {
  const onTopScroll = () => {
    if (window.scrollY > 450) {
      toTop.classList.add('show');
    } else {
      toTop.classList.remove('show');
    }
  };

  window.addEventListener('scroll', onTopScroll, { passive: true });
  onTopScroll();

  toTop.addEventListener('click', () => {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  });
}