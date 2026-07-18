# 📐 Arquitetura & Infraestrutura do Sistema

Esta documentação descreve a infraestrutura técnica, padrões de projeto, diagramas de arquitetura e conformidade da plataforma **Neuro +**.

---

## 🏗️ Padrões de Projeto & Estrutura

O Neuro + é implementado como um monorepo TypeScript utilizando workspaces.
*   **Camada de Aplicação (`apps/web`):** Next.js 16 com App Router. Utiliza componentes do React 19 de forma híbrida:
    *   *Server Components (RSC):* Para renderização inicial rápida, SEO e busca de dados eficiente.
    *   *Client Components:* Para controle de estado local, animações GSAP (como fade-in e rolagem com ScrollTrigger) e sheets de interação (como formulário de convite e paywall).
*   **Camada de Dados (`packages/db`):** Centralizada com Prisma ORM e PostgreSQL, garantindo tipagem forte e migrações consistentes.
*   **Comunicação:** Rotas API REST e suporte a tRPC para comunicação TypeScript end-to-end livre de erros de tipagem.

---

## 📊 Diagramas de Arquitetura

### 1. Component Tree (Árvore de Componentes)

Mapeia a estrutura de páginas e componentes chave da interface do aplicativo principal `apps/web`.

```mermaid
flowchart TD
  RootLayout["app/layout.tsx (Global Providers)"] --> AuthLayout["app/(auth)/layout.tsx"]
  RootLayout --> TabsLayout["app/(tabs)/layout.tsx"]
  
  AuthLayout --> LoginPage["app/(auth)/login/page.tsx"]
  
  TabsLayout --> BottomNav["components/BottomNav.tsx (Pílula GSAP)"]
  TabsLayout --> InicioPage["app/(tabs)/inicio/page.tsx"]
  TabsLayout --> JornadaPage["app/(tabs)/jornada/page.tsx"]
  TabsLayout --> CuidadorPage["app/(tabs)/cuidador/page.tsx"]
  
  InicioPage --> DateStrip["components/ui/date-strip.tsx"]
  InicioPage --> FilterTabs["components/ui/filter-tabs.tsx"]
  InicioPage --> CollapsibleSection["components/ui/collapsible-section.tsx"]
  InicioPage --> RoutineEntrySheet["components/routine/RoutineEntrySheet.tsx"]
  
  JornadaPage --> AiInsightCard["components/upsell/AiInsightCard.tsx"]
  JornadaPage --> PaywallSheet["components/upsell/PaywallSheet.tsx"]
  
  CuidadorPage --> AudioRecorder["components/routine/AudioRecorder.tsx (Premium)"]
  CuidadorPage --> InviteSheet["components/cuidador/InviteSheet.tsx"]
  CuidadorPage --> PaywallSheet
  
  RootLayout --> TriageLayout["app/jornada/layout.tsx"]
  TriageLayout --> TriagePage["app/jornada/triagem/page.tsx (Chat Assistente)"]
```

---

### 2. Data Flow (Fluxo de Dados da Triagem AI)

Mostra como as mensagens de chat trafegam do cliente para as APIs de terceiros mantendo a segurança da chave de API e transmitindo as respostas em formato Event Stream (SSE).

```mermaid
sequenceDiagram
  participant Client as Cliente (Chat UI)
  participant API as Next.js API (/api/triage)
  participant LLM as API do LLM (Groq Cloud)

  Client->>API: Envia histórico de mensagens (POST)
  Note over API: Injeta o SYSTEM_PROMPT<br/>e recupera a chave GROQ_API_KEY
  API->>LLM: Requisição de Chat Completion (Stream: True)
  LLM-->>API: Retorna chunk de dados (SSE Stream)
  API-->>Client: Repassa Stream diretamente (SSE Stream)
  Note over Client: GSAP renderiza as letras<br/>e o chat rola de forma suave
```

---

### 3. DB Schema (Modelo Físico do Banco)

Mapeamento Entidade-Relacionamento do banco de dados configurado no arquivo `schema.prisma`.

