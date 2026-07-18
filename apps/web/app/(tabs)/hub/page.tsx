"use client"

import { useState, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useHideNav } from "@/components/NavContext"
import { X, School, Stethoscope, Brain, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { FilterTabs } from "@/components/ui/filter-tabs"

interface ConsentItem {
  id: string
  label: string
  granted: boolean
}

interface Stakeholder {
  id: string
  Icon: React.ElementType
  name: string
  role: string
  items: ConsentItem[]
}

const initialStakeholders: Stakeholder[] = [
  {
    id: "escola",
    Icon: School,
    name: "Escola Municipal X",
    role: "Escola",
    items: [
      { id: "evolucao-escolar",  label: "Evolução escolar",    granted: true  },
      { id: "relatorio-terapia", label: "Relatório de terapia", granted: true  },
      { id: "laudo-medico",      label: "Laudo médico",         granted: false },
    ],
  },
  {
    id: "terapeuta",
    Icon: Stethoscope,
    name: "Dra. Ana",
    role: "Terapeuta",
    items: [
      { id: "evolucao-escolar",  label: "Evolução escolar",    granted: true },
      { id: "relatorio-terapia", label: "Relatório de terapia", granted: true },
      { id: "laudo-medico",      label: "Laudo médico",         granted: true },
    ],
  },
  {
    id: "neuro",
    Icon: Brain,
    name: "Dr. Carlos",
    role: "Neuropediatra",
    items: [
      { id: "evolucao-escolar",  label: "Evolução escolar",    granted: true  },
      { id: "relatorio-terapia", label: "Relatório de terapia", granted: false },
      { id: "laudo-medico",      label: "Laudo médico",         granted: false },
    ],
  },
]

const FILTER_TABS = [
  { key: "all",     label: "Todos"          },
  { key: "granted", label: "Compartilhando" },
  { key: "blocked", label: "Bloqueado"      },
]

export default function Hub() {
  const [stakeholders, setStakeholders] = useState(initialStakeholders)
  const [filter, setFilter]             = useState("all")
  const [revokeTarget, setRevokeTarget] = useState<{ sid: string; iid: string } | null>(null)

  const pageRef    = useRef<HTMLDivElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const tabsRef    = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)

  // ── Page-entry stagger ────────────────────────────────────────
  useGSAP(() => {
    if (!headerRef.current || !tabsRef.current) return
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(headerRef.current, { y: -20, opacity: 0, duration: 0.4 })
      .from(tabsRef.current,   { y: 12,  opacity: 0, duration: 0.32 }, "-=0.22")
      .from(".stakeholder-card", { y: 20, opacity: 0, duration: 0.35, stagger: 0.1 }, "-=0.18")
  }, { scope: pageRef })

  useGSAP(() => {
    const cards = cardsRef.current?.querySelectorAll<HTMLDivElement>(".stakeholder-card")
    if (!cards?.length) return
    gsap.from(cards, { y: 16, opacity: 0, duration: 0.3, ease: "power2.out", stagger: 0.08 })
  }, { scope: cardsRef, dependencies: [filter] })

  function grantItem(sid: string, iid: string) {
    setStakeholders((prev) =>
      prev.map((s) =>
        s.id === sid
          ? { ...s, items: s.items.map((i) => (i.id === iid ? { ...i, granted: true } : i)) }
          : s
      )
    )
  }

  function confirmRevoke() {
    if (!revokeTarget) return
    const { sid, iid } = revokeTarget
    setStakeholders((prev) =>
      prev.map((s) =>
        s.id === sid
          ? { ...s, items: s.items.map((i) => (i.id === iid ? { ...i, granted: false } : i)) }
          : s
      )
    )
    setRevokeTarget(null)
  }

  const revokeStakeholder = revokeTarget ? stakeholders.find((s) => s.id === revokeTarget.sid) : null
  const revokeItem = revokeStakeholder?.items.find((i) => i.id === revokeTarget?.iid)

  const filtered = stakeholders.filter((s) => {
    if (filter === "granted") return s.items.some((i) => i.granted)
    if (filter === "blocked") return s.items.some((i) => !i.granted)
    return true
  })

  return (
    <div ref={pageRef} className="flex flex-col pb-nav">
      {/* Header */}
      <div ref={headerRef} className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Hub</h1>
        <p className="mt-0.5 font-serif italic text-[var(--color-muted)] text-sm">
          Quem pode ver o quê sobre seu filho
        </p>
      </div>

      {/* Filter */}
      <div ref={tabsRef} className="px-5 pb-4">
        <FilterTabs tabs={FILTER_TABS} active={filter} onChange={setFilter} />
      </div>

      {/* Stakeholder cards */}
      <div ref={cardsRef} className="px-5 flex flex-col gap-3">
        {filtered.map((s) => (
          <StakeholderCard
            key={s.id}
            stakeholder={s}
            onGrant={(iid) => grantItem(s.id, iid)}
            onRevoke={(iid) => setRevokeTarget({ sid: s.id, iid })}
          />
        ))}
      </div>

      {revokeTarget && revokeStakeholder && revokeItem && (
        <RevokeSheet
          stakeholderName={revokeStakeholder.name}
          itemLabel={revokeItem.label}
          onConfirm={confirmRevoke}
          onCancel={() => setRevokeTarget(null)}
        />
      )}
    </div>
  )
}

