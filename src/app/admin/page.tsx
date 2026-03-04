import Link from 'next/link'
import { ArrowRight, BookOpen, BriefcaseBusiness, Eye, TrendingUp, Users } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalCourses },
    { count: publishedCourses },
    { count: totalStudents },
    { count: totalEnrollments },
    { count: totalLeads },
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('b2b_leads').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Formações totais', value: totalCourses ?? 0, icon: BookOpen, color: '#0B4A8F' },
    { label: 'Formações publicadas', value: publishedCourses ?? 0, icon: Eye, color: '#2E7D32' },
    { label: 'Alunos cadastrados', value: totalStudents ?? 0, icon: Users, color: '#7C3AED' },
    { label: 'Matrículas ativas', value: totalEnrollments ?? 0, icon: TrendingUp, color: '#D97706' },
  ]

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)] md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#4CAF35]/10 blur-[80px]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Centro de comando</p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">Painel administrativo da Lidera.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#A9BDD8]">
              Gestão operacional de cursos, alunos e pipeline comercial em uma única visão.
            </p>
          </div>

          <div className="grid gap-2 text-xs text-[#A9BDD8]">
            <p className="rounded-xl border border-[#274364] bg-[#0A1528] px-3 py-2">
              Leads B2B registrados: <strong className="text-white">{totalLeads ?? 0}</strong>
            </p>
            <p className="rounded-xl border border-[#274364] bg-[#0A1528] px-3 py-2">
              Taxa de publicação: <strong className="text-white">{(totalCourses ?? 0) > 0 ? Math.round(((publishedCourses ?? 0) / (totalCourses ?? 1)) * 100) : 0}%</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3F8FE]" style={{ color: stat.color }}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-[#0F172A]">{stat.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: 'Gerenciar formações',
            desc: 'Criar, editar e publicar programas da academia.',
            href: '/admin/cursos',
            icon: BookOpen,
          },
          {
            title: 'Gestão de alunos',
            desc: 'Acompanhar base de alunos e evolução da operação educacional.',
            href: '/admin/alunos',
            icon: Users,
          },
          {
            title: 'Pipeline B2B',
            desc: 'Qualificar leads corporativos e gerar propostas comerciais.',
            href: '/admin/leads',
            icon: BriefcaseBusiness,
          },
        ].map(({ title, desc, href, icon: Icon }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-2xl border border-[#D8E2EF] bg-white p-6 shadow-sm transition-all hover:border-[#C5D9F0] hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
          >
            <Icon className="h-5 w-5 text-[#0B4A8F]" />
            <h2 className="mt-3 text-xl font-extrabold text-[#0F172A]">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#0B4A8F]">
              Acessar
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}
