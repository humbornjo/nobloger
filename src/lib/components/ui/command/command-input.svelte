<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import SearchIcon from "@icons/lucide/search";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<div data-slot="command-input-wrapper" class="border-b border-border/60">
	<InputGroup.Root class="h-10 gap-2.5 rounded-none border-0 bg-transparent px-4 shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 *:data-[slot=input-group-addon]:pl-0">
		<CommandPrimitive.Input
			{value}
			data-slot="command-input"
			class={cn(
				"h-full w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			{...restProps}
		>
			{#snippet child({ props })}
				<InputGroup.Input {...props} bind:value bind:ref />
			{/snippet}
		</CommandPrimitive.Input>
		<InputGroup.Addon>
			<SearchIcon class="size-4 shrink-0 opacity-70" strokeWidth={1.5} />
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
