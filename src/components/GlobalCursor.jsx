"use client";

import { useEffect, useRef } from 'react';

/**
 * GlobalCursor - Context-aware cursor system
 * - Visible everywhere (user requested)
 */
export function GlobalCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const followerPositionRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    // Mouse move handler
    const handleMouseMove = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
    };

    // Animation loop for smooth follower movement
    const animate = () => {
      // Update main cursor position immediately
      if (cursor) {
        cursor.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Update follower with smooth transition
      const dx = positionRef.current.x - followerPositionRef.current.x;
      const dy = positionRef.current.y - followerPositionRef.current.y;

      followerPositionRef.current.x += dx * 0.15;
      followerPositionRef.current.y += dy * 0.15;

      if (follower) {
        follower.style.transform = `translate3d(${followerPositionRef.current.x}px, ${followerPositionRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove);

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          pointerEvents: 'none',
          willChange: 'transform'
        }}
        aria-hidden="true"
      />

      {/* Follower cursor */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference opacity-70"
        style={{
          pointerEvents: 'none',
          willChange: 'transform'
        }}
        aria-hidden="true"
      />
    </>
  );
}
