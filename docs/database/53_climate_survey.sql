-- ════════════════════════════════════════════════════════════════
-- Climate Survey — Pesquisa de Clima Organizacional (ANÔNIMA + setor)
-- Instrumento Lidera (piloto da central de formulários do portal do gestor)
-- ════════════════════════════════════════════════════════════════
-- IMPORTANTE: respostas anônimas. NÃO há user_id nem qualquer identificador
-- pessoal. O único recorte é por setor. Inserção via service role (API);
-- leitura apenas para admin via RLS.

CREATE TABLE IF NOT EXISTS public.climate_survey_responses (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Recorte (sem identificar a pessoa)
  setor             text NOT NULL,
  setor_outro       text,

  -- Respostas cruas (itemId -> 1..5 ou null para "Não sei/Não se aplica")
  respostas         jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Scores calculados no servidor (snapshot no momento da resposta)
  dimension_scores  jsonb NOT NULL DEFAULT '[]'::jsonb,
  overall_score     int,                       -- 0..100 (null = sem base)
  enps_nota         int,                        -- 0..10 (nota crua p/ eNPS); null se não respondeu

  -- Perguntas abertas (anônimas)
  abertas           jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Audit mínimo (sem PII)
  user_agent        text,
  created_at        timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT climate_overall_range CHECK (overall_score IS NULL OR (overall_score BETWEEN 0 AND 100)),
  CONSTRAINT climate_enps_range CHECK (enps_nota IS NULL OR (enps_nota BETWEEN 0 AND 10))
);

COMMENT ON TABLE public.climate_survey_responses IS
  'Pesquisa de clima ANÔNIMA. Sem user_id por design. Recorte só por setor; resultados de setor com < 5 respostas devem ser agregados na leitura (regra de privacidade).';

CREATE INDEX IF NOT EXISTS idx_climate_survey_setor
  ON public.climate_survey_responses (setor, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_climate_survey_created
  ON public.climate_survey_responses (created_at DESC);

-- RLS
ALTER TABLE public.climate_survey_responses ENABLE ROW LEVEL SECURITY;

-- Admins leem tudo (agregação no portal). Não há policy de SELECT para anon.
CREATE POLICY "admins_all_climate_survey"
  ON public.climate_survey_responses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Inserção é feita pela API com service role (bypassa RLS). Não criamos policy
-- de INSERT para anon, para o formulário público não escrever direto na tabela.
