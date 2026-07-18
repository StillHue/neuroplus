"use client"

import { useState, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { X, Utensils, Moon, Zap, BookOpen, Pill, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

type Category = "FEEDING" | "SLEEP" | "CRISIS" | "SCHOOL" | "MEDICATION"

interface CategoryConfig {
  key: Category
  label: string
  Icon: React.ElementType
  color: string
  fields: ("duration" | "severity" | "notes" | "quantity")[]
}

const CATEGORIES: CategoryConfig[] = [
  { key: "FEEDING",    label: "Alimentação", Icon: Utensils, color: "#111111", fields: ["notes"]                    },
  { key: "SLEEP",      label: "Sono",        Icon: Moon,     color: "#111111", fields: ["duration", "notes"]        },
  { key: "CRISIS",     label: "Crise",       Icon: Zap,      color: "#111111", fields: ["duration", "severity", "notes"] },
  { key: "SCHOOL",     label: "Escola",      Icon: BookOpen, color: "#111111", fields: ["notes"]                    },
  { key: "MEDICATION", label: "Medicação",   Icon: Pill,     color: "#111111", fields: ["quantity", "notes"]        },
]

interface RoutineEntrySheetProps {
  onClose: () => void
  onSave: (entry: {
    category: Category
    occurredAt: Date
    durationMin?: number
    severity?: number
    notes?: string
  }) => void
}

export function RoutineEntrySheet({ onClose, onSave }: RoutineEntrySheetProps) {
  const [category, setCategory]   = useState<Category>("FEEDING")
  const [durationMin, setDuration] = useState(60)
  const [severity, setSeverity]   = useState(3)
  const [notes, setNotes]         = useState("")
  const [quantity, setQuantity]   = useState("")

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

  function handleSave() {
    const cfg = CATEGORIES.find((c) => c.key === category)!
    onSave({
      category,
      occurredAt: new Date(),
      durationMin: cfg.fields.includes("duration") ? durationMin : undefined,
      severity:    cfg.fields.includes("severity") ? severity    : undefined,
      notes:       notes.trim() || undefined,
    })
    handleClose()
  }

  const cfg = CATEGORIES.find((c) => c.key === category)!

  return (
    <>
      <div
        ref={backdropRef}
        className="fixed inset-0 z-40 bg-black/30"
        onClick={handleClose}
        aria-hidden
      />
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[28px] bg-white shadow-sheet"
        role="dialog"
        aria-modal
        aria-label="Registrar rotina"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <span className="h-1 w-10 rounded-full bg-[#EBEBEB]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 pt-2">
          <h2 className="text-lg font-semibold text-[#111111]">Registrar</h2>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F5] text-[#888888] transition-colors active:bg-[#EBEBEB]"
            aria-label="Fechar"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-5 scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
                category === c.key
                  ? "bg-[#111111] text-white"
                  : "bg-[#F5F5F5] text-[#666666] hover:bg-[#EBEBEB]"
              )}
            >
              <c.Icon size={15} aria-hidden />
              {c.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-5 px-5 pb-6">
          {/* Duration */}
          {cfg.fields.includes("duration") && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-[#666666]">Duração</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDuration((v) => Math.max(5, v - 15))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] text-[#111111] active:bg-[#EBEBEB]"
                  aria-label="Diminuir"
                >
                  <Minus size={16} aria-hidden />
                </button>
                <span className="flex-1 text-center text-xl font-semibold text-[#111111]">
                  {durationMin >= 60
                    ? `${Math.floor(durationMin / 60)}h${durationMin % 60 > 0 ? `${durationMin % 60}min` : ""}`
                    : `${durationMin}min`}
                </span>
                <button
                  onClick={() => setDuration((v) => Math.min(720, v + 15))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] text-[#111111] active:bg-[#EBEBEB]"
                  aria-label="Aumentar"
                >
                  <Plus size={16} aria-hidden />
                </button>
              </div>
            </div>
          )}

          {/* Severity */}
          {cfg.fields.includes("severity") && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-[#666666]">Intensidade da crise</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSeverity(v)}
                    className={cn(
                      "flex-1 rounded-xl py-3 text-sm font-semibold transition-all",
                      severity === v
                        ? "bg-[#111111] text-white"
                        : "bg-[#F5F5F5] text-[#888888] hover:bg-[#EBEBEB]"
                    )}
                    aria-label={`Nível ${v}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-[#AAAAAA]">Leve</span>
                <span className="text-[10px] text-[#AAAAAA]">Severa</span>
              </div>
            </div>
          )}

          {/* Quantity (medication) */}
          {cfg.fields.includes("quantity") && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[#666666]">Dosagem / Medicamento</span>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ex: Ritalina 10mg"
                className="rounded-xl border border-[#EBEBEB] bg-[#F9F9F9] px-4 py-3 text-sm text-[#111111] outline-none focus:border-[#111111] focus:bg-white transition-colors placeholder:text-[#CCCCCC]"
              />
            </label>
          )}

          {/* Notes */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#666666]">Observações (opcional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="O que aconteceu?"
              rows={3}
              className="resize-none rounded-xl border border-[#EBEBEB] bg-[#F9F9F9] px-4 py-3 text-sm text-[#111111] outline-none focus:border-[#111111] focus:bg-white transition-colors placeholder:text-[#CCCCCC]"
            />
          </label>

          <button
            onClick={handleSave}
            className="w-full rounded-full bg-[#111111] py-4 text-sm font-semibold text-white transition-opacity active:opacity-80"
          >
            Salvar registro
          </button>
        </div>
      </div>
    </>
  )
}
