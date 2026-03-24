-- ============================================================
-- LIDERA TREINAMENTOS - Training Participants
-- Execute in Supabase SQL Editor
-- ============================================================

-- Training Participants
CREATE TABLE IF NOT EXISTS public.presential_training_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES public.presential_trainings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  gestor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  participant_name TEXT NOT NULL,
  participant_email TEXT,
  company_name TEXT,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'attended', 'no_show')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_participants_training ON public.presential_training_participants(training_id);
CREATE INDEX idx_participants_user ON public.presential_training_participants(user_id);
CREATE INDEX idx_participants_gestor ON public.presential_training_participants(gestor_id);

ALTER TABLE public.presential_training_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access participants" ON public.presential_training_participants
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Gestores view their participants" ON public.presential_training_participants
  FOR SELECT USING (gestor_id = auth.uid());

CREATE POLICY "Users view own participation" ON public.presential_training_participants
  FOR SELECT USING (user_id = auth.uid());
