import { webSearchTool } from "./web-search";
import { queryNotionTool } from "./notion";
import { triggerWorkflowTool } from "./n8n";

export const tools = {
  web_search: webSearchTool,
  query_notion: queryNotionTool,
  trigger_workflow: triggerWorkflowTool,
};
