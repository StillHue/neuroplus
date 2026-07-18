<div align="center">

# 🧬 NEURO +

**O copiloto e navegador digital da jornada de famílias neurodivergentes no SUS.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=000)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-123A4A?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)

</div>

---

## 🎯 O que é o Neuro +?

O **Neuro +** é um aplicativo mobile-first projetado para ser a bússola de famílias de baixa renda durante a jornada de diagnóstico e acompanhamento de condições neurodivergentes (como autismo e TDAH) no Sistema Único de Saúde (SUS). 

Criamos uma ferramenta de baixo esforço cognitivo que acolhe e empodera mães como **Sandra** e seu filho **João**, transformando a fila de espera do SUS em um período ativo de registro e cuidado estruturado.

---

## ✨ Tour Interativo: Como o Aplicativo é Estruturado?

O Neuro + é desenhado com uma estética **premium e calmante (paleta HSL suave)**, usando micro-animações fluidas desenvolvidas em **GSAP** para conferir a experiência de uso de um aplicativo nativo no navegador do celular.

### 📱 As Abas do Aplicativo:

*   **🏡 Início (Dashboard):** Um painel limpo contendo o diário diário da criança, barra de datas horizontal interativa (`DateStrip`) e cards de atividades diárias personalizadas.
*   **🗺️ Jornada (Roteiro):** A rota de atendimento passo a passo do SUS baseada na triagem, incluindo cards dinâmicos de insights de IA e painel de upgrade para recursos premium.
*   **🎙️ Cuidador (Manejo & Voz):** Espaço para o cuidador registrar eventos por áudio (transcritor nativo premium) e check-in de bem-estar para combater a sobrecarga parental.
*   **🔒 Hub (Compartilhamento LGPD):** Central de consentimento que permite ao cuidador liberar e auditar de forma granular o acesso aos relatórios para professores e terapeutas.

---

## 🗺️ O Fluxo da Jornada em 3 Passos

```mermaid
flowchart LR
    A["💬 1. Triagem Inteligente<br/>(Orientação e Rota de Saúde)"] 
    B["🎙️ 2. Diário do Cuidador<br/>(Registro de rotina por voz)"] 
    C["📄 3. Relatório para o SUS<br/>(Laudo médico assertivo)"]
    
    A --> B --> C
```

1. **Triagem Ativa:** Um assistente em linguagem simples ajuda a família a entender o encaminhamento médico e cria uma rota passo a passo personalizada de atendimento.
2. **Fila de Espera Ativa:** O cuidador pode registrar crises, alimentação e qualidade de sono de forma simples por voz, criando um histórico contínuo em casa.
3. **Consulta Eficiente:** Consolida os dados coletados em um relatório clínico estruturado e limpo, permitindo ao neuropediatra do SUS fechar o diagnóstico e prescrever o tratamento com maior velocidade.

---

## 🛠️ Tecnologias & Stacks

O Neuro + utiliza um ecossistema de desenvolvimento moderno, otimizado para escalabilidade e desempenho mobile:

*   **Core / Engine:** Next.js 16 (App Router) + React 19 + TypeScript.
*   **Banco de Dados:** Prisma ORM com PostgreSQL na nuvem (Neon).
*   **Estilização & Visual:** Tailwind CSS combinado com animações GSAP (ScrollTrigger e Custom Eases).
*   **Autenticação:** NextAuth v5 integrado.
*   **Gerenciamento do Monorepo:** Turborepo e npm workspaces.

---

## 🚀 Como Executar o Projeto Localmente

Siga o passo a passo abaixo para rodar a aplicação em seu ambiente de desenvolvimento:

### 1. Configurar as Variáveis de Ambiente
Crie arquivos `.env` na raiz do projeto e em `apps/web` preenchendo as seguintes chaves de configuração:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/neuroplus"
GROQ_API_KEY="sua_chave_da_api_groq"
NEXTAUTH_SECRET="uma_chave_de_criptografia_segura"
```

### 2. Instalar Dependências e Inicializar o Banco
```bash
# Instale todas as dependências do monorepo
npm install

# Aplique o esquema de banco de dados do Prisma
npx turbo run db:push
```

### 3. Rodar o Servidor de Desenvolvimento
```bash
# Inicie o Turborepo em modo de desenvolvimento
npm run dev
```
Isso iniciará o servidor Next.js. Acesse o aplicativo principal em: **`http://localhost:3000`**.

---

## 📚 Central de Documentação do Projeto

Para se aprofundar nas diretrizes de produto, arquitetura e relatórios de conformidade, acesse os links diretos abaixo:

*   **🎯 [Visão do Produto & Proposta de Valor](./PRODUCT_VISION.md):** O problema real do SUS, público-alvo e hipóteses de valor da plataforma.
*   **👥 [Cuidadores & Profissionais: Personas do Ecossistema](./USER_PERSONAS.md):** Perfis de empatia e contexto social de quem utiliza a aplicação.
*   **🗺️ [Rota de Cuidado: Jornada do Usuário e Fases de Suporte](./USER_JOURNEY.md):** O fluxo detalhado do usuário nas fases de suspeita, fila de espera e pós-diagnóstico.
*   **📐 [Arquitetura & Infraestrutura do Sistema](./ARCHITECTURE.md):** Diagramas técnicos de dados, árvore de componentes React 19 e fluxos de consentimento.
*   **🔍 [Qualidade de Código & Code Review](./review_report.md):** Inspeção de usabilidade, GSAP hooks e melhores práticas do Next.js.
*   **🛡️ [Segurança & Auditoria de Riscos](./security_audit.md):** Avaliação de vulnerabilidades mitigadas e conformidade técnica com a LGPD.

---

## 👥 Equipe Envolvida

<div align="center">

![Equipe Neuro +](./logoclean.png)

| Membro | Atribuição |
| :--- | :--- |
| **Ariadina** | Designer |
| **Débora** | Negócios |
| **Gabriel** | Desenvolvedor |
| **M. Beatriz** | Negócios |
| **Paulo H.** | Desenvolvedor |

</div>
