-- ════════════════════════════════════════════════════════════════
-- Training Needs Assessment — Diagnóstico de Necessidade de Formação
-- de Supervisores (DNFS-LIDERA). IDENTIFICADO (não anônimo) + LGPD.
-- Instrumento Lidera (central de formulários do portal do gestor).
-- ════════════════════════════════════════════════════════════════
-- IMPORTANTE: instrumento IDENTIFICADO. Coleta dados pessoais (nome, e-mail/
-- matrícula, empresa) mediante consentimento LGPD obrigatório (Lei 13.709/2018).
-- Inserção via service role (API). Leitura: admin (tudo) e o próprio usuário
-- logado (os seus). O Top 3 de módulos alimenta o motor de PDI de treinamento.

CREATE TABLE IF NOT EXISTS public.training_needs_assessments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Vínculo opcional ao usuário logado (null quando respondido sem login).
  user_id           uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Identificação do supervisor (instrumento identificado)
  nome              text NOT NULL,
  email             text NOT NULL,
  empresa           text,
  setor             text,
  tempo_funcao      text,
  qtd_liderados     text,

  -- Respostas cruas: itemId -> { competencia: 1..5|null, prioridade: 1..5|null }
  respostas         jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Scoring calculado no servidor (snapshot): por módulo Cm, Pm, Gap, IN,
  -- IN_norm, etiqueta de filtro, ranking e flags de coerência.
  gaps              jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Top 3 módulos LIDERA recomendados (id, titulo, inNorm). Alimenta o PDI.
  top_modulos       jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Perguntas abertas (qualitativo p/ o motor de PDI)
  abertas           jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Consentimento LGPD (obrigatório: a API só insere com true)
  consentimento     boolean NOT NULL DEFAULT false,

  -- Audit mínimo
  user_agent        text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.training_needs_assessments IS
  'Diagnóstico de Necessidade de Formação de Supervisores (DNFS-LIDERA). IDENTIFICADO + LGPD. Top 3 módulos alimenta o motor de PDI de treinamento.';

CREATE INDEX IF NOT EXISTS idx_training_needs_user
  ON public.training_needs_assessments (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_training_needs_email
  ON public.training_needs_assessments (email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_training_needs_created
  ON public.training_needs_assessments (created_at DESC);

-- RLS
ALTER TABLE public.training_needs_assessments ENABLE ROW LEVEL SECURITY;

-- Admins leem/gerenciam tudo (agregação no portal).
CREATE POLICY "admins_all_training_needs"
  ON public.training_needs_assessments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- O usuário logado vê os SEUS próprios diagnósticos (quando user_id casa).
CREATE POLICY "users_select_own_training_needs"
  ON public.training_needs_assessments
  FOR SELECT
  USING (user_id = auth.uid());

-- Inserção é feita pela API com service role (bypassa RLS). Não criamos policy
-- de INSERT para anon/usuário, para o formulário não escrever direto na tabela.
