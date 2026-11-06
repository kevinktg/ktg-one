"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 right-0 z-[9999] p-6 flex justify-end items-start pointer-events-none">
      <nav aria-label="Main Navigation" className="pointer-events-auto flex items-center gap-4">

        {/* Home Link with dynamic animated underline trail */}
        <Button
          variant="ghost"
          asChild
          className="group relative overflow-hidden text-white/60 hover:text-white tracking-widest text-xs cursor-pointer px-3 py-2 transition-colors duration-1000 ease-out"
        >
          <Link href="/">
            <span className="relative z-10 transition-transform duration-1000 ease-out group-hover:scale-105 motion-reduce:transform-none">
              home
            </span>
            {/* Animated underline indicator: duration >= 1.0s, transform/opacity only */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[2px] w-full bg-white/70 origin-left scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 transition-all duration-1000 ease-out motion-reduce:transition-none"
            />
          </Link>
        </Button>

        {/* Insights Pill Button with animated border/glow and pulse */}
        <Button
          variant="outline"
          asChild
          className="group relative overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all duration-1000 ease-out font-syne tracking-widest text-xs h-9 px-4 rounded-full font-bold shadow-[0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] motion-reduce:transition-none"
        >
          <Link href="/blog">
            {/* Ambient subtle backdrop highlight on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out pointer-events-none motion-reduce:transition-none"
            />
            <span className="relative z-10 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse motion-reduce:animate-none" />
              <span className="transition-transform duration-1000 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none">
                insights
              </span>
            </span>
            {/* Subtle animated border trail at bottom */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-emerald-400/80 scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 transition-all duration-1000 ease-out motion-reduce:transition-none"
            />
          </Link>
        </Button>

        {/* Hub Pill Button with subtle glow and expanding border indicator */}
        <Button
          variant="outline"
          asChild
          className="group relative overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all duration-1000 ease-out font-syne tracking-widest text-xs h-9 px-4 rounded-full font-bold shadow-[0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] motion-reduce:transition-none"
        >
          <Link href="/hub/snippets">
            {/* Ambient subtle backdrop highlight on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out pointer-events-none motion-reduce:transition-none"
            />
            <span className="relative z-10 transition-transform duration-1000 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none">
              hub
            </span>
            {/* Subtle animated border trail at bottom */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-white/70 scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 transition-all duration-1000 ease-out motion-reduce:transition-none"
            />
          </Link>
        </Button>

      </nav>
    </header>
  );
}
