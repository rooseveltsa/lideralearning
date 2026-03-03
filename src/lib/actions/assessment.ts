'use server'

/**
 * ─── MIGRATION NECESSÁRIA ────────────────────────────────────────────────────
 * Execute no Supabase SQL Editor antes de usar:
 *
 * CREATE TABLE initial_assessments (
 *   id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   enrollment_id uuid NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
 *   user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   course_id     uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
 *   responses     jsonb NOT NULL,
 *   completed_at  timestamptz DEFAULT now(),
 *   UNIQUE(enrollment_id)
 * );
 *
 * ALTER TABLE initial_assessments ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users can manage own assessments"
 *   ON initial_assessments
 *   USING (auth.uid() = user_id)
 *   WITH CHECK (auth.uid() = user_id);
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type AssessmentResponses = {
  rotina: number
  comunicacao: number
  feedback: number
  cobranca: number
  conflitos: number
  delegacao: number
  autogestao: number
}

export async function getInitialAssessment(enrollmentId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('initial_assessments')
    .select('id, responses, completed_at')
    .eq('enrollment_id', enrollmentId)
    .eq('user_id', user.id)
    .maybeSingle()

  return data ?? null
}

export async function saveInitialAssessment(
  enrollmentId: string,
  courseId: string,
  responses: AssessmentResponses
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autenticado' }

  const { error } = await supabase
    .from('initial_assessments')
    .upsert(
      { enrollment_id: enrollmentId, user_id: user.id, course_id: courseId, responses },
      { onConflict: 'enrollment_id' }
    )

  if (error) {
    console.error('Error saving assessment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/dashboard/cursos/${courseId}`)
  return { success: true }
}
