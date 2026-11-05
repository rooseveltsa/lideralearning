# Lidera Learning

Plataforma de treinamento da **Lidera Treinamentos** (fundador Claudemir). O aluno se cadastra, compra uma formação, assiste às aulas, acompanha o progresso e emite certificado. O admin publica cursos, módulos e a URL real de cada vídeo.

Produção: [https://lideralearning.vercel.app](https://lideralearning.vercel.app)

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- Supabase Auth e Postgres (RLS)
- Stripe (checkout e webhook assinado)
- Resend (e-mail) e Anthropic (PDI e diagnósticos)
- Deploy na Vercel

## Jornada do aluno

1. Cadastro ou login em `/auth/register` e `/auth/login`
2. Catálogo em `/cursos` e página da formação em `/curso/[id]`
3. Checkout Stripe (em desenvolvimento local sem chave real, a matrícula é liberada em modo de teste)
4. Área do aluno em `/dashboard`: trilha, aula, progresso e certificado
5. Admin em `/admin/cursos`: preço, publicação e URL do vídeo de cada aula

O programa documentado no seed é **Supervisor: Da Operação à Liderança**, a **R$ 3.330**. O curso **Liderança Exponencial** a R$ 997, com vídeo Big Buck Bunny, é demonstração do seed antigo e não deve ser vendido. A migração `supabase/migrations/20261105150000_enable_rls_and_align_catalog.sql` tira esse demo da vitrine e cria o programa oficial se ele ainda não existir, sem sobrescrever um preço que já tenha sido alterado.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

O arquivo `.env.example` lista as variáveis. Sem as chaves do Supabase o site sobe, mas catálogo, login e checkout não falam com o banco.

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima (browser e servidor do aluno) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role. Só no servidor. Ignora RLS |
| `NEXT_PUBLIC_APP_URL` | URL pública usada no retorno do Stripe e no certificado |
| `NEXT_PUBLIC_SITE_URL` | URL canônica em links de e-mail e formulários |
| `STRIPE_SECRET_KEY` | Chave secreta Stripe |
| `STRIPE_WEBHOOK_SECRET` | Segredo do endpoint `/api/webhooks/stripe` |
| `RESEND_API_KEY` | Envio de e-mail |
| `EMAIL_FROM` | Remetente |
| `EMAIL_REPLY_TO` | Resposta |
| `ANTHROPIC_API_KEY` | Geração de PDI |
| `CRON_SECRET` | Protege o cron de reengajamento |

Há outras chaves opcionais (Meta, Google, NVIDIA, preço do PDI). O app funciona no fluxo de aulas sem elas.

## Scripts

```bash
npm run dev            # servidor local
npm run build          # build de produção
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm run test:journey   # jornada, webhook Stripe e guardas de admin
npm run test:e2e       # Playwright (sobe o app com Supabase falso)
npm run test:learning  # biblioteca de treinamentos
npm run test:diagnostico
```

## Banco

Os SQLs históricos estão em `docs/database/`. **Não rode** `docs/database/01_LMS_schema.sql` de novo: ele apaga as tabelas do LMS.

Migrações versionadas ficam em `supabase/migrations/`. Para alinhar RLS e o catálogo em produção:

1. Abra o SQL Editor do projeto Supabase de produção.
2. Cole e execute `supabase/migrations/20261105150000_enable_rls_and_align_catalog.sql`.
3. Confira no advisor que as tabelas públicas têm RLS e que a view `empresas`, se existir, está com `security_invoker`.
4. No admin, abra o curso oficial e cole a URL real de cada aula. Enquanto a URL for vazia ou for Big Buck Bunny, o player avisa que o vídeo não é oficial.

O service role continua gravando pedidos, webhooks e formulários. Aluno autenticado vê a própria linha. Admin passa por `public.is_admin()`.

## Stripe

O endpoint vigente é `POST /api/webhooks/stripe`. Ele exige o header `stripe-signature` e valida com `STRIPE_WEBHOOK_SECRET`. O caminho antigo `/api/stripe/webhook` responde 410.

No painel da Stripe, aponte o webhook para `https://lideralearning.vercel.app/api/webhooks/stripe` e assine pelo menos `checkout.session.completed` e `checkout.session.expired`.

## Deploy

A Vercel publica o branch de produção. Defina as mesmas variáveis de ambiente no projeto e rode a migração no Supabase antes de anunciar a formação oficial. Sem a migração, a vitrine pode continuar mostrando só o curso de demonstração.

## O que ainda depende do dono

- Aplicar a migração no Supabase de produção
- Gravar as URLs reais das aulas no admin
- Conferir se R$ 3.330 continua sendo o preço de venda do programa Supervisor
- Chaves de produção (Supabase, Stripe, Resend, Anthropic) fora do git
