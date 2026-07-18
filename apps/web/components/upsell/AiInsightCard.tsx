"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Lock, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AiInsightCardProps {
  title: string
  preview: string        // shown to free users — teases but doesn't reveal
  isLocked: boolean      // true = FREE plan
  onUnlock?: () => void
}

export function AiInsightCard({ title, preview, isLocked, onUnlock }: AiInsightCardProps) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const lockRef  = useRef<HTMLDivElement>(null)
  const glowRef  = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(cardRef.current, { y: 16, opacity: 0, duration: 0.35, ease: "power2.out" })

    if (isLocked) {
      // Subtle pulse on the lock icon to draw attention
      gsap.to(lockRef.current, {
        scale: 1.15,
        duration: 0.8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 2,
      })
      // Glow shimmer
      gsap.to(glowRef.current, {
        opacity: 0.6,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    }
  }, { scope: cardRef })

  function handleUnlock() {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      scale: 0.97,
      duration: 0.08,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
      onComplete: onUnlock,
    })
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl shadow-card",
        isLocked ? "bg-[#111111]" : "bg-white"
      )}
    >
      {/* Glow overlay for locked state */}
      {isLocked && (
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background: "radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
          aria-hidden
        />
      )}

      <div className="px-4 py-4">
        {/* Header row */}
        <div className="mb-3 flex items-center gap-2">
          <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", isLocked ? "bg-white/10" : "bg-[#F5F5F5]")}>
            <Sparkles size={14} className={isLocked ? "text-white" : "text-[#111111]"} aria-hidden />
          </span>
          <span className={cn("text-[11px] font-semibold uppercase tracking-wider", isLocked ? "text-white/60" : "text-[#AAAAAA]")}>
            Alerta da IA
          </span>
        </div>

        {/* Title */}
        <p className={cn("text-sm font-semibold leading-snug mb-2", isLocked ? "text-white" : "text-[#111111]")}>
          {title}
        </p>

        {/* Preview / locked content */}
        {isLocked ? (
          <>
            {/* Blurred preview text */}
            <p className="mb-4 text-xs leading-relaxed text-white/60 select-none" aria-hidden>
              {preview}
            </p>
            {/* Blur mask over the text */}
            <div className="pointer-events-none absolute left-4 right-4 h-8 -mt-10"
              style={{ background: "linear-gradient(to bottom, transparent, #111111)" }}
              aria-hidden
            />

            <button
              onClick={handleUnlock}
              className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 transition-opacity active:opacity-80"
            >
              <div className="flex items-center gap-2">
                <div ref={lockRef}>
                  <Lock size={15} className="text-[#111111]" aria-hidden />
                </div>
                <span className="text-sm font-semibold text-[#111111]">Ver análise completa</span>
              </div>
              <ChevronRight size={15} className="text-[#888888]" aria-hidden />
            </button>

            <p className="mt-2 text-center text-[10px] text-white/40">
              Disponível no plano Premium
            </p>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-[#666666]">{preview}</p>
        )}
      </div>
    </div>
  )
}
