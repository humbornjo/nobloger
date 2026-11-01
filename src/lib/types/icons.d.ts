// Types for the @icons/* prefix, aliased to unplugin-icons' ~icons/*.
declare module "@icons/*" {
  import type { Component } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  const component: Component<SvelteHTMLElements["svg"]>;

  export default component;
}
