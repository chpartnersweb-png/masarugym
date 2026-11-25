const gallery = document.querySelector<HTMLElement>('.photo-story');

if (gallery) {
  const viewport = gallery.querySelector<HTMLElement>('.story-viewport');
  const track = gallery.querySelector<HTMLElement>('.story-track');
  const controls = gallery.querySelector<HTMLElement>('.story-controls');
  const dots = [...gallery.querySelectorAll<HTMLButtonElement>('.story-dot')];

  if (viewport && track && controls && dots.length > 1) {
    setupGallery(gallery, viewport, track, controls, dots);
  }
}

function setupGallery(
  gallery: HTMLElement,
  viewport: HTMLElement,
  track: HTMLElement,
  controls: HTMLElement,
  dots: HTMLButtonElement[],
) {
  const cards = [...track.querySelectorAll<HTMLElement>('.story-card')];
  const count = cards.length;
  const desktop = window.matchMedia('(width > 1060px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let offsets: number[] = [];
  let current = 0;
  let advanceTimer = 0;
  let settleTimer = 0;
  let visible = false;
  let hovered = false;
  let touching = false;

  // The repeated cards let the centered photo and its neighbors stay visible at each wrap.
  const copyCards = () => cards.map(card => {
    const copy = card.cloneNode(true) as HTMLElement;
    copy.setAttribute('aria-hidden', 'true');
    return copy;
  });
  const leadingCards = copyCards();
  const trailingCards = copyCards();
  const slides = [...leadingCards, ...cards, ...trailingCards];
  track.prepend(...leadingCards);
  track.append(...trailingCards);
  viewport.dataset.carousel = '';
  controls.hidden = false;

  const updateCurrent = () => {
    slides.forEach((slide, index) => slide.toggleAttribute('data-current', index % count === current));
    dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === current)));
  };

  const updateDesktopScale = () => {
    if (!desktop.matches || reducedMotion.matches || offsets.length < 2) return;

    const scrollLeft = viewport.scrollLeft;
    const step = offsets[1] - offsets[0];
    slides.forEach((card, index) => {
      const distance = Math.min(Math.abs(offsets[index] - scrollLeft) / step, 1);
      card.style.setProperty('--story-desktop-scale', String(1.04 - distance * 0.1));
    });
  };

  const measure = () => {
    const viewportLeft = viewport.getBoundingClientRect().left;
    const viewportWidth = viewport.clientWidth;
    const scrollLeft = viewport.scrollLeft;
    offsets = slides.map(card => {
      const { left, width } = card.getBoundingClientRect();
      return scrollLeft + left - viewportLeft + (width - viewportWidth) / 2;
    });
    viewport.scrollTo({ left: offsets[count + current], behavior: 'auto' });
    updateDesktopScale();
  };

  const nearestSlide = () => {
    const scrollLeft = viewport.scrollLeft;
    let nearest = 0;
    for (let index = 1; index < offsets.length; index++) {
      if (Math.abs(offsets[index] - scrollLeft) < Math.abs(offsets[nearest] - scrollLeft)) {
        nearest = index;
      }
    }
    return nearest;
  };

  const restartAutoplay = () => {
    window.clearTimeout(advanceTimer);
    if (reducedMotion.matches || !visible || document.hidden || (hovered && !desktop.matches) || touching || gallery.querySelector(':focus-visible')) return;

    advanceTimer = window.setTimeout(() => moveBy(1), 4500);
  };

  const moveBy = (step: number) => {
    let from = nearestSlide();
    if (from + step < 1 || from + step >= slides.length - 1) {
      from = count + (from % count);
      viewport.scrollTo({ left: offsets[from], behavior: 'auto' });
      updateDesktopScale();
    }
    viewport.scrollTo({ left: offsets[from + step], behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    restartAutoplay();
  };

  const selectPhoto = (index: number) => {
    const forward = (index - (nearestSlide() % count) + count) % count;
    moveBy(forward <= count / 2 ? forward : forward - count);
  };

  const finishScroll = () => {
    if (touching) return;
    const slide = nearestSlide();
    if (slide < count || slide >= count * 2) {
      // Jump to the same composition in the original group once a copy is centered.
      viewport.scrollTo({ left: offsets[count + (slide % count)], behavior: 'auto' });
      updateDesktopScale();
    }
    restartAutoplay();
  };

  const waitForScroll = () => {
    window.clearTimeout(advanceTimer);
    window.clearTimeout(settleTimer);
    updateDesktopScale();
    const index = nearestSlide() % count;
    if (index !== current) {
      current = index;
      updateCurrent();
    }
    settleTimer = window.setTimeout(finishScroll, 150);
  };

  controls.querySelectorAll<HTMLButtonElement>('.story-arrow').forEach(button => {
    button.addEventListener('click', () => moveBy(Number(button.dataset.step)));
  });
  dots.forEach((dot, index) => dot.addEventListener('click', () => selectPhoto(index)));
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveBy(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      selectPhoto(event.key === 'Home' ? 0 : count - 1);
    }
  });
  viewport.addEventListener('scroll', waitForScroll, { passive: true });
  viewport.addEventListener('touchstart', () => {
    touching = true;
    window.clearTimeout(advanceTimer);
  }, { passive: true });
  const endTouch = (event: TouchEvent) => {
    if (event.touches.length > 0) return;
    touching = false;
    waitForScroll();
  };
  viewport.addEventListener('touchend', endTouch, { passive: true });
  viewport.addEventListener('touchcancel', endTouch, { passive: true });
  viewport.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = true;
    if (!desktop.matches) restartAutoplay();
  });
  viewport.addEventListener('pointerleave', () => {
    hovered = false;
    if (!desktop.matches) restartAutoplay();
  });
  gallery.addEventListener('focusin', restartAutoplay);
  gallery.addEventListener('focusout', () => queueMicrotask(restartAutoplay));
  document.addEventListener('visibilitychange', restartAutoplay);

  reducedMotion.addEventListener('change', () => {
    updateDesktopScale();
    restartAutoplay();
  });
  desktop.addEventListener('change', restartAutoplay);

  updateCurrent();
  measure();
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(viewport);
  resizeObserver.observe(cards[0]);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.intersectionRatio >= 0.25;
    restartAutoplay();
  }, { threshold: 0.25 });
  visibilityObserver.observe(viewport);
}
