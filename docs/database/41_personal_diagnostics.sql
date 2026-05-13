-- ════════════════════════════════════════════════════════════════
-- Personal Diagnostics — Autoavaliação do supervisor/líder
-- Fase 1 do EPIC de Diagnóstico Profundo
-- Owner: @data-engineer
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.personal_diagnostics (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  prospect_id  uuid REFERENCES public.crm_prospects(id) ON DELETE SET NULL,

  -- Identificação do Profissional
  nome_completo    text NOT NULL,
  email            text NOT NULL,
  empresa          text,
  cargo            text,
  setor            text,
  tempo_na_funcao  text,
  qtd_liderados    int,
  idade            int,
  cidade_uf        text,
  data_avaliacao   date DEFAULT CURRENT_DATE,

  -- Seções de respostas (JSONB)
  autoavaliacao_comportamental    jsonb NOT NULL DEFAULT '{}'::jsonb,
  perfil_comportamental_pessoal   jsonb NOT NULL DEFAULT '{}'::jsonb,
  modulos_lidera                  jsonb NOT NULL DEFAULT '{}'::jsonb,
  reflexao_profissional           jsonb NOT NULL DEFAULT '{}'::jsonb,
  radar_desenvolvimento           jsonb NOT NULL DEFAULT '{}'::jsonb,
  pdi                             jsonb NOT NULL DEFAULT '{}'::jsonb,
  alinhamento_final               jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Scores calculados
  disc_scores      jsonb,
  modulo_scores    jsonb,
  radar_average    numeric(4,2),

  -- Cross-reference com Form Empresa (se preenchido)
  linked_b2b_diagnostic_id uuid REFERENCES public.b2b_diagnostics(id) ON DELETE SET NULL,

  -- Audit
  ip_address       text,
  user_agent       text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.personal_diagnostics IS
  'Diagnósticos pessoais: supervisor/líder fazendo autoavaliação. Pode ser cruzado com b2b_diagnostics.';

CREATE INDEX IF NOT EXISTS idx_personal_diagnostics_email
  ON public.personal_diagnostics (email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_personal_diagnostics_empresa
  ON public.personal_diagnostics (empresa, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_personal_diagnostics_user
  ON public.personal_diagnostics (user_id);

-- RLS
ALTER TABLE public.personal_diagnostics ENABLE ROW LEVEL SECURITY;

-- Admins veem tudo
CREATE POLICY "admins_all_personal_diagnostics"
  ON public.personal_diagnostics
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Usuários logados veem apenas seus próprios diagnósticos
CREATE POLICY "users_own_personal_diagnostics"
  ON public.personal_diagnostics
  FOR SELECT
  USING (user_id = auth.uid());
