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
