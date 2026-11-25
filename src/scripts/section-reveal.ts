const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reducedMotion.matches && 'IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
  const activeAnimations = new Set<Animation>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const target = entry.target;
      observer.unobserve(target);
      if (reducedMotion.matches || target.matches(':focus-within')) continue;

      const animation = target.animate(
        [{ opacity: .32, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 560, easing: 'cubic-bezier(.22,.7,.25,1)' },
      );
      activeAnimations.add(animation);
      const forget = () => activeAnimations.delete(animation);
      animation.finished.then(forget, forget);
    }
  }, { rootMargin: '0px 0px 12px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(target => {
    const { top, bottom } = target.getBoundingClientRect();
    if (top >= window.innerHeight || bottom <= 0) observer.observe(target);
  });

  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    for (const animation of activeAnimations) animation.cancel();
  });
}
