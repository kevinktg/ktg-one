'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useCursorPosition } from '@/hooks/useCursorPosition'

export function GeometricBackground({ fixed = false }) {
  const { cursorPos, isActive } = useCursorPosition()
  const containerRef = useRef(null)
  const gradientRef = useRef(null)
  const gridRef = useRef(null)
  const rafIdRef = useRef(null)
  
  // Throttle mask updates to 60fps max - reduce layout thrashing
  useEffect(() => {
    if (!gradientRef.current || !gridRef.current) return
    
    const updateMask = () => {
      if (isActive) {
        // Use CSS custom properties for better performance
        const maskValue = `radial-gradient(circle 600px at var(--cursor-x) var(--cursor-y), white 0%, white 35%, transparent 75%)`
        
        // Batch DOM updates
        if (gradientRef.current) {
          gradientRef.current.style.maskImage = maskValue
          gradientRef.current.style.WebkitMaskImage = maskValue
        }
        if (gridRef.current) {
          gridRef.current.style.maskImage = maskValue
          gridRef.current.style.WebkitMaskImage = maskValue
        }
      } else {
        // No mask when cursor inactive
        if (gradientRef.current) {
          gradientRef.current.style.maskImage = 'none'
          gradientRef.current.style.WebkitMaskImage = 'none'
        }
        if (gridRef.current) {
          gridRef.current.style.maskImage = 'none'
          gridRef.current.style.WebkitMaskImage = 'none'
        }
      }
    }
    
    // Cancel any pending updates
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }
    
    // Schedule update on next frame
    rafIdRef.current = requestAnimationFrame(updateMask)
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [isActive, cursorPos.x, cursorPos.y])
  
  return (
    <>
      <div 
        ref={containerRef}
        className={`${fixed ? 'fixed' : 'absolute'} inset-0 pointer-events-none z-[-1] overflow-hidden bg-black`} 
        aria-hidden="true"
        style={{
          '--cursor-x': `${cursorPos.x}%`,
          '--cursor-y': `${cursorPos.y}%`,
        }}
      >
        {/* Faint gradient glow - revealed at cursor position via mask */}
        <div 
          ref={gradientRef}
          className="absolute inset-0 will-change-[mask-image]"
          style={{
            background: `radial-gradient(circle 800px at var(--cursor-x) var(--cursor-y), rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%, transparent 100%)`,
            opacity: 1,
            contain: 'layout style paint',
          }}
        />
        
        {/* Grid pattern overlay - revealed at cursor position via mask */}
        <div 
          ref={gridRef}
          className="absolute inset-0 will-change-[mask-image]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 1,
            contain: 'layout style paint',
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

        {/* Diagonal lines */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_11px)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_11px)]" />
      </div>
    </>
  );
}
