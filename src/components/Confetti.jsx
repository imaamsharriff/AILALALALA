import { useEffect, useRef } from 'react'
import { registerConfetti } from '../lib/confetti.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

const CONFETTI_COLORS = [
  '#ff5fa2',
  '#ffb3d3',
  '#ffffff',
  '#ded0ff',
  '#fff0c2',
  '#cdeaff',
  '#c9f4e2',
  '#ef2f80',
]

const MAX_PARTICLES = 320 // hard cap keeps the canvas cheap on phones

/**
 * A single full-viewport canvas that draws every confetti / heart burst.
 * Uses one RAF loop that stops itself the moment the particle list empties,
 * so an idle page does zero per-frame work.
 */
export default function Confetti() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(0)
  const reducedMotion = useReducedMotion()
  const reducedRef = useRef(reducedMotion)
  reducedRef.current = reducedMotion

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let width = 0
    let height = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const step = () => {
      const particles = particlesRef.current
      ctx.clearRect(0, 0, width, height)

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]
        p.life += 1
        p.vy += p.gravity
        p.vx *= p.drag
        p.vy *= p.drag
        p.x += p.vx + Math.sin((p.life + p.seed) * 0.06) * p.sway
        p.y += p.vy
        p.rot += p.vr

        const fadeStart = p.ttl * 0.68
        p.alpha = p.life > fadeStart ? Math.max(0, 1 - (p.life - fadeStart) / (p.ttl - fadeStart)) : 1

        if (p.life > p.ttl || p.y > height + 80) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)

        if (p.char) {
          ctx.font = `${p.size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(p.char, 0, 0)
        } else {
          // little glossy paper rectangle, squashed over time to fake spin
          const squash = Math.abs(Math.cos((p.life + p.seed) * 0.14))
          ctx.fillStyle = p.color
          const w = p.size
          const h = p.size * 1.6 * (0.35 + squash * 0.65)
          ctx.beginPath()
          const r = Math.min(3, w / 2)
          ctx.roundRect ? ctx.roundRect(-w / 2, -h / 2, w, h, r) : ctx.rect(-w / 2, -h / 2, w, h)
          ctx.fill()
        }
        ctx.restore()
      }

      if (particles.length > 0) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        rafRef.current = 0
      }
    }

    const spawn = (options = {}) => {
      const reduced = reducedRef.current
      const {
        x = window.innerWidth / 2,
        y = window.innerHeight / 2,
        count = 40,
        power = 14,
        gravity = 0.28,
        emojis = ['💖', '✨', '🎀'],
        confettiRatio = 0.35,
        mode = 'burst',
        spread = Math.PI * 2,
        angle = -Math.PI / 2,
        scale = 1,
      } = options

      // Reduced motion still gets a *little* celebration — just calmer.
      const total = Math.round((reduced ? count * 0.3 : count) * (reduced ? 0.8 : 1))
      const particles = particlesRef.current

      for (let i = 0; i < total; i += 1) {
        if (particles.length >= MAX_PARTICLES) break

        const useConfetti = Math.random() < confettiRatio
        const speed = power * (0.45 + Math.random() * 0.85) * (reduced ? 0.5 : 1)
        let vx
        let vy
        let px = x
        let py = y

        if (mode === 'rain') {
          px = Math.random() * window.innerWidth
          py = -30 - Math.random() * window.innerHeight * 0.4
          vx = (Math.random() - 0.5) * 1.4
          vy = 1 + Math.random() * 2
        } else if (mode === 'fountain') {
          const a = angle + (Math.random() - 0.5) * spread
          vx = Math.cos(a) * speed
          vy = Math.sin(a) * speed - 4
        } else {
          const a = Math.random() * spread + (spread < Math.PI * 2 ? angle - spread / 2 : 0)
          vx = Math.cos(a) * speed
          vy = Math.sin(a) * speed
        }

        particles.push({
          x: px,
          y: py,
          vx,
          vy,
          gravity: mode === 'rain' ? gravity * 0.25 : gravity,
          drag: 0.985,
          sway: mode === 'rain' ? 0.9 : 0.35,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.22,
          size: (useConfetti ? 7 + Math.random() * 7 : 18 + Math.random() * 20) * scale,
          char: useConfetti ? null : emojis[Math.floor(Math.random() * emojis.length)],
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          life: 0,
          ttl: (mode === 'rain' ? 220 : 120) + Math.random() * 90,
          alpha: 1,
          seed: Math.random() * 100,
        })
      }

      if (!rafRef.current && particles.length > 0) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    const unregister = registerConfetti(spawn)

    return () => {
      unregister()
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      particlesRef.current = []
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 60,
      }}
    />
  )
}
