/* ============================================================
   confetti.js — imperative bridge to the single <Confetti /> canvas.

   Any component can call fireConfetti(...) without prop-drilling a ref.
   If the canvas isn't mounted (or has unmounted) the call is a no-op.
   ============================================================ */

let handler = null

export function registerConfetti(fn) {
  handler = fn
  return () => {
    if (handler === fn) handler = null
  }
}

export function fireConfetti(options = {}) {
  if (typeof handler === 'function') handler(options)
}

/** Fire a burst centred on a DOM element (used for button clicks). */
export function fireFromElement(el, options = {}) {
  if (!el || typeof el.getBoundingClientRect !== 'function') {
    fireConfetti(options)
    return
  }
  const r = el.getBoundingClientRect()
  fireConfetti({ ...options, x: r.left + r.width / 2, y: r.top + r.height / 2 })
}

/* -------- reusable presets, so the "party vocabulary" stays consistent ---- */

export const PRESETS = {
  hearts: {
    emojis: ['💕', '💖', '💗', '❤️', '🩷'],
    count: 34,
    power: 12,
    gravity: 0.24,
  },
  party: {
    emojis: ['🎀', '💖', '✨', '🌸', '⭐', '🐱', '🎂', '💫'],
    count: 60,
    power: 16,
    gravity: 0.3,
    confettiRatio: 0.5,
  },
  sparkles: {
    emojis: ['✨', '⭐', '💫', '🌟'],
    count: 24,
    power: 10,
    gravity: 0.1,
  },
  bows: {
    emojis: ['🎀', '🎀', '💗', '🌸'],
    count: 30,
    power: 14,
    gravity: 0.28,
  },
}
