'use client'

import { useEffect, useState, use } from "react"
import { getCourseDetails, markLessonCompleted } from "@/lib/actions/lms"
import { notFound, useRouter } from "next/navigation"
import { Progress, Lesson as LessonType } from "@/types/database"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronLeft, Loader2, PlayCircle } from "lucide-react"
import Link from "next/link"

export default function AulaPage({ params }: { params: Promise<{ course_id: string, lesson_id: string }> }) {
    const { course_id, lesson_id } = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [marking, setMarking] = useState(false)
    const [courseData, setCourseData] = useState<any>(null)

    useEffect(() => {
        async function loadData() {
            const data = await getCourseDetails(course_id)
            if (!data) return notFound()
            setCourseData(data)
            setLoading(false)
        }
        loadData()
    }, [course_id])

    if (loading || !courseData) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1E88E5]" />
            </div>
        )
    }

    const { course, progress, enrollmentId } = courseData

    // Find the current lesson in the course modules
    let currentLesson: LessonType | null = null
    let currentModuleTitle = ""

    course.modules.forEach((mod: any) => {
        const lessonMatch = mod.lessons.find((l: any) => l.id === lesson_id)
        if (lessonMatch) {
            currentLesson = lessonMatch as LessonType
            currentModuleTitle = mod.title
        }
    })

    if (!currentLesson) return notFound()

    // Safely cast to access properties
    const activeLesson = currentLesson as LessonType

    const isCompleted = progress.some((p: Progress) => p.lesson_id === lesson_id && p.is_completed)

    const handleMarkComplete = async () => {
        setMarking(true)
        await markLessonCompleted(enrollmentId, lesson_id, !isCompleted)

        // Refresh the page data state
        const newData = await getCourseDetails(course_id)
        setCourseData(newData)
        setMarking(false)
    }

    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 lg:p-8">
            <Link
                href={`/dashboard/cursos/${course_id}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#1E88E5] transition-colors w-fit mb-2 bg-white px-4 py-2 rounded-lg border border-[#E5E7EB] shadow-sm"
            >
                <ChevronLeft className="h-4 w-4" />
                Voltar para a Trilha
            </Link>

            <div className="flex flex-col xl:flex-row gap-8 items-start">

                {/* Main Video Area */}
                <div className="w-full xl:w-3/4 flex flex-col gap-6">
                    {/* Video Player */}
                    <div className="w-full aspect-video bg-[#0B0F19] rounded-2xl overflow-hidden shadow-2xl relative">
                        {activeLesson.video_url ? (
                            <VideoPlayerInline url={activeLesson.video_url} thumbnail={course.thumbnail_url} />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#94A3B8] gap-4 bg-[#0B0F19]">
                                <PlayCircle className="h-16 w-16 opacity-20" />
                                <span className="text-lg font-medium">Vídeo não disponível no momento.</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-b border-[#E5E7EB] bg-white px-6 md:px-8 rounded-2xl shadow-sm border">
                        <div>
                            <p className="text-sm font-bold tracking-wider uppercase text-[#1E88E5] mb-2">{currentModuleTitle}</p>
                            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-[#111827]">{activeLesson.title}</h1>
                        </div>
                        <Button
                            className={`sm:w-auto w-full h-12 px-6 flex items-center gap-2 font-bold text-sm rounded-xl transition-all duration-300 ${isCompleted
                                    ? "bg-[#4CAF35]/10 text-[#4CAF35] hover:bg-[#4CAF35]/20 border-none shadow-none"
                                    : "bg-[#1E88E5] hover:bg-[#1565C0] text-white shadow-lg shadow-[#1E88E5]/20"
                                }`}
                            onClick={handleMarkComplete}
                            disabled={marking}
                        >
                            {marking && <Loader2 className="h-5 w-5 animate-spin" />}
                            {!marking && <CheckCircle2 className={`h-5 w-5 ${isCompleted ? 'text-[#4CAF35]' : 'text-white/70'}`} />}
                            {isCompleted ? "Aula Concluída" : "Marcar como Concluída"}
                        </Button>
                    </div>

                    {activeLesson.content_text && (
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#E5E7EB] mt-2">
                            <h3 className="text-xl font-heading font-extrabold text-[#111827] mb-4">Materiais Complementares</h3>
                            <div className="prose prose-slate max-w-none text-[#475569] leading-relaxed">
                                <p>{activeLesson.content_text}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Navigation */}
                <div className="w-full xl:w-1/4">
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm sticky top-24 overflow-hidden">
                        <div className="p-5 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                            <h3 className="font-heading font-extrabold text-[#111827] text-lg">Conteúdo da Formação</h3>
                        </div>

                        <div className="flex flex-col max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                            {course.modules.sort((a: any, b: any) => a.order_index - b.order_index).map((mod: any, mIndex: number) => (
                                <div key={mod.id} className="border-b border-[#F1F5F9] last:border-0">
                                    <div className="px-5 py-4 bg-white sticky top-0 z-10">
                                        <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider leading-relaxed">
                                            Módulo {mIndex + 1}
                                            <br />
                                            <span className="text-[#111827]">{mod.title}</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col px-3 pb-3">
                                        {mod.lessons.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => {
                                            const isActive = lesson.id === lesson_id
                                            const done = progress.some((p: Progress) => p.lesson_id === lesson.id && p.is_completed)
                                            return (
                                                <Link key={lesson.id}
                                                    href={`/dashboard/cursos/${course.id}/aula/${lesson.id}`}
                                                    className={`py-3 px-3 rounded-xl transition-all duration-300 flex items-start gap-3 mb-1
                                                        ${isActive
                                                            ? 'bg-[#1E88E5]/10 text-[#1E88E5] border-l-4 border-[#1E88E5] font-bold shadow-inner'
                                                            : 'hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] font-medium border-l-4 border-transparent'
                                                        }`}>
                                                    <div className={`mt-0.5 rounded-full p-0.5 ${done ? 'bg-[#4CAF35]/10' : ''}`}>
                                                        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${done ? 'text-[#4CAF35]' : 'text-[#CBD5E1]'}`} />
                                                    </div>
                                                    <span className="line-clamp-2 text-sm leading-snug">{lesson.title}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function VideoPlayerInline({ url, thumbnail }: { url: string; thumbnail?: string | null }) {
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)

    if (ytMatch) {
        return <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`}
            title="Aula" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen className="w-full h-full absolute inset-0" />
    }
    if (vimeoMatch) {
        return <iframe src={`https://player.vimeo.com/video/${vimeoMatch[1]}?color=1E88E5&portrait=0`}
            title="Aula" allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen className="w-full h-full absolute inset-0" />
    }
    return <video src={url} controls poster={thumbnail ?? undefined} className="w-full h-full absolute inset-0 object-cover" preload="metadata">
        Seu navegador não suporta este vídeo.
    </video>
}
