import { webSearchTool } from "./web-search";
import { queryNotionTool } from "./notion";
import { triggerWorkflowTool } from "./n8n";
import { runCodeTool } from "./sandbox";
import { listCallsTool } from "./goodai";

export const tools = {
  web_search: webSearchTool,
  query_notion: queryNotionTool,
  trigger_workflow: triggerWorkflowTool,
  run_code: runCodeTool,
  list_calls: listCallsTool,
};
