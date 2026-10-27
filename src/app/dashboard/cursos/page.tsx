import { CheckCircle2 } from "lucide-react";
import { getUserLearningSnapshot } from "@/lib/actions/lms";
import TrainingLibrary from "@/components/dashboard/TrainingLibrary";

export default async function CursosPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const snapshot = await getUserLearningSnapshot();
  const { success } = await searchParams;
  return (
    <div className="learning-container space-y-7">
      {success === "true" ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-learning-border bg-learning-panel p-4 text-sm text-learning-text"
        >
          <CheckCircle2 className="size-5 shrink-0 text-learning-success" />
          <p>
            Pagamento recebido. Se o treinamento ainda não aparecer, atualize a
            página em alguns instantes enquanto confirmamos sua matrícula.
          </p>
        </div>
      ) : null}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-learning-accent">
          Minha aprendizagem
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-learning-text">
          Meus treinamentos
        </h1>
        <p className="mt-3 text-sm text-learning-muted">
          Encontre um treinamento, retome suas aulas ou revise o que já
          aprendeu.
        </p>
      </div>
      <TrainingLibrary courses={snapshot.courses} />
    </div>
  );
}
