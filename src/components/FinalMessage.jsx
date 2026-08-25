import { useEffect, useRef } from 'react'
import CuteGif from './CuteGif.jsx'
import { BirthdayCake, DancingCat, GiantBow, KittyFace, SparkleMark } from './Stickers.jsx'
import { sfx } from '../lib/sfx.js'
import { fireConfetti, fireFromElement, PRESETS } from '../lib/confetti.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import './FinalMessage.css'

/** Final section — the official verdict. */
export default function FinalMessage({ onReplay }) {
  const reducedMotion = useReducedMotion()
  const timersRef = useRef([])

  useEffect(() => {
    sfx.celebrate()
    fireConfetti({ ...PRESETS.party, count: 80, power: 20 })

    const timers = timersRef.current
    timers.push(
      window.setTimeout(() => fireConfetti({ ...PRESETS.hearts, count: 46, power: 15 }), 420),
      window.setTimeout(
        () => fireConfetti({ ...PRESETS.bows, count: 40, mode: 'rain', gravity: 0.2 }),
        900,
      ),
    )

    // a lazy, ongoing drizzle of charms so the finale never goes still
    let interval = 0
    if (!reducedMotion) {
      interval = window.setInterval(() => {
        fireConfetti({
          emojis: ['🎀', '💕', '✨', '🐱', '🌸'],
          count: 10,
          mode: 'rain',
          gravity: 0.14,
          confettiRatio: 0.25,
        })
      }, 2600)
    }

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      timersRef.current = []
      if (interval) window.clearInterval(interval)
    }
  }, [reducedMotion])

  const handleReplay = (event) => {
    sfx.pop()
    fireFromElement(event.currentTarget, { ...PRESETS.sparkles, count: 30 })
    onReplay()
  }

  const handleMoreConfetti = (event) => {
    sfx.sparkle()
    fireFromElement(event.currentTarget, { ...PRESETS.party, count: 55, power: 18 })
  }

  return (
    <div className="final">
      <p className="eyebrow pop-in">official scientific findings</p>
      <h2 className="title final__title">🎀 CONCLUSION 🎀</h2>

      <div className="final__bow">
        <GiantBow size={230} />
        <SparkleMark size={38} className="final__spark final__spark--a" />
        <SparkleMark size={26} className="final__spark final__spark--b" color="#ff8ec0" />
        <SparkleMark size={32} className="final__spark final__spark--c" color="#a98cff" />
      </div>

      <div className="panel final__panel">
        <p className="final__lead">Aila is officially:</p>
        <p className="final__score" aria-label="Infinity out of ten">
          ∞ <span className="final__score-slash">/</span> 10
        </p>

        <div className="ribbon final__ribbon" aria-hidden="true" />

        <p className="final__wish">Happy Birthday, Aila 💕✨</p>
        <p className="final__message">
          Hope your day is as ridiculously pretty as you are.
        </p>

        <div className="final__cast">
          <KittyFace size={92} />
          <CuteGif slot="birthdayCat" size={110} tilt={-4} fallback={<BirthdayCake size={110} />} />
          <CuteGif slot="celebrationCat" size={92} tilt={5} fallback={<DancingCat size={92} />} />
        </div>

        <div className="final__stamps">
          <span className="badge">💯 verified prettiest</span>
          <span className="badge badge--mint">🐱 cat approved</span>
          <span className="badge badge--sky">🎀 bow certified</span>
        </div>
      </div>

      <div className="final__actions">
        <button type="button" className="btn btn--lavender" onClick={handleMoreConfetti}>
          MORE CONFETTI 🎉
        </button>
        <button type="button" className="btn btn--ghost" onClick={handleReplay}>
          REPLAY THE CHAOS 🔁
        </button>
      </div>

      <p className="final__footer">made with way too much effort, and love 💗</p>
    </div>
  )
}
