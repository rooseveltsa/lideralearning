import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, GraduationCap, Trophy, LogOut } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch quick stats
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)

    const courseCount = enrollments?.length || 0

    return (
        <div className="flex-1 w-full space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
            {/* Welcome Banner - Midnight Blue */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0B0F19] border border-[#1E293B] p-8 md:p-12 shadow-xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1E88E5]/10 rounded-full blur-[100px] opacity-70 mix-blend-screen pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight mb-3">
                            Bem-vindo de volta, Líder
                        </h1>
                        <p className="text-[#94A3B8] text-lg max-w-xl font-light">
                            Sua jornada de desenvolvimento executivo continua. Você possui <span className="text-white font-bold">{courseCount}</span> programas de treinamento ativos.
                        </p>
                    </div>
                    <Link href="/dashboard/cursos">
                        <Button size="lg" className="w-full md:w-auto h-14 px-8 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-bold text-base rounded-xl shadow-lg shadow-[#1E88E5]/20 gap-2 transition-all duration-300 border-none">
                            Continuar Aprendendo <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#1E88E5]/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#1E88E5] group-hover:bg-[#1E88E5]/10 group-hover:border-[#1E88E5]/20 transition-colors">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <h3 className="font-heading border-none font-extrabold text-[#111827] text-xl tracking-tight">Cursos</h3>
                    </div>
                    <p className="text-[#64748B] mb-6 font-medium">Acesse todos os seus materiais e aulas em andamento.</p>
                    <Link href="/dashboard/cursos" className="inline-flex items-center gap-2 text-sm font-bold text-[#1E88E5] hover:text-[#1565C0] transition-colors">
                        Ver Biblioteca <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm transition-all duration-300 opacity-70">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#64748B]">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <h3 className="font-heading font-extrabold text-[#111827] text-xl tracking-tight">Certificados</h3>
                    </div>
                    <p className="text-[#64748B] mb-6 font-medium">Visualize e baixe os certificados dos cursos concluídos.</p>
                    <span className="inline-flex items-center text-xs font-bold text-[#94A3B8] bg-[#F8FAFC] px-3 py-1.5 rounded-md border border-[#E5E7EB] uppercase tracking-wider">
                        Em breve
                    </span>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm transition-all duration-300 opacity-70">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#64748B]">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <h3 className="font-heading font-extrabold text-[#111827] text-xl tracking-tight">Comunidade</h3>
                    </div>
                    <p className="text-[#64748B] mb-6 font-medium">Conecte-se com outros líderes e troque experiências.</p>
                    <span className="inline-flex items-center text-xs font-bold text-[#94A3B8] bg-[#F8FAFC] px-3 py-1.5 rounded-md border border-[#E5E7EB] uppercase tracking-wider">
                        Em breve
                    </span>
                </div>
            </div>

            <div className="pt-8 flex justify-end">
                <form action={logout}>
                    <Button variant="ghost" type="submit" className="text-[#64748B] hover:text-red-500 hover:bg-red-50 font-semibold flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sair da Plataforma
                    </Button>
                </form>
            </div>
        </div>
    )
}
