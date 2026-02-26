'use client'

import { useTransition, useState } from 'react'
import { createCourse } from '@/app/admin/actions'
import { Loader2 } from 'lucide-react'

export default function NovoCursoPage() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)
        startTransition(async () => {
            const result = await createCourse(formData)
            if (result?.error) setError(result.error)
        })
    }

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#111827] tracking-tight">Criar Nova Formação</h1>
                <p className="text-[#64748B] mt-2 font-medium text-lg">Preencha as informações básicas. Você poderá adicionar módulos e aulas na próxima etapa.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-[#E5E7EB] rounded-2xl p-8 space-y-6 shadow-sm">
                {error && (
                    <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] text-sm p-4 rounded-xl font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#475569] tracking-wide block">Título da Formação <span className="text-red-500">*</span></label>
                    <input
                        name="title"
                        required
                        placeholder="Ex: Liderança Exponencial"
                        className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#475569] tracking-wide block">Descrição</label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="Descreva o que os líderes aprenderão nesta formação..."
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all resize-none font-medium"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#475569] tracking-wide block">Preço (R$)</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue="0"
                            placeholder="997.00"
                            className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#475569] tracking-wide block">URL da Thumbnail</label>
                        <input
                            name="thumbnail_url"
                            type="url"
                            placeholder="https://..."
                            className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#F8FAFC]">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center justify-center gap-2 h-12 px-8 bg-[#1E88E5] text-white rounded-xl font-bold shadow-lg shadow-[#1E88E5]/20 hover:bg-[#1565C0] disabled:opacity-50 transition-all"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Criando...
                            </>
                        ) : (
                            'Salvar e Continuar'
                        )}
                    </button>
                    <a href="/admin/cursos" className="h-12 px-6 flex items-center justify-center text-[#64748B] text-sm font-bold hover:text-[#111827] hover:bg-[#F8FAFC] rounded-xl transition-colors">
                        Cancelar
                    </a>
                </div>
            </form>
        </div>
    )
}
