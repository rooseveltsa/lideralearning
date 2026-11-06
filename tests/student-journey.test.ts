import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { safeInternalPath } from '../src/lib/auth/safe-redirect'
import {
  DEMO_COURSE_ID,
  DEMO_COURSE_PRICE,
  DEMO_COURSE_TITLE,
  OFFICIAL_COURSE_ID,
  OFFICIAL_COURSE_PRICE,
  OFFICIAL_COURSE_TITLE,
  isDemoCatalogCourse,
  isPlaceholderVideoUrl,
} from '../src/lib/content/catalog'
import { outlineFromFlat } from '../src/lib/content/public-course'
import { allLessonsCompleted } from '../src/lib/content/progress'

const migration = readFileSync(
  new URL('../supabase/migrations/20261105150000_enable_rls_and_align_catalog.sql', import.meta.url),
  'utf8',
)

test('catálogo distingue demo de R$ 997 e programa oficial de R$ 3.330', () => {
  assert.equal(DEMO_COURSE_PRICE, 997)
  assert.equal(OFFICIAL_COURSE_PRICE, 3330)
  assert.equal(isDemoCatalogCourse({ id: DEMO_COURSE_ID, title: 'outro' }), true)
  assert.equal(isDemoCatalogCourse({ id: 'x', title: DEMO_COURSE_TITLE }), true)
  assert.equal(isDemoCatalogCourse({ id: OFFICIAL_COURSE_ID, title: OFFICIAL_COURSE_TITLE }), false)
})

test('vídeo Big Buck Bunny é placeholder e URL real não é', () => {
  assert.equal(
    isPlaceholderVideoUrl('https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4'),
    true,
  )
  assert.equal(isPlaceholderVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), false)
  assert.equal(isPlaceholderVideoUrl(null), false)
})

test('ementa pública agrupa módulos e ignora aula sem id', () => {
  const modules = outlineFromFlat([
    {
      module_id: 'm2',
      module_title: 'Segundo',
      module_order: 2,
      lesson_id: null,
      lesson_title: null,
      duration_seconds: null,
      lesson_order: null,
    },
    {
      module_id: 'm1',
      module_title: 'Primeiro',
      module_order: 1,
      lesson_id: 'l2',
      lesson_title: 'Aula B',
      duration_seconds: 120,
      lesson_order: 2,
    },
    {
      module_id: 'm1',
      module_title: 'Primeiro',
      module_order: 1,
      lesson_id: 'l1',
      lesson_title: 'Aula A',
      duration_seconds: 60,
      lesson_order: 1,
    },
  ])

  assert.deepEqual(
    modules.map((moduleItem) => moduleItem.id),
    ['m1', 'm2'],
  )
  assert.deepEqual(
    modules[0].lessons.map((lesson) => lesson.title),
    ['Aula A', 'Aula B'],
  )
  assert.equal(modules[1].lessons.length, 0)
})

test('certificado exige todas as aulas, e nenhuma aula não emite', () => {
  assert.equal(allLessonsCompleted(['a', 'b'], ['a']), false)
  assert.equal(allLessonsCompleted(['a', 'b'], new Set(['b', 'a'])), true)
  assert.equal(allLessonsCompleted([], ['a']), false)
})

test('redirect pós-login só aceita caminho interno', () => {
  assert.equal(safeInternalPath('/curso/abc'), '/curso/abc')
  assert.equal(safeInternalPath('/auth/login?redirect=/dashboard'), '/auth/login?redirect=/dashboard')
  assert.equal(safeInternalPath('https://evil.example/phish'), null)
  assert.equal(safeInternalPath('//evil.example'), null)
  assert.equal(safeInternalPath('/\\evil'), null)
  assert.equal(safeInternalPath('dashboard'), null)
})

test('migração liga RLS, corrige a view empresas e alinha o catálogo sem inventar preço', () => {
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/)
  assert.match(migration, /security_invoker = true/)
  assert.match(migration, /published_course_outline/)
  assert.match(migration, new RegExp(OFFICIAL_COURSE_ID))
  assert.match(migration, /3330\.00/)
  assert.match(migration, new RegExp(DEMO_COURSE_ID))
  assert.match(migration, /is_published = false/)
  assert.match(migration, /big_buck_bunny/)
  assert.doesNotMatch(migration, /^\s*drop table/im)
})
