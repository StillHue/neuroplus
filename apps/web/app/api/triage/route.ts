import { NextRequest } from "next/server"

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions"

const SYSTEM_PROMPT = `Você é um assistente de triagem do Neuroplus, um app de apoio a famílias com crianças neurodivergentes.

Seu objetivo é entender a situação da família e montar uma rota de diagnóstico personalizada.

Diretrizes de comunicação:
- Linguagem simples, acessível, sem jargão médico
- Uma pergunta por vez, nunca múltiplas perguntas juntas
- Tom acolhedor, nunca clínico ou frio
- Se a pessoa estiver claramente sobrecarregada, reconheça isso antes de continuar
- Nunca diagnostique — você orienta o caminho, não define o diagnóstico
- Máximo 2-3 frases por resposta

Informações para coletar ao longo da conversa (em ordem natural, não como formulário):
1. Idade da criança
2. Principais comportamentos ou dificuldades que motivaram buscar ajuda
3. Já teve alguma consulta ou avaliação anterior?
4. Está no sistema público (SUS) ou tem plano de saúde?

Ao final da triagem (quando tiver informações suficientes), responda com um JSON no formato:
{"triagem_completa": true, "rota": ["Pediatra", "Neuropediatra", "Avaliação psicológica"], "contexto": "breve resumo da situação"}

Enquanto não tiver informações suficientes, continue a conversa normalmente.`

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[]
  }

  const response = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
      temperature: 0.7,
      max_tokens: 300,
    }),
  })

  if (!response.ok) {
    return new Response("Erro ao conectar com o assistente. Tente novamente.", { status: 502 })
  }

  // Pass through the SSE stream directly
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
