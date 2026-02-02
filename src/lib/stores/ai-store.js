import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// AI Tools Hub state management
export const useAIStore = create(
  persist(
    (set, get) => ({
      // First session tracking for scroll-triggered modal
      hasSeenIntro: false,
      setHasSeenIntro: (value) => set({ hasSeenIntro: value }),

      // Chat state
      isOpen: false,
      setIsOpen: (value) => set({ isOpen: value }),

      // Selected model for AI Gateway
      selectedModel: 'anthropic/claude-sonnet-4',
      setSelectedModel: (model) => set({ selectedModel: model }),

      // Available models (populated from API)
      availableModels: [],
      setAvailableModels: (models) => set({ availableModels: models }),

      // Chat history (persisted locally)
      messages: [],
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, { ...message, timestamp: Date.now() }],
        })),
      clearMessages: () => set({ messages: [] }),

      // Hub section visibility
      hubRevealed: false,
      setHubRevealed: (value) => set({ hubRevealed: value }),

      // Feature flags
      features: {
        streaming: true,
        multiModel: true,
        agentMode: false,
      },
      toggleFeature: (feature) =>
        set((state) => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature],
          },
        })),
    }),
    {
      name: 'ktg-ai-hub',
      partialize: (state) => ({
        hasSeenIntro: state.hasSeenIntro,
        selectedModel: state.selectedModel,
        messages: state.messages.slice(-50), // Keep last 50 messages
      }),
    }
  )
);

// Selector hooks for optimized re-renders
export const useHasSeenIntro = () => useAIStore((state) => state.hasSeenIntro);
export const useIsModalOpen = () => useAIStore((state) => state.isOpen);
export const useSelectedModel = () => useAIStore((state) => state.selectedModel);
export const useMessages = () => useAIStore((state) => state.messages);
