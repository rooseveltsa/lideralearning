-- ═══════════════════════════════════════════════════════════════════
-- Leadership PDI (Plano de Desenvolvimento Individual)
-- Formulario PDI - Dimensoes, Habilidades e Compromissos 12 Semanas
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.leadership_pdi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificacao profissional
  cargo TEXT,
  tempo_funcao TEXT,
  departamento TEXT,

  -- 5 dimensoes de lideranca (escala 1-5)
  dim_facilitador SMALLINT CHECK (dim_facilitador BETWEEN 1 AND 5),
  dim_orientador SMALLINT CHECK (dim_orientador BETWEEN 1 AND 5),
  dim_garantidor SMALLINT CHECK (dim_garantidor BETWEEN 1 AND 5),
  dim_estrategista SMALLINT CHECK (dim_estrategista BETWEEN 1 AND 5),
  dim_mentor SMALLINT CHECK (dim_mentor BETWEEN 1 AND 5),

  -- Hard skills (escala 1-5)
  hs_execucao SMALLINT CHECK (hs_execucao BETWEEN 1 AND 5),
  hs_processos SMALLINT CHECK (hs_processos BETWEEN 1 AND 5),
  hs_ferramentas SMALLINT CHECK (hs_ferramentas BETWEEN 1 AND 5),
  hs_padroes SMALLINT CHECK (hs_padroes BETWEEN 1 AND 5),

  -- Soft skills (escala 1-5)
  ss_inteligencia_emocional SMALLINT CHECK (ss_inteligencia_emocional BETWEEN 1 AND 5),
  ss_feedback SMALLINT CHECK (ss_feedback BETWEEN 1 AND 5),
  ss_conflitos_geracionais SMALLINT CHECK (ss_conflitos_geracionais BETWEEN 1 AND 5),
  ss_visao_futuro SMALLINT CHECK (ss_visao_futuro BETWEEN 1 AND 5),

  -- Plano 12 semanas
  fase_atual SMALLINT CHECK (fase_atual BETWEEN 1 AND 3),
  compromisso_comportamento TEXT,
  compromisso_dados TEXT,
  compromisso_sucessao TEXT,

  -- Competencias 4.0 (array JSON de itens selecionados)
  competencias_40 JSONB DEFAULT '[]',
  texto_triade TEXT,

  -- Resultado calculado
  media_dimensoes NUMERIC(3,1),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices
CREATE INDEX idx_pdi_user_id ON public.leadership_pdi(user_id);
CREATE INDEX idx_pdi_created_at ON public.leadership_pdi(created_at DESC);

-- RLS
ALTER TABLE public.leadership_pdi ENABLE ROW LEVEL SECURITY;

-- Usuario pode ver seus proprios PDIs
CREATE POLICY "Users can view own PDI"
  ON public.leadership_pdi
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuario pode inserir seus proprios PDIs
CREATE POLICY "Users can insert own PDI"
  ON public.leadership_pdi
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins podem ver todos os PDIs
CREATE POLICY "Admins can view all PDIs"
  ON public.leadership_pdi
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
