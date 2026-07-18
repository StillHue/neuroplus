import { NextResponse } from "next/server"

// Generates a plain-text clinical report formatted for printing
// TODO: swap for a real PDF lib (e.g. @react-pdf/renderer) once db is wired
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const childName = searchParams.get("child") ?? "Criança"
  const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Relatório Clínico — ${childName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; color: #111; padding: 48px; max-width: 720px; margin: auto; font-size: 14px; line-height: 1.6; }
    header { border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 24px; }
    h1 { font-size: 22px; font-weight: 700; }
    h2 { font-size: 15px; font-weight: 700; margin: 24px 0 8px; text-transform: uppercase; letter-spacing: .05em; }
    p { margin-bottom: 8px; }
    .label { font-weight: 600; }
    .section { border-left: 3px solid #111; padding-left: 12px; margin-bottom: 20px; }
    .entry { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
    .badge { display: inline-block; border: 1px solid #111; border-radius: 4px; padding: 1px 6px; font-size: 11px; font-weight: 600; }
    footer { margin-top: 48px; border-top: 1px solid #ccc; padding-top: 12px; font-size: 11px; color: #888; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <header>
    <p style="font-size:11px;color:#888;margin-bottom:4px">neuroplus — Plataforma de Apoio a Famílias Neurodivergentes</p>
    <h1>Relatório de Acompanhamento</h1>
    <p><span class="label">Criança:</span> ${childName}</p>
    <p><span class="label">Data de emissão:</span> ${date}</p>
    <p><span class="label">Período:</span> Últimos 30 dias</p>
    <p style="margin-top:8px;font-size:12px;color:#666">
      ⚠ Este relatório é um apoio informativo gerado pelo app neuroplus e não substitui diagnóstico ou conduta médica.
      Qualquer decisão clínica deve ser tomada por profissional habilitado.
    </p>
  </header>

  <h2>Resumo do Período</h2>
  <div class="section">
    <div class="entry"><span>Registros de sono</span><span>22 registros · média 7h12min</span></div>
    <div class="entry"><span>Registros de alimentação</span><span>28 registros · 4 recusas observadas</span></div>
    <div class="entry"><span>Crises registradas</span><span>5 episódios · média de intensidade 2.4/5</span></div>
    <div class="entry"><span>Registros escolares</span><span>18 registros</span></div>
  </div>

  <h2>Padrões Identificados</h2>
  <div class="section">
    <p>📍 <span class="label">Correlação sono × crises:</span> Em 4 dos 5 episódios de crise, o sono da noite anterior foi inferior a 7h. Padrão observado com recorrência nas terças-feiras.</p>
    <p>📍 <span class="label">Alimentação:</span> Recusas concentradas no almoço. Sem padrão de dia da semana identificado ainda.</p>
  </div>

  <h2>Crises — Detalhamento</h2>
  <div class="section">
    <div class="entry"><span>12/06 — 15h00</span><span>Intensidade 3 · 20min · Sensível ao barulho</span></div>
    <div class="entry"><span>19/06 — 14h45</span><span>Intensidade 2 · 15min · Transição de atividade</span></div>
    <div class="entry"><span>26/06 — 15h10</span><span>Intensidade 2 · 10min · Barulho externo</span></div>
  </div>

  <h2>Sono — Histórico</h2>
  <div class="section">
    <div class="entry"><span>Semana 1 (10–16/06)</span><span>Média: 7h30min</span></div>
    <div class="entry"><span>Semana 2 (17–23/06)</span><span>Média: 6h45min ⚠</span></div>
    <div class="entry"><span>Semana 3 (24–30/06)</span><span>Média: 7h20min</span></div>
    <div class="entry"><span>Semana 4 (01–07/07)</span><span>Média: 7h50min</span></div>
  </div>

  <h2>Jornada de Diagnóstico</h2>
  <div class="section">
    <p><span class="badge">CONCLUÍDO</span> Triagem inicial — neuroplus (12/06)</p>
    <p style="margin-top:6px"><span class="badge">CONCLUÍDO</span> Consulta com pediatra — encaminhamento emitido</p>
    <p style="margin-top:6px"><span class="badge">EM FILA</span> Neuropediatra — aguardando SUS · média regional 40 dias</p>
  </div>

  <footer>
    Gerado em ${date} pelo app neuroplus. As informações são baseadas nos registros inseridos pelos cuidadores.
    Compartilhamento autorizado pela família nos termos da LGPD — Lei nº 13.709/2018.
  </footer>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="relatorio-${childName.toLowerCase().replace(/\s+/g, "-")}.html"`,
    },
  })
}
