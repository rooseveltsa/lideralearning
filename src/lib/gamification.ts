import { createAdminClient } from '@/lib/supabase/service'

const XP_VALUES: Record<string, number> = {
  lesson_completed: 25,
  module_completed: 100,
  course_completed: 500,
  assessment_completed: 100,
  streak_bonus: 50,
  certificate_earned: 300,
  referral_converted: 200,
  daily_login: 10,
  first_lesson: 50,
}

export async function awardXP(
  userId: string,
  source: keyof typeof XP_VALUES,
  referenceId?: string
) {
  const admin = createAdminClient()
  const amount = XP_VALUES[source] || 0
  if (amount === 0) return

  // Record transaction
  await admin.from('xp_transactions').insert({
    user_id: userId,
    amount,
    source,
    reference_id: referenceId || null,
  })

  // Upsert user XP
  const { data: existing } = await admin
    .from('user_xp')
    .select('id, total_xp, current_streak, longest_streak, last_activity_date')
    .eq('user_id', userId)
    .maybeSingle()

  const today = new Date().toISOString().split('T')[0]

  if (existing) {
    const lastDate = (existing as { last_activity_date: string | null }).last_activity_date
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]
    const currentStreak = (existing as { current_streak: number }).current_streak
    const longestStreak = (existing as { longest_streak: number }).longest_streak

    let newStreak = currentStreak
    if (lastDate === yesterday) {
      newStreak = currentStreak + 1
    } else if (lastDate !== today) {
      newStreak = 1
    }

    await admin
      .from('user_xp')
      .update({
        total_xp: (existing as { total_xp: number }).total_xp + amount,
        current_streak: newStreak,
        longest_streak: Math.max(longestStreak, newStreak),
        last_activity_date: today,
      })
      .eq('user_id', userId)
  } else {
    await admin.from('user_xp').insert({
      user_id: userId,
      total_xp: amount,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today,
    })
  }
}

export async function checkAndAwardAchievements(userId: string) {
  const admin = createAdminClient()

  const [
    { data: userXp },
    { data: achievements },
    { data: earned },
    { data: progress },
    { data: certs },
  ] = await Promise.all([
    admin.from('user_xp').select('total_xp, current_streak').eq('user_id', userId).maybeSingle(),
    admin.from('achievements').select('*'),
    admin.from('user_achievements').select('achievement_id').eq('user_id', userId),
    admin.from('progress').select('id').eq('user_id', userId).eq('completed', true),
    admin.from('certificates').select('id').eq('user_id', userId),
  ])

  if (!achievements || !userXp) return []

  const earnedIds = new Set((earned || []).map((e: { achievement_id: string }) => e.achievement_id))
  const totalXp = (userXp as { total_xp: number }).total_xp
  const streak = (userXp as { current_streak: number }).current_streak
  const lessonsCount = (progress || []).length
  const certsCount = (certs || []).length

  const newAchievements: string[] = []

  for (const achievement of achievements as { id: string; slug: string; requirement_type: string; requirement_value: number; xp_reward: number }[]) {
    if (earnedIds.has(achievement.id)) continue

    let met = false
    switch (achievement.requirement_type) {
      case 'xp_total': met = totalXp >= achievement.requirement_value; break
      case 'streak_days': met = streak >= achievement.requirement_value; break
      case 'lessons_count': met = lessonsCount >= achievement.requirement_value; break
      case 'certificates_count': met = certsCount >= achievement.requirement_value; break
    }

    if (met) {
      await admin.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievement.id,
      })

      if (achievement.xp_reward > 0) {
        await admin.from('xp_transactions').insert({
          user_id: userId,
          amount: achievement.xp_reward,
          source: 'streak_bonus',
          reference_id: achievement.slug,
        })

        await admin
          .from('user_xp')
          .update({ total_xp: totalXp + achievement.xp_reward })
          .eq('user_id', userId)
      }

      newAchievements.push(achievement.slug)
    }
  }

  return newAchievements
}
