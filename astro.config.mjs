import { defineConfig, passthroughImageService } from "astro/config";
import svelte from "@astrojs/svelte";
import { satteri } from "@astrojs/markdown-satteri";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import satteriNoblogChildLinks from "./src/lib/satteri-noblog-child-links.js";
import satteriAboutSocialLinks from "./src/lib/satteri-about-social-links.js";

const base = "/";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  vite: {
    resolve: {
      alias: {
        "@icons": "~icons",
      },
    },
    plugins: [tailwindcss(), Icons({ compiler: "svelte" })],
  },
  compressHTML: true,
  site: "https://humbornjo.github.io",
  base,
  prefetch: {
    prefetchAll: true,
  },
  image: {
    service: passthroughImageService(),
  },
  markdown: {
    processor: satteri({
      hastPlugins: [
        satteriNoblogChildLinks({ base }),
        satteriAboutSocialLinks(),
      ],
    }),
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
