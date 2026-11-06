/**
 * Identidade do catálogo.
 * Os preços e títulos vêm dos seeds já versionados — não inventar valores.
 * - Demo: docs/database/01_LMS_schema.sql (R$ 997, vídeo Big Buck Bunny)
 * - Oficial: docs/database/13_seed_modules_content.sql (R$ 3.330)
 */

export const DEMO_COURSE_ID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
export const DEMO_COURSE_TITLE = 'Liderança Exponencial'
export const DEMO_COURSE_PRICE = 997

export const OFFICIAL_COURSE_ID = 'c0000001-0000-0000-0000-000000000001'
export const OFFICIAL_COURSE_TITLE = 'Supervisor: Da Operação à Liderança'
export const OFFICIAL_COURSE_PRICE = 3330

export function isDemoCatalogCourse(course: { id?: string | null; title?: string | null }) {
  const title = course.title?.trim()
  return course.id === DEMO_COURSE_ID || title === DEMO_COURSE_TITLE
}

/** Vídeos de teste que não podem ser apresentados como aula oficial. */
export function isPlaceholderVideoUrl(url: string | null | undefined) {
  if (!url) return false
  const value = url.trim().toLowerCase()
  if (!value) return false
  return (
    value.includes('bigbuckbunny') ||
    value.includes('big_buck_bunny') ||
    value.includes('test-videos.co.uk') ||
    value.includes('gtv-videos-bucket')
  )
}
