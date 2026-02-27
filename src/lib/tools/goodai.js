import { tool } from "ai";
import { z } from "zod";

export const listCallsTool = tool({
  description: "List recent GoodAI voice agent calls. Use to check call history or status.",
  inputSchema: z.object({
    limit: z.number().int().min(1).max(100).default(10).describe("Number of recent calls to fetch"),
  }),
  execute: async ({ limit }) => {
    const apiUrl = process.env.GOODAI_API_URL;
    if (!apiUrl) return { note: "GOODAI_API_URL not configured", calls: [] };

    try {
      const res = await fetch(`${apiUrl}/calls?limit=${limit}`);
      const text = await res.text();
      if (!res.ok) return { error: `GoodAI API error: ${res.status}`, detail: text.slice(0, 200) };
      const data = JSON.parse(text);
      return data;
    } catch (e) {
      return { error: e.message };
    }
  },
});
