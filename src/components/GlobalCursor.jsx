"use client";

import { useEffect, useRef } from 'react';

export function GlobalCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const followerPositionRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    // Mouse move handler
    const handleMouseMove = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
    };

    // Animation loop for smooth follower movement
    const animate = () => {
      // Update main cursor position immediately
      if (cursor) {
        cursor.style.left = `${positionRef.current.x}px`;
        cursor.style.top = `${positionRef.current.y}px`;
      }

      // Update follower with smooth transition
      const dx = positionRef.current.x - followerPositionRef.current.x;
      const dy = positionRef.current.y - followerPositionRef.current.y;
      
      followerPositionRef.current.x += dx * 0.2;
      followerPositionRef.current.y += dy * 0.2;

      if (follower) {
        follower.style.left = `${followerPositionRef.current.x}px`;
        follower.style.top = `${followerPositionRef.current.y}px`;
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
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Follower cursor */}
      <div
        ref={followerRef}
        className="fixed w-6 h-6 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference opacity-70"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}