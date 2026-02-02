"use client";

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChatInterface } from './ChatInterface';
import { AIGatewayModal } from './AIGatewayModal';
import { useFirstSession } from '@/hooks/useFirstSession';
import { useScrollTriggerModal } from '@/hooks/useScrollTriggerModal';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  Sparkles,
  Brain,
  Cpu,
  Network,
  Layers,
  Workflow,
  MessageSquare,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    id: 'gateway',
    icon: Network,
    title: 'AI Gateway',
    description: 'Multi-provider access through Vercel AI Gateway. Claude, GPT-4, Gemini unified.',
    color: 'purple',
    badge: 'Active',
  },
  {
    id: 'streaming',
    icon: Workflow,
    title: 'Streaming Chat',
    description: 'Real-time token streaming with AI SDK 6. Watch models reason live.',
    color: 'blue',
    badge: 'Live',
  },
  {
    id: 'prompts',
    icon: MessageSquare,
    title: 'Prompt Patterns',
    description: 'Chain-of-thought, tree-of-thought, and context continuation techniques.',
    color: 'emerald',
    badge: 'Library',
  },
  {
    id: 'rag',
    icon: Layers,
    title: 'RAG Architecture',
    description: 'Retrieval-augmented generation with vector embeddings and semantic search.',
    color: 'amber',
    badge: 'Coming Soon',
  },
  {
    id: 'agents',
    icon: Cpu,
    title: 'AI Agents',
    description: 'Autonomous task execution with tool-use and multi-step reasoning.',
    color: 'rose',
    badge: 'Beta',
  },
  {
    id: 'cognitive',
    icon: Brain,
    title: 'Cognitive Systems',
    description: 'Cross-domain reasoning patterns and metacognitive frameworks.',
    color: 'cyan',
    badge: 'Research',
  },
];

const colorMap = {
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
  rose: { bg: 'bg-rose-500/20', border: 'border-rose-500/30', text: 'text-rose-400' },
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400' },
};

export function AIToolsHub() {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);

  // First session modal logic
  const { isFirstSession, shouldShowModal, triggerModal, dismissModal } = useFirstSession();

  // Trigger modal when scrolling to this section (first session only)
  useScrollTriggerModal({
    targetRef: sectionRef,
    onTrigger: triggerModal,
    enabled: isFirstSession,
    triggerPosition: 'top 70%',
  });

  // Card reveal animations
  useGSAP(() => {
    const cards = gsap.utils.toArray('.hub-card');

    gsap.set(cards, { opacity: 0, y: 60, scale: 0.95 });

    ScrollTrigger.batch(cards, {
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          overwrite: true,
        });
      },
      start: 'top 85%',
      once: true,
    });
  }, { scope: sectionRef });

  return (
    <>
      {/* First Session Modal */}
      <AIGatewayModal open={shouldShowModal} onOpenChange={dismissModal} />

      <section
        ref={sectionRef}
        id="ai-tools-hub"
        className="relative min-h-screen bg-black text-white py-32 px-6 z-40"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">
                Powered by Vercel AI Gateway
              </span>
            </div>
            <h2 className="font-syne text-4xl md:text-6xl font-bold mb-6 lowercase">
              ai tools hub
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
              A unified interface for exploring AI capabilities. Access multiple models,
              experiment with prompt engineering, and build cognitive architectures.
            </p>
          </div>

          {/* Feature Grid */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => {
              const colors = colorMap[feature.color];
              const Icon = feature.icon;

              return (
                <div
                  key={feature.id}
                  className={cn(
                    "hub-card group relative p-6 border border-white/10 bg-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer",
                    feature.id === 'gateway' && "ring-1 ring-purple-500/30"
                  )}
                  onClick={() => feature.id === 'gateway' && setChatOpen(true)}
                >
                  {/* Hover gradient */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                      `bg-gradient-to-tr from-${feature.color}-500/10 to-transparent`
                    )}
                  />

                  {/* Arrow indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-5 h-5 text-white/50" />
                  </div>

                  {/* Icon */}
                  <div className={cn("h-12 w-12 mb-4 rounded-xl flex items-center justify-center border", colors.bg, colors.border)}>
                    <Icon className={cn("w-6 h-6", colors.text)} />
                  </div>

                  {/* Content */}
                  <h3 className="font-syne text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Badge */}
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-mono uppercase tracking-widest px-2 py-1 rounded border",
                      feature.badge === 'Active' || feature.badge === 'Live'
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                        : feature.badge === 'Beta'
                        ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                        : 'border-white/10 text-white/30'
                    )}>
                      {feature.badge}
                    </span>
                    {feature.id === 'gateway' && (
                      <span className="text-xs text-purple-400 font-mono">Click to chat →</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expandable Chat Panel */}
          <div
            className={cn(
              "fixed inset-y-0 right-0 w-full md:w-[480px] bg-black/95 backdrop-blur-xl border-l border-white/10 z-50 transform transition-transform duration-500 ease-out",
              chatOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-syne font-bold">AI Gateway Chat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChatOpen(false)}
                  className="hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatInterface className="h-full border-0 rounded-none" />
              </div>
            </div>
          </div>

          {/* Overlay when chat is open */}
          {chatOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setChatOpen(false)}
            />
          )}

          {/* Recommendations Section */}
          <div className="mt-20 p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
            <h3 className="font-syne text-2xl font-bold mb-4 lowercase">recommended integrations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-mono text-sm text-purple-400 uppercase tracking-wider">AI Gateway Extensions</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span><strong className="text-white/80">Vercel KV</strong> — Session persistence & rate limiting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span><strong className="text-white/80">Vercel Blob</strong> — File uploads for multimodal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span><strong className="text-white/80">Vercel Analytics</strong> — Usage tracking & costs</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-mono text-sm text-emerald-400 uppercase tracking-wider">Agent Capabilities</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span><strong className="text-white/80">AI SDK Tools</strong> — Function calling & tool use</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span><strong className="text-white/80">ToolLoopAgent</strong> — Multi-step task execution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span><strong className="text-white/80">Human-in-the-Loop</strong> — Approval workflows</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
