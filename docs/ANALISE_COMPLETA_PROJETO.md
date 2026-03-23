# Análise Completa do Projeto — Lidera Treinamentos

> Gerada em: 23/03/2026

---

## 1. Visão Geral do Produto

**Lidera Treinamentos** é uma plataforma EdTech híbrida (digital + presencial + B2B) posicionada como um ecossistema de experiências de aprendizagem focado em desenvolvimento humano corporativo.

**Proposta de valor:** *"Lidera Treinamentos eleva mentes e inspira resultados aplicáveis no trabalho real."*

### Modelo de Receita (multi-canal)

| Canal | Descrição |
|-------|-----------|
| **B2C Digital** | Academia estilo streaming com cursos avulsos, assinaturas e trilhas certificadas |
| **B2B Presencial** | Workshops, imersões e treinamentos in-company |
| **B2B Híbrido** | Contratos corporativos combinando acesso digital + treinamento presencial com analytics para RH |

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Framework** | Next.js (App Router, SSR) | 16.1.6 |
| **Linguagem** | TypeScript | ^5 |
| **UI** | React + Tailwind CSS 4 + shadcn/ui | React 19.2.3 |
| **Animações** | Framer Motion | ^12.34.3 |
| **Ícones** | Lucide React | ^0.575.0 |
| **Banco de Dados** | PostgreSQL (Supabase) com RLS | — |
| **Autenticação** | Supabase Auth (JWT + cookies) | SSR ^0.8.0 |
| **Pagamentos** | Stripe (Checkout + Webhooks) | ^20.4.0 |
| **Formulários** | React Hook Form + Zod | ^7.71 / ^4.3 |
| **Deploy** | Vercel (inferido) | — |

---

## 3. Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                          # Landing page pública
│   ├── layout.tsx                        # Layout raiz (Manrope + Sora fonts)
│   ├── globals.css                       # Estilos globais Tailwind
│   ├── admin/                            # Painel administrativo
│   │   ├── page.tsx                      # Dashboard KPIs
│   │   ├── layout.tsx                    # Layout com verificação de role
│   │   ├── actions.ts                    # Server actions admin
│   │   ├── cursos/                       # CRUD de cursos
│   │   ├── alunos/                       # Gestão de alunos
│   │   ├── leads/                        # Pipeline B2B
│   │   └── aiox-dashboard/              # Painel IA (AIOX Office)
│   ├── auth/
│   │   ├── actions.ts                    # Login, signup, logout
│   │   ├── login/page.tsx               # Tela de login
│   │   └── register/page.tsx            # Cadastro de alunos
│   ├── dashboard/                        # Portal do aluno
│   │   ├── page.tsx                      # Dashboard com XP e badges
│   │   ├── layout.tsx                    # Layout com sidebar
│   │   ├── cursos/                       # Cursos matriculados
│   │   ├── perfil/                       # Perfil do usuário
│   │   ├── configuracoes/               # Configurações de conta
│   │   └── certificado/                 # Emissão de certificados
│   ├── curso/[course_id]/              # Vitrine do curso (público)
│   ├── cursos/                          # Catálogo público
│   ├── certificado/verificar/[id]/     # Verificação pública de certificado
│   ├── empresas/                        # Landing B2B
│   ├── contato/                         # Formulário de contato
│   ├── sobre/                           # Página institucional
│   └── api/
│       ├── b2b/leads/route.ts           # API captura de leads
│       ├── stripe/webhook/route.ts      # Webhook Stripe (rota 1)
│       └── webhooks/stripe/route.ts     # Webhook Stripe (rota 2) ⚠️
├── components/
│   ├── ui/                              # shadcn/ui (button, card, form, input, etc.)
│   ├── site/                            # Header, Footer, LeadFormB2B
│   ├── dashboard/                       # SidebarNav, CourseShelfCard, AvaliacaoInicialForm
│   ├── admin/                           # AdminSidebarNav
│   ├── aiox/                            # AioxOffice, AgentDesk (IA)
│   └── VideoPlayer.tsx                  # Player de vídeo
├── lib/
│   ├── supabase/                        # Clientes Supabase (server, client, middleware, service)
│   ├── stripe.ts                        # Configuração Stripe
│   ├── stripe-webhook.ts               # Handler de webhooks
│   ├── utils.ts                         # Utilitários (cn)
│   └── actions/                         # Server actions (assessment, lms)
├── middleware.ts                         # Proteção de rotas
└── types/database.ts                    # Tipos TypeScript do banco

