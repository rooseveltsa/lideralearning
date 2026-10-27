import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Play } from "lucide-react";
import type { UserCourseProgressSummary } from "@/lib/actions/lms";

export default function CourseShelfCard({
  course,
}: {
  course: UserCourseProgressSummary;
  tone?: "dark" | "light";
}) {
  const done =
    course.totalLessons > 0 && course.completedLessons === course.totalLessons;
  const started = course.trackedLessons > 0;
  const href =
    !done && course.nextLessonId
      ? `/dashboard/cursos/${course.courseId}/aula/${course.nextLessonId}`
      : `/dashboard/cursos/${course.courseId}`;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-learning-border bg-learning-panel">
      <Link
        href={href}
        className="relative block aspect-video overflow-hidden border-b border-learning-border bg-learning-bg"
        aria-label={`Abrir ${course.title}`}
      >
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col justify-between p-6">
            <Image src="/brand/lidera-mark.png" alt="" width={40} height={28} className="h-auto w-10" />
            <span className="line-clamp-2 max-w-64 text-xl font-semibold text-learning-text">
              {course.title}
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-learning-muted">
              LIDERA TREINAMENTOS
            </span>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-md border border-learning-border bg-learning-bg px-2.5 py-1 text-xs font-medium text-learning-text">
          {done ? "Concluído" : started ? "Em andamento" : "Não iniciado"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-learning-text">
          <Link href={href}>{course.title}</Link>
        </h3>
        <p className="mt-2 text-xs text-learning-muted">
          {course.totalLessons > 0
            ? `${course.completedLessons} de ${course.totalLessons} aulas concluídas`
            : "Conteúdo em preparação"}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <progress
            aria-label={`Progresso de ${course.title}`}
            value={course.progressPercent}
            max={100}
            className="h-1.5 w-full overflow-hidden rounded-full bg-learning-border accent-learning-accent [&::-webkit-progress-bar]:bg-learning-border [&::-webkit-progress-value]:bg-learning-accent [&::-moz-progress-bar]:bg-learning-accent"
          />
          <span className="text-xs tabular-nums text-learning-muted">
            {course.progressPercent}%
          </span>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <Link
            href={href}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-learning-accent"
          >
            {done ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
            {done
              ? "Revisar treinamento"
              : started
                ? "Continuar"
                : course.totalLessons > 0
                  ? "Começar treinamento"
                  : "Ver treinamento"}
          </Link>
          {done ? (
            <Link
              href={`/dashboard/certificado/${course.courseId}`}
              className="inline-flex min-h-11 items-center gap-1 text-xs text-learning-success"
            >
              Certificado
              <ArrowUpRight className="size-3.5" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
