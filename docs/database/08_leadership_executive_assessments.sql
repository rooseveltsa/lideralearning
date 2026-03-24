-- ═══════════════════════════════════════════════════════════════════
-- Leadership Executive Assessment (Avaliacao Executiva da Empresa)
-- Formulario 1.3.1 - Avaliacao do Supervisor pela Empresa
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.leadership_executive_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificacao da empresa
  nome_empresa TEXT,
  segmento TEXT,
  porte TEXT,
  cidade_estado TEXT,
  nome_avaliador TEXT,
  cargo_avaliador TEXT,

  -- Identificacao do supervisor avaliado
  nome_supervisor TEXT NOT NULL,
  cargo_supervisor TEXT,
  tempo_supervisao TEXT,

  -- 10 dimensoes de avaliacao (escala 1-5)
  dim_comunicacao SMALLINT CHECK (dim_comunicacao BETWEEN 1 AND 5),
  dim_tomada_decisao SMALLINT CHECK (dim_tomada_decisao BETWEEN 1 AND 5),
  dim_gestao_equipe SMALLINT CHECK (dim_gestao_equipe BETWEEN 1 AND 5),
  dim_orientacao_resultados SMALLINT CHECK (dim_orientacao_resultados BETWEEN 1 AND 5),
  dim_adaptabilidade SMALLINT CHECK (dim_adaptabilidade BETWEEN 1 AND 5),
  dim_lideranca_estrategica SMALLINT CHECK (dim_lideranca_estrategica BETWEEN 1 AND 5),
  dim_desenvolvimento_pessoas SMALLINT CHECK (dim_desenvolvimento_pessoas BETWEEN 1 AND 5),
  dim_inovacao SMALLINT CHECK (dim_inovacao BETWEEN 1 AND 5),
  dim_etica_integridade SMALLINT CHECK (dim_etica_integridade BETWEEN 1 AND 5),
  dim_gestao_crise SMALLINT CHECK (dim_gestao_crise BETWEEN 1 AND 5),

  -- Respostas abertas
  ponto_forte TEXT,
  area_melhoria TEXT,
  impacto_equipe TEXT,
  recomendacao TEXT,
  comentario_adicional TEXT,

  -- Recomendacao geral e nivel de confianca
  recomendacao_geral TEXT,
  nivel_confianca SMALLINT CHECK (nivel_confianca BETWEEN 1 AND 5),

  -- Resultado calculado
  media_dimensoes NUMERIC(3,1),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices
CREATE INDEX idx_exec_assess_user_id ON public.leadership_executive_assessments(user_id);
CREATE INDEX idx_exec_assess_supervisor ON public.leadership_executive_assessments(nome_supervisor);
CREATE INDEX idx_exec_assess_created_at ON public.leadership_executive_assessments(created_at DESC);

-- RLS
ALTER TABLE public.leadership_executive_assessments ENABLE ROW LEVEL SECURITY;

-- Usuario pode ver suas proprias avaliacoes
CREATE POLICY "Users can view own executive assessments"
  ON public.leadership_executive_assessments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuario pode inserir suas proprias avaliacoes
CREATE POLICY "Users can insert own executive assessments"
  ON public.leadership_executive_assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins podem ver todas as avaliacoes
CREATE POLICY "Admins can view all executive assessments"
  ON public.leadership_executive_assessments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
