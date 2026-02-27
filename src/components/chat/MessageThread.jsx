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
                        className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-violet-600 text-white"
                            : "bg-muted text-foreground"
                        }`}
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
