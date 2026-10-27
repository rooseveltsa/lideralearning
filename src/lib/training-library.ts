export type TrainingSummary = {
  title: string;
  totalLessons: number;
  completedLessons: number;
  trackedLessons: number;
  enrolledAt: string;
  lastAccessedAt: string | null;
};

export function getTrainingStatus(course: TrainingSummary) {
  if (
    course.totalLessons > 0 &&
    course.completedLessons === course.totalLessons
  )
    return "done";
  return course.trackedLessons > 0 ? "progress" : "new";
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function findTrainings<T extends TrainingSummary>(
  courses: T[],
  query: string,
  filter: string,
  order: string,
): T[] {
  const term = normalize(query.trim());
  return courses
    .filter(
      (course) =>
        (filter === "all" || getTrainingStatus(course) === filter) &&
        normalize(course.title).includes(term),
    )
    .sort((a, b) =>
      order === "title"
        ? a.title.localeCompare(b.title, "pt-BR")
        : new Date(b.lastAccessedAt ?? b.enrolledAt).getTime() -
          new Date(a.lastAccessedAt ?? a.enrolledAt).getTime(),
    );
}
