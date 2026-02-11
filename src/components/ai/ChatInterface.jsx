"use client";

import { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIStore } from '@/lib/stores/ai-store';
import {
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ChatInterface({ className }) {
  const selectedModel = useAIStore((state) => state.selectedModel);
  const setSelectedModel = useAIStore((state) => state.setSelectedModel);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
  } = useChat({
    api: '/api/gateway',
    body: { model: selectedModel },
    onError: (err) => {
      console.error('Chat error:', err);
    },
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Animate new messages
  useGSAP(() => {
    if (messages.length > 0 && containerRef.current) {
      const lastMessage = containerRef.current.querySelector('.message-item:last-child');
      if (lastMessage) {
        gsap.fromTo(
          lastMessage,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
  }, { dependencies: [messages.length] });

  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const models = [
    { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4' },
    { id: 'openai/gpt-4o', name: 'GPT-4o' },
    { id: 'google/gemini-2.0-flash', name: 'Gemini Flash' },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-black/40 rounded-2xl border border-white/10 overflow-hidden", className)}>
      {/* Header with model selector */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <span className="font-syne font-semibold text-sm">AI Gateway</span>
        </div>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white/70 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id} className="bg-black">
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div ref={containerRef} className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-white/50 text-sm max-w-xs mx-auto">
                Start a conversation with the AI Gateway. Ask about prompt engineering,
                RAG architectures, or any technical topic.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "message-item group flex gap-3",
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  message.role === 'user'
                    ? 'bg-white/10'
                    : 'bg-purple-500/20'
                )}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white/70" />
                ) : (
                  <Bot className="w-4 h-4 text-purple-400" />
                )}
              </div>
              <div
                className={cn(
                  "flex-1 max-w-[80%] rounded-2xl px-4 py-3 text-sm relative",
                  message.role === 'user'
                    ? 'bg-white/10 text-white'
                    : 'bg-purple-500/10 text-white/90 border border-purple-500/20'
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                  >
                    {copiedId === message.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-white/50" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              </div>
              <div className="bg-purple-500/10 rounded-2xl px-4 py-3 border border-purple-500/20">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <span>Error: {error.message}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => reload()}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about prompt engineering, RAG, or AI architectures..."
            className="flex-1 bg-white/5 border-white/10 focus:border-purple-500/50"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-500 text-white border-0 px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
