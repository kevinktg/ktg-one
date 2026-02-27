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
