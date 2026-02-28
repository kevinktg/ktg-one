import Link from "next/link";
import { ArrowUpRight, Code2, MessageSquare, Cpu, Sparkles } from "lucide-react";

const tools = [
  {
    title: "KTG Snippets",
    description: "Browse KTG v30 framework techniques, gates, and protocols. Prompt engineering patterns extracted from battle-tested methodology.",
    href: "/hub/snippets",
    icon: Code2,
    accent: "emerald",
    tag: "Knowledge Base",
    number: "01",
  },
  {
    title: "AI Playground",
    description: "Multi-model streaming chat powered by Vercel AI Gateway. Switch between Claude, GPT, Gemini, Grok, and 100+ models instantly.",
    href: "/hub/playground",
    icon: MessageSquare,
    accent: "purple",
    tag: "Interactive",
    number: "02",
  },
  {
    title: "Model Explorer",
    description: "Browse available AI models with real-time pricing, capabilities, and provider information. Compare before you build.",
    href: "/hub/models",
    icon: Cpu,
    accent: "blue",
    tag: "Reference",
    number: "03",
  },
  {
    title: "OneChat",
    description: "Agent-powered chat with hidden prompt technique injection. Glow buttons, system prompt presets, session management.",
    href: "/hub/chat",
    icon: Sparkles,
    accent: "cyan",
    tag: "Agent Chat",
    number: "04",
  },
];

const accentMap = {
  emerald: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
  },
  purple: {
    bg: "bg-purple-500/20",
    border: "border-purple-500/30",
    text: "text-purple-400",
  },
  blue: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
  cyan: {
    bg: "bg-[#00f0ff]/20",
    border: "border-[#00f0ff]/30",
    text: "text-[#00f0ff]",
  },
};

export default function HubPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-48 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h1 className="font-syne text-5xl md:text-7xl font-bold mb-6 lowercase">
            laboratory
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
            AI tool hub. Techniques, experiments, and architectural patterns.
            <br />
            Powered by Vercel AI Gateway.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const colors = accentMap[tool.accent];
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative p-8 border border-white/10 bg-white/5 rounded-2xl overflow-hidden hover:border-white/30 transition-colors duration-300"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="w-5 h-5 text-white/50" />
                </div>

                <div className={`h-12 w-12 mb-6 rounded-full ${colors.bg} flex items-center justify-center border ${colors.border}`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>

                <h2 className="font-syne text-2xl font-bold mb-3">{tool.title}</h2>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {tool.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs font-mono text-white/30 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
                    {tool.tag}
                  </span>
                  <span className={`font-mono text-sm ${colors.text} opacity-50`}>
                    {tool.number}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Gateway Badge */}
        <div className="mt-16 flex items-center gap-3 text-white/30">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest">
            Vercel AI Gateway — 100+ models, 20+ providers
          </span>
        </div>
      </div>
    </div>
  );
}
