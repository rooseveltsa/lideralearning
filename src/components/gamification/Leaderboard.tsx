import { Crown, Flame, Medal, TrendingUp } from 'lucide-react'

type LeaderboardEntry = {
  user_id: string
  full_name: string | null
  total_xp: number
  level: number
  current_streak: number
}

type Props = {
  entries: LeaderboardEntry[]
  currentUserId?: string
}

const podiumColors = [
  { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-300', icon: Crown },
  { bg: 'bg-gray-400/10', border: 'border-gray-400/30', text: 'text-gray-300', icon: Medal },
  { bg: 'bg-orange-700/10', border: 'border-orange-700/30', text: 'text-orange-400', icon: Medal },
]

export default function Leaderboard({ entries, currentUserId }: Props) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-[#22314B] bg-[#0A1324] p-8 text-center">
        <TrendingUp className="mx-auto mb-3 h-10 w-10 text-[#4A6B8A]" />
        <p className="text-sm font-bold text-[#64748B]">Ranking será exibido quando houver atividade.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#22314B] bg-[#0A1324] overflow-hidden">
      <div className="border-b border-[#1A2E4A] px-5 py-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          <h3 className="text-base font-extrabold text-white">Ranking de Líderes</h3>
        </div>
        <p className="mt-1 text-xs text-[#7FA0C2]">Baseado em XP acumulado</p>
      </div>

      <div className="divide-y divide-[#1A2E4A]">
        {entries.map((entry, index) => {
          const isCurrentUser = entry.user_id === currentUserId
          const isTopThree = index < 3
          const podium = podiumColors[index]

          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${
                isCurrentUser ? 'bg-[#1565C0]/10' : 'hover:bg-[#0D1B30]'
              }`}
            >
              {/* Position */}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold ${
                isTopThree && podium
                  ? `${podium.bg} ${podium.border} border ${podium.text}`
                  : 'bg-[#1A2E4A] text-[#64748B]'
              }`}>
                {isTopThree && podium ? (
                  <podium.icon className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Avatar + Name */}
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-bold ${isCurrentUser ? 'text-[#8CC1F7]' : 'text-white'}`}>
                  {entry.full_name || 'Líder Anônimo'}
                  {isCurrentUser && <span className="ml-2 text-[10px] text-[#1E88E5]">(você)</span>}
                </p>
                <p className="text-[10px] text-[#64748B]">Nível {entry.level}</p>
              </div>

              {/* Streak */}
              {entry.current_streak >= 3 && (
                <div className="flex items-center gap-1 text-[#F57C00]">
                  <Flame className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">{entry.current_streak}</span>
                </div>
              )}

              {/* XP */}
              <div className="text-right">
                <p className="text-sm font-extrabold text-white">
                  {entry.total_xp.toLocaleString('pt-BR')}
                </p>
                <p className="text-[10px] text-[#64748B]">XP</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
