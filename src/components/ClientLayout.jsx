"use client";

import { ReactLenis } from "@/libs/lenis";

export function ClientLayout({ children }) {
  return (
    <ReactLenis root>
      <div className="relative min-h-screen">
        {children}
      </div>
    </ReactLenis>
  );
}
