'use client'

import { useTransition, useState } from 'react'
import Image from 'next/image'
import {
    updateCourse, publishCourse, deleteCourse,
    createModule, updateModule, moveModule, deleteModule,
    createLesson, updateLesson, moveLesson, deleteLesson
} from '@/app/admin/actions'
import {
    Eye, EyeOff, Trash2, Plus, Loader2, Pencil, Check, X,
    ChevronDown, ChevronUp, ExternalLink, ArrowUp, ArrowDown,
    PlayCircle, FileText, TriangleAlert, Clock, Layers
} from 'lucide-react'
import LessonEditor from './LessonEditor'
import { detectVideo, formatDuration } from './lesson-utils'

type Lesson = {
    id: string
    title: string
    video_url: string | null
    content_text: string | null
    duration_seconds: number
    order_index: number
}

type Module = {
    id: string
    title: string
    order_index: number
    lessons: Lesson[]
}

export type CourseEditorCourse = {
    id: string
    title: string
    description: string | null
    price: number
    thumbnail_url: string | null
    is_published: boolean
    modules: Module[]
}

export default function CourseEditorClient({ course }: { course: CourseEditorCourse }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
        Object.fromEntries(course.modules.map(m => [m.id, true]))
    )
    const [showNewLesson, setShowNewLesson] = useState<Record<string, boolean>>({})
    const [editingLesson, setEditingLesson] = useState<string | null>(null)
    const [editingModule, setEditingModule] = useState<string | null>(null)

    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
    const totalSeconds = course.modules.reduce(
        (acc, m) => acc + m.lessons.reduce((a, l) => a + (l.duration_seconds || 0), 0), 0
    )
    const lessonsWithoutVideo = course.modules.reduce(
        (acc, m) => acc + m.lessons.filter(l => !l.video_url).length, 0
    )

    const withFeedback = (fn: () => Promise<{ error?: string; success?: boolean } | undefined>, message = 'Salvo com sucesso!') => {
        setError(null)
        setSuccess(null)
        startTransition(async () => {
            const result = await fn()
            if (result?.error) setError(result.error)
            else if (result?.success) setSuccess(message)
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
        const form = e.currentTarget
        const formData = new FormData(form)
        formData.append('course_id', course.id)
        withFeedback(() => createModule(formData), 'Módulo criado!')
        form.reset()
    }

    const handleRenameModule = (e: React.FormEvent<HTMLFormElement>, moduleId: string) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        withFeedback(() => updateModule(moduleId, course.id, formData), 'Módulo renomeado!')
        setEditingModule(null)
    }

    const handleDeleteModule = (moduleId: string, lessonCount: number) => {
        if (!confirm(lessonCount > 0 ? `Excluir este módulo e suas ${lessonCount} aulas?` : 'Excluir este módulo?')) return
        withFeedback(() => deleteModule(moduleId, course.id), 'Módulo excluído.')
    }

    const handleCreateLesson = (formData: FormData, moduleId: string) => {
        formData.append('module_id', moduleId)
        formData.append('course_id', course.id)
        withFeedback(() => createLesson(formData), 'Aula criada!')
        setShowNewLesson(prev => ({ ...prev, [moduleId]: false }))
    }

    const handleUpdateLesson = (formData: FormData, lessonId: string) => {
        withFeedback(() => updateLesson(lessonId, course.id, formData), 'Aula atualizada!')
        setEditingLesson(null)
    }

    const handleDeleteLesson = (lessonId: string) => {
        if (!confirm('Excluir esta aula?')) return
        withFeedback(() => deleteLesson(lessonId, course.id), 'Aula excluída.')
    }

    return (
        <div className="space-y-8 max-w-6xl">
            <section className="relative overflow-hidden rounded-3xl border border-[#1d2940] bg-[#070e1c] p-8 text-white shadow-[0_22px_45px_rgba(2,6,23,0.55)]">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ec6411]/20 blur-[90px]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#fb7d2e]">Editor de conteúdo</p>
                        <h1 className="mt-3 text-3xl md:text-4xl font-heading font-extrabold tracking-tight">Editar formação</h1>
                        <p className="mt-3 text-sm text-[rgba(245,241,234,0.7)] truncate max-w-2xl">{course.title}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
                                <Layers className="h-3.5 w-3.5 text-[#fb7d2e]" />
                                {course.modules.length} módulos
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
                                <PlayCircle className="h-3.5 w-3.5 text-[#fb7d2e]" />
                                {totalLessons} aulas
                            </span>
                            {totalSeconds > 0 && (
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
                                    <Clock className="h-3.5 w-3.5 text-[#fb7d2e]" />
                                    {formatDuration(totalSeconds)} de conteúdo
                                </span>
                            )}
                            {lessonsWithoutVideo > 0 && (
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2.5 py-1 text-amber-300 ring-1 ring-amber-500/30">
                                    <TriangleAlert className="h-3.5 w-3.5" />
                                    {lessonsWithoutVideo} {lessonsWithoutVideo === 1 ? 'aula sem vídeo' : 'aulas sem vídeo'}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {course.is_published && (
                            <a
                                href={`/curso/${course.id}`}
                                target="_blank"
                                className="flex items-center gap-2 h-11 px-4 text-sm text-[rgba(245,241,234,0.85)] hover:text-white hover:bg-white/10 border border-white/15 rounded-xl font-bold transition-all bg-white/5"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Ver vitrine
                            </a>
                        )}
                        <button
                            onClick={handlePublish}
                            disabled={isPending}
                            className={`flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${course.is_published
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
                            className="flex items-center justify-center h-11 w-11 bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] border border-[#FECACA] rounded-xl transition-colors disabled:opacity-50"
                            title="Excluir formação"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Alerts */}
            {error && <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] text-sm p-4 rounded-xl font-medium">{error}</div>}
            {success && <div className="bg-[#D1FAE5] border border-[#6EE7B7] text-[#047857] text-sm p-4 rounded-xl font-medium">{success}</div>}

            {/* Formulário de edição do curso */}
            <form onSubmit={handleUpdateCourse} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-6 shadow-sm">
                <h2 className="text-xl font-heading font-extrabold text-[#111827] mb-4">Informações da Formação</h2>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#475569] tracking-wide block">Título <span className="text-red-500">*</span></label>
                    <input name="title" required defaultValue={course.title}
                        className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#ec6411]/10 focus:border-[#ec6411] transition-all font-medium" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#475569] tracking-wide block">Descrição</label>
                    <textarea name="description" rows={4} defaultValue={course.description ?? ''}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#ec6411]/10 focus:border-[#ec6411] transition-all resize-none font-medium" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#475569] tracking-wide block">Preço (R$)</label>
                        <input name="price" type="number" step="0.01" min="0" defaultValue={course.price}
                            className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#ec6411]/10 focus:border-[#ec6411] transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#475569] tracking-wide block">URL da Thumbnail</label>
                        <input name="thumbnail_url" type="url" defaultValue={course.thumbnail_url ?? ''}
                            placeholder="https://..."
                            className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#ec6411]/10 focus:border-[#ec6411] transition-all font-medium" />
                    </div>
                </div>

                {course.thumbnail_url && (
                    <Image
                        src={course.thumbnail_url}
                        alt="Thumbnail preview"
                        width={224}
                        height={128}
                        unoptimized
                        className="w-56 h-32 object-cover rounded-xl border border-[#E5E7EB] shadow-sm mt-2" />
                )}

                <div className="pt-4 border-t border-[#F8FAFC]">
                    <button type="submit" disabled={isPending}
                        className="flex items-center justify-center gap-2 h-12 px-8 bg-[#ec6411] hover:bg-[#cc4f06] text-white rounded-xl font-bold shadow-lg shadow-[#ec6411]/20 disabled:opacity-50 transition-all w-full sm:w-auto">
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Salvar Informações
                    </button>
                </div>
            </form>

            {/* Módulos */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-heading font-extrabold text-[#111827]">Conteúdo Programático</h2>
                    <p className="mt-1 text-sm text-[#64748B] font-medium">
                        Estruture módulos e aulas na ordem em que o aluno deve assistir. Cada aula pode ter vídeo, duração e material de apoio.
                    </p>
                </div>

                {course.modules.length === 0 && (
                    <div className="rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] p-10 text-center">
                        <Layers className="mx-auto h-8 w-8 text-[#CBD5E1]" />
                        <p className="mt-3 text-sm font-bold text-[#475569]">Nenhum módulo ainda</p>
                        <p className="mt-1 text-sm text-[#94A3B8]">Crie o primeiro módulo abaixo — ele agrupa as aulas da formação.</p>
                    </div>
                )}

                {/* Lista de módulos */}
                <div className="space-y-4">
                    {course.modules.map((module, moduleIndex) => {
                        const moduleSeconds = module.lessons.reduce((a, l) => a + (l.duration_seconds || 0), 0)
                        return (
                        <div key={module.id} className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white shadow-sm">
                            {/* Cabeçalho do módulo */}
                            <div className="flex items-center gap-3 px-6 py-5 bg-[#F8FAFC] border-b border-[#E5E7EB]">
                                <button
                                    type="button"
                                    onClick={() => setExpandedModules(prev => ({ ...prev, [module.id]: !prev[module.id] }))}
                                    className="w-8 h-8 shrink-0 flex items-center justify-center bg-white border border-[#E5E7EB] rounded-full text-[#64748B] hover:text-[#111827] hover:bg-[#EEF2F6] transition-all shadow-sm"
                                    aria-label={expandedModules[module.id] ? 'Recolher módulo' : 'Expandir módulo'}
                                >
                                    {expandedModules[module.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>

                                {editingModule === module.id ? (
                                    <form onSubmit={(e) => handleRenameModule(e, module.id)} className="flex flex-1 items-center gap-2">
                                        <input
                                            name="title"
                                            required
                                            autoFocus
                                            defaultValue={module.title}
                                            className="flex-1 h-9 px-3 bg-white border border-[#ec6411]/40 rounded-lg text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#ec6411]/25"
                                        />
                                        <button type="submit" disabled={isPending} className="p-2 text-[#059669] hover:bg-[#ECFDF5] rounded-lg transition-colors" aria-label="Salvar nome do módulo">
                                            <Check className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => setEditingModule(null)} className="p-2 text-[#64748B] hover:bg-[#EEF2F6] rounded-lg transition-colors" aria-label="Cancelar edição">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <span className="flex-1 text-base font-bold text-[#111827] truncate">{module.title}</span>
                                        <span className="hidden sm:inline text-xs font-bold text-[#94A3B8] uppercase tracking-wider px-3 py-1 bg-[#EEF2F6] rounded-md whitespace-nowrap">
                                            {module.lessons.length} {module.lessons.length === 1 ? 'aula' : 'aulas'}
                                            {moduleSeconds > 0 && ` · ${formatDuration(moduleSeconds)}`}
                                        </span>
                                        <div className="flex items-center gap-0.5">
                                            <button type="button" onClick={() => withFeedback(() => moveModule(module.id, course.id, 'up'), 'Ordem atualizada.')}
                                                disabled={isPending || moduleIndex === 0}
                                                className="p-2 text-[#94A3B8] hover:text-[#111827] hover:bg-[#EEF2F6] rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                                aria-label="Mover módulo para cima">
                                                <ArrowUp className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => withFeedback(() => moveModule(module.id, course.id, 'down'), 'Ordem atualizada.')}
                                                disabled={isPending || moduleIndex === course.modules.length - 1}
                                                className="p-2 text-[#94A3B8] hover:text-[#111827] hover:bg-[#EEF2F6] rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                                aria-label="Mover módulo para baixo">
                                                <ArrowDown className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => setEditingModule(module.id)}
                                                className="p-2 text-[#94A3B8] hover:text-[#ec6411] hover:bg-[#ec6411]/5 rounded-lg transition-colors"
                                                aria-label="Renomear módulo">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => handleDeleteModule(module.id, module.lessons.length)} disabled={isPending}
                                                className="p-2 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                                                aria-label="Excluir módulo">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Aulas do módulo */}
                            {expandedModules[module.id] && (
                                <div className="p-6 space-y-3 bg-white">
                                    {module.lessons.length === 0 && !showNewLesson[module.id] && (
                                        <p className="text-sm font-medium text-[#94A3B8]">Este módulo ainda não tem aulas.</p>
                                    )}

                                    {module.lessons.map((lesson, lessonIndex) => {
                                        const video = detectVideo(lesson.video_url)
                                        return (
                                        <div key={lesson.id}>
                                            {editingLesson === lesson.id ? (
                                                <LessonEditor
                                                    defaultValues={lesson}
                                                    submitLabel="Salvar alterações"
                                                    isPending={isPending}
                                                    onSubmit={(fd) => handleUpdateLesson(fd, lesson.id)}
                                                    onCancel={() => setEditingLesson(null)}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-3 py-3 px-5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-xl group transition-colors hover:border-[#E5E7EB]">
                                                    <span className="flex shrink-0 items-center justify-center w-6 h-6 rounded-full bg-white border border-[#E5E7EB] text-xs font-bold text-[#64748B]">{lessonIndex + 1}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-[#111827] truncate">{lesson.title}</p>
                                                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                                                            {video && video.kind !== 'unknown' ? (
                                                                <span className="inline-flex items-center gap-1 text-emerald-700">
                                                                    <PlayCircle className="h-3 w-3" /> {video.label}
                                                                </span>
                                                            ) : video ? (
                                                                <span className="inline-flex items-center gap-1 text-amber-600">
                                                                    <TriangleAlert className="h-3 w-3" /> Vídeo não reconhecido
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-amber-600">
                                                                    <TriangleAlert className="h-3 w-3" /> Sem vídeo
                                                                </span>
                                                            )}
                                                            {lesson.duration_seconds > 0 && (
                                                                <span className="inline-flex items-center gap-1 text-[#64748B]">
                                                                    <Clock className="h-3 w-3" /> {formatDuration(lesson.duration_seconds)}
                                                                </span>
                                                            )}
                                                            {lesson.content_text && (
                                                                <span className="inline-flex items-center gap-1 text-[#64748B]">
                                                                    <FileText className="h-3 w-3" /> Material de apoio
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                                        <button type="button" onClick={() => withFeedback(() => moveLesson(lesson.id, module.id, course.id, 'up'), 'Ordem atualizada.')}
                                                            disabled={isPending || lessonIndex === 0}
                                                            className="p-2 text-[#94A3B8] hover:text-[#111827] hover:bg-[#EEF2F6] rounded-lg transition-colors disabled:opacity-30"
                                                            aria-label="Mover aula para cima">
                                                            <ArrowUp className="h-4 w-4" />
                                                        </button>
                                                        <button type="button" onClick={() => withFeedback(() => moveLesson(lesson.id, module.id, course.id, 'down'), 'Ordem atualizada.')}
                                                            disabled={isPending || lessonIndex === module.lessons.length - 1}
                                                            className="p-2 text-[#94A3B8] hover:text-[#111827] hover:bg-[#EEF2F6] rounded-lg transition-colors disabled:opacity-30"
                                                            aria-label="Mover aula para baixo">
                                                            <ArrowDown className="h-4 w-4" />
                                                        </button>
                                                        <button type="button" onClick={() => setEditingLesson(lesson.id)}
                                                            className="p-2 text-[#94A3B8] hover:text-[#ec6411] hover:bg-[#ec6411]/5 rounded-lg transition-colors"
                                                            aria-label="Editar aula">
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button type="button" onClick={() => handleDeleteLesson(lesson.id)} disabled={isPending}
                                                            className="p-2 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                                                            aria-label="Excluir aula">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        )
                                    })}

                                    {/* Nova aula */}
                                    {showNewLesson[module.id] ? (
                                        <LessonEditor
                                            submitLabel="Criar aula"
                                            isPending={isPending}
                                            onSubmit={(fd) => handleCreateLesson(fd, module.id)}
                                            onCancel={() => setShowNewLesson(prev => ({ ...prev, [module.id]: false }))}
                                        />
                                    ) : (
                                        <button type="button"
                                            onClick={() => setShowNewLesson(prev => ({ ...prev, [module.id]: true }))}
                                            className="flex items-center justify-center gap-2 w-full mt-4 h-12 text-sm font-bold text-[#64748B] hover:text-[#ec6411] hover:bg-[#ec6411]/5 border border-dashed border-[#CBD5E1] hover:border-[#ec6411]/40 rounded-xl transition-all">
                                            <Plus className="h-4 w-4" />
                                            Adicionar nova aula ao módulo
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        )
                    })}
                </div>

                {/* Novo módulo */}
                <form onSubmit={handleCreateModule} className="flex flex-col sm:flex-row items-end gap-4 pt-6 mt-6 border-t border-[#F8FAFC]">
                    <div className="flex-1 w-full space-y-2">
                        <label className="text-sm font-bold text-[#475569] tracking-wide block">Criar Novo Módulo</label>
                        <input name="title" required placeholder="Ex: Módulo 1 — Fundamentos de Gestão"
                            className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#ec6411]/10 focus:border-[#ec6411] transition-all font-medium" />
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
