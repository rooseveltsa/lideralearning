export default function DashboardCursosLoading() {
  return (
    <div className="mx-auto w-full max-w-[1260px] space-y-6 p-4 lg:p-8">
      <div className="h-44 animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
      {Array.from({ length: 3 }).map((_, rowIndex) => (
        <section key={rowIndex} className="space-y-4">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-[#D9E3F0]" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div key={cardIndex} className="h-72 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
