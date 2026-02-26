import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { type ReactNode } from 'react'
import Link from 'next/link'
import {
    LayoutDashboard,
    BookOpen,
    Users,
    LogOut,
    GraduationCap,
    ExternalLink
} from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    // Verificar se o usuário é admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/dashboard')
    }

    const navLinks = [
        { href: '/admin', label: 'Visão Geral', icon: LayoutDashboard },
        { href: '/admin/cursos', label: 'Formações', icon: BookOpen },
        { href: '/admin/alunos', label: 'Gestão de Alunos', icon: Users },
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-[#0B0F19] border-r border-[#1E293B] flex flex-col fixed h-full z-20 shadow-2xl">
                {/* Logo */}
                <div className="p-8 border-b border-white/5">
                    <Link href="/admin" className="flex items-center gap-4">
                        <div className="p-2.5 bg-[#1E88E5]/10 rounded-xl border border-[#1E88E5]/20">
                            <GraduationCap className="h-6 w-6 text-[#1E88E5]" />
                        </div>
                        <div>
                            <p className="font-heading font-extrabold text-white text-lg tracking-tight leading-none mb-1">
                                Lidera <span className="text-[#1E88E5]">Admin</span>
                            </p>
                            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Painel de Controle</p>
                        </div>
                    </Link>
                </div>

                {/* Navegação */}
                <nav className="flex-1 p-6 space-y-2">
                    <p className="text-xs font-bold text-[#475569] uppercase tracking-widest mb-4 px-2">Menu Principal</p>
                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E88E5]/10 hover:border-[#1E88E5] border border-transparent transition-all duration-300 text-sm font-bold group"
                        >
                            <Icon className="h-5 w-5 group-hover:text-[#1E88E5] transition-colors" />
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Footer do Sidebar */}
                <div className="p-6 border-t border-white/5 bg-[#0B0F19]/50 mt-auto">
                    <div className="px-2 pb-6">
                        <p className="text-sm font-bold text-white truncate mb-0.5">{profile.full_name}</p>
                        <p className="text-xs text-[#64748B] truncate font-medium">{user.email}</p>
                    </div>

                    <div className="space-y-3">
                        <Link href="/dashboard" className="block">
                            <Button variant="outline" className="w-full h-11 bg-transparent border-[#1E293B] text-[#94A3B8] hover:text-white hover:bg-white/5 hover:border-white/10 font-bold transition-all gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Portal do Aluno
                            </Button>
                        </Link>

                        <form action={logout}>
                            <Button variant="ghost" type="submit" className="w-full h-11 text-[#64748B] hover:text-red-400 hover:bg-red-400/10 font-bold gap-2 transition-colors">
                                <LogOut className="h-4 w-4" />
                                Encerrar Sessão
                            </Button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Conteúdo principal */}
            <main className="flex-1 ml-72 p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
