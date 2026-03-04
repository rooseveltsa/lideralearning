import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
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

    // Fetch course data explicitly for unauthenticated users, ensuring it is published
    const { data: course, error } = await supabase
        .from('courses')
        .select(`
      *,
      modules (
        id,
        title,
        order_index,
        lessons (id, title, duration_seconds, order_index)
      )
    `)
        .eq('id', course_id)
        .eq('is_published', true)
        .single()

    if (error || !course) {
        return notFound()
    }

    // Pre-calculate stats
    let totalLessons = 0
    let totalDuration = 0
    const typedCourse = course as PublicCourse

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
        />
    )
}
