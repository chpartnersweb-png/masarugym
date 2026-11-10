import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

// matchMedia reverts transforms and destroys smooth scrolling if the OS setting changes.
const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  const events = new AbortController();
  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.085,
    smoothWheel: true,
    syncTouch: false,
    anchors: { offset: -28, duration: 1.1 },
    prevent: node => !!node.closest('#mobile-nav, .maps, .photo-story:not(.is-pinned) .story-viewport'),
  });
  const tick = (seconds: number) => lenis.raf(seconds * 1000);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const onMenu = (event: Event) => {
    if ((event as CustomEvent<boolean>).detail) lenis.stop();
    else lenis.start();
  };
  document.addEventListener('gym:menu', onMenu, { signal: events.signal });
  if (document.body.classList.contains('menu-open')) lenis.stop();

  const hero = document.querySelector<HTMLElement>('.hero');
  if (hero && window.scrollY < hero.offsetHeight) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.7 }, 0.05)
      .from('.hero-title-line > span', { yPercent: 110, rotate: 3, duration: 1.15, stagger: 0.13 }, 0.12)
      .from('.hero-japanese, .hero-caption, .hero-content .button', { y: 22, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.65)
      .from('.hero-scroll', { y: -12, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' }, 1.1);
  }
  if (hero) {
    gsap.to('.hero-image', {
      yPercent: 9, scale: 1.2, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-content', {
      y: 75, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 25%', scrub: true },
    });
  }

  gsap.utils.toArray<HTMLElement>('.section-index, .about-heading, .about-copy, .training-copy > h2, .training-copy > p, .course-heading, .course-intro, .schedule, .initial-fees, .monthly-fees, .join-heading, .join-checklists, .access-heading, .access-info, .maps, .contact-grid > div, .story-heading').forEach(element => {
    gsap.from(element, { y: 34, opacity: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
  });
  ['.steps', '.facility-list', '.goal-list'].forEach(selector => {
    const group = document.querySelector(selector);
    if (!group) return;
    gsap.from(group.children, { y: 28, opacity: 0, duration: 0.75, stagger: 0.13, ease: 'power3.out', scrollTrigger: { trigger: group, start: 'top 90%', once: true } });
  });

  gsap.utils.toArray<HTMLElement>('.training-photo, .join-visual').forEach(frame => {
    const image = frame.querySelector('img');
    if (!image) return;
    gsap.fromTo(image, { yPercent: -5, scale: 1.14 }, { yPercent: 5, scale: 1.14, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.7 } });
  });
  gsap.to('.identity-strip i', { rotate: 180, ease: 'none', scrollTrigger: { trigger: '.identity-strip', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  gsap.from('.instagram-handle', { x: 45, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.instagram-banner', start: 'top 85%', once: true } });
  gsap.from('.big-english', { x: -35, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1 } });

  const galleryMedia = gsap.matchMedia();
  galleryMedia.add('(min-width: 1061px) and (min-height: 740px)', () => {
    const section = document.querySelector<HTMLElement>('.photo-story');
    const viewport = section?.querySelector<HTMLElement>('.story-viewport');
    const track = section?.querySelector<HTMLElement>('.story-track');
    const progress = section?.querySelector<HTMLElement>('.story-progress > span');
    if (!section || !viewport || !track || !progress) return;
    section.classList.add('is-pinned');
    viewport.scrollLeft = 0;
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    const sequence = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance() + window.innerHeight * 0.4}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1, refreshPriority: 1 },
    });
    sequence.to(track, { x: () => -distance(), ease: 'none' }, 0)
      .fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);

    // Keep the image region usable with the keyboard while its layout is pinned.
    const galleryKeys = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const trigger = sequence.scrollTrigger;
      if (!trigger) return;
      event.preventDefault();
      const total = trigger.end - trigger.start;
      const next = event.key === 'Home' ? trigger.start : event.key === 'End' ? trigger.end : Math.min(trigger.end, Math.max(trigger.start, window.scrollY + (event.key === 'ArrowRight' ? 1 : -1) * total / 2));
      lenis.scrollTo(next, { duration: 0.8 });
    };
    viewport.addEventListener('keydown', galleryKeys);
    return () => { viewport.removeEventListener('keydown', galleryKeys); section.classList.remove('is-pinned'); };
  });

  const refresh = () => { lenis.resize(); ScrollTrigger.refresh(); };
  document.querySelectorAll<HTMLDetailsElement>('details').forEach(details => details.addEventListener('toggle', refresh, { signal: events.signal }));
  document.addEventListener('gym:layout', refresh, { signal: events.signal });
  const refreshAfterLoad = () => { if (!events.signal.aborted) refresh(); };
  if (document.readyState === 'complete') refreshAfterLoad();
  else window.addEventListener('load', refreshAfterLoad, { once: true, signal: events.signal });
  // Font loading can change heading heights and the pinned section's measurements.
  document.fonts.ready.then(refreshAfterLoad);
  document.querySelectorAll<HTMLImageElement>('.story-image img, .join-visual img').forEach(image => {
    if (!image.complete) image.addEventListener('load', refreshAfterLoad, { once: true, signal: events.signal });
  });

  return () => {
    events.abort();
    galleryMedia.revert();
    gsap.ticker.remove(tick);
    lenis.off('scroll', ScrollTrigger.update);
    lenis.destroy();
  };
});

const cleanup = () => motion.revert();
document.addEventListener('astro:before-swap', cleanup, { once: true });
if (import.meta.hot) import.meta.hot.dispose(cleanup);
