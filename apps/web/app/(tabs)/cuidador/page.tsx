"use client"

import { useState, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useHideNav } from "@/components/NavContext"
import {
  Frown, Meh, Smile, SmilePlus, Laugh,
  PenLine, Send, Lightbulb, CheckCircle2,
  UserPlus, X, Users, Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CollapsibleSection } from "@/components/ui/collapsible-section"
import { PaywallSheet } from "@/components/upsell/PaywallSheet"
import { AudioRecorder } from "@/components/routine/AudioRecorder"
import { ThemeToggle } from "@/components/ThemeToggle"

const USER_PLAN = "FREE" as "FREE" | "PREMIUM"

type WellbeingLevel = 1 | 2 | 3 | 4 | 5
type CaregiverRole  = "MOM" | "DAD" | "GRANDPARENT" | "BABYSITTER" | "TEACHER" | "OTHER"

const WELLBEING_OPTIONS: { level: WellbeingLevel; Icon: React.ElementType; label: string }[] = [
  { level: 1, Icon: Frown,     label: "Difícil"       },
  { level: 2, Icon: Meh,       label: "Mais ou menos" },
  { level: 3, Icon: Smile,     label: "Ok"            },
  { level: 4, Icon: SmilePlus, label: "Bem"           },
  { level: 5, Icon: Laugh,     label: "Ótimo"         },
]

const ROLE_LABELS: Record<CaregiverRole, string> = {
  MOM:        "Mãe",
  DAD:        "Pai",
  GRANDPARENT:"Avó/Avô",
  BABYSITTER: "Babá",
  TEACHER:    "Professora",
  OTHER:      "Cuidador(a)",
}

interface Caregiver {
  id: string
  name: string
  email: string
  role: CaregiverRole
  isOwner?: boolean
}

interface Note {
  id: string
  text: string
  createdAt: string
  insight?: string
}

const INITIAL_CAREGIVERS: Caregiver[] = [
  { id: "1", name: "Ana Silva",  email: "ana@neuroplus.app", role: "MOM", isOwner: true },
]

const MOCK_NOTES: Note[] = [
  {
    id: "1",
    text: "Ele ficou muito ansioso antes da consulta de hoje, não queria sair de casa.",
    createdAt: "Hoje, 14h32",
    insight: "Padrão observado: ansiedade pré-consulta apareceu 3 vezes esse mês.",
  },
  {
    id: "2",
    text: "Dormiu bem essa semana. Rotina de dormir às 21h parece estar funcionando.",
    createdAt: "Ontem, 21h05",
  },
]

