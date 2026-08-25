import { useCallback, useEffect, useRef, useState } from 'react'
import BackgroundDecorations from './components/BackgroundDecorations.jsx'
import CursorTrail from './components/CursorTrail.jsx'
import Confetti from './components/Confetti.jsx'
import SoundController from './components/SoundController.jsx'
import BirthdayIntro from './components/BirthdayIntro.jsx'
import PrettyGame from './components/PrettyGame.jsx'
import RatingGame from './components/RatingGame.jsx'
import FinalMessage from './components/FinalMessage.jsx'

/** The four screens, in order. */
const SECTIONS = ['intro', 'pretty', 'rating', 'final']

const LEAVE_MS = 430
const SHAKE_MS = 600

export default function App() {
  // `key` is what React reconciles on. A screen keeps the same key when it
  // moves from "current" to "leaving", so it fades out instead of remounting;
  // replay bumps the run counter, which forces genuinely fresh screens.
  const [current, setCurrent] = useState({ name: 'intro', key: 'intro-0' })
  const [leaving, setLeaving] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [shaking, setShaking] = useState(false)

  const runIdRef = useRef(0)
  const currentRef = useRef(current)
  currentRef.current = current
  const leaveTimer = useRef(null)
  const shakeTimer = useRef(null)

  useEffect(
    () => () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current)
      if (shakeTimer.current) window.clearTimeout(shakeTimer.current)
    },
    [],
  )

  /** Cross-fade from the current screen to the next one. */
  const goTo = useCallback((next) => {
    const previous = currentRef.current
    const nextScreen = { name: next, key: `${next}-${runIdRef.current}` }
    if (previous.key === nextScreen.key) return

    setLeaving(previous)
    setCurrent(nextScreen)

    if (leaveTimer.current) window.clearTimeout(leaveTimer.current)
    leaveTimer.current = window.setTimeout(() => setLeaving(null), LEAVE_MS)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const advance = useCallback(() => {
    const index = SECTIONS.indexOf(currentRef.current.name)
    goTo(SECTIONS[Math.min(index + 1, SECTIONS.length - 1)])
  }, [goTo])

  /** Whole-page shake for the joke beats. Neutralised by prefers-reduced-motion. */
  const shake = useCallback(() => {
    setShaking(false)
    // wait a frame so re-triggering mid-shake restarts the animation
    requestAnimationFrame(() => {
      setShaking(true)
      if (shakeTimer.current) window.clearTimeout(shakeTimer.current)
      shakeTimer.current = window.setTimeout(() => setShaking(false), SHAKE_MS)
    })
  }, [])

  /** Start over from the intro, in-page, with every game reset. */
  const replay = useCallback(() => {
    runIdRef.current += 1
    goTo('intro')
  }, [goTo])

  // SoundController owns the audio side-effects; App just tracks the flag.
  const handleToggleSound = useCallback((enabled) => setSoundEnabled(enabled), [])

  const renderSection = (name) => {
    switch (name) {
      case 'intro':
        return <BirthdayIntro onStart={advance} />
      case 'pretty':
        return <PrettyGame onComplete={advance} onShake={shake} />
      case 'rating':
        return <RatingGame onComplete={advance} onShake={shake} />
      case 'final':
        return <FinalMessage onReplay={replay} />
      default:
        return null
    }
  }

  const screens = leaving ? [leaving, current] : [current]

  return (
    <div className={`app${shaking ? ' is-shaking' : ''}`}>
      <BackgroundDecorations />
      <CursorTrail />

      <SoundController soundEnabled={soundEnabled} onToggle={handleToggleSound} />

      <main className="stage-wrap">
        {screens.map((screen) => {
          const isLeaving = leaving ? screen.key === leaving.key : false
          return (
            <section
              key={screen.key}
              className={`stage ${isLeaving ? 'is-leaving' : 'is-entering'}`}
              aria-hidden={isLeaving ? 'true' : undefined}
              inert={isLeaving ? '' : undefined}
            >
              {renderSection(screen.name)}
            </section>
          )
        })}
      </main>

      <Confetti />
    </div>
  )
}
