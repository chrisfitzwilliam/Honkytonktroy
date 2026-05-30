(function () {
  var splash = document.querySelector('.video-landing');
  var video = document.querySelector('.video-landing-media');
  var enter = document.querySelector('.video-enter');
  var destination = 'honky-tonk-troy/';

  if (!splash || !video || !enter) return;

  function holdFinalFrame() {
    video.pause();
  }

  var entered = false;
  function enterSite() {
    if (entered) return;
    entered = true;
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKey);
    window.location.href = destination;
  }

  // bfcache: Android Chrome restores the page from memory on back navigation,
  // preserving the entered=true flag and breaking the button on second visit.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) entered = false;
  });

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
