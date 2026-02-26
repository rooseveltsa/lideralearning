'use server'

import { createClient } from '@/lib/supabase/server'
import { Course, Module, Lesson, Enrollment, Progress } from '@/types/database'

export async function getUserCourses() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Fetch enrollments and join with courses
    const { data, error } = await supabase
        .from('enrollments')
        .select(`
      id,
      status,
      enrolled_at,
      course_id,
      courses (
        id,
        title,
        description,
        thumbnail_url,
        price,
        is_published
      )
    `)
        .eq('user_id', user.id)
        .eq('status', 'active')

    if (error || !data) {
        console.error('Error fetching user courses:', error)
        return []
    }

    // Format response
    return data.map((enrollment: any) => ({
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolled_at,
        course: enrollment.courses as Course
    }))
}

export async function getCourseDetails(courseId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Verify enrollment
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .single()

    if (!enrollment) return null

    // Fetch course with modules and lessons
    const { data: course, error } = await supabase
        .from('courses')
        .select(`
      *,
      modules (
        *,
        lessons (*)
      )
    `)
        .eq('id', courseId)
        .single()

    if (error || !course) {
        console.error('Error fetching course details:', error)
        return null
    }

    // Order modules and lessons
    course.modules.sort((a: Module, b: Module) => a.order_index - b.order_index)
    course.modules.forEach((module: any) => {
        module.lessons.sort((a: Lesson, b: Lesson) => a.order_index - b.order_index)
    })

    // Fetch user progress for this enrollment
    const { data: progress } = await supabase
        .from('progress')
        .select('*')
        .eq('enrollment_id', enrollment.id)

    return {
        course: course,
        progress: (progress as Progress[]) || [],
        enrollmentId: enrollment.id
    }
}

export async function markLessonCompleted(enrollmentId: string, lessonId: string, isCompleted: boolean) {
    const supabase = await createClient()

    // Upsert progress
    const { error } = await supabase
        .from('progress')
        .upsert(
            {
                enrollment_id: enrollmentId,
                lesson_id: lessonId,
                is_completed: isCompleted,
                last_accessed_at: new Date().toISOString()
            },
            { onConflict: 'enrollment_id, lesson_id' }
        )

    if (error) {
        console.error('Error updating progress:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}
