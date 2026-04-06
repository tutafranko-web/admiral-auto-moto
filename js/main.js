/* ===== Admiral Auto Moto d.o.o. — Main JS ===== */

// ---- Mobile Menu ----
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('mobile-close');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ---- Navbar Scroll Shadow ----
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ---- Animated Counters ----
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  let animated = false;
  const section = counters[0].closest('.am-stats');
  if (!section) return;

  function animateCounters() {
    if (animated) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      animated = true;
      counters.forEach(el => {
        const target = el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const isNumber = /^\d+$/.test(target);
        if (!isNumber) { el.textContent = target; return; }

        const end = parseInt(target);
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * end) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();
}

// ---- Gallery Lightbox ----
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox) return;

  document.querySelectorAll('.am-gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) closeLightbox();
  });

  const closeBtn = lightbox.querySelector('.am-lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
}

// ---- Filter Buttons (Gallery & Catalog) ----
function initFilters() {
  const buttons = document.querySelectorAll('.am-filter-btn');
  const items = document.querySelectorAll('[data-category]');
  if (!buttons.length || !items.length) return;

  function applyFilter(filter) {
    buttons.forEach(b => {
      b.classList.toggle('active', b.dataset.filter === filter);
    });
    items.forEach(item => {
      const cat = item.dataset.category || '';
      const match = filter === 'all' || cat === filter || cat.includes(filter);
      item.style.display = match ? '' : 'none';
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyFilter(btn.dataset.filter);
      history.replaceState(null, '', '#' + btn.dataset.filter);
    });
  });

  // Apply filter from URL hash (e.g. katalog.html#vozila)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    applyFilter(hash);
  }
}

// ---- Contact Form ----
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Slanje...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Poslano ��';
      btn.style.background = '#22c55e';
      setTimeout(() => {
        alert('Hvala na poruci! Javit ćemo vam se uskoro.');
        form.reset();
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 800);
    }, 1000);
  });
}

// ---- Contact Pre-fill from URL ----
function initContactPrefill() {
  const select = document.getElementById('contact-subject');
  if (!select) return;

  const params = new URLSearchParams(window.location.search);
  const usluga = params.get('usluga') || params.get('predmet');
  if (usluga) {
    for (const option of select.options) {
      if (option.value === usluga) {
        option.selected = true;
        break;
      }
    }
  }
}

// ---- Scroll Reveal Animation ----
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length || prefersReduced) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    observer.observe(el);
  });
}

// ---- Back to Top Button ----
function initBackToTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNavScroll();
  initCounters();
  initLightbox();
  initFilters();
  initContactForm();
  initContactPrefill();
  initScrollReveal();
  initBackToTop();
});
