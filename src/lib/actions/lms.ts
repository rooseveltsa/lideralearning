'use server'

import { createClient } from '@/lib/supabase/server'
import { Course, Lesson, Module, Progress } from '@/types/database'

type CourseWithModules = Course & {
  modules: Array<Module & { lessons: Lesson[] }>
}

type EnrollmentWithCourse = {
  id: string
  course_id: string
  enrolled_at: string
  courses:
    | Pick<Course, 'id' | 'title' | 'description' | 'thumbnail_url' | 'price' | 'is_published'>
    | Array<Pick<Course, 'id' | 'title' | 'description' | 'thumbnail_url' | 'price' | 'is_published'>>
    | null
}

export type CourseDetails = {
  course: CourseWithModules
  progress: Progress[]
  enrollmentId: string
}

export async function getUserCourses() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

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

  const typedData = data as unknown as EnrollmentWithCourse[]

  return typedData
    .map((enrollment) => {
      const course = normalizeEnrollmentCourse(enrollment.courses)
      if (!course) return null
      return {
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolled_at,
        course,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

export async function getCourseDetails(courseId: string): Promise<CourseDetails | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .single()

  if (!enrollment) return null

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

  const typedCourse = course as CourseWithModules

  typedCourse.modules.sort((a, b) => a.order_index - b.order_index)
  typedCourse.modules.forEach((moduleItem) => {
    moduleItem.lessons.sort((a, b) => a.order_index - b.order_index)
  })

  const { data: progress } = await supabase.from('progress').select('*').eq('enrollment_id', enrollment.id)

  return {
    course: typedCourse,
    progress: (progress as Progress[]) || [],
    enrollmentId: enrollment.id,
  }
}

export async function markLessonCompleted(enrollmentId: string, lessonId: string, isCompleted: boolean) {
  const supabase = await createClient()

  const { error } = await supabase.from('progress').upsert(
    {
      enrollment_id: enrollmentId,
      lesson_id: lessonId,
      is_completed: isCompleted,
      last_accessed_at: new Date().toISOString(),
    },
    { onConflict: 'enrollment_id, lesson_id' }
  )

  if (error) {
    console.error('Error updating progress:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function markLessonAccess(enrollmentId: string, lessonId: string) {
  const supabase = await createClient()

  const { data: existingProgress, error: fetchError } = await supabase
    .from('progress')
    .select('id')
    .eq('enrollment_id', enrollmentId)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  if (fetchError) {
    console.error('Error checking lesson access:', fetchError)
    return { success: false, error: fetchError.message }
  }

  if (existingProgress?.id) {
    const { error: updateError } = await supabase
      .from('progress')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', existingProgress.id)

    if (updateError) {
      console.error('Error updating lesson access:', updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true }
  }

  const { error: insertError } = await supabase.from('progress').insert({
    enrollment_id: enrollmentId,
    lesson_id: lessonId,
    is_completed: false,
    watch_time_seconds: 0,
    last_accessed_at: new Date().toISOString(),
  })

  if (insertError) {
    console.error('Error creating lesson access:', insertError)
    return { success: false, error: insertError.message }
  }

  return { success: true }
}

type ModuleRow = Pick<Module, 'id' | 'course_id' | 'order_index'>
type LessonRow = Pick<Lesson, 'id' | 'module_id' | 'order_index'>
type ProgressRow = Pick<Progress, 'enrollment_id' | 'lesson_id' | 'is_completed' | 'last_accessed_at'>

export type UserCourseProgressSummary = {
  enrollmentId: string
  courseId: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  enrolledAt: string
  trackedLessons: number
  completedLessons: number
  totalLessons: number
  progressPercent: number
  lastAccessedAt: string | null
  nextLessonId: string | null
}

export type UserLearningSnapshot = {
  courses: UserCourseProgressSummary[]
  totals: {
    activeCourses: number
    trackedLessons: number
    completedLessons: number
    totalLessons: number
    overallPercent: number
  }
  activityDaysLast30: number
  lastActivityAt: string | null
}

const EMPTY_SNAPSHOT: UserLearningSnapshot = {
  courses: [],
  totals: {
    activeCourses: 0,
    trackedLessons: 0,
    completedLessons: 0,
    totalLessons: 0,
    overallPercent: 0,
  },
  activityDaysLast30: 0,
  lastActivityAt: null,
}

export async function getUserLearningSnapshot(): Promise<UserLearningSnapshot> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return EMPTY_SNAPSHOT

  const { data: enrollmentData, error: enrollmentError } = await supabase
    .from('enrollments')
    .select(
      `
      id,
      course_id,
      enrolled_at,
      courses (
        id,
        title,
        description,
        thumbnail_url,
        price,
        is_published
      )
    `
    )
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (enrollmentError || !Array.isArray(enrollmentData) || enrollmentData.length === 0) {
    if (enrollmentError) {
      console.error('Error fetching learning snapshot enrollments:', enrollmentError)
    }
    return EMPTY_SNAPSHOT
  }

  const enrollments = (enrollmentData as unknown as EnrollmentWithCourse[])
    .map((enrollment) => {
      const course = normalizeEnrollmentCourse(enrollment.courses)
      if (!course) return null
      return {
        enrollmentId: enrollment.id,
        courseId: enrollment.course_id,
        enrolledAt: enrollment.enrolled_at,
        course,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  if (enrollments.length === 0) return EMPTY_SNAPSHOT

  const enrollmentIds = enrollments.map((item) => item.enrollmentId)
  const courseIds = enrollments.map((item) => item.courseId)

  const { data: progressData, error: progressError } = await supabase
    .from('progress')
    .select('enrollment_id, lesson_id, is_completed, last_accessed_at')
    .in('enrollment_id', enrollmentIds)

  if (progressError) {
    console.error('Error fetching learning snapshot progress:', progressError)
  }

  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select('id, course_id, order_index')
    .in('course_id', courseIds)

  if (moduleError) {
    console.error('Error fetching learning snapshot modules:', moduleError)
  }

  const modules = (Array.isArray(moduleData) ? moduleData : []) as ModuleRow[]
  const moduleIds = modules.map((item) => item.id)

  let lessons: LessonRow[] = []
  if (moduleIds.length > 0) {
    const { data: lessonData, error: lessonError } = await supabase
      .from('lessons')
      .select('id, module_id, order_index')
      .in('module_id', moduleIds)

    if (lessonError) {
      console.error('Error fetching learning snapshot lessons:', lessonError)
    } else {
      lessons = (Array.isArray(lessonData) ? lessonData : []) as LessonRow[]
    }
  }

  const progressRows = (Array.isArray(progressData) ? progressData : []) as ProgressRow[]

  const progressByEnrollment = new Map<string, ProgressRow[]>()
  progressRows.forEach((row) => {
    const list = progressByEnrollment.get(row.enrollment_id) ?? []
    list.push(row)
    progressByEnrollment.set(row.enrollment_id, list)
  })

  const modulesByCourse = new Map<string, ModuleRow[]>()
  modules.forEach((row) => {
    const list = modulesByCourse.get(row.course_id) ?? []
    list.push(row)
    modulesByCourse.set(row.course_id, list)
  })
  modulesByCourse.forEach((list) => list.sort((a, b) => a.order_index - b.order_index))

  const lessonsByModule = new Map<string, LessonRow[]>()
  lessons.forEach((row) => {
    const list = lessonsByModule.get(row.module_id) ?? []
    list.push(row)
    lessonsByModule.set(row.module_id, list)
  })
  lessonsByModule.forEach((list) => list.sort((a, b) => a.order_index - b.order_index))

  const orderedLessonIdsByCourse = new Map<string, string[]>()
  modulesByCourse.forEach((moduleList, courseId) => {
    const orderedLessonIds: string[] = []
    moduleList.forEach((moduleItem) => {
      const lessonList = lessonsByModule.get(moduleItem.id) ?? []
      lessonList.forEach((lessonItem) => orderedLessonIds.push(lessonItem.id))
    })
    orderedLessonIdsByCourse.set(courseId, orderedLessonIds)
  })

  const courses: UserCourseProgressSummary[] = enrollments.map((enrollment) => {
    const courseProgress = progressByEnrollment.get(enrollment.enrollmentId) ?? []
    const completedSet = new Set(courseProgress.filter((item) => item.is_completed).map((item) => item.lesson_id))

    const orderedLessonIds = orderedLessonIdsByCourse.get(enrollment.courseId) ?? []
    const totalLessons = orderedLessonIds.length
    const completedLessons = orderedLessonIds.filter((id) => completedSet.has(id)).length
    const trackedLessons = courseProgress.length

    const nextLessonId = orderedLessonIds.find((id) => !completedSet.has(id)) ?? orderedLessonIds[0] ?? null
    const lastAccessedAt =
      courseProgress
        .slice()
        .sort((a, b) => new Date(b.last_accessed_at).getTime() - new Date(a.last_accessed_at).getTime())[0]
        ?.last_accessed_at ?? null

    const progressPercent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : completedLessons > 0 ? 100 : 0

    return {
      enrollmentId: enrollment.enrollmentId,
      courseId: enrollment.courseId,
      title: enrollment.course.title,
      description: enrollment.course.description,
      thumbnailUrl: enrollment.course.thumbnail_url,
      enrolledAt: enrollment.enrolledAt,
      trackedLessons,
      completedLessons,
      totalLessons,
      progressPercent,
      lastAccessedAt,
      nextLessonId,
    }
  })

  const completedLessons = courses.reduce((acc, course) => acc + course.completedLessons, 0)
  const trackedLessons = courses.reduce((acc, course) => acc + course.trackedLessons, 0)
  const totalLessons = courses.reduce((acc, course) => acc + course.totalLessons, 0)
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  const activeDayKeys = new Set(
    progressRows
      .filter((row) => {
        const ts = new Date(row.last_accessed_at).getTime()
        return Number.isFinite(ts) && ts >= cutoff
      })
      .map((row) => row.last_accessed_at.slice(0, 10))
  )

  const lastActivityAt =
    progressRows
      .slice()
      .sort((a, b) => new Date(b.last_accessed_at).getTime() - new Date(a.last_accessed_at).getTime())[0]
      ?.last_accessed_at ?? null

  return {
    courses,
    totals: {
      activeCourses: courses.length,
      trackedLessons,
      completedLessons,
      totalLessons,
      overallPercent,
    },
    activityDaysLast30: activeDayKeys.size,
    lastActivityAt,
  }
}

function normalizeEnrollmentCourse(
  course: EnrollmentWithCourse['courses']
): Pick<Course, 'id' | 'title' | 'description' | 'thumbnail_url' | 'price' | 'is_published'> | null {
  if (!course) return null
  if (Array.isArray(course)) return course[0] ?? null
  return course
}
