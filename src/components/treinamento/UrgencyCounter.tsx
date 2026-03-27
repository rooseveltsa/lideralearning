'use client'

type Props = {
  vagasRestantes?: number
}

export default function UrgencyCounter({ vagasRestantes = 3 }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F57C00] opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#F57C00]" />
      </span>
      <p className="text-base font-bold text-white">
        Restam apenas{' '}
        <span className="text-[#F57C00]">{vagasRestantes} vagas</span> nesta turma
      </p>
    </div>
  )
}
