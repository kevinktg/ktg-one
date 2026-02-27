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