```mermaid
erDiagram
  USER {
    string id PK
    string email UK
    datetime emailVerified
    string name
    string avatarUrl
    PlanTier plan
    datetime createdAt
    datetime updatedAt
  }
  
  FAMILY {
    string id PK
    string childName
    datetime childBirthDate
    DiagnosisPhase diagnosisPhase
    datetime createdAt
    datetime updatedAt
  }
  
  FAMILY_MEMBER {
    string id PK
    string userId FK
    string familyId FK
    CaregiverRole role
    datetime joinedAt
  }

  ROUTINE_ENTRY {
    string id PK
    string familyId FK
    RoutineCategory category
    datetime occurredAt
    int durationMin
    int severity
    string notes
    string audioUrl
    datetime createdAt
  }

  ROUTINE_ENTRY_TAG {
    string id PK
    string entryId FK
    string tag
  }

  NOTE {
    string id PK
    string userId FK
    string familyId FK
    string text
    string insight
    datetime createdAt
  }

  WELLBEING_CHECKIN {
    string id PK
    string userId FK
    int level
    datetime createdAt
  }

  CONSENT {
    string id PK
    string familyId FK
    string grantedToEmail
    string grantedToRole
    string dataScope
    ConsentStatus status
    datetime grantedAt
    datetime revokedAt
  }

  CONSENT_LOG {
    string id PK
    string consentId FK
    ConsentStatus action
    string actorId
    string ip
    string userAgent
    datetime createdAt
  }

  TRIAGE_RESULT {
    string id PK
    string familyId FK
    string rawTranscript
    json suggestedRoute
    datetime createdAt
  }

  AI_INSIGHT {
    string id PK
    string familyId FK
    string title
    string description
    boolean lockedForFree
    json data
    datetime createdAt
  }

  USER ||--o{ FAMILY_MEMBER : "perfil cadastrado em"
  FAMILY ||--o{ FAMILY_MEMBER : "contém cuidadores"
  FAMILY ||--o{ ROUTINE_ENTRY : "possui registros de rotina"
  ROUTINE_ENTRY ||--o{ ROUTINE_ENTRY_TAG : "rotulado por"
  USER ||--o{ NOTE : "escreve"
  USER ||--o{ WELLBEING_CHECKIN : "registra bem-estar"
  FAMILY ||--o{ CONSENT : "emite autorização"
  CONSENT ||--o{ CONSENT_LOG : "audita alterações"
  FAMILY ||--o{ TRIAGE_RESULT : "gera rota de"
  FAMILY ||--o{ AI_INSIGHT : "recebe insights"
```

---

### 4. Auth & Consent Flow (Autenticação e LGPD)

Fluxo de validação de autenticação via NextAuth e controle de acesso a dados médicos auditado pela tabela de consentimento.

```mermaid
sequenceDiagram
  actor Cuidador
  actor Profissional
  participant App as Neuro + Web (App)
  participant DB as Banco de Dados (Prisma)

  Cuidador->>App: Concede Consentimento para Profissional (Email, Papel, Escopo)
  App->>DB: Cria registro na tabela Consent e insere log imutável no ConsentLog
  
  Profissional->>App: Solicita acesso aos dados de evolução da criança
  App->>DB: Busca consentimento ativo correspondente (status == GRANTED)
  alt Consentimento Válido
    DB-->>App: Retorna dados solicitados
    App-->>Profissional: Exibe evolução clínica na interface
  else Consentimento Inexistente ou Revogado (REVOKED)
    DB-->>App: Acesso Negado
    App-->>Profissional: Exibe tela de erro de permissão (403)
  end
```

---

### 5. Fluxo de Interação com o App de Ponta a Ponta

Visão completa do caminho trilhado pela família dentro da plataforma Neuro +.

```mermaid
flowchart TD
  Start([Entrada no App]) --> Login{Autenticação}
  Login -->|Primeiro Acesso| Triage[Triagem Inicial Inteligente]
  Login -->|Retorno| Home[Dashboard Principal / Home]
  
  Triage -->|Coleta de Dados de Sintomas| RouteGen[Geração de Rota / Jornada Visual]
  RouteGen --> Home
  
  Home -->|Anotações Rápidas| Notes[Bloco de Notas / Gravação de Áudio]
  Home -->|Diário de Rotina| Routine[Registrar Sono, Alimentação, Crises]
  Home -->|Como está hoje?| Wellbeing[Check-in de Bem-Estar do Cuidador]
  
  Notes --> InsightEngine[Detecção Passiva de Padrões]
  Routine --> InsightEngine
  
  InsightEngine -->|Conta Gratuita| LockInsight[Insight Bloqueado + Upsell Paywall]
  InsightEngine -->|Assinante Premium| ShowInsight[Exibição de Gráficos e Correlações de IA]
  
  Home -->|Exportar Relatório| PrintDoc[Relatório Clínico em HTML para Impressão]
  Home -->|Compartilhar com Rede| ConsentHub[Hub de Consentimento LGPD para Escola/Terapeutas]
  
  ConsentHub --> RevokeAccess[Revogação Imediata com Logs de Auditoria]
  PrintDoc --> DocEntregue([Médico recebe histórico estruturado no SUS])
```

---

## 🔒 Proteção de Dados e LGPD

1.  **Trilha de Auditoria Imutável:** Todas as alterações de status de compartilhamento (concessões e revogações) disparam gatilhos no banco de dados que salvam registros na tabela `ConsentLog` contendo IP, User Agent e ID do ator responsável. Esta tabela não possui métodos de alteração (`UPDATE`) ou exclusão (`DELETE`) expostos na API.
2.  **Consentimento Granular:** O escopo do dado (`dataScope`) define limites estritos de permissão de leitura. Por exemplo, a professora da escola não tem permissão para visualizar laudos médicos se o consentimento concedido abranger apenas evolução escolar.
