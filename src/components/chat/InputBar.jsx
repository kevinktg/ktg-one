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
