<script lang="ts">
  import type { PostSummary } from "$lib/types";
  import { Badge } from "$lib/components/ui/badge";
  import { cn } from "$lib/utils";

  interface Props {
    tags: PostSummary["tags"];
    class?: string;
    linkClass?: string;
    label?: string;
  }

  let { tags, class: className, linkClass, label = "Tags" }: Props = $props();
</script>

<ul
  class={cn("m-0 flex list-none flex-wrap gap-2 p-0", className)}
  aria-label={label}
>
  {#each tags as tag (tag.url)}
    <li>
      <Badge variant="tag" href={tag.url} class={linkClass}>
        {tag.name}
      </Badge>
    </li>
  {/each}
</ul>
