import { BookOpen } from 'lucide-react'
import ConteudoStudio from './ConteudoStudio'

export const metadata = {
  title: 'Centro de Desenvolvimento | Lidera Admin',
}

export default function AdminConteudoPage() {
  return (
    <div className="space-y-0">
      {/* Compact Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#D8E2EF]">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1565C0]/10">
            <BookOpen className="h-5 w-5 text-[#1565C0]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] leading-tight">
              Centro de Desenvolvimento
            </h1>
            <p className="text-xs text-[#64748B]">
              Estude, construa e organize o material dos treinamentos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-[#64748B]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E2EF] bg-white px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1565C0]" />8 modulos
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E2EF] bg-white px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F57C00]" />2 dias
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E2EF] bg-white px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />16h
          </span>
        </div>
      </div>

      <ConteudoStudio />
    </div>
  )
}
