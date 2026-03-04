export default function LessonDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6 p-4 lg:p-8">
      <div className="h-16 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
      <div className="h-40 animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-5">
          <div className="aspect-video animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
          <div className="h-28 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
          <div className="h-36 animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
        </div>
        <div className="h-[560px] animate-pulse rounded-2xl border border-[#D9E3F0] bg-white" />
      </div>
    </div>
  )
}
