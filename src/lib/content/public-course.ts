import type { SupabaseClient } from '@supabase/supabase-js'

import { createAdminClient } from '@/lib/supabase/service'

export type PublicLesson = {
  id: string
  title: string
  duration_seconds: number
  order_index: number
}

export type PublicModule = {
  id: string
  title: string
  order_index: number
  lessons: PublicLesson[]
}

export type FlatOutlineRow = {
  module_id: string
  module_title: string
  module_order: number | null
  lesson_id: string | null
  lesson_title: string | null
  duration_seconds: number | null
  lesson_order: number | null
}

type NestedLesson = {
  id: string
  title: string
  duration_seconds?: number | null
  order_index?: number | null
}

type NestedModule = {
  id: string
  title: string
  order_index?: number | null
  lessons?: NestedLesson[] | null
}

export function serviceRoleConfigured() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return Boolean(key && key.length > 20 && !key.includes('dummy'))
}

export function outlineFromFlat(rows: FlatOutlineRow[] | null | undefined): PublicModule[] {
  if (!Array.isArray(rows)) return []
  const modules = new Map<string, PublicModule>()

  for (const row of rows) {
    if (!row?.module_id) continue
    let moduleItem = modules.get(row.module_id)
    if (!moduleItem) {
      moduleItem = {
        id: row.module_id,
        title: row.module_title,
        order_index: row.module_order ?? 0,
        lessons: [],
      }
      modules.set(row.module_id, moduleItem)
    }
    if (row.lesson_id && row.lesson_title) {
      moduleItem.lessons.push({
        id: row.lesson_id,
        title: row.lesson_title,
        duration_seconds: row.duration_seconds ?? 0,
        order_index: row.lesson_order ?? 0,
      })
    }
  }

  return sortModules([...modules.values()])
}

export function outlineFromNested(modules: NestedModule[] | null | undefined): PublicModule[] {
  if (!Array.isArray(modules)) return []
  return sortModules(
    modules.map((moduleItem) => ({
      id: moduleItem.id,
      title: moduleItem.title,
      order_index: moduleItem.order_index ?? 0,
      lessons: (moduleItem.lessons ?? []).map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        duration_seconds: lesson.duration_seconds ?? 0,
        order_index: lesson.order_index ?? 0,
      })),
    })),
  )
}

function sortModules(modules: PublicModule[]) {
  return modules
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .map((moduleItem) => ({
      ...moduleItem,
      lessons: moduleItem.lessons.slice().sort((a, b) => a.order_index - b.order_index),
    }))
}

/**
 * Ementa pública sem expor video_url.
 * A policy de lessons só libera a linha inteira para quem está matriculado,
 * então o anon via PostgREST via 0 aulas. A função SQL (após a migração) ou o
 * service role no servidor devolvem só título e duração.
 */
export async function loadPublishedOutline(
  supabase: SupabaseClient,
  courseId: string,
): Promise<PublicModule[]> {
  const rpc = await supabase.rpc('published_course_outline', { p_course_id: courseId })
  if (!rpc.error && Array.isArray(rpc.data)) {
    return outlineFromFlat(rpc.data as FlatOutlineRow[])
  }

  if (serviceRoleConfigured()) {
    const admin = createAdminClient()
    const nested = await admin
      .from('modules')
      .select('id, title, order_index, lessons(id, title, duration_seconds, order_index)')
      .eq('course_id', courseId)
    if (!nested.error && Array.isArray(nested.data)) {
      return outlineFromNested(nested.data as NestedModule[])
    }
  }

  const fallback = await supabase
    .from('modules')
    .select('id, title, order_index, lessons(id, title, duration_seconds, order_index)')
    .eq('course_id', courseId)

  if (!fallback.error && Array.isArray(fallback.data)) {
    return outlineFromNested(fallback.data as NestedModule[])
  }

  return []
}
