import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  getMatchBlogs: defineAction({
    input: z.string(),
    handler: async (text) => {
      return `Hello, ${text}!`
    }
  })
}
