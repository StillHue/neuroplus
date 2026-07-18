"use client"

import { useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useAccessibilityPrefs } from "@neuroplus/hooks/accessibility"

// Register all plugins once at the app root
gsap.registerPlugin(useGSAP, ScrollTrigger)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { reducedMotion, highContrast, fontScale } = useAccessibilityPrefs()

  useEffect(() => {
    const root = document.documentElement
    root.dataset.reducedMotion = String(reducedMotion)
    root.dataset.highContrast  = String(highContrast)
    root.style.setProperty("--font-scale", String(fontScale))
    // When reduced motion is on, all GSAP timelines complete instantly
    gsap.globalTimeline.timeScale(reducedMotion ? 100 : 1)
  }, [reducedMotion, highContrast, fontScale])

  return <>{children}</>
}
