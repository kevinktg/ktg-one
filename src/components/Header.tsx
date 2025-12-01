"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo - Typography using Syne */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <span className="font-syne text-2xl md:text-3xl font-bold tracking-tight lowercase">
            Go
          </span>
        </Link>

        {/* Navigation - optional for future */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Add nav items later if needed */}
        </nav>
      </div>
    </header>
  );
}

