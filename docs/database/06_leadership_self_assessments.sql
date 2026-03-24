-- ═══════════════════════════════════════════════════════════════════
-- Leadership Self-Assessment (Autoavaliação Líder/Supervisor)
-- Formulário 1.4.1 - Múltipla Escolha com Diagnóstico
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.leadership_self_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Questões de múltipla escolha (pontuação 1-3)
  q_percepcao SMALLINT CHECK (q_percepcao IN (1, 2, 3)),      -- Q2: Percepção da Função
  q_gestao SMALLINT CHECK (q_gestao IN (1, 2, 3)),            -- Q3: Gestão de Equipes
  q_comunicacao SMALLINT CHECK (q_comunicacao IN (1, 2, 3)),   -- Q4: Comunicação e Postura
  q_tecnologia SMALLINT CHECK (q_tecnologia IN (1, 2, 3)),    -- Q5: Tecnologia e KPIs
  q_etica SMALLINT CHECK (q_etica IN (1, 3)),                 -- Q6: Alicerce Ético (só 1 ou 3)
  q_dor SMALLINT CHECK (q_dor IN (1, 2, 3)),                  -- Q7: Dor Atual e Expectativa

  -- Campos de texto aberto (Q7)
  texto_dor_atual TEXT,
  texto_custo_futuro TEXT,

  -- Resultado calculado
  pontuacao_total SMALLINT NOT NULL CHECK (pontuacao_total >= 0 AND pontuacao_total <= 21),
  perfil TEXT NOT NULL CHECK (perfil IN ('reativo', 'transicao', 'lider_valor')),
  -- reativo: 7-10 pts | transicao: 11-15 pts | lider_valor: 16-21 pts

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices
CREATE INDEX idx_lsa_user_id ON public.leadership_self_assessments(user_id);
CREATE INDEX idx_lsa_perfil ON public.leadership_self_assessments(perfil);
CREATE INDEX idx_lsa_created_at ON public.leadership_self_assessments(created_at DESC);

-- RLS
ALTER TABLE public.leadership_self_assessments ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver suas próprias avaliações
CREATE POLICY "Users can view own assessments"
  ON public.leadership_self_assessments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuário pode inserir suas próprias avaliações
CREATE POLICY "Users can insert own assessments"
  ON public.leadership_self_assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins podem ver todas as avaliações
CREATE POLICY "Admins can view all assessments"
  ON public.leadership_self_assessments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
