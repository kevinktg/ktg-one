'use client'

import { useCursorPosition } from '@/hooks/useCursorPosition'

export function GeometricBackground({ fixed = false }) {
  const { cursorPos, isActive } = useCursorPosition()
  
  return (
    <div 
      className={`${fixed ? 'fixed' : 'absolute'} inset-0 pointer-events-none z-0 overflow-hidden`} 
      aria-hidden="true"
      style={{
        '--cursor-x': `${cursorPos.x}%`,
        '--cursor-y': `${cursorPos.y}%`,
      }}
    >
      {/* Faint gradient glow - reactive to cursor - using CSS variables for performance */}
      <div 
        className="absolute inset-0 will-change-[opacity]"
        style={{
          background: isActive
            ? `radial-gradient(circle 600px at var(--cursor-x) var(--cursor-y), rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 30%, transparent 70%)`
            : 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
          opacity: isActive ? 1 : 0.8,
          transition: 'opacity 0.2s ease-out'
        }}
      />
      
      {/* Grid pattern overlay - reactive to cursor - optimized with CSS variables */}
      <div 
        className="absolute inset-0 will-change-[opacity]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: isActive ? 0.6 : 1,
          maskImage: isActive 
            ? `radial-gradient(circle 500px at var(--cursor-x) var(--cursor-y), black 0%, black 40%, transparent 70%)`
            : 'none',
          WebkitMaskImage: isActive
            ? `radial-gradient(circle 500px at var(--cursor-x) var(--cursor-y), black 0%, black 40%, transparent 70%)`
            : 'none',
          transition: 'opacity 0.2s ease-out'
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-20 w-64 h-64 border-2 border-white/10 rotate-45" />
      <div className="absolute top-1/4 left-10 w-48 h-48 border-2 border-white/5" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white/10 rounded-full" />
      <div className="absolute bottom-20 left-20 w-56 h-56 border-2 border-white/5 rotate-12" />

      {/* Additional circles */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 border border-white/5 rounded-full" />
      <div className="absolute bottom-1/3 left-1/3 w-40 h-40 border-2 border-white/5 rounded-full" />
      <div className="absolute top-2/3 right-1/2 w-32 h-32 border border-white/5 rounded-full" />

      {/* Diagonal lines (Implemented via CSS gradient to remove external CSS dependency) */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_11px)]" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_11px)]" />
    </div>
  );
}