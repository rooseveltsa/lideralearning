# Lidera Treinamentos

Plataforma EdTech híbrida (digital + presencial + B2B) para desenvolvimento humano corporativo.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **UI:** React 19 + Tailwind CSS 4 + shadcn/ui
- **Banco de dados:** PostgreSQL (Supabase) com Row Level Security
- **Autenticação:** Supabase Auth (JWT + cookies)
- **Pagamentos:** Stripe (Checkout Sessions + Webhooks)
- **Formulários:** React Hook Form + Zod

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher as variáveis (ver seção abaixo)

# 3. Executar migrations no Supabase SQL Editor
# Na ordem: 01_LMS_schema.sql → 02_profiles_admin_setup.sql → 03_commerce_orders.sql → 04_b2b_pipeline.sql → 05_certificates.sql

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave anon/public do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Produção | Chave service role (bypass RLS) |
| `STRIPE_SECRET_KEY` | Produção | Chave secreta do Stripe |
| `STRIPE_WEBHOOK_SECRET` | Produção | Secret do webhook Stripe |
| `NEXT_PUBLIC_APP_URL` | Produção | URL pública da aplicação |

## Scripts

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run start      # Iniciar servidor de produção
npm run lint       # Verificar lint
npm run typecheck  # Verificar tipos TypeScript
```

## Estrutura do Projeto

```
src/
├── app/           # Rotas e páginas (App Router)
│   ├── admin/     # Painel administrativo
│   ├── auth/      # Login e registro
│   ├── dashboard/ # Portal do aluno
│   ├── api/       # API routes (webhooks, leads)
│   └── ...        # Páginas públicas
├── components/    # Componentes reutilizáveis
├── lib/           # Utilitários, clients, actions
└── types/         # Tipos TypeScript
docs/
├── database/      # SQL migrations
├── prd/           # Documentos de requisitos
└── architecture/  # Documentação técnica
scripts/           # Scripts utilitários de administração
```

## Migrations (Supabase)

Executar na ordem no SQL Editor do Supabase:

1. `docs/database/01_LMS_schema.sql` — Schema LMS core
2. `docs/database/02_profiles_admin_setup.sql` — Perfis e RBAC
3. `docs/database/03_commerce_orders.sql` — Orders e payments
4. `docs/database/04_b2b_pipeline.sql` — Leads e proposals
5. `docs/database/05_certificates.sql` — Certificados

## Documentação

- [PRD completo](docs/prd/LIDERA_PRD.md)
- [Análise de gaps](docs/prd/LIDERA_GAP_BACKLOG.md)
- [Roadmap de sprints](docs/sprints/LIDERA_ROADMAP.md)
- [Arquitetura técnica](docs/architecture/LIDERA_STACK.md)
- [Schema do banco](docs/database/LIDERA_SCHEMA.md)
- [Análise completa do projeto](docs/ANALISE_COMPLETA_PROJETO.md)
