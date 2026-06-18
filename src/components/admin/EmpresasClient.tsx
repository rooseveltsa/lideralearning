'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus } from 'lucide-react'

import CopyLinkButton from '@/app/admin/formularios/CopyLinkButton'
import { normalizeOrgCode, type SurveyOrgRow } from '@/lib/surveys/orgs'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://lideralearning.vercel.app'

// Formulários anônimos que aceitam ?org= (formação é identificada mas também segmenta).
const FORMS: { label: string; path: string }[] = [
  { label: 'Clima', path: '/pesquisa/clima' },
  { label: 'Psicossociais', path: '/pesquisa/psicossocial' },
  { label: 'Cultura Preventiva', path: '/pesquisa/cultura' },
  { label: 'Formação', path: '/formacao/diagnostico' },
]

export default function EmpresasClient({ orgs }: { orgs: SurveyOrgRow[] }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [nome, setNome] = useState('')
  const [canais, setCanais] = useState({ ouvidoria: '', cipa: '', sesmt: '', rh: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    setError(null)
    if (!code || !nome) {
      setError('Código e nome são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, nome, canais }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Falha ao criar.')
      setCode('')
      setNome('')
      setCanais({ ouvidoria: '', cipa: '', sesmt: '', rh: '' })
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao criar empresa.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Form de criação */}
      <section className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#0F172A]">
          <Plus className="h-4 w-4 text-[#1565C0]" /> Nova empresa
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#334155]">
            Código (vai na URL)
            <input
              value={code}
              onChange={(e) => setCode(normalizeOrgCode(e.target.value))}
              placeholder="ex.: acme-industria"
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#1565C0]"
            />
          </label>
          <label className="text-xs font-semibold text-[#334155]">
            Nome da empresa
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="ex.: ACME Indústria Ltda"
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#1565C0]"
            />
          </label>
        </div>
        <p className="mt-4 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
          Canais de encaminhamento (psicossociais) — opcional
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(['ouvidoria', 'cipa', 'sesmt', 'rh'] as const).map((k) => (
            <input
              key={k}
              value={canais[k]}
              onChange={(e) => setCanais((prev) => ({ ...prev, [k]: e.target.value }))}
              placeholder={`${k.toUpperCase()} — contato`}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#1565C0]"
            />
          ))}
        </div>
        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0D47A1] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Criar empresa
        </button>
      </section>

      {/* Lista de empresas + links prontos */}
      <section className="space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#64748B]">
          Empresas ({orgs.length})
        </h2>
        {orgs.length === 0 ? (
          <p className="rounded-xl border border-[#D8E2EF] bg-white p-6 text-center text-sm text-[#64748B]">
            Nenhuma empresa ainda. Crie a primeira acima para gerar os links segmentados.
          </p>
        ) : (
          orgs.map((org) => (
            <article key={org.code} className="rounded-2xl border border-[#D8E2EF] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">{org.nome}</h3>
                  <code className="text-xs text-[#64748B]">?org={org.code}</code>
                </div>
                {!org.ativo && (
                  <span className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700">inativa</span>
                )}
              </div>
              <div className="mt-3 space-y-2">
                {FORMS.map((f) => {
                  const url = `${BASE_URL}${f.path}?org=${org.code}`
                  return (
                    <div key={f.path} className="flex items-center gap-2">
                      <span className="w-28 shrink-0 text-xs font-semibold text-[#334155]">{f.label}</span>
                      <code className="flex-1 truncate rounded-lg border border-[#E3EBF6] bg-[#F8FAFD] px-2.5 py-1.5 text-[11px] text-[#334155]">
                        {url}
                      </code>
                      <CopyLinkButton url={url} />
                    </div>
                  )
                })}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  )
}
