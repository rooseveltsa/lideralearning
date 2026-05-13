import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Home, Sparkles, User, Building2 } from 'lucide-react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { createAdminClient } from '@/lib/supabase/service'
import { ScoreCard } from '@/components/diagnostico/resultado/ScoreCard'
import { DiscBarChart } from '@/components/diagnostico/resultado/DiscBarChart'
import { TopCompetencias } from '@/components/diagnostico/resultado/TopCompetencias'
import { RadarChart } from '@/components/diagnostico/resultado/RadarChart'
import {
  AUTOAVALIACAO_COMPETENCIAS,
  PILARES_RADAR,
} from '@/lib/diagnostico/pessoal-data'

export const metadata = { title: 'Seu PDI · Lidera' }

type Params = { params: Promise<{ id: string }> }

export default async function DiagnosticoPessoalResultadoPage({ params }: Params) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    notFound()
  }

  const admin = createAdminClient()
  const { data: diag, error } = await admin
    .from('personal_diagnostics')
    .select(
      'nome_completo, empresa, cargo, modulo_scores, disc_scores, radar_average, autoavaliacao_comportamental, radar_desenvolvimento, pdi, linked_b2b_diagnostic_id, created_at',
    )
    .eq('id', id)
    .maybeSingle()

  if (error || !diag) notFound()

  const selfScore = ((diag.modulo_scores as Record<string, number>)?.self_score as number) || 0
  const discScores = (diag.disc_scores as Record<string, number>) || { D: 0, I: 0, S: 0, C: 0 }
  const radarAverage = (diag.radar_average as number) || 0
  const autoavaliacao = (diag.autoavaliacao_comportamental as Record<string, number>) || {}
  const radar = (diag.radar_desenvolvimento as Record<string, number>) || {}
  const pdi = (diag.pdi as Record<string, string | null>) || {}

  const competenciasItems = AUTOAVALIACAO_COMPETENCIAS.map((c) => ({
    id: c.id,
    label: c.label,
    value: autoavaliacao[c.id] || 0,
  }))

  const radarData = PILARES_RADAR.map((p) => ({
    label: p.label,
    value: radar[p.id] || 0,
  }))

  // Cross-link com diagnóstico empresarial (comparativo)
  let comparativoB2b: Record<string, number> | null = null
  let empresaNome: string | null = null
  if (diag.linked_b2b_diagnostic_id) {
    const { data: b2b } = await admin
      .from('b2b_diagnostics')
      .select('disc_scores, empresa')
      .eq('id', diag.linked_b2b_diagnostic_id as string)
      .maybeSingle()
    if (b2b) {
      comparativoB2b = (b2b.disc_scores as Record<string, number>) || null
      empresaNome = (b2b.empresa as string) || null
    }
  }

  const firstName = (diag.nome_completo as string).trim().split(' ')[0]
  const waText = encodeURIComponent(
    `Olá Claudemir! Sou ${firstName} e acabei de gerar meu PDI no site. Quero conversar sobre os próximos passos do meu desenvolvimento.`,
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
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F57C00]">
                <User className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F57C00]">
                  Seu PDI inicial
                </p>
                <h1 className="mt-1 font-heading text-2xl font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-3xl">
                  {firstName}, seu mapa está pronto
                </h1>
                <p className="mt-1 text-sm text-[#64748B]">
                  {diag.empresa
                    ? `${diag.empresa}${diag.cargo ? ` · ${diag.cargo}` : ''}`
                    : diag.cargo || 'Autoavaliação profissional'}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <ScoreCard
                label="Autoavaliação geral"
                value={selfScore}
                max={100}
                unit="/100"
                description="Sua percepção sobre as 20 competências de liderança."
              />
              <ScoreCard
                label="Radar de pilares"
                value={radarAverage}
                max={10}
                unit="/10"
                description="Equilíbrio entre 10 pilares da sua vida."
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
                description={`Predomina ${
                  (['D', 'I', 'S', 'C'] as Array<'D' | 'I' | 'S' | 'C'>)
                    .slice()
                    .sort((a, b) => discScores[b] - discScores[a])[0]
                }`}
              />
            </div>
          </div>

          {/* Radar visual */}
          <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
            <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
              Radar dos 10 pilares
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Quanto mais largo o polígono, mais equilibrada está a vida.
            </p>
            <div className="mt-6">
              <RadarChart data={radarData} size={400} maxValue={10} />
            </div>
          </div>

          {/* DISC */}
          <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
            <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
              Seu perfil comportamental
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              {comparativoB2b
                ? `Comparativo: sua percepção × expectativa da ${empresaNome}.`
                : 'Distribuição dos 20 traços DISC pessoais.'}
            </p>
            <div className="mt-6">
              <DiscBarChart scores={discScores} comparativo={comparativoB2b ?? undefined} />
            </div>
            {comparativoB2b && (
              <div className="mt-5 rounded-xl border border-[#FCD49C] bg-[#FFF7ED] p-4">
                <div className="flex items-start gap-2">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#F57C00]" />
                  <p className="text-xs leading-relaxed text-[#9A3412]">
                    <strong>Cruzamento detectado:</strong> esta autoavaliação foi vinculada ao
                    diagnóstico empresarial da <strong>{empresaNome}</strong>. O traço escuro nas
                    barras mostra a expectativa da empresa — a barra colorida mostra sua
                    percepção.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Top competências autoavaliação */}
          <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
            <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
              Suas forças e gaps
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Top 5 onde você se vê forte e top 5 onde reconhece espaço para evoluir.
            </p>
            <div className="mt-6">
              <TopCompetencias items={competenciasItems} max={5} />
            </div>
          </div>

          {/* PDI textual */}
          {(pdi.habilidade_desenvolver || pdi.acao_proximos_7_dias) && (
            <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
              <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
                Seu Plano de Ação
              </h2>
              <p className="mt-2 text-sm text-[#64748B]">
                O que você decidiu fazer nos próximos 90 dias.
              </p>
              <div className="mt-6 space-y-4">
                {pdi.habilidade_desenvolver && (
                  <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#15803D]">
                      Habilidade prioritária
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#0F172A]">
                      {pdi.habilidade_desenvolver}
                    </p>
                  </div>
                )}
                {pdi.acao_proximos_7_dias && (
                  <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">
                      Ação para os próximos 7 dias
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#0F172A]">
                      {pdi.acao_proximos_7_dias}
                    </p>
                  </div>
                )}
                {pdi.resultado_90_dias && (
                  <div className="rounded-xl border border-[#FBCFE8] bg-[#FDF2F8] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#BE185D]">
                      Resultado esperado em 90 dias
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#0F172A]">
                      {pdi.resultado_90_dias}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6 rounded-3xl border border-[#F57C00]/20 bg-gradient-to-br from-[#FFF7ED] to-white p-7 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F57C00]/10 text-[#F57C00]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Próximo passo: conversa de 30 minutos com Claudemir
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#475569]">
              Os números são o ponto de partida. O valor real está na leitura personalizada e no
              plano de ação que vamos construir juntos.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/5564996099020?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com Claudemir
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-[#FCD49C] bg-white px-6 py-3 text-sm font-bold text-[#9A3412] transition-colors hover:bg-[#FFF7ED]"
              >
                <Home className="h-4 w-4" />
                Voltar para a home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
