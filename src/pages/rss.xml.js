import rss from "@astrojs/rss";
import { markdownIdFromGlobKey, urlFromBase } from "@/lib/server-utils";

const base = import.meta.env.BASE_URL;

export async function GET(context) {
  // context.site excludes `base`; project-site feeds must include it.
  const site = context.site ? new URL(base, context.site).href : context.site;
  const items = await Promise.all(
    Object.entries(import.meta.glob("./posts/*.{md,mdx}")).map(
      async ([path, loadPage]) => {
        const page = await loadPage();
        return {
          ...page.frontmatter,
          link: urlFromBase(base, `posts/${markdownIdFromGlobKey(path)}`),
        };
      },
    ),
  );

  return rss({
    title: "noblog",
    description: "bloger cipher",
    site,
    items,
    customData: `<language>en-us</language>`,
  });
}
