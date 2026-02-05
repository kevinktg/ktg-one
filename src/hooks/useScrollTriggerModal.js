"use client";

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Hook to trigger modal when scrolling to AI Hub section (first session only)
export function useScrollTriggerModal({
  targetRef,
  onTrigger,
  enabled = true,
  triggerPosition = 'top 60%'
}) {
  const hasTriggered = useRef(false);

  useGSAP(() => {
    if (!enabled || !targetRef.current || hasTriggered.current) return;

    const trigger = ScrollTrigger.create({
      trigger: targetRef.current,
      start: triggerPosition,
      onEnter: () => {
        if (!hasTriggered.current && enabled) {
          hasTriggered.current = true;
          onTrigger?.();
        }
      },
      once: true,
    });

    return () => {
      trigger.kill();
    };
  }, { dependencies: [enabled, onTrigger] });

  // Reset for testing
  const reset = () => {
    hasTriggered.current = false;
  };

  return { reset };
}
