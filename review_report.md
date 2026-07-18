# 🔍 Qualidade de Código & Code Review

Este documento apresenta uma revisão de código profissional, focando em usabilidade, arquitetura Next.js e boas práticas de desenvolvimento no monorepo **Neuro +**.

---

## 👍 1. O que está bom (What's good)

*   **Experiência do Usuário (UX/UI Premium):** O uso de **GSAP** no `BottomNav.tsx` cria uma animação de deslizar e escala de altíssimo padrão visual. Ele dá uma sensação de aplicativo móvel nativo extremamente polido.
*   **Fluxo de Roteamento de Triagem:** A lógica de SSE (Server-Sent Events) no endpoint `/api/triage/route.ts` está bem estruturada, aproveitando os recursos do Groq para fornecer respostas em tempo real, o que reduz drasticamente a percepção de tempo de espera pelo usuário.
*   **Arquitetura do Banco de Dados:** O arquivo `schema.prisma` mapeia de forma robusta e normalizada as relações entre famílias, cuidadores, registros cotidianos e o histórico de consentimentos/auditoria de segurança.

---

## 🛑 2. O que DEVE mudar (What must change)

*   **Tratamento de Planos e Upsells:**
    *   *Problema:* No arquivo `apps/web/app/(tabs)/cuidador/page.tsx` (e outras páginas), o plano do usuário está fixado como `const USER_PLAN = "FREE" as "FREE" | "PREMIUM"`.
    *   *Impacto:* Impede o funcionamento dinâmico da monetização do MVP e bloqueio de relatórios.
    *   *Solução:* Obter o plano do usuário dinamicamente da sessão do NextAuth (`session?.user?.plan`) ou de uma consulta de estado global Zustand sincronizada com o banco.
*   **IDs de Itens de Lista Locais:**
    *   *Problema:* A criação de anotações e contatos no cuidador usa `Date.now().toString()` para gerar IDs provisórios no estado React local antes de persistir.
    *   *Impacto:* Risco de colisão se houver inserção em lote muito rápida ou problemas de sincronia com o banco de dados.
    *   *Solução:* Utilizar UUIDs gerados no frontend via `crypto.randomUUID()` ou aguardar o ID retornado pela Promise da API/tRPC.

---

## 💡 3. O que PODE melhorar (What could improve)

*   **Validação de E-mail nos Inputs de Convite:**
    *   *Problema:* O formulário de convite a novos cuidadores apenas confia no input HTML `type="email"`.
    *   *Impacto:* E-mails mal formatados ou perigosos podem passar pela validação visual leve e disparar erros internos na API.
    *   *Solução:* Adicionar validação programática usando uma biblioteca de validação no frontend (como Zod schema) no momento do submit.
*   **Tratamento de Falhas na Triagem:**
    *   *Problema:* Se a chave da API do Groq falhar ou expirar, a triagem exibe uma mensagem genérica sem instruções de recuperação.
    *   *Impacto:* Quebra de usabilidade.
    *   *Solução:* Implementar estados visuais ricos de erro com botões de "Tentar Novamente" e gravação local do histórico de mensagens para não perder a conversa do usuário em caso de queda de conexão.

---

## 🎓 4. Ponto de Aprendizado (Learning Point)

**Animações Imperativas com Hooks Declarativos no Next.js:**  
O uso de GSAP em Next.js com App Router exige cuidados com ciclos de renderização do React 19. Utilizar o hook `@gsap/react` com contexto limpo (`useGSAP`) é a prática recomendada para evitar memory leaks causados por seletores GSAP persistentes que tentam animar elementos DOM desmontados.
