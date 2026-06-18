-- ════════════════════════════════════════════════════════════════
-- Psychosocial Survey — Indicadores Psicossociais (NR-1 / ISO 45003)
-- ANÔNIMA, com recorte por SETOR e TURNO.
-- Instrumento Lidera (central de formulários do portal do gestor).
-- ════════════════════════════════════════════════════════════════
-- IMPORTANTE: respostas anônimas. NÃO há user_id nem qualquer identificador
-- pessoal. Os únicos recortes são setor e turno. As perguntas de saúde,
-- assédio, violência e discriminação são DADO PESSOAL SENSÍVEL (LGPD,
-- Lei 13.709/2018) — tratadas de forma agregada e sigilosa.
-- Inserção via service role (API); leitura apenas para admin via RLS.

CREATE TABLE IF NOT EXISTS public.psychosocial_survey_responses (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Recorte de risco (sem identificar a pessoa)
  setor             text NOT NULL,
  setor_outro       text,
  turno             text NOT NULL,

  -- Parte 1 — respostas cruas (itemId -> 1..5 ou null para "Não sei/Não se aplica")
  respostas         jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Níveis de risco por dimensão calculados no servidor (snapshot; maior = pior)
  dimension_scores  jsonb NOT NULL DEFAULT '[]'::jsonb,
  overall_risk      int,                       -- 0..100 (null = sem base); MAIOR = MAIS RISCO

  -- Parte 2 — itens críticos (janela 12 meses): { itemId: { value, relato? } }.
  -- Relato livre OPCIONAL é dado sensível, lido só por saúde/segurança sob sigilo.
  criticos          jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Perguntas abertas (anônimas)
  abertas           jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Audit mínimo (sem PII)
  user_agent        text,
  created_at        timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT psychosocial_overall_range
    CHECK (overall_risk IS NULL OR (overall_risk BETWEEN 0 AND 100))
);

COMMENT ON TABLE public.psychosocial_survey_responses IS
  'Indicadores psicossociais (NR-1/ISO 45003) ANÔNIMOS. Sem user_id por design. Recorte por setor e turno; resultados de célula setor×turno com < 5 respostas devem ser agregados na leitura (privacidade). NOTA ALTA = MAIS RISCO. Dado sensível (LGPD): uso restrito a gestão de risco psicossocial (GRO/PGR); nunca para avaliação, punição ou desligamento.';

COMMENT ON COLUMN public.psychosocial_survey_responses.criticos IS
  'Parte 2 (janela 12 meses). { itemId: { value:1..5|null, relato?:text } }. Qualquer value >= 2 (Raramente) dispara alerta. Relato livre lido só por profissional de saúde/segurança sob sigilo.';

CREATE INDEX IF NOT EXISTS idx_psychosocial_survey_celula
  ON public.psychosocial_survey_responses (setor, turno, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_psychosocial_survey_created
  ON public.psychosocial_survey_responses (created_at DESC);

-- RLS
ALTER TABLE public.psychosocial_survey_responses ENABLE ROW LEVEL SECURITY;

-- Admins leem tudo (agregação no portal). Não há policy de SELECT para anon.
CREATE POLICY "admins_all_psychosocial_survey"
  ON public.psychosocial_survey_responses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Inserção é feita pela API com service role (bypassa RLS). Não criamos policy
-- de INSERT para anon, para o formulário público não escrever direto na tabela.
