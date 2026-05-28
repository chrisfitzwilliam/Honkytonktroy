/* Honky Tonk Troy — site header: scroll shadow, scroll-spy, menu tabs */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* ----- Header scroll shadow ----- */
    const header = document.querySelector('.site-header');
    if (header) {
      function updateHeader() {
        header.classList.toggle('is-scrolled', window.scrollY > 20);
      }
      window.addEventListener('scroll', updateHeader, { passive: true });
      updateHeader();
    }

    /* ----- Scroll-spy: highlight current section in nav + bottom tabs ----- */
    const navLinks = document.querySelectorAll(
      '.sh-nav a[data-section], .bottom-tabs a[data-section]'
    );
    const sectionIds = Array.from(new Set(
      Array.from(navLinks).map(a => a.dataset.section)
    ));
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      const visible = new Map();
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          visible.set(e.target.id, e.intersectionRatio);
        });
        let best = null, bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) { best = id; bestRatio = ratio; }
        });
        navLinks.forEach(a => {
          a.classList.toggle('is-current', a.dataset.section === best);
        });
      }, {
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      });
      sections.forEach(s => io.observe(s));
    }

    /* ----- Menu tabs ----- */
    const tabs = document.querySelectorAll('.menu-tab');
    const panels = document.querySelectorAll('.menu-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const target = tab.dataset.target;
        tabs.forEach(t => t.classList.toggle('is-active', t === tab));
        panels.forEach(p => p.classList.toggle('is-active', p.id === target));
      });
    });

  });
})();
