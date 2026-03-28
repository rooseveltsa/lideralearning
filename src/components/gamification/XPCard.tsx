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
    <div className="rounded-2xl border border-[#22314B] bg-[#0A1324] p-6">
      {/* Level + XP Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1565C0] to-[#0B4A8F]">
            <span className="font-heading text-2xl font-extrabold text-white">{level}</span>
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F57C00] text-[10px] font-bold text-white">
              <Star className="h-3 w-3" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7FA0C2]">Nível {level}</p>
            <p className="text-lg font-extrabold text-white">
              {totalXp.toLocaleString('pt-BR')} XP
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <Flame className={`h-5 w-5 ${currentStreak >= 3 ? 'text-[#F57C00]' : 'text-[#4A6B8A]'}`} />
            <span className={`text-2xl font-extrabold ${currentStreak >= 3 ? 'text-[#F57C00]' : 'text-[#64748B]'}`}>
              {currentStreak}
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#7FA0C2]">
            {currentStreak === 1 ? 'dia' : 'dias'} seguidos
          </p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#7FA0C2]">
          <span>Nível {level}</span>
          <span>Nível {level + 1}</span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-[#1A2E4A]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1565C0] to-[#1E88E5] transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-[#64748B]">
          {progressInLevel.toLocaleString('pt-BR')} / {xpNeeded.toLocaleString('pt-BR')} XP para o próximo nível
        </p>
      </div>

      {/* Stats Row */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[#1A2E4A] bg-[#0D1B30] px-3 py-3 text-center">
          <Zap className="mx-auto h-4 w-4 text-[#1E88E5]" />
          <p className="mt-1 text-sm font-extrabold text-white">{weeklyXp}</p>
          <p className="text-[10px] text-[#64748B]">XP esta semana</p>
        </div>
        <div className="rounded-xl border border-[#1A2E4A] bg-[#0D1B30] px-3 py-3 text-center">
          <Flame className="mx-auto h-4 w-4 text-[#F57C00]" />
          <p className="mt-1 text-sm font-extrabold text-white">{currentStreak}</p>
          <p className="text-[10px] text-[#64748B]">Streak atual</p>
        </div>
        <div className="rounded-xl border border-[#1A2E4A] bg-[#0D1B30] px-3 py-3 text-center">
          <TrendingUp className="mx-auto h-4 w-4 text-green-400" />
          <p className="mt-1 text-sm font-extrabold text-white">{longestStreak}</p>
          <p className="text-[10px] text-[#64748B]">Maior streak</p>
        </div>
      </div>
    </div>
  )
}
