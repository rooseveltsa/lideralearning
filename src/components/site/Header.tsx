'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navLinks = [
    { href: '/cursos', label: 'Formações' },
    { href: '/sobre', label: 'Manifesto' },
    { href: '/empresas', label: 'Para Empresas' },
    { href: '/contato', label: 'Diagnóstico' },
]

export default function SiteHeader() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const pathname = usePathname()

    // Determinando se a página atual tem o hero escuro no topo (Apenas Empresas)
    const hasDarkHero = pathname === '/empresas'

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const isSolid = isScrolled || isMobileOpen

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolid
            ? 'bg-white/90 backdrop-blur-xl border-b border-[#E5E7EB]'
            : 'bg-transparent'
            }`}>
            <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-1.5 group select-none">
                    <span className={`font-heading font-extrabold text-2xl tracking-tight transition-colors ${(isSolid || !hasDarkHero) ? 'text-[#111827]' : 'text-white'
                        }`}>
                        Lidera
                    </span>
                    <span className="font-extrabold text-2xl text-[#1565C0]">.</span>
                </Link>

                {/* Nav Desktop */}
                <nav className="hidden md:flex items-center gap-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${(isSolid || !hasDarkHero)
                                ? 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
                                : 'text-[#94A3B8] hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* CTAs Desktop */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/auth/login"
                        className={`text-sm font-semibold px-4 py-2 transition-colors ${(isSolid || !hasDarkHero) ? 'text-[#64748B] hover:text-[#111827]' : 'text-[#94A3B8] hover:text-white'
                            }`}
                    >
                        Login
                    </Link>
                    <Link
                        href="/auth/register"
                        className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${(isSolid || !hasDarkHero)
                            ? 'bg-[#111827] text-white hover:bg-[#1565C0] shadow-md shadow-[#111827]/10'
                            : 'bg-[#1E88E5] text-white hover:bg-[#1565C0] shadow-md shadow-[#1E88E5]/20'
                            }`}
                    >
                        Criar Conta
                    </Link>
                </div>

                {/* Botão Mobile */}
                <button
                    className={`md:hidden p-2 rounded-lg transition-colors ${(isSolid || !hasDarkHero) ? 'text-[#111827]' : 'text-white'
                        }`}
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Menu"
                >
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Menu Mobile */}
            {isMobileOpen && (
                <div className="md:hidden bg-white border-t border-[#E5E7EB] px-6 py-6 space-y-2 shadow-2xl">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="block px-4 py-3 text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-xl text-base font-bold transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-6 mt-4 border-t border-[#E5E7EB] flex flex-col gap-3">
                        <Link href="/auth/login" className="flex items-center justify-center px-4 py-3 text-[#111827] border border-[#E5E7EB] rounded-xl text-base font-bold hover:bg-[#F8FAFC] transition-colors">
                            Acessar Dashboard
                        </Link>
                        <Link href="/auth/register" className="flex items-center justify-center px-4 py-3 bg-[#111827] text-white rounded-xl text-base font-bold hover:bg-[#1565C0] transition-colors">
                            Começar Agora
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
