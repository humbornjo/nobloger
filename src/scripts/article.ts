import { createCustomScrollbar } from "./custom-scrollbar";

const prose = document.querySelector<HTMLElement>(".prose");

if (prose) {
  const labels = new WeakMap<HTMLElement, string>();
  const observed = new WeakSet<HTMLElement>();
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const region = entry.target as HTMLElement;
      const overflows = region.scrollWidth > region.clientWidth + 1;

      if (overflows) {
        region.tabIndex = 0;
        region.setAttribute(
          "aria-label",
          labels.get(region) ?? "Scrollable content",
        );
        region.dataset.scrollable = "true";
      } else if (region.dataset.scrollable) {
        region.removeAttribute("tabindex");
        region.removeAttribute("aria-label");
        delete region.dataset.scrollable;
      }
    }
  });

  const enhancedDisclosures = new WeakSet<HTMLDetailsElement>();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function enhanceDisclosures() {
    if (!prose) return;

    for (const details of prose.querySelectorAll<HTMLDetailsElement>(
      "details",
    )) {
      if (enhancedDisclosures.has(details)) continue;

      const summary = details.querySelector<HTMLElement>(":scope > summary");
      if (!summary) continue;

      const content = document.createElement("div");
      content.className = "details__content";
      const inner = document.createElement("div");
      inner.className = "details__inner";

      let node = summary.nextSibling;
      while (node) {
        const next = node.nextSibling;
        inner.append(node);
        node = next;
      }
      content.append(inner);
      details.append(content);

      let animation: Animation | undefined;
      let targetOpen = details.open;

      summary.addEventListener("click", (event) => {
        if (event.button !== 0 || reducedMotion.matches) return;
        event.preventDefault();

        const nextOpen = animation ? !targetOpen : !details.open;
        const currentProgress = details.open
          ? Number(getComputedStyle(content).opacity)
          : 0;

        animation?.cancel();
        targetOpen = nextOpen;
        if (nextOpen) details.open = true;

        const nextAnimation = content.animate(
          [
            {
              gridTemplateRows: `${currentProgress}fr`,
              opacity: currentProgress,
            },
            {
              gridTemplateRows: nextOpen ? "1fr" : "0fr",
              opacity: nextOpen ? "1" : "0",
            },
          ],
          {
            duration: 360,
            easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          },
        );
        animation = nextAnimation;
        nextAnimation.addEventListener(
          "finish",
          () => {
            if (animation !== nextAnimation) return;
            details.open = targetOpen;
            nextAnimation.cancel();
            animation = undefined;
          },
          { once: true },
        );
      });

      reducedMotion.addEventListener("change", () => {
        if (!reducedMotion.matches || !animation) return;
        animation.cancel();
        animation = undefined;
        details.open = targetOpen;
      });

      enhancedDisclosures.add(details);
    }
  }

  const enhancedCodeBlocks = new WeakSet<HTMLPreElement>();

  function enhanceCodeBlocks() {
    if (!prose) return;

    for (const pre of prose.querySelectorAll<HTMLPreElement>("pre")) {
      if (enhancedCodeBlocks.has(pre)) continue;

      const code = pre.querySelector("code");
      if (!code) continue;

      const wrapper = document.createElement("div");
      wrapper.className = "code-block";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "code-block__copy";
      button.title = "Copy code";
      button.setAttribute("aria-label", "Copy code");
      button.innerHTML = `
        <span class="code-block__icon code-block__icon--copy" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </span>
        <span class="sr-only" aria-live="polite"></span>
      `;
      const status = button.querySelector<HTMLElement>("[aria-live]");
      const icon = button.querySelector<HTMLElement>(".code-block__icon--copy");
      let resetTimer: ReturnType<typeof setTimeout> | undefined;

      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.textContent ?? "");
        } catch {
          return;
        }

        clearTimeout(resetTimer);
        if (status) status.textContent = "Copied";

        if (!reducedMotion.matches) {
          icon?.animate(
            [
              { transform: "scale(1)" },
              { transform: "scale(1.15)" },
              { transform: "scale(1)" },
            ],
            { duration: 260, easing: "cubic-bezier(0.2, 0, 0, 1)" },
          );
        }

        resetTimer = setTimeout(() => {
          if (status) status.textContent = "";
        }, 1500);
      });

      wrapper.addEventListener("pointerleave", () => {
        if (!button.matches(":focus-visible")) button.blur();
      });

      const scrollbar = document.createElement("div");
      scrollbar.className = "code-scrollbar";
      scrollbar.setAttribute("aria-hidden", "true");
      const scrollbarThumb = document.createElement("div");
      scrollbarThumb.className = "code-scrollbar__thumb";
      scrollbar.append(scrollbarThumb);

      pre.before(wrapper);
      wrapper.append(pre, button, scrollbar);

      const { update: updateScrollbar } = createCustomScrollbar({
        axis: "x",
        track: scrollbar,
        thumb: scrollbarThumb,
        getMetrics: () => ({
          viewportSize: pre.clientWidth,
          contentSize: pre.scrollWidth,
          position: pre.scrollLeft,
        }),
        scrollTo: (position) => {
          pre.scrollLeft = position;
        },
      });
      wrapper.dataset.scrollbar = "custom";

      pre.addEventListener("scroll", updateScrollbar, { passive: true });
      const scrollbarObserver = new ResizeObserver(updateScrollbar);
      scrollbarObserver.observe(pre);
      requestAnimationFrame(updateScrollbar);

      enhancedCodeBlocks.add(pre);
    }
  }

  const enhancedImages = new WeakSet<HTMLImageElement>();

  function enhanceImages() {
    if (!prose) return;

    for (const image of prose.querySelectorAll<HTMLImageElement>("img")) {
      if (enhancedImages.has(image)) continue;

      image.classList.add("prose-image");
      image.addEventListener(
        "load",
        () => {
          image.classList.add("is-loaded");
        },
        { once: true },
      );
      image.addEventListener(
        "error",
        () => {
          image.classList.add("is-failed");
          image.setAttribute("aria-label", "Image failed to load");
        },
        { once: true },
      );
      if (image.complete) {
        image.classList.add(image.naturalWidth > 0 ? "is-loaded" : "is-failed");
      }

      enhancedImages.add(image);
    }
  }

  function observeRegions() {
    if (!prose) return;

    const regions = prose.querySelectorAll<HTMLElement>(
      'pre, table, mjx-container[jax="SVG"]',
    );

    for (const region of regions) {
      if (observed.has(region)) continue;

      const label =
        region.tagName === "PRE"
          ? "Scrollable code block"
          : region.tagName === "TABLE"
            ? "Scrollable table"
            : "Scrollable mathematical notation";
      labels.set(region, label);
      observed.add(region);
      observer.observe(region);
    }
  }

  function enhanceContent() {
    enhanceDisclosures();
    enhanceCodeBlocks();
    enhanceImages();
    observeRegions();
  }

  const mutations = new MutationObserver(enhanceContent);
  enhanceContent();
  mutations.observe(prose, { childList: true, subtree: true });
}
