import { sfx } from '../lib/sfx.js'
import './SoundController.css'

/**
 * Persistent mute / unmute control.
 *
 * Audio only ever exists after the visitor presses START (see App), so this
 * button never triggers blocked autoplay — it just flips the master gain.
 */
export default function SoundController({ soundEnabled, onToggle }) {
  const handleClick = () => {
    const next = !soundEnabled
    // Unlocking on this gesture means the toggle also works if someone
    // unmutes before ever pressing START.
    if (next) {
      sfx.unlock()
      sfx.setMuted(false)
      sfx.pop()
    } else {
      sfx.setMuted(true)
    }
    onToggle(next)
  }

  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={handleClick}
      aria-pressed={soundEnabled}
      aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
      title={soundEnabled ? 'Mute' : 'Unmute'}
    >
      <span className="sound-toggle__icon" aria-hidden="true">
        {soundEnabled ? '🔊' : '🔇'}
      </span>
      <span className="sound-toggle__label">{soundEnabled ? 'Sound on' : 'Muted'}</span>
    </button>
  )
}
