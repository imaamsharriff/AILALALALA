import { forwardRef } from 'react'

/**
 * The correct answer — which refuses to be clicked until the truth wins.
 *
 * Position is driven entirely by a CSS transform (cheap, GPU-composited);
 * PrettyGame owns the coordinates and the escape rules.
 */
const AilaOption = forwardRef(function AilaOption(
  { onAttempt, style, taunt, caught, chasing },
  ref,
) {
  return (
    <button
      type="button"
      ref={ref}
      className="choice choice--aila"
      data-caught={caught}
      data-chasing={chasing}
      style={style}
      onPointerDown={onAttempt}
      onClick={onAttempt}
      onFocus={onAttempt}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onAttempt(event)
      }}
      aria-label={caught ? 'Aila — the correct answer' : 'Aila — try to catch her'}
    >
      <span className="choice__art" aria-hidden="true">
        <span className="choice__sparkle-ring" />
        🎀
      </span>
      <span className="choice__label">AILA</span>
      <span className="choice__note">
        {caught ? 'the objectively correct answer' : 'suspiciously hard to click'}
      </span>

      {taunt && !caught ? (
        <span className="choice__taunt" key={taunt.id} aria-hidden="true">
          {taunt.text}
        </span>
      ) : null}
    </button>
  )
})

export default AilaOption
