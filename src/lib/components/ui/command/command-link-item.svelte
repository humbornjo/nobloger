<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.LinkItemProps = $props();
</script>


<CommandPrimitive.LinkItem
	bind:ref
	data-slot="command-item"
	class={cn(
		"data-selected:bg-muted data-selected:text-foreground data-selected:*:[svg]:text-foreground text-muted-foreground transition-colors relative flex h-8 cursor-default items-center gap-2 rounded-[8px] px-2 py-0 text-[13px] outline-hidden select-none in-data-[slot=dialog-content]:rounded-[8px]! [&_svg:not([class*='size-'])]:size-4 group/command-item [&_svg]:pointer-events-none [&_svg]:shrink-0",
		"data-disabled:pointer-events-none data-disabled:opacity-50",
		className
	)}
	{...restProps}
/>
