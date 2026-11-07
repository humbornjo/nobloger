<script lang="ts">
  import { onMount } from "svelte";

  interface Heading {
    depth: number;
    slug: string;
    text: string;
  }

  interface Props {
    headings: Heading[];
  }

  let { headings }: Props = $props();
  let activeSlug = $state("");
  let progress = $state(0);
  let listElement = $state<HTMLUListElement>();
  let scrollElement = $state<HTMLDivElement>();

  type MathJaxApi = {
    typesetPromise?: (elements: HTMLElement[]) => Promise<void>;
  };

  onMount(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.slug))
      .filter((element): element is HTMLElement => element !== null);

    const list = listElement;
    const scroller = scrollElement;

    if (elements.length === 0 || !list || !scroller) return;

    let active = true;
    let mathJaxTimer: number | undefined;
    let attempts = 0;

    const typesetTocMath = () => {
      if (!active) return;

      const mathJax = (window as Window & { MathJax?: MathJaxApi }).MathJax;
      if (mathJax?.typesetPromise) {
        void mathJax.typesetPromise([list]).catch(() => {});
        return;
      }

      attempts += 1;
      if (attempts < 100) {
        mathJaxTimer = window.setTimeout(typesetTocMath, 50);
      }
    };

    typesetTocMath();

    const links = Array.from(
      list.querySelectorAll<HTMLAnchorElement>("a"),
    );
    let frame: number | undefined;

    const updateFade = () => {
      const canScroll = scroller.scrollHeight > scroller.clientHeight + 1;
      scroller.dataset.overflowTop = String(
        canScroll && scroller.scrollTop > 1,
      );
      scroller.dataset.overflowBottom = String(
        canScroll &&
          scroller.scrollTop + scroller.clientHeight <
            scroller.scrollHeight - 1,
      );
    };

    const updateActiveHeading = () => {
      frame = undefined;
      let nextSlug = "";

      if (
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2
      ) {
        nextSlug = elements[elements.length - 1].id;
      } else {
        for (const element of elements) {
          if (element.getBoundingClientRect().top > 96) break;
          nextSlug = element.id;
        }
      }

      activeSlug = nextSlug;
      const activeLink = links.find(
        (link) => link.getAttribute("href") === `#${nextSlug}`,
      );
      progress = activeLink
        ? activeLink.offsetTop + activeLink.offsetHeight
        : 0;
    };

    const scheduleUpdate = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(updateActiveHeading);
    };

    const prose = document.querySelector<HTMLElement>(".prose");
    const resizeObserver = new ResizeObserver(() => {
      updateFade();
      scheduleUpdate();
    });
    resizeObserver.observe(list);
    resizeObserver.observe(scroller);
    if (prose) resizeObserver.observe(prose);

    scroller.addEventListener("scroll", updateFade, { passive: true });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    updateFade();
    scheduleUpdate();

    return () => {
      active = false;
      if (mathJaxTimer !== undefined) clearTimeout(mathJaxTimer);
      if (frame !== undefined) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", updateFade);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  });
</script>

<nav
  aria-label="Table of Contents"
  class="flex min-h-0 flex-col"
>
  <a
    href="#page-top"
    class="block w-fit shrink-0 text-base font-medium text-foreground no-underline"
  >
    Table of Contents
  </a>
  <div
    bind:this={scrollElement}
    class="toc-scroll relative mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain"
  >
    <ul
      bind:this={listElement}
      class="m-0 flex list-none flex-col border-s border-border p-0"
    >
      {#each headings as heading (heading.slug)}
        <li>
          <a
            href={`#${heading.slug}`}
            title={heading.text}
            class="line-clamp-2 py-1 ps-4 text-sm leading-6 text-muted-foreground no-underline transition-colors hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground data-[depth=2]:ps-8 data-[depth=3]:ps-10 data-[depth=4]:ps-12"
            data-active={activeSlug === heading.slug}
            data-depth={heading.depth}
            aria-current={activeSlug === heading.slug ? "location" : undefined}
          >
            {heading.text}
          </a>
        </li>
      {/each}
    </ul>
    <span
      aria-hidden="true"
      class="pointer-events-none absolute start-0 top-0 w-px bg-foreground motion-safe:transition-[height] motion-safe:duration-300 motion-safe:ease-out"
      style={`height: ${progress}px;`}
    ></span>
  </div>
</nav>
