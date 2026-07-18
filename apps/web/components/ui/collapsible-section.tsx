"use client"

import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { cn } from "@/lib/utils"

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const chevronWrapRef = useRef<HTMLSpanElement>(null)
  const initialized = useRef(false)

  // Set initial state without animation on mount
  useGSAP(() => {
    if (!contentRef.current) return
    gsap.set(contentRef.current, {
      height: defaultOpen ? "auto" : 0,
      overflow: "hidden",
      opacity: defaultOpen ? 1 : 0,
    })
    initialized.current = true
  }, [])

  function toggle() {
    if (!contentRef.current || !chevronRef.current) return
    const isOpening = !open

    if (isOpening) {
      // Reveal: measure natural height, tween from 0 → that height → auto
      gsap.set(contentRef.current, { height: 0, opacity: 0, overflow: "hidden", display: "block" })
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => gsap.set(contentRef.current, { overflow: "visible" }),
      })
    } else {
      // Collapse: freeze current height, tween to 0
      gsap.set(contentRef.current, {
        height: contentRef.current.scrollHeight,
        overflow: "hidden",
      })
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
      })
    }

    gsap.to(chevronWrapRef.current, {
      rotation: isOpening ? 0 : -90,
      duration: 0.22,
      ease: "power2.inOut",
    })

    setOpen(isOpening)
  }

  return (
    <div>
      <button
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 py-2 text-left"
      >
        <span
          ref={chevronWrapRef}
          className="inline-flex"
          style={{ rotate: open ? "0deg" : "-90deg" }}
          aria-hidden
        >
          <ChevronDown size={16} strokeWidth={2.5} className="text-[#111111]" />
        </span>
        <span className="text-[13px] font-semibold text-[#111111]">{title}</span>
      </button>

      {/* Always rendered — GSAP controls visibility via height/opacity */}
      <div ref={contentRef} style={{ overflow: "hidden" }}>
        {children}
      </div>
    </div>
  )
}
