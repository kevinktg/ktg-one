"use client";

import { useChat } from "@ai-sdk/react";
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
