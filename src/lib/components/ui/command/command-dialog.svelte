<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import Command from "./command.svelte";
	import type { Command as CommandPrimitive, Dialog as DialogPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";

	let {
		open = $bindable(false),
		ref = $bindable(null),
		value = $bindable(""),
		title = "Command Palette",
		description = "Search for a command to run...",
		showCloseButton = false,
		portalProps,
		children,
		class: className,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.RootProps> &
		WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
			portalProps?: DialogPrimitive.PortalProps;
			children: Snippet;
			title?: string;
			description?: string;
			showCloseButton?: boolean;
			class?: string;
		} = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Header class="sr-only">
		<Dialog.Title>{title}</Dialog.Title>
		<Dialog.Description>{description}</Dialog.Description>
	</Dialog.Header>
	<Dialog.Content
		class={cn("command-palette top-[max(12dvh,calc(50dvh-220px))] sm:max-w-lg! translate-y-0 gap-0 overflow-hidden rounded-[12px] border border-border bg-popover p-0 shadow-[0_6px_18px_rgb(0_0_0/0.12),0_3px_9px_rgb(0_0_0/0.16),0_1px_1px_rgb(0_0_0/0.16)] ring-0", className)}
		{showCloseButton}
		{portalProps}
		fadeOnly
	>
		<Command {...restProps} bind:value bind:ref {children} />
	</Dialog.Content>
</Dialog.Root>
