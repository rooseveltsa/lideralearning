import { createClient } from '@/lib/supabase/server'
import { BookOpen, Users, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPage() {
    const supabase = await createClient()

    const [
        { count: totalCourses },
        { count: publishedCourses },
        { count: totalStudents },
        { count: totalEnrollments },
    ] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    ])

    const stats = [
        { label: 'Total de Formações', value: totalCourses ?? 0, icon: BookOpen, color: 'text-[#1E88E5]', bg: 'bg-[#1E88E5]/10' },
        { label: 'Cursos Ativos', value: publishedCourses ?? 0, icon: Eye, color: 'text-[#4CAF35]', bg: 'bg-[#4CAF35]/10' },
        { label: 'Alunos Registrados', value: totalStudents ?? 0, icon: Users, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
        { label: 'Matrículas', value: totalEnrollments ?? 0, icon: TrendingUp, color: 'text-[#F57C00]', bg: 'bg-[#F57C00]/10' },
    ]

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#111827] tracking-tight">Visão Geral</h1>
                <p className="text-[#64748B] mt-2 font-medium text-lg">Acompanhe as métricas de performance da Lidera Treinamentos.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-shadow rounded-2xl p-6 flex flex-col justify-between">
                        <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-6`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-4xl font-heading font-extrabold text-[#111827] mb-1">{stat.value}</p>
                            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-heading font-extrabold text-[#111827] mb-6">Ações Rápidas</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <Link href="/admin/cursos/novo">
                        <button className="h-12 px-6 bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#1E88E5]/20 transition-all">
                            + Nova Formação
                        </button>
                    </Link>
                    <Link href="/admin/cursos">
                        <button className="h-12 px-6 bg-white text-[#64748B] border border-[#E5E7EB] rounded-xl text-sm font-bold hover:bg-[#F8FAFC] hover:text-[#111827] transition-all shadow-sm">
                            Ver Biblioteca
                        </button>
                    </Link>
                    <Link href="/admin/alunos">
                        <button className="h-12 px-6 bg-white text-[#64748B] border border-[#E5E7EB] rounded-xl text-sm font-bold hover:bg-[#F8FAFC] hover:text-[#111827] transition-all shadow-sm">
                            Gerenciar Alunos
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
