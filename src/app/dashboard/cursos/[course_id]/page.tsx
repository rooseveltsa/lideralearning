import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  Circle,
  PlayCircle,
} from "lucide-react";
import { getInitialAssessment } from "@/lib/actions/assessment";
import { getCourseDetails } from "@/lib/actions/lms";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course_id: string }>;
}) {
  const { course_id } = await params;
  const data = await getCourseDetails(course_id);
  if (!data) notFound();
  const { course, progress, enrollmentId } = data;
  const assessment = await getInitialAssessment(enrollmentId);
  if (!assessment) redirect(`/dashboard/cursos/${course_id}/avaliacao-inicial`);
  const modules = course.modules
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .map((m) => ({
      ...m,
      lessons: m.lessons.slice().sort((a, b) => a.order_index - b.order_index),
    }));
  const lessons = modules.flatMap((m) => m.lessons);
  const completed = new Set(
    progress.filter((p) => p.is_completed).map((p) => p.lesson_id),
  );
  const doneCount = lessons.filter((l) => completed.has(l.id)).length;
  const percent = lessons.length
    ? Math.round((doneCount / lessons.length) * 100)
    : 0;
  const next = lessons.find((l) => !completed.has(l.id)) ?? lessons[0];
  const duration = lessons.reduce((sum, l) => sum + l.duration_seconds, 0);
  return (
    <div className="learning-container space-y-7">
      <Link
        href="/dashboard/cursos"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-learning-muted"
      >
        <ChevronLeft className="size-4" />
        Meus treinamentos
      </Link>
      <section className="rounded-xl border border-learning-border bg-learning-panel p-6 md:p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-learning-accent">
          Treinamento Lidera
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-learning-text">
          {course.title}
        </h1>
        {course.description ? (
          <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-learning-muted">
            {course.description}
          </p>
        ) : null}
        <p className="mt-5 text-sm text-learning-muted">
          {modules.length} módulos · {lessons.length} aulas
          {duration > 0 ? ` · ${Math.ceil(duration / 60)} min de conteúdo` : ""}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <progress
            value={percent}
            max={100}
            aria-label="Progresso do treinamento"
            className="h-2 w-full max-w-sm accent-learning-accent"
          />
          <span className="text-xs text-learning-muted">
            {doneCount}/{lessons.length} concluídas
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          {next ? (
            <Link
              href={`/dashboard/cursos/${course_id}/aula/${next.id}`}
              className="learning-button"
            >
              <PlayCircle className="size-4" />
              {percent === 100
                ? "Revisar treinamento"
                : progress.length
                  ? "Continuar treinamento"
                  : "Começar treinamento"}
            </Link>
          ) : null}
          <Link
            href={`/dashboard/certificado/${course_id}`}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-learning-accent"
          >
            <Award className="size-4" />
            {percent === 100
              ? "Acessar certificado"
              : "Requisitos do certificado"}
          </Link>
        </div>
      </section>
      <section aria-labelledby="course-content">
        <h2
          id="course-content"
          className="mb-5 text-xl font-semibold text-learning-text"
        >
          Conteúdo do treinamento
        </h2>
        <div className="space-y-4">
          {modules.map((m, i) => (
            <details
              key={m.id}
              open={m.lessons.some((l) => l.id === next?.id)}
              className="group rounded-xl border border-learning-border bg-learning-panel"
            >
              <summary className="min-h-14 cursor-pointer p-5 text-sm font-semibold text-learning-text">
                Módulo {i + 1} — {m.title}
                <span className="ml-3 text-xs font-normal text-learning-muted">
                  {m.lessons.filter((l) => completed.has(l.id)).length}/
                  {m.lessons.length} aulas
                </span>
              </summary>
              <div className="border-t border-learning-border px-3 pb-3">
                {m.lessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/dashboard/cursos/${course_id}/aula/${l.id}`}
                    className="mt-1 flex min-h-14 items-center gap-3 rounded-lg p-3 hover:bg-learning-bg"
                  >
                    {completed.has(l.id) ? (
                      <CheckCircle2 className="size-4 shrink-0 text-learning-success" />
                    ) : (
                      <Circle className="size-4 shrink-0 text-learning-muted" />
                    )}
                    <span className="flex-1 text-sm text-learning-text">
                      {l.title}
                      <span className="mt-1 block text-xs text-learning-muted">
                        {completed.has(l.id) ? "Concluída" : "Não concluída"}
                        {l.duration_seconds > 0
                          ? ` · ${Math.ceil(l.duration_seconds / 60)} min`
                          : ""}
                      </span>
                    </span>
                    <PlayCircle className="size-4 shrink-0 text-learning-accent" />
                  </Link>
                ))}
                {!m.lessons.length ? (
                  <p className="p-3 text-sm text-learning-muted">
                    As aulas deste módulo ainda não foram disponibilizadas.
                  </p>
                ) : null}
              </div>
            </details>
          ))}
          {!modules.length ? (
            <p className="rounded-xl border border-learning-border p-6 text-sm text-learning-muted">
              As aulas deste treinamento estão sendo preparadas. Volte em breve
              para começar.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
