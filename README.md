# noblog-starter

An Astro blog starter for the happily lazy, powered by [noblog](https://github.com/humbornjo/noblog): keep writing in Notion and let the build turn it into a fast static site. No Notion? Plain Markdown works too.

Demo: [humbornjo.github.io/noblog-starter](https://humbornjo.github.io/noblog-starter/)

- Search and multi-tag filtering at `/tags`
- Recursive Notion pages rendered as inline subpage links
- Article table of contents, Shiki highlighting, and MathJax
- Light/dark theme without a theme flash
- RSS feed at `/rss.xml` (XML, not an HTML page)
- Core content readable without JavaScript
- Plain Markdown posts use the same layout, search, tags, and RSS

Your Notion database is the CMS: there is no server, admin panel, or copy-paste step. If you would rather avoid Notion entirely, write Markdown instead—the lazy path is optional, not mandatory.

![About page with the light theme on the left and dark theme on the right](./asset/preview_1.png)
![Blog index with the light theme on the left and dark theme on the right](./asset/preview_2.png)
![Article with a nested subpage link, split between light and dark themes](./asset/preview_3.png)

## Use this template

[Create a repository from this template](https://github.com/humbornjo/noblog-starter/generate), replace the demo `public/selfie.md`, update `site` and `base` in `astro.config.mjs`, then follow [Local development](#local-development) and [Deployment](#deployment).

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

2. Fork this project. Edit the authored `public/selfie.md` for the About page and set your deployment URLs in `astro.config.mjs` (or export `SITE_URL` and `BASE_PATH` before building):

   ```js
   site: "https://<YOUR_USER_NAME>.github.io",
   base: "/<REPO_NAME>",
   ```

   To render a Notion page as your About content instead, keep a database page whose title matches exactly and set the `SELFIE_PAGE` repository variable (step 4): the deploy workflow renders it to `.noblog/selfie.md` and copies it over `public/selfie.md` for the build. When the title matches nothing, the committed `public/selfie.md` remains the fallback. `src/pages/posts/` is never touched by generation output paths beyond generated post symlinks — hand-written Markdown posts live there as usual.

3. Add these repository secrets under **Settings → Secrets and variables → Actions**:

   - `NOBLOG_DATABASE_ID`: the Notion database ID.
   - `NOTION_API_SECRET`: the Notion integration token.

4. Optionally, under **Settings → Secrets and variables → Actions → Variables**, add `SELFIE_PAGE` with the exact title of your bio page to render it into `.noblog/selfie.md` (then `public/selfie.md`) at build time.

5. Under **Settings → Pages**, set the source to **GitHub Actions** and click **Save**.

   ![Enable GitHub Pages](./asset/enable_page.png)

6. Run **Actions → Deploy to GitHub Pages → Run workflow**.

The deploy workflow uses Node 24, installs the same pinned `noblog@0.3.0-beta.5` CLI as `package.json`, and builds with pnpm. Keep those versions aligned when upgrading the CLI.

### Scheduled refresh

Notion-hosted files and images use expiring URLs. The workflow refreshes generated content every four hours. If your assets expire sooner, increase the frequency in `.github/workflows/deploy.yml`:

```yaml
on:
  schedule:
    - cron: "0 */4 * * *"
```

Scheduled rebuilds are the zero-code fallback. A more durable option is to mirror Notion-hosted files during generation or build, store them with the site, and rewrite the Markdown image links to those local assets. The CLI does not expose this through `noblog.yaml`, so it requires a small post-generation download step or a custom renderer. Hosting the images on stable storage instead of Notion achieves the same result.

## Troubleshooting

- [Notion API documentation](https://developers.notion.com)
- A Notion database ID is the ID segment in the database URL:

  ```text
  https://www.notion.so/<workspace>/<DATABASE_ID>?v=<view_id>
  ```

- To keep a space inside math delimiters such as `$...$` or `$$...$$`, write `\ `; `~` does not work.
- For first-time GitHub Pages setup, follow [Enable GitHub Pages](https://tomcam.github.io/least-github-pages/enable-github-pages.html) and click **Save**.
- RSS output is XML. Open `/rss.xml` in a feed reader rather than expecting a styled HTML page.
- If generated content looks stale, rerun `pnpm noblog:generate`; do not patch generated Markdown directly.

## References

- Fonts: [Arimo](https://fonts.google.com/specimen/Arimo), [Hack](https://sourcefoundry.org/hack/), and [Iosevka](https://typeof.net/Iosevka/). The bundled Hack and Iosevka files are subset to keep the page payload small; extend the subsets if you add content in new character ranges.
- Style: [Terminimal](https://github.com/pawroman/zola-theme-terminimal/) and [astro-nano](https://github.com/markhorn-dev/astro-nano)
- Math rendering: [MathJax](https://docs.mathjax.org/en/latest/web/configuration.html)
- License: [MIT](./LICENSE)
