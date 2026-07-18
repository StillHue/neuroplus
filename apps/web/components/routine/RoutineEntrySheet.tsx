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
  { key: "FEEDING",    label: "Alimentação", Icon: Utensils, color: "#6fb7b0", fields: ["notes"]                    },
  { key: "SLEEP",      label: "Sono",        Icon: Moon,     color: "#6fb7b0", fields: ["duration", "notes"]        },
  { key: "CRISIS",     label: "Crise",       Icon: Zap,      color: "#6fb7b0", fields: ["duration", "severity", "notes"] },
  { key: "SCHOOL",     label: "Escola",      Icon: BookOpen, color: "#6fb7b0", fields: ["notes"]                    },
  { key: "MEDICATION", label: "Medicação",   Icon: Pill,     color: "#6fb7b0", fields: ["quantity", "notes"]        },
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
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[28px] bg-[#252830] shadow-sheet"
        role="dialog"
        aria-modal
        aria-label="Registrar rotina"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <span className="h-1 w-10 rounded-full bg-[#2f3340]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 pt-2">
          <h2 className="text-lg font-semibold text-[#edeef2]">Registrar</h2>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c1e26] text-[#9a9eab] transition-colors active:bg-[#2f3340]"
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
                  ? "bg-[#6fb7b0] text-[#1c1e26]"
                  : "bg-[#1c1e26] text-[#9a9eab] hover:bg-[#2f3340]"
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
              <span className="text-xs font-medium text-[#9a9eab]">Duração</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDuration((v) => Math.max(5, v - 15))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1e26] text-[#edeef2] active:bg-[#2f3340]"
                  aria-label="Diminuir"
                >
                  <Minus size={16} aria-hidden />
                </button>
                <span className="flex-1 text-center text-xl font-semibold text-[#edeef2]">
                  {durationMin >= 60
                    ? `${Math.floor(durationMin / 60)}h${durationMin % 60 > 0 ? `${durationMin % 60}min` : ""}`
                    : `${durationMin}min`}
                </span>
                <button
                  onClick={() => setDuration((v) => Math.min(720, v + 15))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1e26] text-[#edeef2] active:bg-[#2f3340]"
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
              <span className="text-xs font-medium text-[#9a9eab]">Intensidade da crise</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSeverity(v)}
                    className={cn(
                      "flex-1 rounded-xl py-3 text-sm font-semibold transition-all",
                      severity === v
                        ? "bg-[#6fb7b0] text-[#1c1e26]"
                        : "bg-[#1c1e26] text-[#9a9eab] hover:bg-[#2f3340]"
                    )}
                    aria-label={`Nível ${v}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-[#6b7080]">Leve</span>
                <span className="text-[10px] text-[#6b7080]">Severa</span>
              </div>
            </div>
          )}

          {/* Quantity (medication) */}
          {cfg.fields.includes("quantity") && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[#9a9eab]">Dosagem / Medicamento</span>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ex: Ritalina 10mg"
                className="rounded-xl border border-[#2f3340] bg-[#22252e] px-4 py-3 text-sm text-[#edeef2] outline-none focus:border-[#6fb7b0] focus:bg-[#252830] transition-colors placeholder:text-[#4a4d58]"
              />
            </label>
          )}

          {/* Notes */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#9a9eab]">Observações (opcional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="O que aconteceu?"
              rows={3}
              className="resize-none rounded-xl border border-[#2f3340] bg-[#22252e] px-4 py-3 text-sm text-[#edeef2] outline-none focus:border-[#6fb7b0] focus:bg-[#252830] transition-colors placeholder:text-[#4a4d58]"
            />
          </label>

          <button
            onClick={handleSave}
            className="w-full rounded-full bg-[#6fb7b0] py-4 text-sm font-semibold text-[#1c1e26] transition-opacity active:opacity-80"
          >
            Salvar registro
          </button>
        </div>
      </div>
    </>
  )
}
