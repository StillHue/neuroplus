"use client"

import { useState, useRef } from "react"
import { Sun, Moon, Utensils, Moon as MoonIcon, Zap, BookOpen, Pill } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import { DateStrip } from "@/components/ui/date-strip"
import { FilterTabs } from "@/components/ui/filter-tabs"
import { CollapsibleSection } from "@/components/ui/collapsible-section"
import { RoutineEntrySheet } from "@/components/routine/RoutineEntrySheet"
import { cn } from "@/lib/utils"

type Category = "FEEDING" | "SLEEP" | "CRISIS" | "SCHOOL" | "MEDICATION"
type Filter    = "today" | "week" | "all"

interface RoutineEntry {
  id: string
  category: Category
  occurredAt: Date
  durationMin?: number
  severity?: number
  notes?: string
}

const CATEGORY_META: Record<Category, { label: string; Icon: React.ElementType }> = {
  FEEDING:    { label: "Alimentação", Icon: Utensils  },
  SLEEP:      { label: "Sono",        Icon: MoonIcon  },
  CRISIS:     { label: "Crise",       Icon: Zap       },
  SCHOOL:     { label: "Escola",      Icon: BookOpen  },
  MEDICATION: { label: "Medicação",   Icon: Pill      },
}

const MOCK_ENTRIES: RoutineEntry[] = [
  { id: "1", category: "SLEEP",   occurredAt: new Date(), durationMin: 480, notes: "Dormiu bem" },
  { id: "2", category: "FEEDING", occurredAt: new Date(), notes: "Recusou o almoço"             },
  { id: "3", category: "CRISIS",  occurredAt: new Date(), severity: 2, durationMin: 15, notes: "Sensível ao barulho da rua" },
  { id: "4", category: "SCHOOL",  occurredAt: new Date(), notes: "Boa participação na aula"      },
]

const FILTER_TABS = [
  { key: "today", label: "Hoje"    },
  { key: "week",  label: "Semana"  },
  { key: "all",   label: "Tudo"    },
]

const GROUPS: { label: string; categories: Category[] }[] = [
  { label: "Manhã",   categories: ["SLEEP", "MEDICATION"] },
  { label: "Tarde",   categories: ["FEEDING", "SCHOOL"]   },
  { label: "Noite",   categories: ["CRISIS"]               },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: "Bom dia",  Icon: Sun  }
  if (h < 18) return { text: "Boa tarde", Icon: Sun  }
  return           { text: "Boa noite",  Icon: Moon }
}

