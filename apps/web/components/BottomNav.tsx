"use client"

import { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2, User, Plus } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { cn } from "@/lib/utils"
import { useNav } from "@/components/NavContext"

interface TabItem {
  href: string
  label: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>
  badge?: boolean
}

const TABS: readonly TabItem[] = [
  { href: "/inicio",   label: "Home",     Icon: Home     },
  { href: "/jornada",  label: "Insights", Icon: BarChart2, badge: true },
  { href: "/cuidador", label: "Profile",  Icon: User     },
]

interface BottomNavProps {
  badges?: { jornada?: number }
}

export function BottomNav({ badges = {} }: BottomNavProps) {
  const pathname   = usePathname()
  const navRef     = useRef<HTMLElement>(null)
  const labelRefs  = useRef<(HTMLSpanElement | null)[]>([])
  const pillRefs   = useRef<(HTMLSpanElement | null)[]>([])
  const { hidden } = useNav()

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/")
  }

  // Mount: animate nav up from below
  useGSAP(() => {
    gsap.from(navRef.current, {
      y: 80,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
      delay: 0.1,
    })
  }, { scope: navRef })

  // Hide/show when a sheet is open
  useGSAP(() => {
    gsap.to(navRef.current, {
      y: hidden ? 120 : 0,
      opacity: hidden ? 0 : 1,
      duration: 0.3,
      ease: hidden ? "power2.in" : "power3.out",
      pointerEvents: hidden ? "none" : "auto",
    })
  }, { dependencies: [hidden], scope: navRef })

  // Active-tab change: expand label on active, collapse on inactive
  useGSAP(() => {
    TABS.forEach(({ href }, i) => {
      const label = labelRefs.current[i]
      const pill  = pillRefs.current[i]
      if (!label || !pill) return
      const active = isActive(href)

      if (active) {
        // Expand the pill width and reveal the label
        gsap.to(label, {
          maxWidth: 80,
          opacity: 1,
          duration: 0.28,
          ease: "power2.out",
        })
        gsap.to(pill, {
          paddingLeft:  "14px",
          paddingRight: "14px",
          duration: 0.28,
          ease: "power2.out",
        })
      } else {
        gsap.to(label, {
          maxWidth: 0,
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
        })
        gsap.to(pill, {
          paddingLeft:  "10px",
          paddingRight: "10px",
          duration: 0.18,
          ease: "power2.in",
        })
      }
    })
  }, { dependencies: [pathname], scope: navRef })

  return (
    <nav
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
      aria-label="Navegação principal"
    >
      {/* White pill */}
      <div
        className="pointer-events-auto flex w-full max-w-[398px] items-center rounded-full bg-[var(--color-surface)] shadow-nav px-2"
        style={{ height: "64px" }}
      >
        <ul className="flex flex-1 items-stretch" role="tablist">
          {TABS.map(({ href, label, Icon, badge }, i) => {
            const active     = isActive(href)
            const badgeCount = badge ? badges.jornada : undefined

            return (
              <li key={href} className="flex-1" role="none">
                <Link
                  href={href}
                  role="tab"
                  aria-selected={active}
                  aria-label={label}
                  className="relative flex h-full min-h-[44px] flex-col items-center justify-center"
                >
                  <span
                    ref={(el) => { pillRefs.current[i] = el }}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-full py-2 transition-colors",
                      active ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "text-[var(--color-muted-2)]",
                    )}
                    style={{
                      paddingLeft:  active ? "14px" : "10px",
                      paddingRight: active ? "14px" : "10px",
                    }}
                  >
                    <Icon size={18} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                    {/* Label: always rendered, GSAP controls maxWidth/opacity */}
                    <span
                      ref={(el) => { labelRefs.current[i] = el }}
                      className="overflow-hidden whitespace-nowrap text-[13px] font-semibold leading-none"
                      style={{
                        maxWidth: active ? 80 : 0,
                        opacity:  active ? 1  : 0,
                      }}
                      aria-hidden={!active}
                    >
                      {label}
                    </span>
                  </span>

                  {badgeCount != null && badgeCount > 0 && (
                    <span
                      className="absolute right-2 top-1.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[var(--color-accent)] px-0.5 text-[9px] font-bold leading-none text-[var(--color-accent-fg)]"
                      aria-label={`${badgeCount} atualizações`}
                    >
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* FAB */}
        <Link
          href="/jornada/triagem"
          aria-label="Iniciar triagem"
          className="ml-2 mr-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-fab transition-opacity active:opacity-80"
        >
          <Plus size={22} strokeWidth={2} aria-hidden />
        </Link>
      </div>
    </nav>
  )
}
