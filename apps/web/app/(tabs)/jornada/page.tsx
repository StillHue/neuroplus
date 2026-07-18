"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { CheckCircle2, Lock, Circle } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { FilterTabs } from "@/components/ui/filter-tabs"
import { CollapsibleSection } from "@/components/ui/collapsible-section"
import { AiInsightCard } from "@/components/upsell/AiInsightCard"
import { PaywallSheet } from "@/components/upsell/PaywallSheet"
import { cn } from "@/lib/utils"
import { FileText, Crown } from "lucide-react"

const USER_PLAN = "FREE" as "FREE" | "PREMIUM"

type StepStatus = "done" | "active" | "waiting" | "blocked"
type Filter     = "all" | "done" | "pending"

interface JourneyStep {
  id: string
  label: string
  status: StepStatus
  detail?: string
  queueInfo?: string
}

interface Phase {
  title: string
  steps: JourneyStep[]
}

const PHASES: Phase[] = [
  {
    title: "Diagnóstico inicial",
    steps: [
      { id: "triagem",  label: "Triagem concluída",     status: "done",    detail: "Rota sugerida gerada em 12/06." },
      { id: "pediatra", label: "Consulta com pediatra", status: "done",    detail: "Encaminhamento para neuropediatra emitido." },
    ],
  },
  {
    title: "Especialistas",
    steps: [
      {
        id: "neuro",
        label: "Neuropediatra",
        status: "active",
        detail: "Você está na fila de espera do serviço público.",
        queueInfo: "Tempo médio: ~40 dias nesta região. Isso é comum na fila do SUS.",
      },
      { id: "psico", label: "Avaliação psicológica", status: "blocked", detail: "Liberado após consulta com neuropediatra." },
    ],
  },
  {
    title: "Acompanhamento",
    steps: [
      { id: "to", label: "Terapia ocupacional", status: "blocked", detail: "Depende da avaliação psicológica." },
      { id: "fo", label: "Fonoaudiologia",      status: "blocked", detail: "A definir conforme avaliação." },
    ],
  },
]

const FILTER_TABS = [
  { key: "all",     label: "Todos",      icon: "◈" },
  { key: "done",    label: "Concluídos", icon: "✓" },
  { key: "pending", label: "Pendentes",  icon: "◷" },
]

function matchesFilter(status: StepStatus, filter: Filter) {
  if (filter === "all") return true
  if (filter === "done") return status === "done"
  return status === "active" || status === "waiting" || status === "blocked"
}

export default function Jornada() {
  const hasAnySteps = PHASES.some((p) => p.steps.length > 0)
  return hasAnySteps ? <JornadaContent /> : <TriageCTA />
}

function JornadaContent() {
  const [filter, setFilter]       = useState<Filter>("all")
  const [paywallOpen, setPaywall] = useState(false)
  const pageRef                   = useRef<HTMLDivElement>(null)
  const headerRef                 = useRef<HTMLDivElement>(null)
  const tabsRef                   = useRef<HTMLDivElement>(null)
  const phasesRef                 = useRef<HTMLDivElement>(null)

  // ── Page-entry stagger ────────────────────────────────────────
  useGSAP(() => {
    if (!headerRef.current || !tabsRef.current) return
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(headerRef.current, { y: -20, opacity: 0, duration: 0.4 })
      .from(tabsRef.current,   { y: 12,  opacity: 0, duration: 0.32 }, "-=0.22")
      .from(".phase-card",     { y: 20,  opacity: 0, duration: 0.35, stagger: 0.1 }, "-=0.18")
  }, { scope: pageRef })

  useGSAP(() => {
    const cards = phasesRef.current?.querySelectorAll<HTMLDivElement>(".phase-card")
    if (!cards?.length) return
    gsap.from(cards, { y: 16, opacity: 0, duration: 0.35, ease: "power2.out", stagger: 0.08 })
  }, { scope: phasesRef, dependencies: [filter] })

  return (
    <div ref={pageRef} className="flex flex-col pb-nav">
      {/* Header */}
      <div ref={headerRef} className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Jornada</h1>
        <p className="mt-0.5 font-serif italic text-[var(--color-muted)] text-sm">
          Sua rota de diagnóstico e cuidado
        </p>
      </div>

      {/* Filter tabs */}
      <div ref={tabsRef} className="px-5 pb-4">
        <FilterTabs
          tabs={FILTER_TABS}
          active={filter}
          onChange={(k) => setFilter(k as Filter)}
        />
      </div>

      {/* AI Insight — locked for FREE */}
      <div className="px-5 pb-1">
        <AiInsightCard
          title="Padrão detectado nas crises de terça-feira"
          preview="Quando o João dorme menos de 7h, a chance de desregulação na escola aumenta em 40%. As crises das últimas 3 semanas seguem um padrão relacionado ao sono."
          isLocked={USER_PLAN === "FREE"}
          onUnlock={() => setPaywall(true)}
        />
      </div>

      {/* Phases */}
      <div ref={phasesRef} className="px-5 flex flex-col gap-3">
        {PHASES.map((phase) => {
          const visible = phase.steps.filter((s) => matchesFilter(s.status, filter))
          if (visible.length === 0) return null
          return (
            <div key={phase.title} className="phase-card rounded-2xl bg-[var(--color-surface)] shadow-card overflow-hidden">
              <div className="px-4 py-3">
                <CollapsibleSection title={phase.title}>
                  <ul className="flex flex-col">
                    {visible.map((step) => (
                      <StepRow key={step.id} step={step} />
                    ))}
                  </ul>
                </CollapsibleSection>
              </div>
            </div>
          )
        })}

        <Link
          href="/jornada/triagem"
          className="phase-card flex items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-4 text-sm font-medium text-[var(--color-muted)] transition-colors active:bg-[var(--color-bg)] shadow-card"
        >
          Refazer triagem
        </Link>

        {/* Export PDF — Premium gate */}
        <button
          onClick={() => USER_PLAN === "FREE" ? setPaywall(true) : window.open("/api/report?child=João", "_blank")}
          className="phase-card flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] px-4 py-4 shadow-card transition-colors active:bg-[var(--color-bg)]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg)] text-[var(--color-text)]">
            <FileText size={16} aria-hidden />
          </span>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-[var(--color-text)]">Exportar relatório PDF</p>
            <p className="text-xs text-[var(--color-muted)]">Formatado para levar ao médico</p>
          </div>
          {USER_PLAN === "FREE" && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-bg)] px-2 py-1 text-[10px] font-semibold text-[var(--color-muted)]">
              <Crown size={9} aria-hidden /> Premium
            </span>
          )}
        </button>
      </div>

      {paywallOpen && (
        <PaywallSheet
          onClose={() => setPaywall(false)}
          onSubscribe={() => setPaywall(false)}
        />
      )}
    </div>
  )
}

