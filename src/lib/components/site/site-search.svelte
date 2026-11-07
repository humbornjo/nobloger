<script lang="ts">
  import { onMount, tick } from "svelte";
  import Search from "@icons/lucide/search";
  import { Button } from "$lib/components/ui/button";
  import * as Command from "$lib/components/ui/command";
  import type { PostSummary } from "$lib/types";

  interface PageLink {
    name: "about" | "blog" | "tags";
    url: string;
  }

  interface Props {
    pages: PageLink[];
    posts: PostSummary[];
  }

  const pageLabels = {
    about: "About",
    blog: "Blogs",
    tags: "Search",
  };
  const pageDescriptions = {
    about: "Home and introduction",
    blog: "All posts",
    tags: "Search posts and filter by tag",
  };

  let { pages, posts }: Props = $props();
  let open = $state(false);
  let query = $state("");
  let selectedValue = $state("");
  let words = $derived(query.toLocaleLowerCase().split(/\s+/).filter(Boolean));
  let searching = $derived(words.length > 0);
  let filteredPages = $derived.by(() => {
    if (!searching) return pages;
    return pages.filter((page) => {
      const haystack = `${page.name} ${pageDescriptions[page.name]}`.toLocaleLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  });
  let filteredPosts = $derived.by(() => {
    if (!searching) return posts.slice(0, 5);
    return posts.filter((post) => {
      const haystack = `${post.title} ${post.description ?? ""}`.toLocaleLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  });
  let activeLabel = $derived.by(() => {
    const page = pages.find((item) => selectedValue === `page:${item.url}`);
    if (page) return pageLabels[page.name];
    const post = posts.find((item) => selectedValue === `post:${item.url}`);
    return post?.title ?? "";
  });

  function openSearch() {
    query = "";
    selectedValue = "";
    open = true;
  }

  function handleKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (open) {
        open = false;
      } else {
        openSearch();
      }
    }
  }

  onMount(() => {
    let returningFromSearch = false;

    try {
      returningFromSearch =
        sessionStorage.getItem("search-portal-return") === "1";
      if (returningFromSearch) {
        sessionStorage.removeItem("search-portal-return");
      }
    } catch {}

    const onSearchPage = Boolean(
      document.getElementById("tags-page-search-bar"),
    );
    document.documentElement.removeAttribute("data-search-portal-return");

    if (!returningFromSearch || onSearchPage) return;

    void tick().then(() => {
      const source = [
        document.getElementById("site-search"),
        document.getElementById("site-search-mobile"),
      ].find((element) => element && element.getBoundingClientRect().width > 0);
      if (!source) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      source.style.transformOrigin = "right center";
      const animation = source.animate(
        reducedMotion
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: "scaleX(0)" },
              { opacity: 1, transform: "scaleX(1)" },
            ],
        {
          duration: reducedMotion ? 150 : 350,
          easing: reducedMotion
            ? "ease"
            : "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      );
      void animation.finished.then(
        () => animation.cancel(),
        () => {},
      );
    });
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<Button
  id="site-search"
  variant="ghost"
  size="sm"
  class="command-palette hidden h-7 w-auto justify-start gap-2 rounded-full border-0 bg-[var(--palette-trigger)] px-2 text-[13px] text-muted-foreground hover:bg-[var(--palette-trigger)] hover:text-foreground dark:hover:bg-[var(--palette-trigger)] has-data-[icon=inline-start]:pl-2 md:flex md:pr-1.5 md:has-data-[icon=inline-start]:pl-2.5"
  aria-label="Search pages and posts"
  aria-keyshortcuts="Meta+K Control+K"
  onclick={openSearch}
>
  <Search data-icon="inline-start" strokeWidth={1.5} aria-hidden="true" />
  <span>Search</span>
  <kbd class="rounded-full border-0 bg-background px-1.5 py-px font-mono text-[11px] font-medium leading-normal">⌘K</kbd>
</Button>
<Button
  id="site-search-mobile"
  variant="ghost"
  size="icon-lg"
  class="size-[36px] rounded-full text-muted-foreground hover:bg-transparent md:hidden dark:hover:bg-transparent"
  aria-label="Search pages and posts"
  aria-keyshortcuts="Meta+K Control+K"
  onclick={openSearch}
>
  <Search strokeWidth={1.5} aria-hidden="true" />
</Button>

<Command.Dialog
  bind:open
  bind:value={selectedValue}
  title="Command menu"
  description="Search pages and posts"
  loop
  shouldFilter={false}
>
  <Command.Input
    bind:value={query}
    aria-label="Search pages and posts"
    placeholder="Type a command or search…"
    autocomplete="off"
    spellcheck="false"
    class="px-0 text-base sm:text-sm"
  />
  <Command.List class="flex max-h-[min(25rem,50dvh)] flex-col gap-0 p-1">
    <Command.Empty class="px-3 py-5 text-muted-foreground">
      No results.
    </Command.Empty>
    {#if filteredPages.length > 0}
      <Command.Group heading="Go to">
        {#each filteredPages as page (page.url)}
          <Command.LinkItem
            value={`page:${page.url}`}
            href={page.url}
            onSelect={() => (open = false)}
          >
            <span class="flex min-w-0 flex-1 items-baseline gap-2">
              <span class="shrink-0 truncate py-1 -my-1">{pageLabels[page.name]}</span>
              <span class="min-w-0 truncate py-1 -my-1 text-muted-foreground/70 group-data-selected/command-item:text-muted-foreground">
                {pageDescriptions[page.name]}
              </span>
            </span>
          </Command.LinkItem>
        {/each}
      </Command.Group>
    {/if}
    {#if filteredPosts.length > 0}
      <Command.Group heading={searching ? "Posts" : "Recent posts"}>
        {#each filteredPosts as post (post.url)}
          <Command.LinkItem
            value={`post:${post.url}`}
            href={post.url}
            onSelect={() => (open = false)}
          >
            <span class="flex min-w-0 flex-1 items-baseline gap-2">
              <span class="min-w-0 flex-1 truncate py-1 -my-1">{post.title}</span>
              <span class="shrink-0 truncate py-1 -my-1 text-right text-muted-foreground/70 group-data-selected/command-item:text-muted-foreground">
                {post.formattedDate}
              </span>
            </span>
          </Command.LinkItem>
        {/each}
      </Command.Group>
    {/if}
  </Command.List>
  <div class="flex h-9 shrink-0 items-center gap-4 overflow-hidden px-4 text-xs text-muted-foreground">
    <span class="flex shrink-0 items-center gap-1.5">
      Select {@render keyCap("↑")}{@render keyCap("↓")}
    </span>
    <span class="flex shrink-0 items-center gap-1.5">
      Close {@render keyCap("Esc")}
    </span>
    {#if activeLabel}
      <span data-slot="command-active-action" class="ml-auto flex min-w-0 items-center gap-1.5 text-foreground">
        <span class="truncate">Go to {activeLabel}</span>
        {@render keyCap("↵")}
      </span>
    {/if}
  </div>
</Command.Dialog>

{#snippet keyCap(label: string)}
  <kbd class="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-[5px] bg-muted px-1 font-mono text-[10px] font-normal">
    {label}
  </kbd>
{/snippet}
