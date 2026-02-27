import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { tools } from "@/lib/tools";

export const maxDuration = 60;

const ALLOWED_MODELS = new Set([
  "anthropic/claude-sonnet-4-6",
  "anthropic/claude-opus-4-6",
  "openai/gpt-5",
  "google/gemini-2.5-pro",
  "xai/grok-4",
]);

const SYSTEM = `You are ktg-one, a personal AI agent for Kevin. You have access to tools:
- query_notion: search KISMET CRM, Notion pages/databases
- trigger_workflow: fire n8n automations (CRM actions, emails, Slack, syncs)
- web_search: search the web for current info
- run_code: execute JS or Python in a sandbox
- list_calls: check GoodAI voice agent call history

Be concise. Show your reasoning briefly before calling tools. After tool results, summarise what you found/did.`;

export async function POST(req) {
  const { messages, model = "anthropic/claude-sonnet-4-6" } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages must be a non-empty array" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!ALLOWED_MODELS.has(model)) {
    return new Response(JSON.stringify({ error: `Unknown model: ${model}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = streamText({
    model: gateway(model),
    system: SYSTEM,
    messages: await convertToModelMessages(messages),
    stopWhen: [stepCountIs(10)],
    tools,
  });

  return result.toUIMessageStreamResponse();
}
