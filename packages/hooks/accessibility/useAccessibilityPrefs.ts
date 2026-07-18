import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThemeMode = "light" | "dark"

interface AccessibilityPrefs {
  theme: ThemeMode
  reducedMotion: boolean
  highContrast: boolean
  fontScale: 1 | 1.25 | 1.5 | 2
  pictogramMode: boolean
  sensoryMode: boolean
  setTheme: (v: ThemeMode) => void
  toggleTheme: () => void
  setReducedMotion: (v: boolean) => void
  setHighContrast: (v: boolean) => void
  setFontScale: (v: AccessibilityPrefs["fontScale"]) => void
  setPictogramMode: (v: boolean) => void
  setSensoryMode: (v: boolean) => void
}

export const useAccessibilityPrefs = create<AccessibilityPrefs>()(
  persist(
    (set, get) => ({
      theme: "dark",
      reducedMotion: false,
      highContrast: false,
      fontScale: 1,
      pictogramMode: false,
      sensoryMode: false,
      setTheme: (v) => set({ theme: v }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setReducedMotion: (v) => set({ reducedMotion: v }),
      setHighContrast: (v) => set({ highContrast: v }),
      setFontScale: (v) => set({ fontScale: v }),
      setPictogramMode: (v) => set({ pictogramMode: v }),
      setSensoryMode: (v) => set({ sensoryMode: v }),
    }),
    { name: "neuroplus-a11y" }
  )
)
