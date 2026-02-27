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
