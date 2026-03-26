'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  TrendingUp,
  Users,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pessoas', label: 'Pessoas', icon: Users },
  { href: '/admin/avaliacoes', label: 'Avaliacoes', icon: ClipboardCheck },
  { href: '/admin/treinamentos', label: 'Treinamentos', icon: GraduationCap },
  { href: '/admin/conteudo', label: 'Programa', icon: BookOpen },
  { href: '/admin/comercial', label: 'Comercial', icon: TrendingUp },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active =
          href === '/admin'
            ? pathname === '/admin'
            : pathname === href || pathname.startsWith(`${href}/`)

        return (
          <Link
            key={href}
            href={href}
            className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
              active
                ? 'bg-[#0E1E35] text-white before:absolute before:left-0 before:top-1/2 before:h-5 before:-translate-y-1/2 before:w-[3px] before:rounded-r before:bg-[#1565C0]'
                : 'text-[#8FA8C5] hover:bg-white/5 hover:text-[#C4D8EF]'
            }`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
