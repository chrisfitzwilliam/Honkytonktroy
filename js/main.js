/* ============================================================
   HONKY TONK TROY — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll behavior ──────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;
    // Sticky nav styling
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Back-to-top visibility
    if (y > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  /* ── Mobile navigation toggle ────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Menu tabs ───────────────────────────────────────────── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const menuPanels = document.querySelectorAll('.menu-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-tab');

      // Update buttons
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Update panels
      menuPanels.forEach(function (panel) {
        panel.classList.remove('active');
      });
      const targetPanel = document.getElementById('tab-' + target);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  /* ── Contact form submission ─────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const wrap = contactForm.closest('.contact-form-wrap');
      wrap.innerHTML = '<div class="form-success">🤠 Yeehaw! We got your message.<br>We\'ll be in touch real soon!</div>';
    });
  }

  /* ── Newsletter form ─────────────────────────────────────── */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      newsletterForm.innerHTML = '<p style="font-family: var(--font-special); color: var(--color-amber); font-size: 0.85rem; letter-spacing: 0.05em;">✓ You\'re on the list!</p>';
    });
  }

  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Intersection observer: fade-in sections ─────────────── */
  const fadeTargets = document.querySelectorAll(
    '.about-grid, .event-card, .menu-item, .feature, .gallery-item, .contact-grid'
  );

  if ('IntersectionObserver' in window) {
    // Add initial hidden state via JS so it degrades gracefully
    fadeTargets.forEach(function (el) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    // Stagger child elements of grids
    document.querySelectorAll('.events-grid, .menu-grid, .features-grid, .gallery-grid').forEach(function (grid) {
      Array.from(grid.children).forEach(function (child, i) {
        child.style.transitionDelay = (i * 0.07) + 's';
      });
    });

    fadeTargets.forEach(function (el) { observer.observe(el); });
  }

  /* ── Gallery lightbox (simple overlay) ──────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const caption = item.querySelector('.gallery-caption');
      const label   = caption ? caption.textContent : 'Photo';

      // Create overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:9999',
        'background:rgba(0,0,0,0.9)',
        'display:flex', 'align-items:center', 'justify-content:center',
        'cursor:pointer', 'flex-direction:column', 'gap:16px'
      ].join(';');

      const msg = document.createElement('p');
      msg.style.cssText = 'font-family:Special Elite,Courier New,monospace; color:#c8890a; font-size:1rem; letter-spacing:0.2em; text-transform:uppercase;';
      msg.textContent = '📸 ' + label;

      const hint = document.createElement('p');
      hint.style.cssText = 'font-family:Lato,sans-serif; color:rgba(255,255,255,0.5); font-size:0.8rem;';
      hint.textContent = 'Add your real photos here — click to close';

      overlay.appendChild(msg);
      overlay.appendChild(hint);
      document.body.appendChild(overlay);

      overlay.addEventListener('click', function () {
        document.body.removeChild(overlay);
      });
      document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
          if (document.body.contains(overlay)) document.body.removeChild(overlay);
          document.removeEventListener('keydown', closeOnEsc);
        }
      });
    });
  });

  /* ── Ticker pause on hover ───────────────────────────────── */
  const ticker = document.querySelector('.ticker-track');
  if (ticker) {
    const tickerWrap = ticker.closest('.ticker-wrap');
    tickerWrap.addEventListener('mouseenter', function () {
      ticker.style.animationPlayState = 'paused';
    });
    tickerWrap.addEventListener('mouseleave', function () {
      ticker.style.animationPlayState = 'running';
    });
  }

})();
