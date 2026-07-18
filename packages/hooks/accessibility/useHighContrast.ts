import { useAccessibilityPrefs } from "./useAccessibilityPrefs"

export function useHighContrast() {
  const { highContrast, setHighContrast } = useAccessibilityPrefs()
  return { highContrast, setHighContrast }
}