export default function Inicio() {
  const [entries, setEntries]     = useState<RoutineEntry[]>(MOCK_ENTRIES)
  const [filter, setFilter]       = useState<Filter>("today")
  const [sheetOpen, setSheetOpen] = useState(false)

  const pageRef   = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const dateRef   = useRef<HTMLDivElement>(null)
  const tabsRef   = useRef<HTMLDivElement>(null)
  const listRef   = useRef<HTMLDivElement>(null)

  const { text: greeting, Icon: GreetIcon } = getGreeting()

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(headerRef.current, { y: -20, opacity: 0, duration: 0.45 })
      .from(dateRef.current,   { y: 16,  opacity: 0, duration: 0.38 }, "-=0.25")
      .from(tabsRef.current,   { y: 12,  opacity: 0, duration: 0.32 }, "-=0.22")
      .from(listRef.current,   { y: 20,  opacity: 0, duration: 0.35 }, "-=0.18")
  }, { scope: pageRef })

  useGSAP(() => {
    const rows = listRef.current?.querySelectorAll<HTMLElement>(".entry-row")
    if (!rows?.length) return
    gsap.from(rows, { opacity: 0, x: -8, duration: 0.3, ease: "power2.out", stagger: 0.05 })
  }, { scope: listRef, dependencies: [filter] })

  function addEntry(e: Omit<RoutineEntry, "id">) {
    const newEntry: RoutineEntry = { ...e, id: String(Date.now()) }
    setEntries((prev) => [newEntry, ...prev])
    // Animate the new card in
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelector(".entry-row")
      if (el) gsap.from(el, { y: 16, opacity: 0, duration: 0.3, ease: "power2.out" })
    })
  }

  const visible = entries // TODO: filter by date when real data

  return (
    <div ref={pageRef} className="flex flex-col pb-nav">
      {/* Header */}
      <div ref={headerRef} className="px-5 pt-8 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#edeef2] leading-snug">
              {greeting}, Ana
            </h1>
            <p className="mt-0.5 font-serif italic text-[#9a9eab] text-sm">
              Como o João está hoje?
            </p>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#252830] shadow-card text-[#edeef2] active:bg-[#252830]"
            aria-label="Hora do dia"
          >
            <GreetIcon size={18} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>

      {/* Date strip */}
      <div ref={dateRef} className="px-5 pb-4">
        <div className="rounded-2xl bg-[#252830] p-3 shadow-card">
          <DateStrip />
        </div>
      </div>

      {/* Filter tabs */}
      <div ref={tabsRef} className="px-5 pb-4">
        <FilterTabs
          tabs={FILTER_TABS}
          active={filter}
          onChange={(k) => setFilter(k as Filter)}
        />
      </div>

      {/* Entry list */}
      <div ref={listRef} className="px-5 flex flex-col gap-3">
        {/* Quick add banner */}
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-3 rounded-2xl border border-dashed border-[#3a3f4d] bg-[#252830] px-4 py-3.5 text-sm text-[#6b7080] transition-colors active:bg-[#1c1e26] shadow-card"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1c1e26] text-[#edeef2] text-lg font-light">+</span>
          Registrar alimentação, sono, crise…
        </button>

        {/* Groups */}
        {GROUPS.map((group) => {
          const groupEntries = visible.filter((e) => group.categories.includes(e.category))
          if (groupEntries.length === 0) return null
          return (
            <div key={group.label} className="rounded-2xl bg-[#252830] shadow-card overflow-hidden">
              <div className="px-4 py-3">
                <CollapsibleSection title={group.label}>
                  <ul className="flex flex-col">
                    {groupEntries.map((entry) => (
                      <EntryRow key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </CollapsibleSection>
              </div>
            </div>
          )
        })}

        {/* Entries not in any group */}
        {(() => {
          const groupedCategories = GROUPS.flatMap((g) => g.categories)
          const ungrouped = visible.filter((e) => !groupedCategories.includes(e.category))
          if (!ungrouped.length) return null
          return (
            <div className="rounded-2xl bg-[#252830] shadow-card overflow-hidden">
              <div className="px-4 py-3">
                <CollapsibleSection title="Outros">
                  <ul className="flex flex-col">
                    {ungrouped.map((entry) => (
                      <EntryRow key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </CollapsibleSection>
              </div>
            </div>
          )
        })()}

        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-[#252830] px-6 py-10 shadow-card text-center">
            <span className="text-3xl">📋</span>
            <p className="text-sm font-medium text-[#edeef2]">Nenhum registro hoje</p>
            <p className="text-xs text-[#9a9eab]">Toque em "Registrar" para começar a acompanhar a rotina do João.</p>
            <button
              onClick={() => setSheetOpen(true)}
              className="mt-1 rounded-full bg-[#6fb7b0] px-6 py-3 text-sm font-semibold text-[#1c1e26]"
            >
              Fazer primeiro registro
            </button>
          </div>
        )}
      </div>

      {sheetOpen && (
        <RoutineEntrySheet
          onClose={() => setSheetOpen(false)}
          onSave={addEntry}
        />
      )}
    </div>
  )
}

function EntryRow({ entry }: { entry: RoutineEntry }) {
  const meta = CATEGORY_META[entry.category]

  function formatDetail() {
    const parts: string[] = []
    if (entry.durationMin) {
      const h = Math.floor(entry.durationMin / 60)
      const m = entry.durationMin % 60
      parts.push(h > 0 ? `${h}h${m > 0 ? `${m}min` : ""}` : `${m}min`)
    }
    if (entry.severity) parts.push(`Intensidade ${entry.severity}/5`)
    if (entry.notes) parts.push(entry.notes)
    return parts.join(" · ")
  }

  return (
    <li className="entry-row flex items-start gap-3 border-b border-[#2f3340] py-3 last:border-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1c1e26] text-[#edeef2]">
        <meta.Icon size={15} strokeWidth={1.75} aria-hidden />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#edeef2]">{meta.label}</p>
        {formatDetail() && (
          <p className="mt-0.5 truncate text-xs text-[#9a9eab]">{formatDetail()}</p>
        )}
      </div>
      <span className="shrink-0 text-[11px] text-[#6b7080]">
        {entry.occurredAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </li>
  )
}
