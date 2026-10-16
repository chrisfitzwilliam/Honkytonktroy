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
    const sections = [
      ...sectionIds.map(id => document.getElementById(id)),
      ...document.querySelectorAll('[data-nav-section]')
    ].filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      const visible = new Map();
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          visible.set(e.target.id, {
            ratio: e.intersectionRatio,
            section: e.target.dataset.navSection || e.target.id
          });
        });
        let best = null, bestRatio = 0;
        visible.forEach(({ ratio, section }) => {
          if (ratio > bestRatio) { best = section; bestRatio = ratio; }
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
    const tabs = Array.from(document.querySelectorAll('.menu-tab'));
    const panels = document.querySelectorAll('.menu-panel');

    function selectMenuTab(tab) {
      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
        t.tabIndex = active ? 0 : -1;
      });
      panels.forEach(p => p.classList.toggle('is-active', p.id === tab.dataset.target));
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        selectMenuTab(tab);
      });
      tab.addEventListener('keydown', function (event) {
        let index = tabs.indexOf(tab);
        if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') index = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = tabs.length - 1;
        else return;

        event.preventDefault();
        selectMenuTab(tabs[index]);
        tabs[index].focus();
      });
    });

  });
})();
