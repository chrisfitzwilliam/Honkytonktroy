/* Honky Tonk Troy — iOS-only parallax fallback for .parallax-break sections.
   Every other browser uses CSS background-attachment: fixed. iOS Safari
   doesn't paint fixed attachment, so on iOS we translate each section's
   ::before pseudo-element on scroll via the --parallax-y custom property. */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    const isIOS = window.CSS && CSS.supports && CSS.supports('-webkit-touch-callout', 'none');
    if (!isIOS) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = Array.from(document.querySelectorAll('.parallax-break'));
    if (!sections.length) return;

    const active = new Set();
    let ticking = false;

    function update() {
      ticking = false;
      const vh = window.innerHeight;
      const viewportCenter = vh / 2;
      active.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const denom = vh / 2 + rect.height / 2;
        let progress = (viewportCenter - sectionCenter) / denom;
        if (progress > 1) progress = 1;
        else if (progress < -1) progress = -1;
        const y = progress * rect.height * 0.22;
        el.style.setProperty('--parallax-y', y.toFixed(2) + 'px');
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      });
      if (active.size) onScroll();
    }, { rootMargin: '20% 0px' });
    sections.forEach(function (s) { observer.observe(s); });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  });
})();
