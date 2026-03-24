'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, LayoutDashboard, Settings, Shield, User, UsersRound } from 'lucide-react'

const navGroups = [
  {
    label: 'Workspace',
    links: [
      { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
      { href: '/dashboard/cursos', label: 'Meus programas', icon: BookOpen },
    ],
  },
  {
    label: 'Conta',
    links: [
      { href: '/dashboard/perfil', label: 'Meu perfil', icon: User },
      { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
]

type SidebarNavProps = {
  isAdmin?: boolean
  role?: string
}

export default function SidebarNav({ isAdmin = false, role }: SidebarNavProps) {
  const pathname = usePathname()

  const allNavGroups = [...navGroups]

  if (role === 'hr_manager') {
    allNavGroups.push({
      label: 'Gestão',
      links: [
        { href: '/dashboard/equipe', label: 'Minha Equipe', icon: UsersRound },
      ],
    })
  }

  if (isAdmin) {
    allNavGroups.push({
      label: 'Administração',
      links: [
        { href: '/admin', label: 'Painel Admin', icon: Shield },
      ],
    })
  }

  return (
    <nav className="space-y-6 px-4">
      {allNavGroups.map((group) => (
        <div key={group.label}>
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6D85A4]">{group.label}</p>
          <div className="mt-2 space-y-1.5">
            {group.links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? 'border border-[#2A4E7F] bg-[#10213A] text-white shadow-[0_10px_20px_rgba(30,136,229,0.18)]'
                      : 'text-[#9FB2CB] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${active ? 'text-[#9FCBFB]' : 'text-[#7F97B4] group-hover:text-white'}`} />
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}
