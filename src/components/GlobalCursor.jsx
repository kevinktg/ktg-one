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
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    let rafId;

    // ⚡ Bolt Performance Optimization: Event-driven requestAnimationFrame
    // Previously, this cursor used a continuous, infinite requestAnimationFrame loop
    // which consumed idle CPU/GPU cycles even when the mouse was not moving.
    // By refactoring to an event-driven model (triggering RAF only on 'mousemove'),
    // we eliminate redundant processing, saving battery life and reducing main thread load.
    const handleMouseMove = (e) => {
      // Optimization: Mutate existing object to avoid GC churn
      positionRef.current.x = e.clientX;
      positionRef.current.y = e.clientY;

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        // Apply position updates to DOM elements in the next animation frame
        if (cursor) {
          cursor.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`;
        }

        // ⚡ Bolt Optimization: Using CSS transition for the follower smoothness
        // instead of continuous JavaScript lerping within a render loop
        if (follower) {
           follower.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
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
