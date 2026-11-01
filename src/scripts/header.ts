const header = document.querySelector<HTMLElement>("[data-site-header]");
const shell = document.querySelector<HTMLElement>("[data-header-shell]");
const navigation = document.querySelector<HTMLElement>("[data-header-nav]");
const controls = document.querySelector<HTMLElement>("[data-header-controls]");
const background = document.querySelector<HTMLElement>(
  "[data-header-background]",
);

if (header && shell && navigation && controls && background) {
  const headerElement = header;
  const backgroundElement = background;
  const desktop = window.matchMedia("(min-width: 64rem)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const movingParts = [navigation, controls];
  const scrollThreshold = 24;
  let animations: Animation[] = [];
  let scrolled = window.scrollY > scrollThreshold;

  function cancelAnimations() {
    for (const animation of animations) animation.cancel();
    animations = [];
  }

  function trackAnimation(animation: Animation) {
    animations.push(animation);
    animation.addEventListener(
      "finish",
      () => {
        animations = animations.filter((item) => item !== animation);
      },
      { once: true },
    );
  }

  function setScrolled(next: boolean, animate: boolean) {
    const shouldAnimate = animate && desktop.matches && !reducedMotion.matches;
    const previous = shouldAnimate
      ? {
          parts: movingParts.map((element) => ({
            element,
            rect: element.getBoundingClientRect(),
          })),
          background: backgroundElement.getBoundingClientRect(),
          opacity: Number(getComputedStyle(backgroundElement).opacity),
          radius: getComputedStyle(backgroundElement).borderRadius,
        }
      : null;

    cancelAnimations();
    headerElement.toggleAttribute("data-scrolled", next);

    if (!previous) return;

    const timing: KeyframeAnimationOptions = {
      duration: 420,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    };

    for (const { element, rect } of previous.parts) {
      const nextRect = element.getBoundingClientRect();
      const x = rect.left - nextRect.left;
      const y = rect.top - nextRect.top;
      if (x === 0 && y === 0) continue;

      trackAnimation(
        element.animate(
          [
            { transform: `translate(${x}px, ${y}px)` },
            { transform: "translate(0, 0)" },
          ],
          timing,
        ),
      );
    }

    const nextBackground = backgroundElement.getBoundingClientRect();
    const nextStyle = getComputedStyle(backgroundElement);
    const scaleX = previous.background.width / nextBackground.width;
    const scaleY = previous.background.height / nextBackground.height;
    const x = previous.background.left - nextBackground.left;
    const y = previous.background.top - nextBackground.top;

    trackAnimation(
      backgroundElement.animate(
        [
          {
            borderRadius: previous.radius,
            opacity: previous.opacity,
            transform: `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`,
            transformOrigin: "left top",
          },
          {
            borderRadius: nextStyle.borderRadius,
            opacity: Number(nextStyle.opacity),
            transform: "translate(0, 0) scale(1, 1)",
            transformOrigin: "left top",
          },
        ],
        timing,
      ),
    );
  }

  function syncScrollState(animate: boolean) {
    const next = window.scrollY > scrollThreshold;
    if (next === scrolled) return;
    scrolled = next;
    setScrolled(next, animate);
  }

  headerElement.toggleAttribute("data-scrolled", scrolled);
  window.addEventListener("scroll", () => syncScrollState(true), {
    passive: true,
  });
  desktop.addEventListener("change", cancelAnimations);
  reducedMotion.addEventListener("change", cancelAnimations);
}
