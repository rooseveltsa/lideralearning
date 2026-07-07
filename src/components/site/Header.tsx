'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/treinamento/modulo-1', label: 'Treinamento' },
  { href: '/cursos', label: 'Academy' },
  { href: '/empresas', label: 'Para empresas' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
]

const darkHeroRoutes = ['/', '/empresas', '/cursos', '/treinamento', '/pricing']

export default function SiteHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hasDarkHero = useMemo(
    () => darkHeroRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`)),
    [pathname]
  )
  const isDark = hasDarkHero

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        borderBottom: `1px solid ${isDark ? 'rgba(245,241,234,0.10)' : 'rgba(12,23,41,0.10)'}`,
        backdropFilter: 'blur(14px)',
        background: isDark ? 'rgba(7,14,28,0.78)' : 'rgba(245,241,234,0.85)',
      }}
    >
      <div className="ld-mw-xl flex items-center justify-between" style={{ height: 76 }}>
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-12">
          <Link href="/" className="inline-flex items-center gap-2.5">
            {/* Lidera Logo Mark — 3 setas ascendentes */}
            <svg width={28} height={28} viewBox="0 0 64 64" fill="none" aria-hidden>
              <path d="M10 50 L22 18 L26 30 L18 50 Z" fill="#ec6411" />
              <path d="M22 50 L34 14 L38 26 L30 50 Z" fill="#0f8f3a" />
              <path d="M34 50 L46 18 L54 30 L42 50 Z" fill="#1855bd" />
            </svg>
            <span
              className="font-sans text-xl font-bold tracking-tight"
              style={{ color: isDark ? '#f5f1ea' : '#070e1c', letterSpacing: '-0.02em' }}
            >
              Lidera
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-opacity hover:opacity-100"
                style={{
                  color: isDark ? '#f5f1ea' : '#070e1c',
                  opacity: pathname === link.href ? 1 : 0.78,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/auth/login"
            className="rounded-[10px] px-4 py-2 text-sm font-medium transition-colors"
            style={{
              color: isDark ? '#f5f1ea' : '#070e1c',
              opacity: 0.78,
            }}
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="ld-btn-primary"
            style={{ padding: '0.5rem 1.05rem', fontSize: '0.875rem', height: 'auto' }}
          >
            Comece agora
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 md:hidden"
          style={{ color: isDark ? '#f5f1ea' : '#070e1c' }}
          aria-label="Menu"
          onClick={() => setIsMobileOpen((v) => !v)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div
          className="space-y-2 border-t px-6 py-4 md:hidden"
          style={{ borderColor: isDark ? 'rgba(245,241,234,0.10)' : 'rgba(12,23,41,0.10)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium"
              style={{ color: isDark ? '#f5f1ea' : '#070e1c' }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: isDark ? 'rgba(245,241,234,0.10)' : 'rgba(12,23,41,0.10)' }}>
            <Link
              href="/auth/login"
              onClick={() => setIsMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium"
              style={{ color: isDark ? 'rgba(245,241,234,0.78)' : '#070e1c' }}
            >
              Entrar
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setIsMobileOpen(false)}
              className="ld-btn-primary block text-center"
              style={{ borderRadius: '0.5rem' }}
            >
              Comece agora
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
