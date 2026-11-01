export interface PostFrontmatter {
  title: string;
  pubDate: string;
  tags?: string[];
  description?: string;
  archived?: boolean;
  layout?: string;
}

export type Theme = "light" | "dark" | "system";

export interface PostTag {
  name: string;
  url: string;
}

export interface PostSummary {
  title: string;
  url: string;
  description?: string;
  pubDate: string;
  formattedDate: string;
  readingTime: string;
  tags: PostTag[];
}

export interface TagSummary extends PostTag {
  count: number;
}
