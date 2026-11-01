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
  let listElement: HTMLUListElement;

  type MathJaxApi = {
    typesetPromise?: (elements: HTMLElement[]) => Promise<void>;
  };

  onMount(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.slug))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    let active = true;
    let mathJaxTimer: number | undefined;
    let attempts = 0;

    const typesetTocMath = () => {
      if (!active) return;

      const mathJax = (window as Window & { MathJax?: MathJaxApi }).MathJax;
      if (mathJax?.typesetPromise) {
        void mathJax.typesetPromise([listElement]).catch(() => {});
        return;
      }

      attempts += 1;
      if (attempts < 100) {
        mathJaxTimer = window.setTimeout(typesetTocMath, 50);
      }
    };

    typesetTocMath();

    const links = Array.from(
      listElement.querySelectorAll<HTMLAnchorElement>("a"),
    );
    let frame: number | undefined;

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
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(listElement);
    if (prose) resizeObserver.observe(prose);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    scheduleUpdate();

    return () => {
      active = false;
      if (mathJaxTimer !== undefined) clearTimeout(mathJaxTimer);
      if (frame !== undefined) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  });
</script>

<nav aria-label="Table of Contents">
  <a
    href="#page-top"
    class="block w-fit text-sm font-medium text-foreground no-underline"
  >
    Table of Contents
  </a>
  <div class="relative">
    <ul
      bind:this={listElement}
      class="m-0 mt-3 flex list-none flex-col border-s border-border p-0"
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
