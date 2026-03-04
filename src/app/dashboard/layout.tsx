import { BookMarked, LogOut } from 'lucide-react'
import Link from 'next/link'

import SidebarNav from '@/components/dashboard/SidebarNav'
import { logout } from '@/app/auth/actions'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen w-full bg-[#EAF1FA] md:grid-cols-[296px_1fr] lg:grid-cols-[316px_1fr]">
      <aside className="hidden flex-col border-r border-[#1A263D] bg-[#060D1A] md:flex">
        <div className="flex h-[84px] items-center border-b border-[#1A263D] px-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <span className="font-heading text-3xl font-extrabold tracking-tight text-white">Lidera</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#1E88E5]" />
          </Link>
        </div>

        <div className="border-b border-[#1A263D] px-6 py-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6E86A4]">Ambiente do aluno</p>
          <p className="mt-2 text-sm leading-relaxed text-[#AFC1D8]">Stream de treinamentos com progresso por trilha e certificação.</p>
          <Link
            href="/cursos"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#2E4467] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#C7D8EB] transition-colors hover:border-[#4D6F9A] hover:text-white"
          >
            <BookMarked className="h-4 w-4" />
            Explorar catálogo
          </Link>
        </div>

        <div className="py-6">
          <div className="mt-1">
            <SidebarNav />
          </div>
        </div>

        <div className="mt-auto border-t border-[#1A263D] p-4">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#9FB2CB] transition-all hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sair da conta
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-[#D8E2EF] bg-white/95 px-4 shadow-sm backdrop-blur md:hidden">
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <span className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">Lidera</span>
            <span className="h-2 w-2 rounded-full bg-[#1E88E5]" />
          </Link>
          <form action={logout}>
            <button type="submit" className="rounded-lg p-2 text-[#475569] transition-colors hover:bg-red-50 hover:text-red-500">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-[radial-gradient(circle_at_8%_0%,rgba(30,136,229,0.08),transparent_34%)]">{children}</div>
        </main>
      </div>
    </div>
  )
}
