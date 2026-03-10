# ktg-one — Design Document
_2026-02-27_

## What

Personal AI command centre — an agent chat interface that connects to KISMET/Notion, n8n workflows, GoodAI, and the web via a drop-in tool registry. Model-agnostic via Vercel AI Gateway. Built with Next.js 16 + shadcn/ui.

## Why

Single interface to talk to all systems (Notion DBs, n8n automations, GoodAI voice), compare models on the same prompt, and run ad-hoc research or code without switching tools.

---

## Architecture

```
Browser (shadcn/ui)
  → POST /api/agent  (Vercel Fluid Compute, streaming)
    → AI Gateway (anthropic/google/openai/xai)
      ↓ tool calls
      → lib/tools/* (Notion, n8n, GoodAI, sandbox, web search)
```

- **Framework:** Next.js 16, App Router, TypeScript
- **AI:** `ai` package + `@ai-sdk/gateway` for all model calls
- **Compute:** Vercel Fluid Compute (`export const maxDuration = 60`)
- **UI:** shadcn/ui (dark theme), Tailwind CSS
- **Storage:** `localStorage` for conversation history (v1, no DB)

---

## UI Layout

```
┌─────────────────────────────────────────────────────┐
│  ◈ ktg-one          [Claude 4.6 ▾]        [⚙]      │
├──────────────┬──────────────────────────────────────┤
│  Sidebar     │  Chat thread                          │
│  ─────────   │  ┌──────────────────────────────┐    │
│  History     │  │ 🤖 Querying KISMET for...     │    │
│  · Today     │  │   ⚙ tool: query_notion         │    │
│              │  │   ✓ Found 3 leads              │    │
│  Tools       │  │                                │    │
│  ✓ notion    │  │ 👤 Trigger the follow-up flow  │    │
│  ✓ n8n       │  │                                │    │
│  ✓ sandbox   │  │ 🤖 Done — workflow triggered   │    │
│  ✓ web       │  └──────────────────────────────┘    │
│  ✓ goodai    │                                       │
│              │  ┌──────────────────────────[↑]──┐   │
│              │  │ Ask anything...                │   │
│              │  └────────────────────────────────┘   │
└──────────────┴──────────────────────────────────────┘
```

**shadcn/ui components:** Sidebar, ScrollArea, Textarea, Badge, Collapsible, Select (model switcher), Avatar

---

## Tool Registry

Each tool is a standalone file — drop a new file to add an integration.

```
lib/tools/
  notion.ts       → query_notion, create_notion_page
  n8n.ts          → trigger_workflow, list_workflows
  web-search.ts   → web_search (AI Gateway web grounding)
  sandbox.ts      → run_code, browse_url (Vercel Sandbox)
  goodai.ts       → get_call_status, list_calls
```

All tools exported from `lib/tools/index.ts` and passed to `generateText`.

---

## Models (AI Gateway)

Sidebar dropdown:

| Label | Model ID |
|---|---|
| Claude Sonnet 4.6 (default) | `anthropic/claude-sonnet-4-6` |
| GPT-5 | `openai/gpt-5` |
| Gemini 2.5 Pro | `google/gemini-2.5-pro` |
| Grok 4 | `xai/grok-4` |

---

## API Route

```ts
// app/api/agent/route.ts
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, model } = await req.json();
  const result = streamText({
    model: gateway(model ?? 'anthropic/claude-sonnet-4-6'),
    messages,
    stopWhen: stepCountIs(10),
    tools,
  });
  return result.toDataStreamResponse();
}
```

---

## Key Files

```
ktg-one/
  app/
    page.tsx                 ← chat shell
    api/agent/route.ts       ← streaming agent endpoint
    layout.tsx
  components/
    chat/
      MessageThread.tsx      ← renders messages + tool steps
      InputBar.tsx           ← textarea + send
      ToolStepCard.tsx       ← collapsible tool call display
    layout/
      Sidebar.tsx            ← history + tool toggles
      ModelSelector.tsx      ← gateway model dropdown
  lib/
    tools/
      index.ts               ← exports all tools
      notion.ts
      n8n.ts
      web-search.ts
      sandbox.ts
      goodai.ts
    chat-store.ts            ← localStorage conversation state
  .env.local                 ← AI_GATEWAY_API_KEY, N8N_URL, etc.
```

---

## Environment Variables

```
AI_GATEWAY_API_KEY=          # Vercel AI Gateway key
N8N_WEBHOOK_BASE_URL=        # https://ai-yah-old.taile6f11d.ts.net/webhook
NOTION_API_KEY=              # (or via MCP)
GOODAI_API_URL=              # GoodAI/Trillet endpoint
VERCEL_SANDBOX_TOKEN=        # for Vercel Sandbox tool
```

---

## Out of Scope (v1)

- Auth / multi-user
- Persistent DB for conversations
- Streaming tool call results (tool results shown after completion)
- Mobile layout
