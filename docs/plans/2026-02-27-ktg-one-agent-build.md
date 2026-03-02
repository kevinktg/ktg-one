# ktg-one Agent — Build Plan (Tasks 4–12)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the AI agent chat interface at `/agent` in the existing ktg-one Next.js portfolio site.

**Architecture:** New `/agent` route with its own layout (escaping the portfolio header/GeometricBackground). Streaming agent route at `/api/agent` using Vercel AI Gateway. Tool registry in `src/lib/tools/`. Chat state in localStorage via custom hook.

**Tech Stack:** Next.js 16 (App Router), AI SDK v6 (`ai@6.0.5`), `@ai-sdk/gateway@3.0.57`, shadcn/ui, Tailwind 4.0, JSX (no TypeScript)

**Already done:**
- `@ai-sdk/gateway` + `zod` installed
- shadcn `textarea`, `scroll-area`, `collapsible`, `select` added
- `src/lib/tools/index.js` + `src/lib/tools/web-search.js` created

---

## Task 4: Notion tool

**Files:**
- Create: `src/lib/tools/notion.js`
- Modify: `src/lib/tools/index.js`

### Step 1: Create `src/lib/tools/notion.js`

```js
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
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, page_size: 5 }),
    });

    const data = await res.json();
    if (!res.ok) return { error: data.message };

    return {
      results: data.results?.map((r) => ({
        id: r.id,
        title:
          r.properties?.title?.title?.[0]?.plain_text ??
          r.properties?.Name?.title?.[0]?.plain_text ??
          r.object,
        url: r.url,
        type: r.object,
      })) ?? [],
    };
  },
});
```

### Step 2: Register in `src/lib/tools/index.js`

```js
import { webSearchTool } from "./web-search";
import { queryNotionTool } from "./notion";

export const tools = {
  web_search: webSearchTool,
  query_notion: queryNotionTool,
};
```

### Step 3: Verify — check syntax compiles

```bash
cd /c/Users/kevin/projects/ktg-one
node --input-type=module < src/lib/tools/notion.js 2>&1
```

Expected: No errors (the import of `ai` and `zod` resolves fine).

### Step 4: Commit

```bash
git add src/lib/tools/notion.js src/lib/tools/index.js
git commit -m "feat: add query_notion tool"
```

---

## Task 5: n8n tool

**Files:**
- Create: `src/lib/tools/n8n.js`
- Modify: `src/lib/tools/index.js`

### Step 1: Create `src/lib/tools/n8n.js`

```js
import { tool } from "ai";
import { z } from "zod";

export const triggerWorkflowTool = tool({
  description: "Trigger an n8n automation workflow by webhook name. Use for sending emails, updating CRM, syncing data, sending Slack messages.",
  parameters: z.object({
    webhook: z.string().describe("Webhook path e.g. 'kismet-crm-complete' or 'send-follow-up'"),
    payload: z.record(z.any()).optional().describe("JSON payload to send to the webhook"),
  }),
  execute: async ({ webhook, payload }) => {
    const baseUrl = process.env.N8N_WEBHOOK_BASE_URL;
    if (!baseUrl) return { error: "N8N_WEBHOOK_BASE_URL not set" };

    const res = await fetch(`${baseUrl}/${webhook}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload ?? {}),
    });

    if (!res.ok) return { error: `Webhook failed: ${res.status}` };

    const text = await res.text();
    try {
      return { success: true, result: JSON.parse(text) };
    } catch {
      return { success: true, result: text };
    }
  },
});
```

### Step 2: Register in `src/lib/tools/index.js`

```js
import { webSearchTool } from "./web-search";
import { queryNotionTool } from "./notion";
import { triggerWorkflowTool } from "./n8n";

