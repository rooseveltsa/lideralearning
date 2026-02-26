'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function verifyAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') redirect('/dashboard')

    return { supabase, user }
}

// ---------- CURSOS ----------

export async function createCourse(formData: FormData) {
    const { supabase } = await verifyAdmin()

    const { data, error } = await supabase
        .from('courses')
        .insert({
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string) || 0,
            thumbnail_url: formData.get('thumbnail_url') as string || null,
            is_published: false,
        })
        .select('id')
        .single()

    if (error) return { error: error.message }

    revalidatePath('/admin/cursos')
    redirect(`/admin/cursos/${data.id}`)
}

export async function updateCourse(courseId: string, formData: FormData) {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase
        .from('courses')
        .update({
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string) || 0,
            thumbnail_url: formData.get('thumbnail_url') as string || null,
        })
        .eq('id', courseId)

    if (error) return { error: error.message }

    revalidatePath('/admin/cursos')
    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

export async function publishCourse(courseId: string, publish: boolean) {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase
        .from('courses')
        .update({ is_published: publish })
        .eq('id', courseId)

    if (error) return { error: error.message }

    revalidatePath('/admin/cursos')
    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

export async function deleteCourse(courseId: string) {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

    if (error) return { error: error.message }

    revalidatePath('/admin/cursos')
    redirect('/admin/cursos')
}

// ---------- MÓDULOS ----------

export async function createModule(formData: FormData) {
    const { supabase } = await verifyAdmin()
    const courseId = formData.get('course_id') as string

    // Obter próximo order_index
    const { data: existing } = await supabase
        .from('modules')
        .select('order_index')
        .eq('course_id', courseId)
        .order('order_index', { ascending: false })
        .limit(1)

    const nextIndex = (existing?.[0]?.order_index ?? 0) + 1

    const { error } = await supabase
        .from('modules')
        .insert({
            course_id: courseId,
            title: formData.get('title') as string,
            order_index: nextIndex,
        })

    if (error) return { error: error.message }

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

export async function deleteModule(moduleId: string, courseId: string) {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase.from('modules').delete().eq('id', moduleId)

    if (error) return { error: error.message }

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

// ---------- AULAS ----------

export async function createLesson(formData: FormData) {
    const { supabase } = await verifyAdmin()
    const moduleId = formData.get('module_id') as string
    const courseId = formData.get('course_id') as string

    const { data: existing } = await supabase
        .from('lessons')
        .select('order_index')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: false })
        .limit(1)

    const nextIndex = (existing?.[0]?.order_index ?? 0) + 1

    const { error } = await supabase
        .from('lessons')
        .insert({
            module_id: moduleId,
            title: formData.get('title') as string,
            video_url: formData.get('video_url') as string || null,
            content_text: formData.get('content_text') as string || null,
            duration_seconds: parseInt(formData.get('duration_seconds') as string) || 0,
            order_index: nextIndex,
        })

    if (error) return { error: error.message }

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

export async function deleteLesson(lessonId: string, courseId: string) {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase.from('lessons').delete().eq('id', lessonId)

    if (error) return { error: error.message }

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}
