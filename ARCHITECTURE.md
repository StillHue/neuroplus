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
  RootLayout["app/layout.tsx (Global Providers)"] 
  
  subgraph Auth ["Autenticação"]
    AuthLayout["app/(auth)/layout.tsx"] --> LoginPage["app/(auth)/login/page.tsx"]
  end

  subgraph MainTabs ["Abas Principais (Tabs)"]
    TabsLayout["app/(tabs)/layout.tsx"] --> BottomNav["components/BottomNav.tsx (Pílula GSAP)"]
    TabsLayout --> InicioPage["app/(tabs)/inicio/page.tsx"]
    TabsLayout --> JornadaPage["app/(tabs)/jornada/page.tsx"]
    TabsLayout --> CuidadorPage["app/(tabs)/cuidador/page.tsx"]
  end

  subgraph UIComponents ["Componentes de UI"]
    InicioPage --> DateStrip["components/ui/date-strip.tsx"]
    InicioPage --> FilterTabs["components/ui/filter-tabs.tsx"]
    InicioPage --> CollapsibleSection["components/ui/collapsible-section.tsx"]
    InicioPage --> RoutineEntrySheet["components/routine/RoutineEntrySheet.tsx"]
    
    JornadaPage --> AiInsightCard["components/upsell/AiInsightCard.tsx"]
    JornadaPage --> PaywallSheet["components/upsell/PaywallSheet.tsx"]
    
    CuidadorPage --> AudioRecorder["components/routine/AudioRecorder.tsx (Premium)"]
    CuidadorPage --> InviteSheet["components/cuidador/InviteSheet.tsx"]
    CuidadorPage --> PaywallSheet
  end

  subgraph Triage ["Triagem & Rota de Saúde"]
    RootLayout --> TriageLayout["app/jornada/layout.tsx"]
    TriageLayout --> TriagePage["app/jornada/triagem/page.tsx (Chat Assistente)"]
  end

  RootLayout --> AuthLayout
  RootLayout --> TabsLayout
```

---

### 2. Data Flow (Fluxo de Dados da Triagem AI)

Mostra como as mensagens de chat trafegam do cliente para as APIs de terceiros mantendo a segurança da infraestrutura de chaves de API e transmitindo as respostas em formato Event Stream (SSE).

```mermaid
sequenceDiagram
  participant Client as Cliente (Chat UI)
  participant API as API Server (/api/triage)
  participant LLM as API do LLM (Serviço de Nuvem)

  Client->>API: Envia histórico de mensagens (POST)
  Note over API: Injeta o Prompt do Sistema e<br/>valida tokens de autorização seguros
  API->>LLM: Requisição de Chat Completion (Stream: True)
  LLM-->>API: Retorna chunk de dados (SSE Stream)
  API-->>Client: Repassa Stream diretamente (SSE Stream)
  Note over Client: GSAP renderiza as letras<br/>e o chat rola de forma suave
```

---

### 3. DB Schema (Modelo Físico do Banco)

Para facilitar a leitura e evitar diagramas excessivamente complexos, o esquema de dados do banco de dados (`schema.prisma`) foi dividido em três modelos temáticos:

#### A. Núcleo de Usuários, Cuidadores & Família
Mapeia o cadastro de contas e agrupamento familiar.

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

  USER ||--o{ FAMILY_MEMBER : "perfil cadastrado em"
  FAMILY ||--o{ FAMILY_MEMBER : "contém cuidadores"
```

#### B. Rotina & Evolução de Cuidado
Mapeia os registros cotidianos, anotações e sentimentos dos cuidadores.

```mermaid
erDiagram
  FAMILY {
    string id PK
    string childName
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

  FAMILY ||--o{ ROUTINE_ENTRY : "possui registros"
  ROUTINE_ENTRY ||--o{ ROUTINE_ENTRY_TAG : "rotulado por"
```

#### C. Segurança, Consentimento LGPD & Insights de IA
Mapeia as auditorias de acesso e gerações automáticas de rota médica.

```mermaid
erDiagram
  FAMILY {
    string id PK
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
    string ipAddress
    string deviceAgent
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

  FAMILY ||--o{ CONSENT : "emite autorização"
  CONSENT ||--o{ CONSENT_LOG : "audita alterações"
  FAMILY ||--o{ TRIAGE_RESULT : "gera rota de"
  FAMILY ||--o{ AI_INSIGHT : "recebe insights"
```

---

### 4. Auth & Consent Flow (Autenticação e LGPD)

Fluxo de validação de autenticação e controle de acesso a dados médicos auditado pela tabela de consentimento.

```mermaid
sequenceDiagram
  actor Cuidador
  actor Profissional
  participant App as App Web (Client)
  participant DB as Banco de Dados (ORM)

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
  
  subgraph Acesso ["Fase de Acesso e Entrada"]
    Login -->|Primeiro Acesso| Triage[Triagem Inicial Inteligente]
    Login -->|Retorno| Home[Dashboard Principal / Home]
    Triage -->|Coleta de Dados de Sintomas| RouteGen[Geração de Rota / Jornada Visual]
    RouteGen --> Home
  end

  subgraph Registros ["Fase de Acompanhamento Quotidiano"]
    Home -->|Anotações Rápidas| Notes[Bloco de Notas / Gravação de Áudio]
    Home -->|Diário de Rotina| Routine[Registrar Sono, Alimentação, Crises]
    Home -->|Como está hoje?| Wellbeing[Check-in de Bem-Estar do Cuidador]
  end
  
  subgraph Analytics ["Fase de Inteligência e Evolução"]
    Notes --> InsightEngine[Detecção Passiva de Padrões]
    Routine --> InsightEngine
    
    InsightEngine -->|Conta Gratuita| LockInsight[Insight Bloqueado + Upsell Paywall]
    InsightEngine -->|Assinante Premium| ShowInsight[Exibição de Gráficos e Correlações de IA]
  end
  
  subgraph Saida ["Fase de Compartilhamento Clínico"]
    Home -->|Exportar Relatório| PrintDoc[Relatório Clínico em HTML para Impressão]
    Home -->|Compartilhar com Rede| ConsentHub[Hub de Consentimento LGPD para Escola/Terapeutas]
    
    ConsentHub --> RevokeAccess[Revogação Imediata com Logs de Auditoria]
    PrintDoc --> DocEntregue([Médico recebe histórico estruturado no SUS])
  end
```

---

## 🔒 Proteção de Dados e LGPD

1.  **Trilha de Auditoria Imutável:** Todas as alterações de status de compartilhamento (concessões e revogações) disparam gatilhos no banco de dados que salvam registros na tabela `ConsentLog` contendo identificadores e metadados de acesso (sem chaves privadas). Esta tabela não possui métodos de alteração (`UPDATE`) ou exclusão (`DELETE`) expostos na API.
2.  **Consentimento Granular:** O escopo do dado (`dataScope`) define limites estritos de permissão de leitura. Por exemplo, a professora da escola não tem permissão para visualizar laudos médicos se o consentimento concedido abranger apenas evolução escolar.
