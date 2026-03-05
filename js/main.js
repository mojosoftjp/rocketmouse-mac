/* ============================================================
   RocketMouse AI — Main JavaScript
   Scroll animations, nav behavior, interactions
   ============================================================ */

/* --- Auto language redirect (EN → JA) --- */
(function () {
  // Only redirect on EN pages (not already in /ja/)
  if (window.location.pathname.indexOf('/ja/') !== -1) return;

  // Skip if user has manually chosen a language
  if (localStorage.getItem('rm_lang_override')) return;

  // Check browser language
  var lang = navigator.language || navigator.userLanguage || '';
  if (lang.substring(0, 2).toLowerCase() === 'ja') {
    // Map current EN page to JA equivalent
    var path = window.location.pathname;
    var base = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    var jaUrl = path.substring(0, path.lastIndexOf('/') + 1) + 'ja/' + base;
    window.location.replace(jaUrl);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  initLangSwitch();
  initRevealAnimations();
  initNavScroll();
  initMobileMenu();
  initBentoHover();
  initFaqAccordion();
  initStarField();
  initCountUp();
});


/* --- Language switch: remember manual choice --- */
function initLangSwitch() {
  var btns = document.querySelectorAll('.lang-switch__btn');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Store that user explicitly chose a language
      localStorage.setItem('rm_lang_override', '1');
    });
  });
}


/* --- Intersection Observer for reveal animations --- */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-scale');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}


/* --- Nav scroll behavior --- */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial check
  nav.classList.toggle('scrolled', window.scrollY > 20);
}


/* --- Mobile menu toggle --- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const isOpen = links.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.innerHTML = isOpen
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
  });

  // Close on link click
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    });
  });
}


/* --- Bento card mouse tracking --- */
function initBentoHover() {
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}


/* --- FAQ accordion --- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const question = item.querySelector('.faq-item__question');
    if (!question) return;
    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      // Close all
      items.forEach((i) => i.classList.remove('open'));
      // Toggle current
      if (!wasOpen) item.classList.add('open');
    });
  });
}


/* --- Star field for hero --- */
function initStarField() {
  const container = document.querySelector('.hero__stars');
  if (!container) return;

  const count = 60;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
    star.style.setProperty('--delay', `${Math.random() * 5}s`);
    star.style.setProperty('--max-opacity', `${0.2 + Math.random() * 0.5}`);
    star.style.width = `${1 + Math.random() * 2}px`;
    star.style.height = star.style.width;
    container.appendChild(star);
  }
}


/* --- Count-up animation for stats --- */
function initCountUp() {
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          animateCount(el, target, prefix, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((el) => observer.observe(el));
}

function animateCount(el, target, prefix, suffix) {
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = `${prefix}${current}${suffix}`;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}


/* --- Smooth scroll for anchor links --- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