docs/
├── prd/
│   ├── LIDERA_PRD.md                    # Documento de requisitos completo
│   └── LIDERA_GAP_BACKLOG.md            # Análise de gaps e backlog
├── database/
│   ├── 01_LMS_schema.sql                # Schema LMS core
│   ├── 02_profiles_admin_setup.sql      # Perfis e RBAC
│   ├── 03_commerce_orders.sql           # Orders e payments
│   ├── 04_b2b_pipeline.sql              # Leads e proposals
│   ├── 05_certificates.sql              # Certificados
│   └── LIDERA_SCHEMA.md                 # Documentação do schema
├── architecture/LIDERA_STACK.md         # Documentação técnica
├── sprints/LIDERA_ROADMAP.md            # Roadmap de sprints
└── email_templates/                     # Templates de email (welcome, reset)
```

---

## 4. Esquema do Banco de Dados

### 4.1 Domínio LMS (Core)

| Tabela | Propósito | Campos-chave |
|--------|-----------|--------------|
| `courses` | Produtos educacionais | title, description, price, is_published, tenant_id, thumbnail_url |
| `modules` | Organização em capítulos | course_id, title, order_index |
| `lessons` | Conteúdo (vídeo/texto) | module_id, video_url, content_text, duration_seconds, order_index |
| `enrollments` | Matrículas | user_id, course_id, status (active/completed/expired) |
| `progress` | Progresso por aula | enrollment_id, lesson_id, is_completed, watch_time_seconds |

### 4.2 Comércio

| Tabela | Propósito |
|--------|-----------|
| `orders` | Transações de compra (status: pending → paid → canceled) |
| `order_items` | Itens do pedido (curso, evento, assinatura) |
| `payments` | Registros de pagamento (Stripe) |
| `webhook_events` | Log de eventos Stripe (idempotência) |

### 4.3 B2B

| Tabela | Propósito |
|--------|-----------|
| `b2b_leads` | Captura de prospects corporativos |
| `proposals` | Propostas comerciais vinculadas a leads |

### 4.4 Certificados

| Tabela | Propósito |
|--------|-----------|
| `certificates` | Certificados com verification_code e pdf_url |

### 4.5 Planejado (Fase 2+)

- `events`, `event_batches`, `event_tickets`, `event_checkins` — Imersões presenciais
- `subscriptions`, `subscription_items` — Planos recorrentes
- `community_posts`, `comments`, `likes` — Comunidade
- `gamification_points` — Pontuação e achievements
- `companies`, `company_users` — Multi-tenancy B2B

---

## 5. Fluxos Principais

### 5.1 Autenticação
```
Login → Supabase Auth (email/password) → Cookie JWT → Middleware valida sessão
→ Redireciona: autenticado → /dashboard | não-autenticado → /auth/login
→ Admin: verifica profiles.role === 'admin' no layout
```

### 5.2 Compra e Matrícula
```
Aluno clica "Comprar" → Cria order (pending) → Stripe Checkout Session
→ Pagamento processado → Webhook recebido
→ checkout.session.completed → Upsert enrollment + payment record + order=paid
→ checkout.session.expired → Order canceled
```

### 5.3 Consumo de Conteúdo
```
Dashboard → Meus Cursos → Seleciona curso → Lista módulos/aulas
→ Assiste aula → Atualiza progress (watch_time, is_completed)
→ 100% conclusão → Desbloqueia certificado
```

### 5.4 Gamificação (atual)
```
XP = (aulas completas × 45) + (dias ativos últimos 30 × 20) + (cursos ativos × 30)
Nível = floor(XP / 500) + 1
3 badges fixos: Primeira Aula, 7 Dias Seguidos, Curso Completo
```

---

## 6. Segurança

| Aspecto | Implementação |
|---------|--------------|
| **Autenticação** | Supabase Auth com JWT em cookies HTTP-only |
| **Autorização** | RLS no Supabase + verificação de role no layout |
| **Middleware** | Proteção de rotas /dashboard e /admin |
| **Webhooks** | Validação de assinatura Stripe + idempotência |
| **Service Role** | Client separado para operações admin (bypass RLS) |
| **Rate Limiting** | Mensagem amigável para limites de auth |

---

## 7. Status de Implementação

### Concluído ✅

- Landing pages institucionais (home, cursos, empresas, contato, sobre)
- Autenticação completa (login, registro, logout)
- LMS core: cursos, módulos, aulas, matrículas, progresso
- Painel admin com KPIs e gestão de cursos
- Checkout Stripe para cursos avulsos
- Webhook para liberação de acesso
- Avaliação inicial (self-assessment)
- Dashboard do aluno com XP e badges
- Sidebar responsiva (aluno e admin)
- Painel AIOX Office (dashboard IA)
- Catálogo público de cursos
- Player de vídeo HTML5

### Parcialmente Implementado ⚠️

- **Checkout**: apenas curso avulso (sem assinaturas ou bundles)
- **Webhooks**: 2 rotas duplicadas (`/api/stripe/webhook` e `/api/webhooks/stripe`)
- **Certificados**: endpoint de verificação usa prefixo, não consulta real ao banco
- **Admin**: sem modelo centralizado de permissões

### Pendente (por prioridade) 🔴

#### P0 — Crítico
1. **Consolidar webhooks** em rota única idempotente
2. **Pipeline B2B** com persistência (leads + propostas no banco)
3. **Certificados reais** com verification_code no banco
4. **Qualidade base**: corrigir lint, adicionar typecheck, smoke tests

#### P1 — Experiência
5. Modelo de assinatura (planos recorrentes)
6. Domínio de eventos presenciais (imersões, tickets, check-in)
7. Rail "Continue Assistindo" personalizado
8. Recomendações por progresso/categoria

#### P2 — Escala
9. Dashboard de HR Analytics por empresa/time
10. Comunidade com feed/fórum
11. Gamificação completa (níveis, metas semanais, achievements)
12. Programa de afiliados
13. App mobile

---

## 8. Problemas e Riscos Identificados

### 🔴 Críticos

| # | Problema | Impacto | Correção |
|---|----------|---------|----------|
| 1 | **Webhooks Stripe duplicados** — 2 rotas com lógica similar | Possível matrícula duplicada, manutenção difícil | Consolidar em rota única com `webhook_events` |
| 2 | **Certificado placeholder** — valida por prefixo, não por DB | Certificados falsos passam na verificação | Query na tabela `certificates` com verification_code |
| 3 | **Stripe API version hardcoded** — `'2026-02-25.clover'` pode ser inválida | Erros silenciosos em produção | Usar versão estável documentada |
| 4 | **Fallback de chave dummy** — service role e Stripe usam chaves fake se env ausente | Falha silenciosa em produção | Validar envs obrigatórias no startup |
| 5 | **cookies.txt no repositório** — arquivo com cookies visível | Possível exposição de dados sensíveis | Adicionar ao .gitignore e remover do histórico |

### 🟡 Moderados

| # | Problema | Impacto |
|---|----------|---------|
| 6 | `package.json` com nome `tmp-app` | Identidade do projeto ausente |
| 7 | README.md é template padrão do Next.js | Sem documentação real do projeto |
| 8 | Scripts admin (`create_*.mjs`) na raiz | Desorganização, risco de execução acidental |
| 9 | `next_dev.log` no repositório | Arquivo de log não deveria estar versionado |
| 10 | Sem testes automatizados | Nenhum framework de teste configurado |
| 11 | Sem CI/CD configurado | Build e deploy manuais |
| 12 | Ausência de error boundaries | Crashes não tratados no frontend |

### 🟢 Melhorias

| # | Melhoria |
|---|----------|
| 13 | Adicionar loading states consistentes em todas as páginas |
| 14 | Implementar cache de queries com React Server Components |
| 15 | Adicionar monitoramento de erros (Sentry ou similar) |
| 16 | Documentar variáveis de ambiente necessárias |
| 17 | Implementar HLS/adaptive bitrate no player de vídeo |

---

## 9. Roadmap (3 Fases / 12 Sprints)

### Fase 1 — Fundação e Autoridade (Sprints 1-4)
- Sprint 1: Reposicionamento e base do produto
- Sprint 2: Academy Stream (MVP Netflix-style)
- Sprint 3: Ecommerce unificado (checkout + webhooks)
- Sprint 4: Área do aluno básica (dashboard + certificados)

**Marco:** Receita digital ativa, onboarding funcional

### Fase 2 — Expansão e Comunidade (Sprints 5-8)
- Sprint 5: Imersões e eventos presenciais
- Sprint 6: Funil de vendas B2B
- Sprint 7: Comunidade e engajamento
- Sprint 8: Gamificação da jornada

**Marco:** Operações híbridas em produção, tração B2B inicial

### Fase 3 — Escala e Dados (Sprints 9-12)
- Sprint 9: HR Analytics (B2B)
- Sprint 10: App mobile
- Sprint 11: Programa de afiliados
- Sprint 12: Hardening de escala

**Marco:** Maturidade operacional, receita previsível

---

## 10. Métricas de Código

| Métrica | Valor |
|---------|-------|
| **Arquivos TypeScript/TSX** | ~55 |
| **Páginas (rotas)** | ~20 |
| **Componentes reutilizáveis** | ~15 |
| **Server Actions** | ~6 |
| **API Routes** | 3 |
| **SQL Migrations** | 5 |
| **Documentação** | 7 arquivos |
| **Testes** | 0 ❌ |

---

## 11. Avaliação de Arquitetura

### Pontos Fortes ✅
- Separação clara de responsabilidades (auth, db, pagamentos)
- Uso correto de Server Components para segurança de dados
- Webhook idempotente previne duplicação de pagamentos
- RLS (Row Level Security) para isolamento de dados
- Design responsivo com progressive enhancement
- Documentação detalhada (PRD, schema, roadmap, gaps)
- App Router do Next.js bem utilizado (layouts, loading, error states)

### Pontos Fracos ❌
- Zero testes automatizados
- Webhooks duplicados
- Certificação placeholder
- Sem validação de variáveis de ambiente
- Sem CI/CD pipeline
- Sem monitoramento de erros em produção
- Arquivos sensíveis/temporários no repositório

### Recomendações Prioritárias
1. Consolidar webhooks Stripe em rota única
2. Adicionar validação de envs no startup
3. Implementar testes (pelo menos smoke tests nos fluxos críticos)
4. Configurar CI/CD com lint + typecheck + build
5. Remover arquivos sensíveis do repositório (cookies.txt, next_dev.log)
6. Renomear package.json de `tmp-app` para `lidera-learning`

---

*Análise gerada automaticamente. Para dúvidas, consulte a documentação em `/docs`.*
