import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CourseShowcaseClient from "./ShowcaseClient"

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
        lessons (id, title, duration_seconds)
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
    course.modules.forEach((mod: any) => {
        totalLessons += mod.lessons.length
        mod.lessons.forEach((l: any) => totalDuration += l.duration_seconds)
    })

    // Offload rendering and animations to the Client Component
    return (
        <CourseShowcaseClient
            course={course}
            totalLessons={totalLessons}
            totalDuration={totalDuration}
        />
    )
}
