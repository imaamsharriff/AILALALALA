import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import MoonOption from './MoonOption.jsx'
import AilaOption from './AilaOption.jsx'
import CuteGif from './CuteGif.jsx'
import { CryingCat, DancingCat, KittyFace } from './Stickers.jsx'
import { sfx } from '../lib/sfx.js'
import { fireConfetti, fireFromElement, PRESETS } from '../lib/confetti.js'
import { chaseDifficulty, initialLayout, pickRunawaySpot, TAUNTS } from '../lib/runaway.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import './PrettyGame.css'

/** How long the visitor must chase Aila before the punchline fires. */
const CHASE_MS = 20000
/** A stray mouse-flick shouldn't count as "trying" — require real effort. */
const MIN_ATTEMPTS = 3
/** Don't let the button teleport more than ~12x a second. */
const MOVE_COOLDOWN_MS = 80

export default function PrettyGame({ onComplete, onShake }) {
  const arenaRef = useRef(null)
  const moonRef = useRef(null)
  const ailaRef = useRef(null)
  const punchlineRef = useRef(null)

  const [moonPos, setMoonPos] = useState({ x: 0, y: 0 })
  const [ailaPos, setAilaPos] = useState({ x: 0, y: 0 })
  const [ready, setReady] = useState(false)

  const [attempts, setAttempts] = useState(0)
  const [chasing, setChasing] = useState(false)
  const [caught, setCaught] = useState(false)
  const [taunt, setTaunt] = useState(null)
  const [wrongCount, setWrongCount] = useState(0)
  const [showWrong, setShowWrong] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const reducedMotion = useReducedMotion()

  // Refs mirror state where timers/listeners need the freshest value.
  const attemptsRef = useRef(0)
  const ailaPosRef = useRef({ x: 0, y: 0 })
  const lastMoveRef = useRef(0)
  const timeUpRef = useRef(false)
  const caughtRef = useRef(false)
  const chaseTimerRef = useRef(null)
  const wrongTimerRef = useRef(null)
  const difficultyRef = useRef(chaseDifficulty(0))

  const measure = useCallback((node, fallbackW, fallbackH) => {
    if (!node) return { w: fallbackW, h: fallbackH }
    return { w: node.offsetWidth || fallbackW, h: node.offsetHeight || fallbackH }
  }, [])

  /* ---------------------------------------------------------------
     Layout: both cards are absolutely positioned, so the same code
     path drives the desktop side-by-side layout, the stacked mobile
     layout, and every runaway jump. No hardcoded pixel coordinates.
     --------------------------------------------------------------- */
  const relayout = useCallback(() => {
    const arena = arenaRef.current
    if (!arena) return

    const area = { w: arena.clientWidth, h: arena.clientHeight }
    const moonCard = measure(moonRef.current, 200, 200)
    const ailaCard = measure(ailaRef.current, 200, 200)
    const wide = area.w >= 640

    const moon = wide
      ? {
          x: Math.max(12, area.w * 0.32 - moonCard.w / 2),
          y: Math.max(12, area.h * 0.5 - moonCard.h / 2),
        }
      : {
          x: Math.max(12, area.w * 0.5 - moonCard.w / 2),
          y: Math.max(12, area.h * 0.27 - moonCard.h / 2),
        }

    setMoonPos(moon)

    // Only reset Aila while she's still in her "starting seat".
    if (!chasing && !caughtRef.current) {
      const start = initialLayout({ area, card: ailaCard })
      ailaPosRef.current = start
      setAilaPos(start)
    } else {
      // On resize mid-chase, just keep her inside the (new) bounds.
      const clamped = {
        x: Math.min(Math.max(ailaPosRef.current.x, 10), Math.max(10, area.w - ailaCard.w - 10)),
        y: Math.min(Math.max(ailaPosRef.current.y, 10), Math.max(10, area.h - ailaCard.h - 10)),
      }
      ailaPosRef.current = clamped
      setAilaPos(clamped)
    }

    setReady(true)
  }, [chasing, measure])

  useLayoutEffect(() => {
    relayout()
    const arena = arenaRef.current
    if (!arena || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', relayout)
      return () => window.removeEventListener('resize', relayout)
    }
    const observer = new ResizeObserver(relayout)
    observer.observe(arena)
    return () => observer.disconnect()
  }, [relayout])

  /* --------------------------- the punchline --------------------------- */

  const triggerPunchline = useCallback(() => {
    if (caughtRef.current) return
    caughtRef.current = true
    setCaught(true)
    setChasing(false)
    setTaunt(null)

    // Park her proudly in the middle of the arena.
    const arena = arenaRef.current
    if (arena) {
      const card = measure(ailaRef.current, 200, 200)
      const centre = {
        x: Math.max(10, arena.clientWidth / 2 - card.w / 2),
        y: Math.max(10, arena.clientHeight / 2 - card.h / 2),
      }
      ailaPosRef.current = centre
      setAilaPos(centre)
    }

    sfx.reveal()
    fireConfetti({ ...PRESETS.party, count: 70, power: 19 })
    window.setTimeout(() => {
      sfx.celebrate()
      fireConfetti({ ...PRESETS.hearts, count: 50, power: 15 })
      fireConfetti({ ...PRESETS.bows, count: 30, mode: 'rain' })
    }, 520)
  }, [measure])

  /* --------------------------- running away --------------------------- */

  const flee = useCallback(
    (pointer) => {
      if (caughtRef.current) return

      const now = performance.now()
      if (now - lastMoveRef.current < MOVE_COOLDOWN_MS) return
      lastMoveRef.current = now

      // Time's up and they've genuinely tried? Give them the reveal instead.
      if (timeUpRef.current && attemptsRef.current + 1 >= MIN_ATTEMPTS) {
        triggerPunchline()
        return
      }

      const arena = arenaRef.current
      if (!arena) return

      const area = { w: arena.clientWidth, h: arena.clientHeight }
      const card = measure(ailaRef.current, 200, 200)
      const moonCard = measure(moonRef.current, 200, 200)

      const nextAttempts = attemptsRef.current + 1
      attemptsRef.current = nextAttempts
      difficultyRef.current = chaseDifficulty(nextAttempts)

      const spot = pickRunawaySpot({
        area,
        card,
        pointer,
        current: ailaPosRef.current,
        obstacles: [{ x: moonPos.x, y: moonPos.y, w: moonCard.w, h: moonCard.h }],
        minJump: difficultyRef.current.minJump,
      })

      // little puff of sparkles where she *was*
      if (!reducedMotion) {
        const rect = arena.getBoundingClientRect()
        fireConfetti({
          x: rect.left + ailaPosRef.current.x + card.w / 2,
          y: rect.top + ailaPosRef.current.y + card.h / 2,
          count: 6,
          power: 7,
          gravity: 0.12,
          emojis: ['✨', '💨', '💕'],
          confettiRatio: 0,
        })
      }

      ailaPosRef.current = spot
      setAilaPos(spot)
      setAttempts(nextAttempts)
      setShowHint(false)
      setTaunt({ id: nextAttempts, text: TAUNTS[nextAttempts % TAUNTS.length] })
      sfx.whoosh(nextAttempts)

      // First escape starts the 20-second clock (never the page load).
      if (!chaseTimerRef.current) {
        setChasing(true)
        chaseTimerRef.current = window.setTimeout(() => {
          timeUpRef.current = true
          if (attemptsRef.current >= MIN_ATTEMPTS) triggerPunchline()
        }, CHASE_MS)
      }
    },
    [measure, moonPos.x, moonPos.y, reducedMotion, triggerPunchline],
  )

  /* Proximity detection: the cursor never has to actually touch her. */
  useEffect(() => {
    const arena = arenaRef.current
    if (!arena || caught) return undefined

    const onPointerMove = (event) => {
      if (caughtRef.current) return
      const rect = arena.getBoundingClientRect()
      const pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      const card = measure(ailaRef.current, 200, 200)
      const centre = {
        x: ailaPosRef.current.x + card.w / 2,
        y: ailaPosRef.current.y + card.h / 2,
      }
      const distance = Math.hypot(pointer.x - centre.x, pointer.y - centre.y)
      if (distance < difficultyRef.current.triggerRadius) flee(pointer)
    }

    arena.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => arena.removeEventListener('pointermove', onPointerMove)
  }, [caught, flee, measure])

  /* Direct taps / keyboard activation also make her bolt. */
  const handleAilaAttempt = useCallback(
    (event) => {
      if (caughtRef.current) {
        // Once caught she's a normal button: clicking her continues.
        if (event.type === 'click') {
          sfx.pop()
          onComplete()
        }
        return
      }
      if (event.type === 'pointerdown' || event.type === 'keydown') event.preventDefault?.()

      const arena = arenaRef.current
      let pointer = null
      if (arena && typeof event.clientX === 'number' && event.clientX !== 0) {
        const rect = arena.getBoundingClientRect()
        pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      }
      flee(pointer)
    },
    [flee, onComplete],
  )

  /* ----------------------------- wrong answer ---------------------------- */

  const handleMoonPick = useCallback(() => {
    if (caughtRef.current) return
    setWrongCount((n) => n + 1)
    setShowWrong(true)
    sfx.wrong()
    onShake()
    if (wrongTimerRef.current) window.clearTimeout(wrongTimerRef.current)
    wrongTimerRef.current = window.setTimeout(() => setShowWrong(false), 2600)
  }, [onShake])

  /* The reveal is taller than the arena — bring it into view for them. */
  useEffect(() => {
    if (!caught) return undefined
    const id = window.setTimeout(() => {
      punchlineRef.current?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'center',
      })
    }, 400)
    return () => window.clearTimeout(id)
  }, [caught, reducedMotion])

  /* Nudge anyone who hasn't figured out what to do. */
  useEffect(() => {
    if (attempts > 0 || caught) return undefined
    const id = window.setTimeout(() => setShowHint(true), 6000)
    return () => window.clearTimeout(id)
  }, [attempts, caught])

  useEffect(
    () => () => {
      if (chaseTimerRef.current) window.clearTimeout(chaseTimerRef.current)
      if (wrongTimerRef.current) window.clearTimeout(wrongTimerRef.current)
    },
    [],
  )

  const handleContinue = (event) => {
    sfx.pop()
    fireFromElement(event.currentTarget, { ...PRESETS.hearts, count: 26 })
    onComplete()
  }

  const cardTransition = `transform ${difficultyRef.current.duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`

  return (
    <div className="pretty">
      <h2 className="title pretty__title">WHO IS PRETTIER? 🎀</h2>
      <p className="subtitle">Be honest. This is a very serious scientific experiment.</p>

      {/* live status for screen readers — the joke shouldn't be visual-only */}
      <p className="sr-only" aria-live="polite">
        {caught
          ? "Loser! It's Aila. The correct answer is Aila."
          : showWrong
            ? "Wrong. That's not the prettiest."
            : ''}
      </p>

      <div
        className="pretty__meter"
        data-active={chasing && !caught}
        data-done={caught}
        aria-hidden="true"
      >
        <span className="pretty__meter-fill" style={{ animationDuration: `${CHASE_MS}ms` }} />
        <span className="pretty__meter-label">
          {caught ? 'truth reached 🎀' : chasing ? 'catching Aila…' : 'awaiting your answer'}
        </span>
      </div>

      <div
        className="pretty__arena"
        ref={arenaRef}
        data-ready={ready}
        data-caught={caught}
        data-shaking={showWrong}
      >
        <MoonOption
          ref={moonRef}
          disabled={caught}
          onPick={handleMoonPick}
          style={{ transform: `translate3d(${moonPos.x}px, ${moonPos.y}px, 0)` }}
        />

        <AilaOption
          ref={ailaRef}
          caught={caught}
          chasing={chasing}
          taunt={taunt}
          onAttempt={handleAilaAttempt}
          style={{
            transform: `translate3d(${ailaPos.x}px, ${ailaPos.y}px, 0)`,
            transition: reducedMotion ? 'none' : cardTransition,
          }}
        />

        {showWrong ? (
          <div className="pretty__wrong" role="presentation">
            <span className="pretty__stamp">WRONG</span>
            <div className="pretty__wrong-cat">
              <CuteGif slot="cryingCat" size={120} fallback={<CryingCat size={120} />} />
            </div>
          </div>
        ) : null}

        {showHint && !caught ? (
          <p className="pretty__hint">psst… try to click Aila 🎀</p>
        ) : null}
      </div>

      {showWrong ? (
        <div className="pretty__verdict pop-in">
          <p className="pretty__verdict-title">❌ WRONG.</p>
          <p className="pretty__verdict-sub">You&apos;re wrong 😭</p>
          {wrongCount > 1 ? (
            <p className="pretty__verdict-count">
              wrong answers so far: <strong>{wrongCount}</strong> 😔
            </p>
          ) : null}
        </div>
      ) : null}

      {caught ? (
        <div className="panel pretty__punchline pop-in" ref={punchlineRef}>
          <div className="pretty__punchline-cast">
            <KittyFace size={92} />
            <div className="pretty__punchline-text">
              <p className="pretty__loser">LOSER 😭</p>
              <p className="pretty__answer">IT&apos;S AILA 🎀</p>
              <p className="pretty__escape">You really thought you could escape the truth?</p>
            </div>
            <CuteGif slot="celebrationCat" size={92} tilt={-6} fallback={<DancingCat size={92} />} />
          </div>

          <p className="pretty__stats">
            escape attempts survived: <strong>{attempts}</strong> · wrong answers:{' '}
            <strong>{wrongCount}</strong>
          </p>

          <button type="button" className="btn btn--glow" onClick={handleContinue}>
            CONTINUE 💕
          </button>
        </div>
      ) : null}
    </div>
  )
}
