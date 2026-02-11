"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAIStore } from '@/lib/stores/ai-store';

// Hook to detect first session and trigger one-time modal
export function useFirstSession() {
  const hasSeenIntro = useAIStore((state) => state.hasSeenIntro);
  const setHasSeenIntro = useAIStore((state) => state.setHasSeenIntro);
  const [isFirstSession, setIsFirstSession] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);

  useEffect(() => {
    // Check on mount if this is the first session
    if (!hasSeenIntro) {
      setIsFirstSession(true);
    }
  }, [hasSeenIntro]);

  const triggerModal = useCallback(() => {
    if (isFirstSession && !shouldShowModal) {
      setShouldShowModal(true);
    }
  }, [isFirstSession, shouldShowModal]);

  const dismissModal = useCallback(() => {
    setShouldShowModal(false);
    setHasSeenIntro(true);
    setIsFirstSession(false);
  }, [setHasSeenIntro]);

  const resetFirstSession = useCallback(() => {
    // For testing: reset the first session flag
    setHasSeenIntro(false);
    setIsFirstSession(true);
  }, [setHasSeenIntro]);

  return {
    isFirstSession,
    shouldShowModal,
    triggerModal,
    dismissModal,
    resetFirstSession,
  };
}
