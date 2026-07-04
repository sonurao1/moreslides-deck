// Mobile nav toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Scroll reveal
const revealTargets = document.querySelectorAll(
  '.hero__text, .hero__art, .about__side, .about__main, .proposition__inner, .service__text, .service__visual, .others__card, .others__visual, .friends__head, .friends__body'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => io.observe(el));

// Showreel button (placeholder interaction)
const showreelBtn = document.getElementById('showreelBtn');
if (showreelBtn) {
  showreelBtn.addEventListener('click', () => {
    showreelBtn.querySelector('.showreel__play').textContent = '⏸';
    setTimeout(() => {
      showreelBtn.querySelector('.showreel__play').textContent = '▶';
    }, 1200);
  });
}



