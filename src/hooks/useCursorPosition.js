'use client'

import { useEffect, useState, useRef } from 'react'

// Shared cursor position hook - single source of truth
// All components use this to avoid multiple event listeners
export function useCursorPosition() {
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 })
  const [isActive, setIsActive] = useState(false) // Start as false - only true after cursor movement
  const rafIdRef = useRef(null)
  const latestEventRef = useRef(null)
  
  useEffect(() => {
    const handlePointerMove = (e) => {
      latestEventRef.current = e
      
      // Only queue one RAF update per frame
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          if (latestEventRef.current) {
            const x = (latestEventRef.current.clientX / window.innerWidth) * 100
            const y = (latestEventRef.current.clientY / window.innerHeight) * 100
            
            setCursorPos({ x, y })
            setIsActive(true)
            latestEventRef.current = null
          }
          rafIdRef.current = null
        })
      }
    }
    
    const handlePointerLeave = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      setIsActive(false)
    }
    
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])
  
  return { cursorPos, isActive }
}

