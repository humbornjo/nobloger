<script lang="ts">
  import Menu from "@icons/lucide/menu";
  import X from "@icons/lucide/x";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { cn } from "$lib/utils.js";

  interface PageLink {
    name: "about" | "blog" | "tags";
    label: "About" | "Blogs" | "Search";
    url: string;
    current: boolean;
  }

  interface Props {
    pages: PageLink[];
  }

  let { pages }: Props = $props();
  let open = $state(false);
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button
        variant="ghost"
        size="icon-lg"
        {...props}
        class="size-[36px] text-muted-foreground hover:bg-transparent hover:text-foreground lg:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        id="site-menu"
      >
        <span class="relative size-4" aria-hidden="true">
          <Menu
            class={cn(
              "absolute inset-0 transition-[opacity,rotate,scale] duration-200 ease-out",
              open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
            )}
            strokeWidth={1.5}
          />
          <X
            class={cn(
              "absolute inset-0 transition-[opacity,rotate,scale] duration-200 ease-out",
              open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
            )}
            strokeWidth={1.5}
          />
        </span>
      </Button>
    {/snippet}
  </Dialog.Trigger>

  <Dialog.Content
    showCloseButton={false}
    class="inset-y-0 top-0 left-0 right-auto flex h-dvh max-w-xs translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-r-0 bg-background p-0 ring-0 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
  >
    <Dialog.Header class="gap-1.5 px-4 pt-5 pb-2">
      <Dialog.Title class="px-3 text-[13px] leading-normal font-normal text-muted-foreground">Menu</Dialog.Title>
      <Dialog.Description class="sr-only">Primary navigation</Dialog.Description>
    </Dialog.Header>

    <nav aria-label="Menu" class="flex-1 overflow-y-auto px-4 py-2">
      <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
        {#each pages as page (page.url)}
          <li>
            <a
              class={cn(
                "flex min-h-11 items-center rounded-full px-3 text-base no-underline hover:bg-muted hover:text-foreground",
                page.current ? "text-foreground" : "text-muted-foreground",
              )}
              href={page.url}
              aria-current={page.current ? "page" : undefined}
            >
              {page.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <Dialog.Close>
      {#snippet child({ props })}
        <Button
          variant="ghost"
          size="icon-sm"
          class="absolute top-3 right-3 rounded-full text-muted-foreground hover:text-foreground"
          {...props}
        >
          <X strokeWidth={1.5} aria-hidden="true" />
          <span class="sr-only">Close</span>
        </Button>
      {/snippet}
    </Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
