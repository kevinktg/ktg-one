import { tool } from "ai";
import { z } from "zod";
import { gateway } from "@ai-sdk/gateway";

export const webSearchTool = tool({
  description: "Search the web for current information. Use for news, docs, prices, anything time-sensitive.",
  inputSchema: z.object({
    query: z.string().describe("What to search for. Be descriptive for better results."),
  }),
  execute: async ({ query }) => {
    try {
      // Use the native gateway parallel search tool
      const searchTool = gateway.tools.parallelSearch({ mode: 'agentic' });
      const result = await searchTool.execute({ objective: query }, { toolCallId: 'web_search_call', messages: [] });
      return result;
    } catch (e) {
      return { error: `Search failed: ${e.message}` };
    }
  },
});
