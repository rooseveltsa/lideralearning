import Link from 'next/link'
import { redirect } from 'next/navigation'
import { type ReactNode } from 'react'
import { BookOpen, BriefcaseBusiness, ExternalLink, GraduationCap, LayoutDashboard, LogOut, Palette, Users } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import AdminSidebarNav from '@/components/admin/AdminSidebarNav'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  const navLinks = [
    { href: '/admin', label: 'Visão geral', icon: LayoutDashboard },
    { href: '/admin/cursos', label: 'Formações', icon: BookOpen },
    { href: '/admin/alunos', label: 'Alunos', icon: Users },
    { href: '/admin/leads', label: 'Pipeline B2B', icon: BriefcaseBusiness },
  ]

  return (
    <div className="grid min-h-screen w-full bg-[#EEF3F9] md:grid-cols-[292px_1fr]">
      <aside className="hidden border-r border-[#1A263D] bg-[#060D1A] md:flex md:flex-col">
        <div className="flex h-[86px] items-center border-b border-[#1A263D] px-6">
          <Link href="/admin" className="inline-flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#274364] bg-[#0A1528] text-[#8CC1F7]">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>
              <p className="font-heading text-xl font-extrabold tracking-tight text-white">Lidera Admin</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6E86A4]">Operação da plataforma</p>
            </span>
          </Link>
        </div>

        <div className="py-6">
          <p className="px-8 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6E86A4]">Módulos administrativos</p>
          <div className="mt-3">
            <AdminSidebarNav links={navLinks} />
          </div>
        </div>

        <div className="mt-auto space-y-4 border-t border-[#1A263D] p-4">
          <div className="rounded-xl border border-[#1C2D46] bg-[#0A1426] px-4 py-3">
            <p className="truncate text-sm font-bold text-white">{profile.full_name || 'Administrador'}</p>
            <p className="truncate text-xs text-[#8FA8C5]">{user.email}</p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#274364] bg-[#0A1528] text-sm font-bold text-[#C4D8EF] transition-colors hover:bg-[#10203A] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Portal do aluno
          </Link>

          <Link
            href="/style-guide"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-semibold uppercase tracking-[0.12em] text-[#7E95B1] transition-colors hover:bg-white/5 hover:text-[#C4D8EF]"
          >
            <Palette className="h-3.5 w-3.5" />
            Style Guide
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-[#9FB2CB] transition-all hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Encerrar sessão
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 flex h-[74px] items-center justify-between border-b border-[#D8E2EF] bg-white px-4 shadow-sm md:hidden">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <span className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">Lidera Admin</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/style-guide" className="rounded-lg p-2 text-[#475569] transition-colors hover:bg-slate-100 hover:text-[#0F172A]">
              <Palette className="h-5 w-5" />
              <span className="sr-only">Style guide</span>
            </Link>
            <form action={logout}>
              <button type="submit" className="rounded-lg p-2 text-[#475569] transition-colors hover:bg-red-50 hover:text-red-500">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-[radial-gradient(circle_at_8%_0%,rgba(30,136,229,0.08),transparent_36%)] p-4 lg:p-8">
            <div className="mx-auto w-full max-w-[1320px]">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
