'use client'

import { useRef, useEffect, useState } from 'react'
import { useCursorPosition } from '@/hooks/useCursorPosition'
import { BlobCanvas } from '@/components/BlobCanvas'

export function GeometricBackground({ fixed = false }) {
  const { cursorPos, isActive } = useCursorPosition()
  const [blobCanvas, setBlobCanvas] = useState(null)
  const [blobMaskUrl, setBlobMaskUrl] = useState(null)
  const containerRef = useRef(null)
  const gradientRef = useRef(null)
  const gridRef = useRef(null)
  
  // Update mask URL when canvas updates (throttled for performance)
  useEffect(() => {
    if (!blobCanvas) {
      setBlobMaskUrl(null)
      return
    }
    
    let rafId = null
    let lastUpdate = 0
    const throttleMs = 100 // Update 10 times per second
    
    const updateMask = (currentTime) => {
      if (currentTime - lastUpdate < throttleMs) {
        rafId = requestAnimationFrame(updateMask)
        return
      }
      
      try {
        const dataUrl = blobCanvas.toDataURL('image/png')
        setBlobMaskUrl(dataUrl)
        lastUpdate = currentTime
      } catch (e) {
        // Silently handle errors
      }
      
      rafId = requestAnimationFrame(updateMask)
    }
    
    rafId = requestAnimationFrame(updateMask)
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [blobCanvas])
  
  // Apply mask styles via refs for better performance
  useEffect(() => {
    if (!gradientRef.current || !gridRef.current) return
    
    if (blobMaskUrl) {
      // Use blob canvas as mask - white areas reveal, black areas hide
      const maskValue = `url(${blobMaskUrl})`
      gradientRef.current.style.maskImage = maskValue
      gradientRef.current.style.WebkitMaskImage = maskValue
      gradientRef.current.style.maskSize = '100% 100%'
      gradientRef.current.style.WebkitMaskSize = '100% 100%'
      gradientRef.current.style.maskRepeat = 'no-repeat'
      gradientRef.current.style.WebkitMaskRepeat = 'no-repeat'
      
      gridRef.current.style.maskImage = maskValue
      gridRef.current.style.WebkitMaskImage = maskValue
      gridRef.current.style.maskSize = '100% 100%'
      gridRef.current.style.WebkitMaskSize = '100% 100%'
      gridRef.current.style.maskRepeat = 'no-repeat'
      gridRef.current.style.WebkitMaskRepeat = 'no-repeat'
    } else {
      // Fallback to CSS gradient mask
      if (isActive) {
        const gradientMask = `radial-gradient(circle 500px at var(--cursor-x) var(--cursor-y), black 0%, black 40%, transparent 70%)`
        gridRef.current.style.maskImage = gradientMask
        gridRef.current.style.WebkitMaskImage = gradientMask
      } else {
        gridRef.current.style.maskImage = 'none'
        gridRef.current.style.WebkitMaskImage = 'none'
      }
      gradientRef.current.style.maskImage = 'none'
      gradientRef.current.style.WebkitMaskImage = 'none'
    }
  }, [blobMaskUrl, isActive, cursorPos])
  
  return (
    <>
      {/* Blob canvas for mask effect */}
      <BlobCanvas onCanvasReady={setBlobCanvas} />
      
      <div 
        ref={containerRef}
        className={`${fixed ? 'fixed' : 'absolute'} inset-0 pointer-events-none z-0 overflow-hidden bg-black`} 
        aria-hidden="true"
        style={{
          '--cursor-x': `${cursorPos.x}%`,
          '--cursor-y': `${cursorPos.y}%`,
        }}
      >
        {/* Faint gradient glow - reactive to cursor - using CSS variables for performance */}
        <div 
          ref={gradientRef}
          className="absolute inset-0 will-change-[opacity]"
          style={{
            background: isActive
              ? `radial-gradient(circle 600px at var(--cursor-x) var(--cursor-y), rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 30%, transparent 70%)`
              : 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
            opacity: isActive ? 1 : 0.8,
            transition: 'opacity 0.2s ease-out',
          }}
        />
        
        {/* Grid pattern overlay - reactive to cursor - optimized with CSS variables */}
        <div 
          ref={gridRef}
          className="absolute inset-0 will-change-[opacity]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: isActive ? 0.8 : 1,
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
    </>
  );
}