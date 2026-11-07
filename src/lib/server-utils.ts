import { posix } from "path";
import { countWords } from "alfaaz";

export function readingTime(source: string) {
  const wordsPerMin = 200;
  const wordsCount = countWords(source);
  const timeMin = Math.ceil(wordsCount / wordsPerMin);
  return `${timeMin} min read`;
}

export function urlFromBase(base: string, url: string) {
  return posix.join(base, url);
}

export function markdownIdFromGlobKey(path: string) {
  const match = /([^/]+)\.mdx?$/.exec(path);
  if (!match) throw new Error(`Invalid Markdown glob key: ${path}`);
  return match[1];
}
