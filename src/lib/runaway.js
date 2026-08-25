/* ============================================================
   runaway.js — pure geometry for the cowardly "AILA" button.

   Kept free of React/DOM so the rules are easy to reason about:
   given an area, the card size, where the pointer is and what to avoid,
   return a new spot that is inside the area, not on top of an obstacle,
   far from the pointer, and a decent jump from where it already was.
   ============================================================ */

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

/**
 * The card animates with `cubic-bezier(0.34, 1.56, 0.64, 1)`, a spring that
 * overshoots its target by ~9.8% of the travel distance before settling.
 * Keep this in sync with the transition in PrettyGame.css.
 */
export const SPRING_OVERSHOOT = 0.098

/**
 * Pull a target in just far enough that the *overshoot* also lands in bounds.
 *
 * The card peaks at `target + k * (target - from)`, so requiring that peak to
 * sit inside [min, max] means the target itself must sit inside
 * [(min + k·from) / (1 + k), (max + k·from) / (1 + k)].
 * Without this the spring pokes outside the arena and gets clipped.
 */
function clampWithOvershoot(target, from, min, max, k = SPRING_OVERSHOOT) {
  return clamp(target, (min + k * from) / (1 + k), (max + k * from) / (1 + k))
}

/** Do two {x,y,w,h} rects overlap (with optional padding)? */
export function rectsOverlap(a, b, pad = 0) {
  return (
    a.x < b.x + b.w + pad &&
    a.x + a.w + pad > b.x &&
    a.y < b.y + b.h + pad &&
    a.y + a.h + pad > b.y
  )
}

/** Distance from a point to the centre of a rect. */
function distanceToRectCenter(point, rect) {
  const cx = rect.x + rect.w / 2
  const cy = rect.y + rect.h / 2
  return Math.hypot(point.x - cx, point.y - cy)
}

/**
 * Pick the next hiding spot.
 *
 * @param {object}   opts
 * @param {{w:number,h:number}} opts.area      the arena size (px)
 * @param {{w:number,h:number}} opts.card      the button size (px)
 * @param {{x:number,y:number}} [opts.pointer] pointer position, arena-relative
 * @param {{x:number,y:number}} opts.current   current top-left of the button
 * @param {Array}    [opts.obstacles]          rects to not land on (e.g. the moon card)
 * @param {number}   [opts.padding]            keep this far from the arena edges
 * @param {number}   [opts.minJump]            minimum travel distance
 * @param {number}   [opts.samples]            how many candidates to try
 * @returns {{x:number, y:number}} arena-relative top-left for the button
 */
export function pickRunawaySpot({
  area,
  card,
  pointer = null,
  current,
  obstacles = [],
  padding = 10,
  minJump = 120,
  samples = 36,
}) {
  const maxX = Math.max(padding, area.w - card.w - padding)
  const maxY = Math.max(padding, area.h - card.h - padding)

  // Degenerate area (tiny screens): just clamp and bail out.
  if (maxX <= padding || maxY <= padding) {
    return { x: clamp(current.x, padding, maxX), y: clamp(current.y, padding, maxY) }
  }

  let best = null
  let bestScore = -Infinity

  for (let i = 0; i < samples; i += 1) {
    const x = padding + Math.random() * (maxX - padding)
    const y = padding + Math.random() * (maxY - padding)
    const candidate = { x, y, w: card.w, h: card.h }

    const blocked = obstacles.some((obstacle) => rectsOverlap(candidate, obstacle, 12))
    const jump = Math.hypot(x - current.x, y - current.y)
    const pointerDistance = pointer ? distanceToRectCenter(pointer, candidate) : 400

    // Reward: far from the finger/cursor, and a satisfying leap away.
    // Punish: landing on the moon card, or barely moving at all.
    let score = pointerDistance + jump * 0.4
    if (blocked) score -= 900
    if (jump < minJump) score -= (minJump - jump) * 2.2

    if (score > bestScore) {
      bestScore = score
      best = { x, y }
    }
  }

  if (!best) return { x: clamp(current.x, padding, maxX), y: clamp(current.y, padding, maxY) }

  return {
    x: clampWithOvershoot(best.x, current.x, padding, maxX),
    y: clampWithOvershoot(best.y, current.y, padding, maxY),
  }
}

/**
 * The chase gets harder the longer it goes on: a wider "personal space"
 * bubble and longer leaps, both capped so it never becomes un-fun.
 */
export function chaseDifficulty(attempts) {
  return {
    triggerRadius: Math.min(96 + attempts * 5, 190),
    minJump: Math.min(120 + attempts * 8, 300),
    // gets snappier — the spring stiffens as it panics
    duration: Math.max(520 - attempts * 22, 220),
  }
}

/** Starting layout for the two cards, based on how wide the arena is. */
export function initialLayout({ area, card }) {
  const wide = area.w >= 640
  if (wide) {
    return {
      x: clamp(area.w * 0.66 - card.w / 2, 12, area.w - card.w - 12),
      y: clamp(area.h * 0.5 - card.h / 2, 12, area.h - card.h - 12),
    }
  }
  return {
    x: clamp(area.w * 0.5 - card.w / 2, 12, area.w - card.w - 12),
    y: clamp(area.h * 0.72 - card.h / 2, 12, area.h - card.h - 12),
  }
}

export const TAUNTS = [
  'nope! 🎀',
  'too slow 😼',
  'catch me 💨',
  'missed me!',
  'not today 💅',
  'skill issue 😹',
  'nice try 💕',
  'lol no ✨',
  'wrong hand!',
  'faster!! 🐾',
]
