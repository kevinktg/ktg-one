'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export function CursorDot() {
  const containerRef = useRef(null)
  const dotsRef = useRef([])
  
  // Configuration: How many dots and how fast they follow
  const DOT_COUNT = 12
  const LAG_FACTOR = 0.2 // Lower = slower/floatier, Higher = tighter
  
  useGSAP(() => {
    // 1. Initial Setup: Hide all dots initially
    gsap.set(dotsRef.current, { 
      xPercent: -50, 
      yPercent: -50,
      opacity: 0,
      scale: 0 
    })

    // 2. State to track mouse and dot positions
    const mouse = { x: 0, y: 0 }
    const dots = dotsRef.current.map(() => ({ x: 0, y: 0 }))
    let isMoving = false
    let timeoutId = null

    // 3. The Animation Loop (Runs 60-120fps via GSAP Ticker)
    const render = () => {
      // Calculate position for the first dot (Leader)
      // We linearly interpolate (lerp) towards the mouse for smoothness
      dots[0].x += (mouse.x - dots[0].x) * 0.5
      dots[0].y += (mouse.y - dots[0].y) * 0.5

      // Move the Leader Dot
      gsap.set(dotsRef.current[0], { x: dots[0].x, y: dots[0].y })

      // Calculate positions for the followers (The Tail)
      for (let i = 1; i < DOT_COUNT; i++) {
        const prev = dots[i - 1]
        const curr = dots[i]
        
        // Follow the previous dot with lag
        curr.x += (prev.x - curr.x) * LAG_FACTOR
        curr.y += (prev.y - curr.y) * LAG_FACTOR

        // Apply movement
        gsap.set(dotsRef.current[i], { x: curr.x, y: curr.y })
      }
    }

    // 4. Mouse Event Listeners
    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      
      // Wake up the loop if it was idle
      if (!isMoving) {
        gsap.ticker.add(render)
        isMoving = true
        // Fade in dots
        gsap.to(dotsRef.current, { 
          opacity: (i) => 1 - (i / DOT_COUNT), // Head is bright, tail fades
          scale: (i) => 1 - (i / DOT_COUNT) * 0.5, // Tail shrinks
          duration: 0.3 
        })
      }

      // Hide trail when mouse stops moving for a bit
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        gsap.ticker.remove(render)
        isMoving = false
        gsap.to(dotsRef.current, { opacity: 0, scale: 0, duration: 0.5 })
      }, 2000) // Keep visible for 2s after stop
    }

    window.addEventListener('mousemove', onMouseMove)
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      gsap.ticker.remove(render)
      clearTimeout(timeoutId)
    }
  }, { scope: containerRef })

  return (
    <div 
      ref={containerRef} 
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {[...Array(DOT_COUNT)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (dotsRef.current[i] = el)}
          className="absolute w-3 h-3 bg-white rounded-full mix-blend-difference will-change-transform"
          style={{ 
            opacity: 0, // Handled by GSAP
            // Use 'mix-blend-difference' to invert colors over white backgrounds, 
            // making it visible everywhere.
          }}
        />
      ))}
    </div>
  )
}