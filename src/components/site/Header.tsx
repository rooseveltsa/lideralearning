'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowUpRight, Flame } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Streak, XPBadge } from '@/components/premium/course/CourseProgressBar'

const navLinks = [
  { href: '/cursos', label: 'Cursos' },
  { href: '/empresas', label: 'Para Empresas' },
  { href: '/pricing', label: 'Planos' },
  { href: '/comunidade', label: 'Comunidade' },
]

const darkHeroRoutes = ['/', '/empresas', '/cursos', '/treinamento']

export default function SiteHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoggedIn] = useState(false) // TODO: replace with real auth state

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hasDarkHero = useMemo(() => darkHeroRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`)), [pathname])
  const isSolid = isScrolled || isMobileOpen
  const isDarkContext = hasDarkHero && !isSolid

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 max-w-[1280px] px-4 sm:px-6">
        <div
          className={`rounded-2xl border px-4 shadow-[0_14px_34px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-300 sm:px-6 ${
            isDarkContext
              ? 'border-white/10 bg-[#0A0F1E]/80 text-white'
              : 'border-[#E9EDF5] bg-white/90 text-[#0F172A]'
          }`}
        >
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="font-heading text-[1.65rem] tracking-tight">Lidera</span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60 transition-transform duration-500 group-hover:scale-[2] group-hover:opacity-0" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      active
                        ? isDarkContext
                          ? 'bg-white/10 text-white'
                          : 'bg-indigo-50 text-indigo-700'
                        : isDarkContext
                          ? 'text-white/60 hover:bg-white/10 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              {isLoggedIn ? (
                <>
                  <Streak days={7} />
                  <XPBadge xp={2450} tier="Ouro" size="sm" />
                  <Link
                    href="/dashboard"
                    className="ml-2 inline-flex items-center gap-1 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-400"
                  >
                    <Flame className="h-3.5 w-3.5" />
                    Meu progresso
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                      isDarkContext ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-1 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-400"
                  >
                    Começar agora
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>

            <button
              className={`rounded-lg p-2 md:hidden ${
                isDarkContext ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Abrir menu"
              onClick={() => setIsMobileOpen((value) => !value)}
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {isMobileOpen ? (
            <div className={`space-y-2 border-t py-4 md:hidden ${isDarkContext ? 'border-white/10' : 'border-slate-200'}`}>
              {navLinks.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block rounded-lg px-4 py-3 text-sm font-semibold ${
                      active
                        ? isDarkContext
                          ? 'bg-white/10 text-white'
                          : 'bg-indigo-50 text-indigo-700'
                        : isDarkContext
                          ? 'text-white/60 hover:bg-white/10 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className={`mt-3 space-y-2 border-t pt-3 ${isDarkContext ? 'border-white/10' : 'border-slate-200'}`}>
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileOpen(false)}
                    className="block rounded-lg bg-indigo-500 px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    Meu progresso
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileOpen(false)}
                      className={`block rounded-lg px-4 py-3 text-sm font-semibold ${
                        isDarkContext ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMobileOpen(false)}
                      className="block rounded-lg bg-indigo-500 px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-indigo-400"
                    >
                      Criar conta
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}