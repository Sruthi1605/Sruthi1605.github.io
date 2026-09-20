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