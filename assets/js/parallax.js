/* Honky Tonk Troy — mobile parallax for .parallax-break sections.
   On viewports <= 860px (and all iOS), translates each section's ::before
   pseudo-element on scroll via the --parallax-y custom property. */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    const sections = Array.from(document.querySelectorAll('.parallax-break'));
    if (!sections.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    const mobileMQ = window.matchMedia('(max-width: 860px)');

    const active = new Set();
    let ticking = false;
    let observer = null;
    let enabled = false;

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
        const y = progress * rect.height * 0.15;
        el.style.setProperty('--parallax-y', y.toFixed(2) + 'px');
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    function enable() {
      if (enabled) return;
      enabled = true;
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) active.add(entry.target);
          else active.delete(entry.target);
        });
        if (active.size) onScroll();
      }, { rootMargin: '20% 0px' });
      sections.forEach(function (s) { observer.observe(s); });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }

    function disable() {
      if (!enabled) return;
      enabled = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (observer) { observer.disconnect(); observer = null; }
      active.clear();
      sections.forEach(function (s) { s.style.removeProperty('--parallax-y'); });
    }

    function evaluate() {
      if (mobileMQ.matches) enable();
      else disable();
    }

    if (mobileMQ.addEventListener) mobileMQ.addEventListener('change', evaluate);
    else if (mobileMQ.addListener) mobileMQ.addListener(evaluate);

    evaluate();
  });
})();
