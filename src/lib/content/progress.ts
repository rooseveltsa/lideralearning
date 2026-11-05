/** Certificado só sai quando existe pelo menos uma aula e todas estão concluídas. */
export function allLessonsCompleted(lessonIds: readonly string[], completedIds: Iterable<string>) {
  if (lessonIds.length === 0) return false
  const done = completedIds instanceof Set ? completedIds : new Set(completedIds)
  return lessonIds.every((id) => done.has(id))
}
