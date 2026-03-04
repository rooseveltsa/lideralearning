export default function CertificateLoading() {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-7 p-4 lg:p-8">
      <div className="h-11 w-56 animate-pulse rounded-xl border border-[#D9E3F0] bg-white" />
      <div className="h-64 animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="h-[420px] animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
        <div className="h-[320px] animate-pulse rounded-3xl border border-[#D9E3F0] bg-white" />
      </div>
    </div>
  )
}