export default function Cuidador() {
  const [wellbeing, setWellbeing]     = useState<WellbeingLevel | null>(null)
  const [checkinDone, setCheckinDone] = useState(false)
  const [notes, setNotes]             = useState<Note[]>(MOCK_NOTES)
  const [draft, setDraft]             = useState("")
  const [analyzing, setAnalyzing]     = useState(false)
  const [caregivers, setCaregivers]   = useState<Caregiver[]>(INITIAL_CAREGIVERS)
  const [inviteOpen, setInviteOpen]   = useState(false)
  const [paywallOpen, setPaywall]     = useState(false)

  const pageRef   = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef  = useRef<HTMLDivElement>(null)
  const notesRef  = useRef<HTMLUListElement>(null)

  useGSAP(() => {
    if (!headerRef.current) return
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(headerRef.current, { y: -20, opacity: 0, duration: 0.4 })
      .from(".care-card",      { y: 20,  opacity: 0, duration: 0.35, stagger: 0.1 }, "-=0.22")
  }, { scope: pageRef })

  useGSAP(() => {
    const items = notesRef.current?.querySelectorAll<HTMLElement>(".note-item")
    if (!items?.length) return
    gsap.from(items, { y: 12, opacity: 0, duration: 0.28, ease: "power2.out", stagger: 0.06 })
  }, { scope: notesRef, dependencies: [notes.length] })

  function handleCheckin(level: WellbeingLevel) {
    setWellbeing(level)
    setTimeout(() => setCheckinDone(true), 400)
  }

  async function submitNote() {
    if (!draft.trim()) return
    const newNote: Note = { id: Date.now().toString(), text: draft.trim(), createdAt: "Agora" }
    setNotes((prev) => [newNote, ...prev])
    setDraft("")
    setAnalyzing(true)
    setTimeout(() => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === newNote.id
            ? { ...n, insight: "Anotação registrada. O app vai identificar padrões ao longo do tempo." }
            : n
        )
      )
      setAnalyzing(false)
    }, 1800)
  }

  function handleInvite() {
    if (USER_PLAN === "FREE") { setPaywall(true); return }
    setInviteOpen(true)
  }

  function removeCaregiver(id: string) {
    setCaregivers((prev) => prev.filter((c) => c.id !== id))
  }

  const selectedOption = wellbeing ? WELLBEING_OPTIONS.find((o) => o.level === wellbeing) : null

  return (
    <div ref={pageRef} className="flex min-h-full flex-col bg-[var(--color-bg)] pb-nav">
      <div ref={headerRef} className="px-5 pt-8 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-text)]">Seu espaço</h1>
            <p className="mt-0.5 font-serif italic text-[var(--color-muted)] text-sm">
              Aqui o cuidado é sobre você
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div ref={cardsRef} className="flex flex-col gap-3 px-5">
        {/* Check-in */}
        <div className="care-card rounded-2xl bg-[var(--color-surface)] shadow-card overflow-hidden">
          <div className="px-4 py-3">
            <CollapsibleSection title="Como você está hoje?">
              {!checkinDone ? (
                <div className="flex justify-between pt-1 pb-2">
                  {WELLBEING_OPTIONS.map(({ level, Icon, label }) => (
                    <button
                      key={level}
                      onClick={() => handleCheckin(level)}
                      aria-label={label}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 transition-all active:scale-95",
                        wellbeing === level ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] scale-105" : "text-[var(--color-muted-2)] hover:bg-[var(--color-bg)]"
                      )}
                    >
                      <Icon size={26} strokeWidth={1.5} aria-hidden className={wellbeing === level ? "text-[var(--color-accent-fg)]" : ""} />
                      <span className="text-[10px] leading-none">{label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2">
                  {selectedOption && <selectedOption.Icon size={28} strokeWidth={1.5} className="text-[var(--color-text)]" aria-hidden />}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-text)]">Registrado</p>
                    <p className="text-xs text-[var(--color-muted)]">Obrigado por se cuidar.</p>
                  </div>
                  <CheckCircle2 size={18} className="text-[var(--color-text)]" aria-hidden />
                </div>
              )}
            </CollapsibleSection>
          </div>
        </div>

        {/* Multi-cuidador */}
        <div className="care-card rounded-2xl bg-[var(--color-surface)] shadow-card overflow-hidden">
          <div className="px-4 py-3">
            <CollapsibleSection title="Cuidadores">
              <div className="pb-1">
                <ul className="flex flex-col gap-0.5 mb-3">
                  {caregivers.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 py-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-text)]">
                        <Users size={14} aria-hidden />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text)] truncate">{c.name}</p>
                        <p className="text-xs text-[var(--color-muted)]">{ROLE_LABELS[c.role]}</p>
                      </div>
                      {c.isOwner ? (
                        <span className="flex items-center gap-1 rounded-full bg-[var(--color-bg)] px-2 py-1 text-[10px] font-semibold text-[var(--color-muted)]">
                          <Crown size={10} aria-hidden /> Você
                        </span>
                      ) : (
                        <button
                          onClick={() => removeCaregiver(c.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-muted-2)] transition-colors hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
                          aria-label={`Remover ${c.name}`}
                        >
                          <X size={14} aria-hidden />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleInvite}
                  className="flex w-full items-center gap-2 rounded-xl border border-dashed border-[var(--color-border-strong)] px-4 py-3 text-sm text-[var(--color-muted)] transition-colors active:bg-[var(--color-bg)]"
                >
                  <UserPlus size={15} aria-hidden />
                  Convidar cuidador
                  {USER_PLAN === "FREE" && (
                    <span className="ml-auto flex items-center gap-1 rounded-full bg-[var(--color-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-muted)]">
                      <Crown size={9} aria-hidden /> Premium
                    </span>
                  )}
                </button>
              </div>
            </CollapsibleSection>
          </div>
        </div>

        {/* Notes input */}
        <div className="care-card rounded-2xl bg-[var(--color-surface)] shadow-card">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <PenLine size={14} className="text-[var(--color-muted-2)]" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-2)]">Bloco de notas</span>
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escreva o que está na sua cabeça — observações, percepções, dúvidas…"
              rows={3}
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted-3)]"
              aria-label="Nova nota"
            />
            {draft.trim() && (
              <div className="mt-2 flex justify-end border-t border-[var(--color-border)] pt-2">
                <button
                  onClick={submitNote}
                  disabled={analyzing}
                  className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-[var(--color-accent-fg)] transition-opacity active:opacity-80 disabled:opacity-40"
                >
                  <Send size={12} aria-hidden />
                  Salvar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Audio recorder — Premium */}
        <AudioRecorder
          isPremium={USER_PLAN === "PREMIUM"}
          onEntries={(entries) => {
            entries.forEach((e) => {
              const newNote: Note = {
                id: Date.now().toString() + Math.random(),
                text: `[${e.category}] ${e.notes}`,
                createdAt: "Agora",
              }
              setNotes((prev) => [newNote, ...prev])
            })
          }}
        />

        {/* Saved notes */}
        {notes.length > 0 && (
          <div className="care-card rounded-2xl bg-[var(--color-surface)] shadow-card overflow-hidden">
            <div className="px-4 py-3">
              <CollapsibleSection title="Anotações">
                <ul ref={notesRef} className="flex flex-col">
                  {notes.map((note) => (
                    <NoteCard key={note.id} note={note} analyzing={analyzing && !note.insight} />
                  ))}
                </ul>
              </CollapsibleSection>
            </div>
          </div>
        )}
      </div>

      {inviteOpen && (
        <InviteSheet onClose={() => setInviteOpen(false)} onInvite={(c) => { setCaregivers((p) => [...p, c]); setInviteOpen(false) }} />
      )}
      {paywallOpen && (
        <PaywallSheet onClose={() => setPaywall(false)} onSubscribe={() => setPaywall(false)} />
      )}
    </div>
  )
}

