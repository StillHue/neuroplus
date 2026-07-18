"use client"

import { useState, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useHideNav } from "@/components/NavContext"
import {
  Frown, Meh, Smile, SmilePlus, Laugh,
  Upload, FileText, CheckCircle2, Trash2,
  UserPlus, X, Users, Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CollapsibleSection } from "@/components/ui/collapsible-section"
import { PaywallSheet } from "@/components/upsell/PaywallSheet"
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

interface UploadedDoc {
  id: string
  name: string
  size: string
  uploadedAt: string
}

const INITIAL_CAREGIVERS: Caregiver[] = [
  { id: "1", name: "Ana Silva",  email: "ana@neuroplus.app", role: "MOM", isOwner: true },
]

export default function Cuidador() {
  const [wellbeing, setWellbeing]     = useState<WellbeingLevel | null>(null)
  const [checkinDone, setCheckinDone] = useState(false)
  const [docs, setDocs]               = useState<UploadedDoc[]>([])
  const [caregivers, setCaregivers]   = useState<Caregiver[]>(INITIAL_CAREGIVERS)
  const [inviteOpen, setInviteOpen]   = useState(false)
  const [paywallOpen, setPaywall]     = useState(false)

  const pageRef   = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef  = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!headerRef.current) return
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(headerRef.current, { y: -20, opacity: 0, duration: 0.4 })
      .from(".care-card",      { y: 20,  opacity: 0, duration: 0.35, stagger: 0.1 }, "-=0.22")
  }, { scope: pageRef })

  function handleCheckin(level: WellbeingLevel) {
    setWellbeing(level)
    setTimeout(() => setCheckinDone(true), 400)
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const newDocs: UploadedDoc[] = files.map((f) => ({
      id: Date.now().toString() + Math.random(),
      name: f.name,
      size: f.size < 1024 * 1024
        ? `${(f.size / 1024).toFixed(0)} KB`
        : `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: "Agora",
    }))
    setDocs((prev) => [...newDocs, ...prev])
    e.target.value = ""
  }

  function removeDoc(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id))
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
      <div ref={headerRef} className="px-5 pt-safe pb-4">
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

        {/* Upload de documentos */}
        <div className="care-card rounded-2xl bg-[var(--color-surface)] shadow-card overflow-hidden">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-[var(--color-muted-2)]" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-2)]">Exames e laudos</span>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[var(--color-border-strong)] px-4 py-3.5 transition-colors active:bg-[var(--color-bg)]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg)] text-[var(--color-accent)]">
                <Upload size={16} aria-hidden />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text)]">Enviar arquivo</p>
                <p className="text-xs text-[var(--color-muted)]">PDF, imagem ou documento</p>
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                multiple
                className="sr-only"
                onChange={handleUpload}
                aria-label="Selecionar arquivo para upload"
              />
            </label>

            {docs.length > 0 && (
              <ul className="mt-3 flex flex-col gap-0.5">
                {docs.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3 rounded-xl px-1 py-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg)] text-[var(--color-muted-2)]">
                      <FileText size={14} aria-hidden />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--color-text)]">{doc.name}</p>
                      <p className="text-xs text-[var(--color-muted)]">{doc.size} · {doc.uploadedAt}</p>
                    </div>
                    <button
                      onClick={() => removeDoc(doc.id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--color-muted-2)] transition-colors active:bg-[var(--color-bg)]"
                      aria-label={`Remover ${doc.name}`}
                    >
                      <Trash2 size={13} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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
