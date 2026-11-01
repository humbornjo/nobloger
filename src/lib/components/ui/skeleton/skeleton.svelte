<script lang="ts">
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
  }

  let { class: className }: Props = $props();
</script>

<div
  aria-hidden="true"
  class={cn("animate-pulse rounded-md bg-muted", className)}
></div>
