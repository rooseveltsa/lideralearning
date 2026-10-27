export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Carregando seus treinamentos"
      className="learning-container space-y-6"
    >
      <span className="sr-only">Carregando seus treinamentos…</span>
      <div className="h-9 w-64 animate-pulse rounded-lg bg-learning-panel" />
      <div className="h-64 animate-pulse rounded-xl border border-learning-border bg-learning-panel" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-xl border border-learning-border bg-learning-panel"
          />
        ))}
      </div>
    </div>
  );
}
