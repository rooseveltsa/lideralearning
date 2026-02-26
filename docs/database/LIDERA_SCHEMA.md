# Lidera - Arquitetura de Banco de Dados e Esquema

## 1. Paradigma do Banco de Dados
Dada a forte necessidade de dados relacionais estruturados (hierarquias, cursos, pagamentos) e multi-tenancy seguro (Empresas vs. Indivíduos), o **PostgreSQL** é a escolha definitiva. 
Ao utilizar o **Supabase**, obtemos autenticação nativa, Segurança em Nível de Linha (RLS - Row-Level Security) e Edge Functions prontos para uso.

## 2. Estratégia de Multi-Tenancy (B2B SaaS)
A Lidera opera como uma plataforma B2B2C e B2C direta.
- **Inquilino (Tenant):** Uma empresa (ex: "Acme Corp") comprando 100 licenças.
- **Indivíduo:** Um único aluno comprando um curso diretamente.
- **Abordagem:** Todo usuário pertence a pelo menos um `Tenant` (mesmo que seja um inquilino padrão "Individual") ou usamos uma coluna `company_id` nos usuários/assinaturas. Uma política rigorosa de Segurança em Nível de Linha (RLS) garante que os gerentes da Acme Corp SÓ possam ver os dados dos funcionários da Acme Corp.

## 3. Visão Geral do Esquema de Alto Nível

### 3.1. Identidade Principal e Inquilinos
- `tenants` (id, nome, dominio, criado_em, tipo_plano)
- `users` (id [referência a auth.users], email, nome_completo, url_avatar, criado_em)
- `tenant_users` (tenant_id, user_id, cargo [admin, gestor_rh, aluno, mentor])

### 3.2. Módulo LMS (Núcleo Educacional)
- `courses` (id, tenant_id [nulo se global/marketplace], titulo, descricao, preco, esta_publicado)
- `modules` (id, course_id, titulo, ordem_indice)
- `lessons` (id, module_id, titulo, url_video, conteudo_texto, duracao_segundos, ordem_indice)
- `enrollments` (id, user_id, course_id, status [ativo, concluido, expirado], matriculado_em)
- `progress` (id, enrollment_id, lesson_id, esta_concluido, tempo_assistido_segundos, ultimo_acesso_em)
- `certificates` (id, user_id, course_id, data_emissao, hash_unico, url_pdf)

### 3.3. Módulo Corporativo (HRTech)
- `hr_evaluations` (id, avaliador_id, avaliado_id, tenant_id, pontuacao_potencial, pontuacao_performance [para 9-Box], nome_periodo)
- `pdi_plans` (id, user_id, tenant_id, titulo, status, data_alvo)
- `pdi_actions` (id, pdi_plan_id, descricao, esta_concluido)

### 3.4. Módulo Comercial (Vendas e Recorrência)
- `products` (id, tipo [curso, lote_licencas, assinatura], stripe_product_id)
- `prices` (id, product_id, valor, moeda, stripe_price_id, esquema_cobranca [pontual, recorrente])
- `subscriptions` (id, user_id, tenant_id, stripe_sub_id, status, fim_periodo_atual)
- `payments` (id, user_id, valor, moeda, status, metodo_pagamento [cartao_credito, pix], id_referencia)

### 3.5. Módulo de Comunidade
- `posts` (id, autor_id, course_id [opcional], conteudo, criado_em)
- `comments` (id, post_id, autor_id, conteudo, criado_em)
- `likes` (user_id, post_id_ou_comment_id)
- `gamification_points` (id, user_id, tipo_acao [aula_concluida, like_post], pontos_concedidos)

### 3.6. IA e Analytics
- `ai_interactions` (id, user_id, prompt, resposta, tipo_contexto [analise_sentimento, qna_curso], criado_em)
- `embeddings` (id, lesson_id, pedaco_conteudo, vetor [pgvector])

## 4. Exemplos de Segurança em Nível de Linha (RLS)

Para garantir o isolamento de dados no Supabase, aplicamos RLS em tabelas como `tenant_users` e `progress`.

```sql
-- Exemplo: Um usuário só pode ver seu próprio progresso, ou um Gestor de RH pode ver o progresso dos usuários de seu inquilino (tenant).
CREATE POLICY "Usuarios veem o proprio progresso; RH ve o progresso do tenant" 
ON progress FOR SELECT 
USING (
  enrollment_id IN (
    SELECT id FROM enrollments WHERE user_id = auth.uid()
  ) 
  OR 
  EXISTS (
    SELECT 1 FROM tenant_users tu_viewer
    JOIN tenant_users tu_student ON tu_viewer.tenant_id = tu_student.tenant_id
    JOIN enrollments e ON e.user_id = tu_student.user_id
    WHERE tu_viewer.user_id = auth.uid() 
      AND tu_viewer.role IN ('admin', 'gestor_rh')
      AND e.id = progress.enrollment_id
  )
);
```
