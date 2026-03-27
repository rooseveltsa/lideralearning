import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'
import { sendEmail } from '@/lib/email/send'

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // Find enrollments where user hasn't accessed in 7+ days and progress < 100%
  const { data: staleEnrollments, error } = await admin
    .from('enrollments')
    .select('user_id, course_id, courses(title), profiles(full_name, email:id)')
    .eq('status', 'active')
    .lt('updated_at', sevenDaysAgo)

  if (error || !staleEnrollments) {
    return NextResponse.json({ error: error?.message || 'Query failed' }, { status: 500 })
  }

  let sent = 0
  for (const enrollment of staleEnrollments) {
    const profile = enrollment.profiles as unknown as { full_name: string | null; email: string } | null
    const course = enrollment.courses as unknown as { title: string } | null

    if (!profile) continue

    // Get user email from auth
    const { data: authUser } = await admin.auth.admin.getUserById(enrollment.user_id)
    const email = authUser?.user?.email
    if (!email) continue

    const { data: progress } = await admin
      .from('progress')
      .select('id')
      .eq('user_id', enrollment.user_id)
      .eq('course_id', enrollment.course_id)

    const progressCount = progress?.length || 0

    await sendEmail(email, 'reengagement', {
      name: profile.full_name || 'Participante',
      lastAccessDays: 7,
      courseName: course?.title || 'seu treinamento',
      progressPercent: progressCount > 0 ? Math.min(progressCount * 10, 95) : 0,
    })
    sent++
  }

  return NextResponse.json({ success: true, emailsSent: sent })
}
