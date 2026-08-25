import { useCallback, useEffect, useRef, useState } from 'react'
import { GIF_SLOTS, GIF_TIMEOUT_MS } from '../lib/assets.js'
import './CuteGif.css'

/**
 * A GIF slot with a *guaranteed* graceful fallback.
 *
 * - No sources configured (the default) → renders only the local animated
 *   sticker, and makes no network request at all.
 * - Sources configured → tries each in order. The sticker stays on screen as
 *   the placeholder, and remains the final answer if every source fails,
 *   404s, is blocked, or simply never finishes loading.
 *
 * The frame keeps its size either way, so the layout never shifts.
 */
export default function CuteGif({ slot, fallback, size = 150, className = '', tilt = 0 }) {
  const sources = GIF_SLOTS[slot]?.sources ?? []
  const alt = GIF_SLOTS[slot]?.alt ?? ''

  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  const src = index < sources.length ? sources[index] : null

  const nextSource = useCallback(() => {
    setLoaded(false)
    setIndex((i) => i + 1)
  }, [])

  // A source that hangs (streaming responses can stall forever) shouldn't
  // hold the slot hostage — move on and let the sticker win.
  useEffect(() => {
    if (!src || loaded) return undefined
    const id = window.setTimeout(nextSource, GIF_TIMEOUT_MS)
    return () => window.clearTimeout(id)
  }, [src, loaded, nextSource])

  // Cached images can be complete before React attaches onLoad.
  const attachImg = useCallback((node) => {
    imgRef.current = node
    if (node?.complete && node.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <div
      className={`cute-gif ${className}`}
      style={{ '--gif-size': `${size}px`, '--gif-tilt': `${tilt}deg` }}
    >
      <div className="cute-gif__fallback" data-faded={loaded} aria-hidden={loaded || undefined}>
        {fallback}
      </div>

      {src ? (
        <img
          ref={attachImg}
          className="cute-gif__img"
          data-loaded={loaded}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={nextSource}
        />
      ) : null}
    </div>
  )
}
