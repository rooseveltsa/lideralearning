'use client'

import { useTransition, useState } from 'react'
import {
    updateCourse, publishCourse, deleteCourse,
    createModule, deleteModule,
    createLesson, deleteLesson
} from '@/app/admin/actions'
import {
    Eye, EyeOff, Trash2, Plus, Loader2,
    ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react'

type Lesson = {
    id: string
    title: string
    video_url: string | null
    duration_seconds: number
    order_index: number
}

type Module = {
    id: string
    title: string
    order_index: number
    lessons: Lesson[]
}

type Course = {
    id: string
    title: string
    description: string | null
    price: number
    thumbnail_url: string | null
    is_published: boolean
    modules: Module[]
}

export default function CourseEditorClient({ course }: { course: Course }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
        Object.fromEntries(course.modules.map(m => [m.id, true]))
    )
    const [showNewLesson, setShowNewLesson] = useState<Record<string, boolean>>({})

    const withFeedback = (fn: () => Promise<{ error?: string; success?: boolean } | undefined>) => {
        setError(null)
        setSuccess(null)
        startTransition(async () => {
            const result = await fn()
            if (result?.error) setError(result.error)
            else if (result?.success) setSuccess('Salvo com sucesso!')
        })
    }

    const handleUpdateCourse = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        withFeedback(() => updateCourse(course.id, formData))
    }

    const handlePublish = () => {
        withFeedback(() => publishCourse(course.id, !course.is_published))
    }

    const handleDeleteCourse = () => {
        if (!confirm('Tem certeza que deseja excluir esta formação? Esta ação não pode ser desfeita.')) return
        withFeedback(() => deleteCourse(course.id))
    }

    const handleCreateModule = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('course_id', course.id)
        withFeedback(() => createModule(formData))
            ; (e.target as HTMLFormElement).reset()
    }

    const handleDeleteModule = (moduleId: string) => {
        if (!confirm('Excluir este módulo e todas as suas aulas?')) return
        withFeedback(() => deleteModule(moduleId, course.id))
    }

    const handleCreateLesson = (e: React.FormEvent<HTMLFormElement>, moduleId: string) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('module_id', moduleId)
        formData.append('course_id', course.id)
        withFeedback(() => createLesson(formData))
            ; (e.target as HTMLFormElement).reset()
        setShowNewLesson(prev => ({ ...prev, [moduleId]: false }))
    }

    const handleDeleteLesson = (lessonId: string) => {
        if (!confirm('Excluir esta aula?')) return
        withFeedback(() => deleteLesson(lessonId, course.id))
    }

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header com ações principais */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#111827] tracking-tight">Editar Formação</h1>
                    <p className="text-[#64748B] mt-2 font-medium text-lg truncate max-w-xl">{course.title}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {course.is_published && (
                        <a href={`/curso/${course.id}`} target="_blank"
                            className="flex items-center gap-2 h-11 px-4 text-sm text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl font-bold transition-all shadow-sm bg-white">
                            <ExternalLink className="h-4 w-4" />
                            Ver Vitrine
                        </a>
                    )}
                    <button
                        onClick={handlePublish}
                        disabled={isPending}
                        className={`flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 ${course.is_published
                            ? 'bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7] border border-[#FDE68A]'
                            : 'bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5] border border-[#A7F3D0]'
                            }`}
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : course.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {course.is_published ? 'Despublicar' : 'Publicar'}
                    </button>
                    <button
                        onClick={handleDeleteCourse}
                        disabled={isPending}
                        className="flex items-center justify-center h-11 w-11 bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] border border-[#FECACA] rounded-xl transition-colors shadow-sm disabled:opacity-50"
                        title="Excluir formação"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {error && <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] text-sm p-4 rounded-xl font-medium">{error}</div>}
            {success && <div className="bg-[#D1FAE5] border border-[#6EE7B7] text-[#047857] text-sm p-4 rounded-xl font-medium">{success}</div>}

            {/* Formulário de edição do curso */}
            <form onSubmit={handleUpdateCourse} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-6 shadow-sm">
                <h2 className="text-xl font-heading font-extrabold text-[#111827] mb-4">Informações da Formação</h2>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#475569] tracking-wide block">Título <span className="text-red-500">*</span></label>
                    <input name="title" required defaultValue={course.title}
                        className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all font-medium" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#475569] tracking-wide block">Descrição</label>
                    <textarea name="description" rows={4} defaultValue={course.description ?? ''}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all resize-none font-medium" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#475569] tracking-wide block">Preço (R$)</label>
                        <input name="price" type="number" step="0.01" min="0" defaultValue={course.price}
                            className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#475569] tracking-wide block">URL da Thumbnail</label>
                        <input name="thumbnail_url" type="url" defaultValue={course.thumbnail_url ?? ''}
                            placeholder="https://..."
                            className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all font-medium" />
                    </div>
                </div>

                {course.thumbnail_url && (
                    <img src={course.thumbnail_url} alt="Thumbnail preview" className="w-56 h-32 object-cover rounded-xl border border-[#E5E7EB] shadow-sm mt-2" />
                )}

                <div className="pt-4 border-t border-[#F8FAFC]">
                    <button type="submit" disabled={isPending}
                        className="flex items-center justify-center gap-2 h-12 px-8 bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-bold shadow-lg shadow-[#1E88E5]/20 disabled:opacity-50 transition-all w-full sm:w-auto">
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Salvar Informações
                    </button>
                </div>
            </form>

            {/* Módulos */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-6 shadow-sm">
                <h2 className="text-xl font-heading font-extrabold text-[#111827]">Conteúdo Programático (Módulos e Aulas)</h2>

                {course.modules.length === 0 && (
                    <p className="text-[#64748B] font-medium text-sm">Nenhum módulo adicionado. Crie o primeiro módulo abaixo para estruturar sua formação.</p>
                )}

                {/* Lista de módulos */}
                <div className="space-y-4">
                    {course.modules.map((module) => (
                        <div key={module.id} className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white shadow-sm">
                            {/* Cabeçalho do módulo */}
                            <div className="flex items-center gap-4 px-6 py-5 bg-[#F8FAFC] border-b border-[#E5E7EB]">
                                <button
                                    type="button"
                                    onClick={() => setExpandedModules(prev => ({ ...prev, [module.id]: !prev[module.id] }))}
                                    className="w-8 h-8 flex items-center justify-center bg-white border border-[#E5E7EB] rounded-full text-[#64748B] hover:text-[#111827] hover:bg-[#EEF2F6] transition-all shadow-sm"
                                >
                                    {expandedModules[module.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                                <span className="flex-1 text-base font-bold text-[#111827]">{module.title}</span>
                                <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider px-3 py-1 bg-[#EEF2F6] rounded-md">{module.lessons.length} aulas</span>
                                <button type="button" onClick={() => handleDeleteModule(module.id)} disabled={isPending}
                                    className="p-2 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors ml-2">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Aulas do módulo */}
                            {expandedModules[module.id] && (
                                <div className="p-6 space-y-3 bg-white">
                                    {module.lessons.map((lesson) => (
                                        <div key={lesson.id} className="flex items-center gap-4 py-3 px-5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-xl group transition-colors hover:border-[#E5E7EB]">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-[#E5E7EB] text-xs font-bold text-[#64748B]">{lesson.order_index}</span>
                                            <span className="flex-1 text-sm font-bold text-[#111827]">{lesson.title}</span>
                                            {lesson.video_url && (
                                                <span className="text-xs font-bold text-[#1E88E5] bg-[#1E88E5]/10 px-2 py-1 rounded-md">▶ Vídeo Anexado</span>
                                            )}
                                            <button type="button" onClick={() => handleDeleteLesson(lesson.id)} disabled={isPending}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-all ml-2">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Formulário de nova aula */}
                                    {showNewLesson[module.id] ? (
                                        <form onSubmit={(e) => handleCreateLesson(e, module.id)}
                                            className="mt-4 p-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-4 shadow-inner">
                                            <p className="text-sm font-bold text-[#111827]">Adicionar nova aula</p>
                                            <input name="title" required placeholder="Título da aula *"
                                                className="w-full px-4 h-11 bg-white border border-[#E5E7EB] rounded-lg text-[#111827] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] font-medium transition-all" />
                                            <input name="video_url" type="url" placeholder="URL do vídeo (Obrigatório ou Opcional)"
                                                className="w-full px-4 h-11 bg-white border border-[#E5E7EB] rounded-lg text-[#111827] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] font-medium transition-all" />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <input name="duration_seconds" type="number" min="0" placeholder="Duração (segundos)"
                                                    className="w-full px-4 h-11 bg-white border border-[#E5E7EB] rounded-lg text-[#111827] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] font-medium transition-all" />
                                                <div className="flex gap-3">
                                                    <button type="submit" disabled={isPending}
                                                        className="flex-1 h-11 px-4 bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-lg text-sm font-bold shadow-md shadow-[#1E88E5]/20 disabled:opacity-50 transition-all flex items-center justify-center">
                                                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar Aula'}
                                                    </button>
                                                    <button type="button" onClick={() => setShowNewLesson(prev => ({ ...prev, [module.id]: false }))}
                                                        className="h-11 px-5 bg-white text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-sm font-bold transition-all shadow-sm">
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <button type="button"
                                            onClick={() => setShowNewLesson(prev => ({ ...prev, [module.id]: true }))}
                                            className="flex items-center justify-center gap-2 w-full mt-4 h-12 text-sm font-bold text-[#64748B] hover:text-[#1E88E5] hover:bg-[#1E88E5]/5 border border-dashed border-[#CBD5E1] hover:border-[#1E88E5]/30 rounded-xl transition-all">
                                            <Plus className="h-4 w-4" />
                                            Adicionar nova aula ao módulo
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Formulário de novo módulo */}
                <form onSubmit={handleCreateModule} className="flex flex-col sm:flex-row items-end gap-4 pt-6 mt-6 border-t border-[#F8FAFC]">
                    <div className="flex-1 w-full space-y-2">
                        <label className="text-sm font-bold text-[#475569] tracking-wide block">Criar Novo Módulo</label>
                        <input name="title" required placeholder="Ex: Módulo 1 - Fundamentos de Gestão"
                            className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all font-medium" />
                    </div>
                    <button type="submit" disabled={isPending}
                        className="flex items-center justify-center gap-2 h-12 px-6 bg-white text-[#111827] border border-[#E5E7EB] shadow-sm rounded-xl text-sm font-bold hover:bg-[#F8FAFC] disabled:opacity-50 transition-all whitespace-nowrap w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Salvar Módulo
                    </button>
                </form>
            </div>
        </div>
    )
}
