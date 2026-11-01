import rss from "@astrojs/rss";
import { markdownIdFromGlobKey, urlFromBase } from "@/lib/server-utils";

const base = import.meta.env.BASE_URL;

export async function GET(context) {
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
    site: context.site,
    items,
    customData: `<language>en-us</language>`,
  });
}
