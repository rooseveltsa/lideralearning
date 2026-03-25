'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, LogOut, Menu, X } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import AdminSidebarNav from './AdminSidebarNav'

export default function AdminMobileMenu({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-[#475569] transition-colors hover:bg-slate-100"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Slide-in panel */}
          <div className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#060D1A] shadow-2xl">
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-[#1A263D] px-4">
              <span className="text-lg font-extrabold tracking-tight text-white">
                Lidera
                <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-[#1565C0]" />
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-[#8FA8C5] hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto py-4" onClick={() => setOpen(false)}>
              <AdminSidebarNav />
            </div>

            {/* Bottom */}
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
                onClick={() => setOpen(false)}
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
          </div>
        </>
      )}
    </>
  )
}
