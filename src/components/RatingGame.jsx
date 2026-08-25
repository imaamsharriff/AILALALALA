import { useCallback, useEffect, useRef, useState } from 'react'
import CuteGif from './CuteGif.jsx'
import { DancingCat, KittyFace, SadCat, SparkleMark } from './Stickers.jsx'
import { sfx } from '../lib/sfx.js'
import { fireConfetti, fireFromElement, PRESETS } from '../lib/confetti.js'
import { formatNumber, ratingComment, STAGES, STAGE_CHARMS } from '../lib/rating.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import './RatingGame.css'

const ESCALATION_MS = 1500

/**
 * Section 3 — rate Aila from 1 to 10. The scale disagrees with the premise.
 */
export default function RatingGame({ onComplete, onShake }) {
  const [stageIndex, setStageIndex] = useState(0)
  const [rating, setRating] = useState(5)
  const [escalating, setEscalating] = useState(null) // { hit, hitSub, escalate }
  const [finished, setFinished] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  const stage = STAGES[stageIndex]
  const stageRef = useRef(stageIndex)
  stageRef.current = stageIndex
  const lockRef = useRef(false)
  const timersRef = useRef([])
  const finalRef = useRef(null)
  const reducedMotion = useReducedMotion()

  const addTimer = (id) => {
    timersRef.current.push(id)
    return id
  }

  useEffect(
    () => () => {
      timersRef.current.forEach((id) => window.clearTimeout(id))
      timersRef.current = []
    },
    [],
  )

  /* Keep the punchline on screen once the panel deflates. */
  useEffect(() => {
    if (!celebrating) return undefined
    const id = window.setTimeout(() => {
      finalRef.current?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'center',
      })
    }, 320)
    return () => window.clearTimeout(id)
  }, [celebrating, reducedMotion])

  /* ------------------------- reaching the top ------------------------- */

  const escalate = useCallback(() => {
    const current = STAGES[stageRef.current]
    lockRef.current = true
    setEscalating({ hit: current.hit, hitSub: current.hitSub, escalate: current.escalate })
    sfx.escalate(stageRef.current)
    onShake()
    fireConfetti({
      ...PRESETS.sparkles,
      count: 26 + stageRef.current * 12,
      power: 12 + stageRef.current * 3,
    })

    addTimer(
      window.setTimeout(() => {
        // Bigger scale drops in; the old max becomes the new starting point.
        setStageIndex((i) => Math.min(i + 1, STAGES.length - 1))
        setEscalating(null)
        lockRef.current = false
        sfx.sparkle()
      }, ESCALATION_MS),
    )
  }, [onShake])

  const finish = useCallback(() => {
    lockRef.current = true
    setFinished(true)
    setEscalating({ hit: STAGES[3].hit, hitSub: STAGES[3].hitSub, escalate: null })
    sfx.escalate(3)
    onShake()

    // deflate → sad cat → tiny falling hearts → then flip to celebration
    addTimer(
      window.setTimeout(() => {
        setEscalating(null)
        sfx.gameOver()
        fireConfetti({
          emojis: ['💕', '💗', '🩷'],
          count: 30,
          mode: 'rain',
          gravity: 0.16,
          confettiRatio: 0,
        })
      }, 900),
    )

    addTimer(
      window.setTimeout(() => {
        setCelebrating(true)
        sfx.celebrate()
        fireConfetti({ ...PRESETS.party, count: 70, power: 18 })
        fireConfetti({ ...PRESETS.hearts, count: 40, power: 14 })
      }, 3200),
    )
  }, [onShake])

  /* ------------------------------ slider ------------------------------ */

  const handleChange = (event) => {
    if (lockRef.current || finished) return
    const raw = Number(event.target.value)

    // "At the top" means the last notch the slider can actually land on —
    // a safety net in case a step ever fails to divide the range evenly.
    const atTop = raw >= stage.max || raw + stage.step > stage.max
    setRating(atTop ? stage.max : raw)

    if (atTop) {
      if (stageIndex < STAGES.length - 1) escalate()
      else finish()
    }
  }

  const handleContinue = (event) => {
    sfx.pop()
    fireFromElement(event.currentTarget, { ...PRESETS.bows, count: 28 })
    onComplete()
  }

  const percent = ((rating - 1) / Math.max(1, stage.max - 1)) * 100
  const charms = STAGE_CHARMS[stageIndex]

  return (
    <div className="rating">
      <h2 className="title rating__title">OKAY THEN… HOW PRETTY IS AILA? 🎀</h2>
      <p className="subtitle">Rate her from 1–10.</p>

      <p className="sr-only" aria-live="polite">
        {finished
          ? 'Aila is a 10,000 out of 10.'
          : escalating
            ? escalating.escalate || escalating.hit
            : ''}
      </p>

      <div className={`panel rating__panel${finished ? ' is-finished' : ''}`}>
        {/* --- the big number --- */}
        <div className="rating__readout" data-stage={stageIndex} data-finished={finished}>
          <span className="rating__readout-label">AILA IS A</span>
          <span className="rating__value" key={`${stageIndex}-${rating}`}>
            {formatNumber(finished ? 10000 : rating)}
            <span className="rating__value-max">/{finished ? 10 : formatNumber(stage.max)}</span>
          </span>
          <span className="rating__hearts" aria-hidden="true">
            {charms.map((charm, i) => (
              <span key={charm} style={{ animationDelay: `${i * 0.14}s` }}>
                {charm}
              </span>
            ))}
          </span>
        </div>

        {/* --- the slider itself --- */}
        <div className={`rating__slider-wrap${finished ? ' is-deflated' : ''}`}>
          <span className="rating__bound">1</span>

          <div
            className="rating__slider"
            style={{ '--percent': `${percent}%`, '--pct': percent / 100 }}
          >
            <input
              className="rating__input"
              type="range"
              min={1}
              max={stage.max}
              step={stage.step}
              value={Math.min(rating, stage.max)}
              onChange={handleChange}
              disabled={finished}
              aria-label={`How pretty is Aila, from 1 to ${stage.max}`}
              aria-valuetext={`${formatNumber(rating)} out of ${formatNumber(stage.max)}`}
              style={{
                '--track-from': stage.trackFrom,
                '--track-to': stage.trackTo,
              }}
            />
            <span className="rating__thumb-charm" aria-hidden="true">
              🎀
            </span>
          </div>

          <span className="rating__bound rating__bound--max" key={stage.max}>
            {formatNumber(stage.max)}
          </span>
        </div>

        <p className="rating__comment" key={ratingComment(rating, stageIndex)}>
          {finished ? 'the scale is no longer with us ⚰️' : ratingComment(rating, stageIndex)}
        </p>

        <p className="rating__scale-note">
          current scale: <strong>1 – {formatNumber(stage.max)}</strong>
          {stageIndex > 0 ? <span className="badge rating__upgrade-badge">upgraded ×{stageIndex}</span> : null}
        </p>
      </div>

      {/* --- escalation takeover --- */}
      {escalating ? (
        <div className="rating__takeover" role="presentation">
          <p className="rating__takeover-hit">{escalating.hit}</p>
          {escalating.hitSub ? <p className="rating__takeover-sub">{escalating.hitSub}</p> : null}
          {escalating.escalate ? (
            <p className="rating__takeover-escalate">{escalating.escalate}</p>
          ) : null}
          <SparkleMark size={44} className="rating__takeover-spark" />
        </div>
      ) : null}

      {/* --- punchline / celebration --- */}
      {finished && !escalating ? (
        <div
          className={`panel rating__final pop-in${celebrating ? ' is-celebrating' : ''}`}
          ref={finalRef}
        >
          <p className="rating__final-score">10,000/10 🎀</p>

          {celebrating ? (
            <>
              <div className="rating__final-cast">
                <KittyFace size={96} />
                <CuteGif slot="celebrationCat" size={96} tilt={6} fallback={<DancingCat size={96} />} />
              </div>
              <p className="rating__final-sub">
                just kidding — that&apos;s actually a personal best 💕
              </p>
              <button type="button" className="btn btn--glow" onClick={handleContinue}>
                SEE THE CONCLUSION 🎀
              </button>
            </>
          ) : (
            <>
              <div className="rating__final-cast">
                <CuteGif slot="sadCat" size={110} fallback={<SadCat size={110} />} />
              </div>
              <p className="rating__final-sub rating__final-sub--sad">aw man thats too bad 😔</p>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
