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

    // Validate webhook path to prevent SSRF via prompt injection
    if (!/^[\w-]+$/.test(webhook)) {
      return { error: `Invalid webhook path: "${webhook}". Use alphanumeric characters and hyphens only.` };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(`${baseUrl}/${webhook}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload ?? {}),
        signal: controller.signal,
      });

      const text = await res.text();
      clearTimeout(timeout);

      if (!res.ok) {
        let detail;
        try { detail = JSON.parse(text)?.message ?? text; } catch { detail = text; }
        return { error: `Webhook failed: ${res.status}`, detail };
      }

      try {
        return { success: true, result: JSON.parse(text) };
      } catch {
        return { success: true, result: text };
      }
    } catch (e) {
      clearTimeout(timeout);
      if (e.name === "AbortError") return { error: "Webhook timed out after 15s" };
      return { error: e.message };
    }
  },
});
