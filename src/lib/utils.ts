export { cn } from "cn";

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};

export type WithoutChildren<T> = T extends { children?: unknown }
  ? Omit<T, "children">
  : T;

export function yearSectionId(year: string) {
  return `year-${year.toLowerCase()}`;
}

export function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
