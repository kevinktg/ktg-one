import { tool } from "ai";
import { z } from "zod";

export const queryNotionTool = tool({
  description: "Search Notion pages and databases. Use for KISMET CRM data, tasks, notes, any Notion content.",
  parameters: z.object({
    query: z.string().describe("What to search for in Notion"),
    filter: z.string().optional().describe("Optional: filter by database name e.g. 'KISMET' or 'Tasks'"),
  }),
  execute: async ({ query, filter }) => {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) return { error: "NOTION_API_KEY not set" };

    const res = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28", // required by Notion API for versioned responses
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, page_size: 5 }),
    });

    const data = await res.json();
    if (!res.ok) return { error: data.message };

    const results = data.results?.map((r) => ({
      id: r.id,
      title:
        r.properties?.title?.title?.[0]?.plain_text ??
        r.properties?.Name?.title?.[0]?.plain_text ??
        r.object,
      url: r.url,
      type: r.object,
    })) ?? [];

    return {
      results: filter
        ? results.filter((r) => r.title?.toLowerCase().includes(filter.toLowerCase()))
        : results,
    };
  },
});
