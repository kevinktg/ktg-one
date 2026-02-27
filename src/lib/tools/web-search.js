import { tool } from "ai";
import { z } from "zod";

export const webSearchTool = tool({
  description: "Search the web for current information. Use for news, docs, prices, anything time-sensitive.",
  parameters: z.object({
    query: z.string().describe("Search query"),
  }),
  execute: async ({ query }) => {
    // Uses Vercel AI Gateway web grounding via the model
    return { query, note: "Web grounding enabled via AI Gateway" };
  },
});