function NoteCard({ note, analyzing }: { note: Note; analyzing: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    gsap.from(ref.current, { y: 12, opacity: 0, duration: 0.25, ease: "power2.out" })
  }, { scope: ref })

  return (
    <div ref={ref} className="note-item border-b border-[var(--color-border)] last:border-0 py-3">
      <p className="text-sm leading-relaxed text-[var(--color-text)]">{note.text}</p>
      <p className="mt-1 text-[11px] text-[var(--color-muted-2)]">{note.createdAt}</p>
      {analyzing && (
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-[var(--color-bg)] px-3 py-2">
          <span className="text-xs text-[var(--color-muted)]">Analisando</span>
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[var(--color-muted-2)]" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </span>
        </div>
      )}
      {note.insight && (
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-[var(--color-bg)] px-3 py-2.5">
          <Lightbulb size={13} className="mt-0.5 shrink-0 text-[var(--color-muted)]" aria-hidden />
          <p className="text-xs leading-relaxed text-[var(--color-muted)]">{note.insight}</p>
        </div>
      )}
    </div>
  )
}

// ─── Invite Sheet ─────────────────────────────────────────────────────────────

const ROLE_OPTIONS: { value: CaregiverRole; label: string }[] = [
  { value: "DAD",         label: "Pai"          },
  { value: "GRANDPARENT", label: "Avó / Avô"   },
  { value: "BABYSITTER",  label: "Babá"         },
  { value: "TEACHER",     label: "Professora"   },
  { value: "OTHER",       label: "Outro"        },
]

function InviteSheet({
  onClose,
  onInvite,
}: {
  onClose: () => void
  onInvite: (c: Caregiver) => void
}) {
  useHideNav()
  const [name, setName]   = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole]   = useState<CaregiverRole>("DAD")
  const backdropRef       = useRef<HTMLDivElement>(null)
  const sheetRef          = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(backdropRef.current, { opacity: 0, duration: 0.2 })
    gsap.from(sheetRef.current,    { y: "100%", duration: 0.35, ease: "power3.out" })
  })

  function handleClose() {
    gsap.to(sheetRef.current,    { y: "100%", duration: 0.25, ease: "power2.in" })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2, onComplete: onClose })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    onInvite({ id: Date.now().toString(), name: name.trim(), email: email.trim(), role })
  }

  return (
    <>
      <div ref={backdropRef} className="fixed inset-0 z-40 bg-black/30" onClick={handleClose} aria-hidden />
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[28px] bg-[var(--color-surface)] shadow-sheet"
        role="dialog" aria-modal aria-label="Convidar cuidador"
      >
        <div className="flex justify-center pt-3 pb-1">
          <span className="h-1 w-10 rounded-full bg-[var(--color-border)]" />
        </div>
        <div className="flex items-center justify-between px-5 pb-4 pt-2">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Convidar cuidador</h2>
          <button onClick={handleClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-muted)]" aria-label="Fechar">
            <X size={18} aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pb-8">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Nome</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Carlos Silva" required
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-surface)] transition-colors placeholder:text-[var(--color-muted-3)]" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">E-mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" required
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-surface)] transition-colors placeholder:text-[var(--color-muted-3)]" />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Papel</span>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => setRole(opt.value)}
                  className={cn("rounded-full px-4 py-2 text-sm font-medium transition-all",
                    role === opt.value ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "bg-[var(--color-bg)] text-[var(--color-muted)] hover:bg-[var(--color-border)]"
                  )}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="mt-1 w-full rounded-full bg-[var(--color-accent)] py-4 text-sm font-semibold text-[var(--color-accent-fg)] transition-opacity active:opacity-80">
            Enviar convite
          </button>
        </form>
      </div>
    </>
  )
}