function StepRow({ step }: { step: JourneyStep }) {
  const [expanded, setExpanded] = useState(false)
  const detailRef = useRef<HTMLDivElement>(null)
  const done    = step.status === "done"
  const active  = step.status === "active"
  const blocked = step.status === "blocked"

  function toggle() {
    if (blocked) return
    const isOpening = !expanded
    setExpanded(isOpening)

    if (!detailRef.current) return
    if (isOpening) {
      gsap.set(detailRef.current,  { height: 0, opacity: 0, overflow: "hidden", display: "block" })
      gsap.to(detailRef.current,   { height: "auto", opacity: 1, duration: 0.28, ease: "power2.out",
        onComplete: () => gsap.set(detailRef.current, { overflow: "visible" }) })
    } else {
      gsap.set(detailRef.current,  { height: detailRef.current.scrollHeight, overflow: "hidden" })
      gsap.to(detailRef.current,   { height: 0, opacity: 0, duration: 0.2, ease: "power2.in" })
    }
  }

  return (
    <li className={cn("border-b border-[var(--color-border)] last:border-0", blocked && "opacity-50")}>
      <button
        onClick={toggle}
        disabled={blocked}
        className="flex w-full items-center gap-3 py-3 text-left"
        aria-expanded={expanded}
      >
        <span className="shrink-0">
          {done && <CheckCircle2 size={20} className="text-[var(--color-text)]" aria-hidden />}
          {active && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-accent)]">
              <Circle size={8} fill="var(--color-accent)" strokeWidth={0} aria-hidden />
            </span>
          )}
          {(step.status === "waiting" || blocked) && (
            <span className="flex h-5 w-5 items-center justify-center rounded-[6px] border-[1.5px] border-[var(--color-border-strong)] bg-[var(--color-surface)]">
              <Lock size={11} className="text-[var(--color-muted-3)]" aria-hidden />
            </span>
          )}
        </span>

        <span className={cn("flex-1 text-sm", done ? "text-[var(--color-muted-2)] line-through" : "text-[var(--color-text)] font-medium")}>
          {step.label}
        </span>

        {active && (
          <span className="ml-auto shrink-0 rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-accent-fg)]">
            Em fila
          </span>
        )}
      </button>

      {/* Always rendered — GSAP drives height */}
      <div ref={detailRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <div className="pb-3 pl-8">
          {step.detail && (
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">{step.detail}</p>
          )}
          {step.queueInfo && (
            <div className="mt-2 rounded-xl bg-[var(--color-bg)] px-3 py-2">
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">{step.queueInfo}</p>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

function TriageCTA() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-8 pt-24 pb-nav">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent)]">
        <span className="text-3xl text-[var(--color-accent)]">✦</span>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Comece pela triagem</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          Responda algumas perguntas para montarmos a rota certa para você.
        </p>
      </div>
      <Link
        href="/jornada/triagem"
        className="w-full max-w-xs rounded-full bg-[var(--color-accent)] py-4 text-center font-semibold text-[var(--color-accent-fg)] transition-opacity active:opacity-80"
      >
        Iniciar triagem
      </Link>
    </div>
  )
}
