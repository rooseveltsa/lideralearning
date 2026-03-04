export default function AvaliacaoInicialLoading() {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-7 p-4 lg:p-8">
      <div className="h-64 animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
      <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
        <div className="h-[560px] animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
        <div className="h-72 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
      </div>
    </div>
  )
}
