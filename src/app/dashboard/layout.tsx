import { BookOpen, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { logout } from "@/app/auth/actions"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] bg-[#F8FAFC] font-sans selection:bg-[#1565C0]/20">
            {/* Sidebar Desktop - Midnight Blue */}
            <div className="hidden md:flex flex-col border-r border-[#1E293B] bg-[#0B0F19]">
                <div className="flex flex-col h-full max-h-screen">
                    <div className="flex h-[72px] items-center px-6 border-b border-[#1E293B]">
                        <Link href="/dashboard" className="flex items-center gap-1.5 group select-none">
                            <span className="font-heading font-extrabold text-2xl tracking-tight text-white transition-colors group-hover:text-slate-200">
                                Lidera
                            </span>
                            <span className="font-extrabold text-3xl leading-none text-[#1E88E5]">.</span>
                        </Link>
                    </div>

                    <div className="flex-1 py-8 overflow-y-auto">
                        <nav className="grid items-start px-4 text-sm font-semibold gap-2">
                            <Link
                                href="/dashboard/cursos"
                                className="flex items-center gap-3 rounded-xl bg-[#1E88E5]/10 text-[#1E88E5] px-4 py-3 transition-all border border-[#1E88E5]/20"
                            >
                                <BookOpen className="h-[18px] w-[18px]" />
                                Meus Cursos
                            </Link>
                            <Link
                                href="/dashboard/perfil"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#94A3B8] transition-all hover:text-white hover:bg-white/5"
                            >
                                <User className="h-[18px] w-[18px]" />
                                Meu Perfil
                            </Link>
                            <Link
                                href="/dashboard/configuracoes"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#94A3B8] transition-all hover:text-white hover:bg-white/5"
                            >
                                <Settings className="h-[18px] w-[18px]" />
                                Configurações
                            </Link>
                        </nav>
                    </div>

                    <div className="mt-auto p-4 border-t border-[#1E293B]">
                        <form action={logout}>
                            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#94A3B8] transition-all hover:text-red-400 hover:bg-red-500/10">
                                <LogOut className="h-[18px] w-[18px]" />
                                Sair da Conta
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header Mobile */}
                <header className="flex h-[72px] items-center justify-between border-b border-[#E5E7EB] bg-white px-4 lg:px-6 md:hidden shadow-sm">
                    <Link href="/dashboard" className="flex items-center gap-1.5">
                        <span className="font-heading font-extrabold text-2xl tracking-tight text-[#111827]">
                            Lidera
                        </span>
                        <span className="font-extrabold text-3xl leading-none text-[#1E88E5]">.</span>
                    </Link>
                    <form action={logout}>
                        <button type="submit" className="p-2.5 text-[#64748B] hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl">
                            <LogOut className="h-5 w-5" />
                        </button>
                    </form>
                </header>

                <main className="flex-1 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
