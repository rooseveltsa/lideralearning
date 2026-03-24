-- ============================================================
-- LIDERA TREINAMENTOS - Mentoring Sessions
-- Execute in Supabase SQL Editor
-- ============================================================

-- Mentoring Sessions
CREATE TABLE IF NOT EXISTS public.mentoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  training_id UUID REFERENCES public.presential_trainings(id) ON DELETE SET NULL,
  mentor_name TEXT DEFAULT 'Claudemir Domingos',
  session_type TEXT NOT NULL CHECK (session_type IN ('30_days', '60_days', 'extra')),
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  kpis_discussed TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mentoring_aluno ON public.mentoring_sessions(aluno_user_id);
CREATE INDEX idx_mentoring_training ON public.mentoring_sessions(training_id);
CREATE INDEX idx_mentoring_status ON public.mentoring_sessions(status);
CREATE INDEX idx_mentoring_scheduled ON public.mentoring_sessions(scheduled_date DESC);

ALTER TABLE public.mentoring_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access mentoring" ON public.mentoring_sessions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Alunos view own mentoring" ON public.mentoring_sessions
  FOR SELECT USING (aluno_user_id = auth.uid());

CREATE POLICY "Gestores view linked aluno mentoring" ON public.mentoring_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.gestor_aluno_relationships
      WHERE gestor_user_id = auth.uid() AND aluno_user_id = mentoring_sessions.aluno_user_id
    )
  );