function StakeholderCard({
  stakeholder,
  onGrant,
  onRevoke,
}: {
  stakeholder: Stakeholder
  onGrant: (iid: string) => void
  onRevoke: (iid: string) => void
}) {
  const [expanded, setExpanded]   = useState(false)
  const detailRef                 = useRef<HTMLDivElement>(null)
  const chevronRef                = useRef<SVGSVGElement>(null)
  const grantedCount              = stakeholder.items.filter((i) => i.granted).length
  const total                     = stakeholder.items.length
  const IconComponent             = stakeholder.Icon

  function toggleExpand() {
    const isOpening = !expanded
    setExpanded(isOpening)

    if (!detailRef.current || !chevronRef.current) return

    gsap.to(chevronRef.current, { rotation: isOpening ? 180 : 0, duration: 0.2, ease: "power2.inOut" })

    if (isOpening) {
      gsap.set(detailRef.current, { height: 0, opacity: 0, overflow: "hidden", display: "block" })
      gsap.to(detailRef.current, {
        height: "auto", opacity: 1, duration: 0.28, ease: "power2.out",
        onComplete: () => gsap.set(detailRef.current, { overflow: "visible" }),
      })
    } else {
      gsap.set(detailRef.current, { height: detailRef.current.scrollHeight, overflow: "hidden" })
      gsap.to(detailRef.current, { height: 0, opacity: 0, duration: 0.2, ease: "power2.in" })
    }
  }

  return (
    <div className="stakeholder-card overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-card">
      <button
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-[var(--color-bg)]"
        onClick={toggleExpand}
        aria-expanded={expanded}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg)] text-[var(--color-text)]">
          <IconComponent size={18} strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--color-text)]">{stakeholder.name}</p>
          <p className="text-xs text-[var(--color-muted)]">{stakeholder.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[var(--color-muted)]">{grantedCount}/{total}</span>
          <ChevronDown
            ref={chevronRef}
            size={15}
            className="text-[var(--color-muted-2)]"
            aria-hidden
          />
        </div>
      </button>

      {/* Always rendered — GSAP drives height */}
      <div ref={detailRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <div className="border-t border-[var(--color-border)] px-4 pb-3 pt-2">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-2)]">
            {stakeholder.name} pode ver:
          </p>
          <ul className="flex flex-col gap-1">
            {stakeholder.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-1.5">
                <span className="text-sm text-[var(--color-text)]">{item.label}</span>
                {item.granted ? (
                  <button
                    onClick={() => onRevoke(item.id)}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-[11px] font-semibold text-[var(--color-accent-fg)] transition-opacity active:opacity-75"
                    aria-label={`Parar de compartilhar ${item.label}`}
                  >
                    <Check size={11} aria-hidden />
                    Compartilhando
                  </button>
                ) : (
                  <button
                    onClick={() => onGrant(item.id)}
                    className="shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[11px] font-semibold text-[var(--color-muted)] transition-colors active:bg-[var(--color-bg)]"
                    aria-label={`Compartilhar ${item.label}`}
                  >
                    Não compartilhado
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function RevokeSheet({
  stakeholderName,
  itemLabel,
  onConfirm,
  onCancel,
}: {
  stakeholderName: string
  itemLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  useHideNav()
  const backdropRef = useRef<HTMLDivElement>(null)
  const sheetRef    = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(backdropRef.current, { opacity: 0, duration: 0.2 })
    gsap.from(sheetRef.current,    { y: "100%", duration: 0.3, ease: "power3.out" })
  })

  return (
    <>
      <div ref={backdropRef} className="fixed inset-0 z-40 bg-black/20" onClick={onCancel} aria-hidden />
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[24px] bg-[var(--color-surface)] p-6 shadow-sheet"
        role="dialog" aria-modal aria-labelledby="revoke-title"
      >
        <button
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-muted)] transition-colors active:bg-[var(--color-border)]"
          onClick={onCancel} aria-label="Cancelar"
        >
          <X size={18} aria-hidden />
        </button>

        <h2 id="revoke-title" className="pr-10 text-lg font-semibold text-[var(--color-text)]">
          Parar de compartilhar?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          <strong>{stakeholderName}</strong> vai perder acesso a{" "}
          <strong>{itemLabel}</strong>. Você pode voltar a compartilhar quando quiser.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full rounded-full bg-[var(--color-accent)] py-4 font-semibold text-[var(--color-accent-fg)] transition-opacity active:opacity-80"
          >
            Parar de compartilhar
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-full py-4 font-semibold text-[var(--color-muted)] transition-colors active:bg-[var(--color-bg)]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  )
}
