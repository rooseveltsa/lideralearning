export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-[1260px] space-y-6 p-4 lg:p-8">
      <div className="h-44 animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-64 animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
        <div className="h-64 animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
      </div>
    </div>
  )
}
