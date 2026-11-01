# nobloger

An Astro starter for [noblog](https://github.com/humbornjo/noblog): write in Notion, ship a fully static blog.

Demo: [blog.humbornjo.com](https://blog.humbornjo.com)

- Search and multi-tag filtering at `/tags`
- Recursive Notion pages rendered as inline subpage links
- Article table of contents, Shiki highlighting, and MathJax
- Light/dark theme without a theme flash
- RSS feed at `/rss.xml` (XML, not an HTML page)
- Core content readable without JavaScript

![About page](./asset/preview_1.png)
![Blog index](./asset/preview_2.png)
![Article with table of contents, math, and code](./asset/preview_3.png)

## Requirements

- Node.js 24 or newer
- pnpm
- A Notion integration token and database ID for content generation

## Local development

1. Create your environment file and fill in the two values:

   ```sh
   cp .env.example .env
   ```

2. Install the dependencies and validate the Noblog configuration:

   ```sh
   pnpm install
   pnpm noblog:check
   ```

3. Generate the local content store and start Astro:

   ```sh
   pnpm noblog:generate
   pnpm dev
   ```

The `noblog` CLI is an optional dependency installed from npm; no sibling checkout is required. Generation is explicit and is not part of `dev` or `build`, so frontend work does not need Notion access once the generated files exist.

`noblog.yaml` contains content mapping and output settings only, never credentials. Generation writes to `.noblog/pages/` and exposes database posts through symlinks in `src/pages/posts/`; both are ignored and generated. Do not edit their Markdown by hand.

`output.childPageMarker` controls the marker Noblog emits before recursive child-page links. The marker and link are rendered as a subpage link card. The default is `⸎`; legacy kaomoji markers remain supported.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Astro development server |
| `pnpm build` | Run `astro check` and build the static site |
| `pnpm preview` | Serve the production build for browser verification |
| `pnpm noblog:check` | Validate `noblog.yaml` |
| `pnpm noblog:generate` | Fetch Notion content into the local store |
| `pnpm format` | Format source files with Biome |
| `pnpm format:check` | Check formatting without writing |

Top-level database posts appear in the blog index, Search, and RSS. Recursive child pages are directly routable and linked from their parent posts, but are excluded from discovery feeds. Search uses AND semantics when several tags are selected.

## Deployment

1. Duplicate the [Noblog database](https://www.notion.so/humbornjo/fa0faae85c504934a4a86cfa70302850?v=2abd1079ae134fbd8df2604765baa1df) and move your posts into it. Plain Markdown posts also work under `src/pages/posts/` when frontmatter matches `MarkdownPostLayout.astro`; that path is gitignored for generated content, so force-add hand-written posts or adjust `.gitignore`.

   ```md
   ---
   layout: ../../layouts/MarkdownPostLayout.astro
   title: "..."
   pubDate: "2024-01-24"
   tags: ["lang"]
   description: ""
   ---
   ```

2. Fork this project. Edit the authored `public/selfie.md` for the About page and set your deployment URLs in `astro.config.mjs`:

   ```js
   site: "https://<YOUR_USER_NAME>.github.io",
   base: "/<REPO_NAME>",
   ```

3. Add these repository secrets under **Settings → Secrets and variables → Actions**:

   - `NOBLOG_DATABASE_ID`: the Notion database ID.
   - `NOTION_API_SECRET`: the Notion integration token.

4. Under **Settings → Pages**, set the source to **GitHub Actions**.

   ![Enable GitHub Pages](./asset/enable_page.png)

5. Run **Actions → Deploy to GitHub Pages → Run workflow**.

The deploy workflow uses Node 24 and installs the registry CLI. `package.json` currently pins `noblog@0.3.0-beta.3`; if npm's `latest` tag has not been promoted to 0.3.x yet, change the workflow install step to `npm i -g noblog@beta` before deploying so recursive pages and `childPageMarker` match local output.

Notion-hosted file and image URLs expire. The workflow includes a scheduled run to keep generated content fresh; adjust the cron in `.github/workflows/deploy.yml` if your assets expire sooner.

## Troubleshooting

- [Notion API documentation](https://developers.notion.com)
- A Notion database ID is the ID segment in the database URL:

  ```text
  https://www.notion.so/<workspace>/<DATABASE_ID>?v=<view_id>
  ```

- To keep a mathematical space next to `$` or `$$`, use `\ ` rather than `~`.
- RSS output is XML. Open `/rss.xml` in a feed reader rather than expecting a styled HTML page.
- If generated content looks stale, rerun `pnpm noblog:generate`; do not patch generated Markdown directly.

## References

- Fonts: [Arimo](https://fonts.google.com/specimen/Arimo), [Hack](https://sourcefoundry.org/hack/), and [Iosevka](https://typeof.net/Iosevka/). The bundled Hack and Iosevka files are subset to keep the page payload small; extend the subsets if you add content in new character ranges.
- Style: [Terminimal](https://github.com/pawroman/zola-theme-terminimal/) and [astro-nano](https://github.com/markhorn-dev/astro-nano)
- Math rendering: [MathJax](https://docs.mathjax.org/en/latest/web/configuration.html)
- License: [MIT](./LICENSE)
