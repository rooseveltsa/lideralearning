import AioxOffice from '@/components/aiox/AioxOffice'

export default function AioxDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8CB8E7]">AIOX Framework</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-[#0F172A]">Escritório dos Agentes</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Acompanhe os agentes de IA trabalhando em tempo real no escritório virtual.
        </p>
      </div>

      <AioxOffice />
    </div>
  )
}
