import { tool } from "ai";
import { z } from "zod";

export const listCallsTool = tool({
  description: "List recent GoodAI voice agent calls. Use to check call history or status.",
  parameters: z.object({
    limit: z.number().default(10).describe("Number of recent calls to fetch"),
  }),
  execute: async ({ limit }) => {
    const apiUrl = process.env.GOODAI_API_URL;
    if (!apiUrl) return { note: "GOODAI_API_URL not configured", calls: [] };

    try {
      const res = await fetch(`${apiUrl}/calls?limit=${limit}`);
      const data = await res.json();
      return data;
    } catch (e) {
      return { error: e.message };
    }
  },
});
