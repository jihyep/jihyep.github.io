const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('.case-toc a, .case-end a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.querySelector(link.hash);
    if (!target) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 24;
    window.scrollTo({
      top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset),
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
    const heading = target.matches('h1, h2') ? target : target.querySelector('h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  });
});

document.querySelectorAll('.media-carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...track.querySelectorAll('.carousel-slide')];
  const position = carousel.querySelector('.carousel-position');
  let slideIndex = 0;

  function showSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    track.scrollTo({
      left: slideIndex * track.clientWidth,
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
  }

  carousel.querySelector('.carousel-prev').addEventListener('click', () => showSlide(slideIndex - 1));
  carousel.querySelector('.carousel-next').addEventListener('click', () => showSlide(slideIndex + 1));
  track.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showSlide(slideIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });
  track.addEventListener('scroll', () => {
    slideIndex = Math.round(track.scrollLeft / track.clientWidth);
    position.textContent = `${slideIndex + 1} / ${slides.length}`;
  }, { passive: true });
  new ResizeObserver(() => {
    track.scrollTo({ left: slideIndex * track.clientWidth, behavior: 'instant' });
  }).observe(track);
});
