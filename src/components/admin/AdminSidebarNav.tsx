'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Calendar,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  Link2,
  MessageSquare,
  Target,
  UserPlus,
  Users,
} from 'lucide-react'

type NavGroup = {
  label: string
  items: { href: string; label: string; icon: typeof LayoutDashboard }[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Operação',
    items: [
      { href: '/admin', label: 'Visão geral', icon: LayoutDashboard },
      { href: '/admin/inscritos', label: 'Inscritos', icon: UserPlus },
      { href: '/admin/alunos', label: 'Alunos', icon: Users },
      { href: '/admin/gestores', label: 'Gestores', icon: Briefcase },
      { href: '/admin/relatorios', label: 'Relatorios PDI', icon: FileBarChart },
      { href: '/admin/classificacao', label: 'Classificacao', icon: Link2 },
    ],
  },
  {
    label: 'Presencial',
    items: [
      { href: '/admin/turmas', label: 'Turmas', icon: Calendar },
      { href: '/admin/mentorias', label: 'Mentorias', icon: MessageSquare },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      { href: '/admin/cursos', label: 'Formações', icon: BookOpen },
      { href: '/admin/conteudo', label: 'Programa', icon: GraduationCap },
      { href: '/admin/formularios', label: 'Formulários', icon: ClipboardList },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { href: '/admin/leads', label: 'Pipeline B2B', icon: BriefcaseBusiness },
      { href: '/admin/crm', label: 'CRM Vendas', icon: Target },
    ],
  },
]

export default function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-6 px-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A9E]">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map(({ href, label, icon: Icon }) => {
              const active =
                href === '/admin'
                  ? pathname === '/admin'
                  : pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? 'border border-[#275082] bg-[#0E1E35] text-white shadow-[0_8px_18px_rgba(30,136,229,0.18)]'
                      : 'text-[#9FB2CB] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
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
