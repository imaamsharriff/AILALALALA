import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { useIsTouch } from '../hooks/useMediaQuery.js'
import './CursorTrail.css'

const TRAIL_CHARS = ['✨', '💕', '🎀', '💫', '🌸']
const POOL_SIZE = 16
const MIN_GAP_MS = 70
const MIN_DISTANCE = 26

/**
 * Tiny sparkles that trail the cursor on desktop.
 *
 * Written with a fixed pool of recycled DOM nodes mutated directly (no React
 * state per pointermove) so it stays cheap — and it renders nothing at all on
 * touch devices or when reduced motion is requested.
 */
export default function CursorTrail() {
  const layerRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouch()
  const disabled = reducedMotion || isTouch

  useEffect(() => {
    if (disabled) return undefined
    const layer = layerRef.current
    if (!layer) return undefined

    const pool = Array.from({ length: POOL_SIZE }, () => {
      const node = document.createElement('span')
      node.className = 'cursor-trail__bit'
      layer.appendChild(node)
      return node
    })

    let cursor = 0
    let lastTime = 0
    let lastX = 0
    let lastY = 0

    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      const now = performance.now()
      const dx = event.clientX - lastX
      const dy = event.clientY - lastY
      if (now - lastTime < MIN_GAP_MS) return
      if (Math.hypot(dx, dy) < MIN_DISTANCE) return

      lastTime = now
      lastX = event.clientX
      lastY = event.clientY

      const node = pool[cursor]
      cursor = (cursor + 1) % POOL_SIZE

      node.textContent = TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)]
      node.style.left = `${event.clientX}px`
      node.style.top = `${event.clientY}px`
      node.style.setProperty('--drift', `${-24 + Math.random() * 48}px`)
      node.style.setProperty('--spin', `${-90 + Math.random() * 180}deg`)
      node.style.setProperty('--scale', (0.65 + Math.random() * 0.6).toFixed(2))

      // restart the CSS animation on a recycled node
      node.classList.remove('is-live')
      void node.offsetWidth
      node.classList.add('is-live')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      pool.forEach((node) => node.remove())
    }
  }, [disabled])

  if (disabled) return null
  return <div className="cursor-trail" ref={layerRef} aria-hidden="true" />
}
