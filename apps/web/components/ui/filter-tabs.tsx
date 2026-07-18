"use client"

import { useRef, useLayoutEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { cn } from "@/lib/utils"

interface FilterTab {
  key: string
  label: string
  icon?: React.ReactNode
}

interface FilterTabsProps {
  tabs: FilterTab[]
  active: string
  onChange: (key: string) => void
}

export function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pillRef      = useRef<HTMLSpanElement>(null)
  const prevActive   = useRef<string>(active)

  function getTabEl(key: string) {
    return containerRef.current?.querySelector<HTMLButtonElement>(`[data-key="${key}"]`)
  }

  // On mount — position the pill without animating
  useLayoutEffect(() => {
    const el = getTabEl(active)
    if (!el || !pillRef.current || !containerRef.current) return
    const parentRect = containerRef.current.getBoundingClientRect()
    const rect       = el.getBoundingClientRect()
    gsap.set(pillRef.current, {
      x:     rect.left - parentRect.left,
      width: rect.width,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On active change — slide pill to new tab
  useGSAP(() => {
    if (prevActive.current === active) return
    prevActive.current = active

    const el = getTabEl(active)
    if (!el || !pillRef.current || !containerRef.current) return
    const parentRect = containerRef.current.getBoundingClientRect()
    const rect       = el.getBoundingClientRect()

    gsap.to(pillRef.current, {
      x:        rect.left - parentRect.left,
      width:    rect.width,
      duration: 0.28,
      ease:     "power2.inOut",
    })
  }, { dependencies: [active], scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-1 rounded-full bg-[var(--color-surface)] p-1 shadow-card"
      role="tablist"
    >
      {/* Sliding pill — absolutely positioned, driven by GSAP */}
      <span
        ref={pillRef}
        className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-[var(--color-accent)] shadow-sm"
        aria-hidden
      />

      {tabs.map((t) => (
        <button
          key={t.key}
          data-key={t.key}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium leading-none transition-colors duration-200",
            active === t.key ? "text-[var(--color-accent-fg)]" : "text-[var(--color-muted-2)] hover:text-[var(--color-muted)]"
          )}
        >
          {t.icon && <span aria-hidden>{t.icon}</span>}
          {t.label}
        </button>
      ))}
    </div>
  )
}
