import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'
import XPCard from '@/components/gamification/XPCard'
import AchievementGrid from '@/components/gamification/AchievementGrid'
import Leaderboard from '@/components/gamification/Leaderboard'

export default async function ConquistasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = createAdminClient()

  // Fetch user XP data
  const { data: userXp } = await admin
    .from('user_xp')
    .select('total_xp, level, current_streak, longest_streak, weekly_xp')
    .eq('user_id', user.id)
    .maybeSingle()

  const tableMissing = !userXp

  // Fetch all achievements and user's earned ones
  const [{ data: achievements }, { data: earnedRaw }] = await Promise.all([
    admin.from('achievements').select('*').order('sort_order'),
    admin.from('user_achievements').select('achievement_id, earned_at').eq('user_id', user.id),
  ])

  // Fetch leaderboard (top 20)
  const { data: leaderboardRaw } = await admin
    .from('user_xp')
    .select('user_id, total_xp, level, current_streak')
    .order('total_xp', { ascending: false })
    .limit(20)

  // Get names for leaderboard
  const leaderboardIds = (leaderboardRaw || []).map((e: { user_id: string }) => e.user_id)
  const { data: profiles } = leaderboardIds.length > 0
    ? await admin.from('profiles').select('id, full_name').in('id', leaderboardIds)
    : { data: [] }

  const profileMap = new Map(
    (profiles || []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name])
  )

  const leaderboard = (leaderboardRaw || []).map((entry: { user_id: string; total_xp: number; level: number; current_streak: number }) => ({
    ...entry,
    full_name: profileMap.get(entry.user_id) || null,
  }))

  const xp = userXp as { total_xp: number; level: number; current_streak: number; longest_streak: number; weekly_xp: number } | null
  const earned = (earnedRaw || []) as { achievement_id: string; earned_at: string }[]
  const allAchievements = (achievements || []) as {
    id: string; slug: string; title: string; description: string;
    icon: string; category: string; xp_reward: number; requirement_value: number
  }[]

  return (
    <div className="min-h-screen bg-[#1F1F1F] px-6 py-8 text-white/70">
      <div className="mx-auto max-w-[1280px]">

        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white">Conquistas & Progresso</h1>
          <p className="mt-1 text-sm text-white/40">
            Acompanhe seu XP, streak e conquistas desbloqueadas
          </p>
        </div>

        {tableMissing && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
            <p className="text-sm font-bold text-amber-200">Sistema de gamificação em implantação.</p>
            <p className="mt-1 text-xs text-amber-300/70">
              Execute <code className="rounded bg-amber-500/20 px-1.5 py-0.5">docs/database/19_gamification.sql</code> no Supabase para ativar.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Main Column */}
          <div className="space-y-6">
            {/* XP Card */}
            <XPCard
              totalXp={xp?.total_xp || 0}
              level={xp?.level || 1}
              currentStreak={xp?.current_streak || 0}
              longestStreak={xp?.longest_streak || 0}
              weeklyXp={xp?.weekly_xp || 0}
            />

            {/* Achievements */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-white">Conquistas</h2>
                <p className="text-xs font-bold text-white/40">
                  {earned.length}/{allAchievements.length} desbloqueadas
                </p>
              </div>
              <AchievementGrid achievements={allAchievements} earned={earned} />
            </div>
          </div>

          {/* Sidebar: Leaderboard */}
          <div>
            <Leaderboard entries={leaderboard} currentUserId={user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
