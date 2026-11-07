<script lang="ts">
  import { onMount } from "svelte";
  import type { YearSummary } from "$lib/types";
  import { yearSectionId } from "$lib/utils";

  interface Props {
    years: YearSummary[];
  }

  let { years }: Props = $props();

  const READ_LINE = 128;
  const FOOTER_GAP = 24;

  const numberedYears = $derived(
    years.filter(({ year }) => /^\d{4}$/.test(year)),
  );
  const firstYear = $derived(years[0]?.year ?? "");
  let activeYear = $state<string>();
  let currentYear = $derived(activeYear ?? firstYear);
  let markerOffset = $state(0);
  let markerHeight = $state(0);
  let lift = $state(0);
  let listElement = $state<HTMLUListElement>();

  onMount(() => {
    const yearAnchors = years
      .map(({ year }) => document.getElementById(yearSectionId(year)))
      .filter((anchor): anchor is HTMLElement => anchor !== null);
    const footer = document.querySelector<HTMLElement>("footer");
    const footerPanel = footer?.firstElementChild as HTMLElement | null;

    if (yearAnchors.length === 0 || !listElement) return;

    const links = Array.from(
      listElement.querySelectorAll<HTMLAnchorElement>("a[data-year]"),
    );
    let frame: number | undefined;
    let currentIndex = 0;
    let hashLockUntil = 0;

    const activate = (index: number) => {
      activeYear = years[index]?.year ?? "";

      const activeLink = links[index];
      if (!activeLink) return;

      markerOffset = activeLink.offsetTop;
      markerHeight = activeLink.offsetHeight;
    };

    const updateFooterLift = () => {
      const number = document.querySelector<HTMLElement>(
        ".year-watermark__number",
      );
      if (!number || !footer) return;

      const fontSize = Number.parseFloat(getComputedStyle(number).fontSize);
      const baseBottom = window.innerHeight + fontSize * 0.16;
      const footerTop = (footerPanel ?? footer).getBoundingClientRect().top;
      const nextLift = Math.max(0, baseBottom - footerTop + FOOTER_GAP);

      if (Math.abs(lift - nextLift) > 0.5) lift = nextLift;
    };

    const updateActiveYear = () => {
      frame = undefined;
      updateFooterLift();

      let nextIndex = 0;

      for (let index = 0; index < yearAnchors.length; index += 1) {
        if (yearAnchors[index].getBoundingClientRect().top <= READ_LINE) {
          nextIndex = index;
        } else {
          break;
        }
      }

      if (
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2
      ) {
        nextIndex = yearAnchors.length - 1;
      }

      if (performance.now() < hashLockUntil) {
        nextIndex = currentIndex;
      } else {
        currentIndex = nextIndex;
      }

      activate(nextIndex);
    };

    const scheduleUpdate = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(updateActiveYear);
    };

    const syncToHash = () => {
      const id = window.location.hash.slice(1);
      const index = years.findIndex(({ year }) => yearSectionId(year) === id);
      if (index === -1) return;

      currentIndex = index;
      activate(index);
      updateFooterLift();
      hashLockUntil = performance.now() + 400;
    };

    const releaseHashLock = () => {
      hashLockUntil = 0;
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", syncToHash);
    window.addEventListener("wheel", releaseHashLock, { passive: true });
    window.addEventListener("touchstart", releaseHashLock, { passive: true });
    window.addEventListener("keydown", releaseHashLock);

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    const archive = document.getElementById("blog-archive");
    if (archive) resizeObserver.observe(archive);

    syncToHash();
    updateActiveYear();

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", syncToHash);
      window.removeEventListener("wheel", releaseHashLock);
      window.removeEventListener("touchstart", releaseHashLock);
      window.removeEventListener("keydown", releaseHashLock);
    };
  });
</script>

<div
  class="year-watermark"
  aria-hidden="true"
  style={`--year-lift: ${-lift}px`}
>
  {#each numberedYears as item (item.year)}
    <span class="year-watermark__number" data-active={currentYear === item.year}>
      {item.year}
    </span>
  {/each}
</div>

{#if years.length > 1}
  <aside
    class="absolute start-full top-0 hidden h-full w-[calc(50vw-25rem)] ps-6 pe-4 xl:block"
  >
    <div
      class="sticky top-8 max-h-[calc(100dvh-4rem)] w-full max-w-80 overflow-y-auto overscroll-contain pb-8"
    >
      <nav aria-label="Archive years">
        <p class="m-0 text-base font-medium text-foreground">Archive</p>
        <div class="relative">
          <ul
            bind:this={listElement}
            class="m-0 mt-3 flex list-none flex-col border-s border-border p-0"
          >
            {#each years as item (item.year)}
              <li>
                <a
                  href={`#${yearSectionId(item.year)}`}
                  data-year={item.year}
                  data-active={currentYear === item.year}
                  aria-current={currentYear === item.year
                    ? "location"
                    : undefined}
                  aria-label={`${item.year}, ${item.count} ${item.count === 1 ? "post" : "posts"}`}
                  class="flex items-baseline justify-between gap-4 py-1.5 pe-1 ps-4 text-muted-foreground no-underline transition-colors hover:text-foreground data-[active=true]:text-foreground"
                >
                  <span
                    class="font-sans text-lg font-medium leading-6 tracking-[-0.01em]"
                  >
                    {item.year}
                  </span>
                  <span
                    data-active={currentYear === item.year}
                    class="font-mono text-meta leading-none tabular-nums data-[active=true]:text-primary"
                  >
                    {item.count}
                  </span>
                </a>
              </li>
            {/each}
          </ul>
          <span
            aria-hidden="true"
            class="pointer-events-none absolute start-0 top-0 w-px bg-foreground motion-safe:transition-[transform,height] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]"
            style={`transform: translateY(${markerOffset}px); height: ${markerHeight}px;`}
          ></span>
        </div>
      </nav>
    </div>
  </aside>
{/if}

<style>
  .year-watermark {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
  }

  :global(html:not(.js)) .year-watermark {
    display: none;
  }

  .year-watermark__number {
    position: absolute;
    inset-inline-end: -0.04em;
    inset-block-end: -0.16em;
    color: var(--foreground);
    font-family: var(--font-ui);
    font-size: clamp(9rem, 27vw, 27rem);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.055em;
    line-height: 0.72;
    opacity: 0;
    transform: translateY(0.05em);
    translate: 0 var(--year-lift, 0px);
    transition-property: opacity, transform, translate;
    transition-duration: 600ms, 800ms, 450ms;
    transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }

  .year-watermark__number[data-active="true"] {
    opacity: 0.045;
    transform: translateY(0);
  }

  @media print {
    .year-watermark {
      display: none;
    }
  }
</style>
