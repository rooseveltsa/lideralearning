-- ═══════════════════════════════════════════════════════════════════
-- PDI Classification: Supervisor Link + PDI Type
-- Links executive assessments to supervisor users for corporate PDI
-- ═══════════════════════════════════════════════════════════════════

-- Add supervisor_user_id to link executive assessment to the supervisor being evaluated
ALTER TABLE public.leadership_executive_assessments
ADD COLUMN IF NOT EXISTS supervisor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add pdi_type column to track individual vs corporate
ALTER TABLE public.leadership_executive_assessments
ADD COLUMN IF NOT EXISTS pdi_type TEXT DEFAULT 'corporate' CHECK (pdi_type IN ('individual', 'corporate'));

CREATE INDEX IF NOT EXISTS idx_exec_assess_supervisor_user ON public.leadership_executive_assessments(supervisor_user_id);

-- Policy: admins can update exec assessments (to link supervisor)
CREATE POLICY "Admins can update exec assessments" ON public.leadership_executive_assessments
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
