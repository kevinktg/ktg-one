'use client'

import { useRef, useEffect } from 'react'
import { useCursorPosition } from '@/hooks/useCursorPosition'

// Efficient 2D canvas blob effect for CSS masks
export function BlobCanvas({ onCanvasReady }) {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const blobHistoryRef = useRef([]) // Array of {x, y, time, radius}
  const { cursorPos, isActive } = useCursorPosition()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d', { alpha: true })
    
    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    const pointerRadius = 150 // pixels
    const fadeDuration = 2500 // ms
    
    const render = (currentTime) => {
      if (!canvas || !ctx) return
      
      const width = canvas.width
      const height = canvas.height
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Add new blob if cursor is active
      if (isActive) {
        blobHistoryRef.current.push({
          x: (cursorPos.x / 100) * width,
          y: (cursorPos.y / 100) * height,
          time: currentTime,
          radius: pointerRadius
        })
      }
      
      // Remove old blobs and draw current ones
      const now = currentTime
      blobHistoryRef.current = blobHistoryRef.current.filter(blob => {
        const age = now - blob.time
        if (age > fadeDuration) return false
        
        // Calculate fade based on age
        const fade = 1 - (age / fadeDuration)
        const currentRadius = blob.radius * fade
        
        // Draw blob with gradient
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, currentRadius
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${fade * 0.8})`)
        gradient.addColorStop(0.3, `rgba(255, 255, 255, ${fade * 0.4})`)
        gradient.addColorStop(0.6, `rgba(255, 255, 255, ${fade * 0.1})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()
        
        return true
      })
      
      animationFrameRef.current = requestAnimationFrame(render)
    }
    
    animationFrameRef.current = requestAnimationFrame(render)
    
    if (onCanvasReady) {
      onCanvasReady(canvas)
    }
    
    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [cursorPos, isActive, onCanvasReady])
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0,
        zIndex: -1
      }}
    />
  )
}
