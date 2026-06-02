/* Honky Tonk Troy — Patch slideshow
   ------------------------------------------------------------
   Each of the four hero patches (in the leather patch grid)
   independently cycles through its own deck of photos with a
   soft crossfade. Slots are staggered so the grid never flips
   in sync — feels organic, not mechanical.
*/

(function () {
  'use strict';

  // Per-slot photo decks. Each patch slot has its own queue of
  // photos + captions. Different decks, different lengths so the
  // grid never settles into a predictable pattern.
  const DECKS = {
    'pp-main': [
      { src: '../images/crowd-stage.jpg',          cap: 'live music' },
      { src: '../images/packed-night.jpg',         cap: 'packed in' },
      { src: '../images/bar-crowd-mural.jpg',      cap: 'under the outlaws' },
      { src: '../images/cowboy-bar.jpg',           cap: 'last call' },
      { src: '../images/guitarist.jpg',            cap: 'the band' },
      { src: '../images/drummer-mural.jpg',        cap: 'drums &amp; outlaws' },
      { src: '../images/interior-flag-mural.jpg',  cap: 'before doors open' },
      { src: '../images/interior-bar.jpg',         cap: 'the long bar' },
      { src: '../images/staff-eagle.jpg',          cap: 'the team' },
      { src: '../images/staff-group-outdoor.jpg',  cap: 'the troy team' },
      { src: '../images/staff-star.jpg',           cap: 'god bless' },
      { src: '../images/staff-patio-couch.jpg',    cap: 'red couch, late' },
      { src: '../images/patio-happy-hour.jpg',     cap: 'happy hour' },
      { src: '../images/patio-friends.jpg',        cap: 'porch, golden' },
      { src: '../images/staff-drinks.jpg',         cap: 'round of drinks' },
    ]
  };

  const CYCLE_MS = 5500;
  const STAGGER_MS = 1100;     // four slots — tighter stagger
  const FADE_MS = 900;
  const CAP_FADE_MS = 450;
  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function preload(src) {
    const img = new Image();
    img.src = src;
  }

  function initSlot(slot) {
    const slotId = Array.from(slot.classList).find(c => DECKS[c]);
    if (!slotId) return;
    const deck = DECKS[slotId];
    if (!deck || !deck.length) return;

    const frame = slot.querySelector('.frame');
    const capEl = slot.querySelector('.pname');
    if (!frame) return;

    // Preload everything in this deck.
    deck.forEach(p => preload(p.src));

    // Replace the initial static <img> with two stacked layers.
    const initial = frame.querySelector('img');
    const initialSrc = initial ? initial.getAttribute('src') : deck[0].src;
    const initialAlt = initial ? (initial.getAttribute('alt') || '') : '';
    if (initial) initial.remove();

    const a = document.createElement('img');
    a.className = 'pp-img is-active';
    a.src = initialSrc;
    a.alt = initialAlt;
    a.loading = 'eager';
    a.decoding = 'async';

    const b = document.createElement('img');
    b.className = 'pp-img';
    b.src = deck[1 % deck.length].src;
    b.alt = initialAlt;
    b.loading = 'eager';
    b.decoding = 'async';

    frame.appendChild(a);
    frame.appendChild(b);

    // Start at the initial deck index.
    let idx = Math.max(0, deck.findIndex(p => p.src.endsWith(initialSrc.split('/').pop())));
    let activeLayer = a;
    let waitingLayer = b;

    if (PREFERS_REDUCED) return;

    function advance() {
      idx = (idx + 1) % deck.length;
      const next = deck[idx];
      const lookahead = deck[(idx + 1) % deck.length];
      preload(lookahead.src);

      const swap = () => {
        waitingLayer.classList.add('is-active');
        activeLayer.classList.remove('is-active');

        if (capEl) {
          capEl.style.opacity = '0';
          window.setTimeout(() => {
            capEl.innerHTML = next.cap;
            capEl.style.opacity = '1';
          }, CAP_FADE_MS);
        }

        window.setTimeout(() => {
          const tmp = activeLayer;
          activeLayer = waitingLayer;
          waitingLayer = tmp;
          waitingLayer.src = lookahead.src;
        }, FADE_MS + 60);
      };

      const expectedFile = next.src.split('/').pop();
      if (!waitingLayer.src.endsWith(expectedFile)) waitingLayer.src = next.src;

      if (waitingLayer.complete && waitingLayer.naturalWidth > 0) {
        swap();
      } else {
        const onLoad = () => { waitingLayer.removeEventListener('load', onLoad); swap(); };
        waitingLayer.addEventListener('load', onLoad);
        window.setTimeout(() => { waitingLayer.removeEventListener('load', onLoad); swap(); }, 1000);
      }
    }

    return advance;
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    const slots = document.querySelectorAll('.leatherpatch .patchphoto');
    const advancers = [];
    slots.forEach(slot => {
      const advance = initSlot(slot);
      if (advance) advancers.push(advance);
    });

    if (PREFERS_REDUCED || !advancers.length) return;

    advancers.forEach((advance, i) => {
      window.setTimeout(function tick() {
        advance();
        window.setTimeout(tick, CYCLE_MS);
      }, CYCLE_MS + i * STAGGER_MS);
    });
  });
})();
