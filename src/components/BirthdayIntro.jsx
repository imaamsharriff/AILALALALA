import { useEffect, useRef } from 'react'
import { fireConfetti, fireFromElement, PRESETS } from '../lib/confetti.js'
import { sfx } from '../lib/sfx.js'
import CuteGif from './CuteGif.jsx'
import { BirthdayCake, DancingCat, KittyFace, SparkleMark } from './Stickers.jsx'
import './BirthdayIntro.css'

/**
 * Section 1 — the opening birthday screen.
 * Confetti falls on arrival (silently, because audio is still locked);
 * pressing START is the gesture that unlocks sound for the whole site.
 */
export default function BirthdayIntro({ onStart }) {
  const buttonRef = useRef(null)

  useEffect(() => {
    // gentle welcome shower — no sound, nothing is unlocked yet
    fireConfetti({ ...PRESETS.party, mode: 'rain', count: 46, confettiRatio: 0.55 })
  }, [])

  const handleStart = () => {
    sfx.unlock()
    sfx.sparkle()
    fireFromElement(buttonRef.current, { ...PRESETS.hearts, count: 46, power: 17 })
    fireConfetti({ ...PRESETS.party, count: 52 })
    onStart()
  }

  return (
    <div className="intro">
      <p className="eyebrow pop-in">✨ a very important announcement ✨</p>

      <h1 className="title title--gradient intro__title">
        🎀 HAPPY BIRTHDAY, AILA! 🎀
      </h1>

      <p className="subtitle intro__subtitle">
        Today is officially Aila Appreciation Day 💕✨
      </p>

      <div className="ribbon intro__ribbon" aria-hidden="true" />

      <div className="intro__cast">
        <div className="intro__cast-item intro__cast-item--left">
          <KittyFace size={116} />
        </div>

        <div className="intro__cake">
          <BirthdayCake size={200} />
          <SparkleMark size={34} className="intro__spark intro__spark--a" />
          <SparkleMark size={22} className="intro__spark intro__spark--b" color="#ff8ec0" />
          <SparkleMark size={28} className="intro__spark intro__spark--c" color="#a98cff" />
        </div>

        <div className="intro__cast-item intro__cast-item--right">
          <CuteGif slot="partyCat" size={116} tilt={5} fallback={<DancingCat size={116} />} />
        </div>
      </div>

      <div className="intro__badges">
        <span className="badge">🎂 birthday mode: ON</span>
        <span className="badge badge--mint">🐱 cats: approved</span>
        <span className="badge badge--sky">🎀 bows: maximum</span>
      </div>

      <button
        type="button"
        ref={buttonRef}
        className="btn btn--glow intro__start"
        onClick={handleStart}
      >
        START THE SURPRISE ✨
      </button>

      <p className="intro__hint">psst — turn your sound on 🔊</p>
    </div>
  )
}
