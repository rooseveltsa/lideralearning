-- ============================================================
-- LIDERA TREINAMENTOS - Presential Trainings (Turmas Presenciais)
-- Execute in Supabase SQL Editor
-- ============================================================

-- Presential Trainings (Turmas Presenciais)
CREATE TABLE IF NOT EXISTS public.presential_trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  training_date_start TIMESTAMPTZ NOT NULL,
  training_date_end TIMESTAMPTZ NOT NULL,
  location TEXT,
  max_participants INT DEFAULT 10,
  mentor_name TEXT DEFAULT 'Claudemir Domingos',
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_trainings_status ON public.presential_trainings(status);
CREATE INDEX idx_trainings_date ON public.presential_trainings(training_date_start DESC);

ALTER TABLE public.presential_trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access trainings" ON public.presential_trainings
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users view trainings" ON public.presential_trainings
  FOR SELECT USING (auth.uid() IS NOT NULL);
