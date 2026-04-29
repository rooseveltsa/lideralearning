import { Flame, Star, TrendingUp, Zap } from 'lucide-react'

type Props = {
  totalXp: number
  level: number
  currentStreak: number
  longestStreak: number
  weeklyXp?: number
}

function xpForLevel(level: number) {
  return Math.pow(level - 1, 2) * 100
}

function xpForNextLevel(level: number) {
  return Math.pow(level, 2) * 100
}

export default function XPCard({ totalXp, level, currentStreak, longestStreak, weeklyXp = 0 }: Props) {
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForNextLevel(level)
  const progressInLevel = totalXp - currentLevelXp
  const xpNeeded = nextLevelXp - currentLevelXp
  const progressPercent = xpNeeded > 0 ? Math.min((progressInLevel / xpNeeded) * 100, 100) : 100

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      {/* Level + XP Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-500">
            <span className="font-heading text-2xl font-extrabold text-white">{level}</span>
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-black">
              <Star className="h-3 w-3" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">Nível {level}</p>
            <p className="text-lg font-extrabold text-white">
              {totalXp.toLocaleString('pt-BR')} XP
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <Flame className={`h-5 w-5 ${currentStreak >= 3 ? 'text-amber-400' : 'text-white/20'}`} />
            <span className={`text-2xl font-extrabold ${currentStreak >= 3 ? 'text-amber-400' : 'text-white/40'}`}>
              {currentStreak}
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">
            {currentStreak === 1 ? 'dia' : 'dias'} seguidos
          </p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] font-bold text-white/40">
          <span>Nível {level}</span>
          <span>Nível {level + 1}</span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-500 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-white/40">
          {progressInLevel.toLocaleString('pt-BR')} / {xpNeeded.toLocaleString('pt-BR')} XP para o próximo nível
        </p>
      </div>

      {/* Stats Row */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-center">
          <Zap className="mx-auto h-4 w-4 text-yellow-400" />
          <p className="mt-1 text-sm font-extrabold text-white">{weeklyXp}</p>
          <p className="text-[10px] text-white/40">XP esta semana</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-center">
          <Flame className="mx-auto h-4 w-4 text-amber-400" />
          <p className="mt-1 text-sm font-extrabold text-white">{currentStreak}</p>
          <p className="text-[10px] text-white/40">Streak atual</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-center">
          <TrendingUp className="mx-auto h-4 w-4 text-emerald-400" />
          <p className="mt-1 text-sm font-extrabold text-white">{longestStreak}</p>
          <p className="text-[10px] text-white/40">Maior streak</p>
        </div>
      </div>
    </div>
  )
}
