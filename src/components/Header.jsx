"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 right-0 z-50 p-6 pointer-events-none">
      {/* Pointer events auto allows clicking the button, but lets you click through the header area */}
      <Link 
        href="/blog" 
        className="pointer-events-auto inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 group"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse" />
        <span className="font-mono text-xs font-bold text-white tracking-widest group-hover:text-emerald-400">
          INSIGHTS
        </span>
      </Link>
    </header>
  );
}