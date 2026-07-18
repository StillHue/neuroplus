"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Mail, Lock, Eye, EyeOff, User, Brain } from "lucide-react"

export default function Register() {
  const router                  = useRouter()
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const containerRef            = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(".auth-logo", { y: -24, opacity: 0, duration: 0.45 })
      .from(".auth-card", { y: 24,  opacity: 0, duration: 0.4  }, "-=0.2")
      .from(".auth-footer", { opacity: 0, duration: 0.3 }, "-=0.1")
  }, { scope: containerRef })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    // After register → onboarding
    router.push("/onboarding")
  }

  return (
    <div
      ref={containerRef}
      className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-bg)] px-5 py-10"
    >
      <div className="auth-logo mb-8 flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]">
          <Brain size={28} className="text-[var(--color-accent-fg)]" strokeWidth={1.75} aria-hidden />
        </div>
        <span className="text-xl font-semibold text-[var(--color-text)] tracking-tight">neuroplus</span>
        <p className="text-sm text-[var(--color-muted)]">Apoio para famílias neurodivergentes</p>
      </div>

      <div className="auth-card w-full max-w-sm rounded-3xl bg-[var(--color-surface)] p-6 shadow-card">
        <h1 className="mb-5 text-lg font-semibold text-[var(--color-text)]">Criar conta gratuita</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Seu nome</span>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 focus-within:border-[var(--color-accent)] focus-within:bg-[var(--color-surface)] transition-colors">
              <User size={16} className="shrink-0 text-[var(--color-muted-2)]" aria-hidden />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ana Silva"
                required
                autoComplete="name"
                className="flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted-3)]"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">E-mail</span>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 focus-within:border-[var(--color-accent)] focus-within:bg-[var(--color-surface)] transition-colors">
              <Mail size={16} className="shrink-0 text-[var(--color-muted-2)]" aria-hidden />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted-3)]"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Senha</span>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 focus-within:border-[var(--color-accent)] focus-within:bg-[var(--color-surface)] transition-colors">
              <Lock size={16} className="shrink-0 text-[var(--color-muted-2)]" aria-hidden />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                autoComplete="new-password"
                className="flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted-3)]"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                className="shrink-0 text-[var(--color-muted-2)] transition-colors hover:text-[var(--color-muted)]"
              >
                {showPass ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
              </button>
            </div>
          </label>

          {error && (
            <p className="rounded-xl bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-muted)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-full bg-[var(--color-accent)] py-4 text-sm font-semibold text-[var(--color-accent-fg)] transition-opacity active:opacity-80 disabled:opacity-50"
          >
            {loading ? "Criando conta…" : "Criar conta grátis"}
          </button>

          <p className="text-center text-[11px] leading-relaxed text-[var(--color-muted-2)]">
            Ao criar conta você concorda com nossos{" "}
            <Link href="#" className="underline">Termos de Uso</Link>
            {" "}e{" "}
            <Link href="#" className="underline">Política de Privacidade</Link>.
          </p>
        </form>
      </div>

      <p className="auth-footer mt-6 text-center text-sm text-[var(--color-muted)]">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-[var(--color-text)]">
          Entrar
        </Link>
      </p>
    </div>
  )
}
