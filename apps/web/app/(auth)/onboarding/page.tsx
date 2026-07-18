"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ChevronRight, Baby, Stethoscope, Users, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

type DiagnosisPhase = "PRE_DIAGNOSIS" | "IN_PROGRESS" | "POST_DIAGNOSIS"
type CaregiverRole  = "MOM" | "DAD" | "GRANDPARENT" | "OTHER"

interface OnboardingData {
  childName: string
  childBirthYear: string
  diagnosisPhase: DiagnosisPhase | null
  caregiverRole: CaregiverRole | null
}

const DIAGNOSIS_OPTIONS: { value: DiagnosisPhase; label: string; description: string }[] = [
  { value: "PRE_DIAGNOSIS",  label: "Ainda sem diagnóstico",   description: "Notei sinais e estou procurando ajuda"        },
  { value: "IN_PROGRESS",    label: "Em processo",             description: "Já estou em acompanhamento médico"            },
  { value: "POST_DIAGNOSIS", label: "Diagnóstico confirmado",  description: "Tenho o laudo e busco apoio no dia a dia"     },
]

const ROLE_OPTIONS: { value: CaregiverRole; label: string; Icon: React.ElementType }[] = [
  { value: "MOM",         label: "Mãe",          Icon: Users  },
  { value: "DAD",         label: "Pai",           Icon: Users  },
  { value: "GRANDPARENT", label: "Avó / Avô",    Icon: Users  },
  { value: "OTHER",       label: "Outro cuidador", Icon: Users },
]

export default function Onboarding() {
  const router   = useRouter()
  const [step, setStep]     = useState(0)
  const [data, setData]     = useState<OnboardingData>({
    childName: "",
    childBirthYear: "",
    diagnosisPhase: null,
    caregiverRole: null,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef      = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(containerRef.current, { opacity: 0, y: 20, duration: 0.4, ease: "power3.out" })
  }, { scope: containerRef })

  function animateStep(direction: 1 | -1) {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { x: direction * 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.32, ease: "power2.out" }
    )
  }

  function next() {
    setStep((s) => { const n = s + 1; animateStep(1); return n })
  }

  function back() {
    setStep((s) => { const n = s - 1; animateStep(-1); return n })
  }

  async function finish() {
    // TODO: persist via API
    router.push("/inicio")
  }

  const canProceed = [
    data.childName.trim().length > 0,
    data.diagnosisPhase !== null,
    data.caregiverRole !== null,
  ][step]

  return (
    <div
      ref={containerRef}
      className="flex min-h-dvh flex-col bg-[#F5F5F5] px-5 py-10"
    >
      {/* Logo + progress */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111]">
          <Brain size={24} className="text-white" strokeWidth={1.75} aria-hidden />
        </div>
        {/* Step dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === step ? "w-6 bg-[#111111]" : i < step ? "w-2 bg-[#888888]" : "w-2 bg-[#DDDDDD]"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-[#AAAAAA]">Passo {step + 1} de 3</p>
      </div>

      {/* Step card */}
      <div ref={cardRef} className="w-full max-w-sm mx-auto rounded-3xl bg-white p-6 shadow-card">
        {step === 0 && (
          <StepChild data={data} onChange={(d) => setData((p) => ({ ...p, ...d }))} />
        )}
        {step === 1 && (
          <StepDiagnosis data={data} onChange={(d) => setData((p) => ({ ...p, ...d }))} />
        )}
        {step === 2 && (
          <StepRole data={data} onChange={(d) => setData((p) => ({ ...p, ...d }))} />
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 w-full max-w-sm mx-auto flex flex-col gap-3">
        <button
          onClick={step === 2 ? finish : next}
          disabled={!canProceed}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-4 text-sm font-semibold text-white transition-opacity active:opacity-80 disabled:opacity-40"
        >
          {step === 2 ? "Começar" : "Continuar"}
          <ChevronRight size={16} aria-hidden />
        </button>

        {step > 0 && (
          <button
            onClick={back}
            className="w-full rounded-full py-3 text-sm font-medium text-[#888888] transition-colors active:bg-[#F0F0F0]"
          >
            Voltar
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Step 1: Criança ─────────────────────────────────────────────────────────

function StepChild({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (d: Partial<OnboardingData>) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F5F5]">
          <Baby size={18} className="text-[#111111]" aria-hidden />
        </span>
        <div>
          <h2 className="font-semibold text-[#111111]">Sobre a criança</h2>
          <p className="text-xs text-[#888888]">Vamos personalizar sua experiência</p>
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[#666666]">Nome da criança</span>
        <input
          type="text"
          value={data.childName}
          onChange={(e) => onChange({ childName: e.target.value })}
          placeholder="João"
          className="rounded-xl border border-[#EBEBEB] bg-[#F9F9F9] px-4 py-3 text-sm text-[#111111] outline-none focus:border-[#111111] focus:bg-white transition-colors placeholder:text-[#CCCCCC]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[#666666]">Ano de nascimento (opcional)</span>
        <input
          type="number"
          value={data.childBirthYear}
          onChange={(e) => onChange({ childBirthYear: e.target.value })}
          placeholder="2018"
          min={2000}
          max={new Date().getFullYear()}
          className="rounded-xl border border-[#EBEBEB] bg-[#F9F9F9] px-4 py-3 text-sm text-[#111111] outline-none focus:border-[#111111] focus:bg-white transition-colors placeholder:text-[#CCCCCC]"
        />
      </label>
    </div>
  )
}

// ─── Step 2: Fase do diagnóstico ─────────────────────────────────────────────

function StepDiagnosis({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (d: Partial<OnboardingData>) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F5F5]">
          <Stethoscope size={18} className="text-[#111111]" aria-hidden />
        </span>
        <div>
          <h2 className="font-semibold text-[#111111]">Em que fase vocês estão?</h2>
          <p className="text-xs text-[#888888]">Isso define sua rota no app</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {DIAGNOSIS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ diagnosisPhase: opt.value })}
            className={cn(
              "flex flex-col items-start rounded-2xl border px-4 py-3.5 text-left transition-all",
              data.diagnosisPhase === opt.value
                ? "border-[#111111] bg-[#111111] text-white"
                : "border-[#EBEBEB] bg-[#F9F9F9] text-[#111111] hover:border-[#CCCCCC]"
            )}
          >
            <span className="text-sm font-semibold">{opt.label}</span>
            <span className={cn("mt-0.5 text-xs", data.diagnosisPhase === opt.value ? "text-[#CCCCCC]" : "text-[#888888]")}>
              {opt.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 3: Papel do cuidador ────────────────────────────────────────────────

function StepRole({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (d: Partial<OnboardingData>) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F5F5]">
          <Users size={18} className="text-[#111111]" aria-hidden />
        </span>
        <div>
          <h2 className="font-semibold text-[#111111]">Quem está cuidando?</h2>
          <p className="text-xs text-[#888888]">Você pode adicionar outras pessoas depois</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ROLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ caregiverRole: opt.value })}
            className={cn(
              "flex flex-col items-center justify-center rounded-2xl border py-4 text-sm font-semibold transition-all",
              data.caregiverRole === opt.value
                ? "border-[#111111] bg-[#111111] text-white"
                : "border-[#EBEBEB] bg-[#F9F9F9] text-[#111111] hover:border-[#CCCCCC]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-[#F5F5F5] px-4 py-3">
        <p className="text-xs leading-relaxed text-[#666666]">
          <strong>Suas informações são protegidas.</strong> O neuroplus segue a LGPD e trata dados de saúde com consentimento explícito e granular.
        </p>
      </div>
    </div>
  )
}
