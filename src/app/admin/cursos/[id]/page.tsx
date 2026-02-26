import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CourseEditorClient from './CourseEditorClient'

export default async function EditarCursoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: course, error } = await supabase
        .from('courses')
        .select(`
      id, title, description, price, thumbnail_url, is_published,
      modules (
        id, title, order_index,
        lessons (
          id, title, video_url, duration_seconds, order_index
        )
      )
    `)
        .eq('id', id)
        .order('order_index', { referencedTable: 'modules', ascending: true })
        .order('order_index', { referencedTable: 'modules.lessons', ascending: true })
        .single()

    if (error || !course) notFound()

    return <CourseEditorClient course={course as any} />
}
