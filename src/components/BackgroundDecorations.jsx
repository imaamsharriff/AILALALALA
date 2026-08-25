import { useMemo } from 'react'
import './BackgroundDecorations.css'

const CHARMS = ['🎀', '💕', '✨', '🐱', '🌸', '⭐', '💖', '🩰', '🍰', '💫', '🧁', '🎂']

/**
 * Floating charms around the edges of the page.
 *
 * Positions are generated once (useMemo) and animated purely in CSS with
 * transforms, so this whole layer costs nothing per frame in JS.
 * Each charm gets a `tier`; CSS hides higher tiers on smaller screens so
 * phones stay calm and fast.
 */
function buildCharms(count) {
  const charms = []
  for (let i = 0; i < count; i += 1) {
    // keep decorations near the edges — the middle belongs to the content
    const edge = i % 4
    const along = 4 + Math.random() * 92
    const depth = 2 + Math.random() * 16

    const pos =
      edge === 0
        ? { left: `${along}%`, top: `${depth}%` }
        : edge === 1
          ? { left: `${100 - depth}%`, top: `${along}%` }
          : edge === 2
            ? { left: `${along}%`, top: `${100 - depth}%` }
            : { left: `${depth}%`, top: `${along}%` }

    charms.push({
      id: i,
      char: CHARMS[i % CHARMS.length],
      tier: i < 8 ? 1 : i < 16 ? 2 : 3,
      style: {
        ...pos,
        '--size': `${1.1 + Math.random() * 1.9}rem`,
        '--rot': `${-25 + Math.random() * 50}deg`,
        '--dur': `${6 + Math.random() * 7}s`,
        '--delay': `${-Math.random() * 8}s`,
        '--drift': `${-18 + Math.random() * 36}px`,
        '--opacity': (0.45 + Math.random() * 0.45).toFixed(2),
      },
    })
  }
  return charms
}

export default function BackgroundDecorations({ count = 26 }) {
  const charms = useMemo(() => buildCharms(count), [count])

  return (
    <div className="bg-decor" aria-hidden="true">
      {/* soft pastel blobs drifting behind everything */}
      <span className="bg-decor__blob bg-decor__blob--1" />
      <span className="bg-decor__blob bg-decor__blob--2" />
      <span className="bg-decor__blob bg-decor__blob--3" />

      {/* candy-stripe ribbons pinned to the top & bottom edges */}
      <span className="bg-decor__ribbon bg-decor__ribbon--top" />
      <span className="bg-decor__ribbon bg-decor__ribbon--bottom" />

      {charms.map((charm) => (
        <span
          key={charm.id}
          className="bg-decor__charm"
          data-tier={charm.tier}
          style={charm.style}
        >
          {charm.char}
        </span>
      ))}
    </div>
  )
}
