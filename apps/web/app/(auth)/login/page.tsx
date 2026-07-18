"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Mail, Lock, Eye, EyeOff, Brain } from "lucide-react"

export default function Login() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const containerRef            = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.from(".auth-logo",   { y: -24, opacity: 0, duration: 0.45 })
      .from(".auth-card",   { y: 24,  opacity: 0, duration: 0.4  }, "-=0.2")
      .from(".auth-footer", { opacity: 0, duration: 0.3 }, "-=0.1")
  }, { scope: containerRef })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // TODO: connect next-auth signIn
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setError("Funcionalidade de autenticação em breve.")
  }

  return (
    <div
      ref={containerRef}
      className="flex min-h-dvh flex-col items-center justify-center bg-[#1c1e26] px-5 py-10"
    >
      {/* Logo */}
      <div className="auth-logo mb-8 flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6fb7b0]">
          <Brain size={28} className="text-[#1c1e26]" strokeWidth={1.75} aria-hidden />
        </div>
        <span className="text-xl font-semibold text-[#edeef2] tracking-tight">neuroplus</span>
        <p className="text-sm text-[#9a9eab]">Apoio para famílias neurodivergentes</p>
      </div>

      {/* Card */}
      <div className="auth-card w-full max-w-sm rounded-3xl bg-[#252830] p-6 shadow-card">
        <h1 className="mb-5 text-lg font-semibold text-[#edeef2]">Entrar na conta</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#9a9eab]">E-mail</span>
            <div className="flex items-center gap-2 rounded-xl border border-[#2f3340] bg-[#22252e] px-3 py-3 focus-within:border-[#6fb7b0] focus-within:bg-[#252830] transition-colors">
              <Mail size={16} className="shrink-0 text-[#6b7080]" aria-hidden />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="flex-1 bg-transparent text-sm text-[#edeef2] outline-none placeholder:text-[#4a4d58]"
              />
            </div>
          </label>

          {/* Password */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#9a9eab]">Senha</span>
            <div className="flex items-center gap-2 rounded-xl border border-[#2f3340] bg-[#22252e] px-3 py-3 focus-within:border-[#6fb7b0] focus-within:bg-[#252830] transition-colors">
              <Lock size={16} className="shrink-0 text-[#6b7080]" aria-hidden />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="flex-1 bg-transparent text-sm text-[#edeef2] outline-none placeholder:text-[#4a4d58]"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                className="shrink-0 text-[#6b7080] transition-colors hover:text-[#9a9eab]"
              >
                {showPass ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
              </button>
            </div>
          </label>

          {error && (
            <p className="rounded-xl bg-[#1c1e26] px-3 py-2 text-xs text-[#9a9eab]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-full bg-[#6fb7b0] py-4 text-sm font-semibold text-[#1c1e26] transition-opacity active:opacity-80 disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="#" className="text-xs text-[#9a9eab] underline-offset-2 hover:underline">
            Esqueci minha senha
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="auth-footer mt-6 text-center text-sm text-[#9a9eab]">
        Não tem conta?{" "}
        <Link href="/register" className="font-semibold text-[#edeef2]">
          Criar conta
        </Link>
      </p>
    </div>
  )
}
