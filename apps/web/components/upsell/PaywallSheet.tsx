"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { X, Sparkles, FileText, Users, Mic, Check } from "lucide-react"

const PREMIUM_FEATURES = [
  { Icon: Sparkles, label: "Insights preditivos da IA desbloqueados" },
  { Icon: Users,    label: "Multi-cuidador — pai, avó, babá, professora" },
  { Icon: FileText, label: "Exportação de relatório PDF para consultas" },
  { Icon: Mic,      label: "Registro por áudio — fale, a IA preenche" },
]

interface PaywallSheetProps {
  onClose: () => void
  onSubscribe: () => void
}

export function PaywallSheet({ onClose, onSubscribe }: PaywallSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const sheetRef    = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(backdropRef.current, { opacity: 0, duration: 0.2 })
    gsap.from(sheetRef.current,    { y: "100%", duration: 0.35, ease: "power3.out" })
  })

  function handleClose() {
    gsap.to(sheetRef.current,    { y: "100%", duration: 0.25, ease: "power2.in" })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2, onComplete: onClose })
  }

  return (
    <>
      <div ref={backdropRef} className="fixed inset-0 z-40 bg-black/40" onClick={handleClose} aria-hidden />
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[28px] bg-[var(--color-surface)] shadow-sheet"
        role="dialog" aria-modal aria-label="Assinar Premium"
      >
        <div className="flex justify-center pt-3 pb-1">
          <span className="h-1 w-10 rounded-full bg-[var(--color-border)]" />
        </div>

        <div className="px-5 pb-8 pt-3">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-accent)]">
                <Sparkles size={15} className="text-[var(--color-accent-fg)]" aria-hidden />
              </span>
              <span className="font-semibold text-[var(--color-text)]">neuroplus Premium</span>
            </div>
            <button
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-muted)]"
              aria-label="Fechar"
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <p className="mb-5 text-sm leading-relaxed text-[var(--color-muted)]">
            Desbloqueie análises completas da IA, histórico ilimitado e muito mais para apoiar sua família.
          </p>

          <ul className="mb-6 flex flex-col gap-3">
            {PREMIUM_FEATURES.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg)]">
                  <Icon size={14} className="text-[var(--color-text)]" aria-hidden />
                </span>
                <span className="text-sm text-[var(--color-text)]">{label}</span>
                <Check size={14} className="ml-auto text-[var(--color-text)]" aria-hidden />
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div className="mb-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-4">
            <div className="flex items-end gap-1.5">
              <span className="text-3xl font-bold text-[var(--color-text)]">R$29</span>
              <span className="mb-1 text-sm text-[var(--color-muted)]">/mês</span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">Cancele quando quiser. Sem fidelidade.</p>
          </div>

          <button
            onClick={onSubscribe}
            className="w-full rounded-full bg-[var(--color-accent)] py-4 text-sm font-semibold text-[var(--color-accent-fg)] transition-opacity active:opacity-80"
          >
            Assinar Premium
          </button>

          <p className="mt-3 text-center text-[11px] text-[var(--color-muted-2)]">
            7 dias grátis para experimentar
          </p>
        </div>
      </div>
    </>
  )
}
