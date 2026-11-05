import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { isDemoCatalogCourse } from "@/lib/content/catalog"
import { loadPublishedOutline } from "@/lib/content/public-course"
import CourseShowcaseClient from "./ShowcaseClient"

type PublicLesson = {
    id: string
    title: string
    duration_seconds: number
    order_index: number
}

type PublicModule = {
    id: string
    title: string
    order_index: number
    lessons: PublicLesson[]
}

type PublicCourse = {
    id: string
    title: string
    description: string | null
    price: number
    thumbnail_url: string | null
    modules: PublicModule[]
}

export default async function PublicCoursePage({ params }: { params: Promise<{ course_id: string }> }) {
    const { course_id } = await params
    const supabase = await createClient()

    // Curso publicado via chave anônima. A ementa vem sem video_url:
    // a policy de lessons esconde a linha inteira de quem não está matriculado.
    const { data: course, error } = await supabase
        .from('courses')
        .select('id, title, description, price, thumbnail_url')
        .eq('id', course_id)
        .eq('is_published', true)
        .single()

    if (error || !course) {
        return notFound()
    }

    const modules = await loadPublishedOutline(supabase, course_id)
    const typedCourse: PublicCourse = {
        id: course.id,
        title: course.title,
        description: course.description,
        price: Number(course.price ?? 0),
        thumbnail_url: course.thumbnail_url,
        modules,
    }

    let totalLessons = 0
    let totalDuration = 0

    typedCourse.modules.forEach((mod) => {
        totalLessons += mod.lessons.length
        mod.lessons.forEach((lesson) => {
            totalDuration += lesson.duration_seconds
        })
    })

    // Offload rendering and animations to the Client Component
    return (
        <CourseShowcaseClient
            course={typedCourse}
            totalLessons={totalLessons}
            totalDuration={totalDuration}
            demo={isDemoCatalogCourse(typedCourse)}
        />
    )
}
