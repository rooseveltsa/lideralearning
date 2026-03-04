'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type LucideIcon } from 'lucide-react'

export type AdminNavLink = {
  href: string
  label: string
  icon: LucideIcon
}

export default function AdminSidebarNav({ links }: { links: AdminNavLink[] }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 px-4">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
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
    </nav>
  )
}
