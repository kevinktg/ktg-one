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
