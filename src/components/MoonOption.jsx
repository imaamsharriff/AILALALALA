import { forwardRef } from 'react'

/** The (incorrect) option. Sits still, unlike someone else. */
const MoonOption = forwardRef(function MoonOption({ onPick, style, disabled }, ref) {
  return (
    <button
      type="button"
      ref={ref}
      className="choice choice--moon"
      style={style}
      onClick={onPick}
      disabled={disabled}
    >
      <span className="choice__art" aria-hidden="true">
        <span className="choice__moon-glow" />
        🌙
      </span>
      <span className="choice__label">MOON</span>
      <span className="choice__note">a rock, allegedly pretty</span>
    </button>
  )
})

export default MoonOption
