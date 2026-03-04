export default function CursosLoading() {
  return (
    <div className="min-h-screen bg-[#05080F] px-6 pb-16 pt-32 text-[#E6EDF7]">
      <div className="mx-auto max-w-[1400px] animate-pulse space-y-12">
        <section className="space-y-5 rounded-2xl border border-white/10 bg-[#0B1222] p-8">
          <div className="h-5 w-40 rounded bg-white/10" />
          <div className="h-10 w-full max-w-3xl rounded bg-white/10" />
          <div className="h-5 w-full max-w-2xl rounded bg-white/10" />
          <div className="h-5 w-full max-w-xl rounded bg-white/10" />
          <div className="flex gap-3 pt-4">
            <div className="h-11 w-40 rounded bg-white/10" />
            <div className="h-11 w-52 rounded bg-white/10" />
          </div>
        </section>

        {Array.from({ length: 3 }).map((_, row) => (
          <section key={row} className="space-y-4">
            <div className="h-7 w-64 rounded bg-white/10" />
            <div className="flex gap-4 overflow-hidden pb-2">
              {Array.from({ length: 4 }).map((__, card) => (
                <div key={card} className="min-w-[260px] max-w-[260px] rounded-xl border border-white/10 bg-[#0B1222]">
                  <div className="h-36 w-full rounded-t-xl bg-white/10" />
                  <div className="space-y-3 p-4">
                    <div className="h-5 w-full rounded bg-white/10" />
                    <div className="h-4 w-[90%] rounded bg-white/10" />
                    <div className="h-4 w-[60%] rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
