import { parse } from "yaml";
import { formatDate } from "./utils";
import {
  markdownIdFromGlobKey,
  readingTime,
  urlFromBase,
} from "./server-utils";
import type { PostFrontmatter, PostSummary, TagSummary } from "./types";

interface PostEntry {
  path: string;
  source: string;
  frontmatter: PostFrontmatter;
}

const base = import.meta.env.BASE_URL;
const posts = Object.entries(
  import.meta.glob<string>("@/pages/posts/*.md", {
    eager: true,
    import: "default",
    query: "?raw",
  }),
)
  .map(([path, source]) => ({
    path,
    source,
    frontmatter: parseFrontmatter(path, source),
  }))
  .sort((a, b) => b.frontmatter.pubDate.localeCompare(a.frontmatter.pubDate));

function parseFrontmatter(path: string, source: string): PostFrontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) throw new Error(`Missing Markdown frontmatter: ${path}`);
  return parse(match[1]) as PostFrontmatter;
}

function tagUrl(name: string) {
  return `${urlFromBase(base, "tags")}?tag=${encodeURIComponent(name)}`;
}

function toPostSummary(post: PostEntry): PostSummary {
  const { title, description, pubDate, tags = [] } = post.frontmatter;

  return {
    title,
    url: urlFromBase(base, `posts/${markdownIdFromGlobKey(post.path)}`),
    description,
    pubDate,
    formattedDate: formatDate(pubDate),
    readingTime: readingTime(post.source),
    tags: tags.map((name) => ({ name, url: tagUrl(name) })),
  };
}

export function getPostSummaries(): PostSummary[] {
  return posts.map(toPostSummary);
}

export function getTagSummaries(): TagSummary[] {
  const names = [
    ...new Set(posts.flatMap((post) => post.frontmatter.tags ?? [])),
  ];

  return names
    .map((name) => ({
      name,
      url: tagUrl(name),
      count: posts.filter((post) => post.frontmatter.tags?.includes(name))
        .length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
