<script lang="ts">
  import type { PostSummary } from "$lib/types";
  import { cn } from "$lib/utils";
  import TagList from "./tag-list.svelte";

  interface Props {
    posts: PostSummary[];
    id?: string;
    class?: string;
  }

  let { posts, id = "post-list", class: className }: Props = $props();
</script>

<ul
  {id}
  class={cn("m-0 list-none divide-y divide-border p-0", className)}
>
  {#each posts as post (post.url)}
    <li class="py-5 first:pt-0 last:pb-0 sm:py-6">
      <h2
        class="m-0 text-xl font-semibold leading-[1.35] tracking-[-0.015em] text-foreground [overflow-wrap:anywhere] [text-wrap:pretty]"
      >
        <a
          class="rounded-none no-underline decoration-border underline-offset-4 transition-[color]! hover:underline"
          href={post.url}
        >
          {post.title}
        </a>
      </h2>
      <div
        class="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-meta text-muted-foreground"
      >
        <time class="whitespace-nowrap" datetime={post.pubDate}>
          {post.formattedDate}
        </time>
        <span aria-hidden="true">·</span>
        <span class="whitespace-nowrap">{post.readingTime}</span>
      </div>
      {#if post.description?.trim()}
        <p
          class="mb-0 mt-3 text-base leading-relaxed text-muted-foreground [text-wrap:pretty]"
        >
          {post.description}
        </p>
      {/if}
      {#if post.tags.length > 0}
        <TagList tags={post.tags} class="mt-3" />
      {/if}
    </li>
  {/each}
</ul>
