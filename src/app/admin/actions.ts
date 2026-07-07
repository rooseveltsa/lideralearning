'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function verifyAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const admin = createAdminClient()
    const { data: profile } = await admin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') redirect('/dashboard')

    return { admin, user }
}

// ---------- CURSOS ----------

export async function createCourse(formData: FormData) {
    const { admin } = await verifyAdmin()

    const { data, error } = await admin
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
    const { admin } = await verifyAdmin()

    const { error } = await admin
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
    const { admin } = await verifyAdmin()

    const { error } = await admin
        .from('courses')
        .update({ is_published: publish })
        .eq('id', courseId)

    if (error) return { error: error.message }

    revalidatePath('/admin/cursos')
    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

export async function deleteCourse(courseId: string) {
    const { admin } = await verifyAdmin()

    const { error } = await admin
        .from('courses')
        .delete()
        .eq('id', courseId)

    if (error) return { error: error.message }

    revalidatePath('/admin/cursos')
    redirect('/admin/cursos')
}

// ---------- MÓDULOS ----------

export async function createModule(formData: FormData) {
    const { admin } = await verifyAdmin()
    const courseId = formData.get('course_id') as string

    // Obter próximo order_index
    const { data: existing } = await admin
        .from('modules')
        .select('order_index')
        .eq('course_id', courseId)
        .order('order_index', { ascending: false })
        .limit(1)

    const nextIndex = (existing?.[0]?.order_index ?? 0) + 1

    const { error } = await admin
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

export async function updateModule(moduleId: string, courseId: string, formData: FormData) {
    const { admin } = await verifyAdmin()

    const { error } = await admin
        .from('modules')
        .update({ title: formData.get('title') as string })
        .eq('id', moduleId)

    if (error) return { error: error.message }

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

export async function moveModule(moduleId: string, courseId: string, direction: 'up' | 'down') {
    const { admin } = await verifyAdmin()

    const { data: modules, error: listError } = await admin
        .from('modules')
        .select('id')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

    if (listError || !modules) return { error: listError?.message ?? 'Módulos não encontrados' }

    const index = modules.findIndex((m) => m.id === moduleId)
    const target = direction === 'up' ? index - 1 : index + 1
    if (index === -1 || target < 0 || target >= modules.length) return { success: true }

    const reordered = [...modules]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]

    for (let i = 0; i < reordered.length; i++) {
        const { error } = await admin.from('modules').update({ order_index: i + 1 }).eq('id', reordered[i].id)
        if (error) return { error: error.message }
    }

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

export async function deleteModule(moduleId: string, courseId: string) {
    const { admin } = await verifyAdmin()

    const { error } = await admin.from('modules').delete().eq('id', moduleId)

    if (error) return { error: error.message }

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

// ---------- AULAS ----------

export async function createLesson(formData: FormData) {
    const { admin } = await verifyAdmin()
    const moduleId = formData.get('module_id') as string
    const courseId = formData.get('course_id') as string

    const { data: existing } = await admin
        .from('lessons')
        .select('order_index')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: false })
        .limit(1)

    const nextIndex = (existing?.[0]?.order_index ?? 0) + 1

    const { error } = await admin
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

export async function updateLesson(lessonId: string, courseId: string, formData: FormData) {
    const { admin } = await verifyAdmin()

    const { error } = await admin
        .from('lessons')
        .update({
            title: formData.get('title') as string,
            video_url: (formData.get('video_url') as string) || null,
            content_text: (formData.get('content_text') as string) || null,
            duration_seconds: parseInt(formData.get('duration_seconds') as string) || 0,
        })
        .eq('id', lessonId)

    if (error) return { error: error.message }

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

export async function moveLesson(lessonId: string, moduleId: string, courseId: string, direction: 'up' | 'down') {
    const { admin } = await verifyAdmin()

    const { data: lessons, error: listError } = await admin
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true })

    if (listError || !lessons) return { error: listError?.message ?? 'Aulas não encontradas' }

    const index = lessons.findIndex((l) => l.id === lessonId)
    const target = direction === 'up' ? index - 1 : index + 1
    if (index === -1 || target < 0 || target >= lessons.length) return { success: true }

    const reordered = [...lessons]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]

    for (let i = 0; i < reordered.length; i++) {
        const { error } = await admin.from('lessons').update({ order_index: i + 1 }).eq('id', reordered[i].id)
        if (error) return { error: error.message }
    }

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}

export async function deleteLesson(lessonId: string, courseId: string) {
    const { admin } = await verifyAdmin()

    const { error } = await admin.from('lessons').delete().eq('id', lessonId)

    if (error) return { error: error.message }

    revalidatePath(`/admin/cursos/${courseId}`)
    return { success: true }
}
