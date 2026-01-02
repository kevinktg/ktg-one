'use client'

import { useRef, useEffect } from 'react'
import { useCursorPosition } from '@/hooks/useCursorPosition'

// Efficient 2D canvas blob effect for CSS masks
export function BlobCanvas({ onCanvasReady }) {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const blobHistoryRef = useRef([]) // Array of {x, y, time, radius}
  const { cursorPos, isActive } = useCursorPosition()
  
  // Store cursor state in refs to avoid effect re-runs
  const cursorPosRef = useRef(cursorPos)
  const isActiveRef = useRef(isActive)
  
  // Update refs when cursor changes (doesn't trigger effect re-run)
  useEffect(() => {
    cursorPosRef.current = cursorPos
    isActiveRef.current = isActive
  }, [cursorPos, isActive])
  
  // Setup effect - runs once, reads from refs
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
    
    const pointerRadius = 200 // pixels - increased for better visibility
    const fadeDuration = 2500 // ms
    const blobThrottle = 30 // ms - reduced for more responsive effect
    let lastBlobTime = 0 // Start at 0 to force first blob immediately
    let lastBlobPos = { x: -1, y: -1 } // Initialize to invalid position to force first blob
    let hasCreatedFirstBlob = false // Track if we've created the initial blob
    
    const render = (currentTime) => {
      if (!canvas || !ctx) return
      
      const width = canvas.width
      const height = canvas.height
      
      // Clear canvas with black background (for mask: black = hidden, white = visible)
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fillRect(0, 0, width, height)
      
      // Read cursor state from refs (always current, no closure issues)
      const currentCursorPos = cursorPosRef.current
      const currentIsActive = isActiveRef.current
      
      // Always create blobs when cursor is active, less strict conditions
      if (currentIsActive) {
        const blobX = (currentCursorPos.x / 100) * width
        const blobY = (currentCursorPos.y / 100) * height
        
        // Check if this is the first blob or if enough time/distance has passed
        const isFirstBlob = !hasCreatedFirstBlob
        const timeSinceLastBlob = currentTime - lastBlobTime
        const distanceFromLastBlob = isFirstBlob
          ? 999 // Force first blob immediately
          : Math.sqrt(
              Math.pow(blobX - lastBlobPos.x, 2) + 
              Math.pow(blobY - lastBlobPos.y, 2)
            )
        
        // Add blob if: first blob OR (enough time passed AND moved enough)
        // Reduced distance threshold from 10px to 5px for more responsive effect
        if (isFirstBlob || (timeSinceLastBlob >= blobThrottle && distanceFromLastBlob >= 5)) {
          blobHistoryRef.current.push({
            x: blobX,
            y: blobY,
            time: currentTime,
            radius: pointerRadius
          })
          lastBlobTime = currentTime
          lastBlobPos = { x: blobX, y: blobY }
          if (isFirstBlob) {
            hasCreatedFirstBlob = true
          }
        }
      } else {
        // Reset position when cursor becomes inactive so next movement creates blob
        lastBlobPos = { x: -1, y: -1 }
        hasCreatedFirstBlob = false // Reset so next active state creates blob
      }
      
      // Remove old blobs and draw current ones
      const now = currentTime
      blobHistoryRef.current = blobHistoryRef.current.filter(blob => {
        const age = now - blob.time
        if (age > fadeDuration) return false
        
        // Calculate fade based on age
        const fade = 1 - (age / fadeDuration)
        const currentRadius = blob.radius * fade
        
        // Draw blob with gradient - white for mask visibility
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, currentRadius
        )
        // Use solid white in center, fade to transparent
        gradient.addColorStop(0, `rgba(255, 255, 255, ${fade})`)
        gradient.addColorStop(0.4, `rgba(255, 255, 255, ${fade * 0.6})`)
        gradient.addColorStop(0.7, `rgba(255, 255, 255, ${fade * 0.2})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()
        
        return true
      })
      
      animationFrameRef.current = requestAnimationFrame(render)
      
      // Call onCanvasReady after first frame renders
      if (onCanvasReady && !canvas.dataset.ready) {
        onCanvasReady(canvas)
        canvas.dataset.ready = 'true'
      }
    }
    
    // Start render loop
    animationFrameRef.current = requestAnimationFrame(render)
    
    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [onCanvasReady]) // Only re-run if onCanvasReady changes
  
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
