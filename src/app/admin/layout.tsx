import Link from 'next/link'
import { redirect } from 'next/navigation'
import { type ReactNode } from 'react'
import { ExternalLink, LogOut, Menu, X } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import AdminSidebarNav from '@/components/admin/AdminSidebarNav'
import AdminMobileMenu from '@/components/admin/AdminMobileMenu'

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

  const userName = profile.full_name || 'Administrador'

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFD]">
      {/* Desktop Sidebar — fixed 240px */}
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-[#1A263D] bg-[#060D1A] md:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-[#1A263D] px-5">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tight text-white">
              Lidera
              <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-[#1565C0]" />
            </span>
          </Link>
        </div>

        {/* Nav items */}
        <div className="flex-1 py-4">
          <AdminSidebarNav />
        </div>

        {/* Bottom user section */}
        <div className="space-y-2 border-t border-[#1A263D] p-3">
          <div className="rounded-lg bg-[#0A1426] px-3 py-2.5">
            <p className="truncate text-[13px] font-semibold text-white">{userName}</p>
            <span className="mt-0.5 inline-block rounded bg-[#1565C0]/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#64B5F6]">
              Admin
            </span>
          </div>

          <Link
            href="/dashboard"
            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#1C2D46] text-xs font-medium text-[#8FA8C5] transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Portal do aluno
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-medium text-[#6E86A4] transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#E5ECF6] bg-white px-4 md:hidden">
          <Link href="/admin" className="text-lg font-extrabold tracking-tight text-[#0F172A]">
            Lidera
            <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-[#1565C0]" />
          </Link>
          <AdminMobileMenu userName={userName} />
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
