import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Pencil, Plus } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

type CourseRow = {
  id: string
  title: string
  price: number
  is_published: boolean
  created_at: string
  thumbnail_url: string | null
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default async function AdminCursosPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('courses')
    .select('id, title, price, is_published, created_at, thumbnail_url')
    .order('created_at', { ascending: false })

  const courses = (Array.isArray(data) ? data : []) as CourseRow[]
  const publishedCount = courses.filter((course) => course.is_published).length

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#1A2B46] bg-[#060D1A] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1E88E5]/20 blur-[90px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">Gestão de catálogo</p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-4xl">Formações da plataforma</h1>
            <p className="mt-4 text-sm text-[#A9BDD8]">
              Total: <strong className="text-white">{courses.length}</strong> • Publicadas: <strong className="text-white">{publishedCount}</strong>
            </p>
          </div>

          <Link
            href="/admin/cursos/novo"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
          >
            <Plus className="h-4 w-4" />
            Nova formação
          </Link>
        </div>
      </section>

      {courses.length === 0 ? (
        <section className="rounded-2xl border border-[#D8E2EF] bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-2xl font-extrabold text-[#0F172A]">Nenhuma formação cadastrada ainda</h2>
          <p className="mt-3 text-sm text-[#64748B]">Crie a primeira formação para iniciar o catálogo da academia.</p>
          <Link
            href="/admin/cursos/novo"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0]"
          >
            Criar primeira formação
            <Plus className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <section className="overflow-x-auto rounded-2xl border border-[#D8E2EF] bg-white shadow-sm">
          <table className="min-w-full">
            <thead className="border-b border-[#E5ECF6] bg-[#F7FAFE]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Formação</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Preço</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Criado em</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECF6]">
              {courses.map((course) => (
                <tr key={course.id} className="transition-colors hover:bg-[#F9FBFE]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnail_url ? (
                        <Image
                          src={course.thumbnail_url}
                          alt={`Thumbnail de ${course.title}`}
                          width={72}
                          height={48}
                          unoptimized
                          className="h-12 w-[72px] rounded-lg border border-[#DCE6F3] object-cover"
                        />
                      ) : (
                        <div className="inline-flex h-12 w-[72px] items-center justify-center rounded-lg border border-[#DCE6F3] bg-[#F3F8FE] text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748B]">
                          Sem capa
                        </div>
                      )}
                      <span className="line-clamp-1 text-sm font-bold text-[#0F172A]">{course.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#334155]">
                    {course.price > 0 ? currencyFormatter.format(course.price) : 'Gratuito'}
                  </td>
                  <td className="px-6 py-4">
                    {course.is_published ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        <Eye className="h-3.5 w-3.5" />
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                        <EyeOff className="h-3.5 w-3.5" />
                        Rascunho
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#64748B]">
                    {new Date(course.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/cursos/${course.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8E2EF] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#334155] transition-colors hover:bg-[#F4F8FD]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
