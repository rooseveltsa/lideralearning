'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/cursos', label: 'Academy' },
  { href: '/empresas', label: 'Corporativo' },
  { href: '/sobre', label: 'Manifesto' },
  { href: '/contato', label: 'Diagnóstico' },
]

const darkHeroRoutes = ['/', '/empresas', '/cursos']

export default function SiteHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hasDarkHero = useMemo(() => darkHeroRoutes.includes(pathname), [pathname])
  const isSolid = isScrolled || isMobileOpen
  const isDarkContext = hasDarkHero && !isSolid

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 max-w-[1280px] px-4 sm:px-6">
        <div
          className={`rounded-2xl border px-4 shadow-[0_14px_34px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-300 sm:px-6 ${
            isDarkContext
              ? 'border-white/15 bg-[#060A13]/70 text-white'
              : 'border-[#D9E3F0] bg-white/90 text-[#0F172A]'
          }`}
        >
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="font-heading text-2xl font-extrabold tracking-tight">Lidera</span>
              <span className="h-2 w-2 rounded-full bg-[#1E88E5] transition-transform duration-300 group-hover:scale-125" />
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
                          : 'bg-[#E9F2FC] text-[#0B4A8F]'
                        : isDarkContext
                          ? 'text-[#B6C8E1] hover:bg-white/10 hover:text-white'
                          : 'text-[#475569] hover:bg-[#EFF4FB] hover:text-[#0F172A]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/auth/login"
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  isDarkContext ? 'text-[#C6D6EA] hover:text-white' : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Entrar
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-1 rounded-xl bg-[#1E88E5] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#1E88E5]/25 transition-all hover:bg-[#1565C0]"
              >
                Começar agora
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <button
              className={`rounded-lg p-2 md:hidden ${
                isDarkContext ? 'text-white hover:bg-white/10' : 'text-[#0F172A] hover:bg-[#EFF4FB]'
              }`}
              aria-label="Abrir menu"
              onClick={() => setIsMobileOpen((value) => !value)}
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {isMobileOpen ? (
            <div className={`space-y-2 border-t py-4 md:hidden ${isDarkContext ? 'border-white/15' : 'border-[#E3ECF7]'}`}>
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
                          : 'bg-[#E9F2FC] text-[#0B4A8F]'
                        : isDarkContext
                          ? 'text-[#B6C8E1] hover:bg-white/10 hover:text-white'
                          : 'text-[#475569] hover:bg-[#EFF4FB] hover:text-[#0F172A]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className={`mt-3 space-y-2 border-t pt-3 ${isDarkContext ? 'border-white/15' : 'border-[#E3ECF7]'}`}>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-sm font-semibold ${
                    isDarkContext ? 'text-[#C6D6EA] hover:bg-white/10 hover:text-white' : 'text-[#475569] hover:bg-[#EFF4FB] hover:text-[#0F172A]'
                  }`}
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileOpen(false)}
                  className="block rounded-lg bg-[#1E88E5] px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
                >
                  Criar conta
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
