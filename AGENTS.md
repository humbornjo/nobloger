# AGENTS.md

Guidance for working on nobloger. Keep changes consistent with the existing static architecture, generated-content boundaries, and restrained editorial design.

## Project overview

nobloger is the static site starter for [noblog](https://github.com/humbornjo/noblog). Astro generates every page at build time; there is no application server or client-side router. Markdown routes, RSS, metadata, and Notion-generated content must keep working without JavaScript.

The visual identity is "terminal on paper": local Arimo typography for interface and Markdown text, Hack for terminal accents and metadata, local Iosevka for code, warm neutral colors, a moss accent, `#` tags, `::` punctuation, and zero-radius controls. Prefer space and typography over cards, shadows, pills, and decorative animation.

## Stack and commands

- Astro 7 with static output and `@astrojs/svelte`.
- Svelte 5 runes for interactive islands and reusable presentational components.
- TypeScript in strict mode.
- Tailwind CSS 4 through `@tailwindcss/vite`, with CSS-first theme tokens.
- shadcn-svelte source components built on Bits UI, with Lucide icons.
- pnpm with the checked-in lockfile and `pnpm-workspace.yaml` overrides.

```sh
pnpm install
pnpm noblog:check    # validate noblog.yaml with the optional sibling CLI
pnpm noblog:generate # fetch Notion into the canonical store and public views
pnpm dev
pnpm build          # astro check && astro build; required before finishing structural changes
pnpm preview        # serve the production build for browser verification
pnpm format
pnpm format:check
```

There is no dedicated unit-test or lint script. Biome formats source CSS/JS/TS and root JSON/MJS/TS; `.astro` and `.svelte` components are outside automated formatting. Generated Markdown, deployment files, and vendored `.claude` skills are intentionally excluded. Keep dependency overrides in `pnpm-workspace.yaml`; pnpm 12 does not read `package.json#pnpm.overrides`.

Local generation requires Node 24+, the sibling `../noblog` checkout, and Notion credentials in `.env` or the environment. `noblog` is an optional `file:` dependency so the unchanged npm-based deployment does not require that sibling checkout. Keep generation explicit; do not add it to `dev` or `build`.

## Source map

- `src/pages/`: static routes, generated Markdown routes, and RSS.
- `.noblog/pages/`: local canonical Markdown store for database posts and recursively fetched child pages; generated and ignored.
- `noblog.yaml`: local Noblog property mapping, frontmatter fields, and output paths; no credentials.
- `src/layouts/`: document shell, metadata/theme bootstrap, and Markdown article layout.
- `src/components/`: static Astro header, footer, and page-heading components.
- `src/lib/components/site/`: site-specific Svelte components.
- `src/lib/components/ui/`: locally adapted shadcn-svelte primitives and their barrels.
- `src/lib/posts.ts`: build-time post/tag discovery and serializable summaries.
- `src/lib/satteri-noblog-child-links.js`: native Sätteri HAST visitor for canonical child links.
- `src/lib/types.ts`: shared frontmatter and serializable data contracts.
- `src/lib/server-utils.ts`: Node-only filesystem and URL utilities.
- `src/lib/utils.ts`: browser-safe utilities shared by hydrated components.
- `src/scripts/article.ts`: article-only overflow and keyboard behavior.
- `src/styles/global.css`: Tailwind entry point, semantic tokens, and global content styles.
- `tailwind.config.mjs`: the detailed typography/prose specification retained through `@config`.
- `public/`: fonts, images, and the authored `selfie.md` home-page content.
- `asset/`: README screenshots; refresh only from a visually reviewed final build.

## Content and routing invariants

- Do not hand-edit generated Markdown under `src/pages/posts/**` or `.noblog/pages/**`. The tracked `src/pages/posts/nob_children/[id].astro` route is source code. Do not edit `public/selfie.md` or sanitize the author's copy as part of a refactor.
- Preserve Markdown filenames, UUID routes, frontmatter, and the `MarkdownPostLayout.astro` contract. Recursively fetched child pages can have an empty `pubDate`; omit the date from the byline rather than inventing one.
- Local Noblog generation writes all pages to `.noblog/pages/*.md` and exposes only database posts through top-level symlinks in `src/pages/posts/`. The dynamic `nob_children/[id].astro` route renders canonical pages whose IDs are not in that public post glob. Legacy CI can instead provide regular nested Markdown files, which remain authoritative when no canonical store exists.
- Astro resolves Markdown symlinks to their real paths. Derive public post and RSS URLs from public glob keys with `markdownIdFromGlobKey()`, never from `MarkdownInstance.url`.
- The native Sätteri plugin rewrites only exact `./<id>.md` child links to base-aware `/posts/nob_children/<id>` routes. Keep legacy child links and external/asset URLs unchanged, and do not add unified rehype plugins that require a second Markdown processor.
- Blog, tag, and search discovery is deliberately shallow: `src/lib/posts.ts` uses eager raw `import.meta.glob("@/pages/posts/*.md", { query: "?raw", import: "default" })` and parses YAML frontmatter without evaluating article layouts. Do not broaden it to `**`, migrate to content collections without an explicit request, or import rendered Markdown modules from global chrome—the article → layout → header → post glob path otherwise creates a circular import on direct article loads.
- Nested notes remain directly routable but excluded from the blog index, tags, search, and RSS.
- RSS has its own shallow `./posts/*.{md,mdx}` discovery in `src/pages/rss.xml.js`. Preserve its membership when changing shared post logic.
- Generate base-aware links with the existing URL helper. Do not hard-code the production origin or assume a root deployment base.
- Do not change deployment workflows, authored content, or Notion assets as part of frontend work. Deployment continues to install the registry CLI; the local canonical store is a local-development concern.

## Astro and Svelte architecture

- Use Astro for routes, layouts, static content, metadata, and build-time discovery.
- Use Svelte only where component composition or browser behavior is useful. Hydrate interactive islands explicitly; keep primary content in server-rendered HTML.
- Search and theme controls stay hidden until mounted. All posts, article content, navigation, and tag links must remain readable without JavaScript.
- Pass only plain serializable DTOs such as `PostSummary` from Astro to Svelte. Never pass `MarkdownInstance`, filesystem paths, or Node objects into a hydrated component.
- Keep `server-utils.ts` and other Node-only imports out of browser dependency graphs. `utils.ts` must remain browser-safe.
- Keep generated Markdown and MathJax DOM outside Svelte hydration. MathJax and article scripts belong only to article pages.
- Delete superseded components and scripts rather than retaining compatibility wrappers.

## Svelte and shadcn-svelte conventions

- Name every `.svelte` file in kebab-case, for example `blog-explorer.svelte` and `theme-toggle.svelte`. Imported component identifiers remain PascalCase.
- Use Svelte 5 runes: `$props`, `$state`, `$derived`, and `$bindable` where appropriate. Avoid legacy `$:` assignments, `on:` directives, and `<slot>`-based new code.
- Use `$derived` for computed state. Reserve `$effect` for external synchronization that cannot be handled by an event, attachment, or binding.
- Use keyed `{#each}` blocks with stable unique keys. Do not use array indexes as keys.
- Use existing shadcn-svelte primitives before creating custom controls. Follow `components.json` aliases and the established barrel-import style.
- Components in `src/lib/components/ui/` contain intentional editorial and Bits UI compatibility adaptations. Do not regenerate, update, or overwrite them blindly; review local changes first.
- Let Bits UI provide keyboard behavior and ARIA semantics. In particular, single-select toggle groups use radio semantics; do not add conflicting `aria-pressed` attributes.
- Run the Svelte autofixer on every new or modified Svelte component, using the installed Svelte version:

  ```sh
  npx @sveltejs/mcp svelte-autofixer path/to/component.svelte --svelte-version 5.57.2
  ```

## Styling and theming

- Tailwind is configured through Vite and `src/styles/global.css`; do not reintroduce PostCSS configuration.
- Reuse semantic tokens such as `bg-background`, `text-foreground`, `text-muted-foreground`, `text-primary`, `border-border`, and `border-input`. Add a role token when an existing role does not fit rather than borrowing an unrelated token.
- Preserve the zero-radius scale and avoid generic rounded cards, shadows, and manual `dark:` color branches.
- Use `gap-*` for spacing, `size-*` for equal dimensions, `cn()` for conditional classes, and logical properties for direction-dependent layout.
- Transition only named properties, restrict hover styling to hover-capable pointers, and honor reduced motion.
- Theme initialization has two coordinated parts: the early inline bootstrap in `src/layouts/Head.astro` prevents flashes, and `theme-toggle.svelte` owns interaction after hydration. Do not duplicate either responsibility.
- Persist only `light`, `dark`, or `system` in `localStorage.theme`. Explicit themes set `data-theme`; system removes it. `light-dark()` supplies live system colors without another media-query listener.
- Suppress transitions during theme changes using the existing `data-theme-switching` mechanism.

## Accessibility and responsive behavior

- Preserve semantic landmarks, heading order, real links, labelled controls, the skip link, and visible keyboard focus.
- Never hide primary content behind an entrance animation or require JavaScript to reveal it.
- Search must retain a useful live result count, a named empty state, and a clear action that restores input focus.
- Wide code, tables, and MathJax may scroll locally, but must not cause page-level overflow and must remain keyboard reachable.
- Verify changes at 320px and with 200% text sizing. Check both themes, mobile and desktop, reduced motion, and no-JavaScript behavior when relevant.

## Verification and delivery

1. Run the Svelte autofixer for changed Svelte files.
2. Run `pnpm format:check` and `pnpm build`.
3. Serve the production build with `pnpm preview` and exercise the changed interface in a real browser; do not treat typechecking as behavioral verification.
4. For discovery or routing changes, inspect the generated route manifest and confirm top-level/nested/RSS/tag membership explicitly.
5. Review screenshots before updating `asset/preview_*.png`.
6. Check `git diff --check` and confirm no unintended changes under `src/pages/posts/**` or `public/selfie.md`.
7. Report checks actually run and any remaining warnings honestly. Do not commit or push unless the user asks.
