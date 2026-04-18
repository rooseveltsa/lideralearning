import { Lock } from 'lucide-react'

type Achievement = {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  category: string
  xp_reward: number
  requirement_value: number
}

type EarnedAchievement = {
  achievement_id: string
  earned_at: string
}

type Props = {
  achievements: Achievement[]
  earned: EarnedAchievement[]
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  learning: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-300' },
  streak: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-300' },
  social: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-300' },
  milestone: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-300' },
  special: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-300' },
}

const categoryLabels: Record<string, string> = {
  learning: 'Aprendizado',
  streak: 'Consistência',
  social: 'Social',
  milestone: 'Marco',
  special: 'Especial',
}

export default function AchievementGrid({ achievements, earned }: Props) {
  const earnedIds = new Set(earned.map((e) => e.achievement_id))
  const earnedMap = new Map(earned.map((e) => [e.achievement_id, e.earned_at]))

  const sorted = [...achievements].sort((a, b) => {
    const aEarned = earnedIds.has(a.id) ? 0 : 1
    const bEarned = earnedIds.has(b.id) ? 0 : 1
    return aEarned - bEarned
  })

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((achievement) => {
        const isEarned = earnedIds.has(achievement.id)
        const earnedAt = earnedMap.get(achievement.id)
        const colors = categoryColors[achievement.category] || categoryColors.learning

        return (
          <div
            key={achievement.id}
            className={`relative rounded-2xl border p-5 transition-all ${
              isEarned
                ? `${colors.border} ${colors.bg}`
                : 'border-white/5 bg-white/[0.02] opacity-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                isEarned ? '' : 'grayscale'
              }`}>
                {isEarned ? achievement.icon : <Lock className="h-5 w-5 text-white/30" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-extrabold ${isEarned ? 'text-white' : 'text-white/40'}`}>
                  {achievement.title}
                </p>
                <p className={`mt-0.5 text-xs leading-relaxed ${isEarned ? 'text-white/60' : 'text-white/30'}`}>
                  {achievement.description}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isEarned ? `${colors.bg} ${colors.text}` : 'bg-white/5 text-white/30'
              }`}>
                {categoryLabels[achievement.category] || achievement.category}
              </span>
              <div className="text-right">
                {achievement.xp_reward > 0 && (
                  <span className={`text-xs font-bold ${isEarned ? 'text-indigo-400' : 'text-white/30'}`}>
                    +{achievement.xp_reward} XP
                  </span>
                )}
                {isEarned && earnedAt && (
                  <p className="text-[10px] text-white/40">
                    {new Date(earnedAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}