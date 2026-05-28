(function () {
  var splash = document.querySelector('.video-landing');
  var video = document.querySelector('.video-landing-media');
  var enter = document.querySelector('.video-enter');
  var target = document.querySelector('#content-start');

  if (!splash || !video || !enter || !target) return;

  function holdFinalFrame() {
    video.pause();
  }

  var entered = false;
  function enterSite() {
    if (entered) return;
    entered = true;
    document.body.classList.remove('splash-active');
    document.body.classList.add('splash-entered');
    window.scrollTo({ top: 0, behavior: 'auto' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKey);
  }

  function onWheel(e) {
    if (e.deltaY > 0) enterSite();
  }

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      enterSite();
    }
  }

  video.addEventListener('ended', holdFinalFrame);
  video.addEventListener('error', holdFinalFrame);
  enter.addEventListener('click', enterSite);
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('keydown', onKey);

  var playAttempt = video.play();
  if (playAttempt && typeof playAttempt.catch === 'function') {
    playAttempt.catch(function () {
      holdFinalFrame();
    });
  }
})();
