import { useEffect, useState } from "react"
import { useAccessibilityPrefs } from "./useAccessibilityPrefs"

export function useReducedMotion(): boolean {
  const systemPrefers = useSystemReducedMotion()
  const { reducedMotion } = useAccessibilityPrefs()
  return reducedMotion || systemPrefers
}

function useSystemReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return prefersReduced
}
