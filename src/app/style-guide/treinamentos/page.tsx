export const metadata = { robots: { index: false, follow: false } };

import type { UserCourseProgressSummary } from "@/lib/actions/lms";
import TrainingLibrary from "@/components/dashboard/TrainingLibrary";
import SidebarNav from "@/components/dashboard/SidebarNav";
import MobileNavigation from "@/components/dashboard/MobileNavigation";

const examples: UserCourseProgressSummary[] = [
  "Comunicação e feedback",
  "Gestão de equipes",
  "Fundamentos da liderança",
].map((title, i) => ({
  enrollmentId: `example-${i}`,
  courseId: `example-${i}`,
  title: `${title} (exemplo)`,
  description: null,
  thumbnailUrl: null,
  enrolledAt: "2026-01-01T12:00:00Z",
  trackedLessons: i === 1 ? 0 : i === 2 ? 8 : 3,
  completedLessons: i === 2 ? 8 : i === 1 ? 0 : 2,
  totalLessons: 8,
  progressPercent: i === 2 ? 100 : i === 1 ? 0 : 25,
  lastAccessedAt: null,
  nextLessonId: null,
}));

export default function TrainingStyleGuide() {
  return (
    <div className="learning-shell min-h-screen bg-learning-bg text-learning-text md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden border-r border-learning-border md:block">
        <p className="border-b border-learning-border px-7 py-6 text-2xl font-bold">
          Lidera<span className="text-learning-accent">.</span>
        </p>
        <SidebarNav />
      </aside>
      <div className="min-w-0">
        <header className="relative flex h-20 items-center gap-4 border-b border-learning-border px-5">
          <MobileNavigation isAdmin={false} role="student" />
          <p className="text-sm text-learning-muted">
            Guia visual · Área de treinamentos
          </p>
        </header>
        <main className="learning-container space-y-7">
          <div className="rounded-lg border border-learning-border p-4 text-sm text-learning-muted">
            Prévia com dados de exemplo para validar componentes. Estes
            treinamentos não são matrículas e seus links não abrem aulas reais.
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-learning-accent">
              Minha aprendizagem
            </p>
            <h1 className="text-3xl font-semibold">Meus treinamentos</h1>
            <p className="mt-3 text-sm text-learning-muted">
              Busque, filtre e retome seus treinamentos.
            </p>
          </div>
          <TrainingLibrary courses={examples} />
        </main>
      </div>
    </div>
  );
}
