-- ════════════════════════════════════════════════════════════════
-- B2B Diagnostics — Avaliação de supervisores feita pela empresa
-- Fase 1 do EPIC de Diagnóstico Profundo
-- Owner: @data-engineer
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.b2b_diagnostics (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id  uuid REFERENCES public.crm_prospects(id) ON DELETE SET NULL,

  -- Identificação da Empresa
  empresa            text NOT NULL,
  unidade_filial     text,
  segmento           text,
  gestor_nome        text NOT NULL,
  gestor_cargo       text,
  gestor_email       text,
  gestor_whatsapp    text,

  -- Identificação do Supervisor Avaliado
  supervisor_nome    text NOT NULL,
  supervisor_cargo   text,
  tempo_na_funcao    text,
  qtd_liderados      int,
  data_avaliacao     date DEFAULT CURRENT_DATE,

  -- Seções de respostas (JSONB para flexibilidade de schema)
  perfil_lideranca_esperado     jsonb NOT NULL DEFAULT '{}'::jsonb,
  perfil_comportamental_desejado jsonb NOT NULL DEFAULT '{}'::jsonb,
  diagnostico_atual              jsonb NOT NULL DEFAULT '{}'::jsonb,
  modulos_lidera                 jsonb NOT NULL DEFAULT '{}'::jsonb,
  expectativas                   jsonb NOT NULL DEFAULT '{}'::jsonb,
  espaco_aberto                  jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Scores calculados (preenchidos pela API após submit)
  disc_scores      jsonb,
  modulo_scores    jsonb,
  fit_score        int,

  -- Audit
  ip_address       text,
  user_agent       text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.b2b_diagnostics IS
  'Diagnósticos B2B: gestor avaliando 1 supervisor específico. 1 form = 1 supervisor.';

CREATE INDEX IF NOT EXISTS idx_b2b_diagnostics_empresa
  ON public.b2b_diagnostics (empresa, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_b2b_diagnostics_prospect
  ON public.b2b_diagnostics (prospect_id);

CREATE INDEX IF NOT EXISTS idx_b2b_diagnostics_gestor_email
  ON public.b2b_diagnostics (gestor_email);

-- RLS
ALTER TABLE public.b2b_diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_all_b2b_diagnostics"
  ON public.b2b_diagnostics
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service role bypasses RLS by default (Supabase built-in)
