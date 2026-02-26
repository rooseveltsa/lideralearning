# Lidera - Arquitetura Técnica e Stack

## 1. Visão Geral da Arquitetura
A Lidera foi projetada como uma plataforma SaaS Multi-Tenant, API-first e Cloud-Native. Ela separa a camada de apresentação (frontend) da lógica de negócios e banco de dados (backend).

**Princípios Fundamentais:**
- Alto uso de serviços Serverless / Gerenciados para reduzir a carga de DevOps e melhorar a escalabilidade.
- Multi-Tenancy B2B (Row-Level Security) para garantir o isolamento de dados entre clientes corporativos.
- Distribuição Global na Borda (CDN) para streaming de vídeo rápido e entrega de ativos estáticos.
- Padrões Orientados a Eventos (Event-Driven) para desacoplar os serviços de LMS, Comercial e IA.

## 2. Recomendação de Stack Tecnológico

### 2.1. Frontend (Aplicação Web)
- **Framework:** Next.js 14+ (React) utilizando App Router.
- **Estilização:** Tailwind CSS + Radix UI (ou Shadcn/ui para componentes acessíveis e sem estilo pré-definido).
- **Gerenciamento de Estado:** Zustand (estado do cliente) + React Query (estado do servidor).
- **Player de Vídeo:** Video.js ou Mux Player (para streaming HLS otimizado).

### 2.2. Backend (API e Lógica de Negócios)
- **API Principal:** Node.js (TypeScript) com Express ou NestJS (para padrões corporativos estruturados) OU Supabase Edge Functions / Next.js API Routes para uma abordagem mais serverless.
- **Tempo Real e GraphQL/REST:** Supabase (PostgREST para APIs instantâneas, Realtime para recursos de comunidade).
- **Gateway de Pagamento:** Stripe ou Pagar.me/Vindi (assinaturas recorrentes, split de pagamentos, PIX, lotes dinâmicos).

### 2.3. Banco de Dados e Armazenamento
- **Banco de Dados Relacional:** PostgreSQL (via Supabase) - Excelente para dados relacionais complexos (LMS, Hierarquias Corporativas) e Segurança em Nível de Linha (RLS - Row-Level Security) para multi-tenancy.
- **Banco de Dados Vetorial:** pgvector (extensão no PostgreSQL) para embeddings de IA (busca por similaridade para recomendações de conteúdo e chatbots).
- **Armazenamento de Arquivos:** AWS S3 ou Supabase Storage (para PDFs, avatares).
- **Hospedagem de Vídeos:** Mux ou AWS MediaLive/MediaConvert para streaming HLS com bitrate adaptativo (crucial para LMS).

### 2.4. Camada de Inteligência Artificial
- **Provedor de LLM:** OpenAI (GPT-4o) ou Anthropic (Claude 3.5 Sonnet) via API.
- **Orquestração:** LangChain ou LlamaIndex (versões em TypeScript) para RAG (Geração Aumentada por Recuperação) ao responder dúvidas de alunos baseadas no material do curso.
- **Análises:** Microsserviços em Python (ex: FastAPI) se modelos de Machine Learning complexos (análise de sentimento) forem necessários além das chamadas de API do LLM.

## 3. Módulos do Sistema de Alto Nível

1. **Serviço de Autenticação e Identidade:** Gerencia o login de usuários (SSO para Corporativo), Controle de Acesso Baseado em Perfis (RBAC - Admin, RH, Aluno).
2. **Serviço de LMS:** Gerencia Cursos, Módulos, Aulas, Rastreamento de Progresso e Geração de Certificados.
3. **Serviço Comercial:** Gerencia Checkout, Assinaturas, Webhooks (sucesso no pagamento -> concessão de acesso).
4. **Serviço Corporativo:** Gerencia perfis de Inquilinos (Empresas), matrizes 9-Box e dashboards de RH.
5. **Serviço de Comunidade:** Gerencia Feeds, Fóruns, Notificações (WebSockets).
6. **Serviço Orquestrador de IA:** Intercepta gatilhos (ex: reprovação em um quiz) para gerar planos de ação dinâmicos ou responde perguntas de alunos via RAG.

## 4. Plano de Escalabilidade e Expansão Global

- **Fase 1 (Brasil Primeiro):** Implantação nas regiões US-East ou São Paulo (AWS/Supabase). Uso de Cloudflare para cache na borda. Manter transações em BRL.
- **Fase 2 (América Latina e EUA):** Introduzir suporte multi-moeda no banco de dados (coluna `currency_code`). Utilizar recursos multi-moeda do Stripe. Implementar i18n (next-intl) no frontend Next.js.
- **Residência de Dados:** Caso ocorra expansão para a União Europeia, considerar uma implantação multi-região para conformidade com o GDPR (mantendo dados de inquilinos da UE em servidores da UE).
