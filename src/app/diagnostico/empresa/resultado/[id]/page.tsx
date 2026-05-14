import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Home, Sparkles, Building2 } from 'lucide-react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { createAdminClient } from '@/lib/supabase/service'
import { ScoreCard } from '@/components/diagnostico/resultado/ScoreCard'
import { DiscBarChart } from '@/components/diagnostico/resultado/DiscBarChart'
import { TopCompetencias } from '@/components/diagnostico/resultado/TopCompetencias'
import { COMPETENCIAS_LIDERANCA, DESAFIOS_ATUAIS } from '@/lib/diagnostico/empresa-data'

export const metadata = { title: 'Resultado do diagnóstico empresarial · Lidera' }

type Params = { params: Promise<{ id: string }> }

export default async function DiagnosticoEmpresaResultadoPage({ params }: Params) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    notFound()
  }

  const admin = createAdminClient()
  const { data: diag, error } = await admin
    .from('b2b_diagnostics')
    .select(
      'empresa, gestor_nome, supervisor_nome, fit_score, disc_scores, perfil_lideranca_esperado, diagnostico_atual, created_at',
    )
    .eq('id', id)
    .maybeSingle()

  if (error || !diag) notFound()

  const fitScore = (diag.fit_score as number) || 0
  const discScores = (diag.disc_scores as Record<string, number>) || { D: 0, I: 0, S: 0, C: 0 }
  const perfilEsperado = (diag.perfil_lideranca_esperado as Record<string, number>) || {}
  const diagnosticoAtual = (diag.diagnostico_atual as Record<string, number>) || {}

  const competenciasItems = COMPETENCIAS_LIDERANCA.map((c) => ({
    id: c.id,
    label: c.label,
    value: perfilEsperado[c.id] || 0,
  }))

  const desafiosItems = DESAFIOS_ATUAIS.map((d) => ({
    id: d.id,
    label: d.label,
    value: diagnosticoAtual[d.id] || 0,
  }))

  const firstName = (diag.gestor_nome as string).trim().split(' ')[0]
  const waText = encodeURIComponent(
    `Olá Claudemir! Sou ${firstName} da ${diag.empresa}. Enviei o diagnóstico do supervisor ${diag.supervisor_nome} — quero discutir os próximos passos.`,
  )

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto w-full max-w-[1000px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a home
          </Link>

          {/* Hero */}
          <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
            <div className="mb-6 flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EFF6FE] text-[#1565C0]">
                <Building2 className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">
                  Diagnóstico empresarial
                </p>
                <h1 className="mt-1 font-heading text-2xl font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-3xl">
                  Resultado — {diag.supervisor_nome}
                </h1>
                <p className="mt-1 text-sm text-[#64748B]">
                  {diag.empresa} · Avaliação realizada por {diag.gestor_nome}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ScoreCard
                label="Fit de expectativa"
                value={fitScore}
                max={100}
                unit="/100"
                description="Quanto a empresa espera de um supervisor de excelência. Quanto maior, mais alta a régua."
              />
              <ScoreCard
                label="Perfil DISC dominante"
                value={Math.max(...Object.values(discScores))}
                max={100}
                unit="%"
                color={
                  discScores.D >= Math.max(discScores.I, discScores.S, discScores.C)
                    ? '#EF4444'
                    : discScores.I >= Math.max(discScores.S, discScores.C)
                    ? '#F59E0B'
                    : discScores.S >= discScores.C
                    ? '#22C55E'
                    : '#1565C0'
                }
                description={(() => {
                  const sortedDims = (['D', 'I', 'S', 'C'] as Array<'D' | 'I' | 'S' | 'C'>)
                    .slice()
                    .sort((a, b) => discScores[b] - discScores[a])
                  return `Predomina ${sortedDims[0]}, depois ${sortedDims[1]}. Análise completa abaixo.`
                })()}
              />
            </div>
          </div>

          {/* DISC */}
          <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
            <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
              Perfil comportamental esperado
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Distribuição dos 20 traços DISC esperados pela empresa.
            </p>
            <div className="mt-6">
              <DiscBarChart scores={discScores} />
            </div>
          </div>

          {/* Top competências esperadas */}
          <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
            <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
              Competências priorizadas pela empresa
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Top 5 mais valorizadas e as 5 menos críticas (relativamente).
            </p>
            <div className="mt-6">
              <TopCompetencias
                items={competenciasItems}
                max={5}
                labelFortes="Top 5 mais valorizadas"
                labelGaps="5 menos priorizadas"
              />
            </div>
          </div>

          {/* Desafios atuais */}
          <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
            <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
              Onde estão os maiores desafios hoje
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Áreas mais críticas identificadas no diagnóstico atual.
            </p>
            <div className="mt-6">
              <TopCompetencias
                items={desafiosItems}
                max={5}
                labelFortes="Top 5 desafios críticos"
                labelGaps="Top 5 áreas mais saudáveis"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 rounded-3xl border border-[#1565C0]/20 bg-gradient-to-br from-[#EFF6FE] to-white p-7 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1565C0]/10 text-[#1565C0]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Próximo passo: análise pessoal com Claudemir
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#475569]">
              Os números acima são apenas a referência inicial. O valor real está na conversa onde
              cruzamos esses dados com sua operação e propomos um PDI específico para{' '}
              {diag.supervisor_nome}.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/diagnostico/empresa/pdi/${id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0B4A8F]"
              >
                <Sparkles className="h-4 w-4" />
                Ver PDI do supervisor
              </Link>
              <a
                href={`https://wa.me/5564996099020?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
              >
                <MessageCircle className="h-4 w-4" />
                Conversar com Claudemir
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-[#C8DAEE] bg-white px-6 py-3 text-sm font-bold text-[#0B4A8F] transition-colors hover:bg-[#EFF5FD]"
              >
                <Home className="h-4 w-4" />
                Voltar para a home
              </Link>
            </div>

            <p className="mt-6 text-xs text-[#94A3B8]">
              Avaliar outro supervisor?{' '}
              <Link href="/diagnostico/empresa" className="font-semibold text-[#1565C0] hover:underline">
                Novo diagnóstico
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
