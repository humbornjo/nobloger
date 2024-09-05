import * as fs from "fs";
import * as path from "path";
import { countWords } from "alfaaz";

export function formatDate(date: Date) {
  try {
    return Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).format(date);
  } catch {
    return Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).format(new Date());

  }
}

export function readingTime(path: string) {
  const file = fs.readFileSync(path, "utf-8");
  const wordsPerMin = 200;
  const wordsCount = countWords(file);
  const timeMin = Math.ceil(wordsCount / wordsPerMin);

  return `${timeMin} min read`;
}

export function urlFromBase(base: string, url: string) {
  return path.join(base, url)
}
