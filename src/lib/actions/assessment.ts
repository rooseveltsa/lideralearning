'use server'

/**
 * Estrutura e políticas em:
 * supabase/migrations/20261026182321_restore_training_prerequisites.sql
 * Avaliações são restritas ao aluno e a uma matrícula ativa do mesmo curso.
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
