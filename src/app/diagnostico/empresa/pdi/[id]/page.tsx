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
  Building2,
} from 'lucide-react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { createAdminClient } from '@/lib/supabase/service'
import { PdiConvergencia } from '@/components/diagnostico/pdi/PdiConvergencia'
import { PdiFase } from '@/components/diagnostico/pdi/PdiFase'
import { PdiReferencias } from '@/components/diagnostico/pdi/PdiReferencias'
import { PdiPrintButton } from '@/components/diagnostico/pdi/PdiPrintButton'
import { NIVEIS_LIDER } from '@/lib/diagnostico/pdi-knowledge'
import type { PdiReport } from '@/lib/diagnostico/pdi-types'

export const metadata = { title: 'PDI do Supervisor · Lidera (uso executivo)' }

type Params = { params: Promise<{ id: string }> }

export default async function PdiEmpresaPage({ params }: Params) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    notFound()
  }

  const admin = createAdminClient()
  const { data: diag } = await admin
    .from('b2b_diagnostics')
    .select('empresa, gestor_nome, supervisor_nome, supervisor_cargo, espaco_aberto, created_at')
    .eq('id', id)
    .maybeSingle()

  if (!diag) notFound()

  const espacoAberto = (diag.espaco_aberto as Record<string, unknown>) || {}
  const pdiReport = espacoAberto.pdi_generated as PdiReport | undefined

  const empresa = (diag.empresa as string) || 'sua empresa'
  const gestorNome = (diag.gestor_nome as string) || 'Gestor'
  const supervisorNome = (diag.supervisor_nome as string) || 'o supervisor'
  const supervisorCargo = (diag.supervisor_cargo as string) || null
  const firstGestor = gestorNome.trim().split(' ')[0]

  if (!pdiReport) {
    return (
      <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
        <SiteHeader />
        <main className="px-4 pb-20 pt-32 sm:px-6">
          <div className="mx-auto w-full max-w-[760px] text-center">
            <Link
              href={`/diagnostico/empresa/resultado/${id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao resultado
            </Link>

            <div className="mt-6 rounded-3xl border border-[#E3EBF6] bg-white p-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF6FE] text-[#1565C0]">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#0F172A]">
                PDI do supervisor sendo gerado
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#475569]">
                Estamos cruzando o diagnóstico de {supervisorNome} com o framework LIDERA e
                gerando o plano executivo para sua reunião. Recarregue esta página em alguns
                segundos.
              </p>
              <Link
                href={`/diagnostico/empresa/pdi/${id}`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0B4A8F]"
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
    `Olá Claudemir! Sou ${firstGestor} da ${empresa}. Recebi o PDI do supervisor ${supervisorNome} pelo site e quero conversar sobre como implementar este plano.`,
  )

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0F172A]">
      <SiteHeader />

      <main className="px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto w-full max-w-[1000px] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
            <Link
              href={`/diagnostico/empresa/resultado/${id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao resultado do diagnóstico
            </Link>
            <PdiPrintButton variant="secondary" label="Baixar PDI em PDF" />
          </div>

          {/* Hero — tom executivo */}
          <div className="rounded-3xl border border-[#E3EBF6] bg-gradient-to-br from-[#EFF6FE] to-white p-7 sm:p-10">
            <div className="mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#1565C0]" />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1565C0]">
                Documento executivo · uso do gestor
              </p>
            </div>
            <div className="mb-5 flex items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1565C0] text-white">
                <Sparkles className="h-7 w-7" />
              </span>
              <div>
                <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-4xl">
                  PDI · {supervisorNome}
                </h1>
                <p className="mt-2 text-sm text-[#475569]">
                  Plano de Desenvolvimento Individual de 90 dias · Insumo para reunião 1:1
                  com {firstGestor} · {empresa}
                  {supervisorCargo && ` · ${supervisorCargo}`}
                </p>
              </div>
            </div>

            {/* Classificação */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#C8DAEE] bg-white p-5">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#0B4A8F]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#0B4A8F]">
                    Posicionamento atual
                  </p>
                </div>
                <p className="mt-2 font-heading text-lg font-extrabold tracking-tight text-[#0F172A]">
                  {nivelAtual.nome}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{nivelAtual.descricao}</p>
              </div>
              <div className="rounded-2xl border border-[#22C55E]/40 bg-white p-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#15803D]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#15803D]">
                    Meta para 90 dias
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
                Rituais Executivos
              </h2>
              <p className="mt-2 text-sm text-[#64748B]">
                Práticas contínuas que o gestor implementa para sustentar a evolução.
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

          {/* Nota crítica — risco pra empresa */}
          <div className="rounded-3xl border-2 border-[#FECACA] bg-[#FEF2F2] p-7 sm:p-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-[#B91C1C]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#B91C1C]">
                  Risco para a operação se este plano não avançar
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#7F1D1D]">
                  {pdiReport.notaCritica}
                </p>
              </div>
            </div>
          </div>

          {/* CTA executivo */}
          <div className="rounded-3xl border border-[#1565C0]/20 bg-gradient-to-br from-[#EFF6FE] to-white p-7 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1565C0]/10 text-[#1565C0]">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Quer apoio executivo na implementação?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#475569]">
              O Claudemir analisa pessoalmente este PDI com você e desenha junto o programa de
              treinamento + mentoria que viabiliza o plano nas próximas 12 semanas.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
              <a
                href={`https://wa.me/5564996099020?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
              >
                <MessageCircle className="h-4 w-4" />
                Conversar com Claudemir
              </a>
              <PdiPrintButton variant="secondary" label="Baixar PDI em PDF" />
              <Link
                href="/diagnostico/empresa"
                className="inline-flex items-center gap-2 rounded-xl border border-[#C8DAEE] bg-white px-6 py-3 text-sm font-bold text-[#0B4A8F] transition-colors hover:bg-[#EFF5FD]"
              >
                Avaliar outro supervisor
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-white px-6 py-3 text-sm font-bold text-[#64748B] transition-colors hover:bg-[#F8FAFD]"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-4 text-center text-xs text-[#94A3B8]">
            PDI gerado em{' '}
            {new Date(pdiReport.meta.generatedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}{' '}
            · Versão {pdiReport.meta.version}
            {pdiReport.meta.provider === 'rule-based-fallback'
              ? ' (modelo determinístico)'
              : ''}{' '}
            · Documento confidencial para uso interno do gestor
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
