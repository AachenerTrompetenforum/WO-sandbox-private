/* ============================================
   ATF — Main Script
   ============================================ */

// --- THEME ---
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function getTheme() {
  const saved = localStorage.getItem('atf-theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('atf-theme', theme);
}

// Init theme immediately
setTheme(getTheme());

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// --- NAVBAR SCROLL ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}, { passive: true });

// --- MOBILE NAV ---
const burger = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');

burger?.addEventListener('click', () => {
  mobileNav?.classList.toggle('open');
});

mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// --- SCROLL REVEAL ---
function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', initReveal);

// --- WORLD MAP: handled inline per-page (D3-based), see ensembles.html

// --- TESTIMONIAL CAROUSEL ---
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  let interval;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.testimonial-dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAutoplay() {
    interval = setInterval(next, 5000);
  }

  startAutoplay();

  dotsContainer.addEventListener('click', () => {
    clearInterval(interval);
    startAutoplay();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTestimonials();
});


// --- SCROLLABLE MARQUEES (Autoscroll + Maus-Ziehen + Touch-Wischen, Endlosschleife) ---
function initMarquee(wrap, speed) {
  const track = wrap && wrap.firstElementChild;
  if (!track || !track.children.length) return;

  const originals = Array.from(track.children);
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const setWidth = track.scrollWidth + gap;
  if (!setWidth) return;

  // genug Kopien für nahtlose Schleife (Bereich [loopW, 2*loopW) + Sichtbreite)
  const viewport = Math.max(window.screen.width || 0, wrap.clientWidth, 1200);
  const copies = 2 + Math.ceil(viewport / setWidth);
  for (let c = 0; c < copies; c++) {
    originals.forEach(el => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }
  const loopW = track.children[originals.length].offsetLeft - track.children[0].offsetLeft;
  if (!loopW) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pos = loopW;
  wrap.scrollLeft = pos;

  let hover = false, dragging = false, touching = false, holdUntil = 0;
  const hold = ms => { holdUntil = performance.now() + ms; };

  // Maus: Ziehen
  let startX = 0, startLeft = 0;
  wrap.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragging = true; startX = e.clientX; startLeft = wrap.scrollLeft;
    wrap.classList.add('is-dragging');
    wrap.setPointerCapture(e.pointerId);
  });
  wrap.addEventListener('pointermove', e => {
    if (dragging) wrap.scrollLeft = startLeft - (e.clientX - startX);
  });
  const endDrag = e => {
    if (!dragging) return;
    dragging = false; wrap.classList.remove('is-dragging'); hold(1500);
    try { wrap.releasePointerCapture(e.pointerId); } catch (_) {}
  };
  wrap.addEventListener('pointerup', endDrag);
  wrap.addEventListener('pointercancel', endDrag);
  wrap.addEventListener('mouseenter', () => { hover = true; });
  wrap.addEventListener('mouseleave', () => { hover = false; });

  // Touch / Trackpad: natives Scrollen, Autoplay pausiert währenddessen
  wrap.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  const endTouch = () => { touching = false; hold(2500); };
  wrap.addEventListener('touchend', endTouch, { passive: true });
  wrap.addEventListener('touchcancel', endTouch, { passive: true });
  wrap.addEventListener('wheel', () => hold(2000), { passive: true });

  function tick() {
    const paused = hover || dragging || touching || performance.now() < holdUntil;
    if (paused) {
      pos = wrap.scrollLeft;
    } else if (!reduced) {
      pos += speed;
      wrap.scrollLeft = pos;
    }
    // Endlosschleife: Position immer im Bereich [loopW, 2*loopW) halten
    const sl = wrap.scrollLeft;
    if (sl >= 2 * loopW) { wrap.scrollLeft = sl - loopW; pos = pos - loopW; }
    else if (sl < loopW) { wrap.scrollLeft = sl + loopW; pos = pos + loopW; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', () => {
  initMarquee(document.querySelector('.gallery-marquee-wrap'), 0.6);
  initMarquee(document.querySelector('.news-marquee-wrap'), 0.6);
});
