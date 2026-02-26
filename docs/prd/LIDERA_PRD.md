# Plataforma Educacional Lidera - Product Requirements Document (PRD)

## 1. Visão Geral do Produto
A Lidera é um ecossistema SaaS de educação corporativa e desenvolvimento de liderança com IA integrada. O objetivo é criar uma plataforma robusta (LMS + Marketplace + Comunidade) focada em treinamentos presenciais e digitais, gerando receita recorrente através de um modelo SaaS B2B e B2C.

## 2. Objetivos Estratégicos
- **Escalabilidade:** Estrutura preparada para expansão internacional.
- **Monetização:** Venda de cursos digitais, assinaturas recorrentes e licenças corporativas.
- **Gestão:** Administração centralizada de imersões presenciais, programas corporativos e comunidades.
- **Engajamento:** Hub de alunos com dashboard empresarial e comunidade nativa.
- **Inteligência Artificial:** IA aplicada ao desenvolvimento humano (análise de sentimento, plano de ação e recomendações).

## 3. Estrutura de Módulos (Escopo)

### 3.1. Módulo LMS (Core Educacional)
- Cadastro dinâmico de cursos e upload de aulas (vídeo, áudio, PDF, texto).
- Trilhas de aprendizado sequenciais e condicionais.
- Certificação automática com validação de autenticidade.
- Área do aluno responsiva com controle detalhado de progresso e gamificação básica.

### 3.2. Módulo Comercial
- Checkout transparente integrado (cartão, Pix, boleto).
- Gestão de parcelamento e assinaturas recorrentes (modelo Netflix/SaaS).
- Lotes dinâmicos para eventos e imersões presenciais (virada de lote automática).
- Licenças corporativas (venda em lote para empresas).
- Relatórios financeiros e de conversão avançados.

### 3.3. Módulo Corporativo (B2B SaaS)
- Cadastro multi-tenant por empresa (cada empresa vê apenas seus dados).
- Gestão hierárquica de colaboradores e líderes.
- Matriz 9-Box para avaliação de desempenho.
- PDI (Plano de Desenvolvimento Individual) digital e rastreável.
- Dashboard de performance e engajamento para RH.
- Relatórios executivos automatizados.

### 3.4. Módulo Comunidade
- Feed interno estilo rede social.
- Fóruns de discussão específicos por curso/turma.
- Grupos exclusivos para mentorias ou níveis de acesso.
- Sistema de engajamento avançado (pontuação, badges, ranking).

### 3.5. Camada de Inteligência Artificial
- Assistente virtual de liderança (chatbot treinado no método Lidera).
- Análise de sentimento nas interações da comunidade e feedbacks.
- Geração automatizada de planos de ação baseados em assessments.
- Recomendação hiper-personalizada de conteúdos (Netflix-style).
- Correção inteligente de avaliações discursivas e estudos de caso.

## 4. Requisitos Técnicos
- **Arquitetura:** Multi-tenant SaaS, API-first, Cloud-native (AWS/GCP/Supabase).
- **Controle de Acesso:** RBAC (Role-Based Access Control) granular (Admin, Gestor RH, Aluno, Mentor).
- **Banco de Dados:** Escalável, otimizado para métricas de performance humana e logs de auditoria pesados.
- **Internacionalização:** Preparado estruturalmente para i18n (múltiplos idiomas e moedas) desde o Day 1.

## 5. Fases de Lançamento (Roadmap de Alto Nível)

- **Fase 1: Core Educacional** (Foco em Receita Rápida)
  - LMS Completo (Cursos, Aulas, Progresso, Certificados).
  - Módulo Comercial (Checkout, Assinaturas, Lotes).
  
- **Fase 2: Corporativo + IA** (Foco em Escala B2B)
  - Módulo Corporativo (Empresas, 9-Box, PDI, Dashboards RH).
  - Camada de IA Básica (Recomendações e Assistente de Liderança).

- **Fase 3: Comunidade + Camada Premium** (Foco em Retenção e Recorrência)
  - Módulo Comunidade (Feed, Fóruns, Grupos).
  - Camada de IA Avançada (Análise de sentimento, correção inteligente).
