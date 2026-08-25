/* ============================================================
   rating.js — the escalating-scale joke, as data.

   Stage N's max becomes stage N+1's starting point, so the visitor keeps
   dragging and the website keeps panicking: 10 → 100 → 1,000 → 10,000.
   ============================================================ */

export const STAGES = [
  {
    max: 10,
    step: 1,
    hit: '10/10? That’s cute.',
    hitSub: 'Hmm… apparently 10 wasn’t enough.',
    escalate: 'WAIT. WE NEED A BIGGER SCALE.',
    trackFrom: '#ffb3d3',
    trackTo: '#ff5fa2',
  },
  {
    max: 100,
    step: 1,
    hit: '100/100?!',
    hitSub: 'The measuring equipment is sweating.',
    escalate: 'THIS IS GETTING OUT OF HAND.',
    trackFrom: '#ff8ec0',
    trackTo: '#ef2f80',
  },
  {
    max: 1000,
    // Steps must divide (max - 1) exactly, otherwise the top of the range is
    // unreachable by dragging (min=1, step=10 tops out at 991, not 1000).
    step: 9,
    hit: '1,000?!',
    hitSub: 'Several scientists have been notified.',
    escalate: 'OKAY THIS IS SCIENTIFICALLY UNREASONABLE.',
    trackFrom: '#c3a8ff',
    trackTo: '#8f6bf5',
  },
  {
    max: 10000,
    step: 99, // 9999 / 99 = 101 notches, so 10,000 is exactly reachable
    hit: '10,000?!',
    hitSub: 'The scale has formally resigned.',
    escalate: null, // last stage — the punchline takes over
    trackFrom: '#ffd166',
    trackTo: '#ff5fa2',
  },
]

export const formatNumber = (value) => value.toLocaleString('en-US')

/** Cheeky running commentary while the visitor drags. */
export function ratingComment(value, stageIndex) {
  if (stageIndex === 0) {
    if (value <= 1) return 'one?? are you okay??'
    if (value <= 3) return 'be serious. 🤨'
    if (value <= 5) return 'hmm. keep going. 👀'
    if (value <= 7) return 'warmer… 💕'
    if (value <= 9) return 'so close to the truth ✨'
    return 'THERE it is 🎀'
  }

  const ratio = value / STAGES[stageIndex].max
  if (ratio < 0.25) return 'you can drag further, you know 👀'
  if (ratio < 0.5) return 'keep going, this is science 🔬'
  if (ratio < 0.75) return 'the numbers are getting nervous 😳'
  if (ratio < 0.98) return 'ALMOST. AT. THE. TOP. 💗'
  return 'oh no. oh no. 😱'
}

/** Sticker spam that intensifies with the stage. */
export const STAGE_CHARMS = [
  ['💕', '🎀'],
  ['💖', '✨', '🎀'],
  ['💗', '⭐', '🐱', '✨'],
  ['💞', '🌟', '🎀', '🐱', '🧁'],
]
