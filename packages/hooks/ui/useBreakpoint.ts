import { useEffect, useState } from "react"

const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const
type Breakpoint = keyof typeof BREAKPOINTS

export function useBreakpoint(bp: Breakpoint): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`)
    setMatches(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [bp])
  return matches
}
