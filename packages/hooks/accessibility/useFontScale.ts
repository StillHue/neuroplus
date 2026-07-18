import { useAccessibilityPrefs } from "./useAccessibilityPrefs"

export function useFontScale() {
  const { fontScale, setFontScale } = useAccessibilityPrefs()
  return { fontScale, setFontScale }
}
