"use client";

import { useEffect, useRef } from 'react';

/**
 * GlobalCursor - Context-aware cursor system
 * - Visible everywhere
 * - Fixed size (small dot)
 */
export function GlobalCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    // Mouse move handler
    // OPTIMIZATION: Update transform directly on event, avoiding RAF loop when idle
    const handleMouseMove = (e) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      if (follower) {
         follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot - Explicit size */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: '8px',
          height: '8px',
          pointerEvents: 'none',
          willChange: 'transform'
        }}
        aria-hidden="true"
      />

      {/* Follower cursor - Explicit size */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference opacity-50"
        style={{
          width: '24px',
          height: '24px',
          pointerEvents: 'none',
          willChange: 'transform',
          transition: 'transform 0.1s ease-out' // CSS transition for smoothness instead of JS lerp
        }}
        aria-hidden="true"
      />
    </>
  );
}
