// ===== Respect reduced-motion preference =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Mobile nav toggle =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
  '.hero__text, .hero__art, .about__side, .about__main, .proposition__inner, .service__text, .service__visual, .vid-grid, .others__card, .others__visual, .friends__head, .friends__body, .motion-images'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

// stagger index for the two grid animations (clients + motion graphics),
// so each tile's CSS transition-delay is just calc(var(--i) * Ns)
document.querySelectorAll('.clients-grid .client-card, .motion-images .image-box').forEach((el, i) => {
  el.style.setProperty('--i', i);
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((el) => io.observe(el));

// ===== Showreel button (placeholder interaction) =====
const showreelBtn = document.getElementById('showreelBtn');

if (showreelBtn) {
  showreelBtn.addEventListener('click', () => {
    const playIcon = showreelBtn.querySelector('.showreel__play');
    playIcon.textContent = '⏸';
    setTimeout(() => {
      playIcon.textContent = '▶';
    }, 1200);
  });
}

// ===== Nav scroll shadow + scroll progress bar + back-to-top =====
const nav = document.getElementById('nav');
const scrollProgress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');

function onScroll() {
  const scrollY = window.scrollY || window.pageYOffset;

  // nav shadow once the page has scrolled a bit
  if (nav) nav.classList.toggle('is-scrolled', scrollY > 8);

  // scroll progress bar fill
  if (scrollProgress) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  }

  // back-to-top visibility
  if (toTop) toTop.classList.toggle('show', scrollY > 700);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (toTop) {
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// ===== Stat count-up =====
const statNums = document.querySelectorAll('.stat__num[data-count]');

function animateCount(el) {
  const target = parseInt(el.getAttribute('data-count'), 10) || 0;

  if (prefersReducedMotion) {
    el.textContent = `${target}+`;
    return;
  }

  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    // ease-out-cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${value.toLocaleString()}+`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

if (statNums.length) {
  const statIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  statNums.forEach((el) => statIo.observe(el));
}

// ===== Gentle 3D tilt on cards (desktop pointer devices only) =====
const tiltTargets = document.querySelectorAll('.trend-panel, .others__card');
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsHover && !prefersReducedMotion) {
  tiltTargets.forEach((card) => {
    const maxTilt = 6;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${(-y * maxTilt).toFixed(2)}deg) rotateY(${(x * maxTilt).toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}