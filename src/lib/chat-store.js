"use client";

import { useState } from "react";

const STORAGE_KEY = "ktg-one-conversations";
const ACTIVE_KEY = "ktg-one-active-id";

function normalizeMessage(message) {
  if (Array.isArray(message?.parts)) return message;
  if (typeof message?.content === "string") {
    return { ...message, parts: [{ type: "text", text: message.content }] };
  }
  return { ...message, parts: [] };
}

function normalizeConversation(conversation) {
  return {
    ...conversation,
    title: conversation?.title || "New conversation",
    messages: Array.isArray(conversation?.messages)
      ? conversation.messages.map(normalizeMessage)
      : [],
  };
}

function loadStored() {
  if (typeof window === "undefined") return { conversations: [], activeId: null };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const conversations = Array.isArray(parsed) ? parsed.map(normalizeConversation) : [];
    const storedActiveId = localStorage.getItem(ACTIVE_KEY);
    const activeId =
      conversations.find((c) => c.id === storedActiveId)?.id ?? conversations[0]?.id ?? null;
    return { conversations, activeId };
  } catch {
    return { conversations: [], activeId: null };
  }
}

export function useConversations() {
  const [conversations, setConversations] = useState(() => loadStored().conversations);
  const [activeId, setActiveId] = useState(() => loadStored().activeId);

  function save(nextOrUpdater) {
    setConversations((prev) => {
      const next = typeof nextOrUpdater === "function" ? nextOrUpdater(prev) : nextOrUpdater;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function newConversation(model) {
    const conv = {
      id: crypto.randomUUID(),
      title: "New conversation",
      messages: [],
      model,
      createdAt: Date.now(),
    };
    save((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    localStorage.setItem(ACTIVE_KEY, conv.id);
    return conv;
  }

  function updateConversation(id, updates) {
    save((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }

  function deleteConversation(id) {
    save((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (activeId === id) {
        const nextActiveId = next[0]?.id ?? null;
        setActiveId(nextActiveId);
        if (nextActiveId) localStorage.setItem(ACTIVE_KEY, nextActiveId);
        else localStorage.removeItem(ACTIVE_KEY);
      }
      return next;
    });
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
