"use client";

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAIStore } from '@/lib/stores/ai-store';
import { Sparkles, Zap, Brain, ArrowRight } from 'lucide-react';

export function AIGatewayModal({ open, onOpenChange }) {
  const setIsOpen = useAIStore((state) => state.setIsOpen);
  const contentRef = useRef(null);

  useGSAP(() => {
    if (open && contentRef.current) {
      const features = contentRef.current.querySelectorAll('.feature-item');
      gsap.fromTo(
        features,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.2,
        }
      );
    }
  }, { dependencies: [open] });

  const handleExplore = () => {
    onOpenChange(false);
    setIsOpen(true);
    // Smooth scroll to AI Hub
    const hubSection = document.getElementById('ai-tools-hub');
    if (hubSection) {
      window.lenis?.scrollTo(hubSection, { duration: 1.2 });
    }
  };

  const handleDismiss = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl border-purple-500/20 bg-gradient-to-br from-black via-black to-purple-950/20">
        <div ref={contentRef}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <DialogTitle className="text-2xl lowercase">
                welcome to the ai tools hub
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/60 text-base">
              A unified gateway to multiple AI providers. Experiment with different models,
              explore prompt engineering techniques, and build cognitive architectures.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="feature-item flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-syne font-semibold text-white mb-1">Multi-Provider Gateway</h4>
                <p className="text-sm text-white/50">
                  Access Claude, GPT-4, Gemini, and more through a single unified API.
                  No API key management required.
                </p>
              </div>
            </div>

            <div className="feature-item flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-syne font-semibold text-white mb-1">Streaming Responses</h4>
                <p className="text-sm text-white/50">
                  Real-time token streaming with the Vercel AI SDK.
                  Watch models think in real-time.
                </p>
              </div>
            </div>

            <div className="feature-item flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-syne font-semibold text-white mb-1">Agent Capabilities</h4>
                <p className="text-sm text-white/50">
                  Tool-use, multi-step reasoning, and autonomous task execution.
                  Coming soon.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleExplore}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white border-0"
            >
              Explore AI Hub
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1 border-white/20 hover:bg-white/5"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-white/30 text-center mt-4">
            This intro only shows once. You can always access the AI Hub from the Laboratory section.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
