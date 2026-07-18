"use client"

import { useState, useRef, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Mic, Square, Loader2, Sparkles, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaywallSheet } from "@/components/upsell/PaywallSheet"

interface ExtractedEntry {
  category: string
  notes: string
  severity?: number | null
  durationMin?: number | null
}

interface TranscribeResult {
  transcript: string
  entries: ExtractedEntry[]
  summary: string
}

interface AudioRecorderProps {
  isPremium: boolean
  onEntries: (entries: ExtractedEntry[]) => void
}

type RecordState = "idle" | "recording" | "processing" | "done" | "error"

export function AudioRecorder({ isPremium, onEntries }: AudioRecorderProps) {
  const [state, setState]       = useState<RecordState>("idle")
  const [result, setResult]     = useState<TranscribeResult | null>(null)
  const [seconds, setSeconds]   = useState(0)
  const [paywallOpen, setPaywall] = useState(false)
  const mediaRef                = useRef<MediaRecorder | null>(null)
  const chunksRef               = useRef<Blob[]>([])
  const timerRef                = useRef<ReturnType<typeof setInterval> | null>(null)
  const buttonRef               = useRef<HTMLButtonElement>(null)
  const pulseRef                = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useGSAP(() => {
    if (state === "recording" && pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1.4, opacity: 0,
        duration: 0.9, ease: "power1.out",
        repeat: -1, repeatDelay: 0.1,
      })
    } else if (pulseRef.current) {
      gsap.killTweensOf(pulseRef.current)
      gsap.set(pulseRef.current, { scale: 1, opacity: 0.5 })
    }
  }, { dependencies: [state] })

  async function startRecording() {
    if (!isPremium) { setPaywall(true); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      chunksRef.current = []
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = handleStop
      recorder.start()
      mediaRef.current = recorder
      setState("recording")
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch {
      setState("error")
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current)
    mediaRef.current?.stop()
    mediaRef.current?.stream.getTracks().forEach((t) => t.stop())
    setState("processing")
  }

  async function handleStop() {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" })
    const form = new FormData()
    form.append("audio", blob, "recording.webm")

    try {
      const res = await fetch("/api/transcribe", { method: "POST", body: form })
      if (!res.ok) throw new Error()
      const data: TranscribeResult = await res.json()
      setResult(data)
      setState("done")
      if (data.entries?.length) onEntries(data.entries)
    } catch {
      setState("error")
    }
  }

  function reset() {
    setState("idle")
    setResult(null)
    setSeconds(0)
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  return (
    <>
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-[var(--color-surface)] p-5 shadow-card">
        <div className="flex items-center gap-2">
          <Mic size={14} className="text-[var(--color-muted-2)]" aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-2)]">
            Registro por áudio
          </span>
          {!isPremium && (
            <span className="flex items-center gap-1 rounded-full bg-[var(--color-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-muted)]">
              <Crown size={9} aria-hidden /> Premium
            </span>
          )}
        </div>

        {/* Record button */}
        <div className="relative flex items-center justify-center">
          <span
            ref={pulseRef}
            className={cn(
              "absolute h-16 w-16 rounded-full opacity-50",
              state === "recording" ? "bg-[var(--color-accent)]" : "bg-transparent"
            )}
            aria-hidden
          />
          <button
            ref={buttonRef}
            onClick={state === "idle" || state === "done" || state === "error" ? startRecording : stopRecording}
            disabled={state === "processing"}
            aria-label={state === "recording" ? "Parar gravação" : "Iniciar gravação"}
            className={cn(
              "relative z-10 flex h-14 w-14 items-center justify-center rounded-full transition-all",
              state === "recording" ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-lg scale-110" : "bg-[var(--color-bg)] text-[var(--color-text)]",
              state === "processing" && "opacity-50 cursor-not-allowed"
            )}
          >
            {state === "processing" ? (
              <Loader2 size={22} className="animate-spin" aria-hidden />
            ) : state === "recording" ? (
              <Square size={18} fill="white" strokeWidth={0} aria-hidden />
            ) : (
              <Mic size={22} strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </div>

        {/* Status */}
        <div className="text-center">
          {state === "idle" && (
            <p className="text-xs text-[var(--color-muted)]">
              {isPremium ? "Fale — a IA preenche o formulário" : "Disponível no plano Premium"}
            </p>
          )}
          {state === "recording" && (
            <p className="text-sm font-semibold text-[var(--color-text)]">{formatTime(seconds)}</p>
          )}
          {state === "processing" && (
            <p className="text-xs text-[var(--color-muted)]">Transcrevendo e extraindo dados…</p>
          )}
          {state === "error" && (
            <p className="text-xs text-red-500">Erro ao processar. <button onClick={reset} className="underline">Tentar novamente</button></p>
          )}
        </div>

        {/* Result */}
        {state === "done" && result && (
          <div className="w-full rounded-xl bg-[var(--color-bg)] px-4 py-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[var(--color-text)]" aria-hidden />
              <span className="text-xs font-semibold text-[var(--color-text)]">Dados extraídos</span>
            </div>
            <p className="mb-2 text-xs leading-relaxed text-[var(--color-muted)]">{result.summary}</p>
            {result.entries?.length > 0 && (
              <ul className="flex flex-col gap-1">
                {result.entries.map((e, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                    <strong>{e.category}</strong>: {e.notes}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={reset} className="mt-3 text-xs text-[var(--color-muted)] underline-offset-2 hover:underline">
              Gravar outro áudio
            </button>
          </div>
        )}
      </div>

      {paywallOpen && (
        <PaywallSheet onClose={() => setPaywall(false)} onSubscribe={() => setPaywall(false)} />
      )}
    </>
  )
}
