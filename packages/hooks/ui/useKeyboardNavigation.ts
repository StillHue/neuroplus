import { useEffect, useRef } from "react"

export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return
    const focusable = containerRef.current.querySelectorAll<HTMLElement>(
      'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first)?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    first?.focus()
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [active])

  return containerRef
}
