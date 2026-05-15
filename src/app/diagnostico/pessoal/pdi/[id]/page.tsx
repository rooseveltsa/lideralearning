import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MessageCircle,
  Home,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Award,
} from 'lucide-react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { BackButton } from '@/components/site/BackButton'
import { createAdminClient } from '@/lib/supabase/service'
import { PdiConvergencia } from '@/components/diagnostico/pdi/PdiConvergencia'
import { PdiFase } from '@/components/diagnostico/pdi/PdiFase'
import { PdiReferencias } from '@/components/diagnostico/pdi/PdiReferencias'
import { PdiPrintButton } from '@/components/diagnostico/pdi/PdiPrintButton'
import { NIVEIS_LIDER } from '@/lib/diagnostico/pdi-knowledge'
import type { PdiReport } from '@/lib/diagnostico/pdi-types'

export const metadata = { title: 'Seu Plano de Desenvolvimento · Lidera' }

type Params = { params: Promise<{ id: string }> }

export default async function PdiPessoalPage({ params }: Params) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    notFound()
  }

  const admin = createAdminClient()
  const { data: diag } = await admin
    .from('personal_diagnostics')
    .select('nome_completo, empresa, cargo, pdi, created_at')
    .eq('id', id)
    .maybeSingle()

  if (!diag) notFound()

  // pdi.generated guarda o PDI estruturado (gerado pela IA ou fallback)
  const pdiContainer = (diag.pdi as Record<string, unknown>) || {}
  const pdiReport = pdiContainer.generated as PdiReport | undefined

  const nomeCompleto = (diag.nome_completo as string) || 'Líder'
  const firstName = nomeCompleto.trim().split(' ')[0]
  const empresa = (diag.empresa as string) || null
  const cargo = (diag.cargo as string) || null

  // Se PDI ainda não foi gerado, mostra estado de "processando"
  if (!pdiReport) {
    return (
      <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
        <SiteHeader />
        <main className="px-4 pb-20 pt-32 sm:px-6">
          <div className="mx-auto w-full max-w-[760px] text-center">
            <BackButton fallbackHref={`/diagnostico/pessoal/resultado/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </BackButton>

            <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F57C00]">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#0F172A]">
                Seu PDI está sendo gerado
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#475569]">
                Estamos cruzando suas respostas com o framework LIDERA e gerando um plano
                personalizado de 90 dias. Recarregue esta página em alguns segundos.
              </p>
              <Link
                href={`/diagnostico/pessoal/pdi/${id}`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E65100]"
              >
                Recarregar
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const nivelAtual = NIVEIS_LIDER[pdiReport.classificacao.atual]
  const nivelAlvo = NIVEIS_LIDER[pdiReport.classificacao.alvo90Dias]

  const waText = encodeURIComponent(
    `Olá Claudemir! Sou ${firstName}, recebi meu PDI completo pelo site e quero conversar sobre os próximos passos.`,
  )

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto w-full max-w-[1000px] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
            <BackButton fallbackHref={`/diagnostico/pessoal/resultado/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </BackButton>
            <PdiPrintButton variant="secondary" label="Baixar PDI em PDF" />
          </div>

          {/* Hero */}
          <div className="rounded-3xl border border-[#E3EBF6] bg-gradient-to-br from-[#FFF7ED] to-white p-7 sm:p-10">
            <div className="mb-5 flex items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F57C00] text-white">
                <Sparkles className="h-7 w-7" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F57C00]">
                  Plano de Desenvolvimento Individual · 90 dias
                </p>
                <h1 className="mt-1 font-heading text-3xl font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-4xl">
                  {firstName}, seu plano está pronto
                </h1>
                <p className="mt-2 text-sm text-[#475569]">
                  {empresa
                    ? `${empresa}${cargo ? ` · ${cargo}` : ''}`
                    : cargo || 'Plano personalizado de desenvolvimento'}
                </p>
              </div>
            </div>

            {/* Classificação */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#FCD49C] bg-white p-5">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#F57C00]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#F57C00]">
                    Nível atual
                  </p>
                </div>
                <p className="mt-2 font-heading text-lg font-extrabold tracking-tight text-[#0F172A]">
                  {nivelAtual.nome}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{nivelAtual.descricao}</p>
              </div>
              <div className="rounded-2xl border border-[#1565C0]/30 bg-white p-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#1565C0]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#1565C0]">
                    Meta em 90 dias
                  </p>
                </div>
                <p className="mt-2 font-heading text-lg font-extrabold tracking-tight text-[#0F172A]">
                  {nivelAlvo.nome}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{nivelAlvo.descricao}</p>
              </div>
            </div>
          </div>

          {/* Convergência */}
          <PdiConvergencia
            resumo={pdiReport.convergencia.resumo}
            pontos={pdiReport.convergencia.pontos}
          />

          {/* 3 Fases */}
          {pdiReport.fases.map((fase) => (
            <PdiFase key={fase.numero} fase={fase} />
          ))}

          {/* Próximos passos */}
          {pdiReport.proximosPassos.length > 0 && (
            <div className="rounded-3xl border border-[#E3EBF6] bg-white p-7 sm:p-10">
              <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
                Rituais e Próximos Passos
              </h2>
              <p className="mt-2 text-sm text-[#64748B]">
                Práticas contínuas que sustentam a evolução além das 3 fases.
              </p>
              <div className="mt-6 space-y-3">
                {pdiReport.proximosPassos.map((p, i) => (
                  <div key={i} className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
                    <p className="text-sm font-bold text-[#0F172A]">{p.titulo}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#475569]">{p.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referências bibliográficas */}
          {pdiReport.referencias && pdiReport.referencias.length > 0 && (
            <PdiReferencias referencias={pdiReport.referencias} />
          )}

          {/* Nota crítica */}
          <div className="rounded-3xl border-2 border-[#FECACA] bg-[#FEF2F2] p-7 sm:p-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-[#B91C1C]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#B91C1C]">
                  Nota crítica
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#7F1D1D]">
                  {pdiReport.notaCritica}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-3xl border border-[#F57C00]/20 bg-gradient-to-br from-[#FFF7ED] to-white p-7 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F57C00]/10 text-[#F57C00]">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Quer apoio para executar este plano?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#475569]">
              O Claudemir analisa pessoalmente seu PDI e desenha junto com você o caminho de
              mentoria, treinamento presencial e acompanhamento dos próximos 60 dias.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
              <a
                href={`https://wa.me/5564996099020?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com Claudemir
              </a>
              <PdiPrintButton variant="secondary" label="Baixar PDI em PDF" />
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-[#FCD49C] bg-white px-6 py-3 text-sm font-bold text-[#9A3412] transition-colors hover:bg-[#FFF7ED]"
              >
                <Home className="h-4 w-4" />
                Ir para home
              </Link>
            </div>
          </div>

          {/* Footer info */}
          <div className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-4 text-center text-xs text-[#94A3B8]">
            PDI gerado em{' '}
            {new Date(pdiReport.meta.generatedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
            · Versão {pdiReport.meta.version}
            {pdiReport.meta.provider === 'rule-based-fallback'
              ? ' (modelo determinístico)'
              : ''}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
