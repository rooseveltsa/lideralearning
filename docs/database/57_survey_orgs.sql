-- ════════════════════════════════════════════════════════════════
-- Survey Orgs — empresas/clientes para segmentar os formulários
-- Cada envio carrega ?org=<code>. Respostas guardam org_code para o admin
-- filtrar por empresa. Canais (ouvidoria/CIPA/SESMT/RH) por empresa para o
-- instrumento psicossocial mostrar os contatos certos.
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.survey_orgs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE,                 -- slug usado na URL (?org=acme)
  nome        text NOT NULL,
  canais      jsonb NOT NULL DEFAULT '{}'::jsonb,   -- { ouvidoria, cipa, sesmt, rh } (texto livre)
  ativo       boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT survey_orgs_code_format CHECK (code ~ '^[a-z0-9][a-z0-9-]{1,40}$')
);

COMMENT ON TABLE public.survey_orgs IS
  'Empresas/clientes para segmentar os formulários anônimos por org_code (URL ?org=). canais = contatos de encaminhamento por empresa (psicossocial).';

-- Coluna org_code nas tabelas de resposta (nullable p/ retrocompatibilidade).
ALTER TABLE public.climate_survey_responses      ADD COLUMN IF NOT EXISTS org_code text;
ALTER TABLE public.psychosocial_survey_responses ADD COLUMN IF NOT EXISTS org_code text;
ALTER TABLE public.preventive_culture_responses  ADD COLUMN IF NOT EXISTS org_code text;
ALTER TABLE public.training_needs_assessments    ADD COLUMN IF NOT EXISTS org_code text;

CREATE INDEX IF NOT EXISTS idx_climate_org      ON public.climate_survey_responses (org_code, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_psychosocial_org ON public.psychosocial_survey_responses (org_code, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_culture_org      ON public.preventive_culture_responses (org_code, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_org     ON public.training_needs_assessments (org_code, created_at DESC);

-- RLS: admin gerencia as empresas. Leitura pública é feita via service role (server).
ALTER TABLE public.survey_orgs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_all_survey_orgs"
  ON public.survey_orgs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
