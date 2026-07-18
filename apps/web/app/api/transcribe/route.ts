import { NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(req: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY not set" }, { status: 500 })
  }

  const formData = await req.formData()
  const audio    = formData.get("audio") as File | null

  if (!audio) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
  }

  // 1. Transcribe via Groq Whisper
  const whisperForm = new FormData()
  whisperForm.append("file", audio, audio.name || "audio.webm")
  whisperForm.append("model", "whisper-large-v3")
  whisperForm.append("language", "pt")
  whisperForm.append("response_format", "json")

  const whisperRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
    body: whisperForm,
  })

  if (!whisperRes.ok) {
    const err = await whisperRes.text()
    return NextResponse.json({ error: `Whisper error: ${err}` }, { status: 502 })
  }

  const { text: transcript } = await whisperRes.json() as { text: string }

  // 2. Extract structured routine data from transcript
  const extractRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `Você é um extrator de dados de rotina de crianças neurodivergentes.
Dado um relato em áudio transcrito, extraia os dados no formato JSON abaixo.
Categorias possíveis: FEEDING, SLEEP, CRISIS, SCHOOL, MEDICATION.
Retorne APENAS o JSON, sem markdown:
{
  "entries": [
    {
      "category": "CATEGORY",
      "notes": "resumo em uma frase",
      "severity": null_ou_1_a_5_apenas_para_CRISIS,
      "durationMin": null_ou_numero_em_minutos
    }
  ],
  "summary": "resumo do relato em uma frase para o cuidador"
}`,
        },
        {
          role: "user",
          content: `Transcrição: "${transcript}"`,
        },
      ],
    }),
  })

  if (!extractRes.ok) {
    // Return transcript even if extraction fails
    return NextResponse.json({ transcript, entries: [], summary: transcript })
  }

  const extractJson = await extractRes.json() as { choices: { message: { content: string } }[] }
  const raw = extractJson.choices[0]?.message?.content ?? "{}"

  let parsed: { entries: unknown[]; summary: string } = { entries: [], summary: transcript }
  try {
    parsed = JSON.parse(raw)
  } catch {
    // fallback
  }

  return NextResponse.json({ transcript, ...parsed })
}
