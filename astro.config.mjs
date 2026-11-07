import { defineConfig, passthroughImageService } from "astro/config";
import svelte from "@astrojs/svelte";
import { satteri } from "@astrojs/markdown-satteri";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import satteriNoblogChildLinks from "./src/lib/satteri-noblog-child-links.js";
import satteriNoblogSummary from "./src/lib/satteri-noblog-summary.js";
import satteriAboutSocialLinks from "./src/lib/satteri-about-social-links.js";

// Pages project sites live under /<repo>; set BASE_PATH for those builds.
// A custom domain serves from the root and keeps the default.
const base = process.env.BASE_PATH || "/";
const selfiePage = process.env.SELFIE_PAGE || "";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  vite: {
    define: {
      __SELFIE_PAGE__: JSON.stringify(selfiePage),
    },
    resolve: {
      alias: {
        "@icons": "~icons",
      },
    },
    plugins: [tailwindcss(), Icons({ compiler: "svelte" })],
  },
  compressHTML: true,
  site: process.env.SITE_URL || "https://humbornjo.github.io",
  base,
  prefetch: {
    prefetchAll: true,
  },
  image: {
    service: passthroughImageService(),
  },
  markdown: {
    processor: satteri({
      features: {
        rawHtml: true,
      },
      hastPlugins: [
        satteriNoblogChildLinks({ base }),
        satteriNoblogSummary(),
        satteriAboutSocialLinks(),
      ],
    }),
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
