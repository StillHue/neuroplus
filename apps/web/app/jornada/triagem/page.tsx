"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Send, X } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: "Olá! Estou aqui para ajudar você a entender o próximo passo. Pode começar me contando um pouco sobre o que está acontecendo com seu filho ou filha.",
}

export default function TriagemPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(containerRef.current, { y: 32, opacity: 0, duration: 0.3, ease: "power2.out" })
  }, { scope: containerRef })

  function animateNewMessage(el: HTMLElement) {
    gsap.from(el, { y: 12, opacity: 0, duration: 0.22, ease: "power2.out" })
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }))

    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok || !res.body) throw new Error("Falha na resposta")

      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }])
      setLoading(false)

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6).trim()
          if (data === "[DONE]") break
          try {
            const parsed = JSON.parse(data) as { choices: { delta: { content?: string } }[] }
            const token = parsed.choices[0]?.delta?.content
            if (token) {
              setMessages((prev) =>
                prev.map((m) => m.id === assistantId ? { ...m, content: m.content + token } : m)
              )
            }
          } catch { /* skip malformed chunk */ }
        }
      }
    } catch {
      setLoading(false)
      setMessages((prev) => [
        ...prev,
        { id: "err-" + Date.now(), role: "assistant", content: "Tive um problema de conexão. Pode tentar de novo?" },
      ])
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div ref={containerRef} className="app-shell flex h-dvh flex-col bg-[#F5F5F5]">
      {/* Header */}
      <header className="flex items-center gap-3 bg-white px-4 py-3 shadow-[0_1px_0_#EBEBEB]">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F5] text-[#888888] transition-colors active:bg-[#EBEBEB]"
          aria-label="Fechar triagem"
        >
          <X size={18} aria-hidden />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#111111]">Triagem</p>
          <p className="text-xs text-[#AAAAAA]">Assistente Neuroplus</p>
        </div>
        {loading && <TypingIndicator />}
      </header>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} onMount={animateNewMessage} />
        ))}
        {loading && messages[messages.length - 1]?.role === "user" && <TypingBubble />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="bg-white px-4 py-3 shadow-[0_-1px_0_#EBEBEB]"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="flex items-end gap-2 rounded-2xl bg-[#F5F5F5] px-3 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva aqui…"
            rows={1}
            className="flex-1 resize-none bg-transparent py-1 text-sm leading-relaxed text-[#111111] outline-none placeholder:text-[#CCCCCC] max-h-28 overflow-y-auto"
            aria-label="Mensagem para o assistente"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white transition-opacity active:opacity-80 disabled:opacity-30"
            aria-label="Enviar mensagem"
          >
            <Send size={15} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ message, onMount }: { message: Message; onMount: (el: HTMLElement) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) onMount(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isUser = message.role === "user"

  return (
    <div ref={ref} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-[#111111] text-white"
            : "rounded-bl-sm bg-white text-[#111111] shadow-card",
        ].join(" ")}
      >
        {message.content || <span className="opacity-30">…</span>}
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-card">
        <span className="flex h-5 items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-pulse-dot rounded-full bg-[#CCCCCC]"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <span className="flex items-center gap-1 text-xs text-[#AAAAAA]">
      digitando
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#CCCCCC]"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </span>
    </span>
  )
}
