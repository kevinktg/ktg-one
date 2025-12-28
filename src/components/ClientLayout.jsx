"use client";

import { ReactLenis } from "@/libs/lenis";

export function ClientLayout({ children }) {
  return (
    <ReactLenis root>
      {children}
    </ReactLenis>
  );
}

