import { createClient } from '@/lib/supabase/server'

export default async function AdminAlunosPage() {
    const supabase = await createClient()

    const { data: students } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at')
        .eq('role', 'student')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#111827] tracking-tight">Alunos</h1>
                    <p className="text-[#64748B] mt-2 font-medium text-lg">{students?.length ?? 0} {students?.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'} na plataforma</p>
                </div>
            </div>

            {!students || students.length === 0 ? (
                <div className="text-center py-24 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
                    <div className="w-20 h-20 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">👨‍🎓</span>
                    </div>
                    <h3 className="text-xl font-heading font-extrabold text-[#111827] mb-2">Nenhum aluno encontrado</h3>
                    <p className="text-[#64748B] font-medium">Os alunos cadastrados através das formações aparecerão aqui.</p>
                </div>
            ) : (
                <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Nome</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Cadastrado em</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-[#F8FAFC] transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#EEF2F6] border border-[#E5E7EB] flex items-center justify-center text-[#64748B] text-lg font-bold shadow-sm">
                                                    {student.full_name?.charAt(0).toUpperCase() ?? '?'}
                                                </div>
                                                <span className="text-base font-bold text-[#111827]">{student.full_name ?? 'Sem nome'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-[#64748B]">
                                            {new Date(student.created_at).toLocaleDateString('pt-BR')}
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
