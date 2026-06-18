import Link from 'next/link'
import { ArrowLeft, Building2 } from 'lucide-react'

import { listOrgs } from '@/lib/surveys/orgs'
import EmpresasClient from '@/components/admin/EmpresasClient'

export const metadata = { title: 'Empresas (formulários) | Admin' }

export default async function AdminEmpresasPage() {
  const orgs = await listOrgs()

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#1A2B46] bg-[#060D1A] px-6 py-5 text-white shadow-lg">
        <Link
          href="/admin/formularios"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8CB8E7] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Formulários
        </Link>
        <h1 className="mt-2 flex items-center gap-2 font-heading text-2xl font-extrabold">
          <Building2 className="h-6 w-6 text-[#1E88E5]" />
          Empresas e links segmentados
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-[#A9BDD8]">
          Crie uma empresa para gerar links com <code>?org=código</code>. As respostas ficam
          separadas por empresa, e cada análise no admin pode ser filtrada por empresa
          (ex.: <code>/admin/clima?org=acme</code>). Os canais cadastrados aparecem no
          encaminhamento dos Indicadores Psicossociais daquela empresa.
        </p>
      </section>

      <EmpresasClient orgs={orgs} />
    </div>
  )
}
