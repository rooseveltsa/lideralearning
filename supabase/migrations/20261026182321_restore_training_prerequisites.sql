-- Lidera: restore missing prerequisites used by the deployed application.
-- Additive migration; does not recreate existing LMS tables or change records.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

CREATE TABLE IF NOT EXISTS public.initial_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL UNIQUE REFERENCES public.enrollments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  responses jsonb NOT NULL CHECK (jsonb_typeof(responses) = 'object'),
  completed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.initial_assessments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.initial_assessments FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.initial_assessments TO authenticated;
GRANT ALL ON public.initial_assessments TO service_role;

CREATE POLICY "Students read their enrolled assessment"
ON public.initial_assessments FOR SELECT TO authenticated
USING (
  user_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.id = initial_assessments.enrollment_id
      AND e.user_id = (SELECT auth.uid())
      AND e.course_id = initial_assessments.course_id
      AND e.status = 'active'
  )
);

CREATE POLICY "Students submit their enrolled assessment"
ON public.initial_assessments FOR INSERT TO authenticated
WITH CHECK (
  user_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.id = initial_assessments.enrollment_id
      AND e.user_id = (SELECT auth.uid())
      AND e.course_id = initial_assessments.course_id
      AND e.status = 'active'
  )
);

CREATE POLICY "Students update their enrolled assessment"
ON public.initial_assessments FOR UPDATE TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (
  user_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.id = initial_assessments.enrollment_id
      AND e.user_id = (SELECT auth.uid())
      AND e.course_id = initial_assessments.course_id
      AND e.status = 'active'
  )
);

-- Existing 58_pdi_checkout.sql requirements, missing in this database.
-- These structural changes do not enable the PDI paywall or charge customers.
ALTER TABLE public.personal_diagnostics
  ADD COLUMN IF NOT EXISTS pdi_paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS pdi_order_id uuid;

COMMENT ON COLUMN public.personal_diagnostics.pdi_paid_at IS
  'When a paid PDI was released following confirmed payment.';

ALTER TABLE public.order_items
  DROP CONSTRAINT order_items_product_type_check,
  ADD CONSTRAINT order_items_product_type_check
    CHECK (product_type IN ('course', 'pdi'));

ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;
NOTIFY pgrst, 'reload schema';
COMMIT;
