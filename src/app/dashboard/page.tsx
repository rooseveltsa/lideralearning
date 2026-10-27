import Link from "next/link";
import { ArrowRight, Award, BookOpen, CheckCircle2, Play } from "lucide-react";
import { getUserLearningSnapshot } from "@/lib/actions/lms";
import CourseShelfCard from "@/components/dashboard/CourseShelfCard";

export default async function DashboardPage() {
  const snapshot = await getUserLearningSnapshot();
  const courses = snapshot.courses
    .slice()
    .sort(
      (a, b) =>
        new Date(b.lastAccessedAt ?? b.enrolledAt).getTime() -
        new Date(a.lastAccessedAt ?? a.enrolledAt).getTime(),
    );
  const pending = courses.filter(
    (c) => c.totalLessons > 0 && c.completedLessons < c.totalLessons,
  );
  const completed = courses.filter(
    (c) => c.totalLessons > 0 && c.completedLessons === c.totalLessons,
  );
  const next = pending[0];
  return (
    <div className="learning-container space-y-9">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-learning-accent">
          Seu espaço de aprendizagem
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-learning-text">
          Vamos seguir aprendendo?
        </h1>
        <p className="mt-3 text-sm text-learning-muted">
          Seus treinamentos, suas aulas e o próximo passo para colocar em
          prática.
        </p>
      </div>
      {next ? (
        <section
          aria-labelledby="continue-heading"
          className="overflow-hidden rounded-2xl border border-learning-border bg-learning-panel md:grid md:grid-cols-[minmax(0,1fr)_240px]"
        >
          <div className="p-6 md:p-8">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-learning-accent">
              <Play className="size-4" />
              {next.trackedLessons > 0
                ? "Continue de onde parou"
                : "Seu primeiro passo"}
            </p>
            <h2
              id="continue-heading"
              className="mt-4 text-2xl font-semibold text-learning-text"
            >
              {next.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-learning-muted">
              {next.completedLessons} de {next.totalLessons} aulas concluídas.{" "}
              {next.totalLessons - next.completedLessons === 1
                ? "Falta uma aula para concluir este treinamento."
                : `Faltam ${next.totalLessons - next.completedLessons} aulas para concluir este treinamento.`}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <Link
                href={
                  next.nextLessonId
                    ? `/dashboard/cursos/${next.courseId}/aula/${next.nextLessonId}`
                    : `/dashboard/cursos/${next.courseId}`
                }
                className="learning-button"
              >
                <Play className="size-4" />
                {next.trackedLessons > 0
                  ? "Continuar treinamento"
                  : "Começar treinamento"}
              </Link>
              <Link
                href={`/dashboard/cursos/${next.courseId}`}
                className="inline-flex min-h-11 items-center gap-2 text-sm text-learning-muted hover:text-learning-text"
              >
                Ver todas as aulas
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center border-t border-learning-border bg-learning-bg/40 p-6 md:border-l md:border-t-0 md:p-8">
            <BookOpen className="mb-5 size-7 text-learning-accent" />
            <p className="text-4xl font-semibold tabular-nums text-learning-text">
              {next.progressPercent}
              <span className="text-lg text-learning-muted">%</span>
            </p>
            <p className="mt-2 text-xs text-learning-muted">
              do treinamento concluído
            </p>
            <progress
              aria-label="Progresso do treinamento"
              value={next.progressPercent}
              max={100}
              className="mt-5 h-1.5 w-full accent-learning-accent"
            />
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-learning-border bg-learning-panel p-7">
          <BookOpen className="size-8 text-learning-accent" />
          <h2 className="mt-4 text-xl font-semibold text-learning-text">
            {completed.length
              ? "Treinamentos concluídos. Conhecimento para aplicar."
              : courses.length
                ? "Seu conteúdo está sendo preparado"
                : "Seu aprendizado começa aqui"}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-learning-muted">
            {completed.length
              ? "Revise as aulas quando precisar e acesse seus certificados."
              : courses.length
                ? "Você já tem acesso à biblioteca. As aulas aparecerão assim que forem disponibilizadas."
                : "Ainda não há treinamentos na sua conta. Conheça o catálogo ou verifique se entrou com o e-mail usado na matrícula."}
          </p>
          <Link
            href={
              completed.length
                ? "/dashboard/certificados"
                : courses.length
                  ? "/dashboard/cursos"
                  : "/cursos"
            }
            className="learning-button mt-5"
          >
            {completed.length
              ? "Acessar certificados"
              : courses.length
                ? "Meus treinamentos"
                : "Conhecer treinamentos"}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      )}
      <dl className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Treinamentos em andamento",
            value: pending.filter((c) => c.trackedLessons > 0).length,
            icon: BookOpen,
          },
          {
            label: "Aulas concluídas",
            value: snapshot.totals.completedLessons,
            icon: CheckCircle2,
          },
          {
            label: "Treinamentos concluídos",
            value: completed.length,
            icon: Award,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl border border-learning-border px-5 py-4"
          >
            <Icon className="size-5 text-learning-muted" />
            <div>
              <dd className="text-2xl font-semibold tabular-nums text-learning-text">
                {value}
              </dd>
              <dt className="mt-1 text-xs text-learning-muted">{label}</dt>
            </div>
          </div>
        ))}
      </dl>
      {courses.length ? (
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-learning-text">
              Meus treinamentos
            </h2>
            <Link
              href="/dashboard/cursos"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-learning-accent"
            >
              Ver todos ({courses.length})<ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {courses.slice(0, 3).map((course) => (
              <CourseShelfCard key={course.enrollmentId} course={course} />
            ))}
          </div>
        </section>
      ) : null}
      <aside className="flex flex-wrap items-center justify-between gap-4 border-t border-learning-border pt-6">
        <div>
          <p className="text-sm font-medium text-learning-text">
            Aprender é também colocar em prática.
          </p>
          <p className="mt-1 text-sm text-learning-muted">
            Ao concluir uma aula, escolha uma ação para experimentar no seu
            trabalho.
          </p>
        </div>
        <Link
          href="/contato"
          className="inline-flex min-h-11 items-center text-sm text-learning-accent"
        >
          Precisa de ajuda? →
        </Link>
      </aside>
    </div>
  );
}
