-- ============================================================
-- LIDERA TREINAMENTOS - Gestor-Aluno Relationships
-- Execute in Supabase SQL Editor
-- ============================================================

-- Gestor-Aluno Relationships
CREATE TABLE IF NOT EXISTS public.gestor_aluno_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gestor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aluno_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  relationship_type TEXT NOT NULL DEFAULT 'direct_manager' CHECK (relationship_type IN ('direct_manager', 'hr', 'director')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (gestor_user_id, aluno_user_id)
);

CREATE INDEX idx_gestor_aluno_gestor ON public.gestor_aluno_relationships(gestor_user_id);
CREATE INDEX idx_gestor_aluno_aluno ON public.gestor_aluno_relationships(aluno_user_id);

ALTER TABLE public.gestor_aluno_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access relationships" ON public.gestor_aluno_relationships
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Gestores manage own relationships" ON public.gestor_aluno_relationships
  FOR ALL USING (gestor_user_id = auth.uid());

CREATE POLICY "Alunos view own relationships" ON public.gestor_aluno_relationships
  FOR SELECT USING (aluno_user_id = auth.uid());
