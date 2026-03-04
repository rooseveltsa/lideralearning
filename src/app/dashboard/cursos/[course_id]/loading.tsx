export default function CourseDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-7 p-4 lg:p-8">
      <div className="h-64 animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-56 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
          <div className="h-44 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
        </div>
      </div>
    </div>
  )
}
