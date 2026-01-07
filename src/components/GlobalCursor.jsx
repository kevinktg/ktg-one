"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * GlobalCursor - Context-aware cursor system
 * - Hidden on hero section (blob reveal takes over)
 * - Visible dot + follower on all other sections
 */
export function GlobalCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const followerPositionRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false); // Start hidden (hero first)

  // Improved Visibility Logic: Check scroll position rather than just intersection
  // This is more robust against "flashing" or stuck intersection observers
  useEffect(() => {
    const handleScroll = () => {
      // Hero section is approx 100vh. We show cursor once we scroll past 80% of it.
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      const shouldShow = scrollY > (viewportHeight * 0.8);

      if (shouldShow !== isVisible) {
        setIsVisible(shouldShow);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  // Animate cursor visibility changes
  useEffect(() => {
    if (!cursorRef.current || !followerRef.current) return;

    gsap.to([cursorRef.current, followerRef.current], {
      opacity: isVisible ? 1 : 0,
      scale: isVisible ? 1 : 0.5,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [isVisible]);

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
        cursor.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px) translate(-50%, -50%)`;
      }

      // Update follower with smooth transition
      const dx = positionRef.current.x - followerPositionRef.current.x;
      const dy = positionRef.current.y - followerPositionRef.current.y;

      followerPositionRef.current.x += dx * 0.15;
      followerPositionRef.current.y += dy * 0.15;

      if (follower) {
        follower.style.transform = `translate(${followerPositionRef.current.x}px, ${followerPositionRef.current.y}px) translate(-50%, -50%)`;
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
          opacity: 0, // Controlled by GSAP
        }}
        aria-hidden="true"
      />

      {/* Follower cursor */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference opacity-70"
        style={{
          opacity: 0, // Controlled by GSAP
        }}
        aria-hidden="true"
      />
    </>
  );
}
