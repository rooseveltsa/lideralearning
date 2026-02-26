export type Course = {
    id: string
    tenant_id: string | null
    title: string
    description: string | null
    thumbnail_url: string | null
    price: number
    is_published: boolean
    created_at: string
    updated_at: string
}

export type Module = {
    id: string
    course_id: string
    title: string
    order_index: number
    created_at: string
    updated_at: string
}

export type Lesson = {
    id: string
    module_id: string
    title: string
    video_url: string | null
    content_text: string | null
    duration_seconds: number
    order_index: number
    created_at: string
    updated_at: string
}

export type Enrollment = {
    id: string
    user_id: string
    course_id: string
    status: 'active' | 'completed' | 'expired'
    enrolled_at: string
}

export type Progress = {
    id: string
    enrollment_id: string
    lesson_id: string
    is_completed: boolean
    watch_time_seconds: number
    last_accessed_at: string
}
