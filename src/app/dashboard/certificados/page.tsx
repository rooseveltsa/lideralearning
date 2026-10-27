import Link from "next/link";
import { Award, ArrowRight, BookOpen } from "lucide-react";
import { getUserLearningSnapshot } from "@/lib/actions/lms";

export default async function CertificadosPage() {
  const { courses } = await getUserLearningSnapshot();
  const completed = courses.filter(
    (c) => c.totalLessons > 0 && c.completedLessons === c.totalLessons,
  );
  const pending = courses.filter((c) => !completed.includes(c));
  return (
    <div className="learning-container space-y-8">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-learning-accent">
          Meu desenvolvimento
        </p>
        <h1 className="text-3xl font-semibold text-learning-text">
          Certificados
        </h1>
        <p className="mt-3 text-sm text-learning-muted">
          Conclua todas as aulas de um treinamento para solicitar seu
          certificado.
        </p>
      </div>
      <section aria-labelledby="completed-certificates">
        <h2
          id="completed-certificates"
          className="mb-5 text-lg font-semibold text-learning-text"
        >
          Treinamentos concluídos ({completed.length})
        </h2>
        {completed.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {completed.map((c) => (
              <article
                key={c.enrollmentId}
                className="rounded-xl border border-learning-border bg-learning-panel p-6"
              >
                <Award className="size-8 text-learning-success" />
                <h3 className="mt-4 font-semibold text-learning-text">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-learning-muted">
                  {c.completedLessons} aulas concluídas
                </p>
                <Link
                  href={`/dashboard/certificado/${c.courseId}`}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-learning-accent"
                >
                  Acessar certificado
                  <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-learning-border bg-learning-panel p-7">
            <Award className="size-8 text-learning-muted" />
            <p className="mt-4 font-medium text-learning-text">
              Seu primeiro certificado começa com a próxima aula.
            </p>
            <p className="mt-2 text-sm text-learning-muted">
              Os treinamentos concluídos aparecerão aqui.
            </p>
            <Link href="/dashboard/cursos" className="learning-button mt-5">
              Ir para meus treinamentos
            </Link>
          </div>
        )}
      </section>
      {pending.length ? (
        <section>
          <h2 className="mb-5 text-lg font-semibold text-learning-text">
            A caminho do certificado
          </h2>
          <div className="divide-y divide-learning-border rounded-xl border border-learning-border">
            {pending.map((c) => (
              <div
                key={c.enrollmentId}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="size-5 shrink-0 text-learning-muted" />
                  <div>
                    <h3 className="text-sm font-medium text-learning-text">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-xs text-learning-muted">
                      {c.totalLessons > 0
                        ? `${c.totalLessons - c.completedLessons} aulas restantes · ${c.progressPercent}% concluído`
                        : "Aulas ainda não disponibilizadas"}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/cursos/${c.courseId}`}
                  className="inline-flex min-h-11 items-center gap-2 text-sm text-learning-accent"
                >
                  Ver treinamento
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
