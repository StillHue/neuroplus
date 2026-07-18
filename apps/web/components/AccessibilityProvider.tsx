"use client"

import { useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useAccessibilityPrefs } from "@neuroplus/hooks/accessibility"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { theme, reducedMotion, highContrast, fontScale } = useAccessibilityPrefs()

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.dataset.reducedMotion = String(reducedMotion)
    root.dataset.highContrast = String(highContrast)
    root.style.setProperty("--font-scale", String(fontScale))
    root.style.colorScheme = theme
    gsap.globalTimeline.timeScale(reducedMotion ? 100 : 1)
  }, [theme, reducedMotion, highContrast, fontScale])

  return <>{children}</>
}
