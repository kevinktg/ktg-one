"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowUpRight, Terminal, Database, Cpu } from "lucide-react";
import { useRef } from "react";

export default function HubPage() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Simple fade-in for dashboard elements
    gsap.from(".dashboard-item", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white font-inter selection:bg-white selection:text-black">

      {/* Top Navigation / Status Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/10 bg-black/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-syne font-bold text-xl tracking-tighter hover:text-white/70 transition-colors">
            .ktg
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="font-mono text-xs text-white/50 tracking-widest uppercase">
            System Hub // v1.0
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-emerald-500">Operational</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto">

        {/* Welcome Section */}
        <div className="mb-12 dashboard-item">
          <h1 className="font-syne text-4xl md:text-6xl font-bold mb-4 lowercase">
            command_center
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Centralized interface for generative workflows, retrieval architectures, and experimental models.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Main Tool: AI Playground (Span 8) */}
          <div className="md:col-span-8 dashboard-item group relative h-[500px] border border-white/10 rounded-2xl bg-white/5 overflow-hidden hover:border-white/20 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-50" />

            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <Terminal className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-syne text-2xl font-bold">Inference Engine</h2>
                    <p className="text-xs font-mono text-white/40 mt-1">OPENAI // VERCEL AI SDK</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded border border-white/10 text-xs font-mono text-white/50">
                  Ready
                </div>
              </div>

              {/* Chat Interface Placeholder */}
              <div className="flex-1 bg-black/40 rounded-xl border border-white/10 p-6 font-mono text-sm text-white/70 overflow-hidden relative">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <span className="text-purple-400 font-bold shrink-0">SYS&gt;</span>
                    <p>Initializing connection to vector database...</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-purple-400 font-bold shrink-0">SYS&gt;</span>
                    <p>Loading context window (128k tokens)...</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-green-400 font-bold shrink-0">USR&gt;</span>
                    <p className="animate-pulse">_</p>
                  </div>
                </div>

                {/* Overlay Input */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 border-t border-white/10 backdrop-blur">
                  <div className="flex items-center gap-2 text-white/30">
                    <span>$</span>
                    <span className="text-white/20">Enter prompt execution...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel: Metrics & Quick Actions (Span 4) */}
          <div className="md:col-span-4 space-y-6">

            {/* RAG Status */}
            <div className="dashboard-item p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-blue-400" />
                <h3 className="font-syne font-bold text-lg">Knowledge Base</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Vectors Indexed</span>
                  <span className="font-mono">14,205</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Last Sync</span>
                  <span className="font-mono text-emerald-400">2m ago</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-blue-500 w-[85%]" />
                </div>
              </div>
            </div>

            {/* System Resources */}
            <div className="dashboard-item p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h3 className="font-syne font-bold text-lg">Compute Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded bg-black/20 border border-white/5">
                  <div className="text-xs text-white/40 mb-1">LATENCY</div>
                  <div className="text-xl font-mono font-bold">45ms</div>
                </div>
                <div className="p-3 rounded bg-black/20 border border-white/5">
                  <div className="text-xs text-white/40 mb-1">TOKENS/S</div>
                  <div className="text-xl font-mono font-bold">120</div>
                </div>
              </div>
            </div>

            {/* Quick Action: New Experiment */}
            <button className="dashboard-item w-full py-4 border border-dashed border-white/20 rounded-2xl text-white/40 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all flex items-center justify-center gap-2 group">
              <span className="group-hover:rotate-90 transition-transform duration-300">+</span>
              <span className="font-mono uppercase tracking-wider text-sm">New Experiment</span>
            </button>

          </div>

        </div>
      </main>
    </div>
  );
}
