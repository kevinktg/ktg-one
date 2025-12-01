"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative block hover:opacity-80 transition-opacity">
          <Image
            src="/assets/ktg-Logo.svg"
            alt="KTG Logo"
            width={60}
            height={60}
            className="w-12 h-12 md:w-16 md:h-16"
            priority
          />
        </Link>

        {/* Navigation - optional for future */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Add nav items later if needed */}
        </nav>
      </div>
    </header>
  );
}

