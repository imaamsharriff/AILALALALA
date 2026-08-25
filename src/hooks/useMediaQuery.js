import { useEffect, useState } from 'react'

/** Generic matchMedia hook (used for coarse-pointer / small-screen tweaks). */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(query).matches === true,
  )

  useEffect(() => {
    const mql = window.matchMedia?.(query)
    if (!mql) return undefined
    setMatches(mql.matches)
    const onChange = (event) => setMatches(event.matches)
    if (mql.addEventListener) mql.addEventListener('change', onChange)
    else mql.addListener(onChange)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange)
      else mql.removeListener(onChange)
    }
  }, [query])

  return matches
}

/** Coarse pointer == finger. Used to swap hover logic for tap logic. */
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)')
