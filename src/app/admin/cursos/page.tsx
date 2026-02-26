import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Eye, EyeOff, Pencil } from 'lucide-react'

export default async function AdminCursosPage() {
    const supabase = await createClient()

    const { data: courses } = await supabase
        .from('courses')
        .select('id, title, price, is_published, created_at, thumbnail_url')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#111827] tracking-tight">Formações</h1>
                    <p className="text-[#64748B] mt-2 font-medium text-lg">{courses?.length ?? 0} {courses?.length === 1 ? 'formação cadastrada' : 'formações cadastradas'}</p>
                </div>
                <Link href="/admin/cursos/novo">
                    <button className="flex items-center gap-2 h-12 px-6 bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#1E88E5]/20 transition-all">
                        <Plus className="h-4 w-4" />
                        Nova Formação
                    </button>
                </Link>
            </div>

            {/* Lista de Cursos */}
            {!courses || courses.length === 0 ? (
                <div className="text-center py-24 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
                    <div className="w-20 h-20 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">📚</span>
                    </div>
                    <h3 className="text-xl font-heading font-extrabold text-[#111827] mb-2">Nenhuma formação criada ainda</h3>
                    <p className="text-[#64748B] mb-8 font-medium">Cadastre a primeira formação e comece a estruturar sua academia.</p>
                    <Link href="/admin/cursos/novo">
                        <button className="h-12 px-6 inline-flex items-center justify-center bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#1E88E5]/20 transition-all">
                            Criar Primeira Formação
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Formação</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Preço</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]">
                                {courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-[#F8FAFC] transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                {course.thumbnail_url ? (
                                                    <img src={course.thumbnail_url} alt="" className="w-16 h-12 object-cover rounded-lg border border-[#E5E7EB] shadow-sm flex-shrink-0" />
                                                ) : (
                                                    <div className="w-16 h-12 bg-[#EEF2F6] border border-[#E5E7EB] rounded-lg flex-shrink-0 flex items-center justify-center text-[#94A3B8] text-xs font-bold">Sem img</div>
                                                )}
                                                <span className="text-base font-bold text-[#111827] line-clamp-1">{course.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-[#64748B]">
                                            {course.price > 0
                                                ? `R$ ${Number(course.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                                : <span className="text-[#4CAF35] bg-[#4CAF35]/10 px-2.5 py-1 rounded-md">Gratuito</span>}
                                        </td>
                                        <td className="px-6 py-5">
                                            {course.is_published ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4CAF35]/10 text-[#4CAF35] text-xs font-bold">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Publicado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] text-[#64748B] text-xs font-bold">
                                                    <EyeOff className="h-3.5 w-3.5" />
                                                    Rascunho
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link href={`/admin/cursos/${course.id}`}>
                                                <button className="inline-flex items-center gap-2 ml-auto px-4 py-2 bg-white hover:bg-[#F8FAFC] hover:text-[#111827] text-[#64748B] border border-[#E5E7EB] shadow-sm rounded-xl text-xs font-bold transition-all">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Editar
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