export const tools = {
  web_search: webSearchTool,
  query_notion: queryNotionTool,
  trigger_workflow: triggerWorkflowTool,
};
```

### Step 3: Verify syntax

```bash
node --input-type=module < src/lib/tools/n8n.js 2>&1
```

Expected: No errors.

### Step 4: Commit

```bash
git add src/lib/tools/n8n.js src/lib/tools/index.js
git commit -m "feat: add trigger_workflow tool (n8n)"
```

---

## Task 6: Sandbox + GoodAI tools

**Files:**
- Create: `src/lib/tools/sandbox.js`
- Create: `src/lib/tools/goodai.js`
- Modify: `src/lib/tools/index.js`

### Step 1: Install `@vercel/sandbox`

```bash
cd /c/Users/kevin/projects/ktg-one
npm install @vercel/sandbox --legacy-peer-deps
```

Expected: Added to `package.json`.

### Step 2: Create `src/lib/tools/sandbox.js`

```js
import { tool } from "ai";
import { z } from "zod";
import { Sandbox } from "@vercel/sandbox";

export const runCodeTool = tool({
  description: "Execute JavaScript or Python code in a secure sandbox. Use for calculations, data processing, testing snippets.",
  parameters: z.object({
    code: z.string().describe("Code to execute"),
    runtime: z.enum(["node24", "python3.13"]).default("node24"),
  }),
  execute: async ({ code, runtime }) => {
    try {
      const sandbox = await Sandbox.create({ runtime, timeout: 30000 });
      const filename = runtime === "node24" ? "index.js" : "index.py";
      await sandbox.files.write(filename, code);
      const result = await sandbox.commands.run(
        runtime === "node24" ? `node ${filename}` : `python ${filename}`
      );
      await sandbox.stop();
      return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode };
    } catch (e) {
      return { error: e.message };
    }
  },
});
```

### Step 3: Create `src/lib/tools/goodai.js`

```js
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
```

### Step 4: Final `src/lib/tools/index.js`

```js
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
```

### Step 5: Commit

```bash
git add src/lib/tools/sandbox.js src/lib/tools/goodai.js src/lib/tools/index.js package.json package-lock.json
git commit -m "feat: add run_code (sandbox) and list_calls (goodai) tools"
```

---

## Task 7: Agent API route

**Files:**
- Create: `src/app/api/agent/route.js`

### Step 1: Create `src/app/api/agent/route.js`

```js
import { streamText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { tools } from "@/lib/tools";

export const maxDuration = 60;

const SYSTEM = `You are ktg-one, a personal AI agent for Kevin. You have access to tools:
- query_notion: search KISMET CRM, Notion pages/databases
- trigger_workflow: fire n8n automations (CRM actions, emails, Slack, syncs)
- web_search: search the web for current info
- run_code: execute JS or Python in a sandbox
- list_calls: check GoodAI voice agent call history

Be concise. Show your reasoning briefly before calling tools. After tool results, summarise what you found/did.`;

export async function POST(req) {
  const { messages, model = "anthropic/claude-sonnet-4-6" } = await req.json();

  const result = streamText({
    model: gateway(model),
    system: SYSTEM,
    messages,
    maxSteps: 10,
    tools,
  });

  return result.toDataStreamResponse();
}
```

**Note:** AI SDK v6 uses `maxSteps` (not `stopWhen: stepCountIs()`). `gateway()` from `@ai-sdk/gateway` requires `AI_GATEWAY_API_KEY` env var.

### Step 2: Create `.env.local` with your keys

```bash
cp .env.local.example .env.local
# Then edit .env.local and fill in AI_GATEWAY_API_KEY
```

At minimum: `AI_GATEWAY_API_KEY=<your key>` for the agent to respond.

### Step 3: Start dev server and smoke-test

```bash
npm run dev
```

In a second terminal:
```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What tools do you have?"}]}' \
  --no-buffer
```

Expected: Streaming text response describing the tools.

### Step 4: Commit

```bash
git add src/app/api/agent/route.js
git commit -m "feat: add streaming agent API route with tool registry"
```

---

## Task 8: Chat store (localStorage)

**Files:**
- Create: `src/lib/chat-store.js`

### Step 1: Create `src/lib/chat-store.js`

```js
"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "ktg-one-conversations";

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  function save(convs) {
    setConversations(convs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  }

  function newConversation(model) {
    const conv = {
      id: crypto.randomUUID(),
      title: "New conversation",
      messages: [],
      model,
      createdAt: Date.now(),
    };
    const next = [conv, ...conversations];
    save(next);
    setActiveId(conv.id);
    return conv;
  }

  function updateConversation(id, updates) {
    save(conversations.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }

  function deleteConversation(id) {
    const next = conversations.filter((c) => c.id !== id);
    save(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
  }

  const active = conversations.find((c) => c.id === activeId) ?? null;

  return {
    conversations,
    active,
    activeId,
    setActiveId,
    newConversation,
    updateConversation,
    deleteConversation,
  };
}
```

### Step 2: Commit

```bash
git add src/lib/chat-store.js
git commit -m "feat: add localStorage conversation store"
```

---

## Task 9: Chat UI components

**Files:**
- Create: `src/components/chat/ToolStepCard.jsx`
- Create: `src/components/chat/MessageThread.jsx`
- Create: `src/components/chat/InputBar.jsx`
- Create: `src/components/chat/ModelSelector.jsx`

First create the directory:
```bash
mkdir -p /c/Users/kevin/projects/ktg-one/src/components/chat
```

### Step 1: Create `src/components/chat/ToolStepCard.jsx`

```jsx
"use client";

import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Wrench } from "lucide-react";

export function ToolStepCard({ toolName, input, output, state }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="my-1">
      <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left">
        <Wrench className="w-3 h-3" />
        <Badge variant="outline" className="text-xs font-mono">{toolName}</Badge>
        {state === "result" && <span className="text-green-500">✓</span>}
        {state === "call" && <span className="text-yellow-500 animate-pulse">⚙</span>}
        <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 ml-5 text-xs font-mono bg-muted/50 rounded p-2 space-y-1">
        <div>
          <span className="text-muted-foreground">input: </span>
          <pre className="inline whitespace-pre-wrap">{JSON.stringify(input, null, 2)}</pre>
        </div>
        {output !== undefined && (
          <div>
            <span className="text-muted-foreground">output: </span>
            <pre className="inline whitespace-pre-wrap">{JSON.stringify(output, null, 2)}</pre>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
```

### Step 2: Create `src/components/chat/MessageThread.jsx`

AI SDK v6 messages use `parts` array. Each part has a `type`:
- `"text"` — text content with `.text` property
- `"tool-invocation"` — tool call with `.toolInvocation` property

```jsx
"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolStepCard } from "./ToolStepCard";
import { Bot, User } from "lucide-react";

export function MessageThread({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] ${msg.role === "user" ? "order-first" : ""}`}>
              {/* Render parts (AI SDK v6) */}
              {Array.isArray(msg.parts) ? (
                msg.parts.map((part, i) => {
                  if (part.type === "tool-invocation") {
                    return (
                      <ToolStepCard
                        key={i}
                        toolName={part.toolInvocation.toolName}
                        input={part.toolInvocation.args}
                        output={"result" in part.toolInvocation ? part.toolInvocation.result : undefined}
                        state={part.toolInvocation.state}
                      />
                    );
                  }
                  if (part.type === "text" && part.text) {
                    return (
                      <div
                        key={i}
                        className="rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap bg-muted text-foreground"
                      >
                        {part.text}
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                /* Fallback: plain string content (user messages) */
                msg.content && (
                  <div
                    className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                )
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-muted rounded-xl px-4 py-2.5 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
```

### Step 3: Create `src/components/chat/InputBar.jsx`

```jsx
"use client";

import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Square } from "lucide-react";

export function InputBar({ value, onChange, onSubmit, onStop, isLoading }) {
  const ref = useRef(null);

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) onSubmit();
    }
  }

  return (
    <div className="border-t border-border px-4 py-4">
      <div className="max-w-3xl mx-auto relative">
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything… (Enter to send, Shift+Enter for newline)"
          className="pr-12 resize-none bg-muted border-0 focus-visible:ring-1 focus-visible:ring-violet-500 min-h-[52px] max-h-[200px]"
          rows={1}
        />
        <Button
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8 bg-violet-600 hover:bg-violet-700"
          onClick={isLoading ? onStop : onSubmit}
          disabled={!isLoading && !value.trim()}
        >
          {isLoading ? <Square className="w-3 h-3" /> : <ArrowUp className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
```

### Step 4: Create `src/components/chat/ModelSelector.jsx`

```jsx
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MODELS = [
  { id: "anthropic/claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
  { id: "anthropic/claude-opus-4-6", label: "Claude Opus 4.6" },
  { id: "openai/gpt-5", label: "GPT-5" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { id: "xai/grok-4", label: "Grok 4" },
];

export function ModelSelector({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] h-8 text-xs border-zinc-700 bg-transparent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MODELS.map((m) => (
          <SelectItem key={m.id} value={m.id} className="text-xs">
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Step 5: Commit

```bash
git add src/components/chat/
git commit -m "feat: add chat UI components (MessageThread, InputBar, ModelSelector, ToolStepCard)"
```

---

## Task 10: Sidebar layout

**Files:**
- Create: `src/components/layout/AppSidebar.jsx`

```bash
mkdir -p /c/Users/kevin/projects/ktg-one/src/components/layout
```

### Step 1: Create `src/components/layout/AppSidebar.jsx`

```jsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Trash2 } from "lucide-react";

const TOOLS = ["notion", "n8n", "sandbox", "web search", "goodai"];

export function AppSidebar({ conversations, activeId, onSelect, onNew, onDelete }) {
  return (
    <div className="w-[240px] shrink-0 border-r border-border flex flex-col h-full bg-zinc-950">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="font-semibold text-sm tracking-tight">◈ ktg-one</span>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onNew}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1 p-2">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-1">
          History
        </p>
        <div className="space-y-0.5">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`group flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer text-sm hover:bg-zinc-800 ${
                c.id === activeId ? "bg-zinc-800 text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => onSelect(c.id)}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1 truncate text-xs">{c.title}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(c.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Tools status */}
      <div className="p-3 border-t border-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Tools</p>
        <div className="flex flex-wrap gap-1">
          {TOOLS.map((t) => (
            <Badge key={t} variant="outline" className="text-[10px] text-green-400 border-green-400/30">
              {t}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Commit

```bash
git add src/components/layout/AppSidebar.jsx
git commit -m "feat: add AppSidebar component"
```

---

## Task 11: Agent page + layout

**Files:**
- Create: `src/app/agent/layout.jsx`
- Create: `src/app/agent/page.jsx`

The root layout (`src/app/layout.jsx`) includes `GeometricBackground`, `ClientLayout`, `CursorDot` — decorations that don't belong in a command-centre UI. Next.js App Router lets you override the layout for nested routes. A layout file at `src/app/agent/layout.jsx` replaces the root layout **for that segment only**.

**Important:** You cannot selectively opt-out of a parent layout in Next.js — the agent layout must be a **Route Group** to escape it. Use `src/app/(agent)/agent/` structure OR accept the root layout.

The simplest approach: create `src/app/agent/layout.jsx` — this layout applies **in addition to** the root layout. Since the root layout still wraps it, the `GeometricBackground` will be present but the agent page will sit on top of it (full-screen `h-screen` div with a solid dark background that covers it).

### Step 1: Create `src/app/agent/layout.jsx`

```jsx
export const metadata = {
  title: "ktg-one Agent",
  description: "Personal AI command centre",
};

export default function AgentLayout({ children }) {
  return children;
}
```

### Step 2: Create `src/app/agent/page.jsx`

```jsx
"use client";

import { useChat } from "ai/react";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MessageThread } from "@/components/chat/MessageThread";
import { InputBar } from "@/components/chat/InputBar";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { useConversations } from "@/lib/chat-store";

export default function AgentPage() {
  const [model, setModel] = useState("anthropic/claude-sonnet-4-6");
  const {
    conversations,
    active,
    activeId,
    setActiveId,
    newConversation,
    updateConversation,
    deleteConversation,
  } = useConversations();

  const { messages, input, setInput, handleSubmit, isLoading, stop, setMessages } = useChat({
    api: "/api/agent",
    body: { model },
    onFinish: (msg) => {
      if (activeId) {
        const firstUserMsg = messages.find((m) => m.role === "user");
        const title = firstUserMsg?.content?.slice(0, 40) ?? "New conversation";
        updateConversation(activeId, {
          messages: [...messages, msg],
          title,
        });
      }
    },
  });

  // Load messages when switching conversations
  useEffect(() => {
    if (active) {
      setMessages(active.messages);
    } else {
      setMessages([]);
    }
  }, [activeId]); // eslint-disable-line

  function handleNew() {
    const conv = newConversation(model);
    setMessages([]);
    setInput("");
  }

  return (
    // Full-screen solid background covers the portfolio GeometricBackground
    <div className="fixed inset-0 flex bg-zinc-900 text-foreground z-50">
      <AppSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNew}
        onDelete={deleteConversation}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-zinc-900">
          <span className="text-sm text-muted-foreground">
            {active?.title ?? "New conversation"}
          </span>
          <ModelSelector value={model} onChange={setModel} />
        </div>

        {/* Messages */}
        <MessageThread messages={messages} isLoading={isLoading} />

        {/* Input */}
        <InputBar
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          onStop={stop}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
```

**Note:** `fixed inset-0 z-50` makes the agent page cover the portfolio background completely.

### Step 3: Verify it renders

```bash
npm run dev
```

Open http://localhost:3000/agent

Expected: Full-screen dark chat UI with sidebar, no portfolio header/GeometricBackground visible.

### Step 4: Commit

```bash
git add src/app/agent/
git commit -m "feat: add agent page at /agent route"
```

---

## Task 12: Update vercel.json

**Files:**
- Modify: `vercel.json`

### Step 1: Update `vercel.json`

Replace the existing content with:

```json
{
  "framework": "nextjs",
  "regions": ["syd1"],
  "fluid": true,
  "installCommand": "npm install --legacy-peer-deps",
  "env": {
    "AI_GATEWAY_API_KEY": "@ai-gateway-api-key",
    "N8N_WEBHOOK_BASE_URL": "@n8n-webhook-base-url",
    "NOTION_API_KEY": "@notion-api-key",
    "GOODAI_API_URL": "@goodai-api-url"
  }
}
```

**Note:** This changes region from `iad1` (US East) to `syd1` (Sydney). Fluid Compute enables long-running streaming. `@variable-name` references Vercel environment variable secrets.

### Step 2: Add env vars to Vercel (run once)

```bash
vercel env add AI_GATEWAY_API_KEY production
vercel env add N8N_WEBHOOK_BASE_URL production
vercel env add NOTION_API_KEY production
vercel env add GOODAI_API_URL production
```

Or set them in the Vercel dashboard at https://vercel.com/dashboard → Project → Settings → Environment Variables.

### Step 3: Commit

```bash
git add vercel.json
git commit -m "feat: update vercel.json for syd1 region + Fluid Compute"
```

---

## Smoke test the full flow

After Task 11, with `npm run dev` running:

1. Go to http://localhost:3000/agent
2. Verify: sidebar shows, model selector shows "Claude Sonnet 4.6"
3. Type "What tools do you have?" → send (Enter)
4. Expected: Streaming reply listing the 5 tools
5. Type "Run this JS: `console.log(1+1)`"
6. Expected: `run_code` tool card appears, then result "2"
7. Refresh page — previous conversation should be in sidebar

---

## Done ✓

The agent is live at `/agent`. Share it via Vercel at `ktg.one/agent`.
