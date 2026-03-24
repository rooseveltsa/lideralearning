-- ============================================================
-- PENDING MIGRATIONS - Execute in Supabase SQL Editor
-- Last updated: 2026-03-24
-- ============================================================

-- 1. Migration 14: Add supervisor_user_id to exec assessments
ALTER TABLE public.leadership_executive_assessments
ADD COLUMN IF NOT EXISTS supervisor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.leadership_executive_assessments
ADD COLUMN IF NOT EXISTS pdi_type TEXT DEFAULT 'corporate';

CREATE INDEX IF NOT EXISTS idx_exec_assess_supervisor
ON public.leadership_executive_assessments(supervisor_user_id);

-- Admin update policy for linking supervisor
DO $$ BEGIN
  CREATE POLICY "Admins can update exec assessments"
  ON public.leadership_executive_assessments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Verify leadership_diagnostics exists (created earlier, just confirming)
CREATE TABLE IF NOT EXISTS public.leadership_diagnostics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT,
  role TEXT,
  time_in_role TEXT,
  department TEXT,
  reflection_vision TEXT,
  reflection_decisions TEXT,
  reflection_autonomy TEXT,
  dim_facilitator SMALLINT CHECK (dim_facilitator BETWEEN 1 AND 5),
  dim_advisor SMALLINT CHECK (dim_advisor BETWEEN 1 AND 5),
  dim_guarantor SMALLINT CHECK (dim_guarantor BETWEEN 1 AND 5),
  dim_strategist SMALLINT CHECK (dim_strategist BETWEEN 1 AND 5),
  dim_mentor SMALLINT CHECK (dim_mentor BETWEEN 1 AND 5),
  maturity_structured_data BOOLEAN DEFAULT false,
  maturity_ai_prompts BOOLEAN DEFAULT false,
  maturity_root_cause BOOLEAN DEFAULT false,
  maturity_anonymization BOOLEAN DEFAULT false,
  maturity_success_patterns BOOLEAN DEFAULT false,
  maturity_so_what TEXT,
  eia_event TEXT,
  eia_impact TEXT,
  eia_action TEXT,
  team_quadrant JSONB DEFAULT '[]',
  commitment_behavior TEXT,
  commitment_data TEXT,
  commitment_succession TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Disable email confirmation (run in Supabase Auth settings, not SQL)
-- Go to: Authentication > Providers > Email > Disable "Confirm email"
-- This prevents the "for security, you can only request this after 19 seconds" error

-- ============================================================
-- VERIFICATION: Run this to check all tables exist
-- ============================================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'leadership_self_assessments',
  'leadership_executive_assessments',
  'leadership_pdi',
  'leadership_diagnostics',
  'presential_trainings',
  'presential_training_participants',
  'gestor_aluno_relationships',
  'mentoring_sessions'
)
ORDER BY table_name;

-- Check supervisor_user_id column exists
SELECT column_name FROM information_schema.columns
WHERE table_name = 'leadership_executive_assessments'
AND column_name = 'supervisor_user_id';
