# Lidera - Roadmap & Sprint Execution Plan

Este documento detalha como a plataforma educacional Lidera será construída através de um processo ágil (Scrum), fatiando o grande escopo do PRD em Sprints entregáveis, focando primeiro no faturamento (Fase 1) e depois na escala B2B (Fase 2) e comunidade (Fase 3).

## Metodologia de Execução
- Sprints de 2 Semanas (14 dias).
- Foco em **Valor Contínuo** (Toda Sprint termina com algo testável/usável).
- O desenvolvimento do front-end e back-end acontecerá em paralelo.

---

## Fase 1: Core Educacional & Comercial (Sprints 1 a 4)
*Objetivo:* Ter a plataforma pronta para vender cursos e hospedar alunos de forma individual (B2C), garantindo o *Go-to-Market* rápido.

### Sprint 1: Fundação & Identidade
- Setup inicial da infraestrutura (Supabase, Next.js, Vercel/AWS).
- Configuração de CI/CD (GitHub Actions).
- Implementação da camada de Autenticação (Login, Cadastro, Redefinir Senha).
- Criação dos componentes base do Design System (Botões, Inputs, Tipografia Lidera).
- Modelagem do Banco de Dados: Tabelas Core (Usuários, Cursos, Módulos).

### Sprint 2: Catálogo & Área do Aluno
- Desenvolvimento do Player de Vídeo (integração HLS/Mux).
- Criação da tela "Meus Cursos" (Hub do Aluno).
- Estrutura de navegação de Módulos e Aulas.
- Rastreamento de progresso básico (Marcar aula como concluída).
- CRUD Administrativo para criação de cursos e upload de conteúdo.

### Sprint 3: O Motor de Vendas (Checkout)
- Integração com Gateway de Pagamento (Stripe/Pagar.me) - Cartão de Crédito e Pix.
- Criação do fluxo de Checkout de 1 página (High Conversion).
- Lógica de Webhooks: Liberar acesso ao curso no sistema ao confirmar pagamento.
- Painel financeiro básico para os administradores verem vendas em tempo real.

### Sprint 4: Lotes & Refinamento (Lançamento MVP)
- Funcionalidade de Lotes Dinâmicos (Para eventos presenciais ou lançamentos de cursos - ex: Lote 1 expira terça-feira).
- Geração automática de Certificados em PDF.
- Ajustes finos de UI/UX, testes de responsividade e QA Geral.

**-> MARCO:** Plataforma pronta para faturar com alunos individuais.

---

## Fase 2: Módulo Corporativo & HRTech (Sprints 5 a 7)
*Objetivo:* Habilitar a venda B2B (SaaS corporativo), permitindo que RHs de empresas comprem licenças em lote e gerenciem seus liderados.

### Sprint 5: Multi-Tenancy & Administração de RH
- Implementação rigorosa de Row-Level Security (RLS) para isolar dados entre empresas (Tenants).
- Criação do "Tenant Admin" (Painel do RH).
- Fluxo de compra de licenças B2B (ex: Comprar 100 acessos e convidar via e-mail).

### Sprint 6: Gestão de Performance
- Desenvolvimento da ferramenta de Matriz 9-Box no painel do RH gestor.
- Criação do módulo de PDI Digital (Plano de Desenvolvimento Individual).
- Relatórios gerenciais: Taxa de conclusão de cursos por departamento/empresa.

### Sprint 7: Camada Básica de IA (Assistente & Recomendações)
- Integração com a API da OpenAI/Anthropic.
- Motor de recomendação: Sugerir próximos cursos baseados nos resultados do 9-Box ou PDI.
- Assistente chatbot de Liderança restrito ao contexto dos materiais da Lidera (RAG).

**-> MARCO:** Produto SaaS B2B completo. Faturamento via licenças recorrentes estabelecido.

---

## Fase 3: Engajamento & Comunidade (Sprints 8 a 10)
*Objetivo:* Aumentar agressivamente a retenção, criar senso de pertencimento e reduzir churn através do efeito de rede.

### Sprint 8: O Hub de Comunidade
- Desenvolvimento do Feed Interno estilo rede social corporativa.
- Criação de perfis públicos de alunos (com privacidade configurável).
- Fóruns atrelados a aulas específicas para tirar dúvidas em contexto.

### Sprint 9: Níveis & Gamificação
- Sistema de pontuação: Pontos por completar aulas, comentar em fóruns, etc.
- Badges/Conquistas.
- Ranking corporativo (Opcional por tenant) ou Global da plataforma.

### Sprint 10: IA Avançada & Escalabilidade Global
- Análise de Sentimento nos comentários e fóruns (alertas para o administrador sobre alunos desengajados ou frustrados).
- Correção inteligente de estudos de caso via IA (reduzindo custo operacional de professores).
- Preparação i18n final (Multimoeda, Múltiplos idiomas nas interfaces).
- Testes de carga extrema usando ferramentas como k6.

**-> MARCO:** Ecossistema finalizado, pronto para expansão internacional pesada.
