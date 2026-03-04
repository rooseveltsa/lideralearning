'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

import { AssessmentResponses, saveInitialAssessment } from '@/lib/actions/assessment'

const contextos = [
  {
    id: 'rotina' as keyof AssessmentResponses,
    numero: '01',
    titulo: 'Organização da Rotina',
    descricao: 'Planejar e priorizar as atividades da equipe no cotidiano da operação.',
    questao: 'Como você se avalia na organização e priorização das tarefas da sua equipe no dia a dia?',
    ancora_baixo: 'A rotina me controla. Tenho dificuldade em decidir o que é mais urgente.',
    ancora_alto: 'Organizo a rotina com antecedência. Raramente sou surpreendido por imprevistos.',
  },
  {
    id: 'comunicacao' as keyof AssessmentResponses,
    numero: '02',
    titulo: 'Comunicação Direta',
    descricao: 'Transmitir expectativas, prazos e resultados esperados com clareza.',
    questao: 'Como você se avalia na comunicação com sua equipe sobre o que espera de cada pessoa?',
    ancora_baixo: 'Frequentemente as pessoas ficam em dúvida sobre o que eu quero.',
    ancora_alto: 'Sou claro e direto. Minha equipe sabe exatamente o que se espera dela.',
  },
  {
    id: 'feedback' as keyof AssessmentResponses,
    numero: '03',
    titulo: 'Feedback Estruturado',
    descricao: 'Dar retorno positivo e corretivo de forma consistente e respeitosa.',
    questao: 'Como você se avalia na prática de dar feedback — tanto de reconhecimento quanto corretivo?',
    ancora_baixo: 'Evito feedback difícil. Só me manifesto quando o problema é grave.',
    ancora_alto: 'Dou feedback regularmente, com estrutura, independente da situação.',
  },
  {
    id: 'cobranca' as keyof AssessmentResponses,
    numero: '04',
    titulo: 'Cobrança de Resultados',
    descricao: 'Exigir entregas com firmeza sem gerar clima de medo ou desmotivação.',
    questao: 'Como você se avalia ao cobrar resultados e prazos quando eles não são cumpridos?',
    ancora_baixo: 'Evito o confronto ou acabo sendo agressivo — não tenho um caminho do meio.',
    ancora_alto: 'Cobro com firmeza e respeito. A equipe entende a cobrança como parte do trabalho.',
  },
  {
    id: 'conflitos' as keyof AssessmentResponses,
    numero: '05',
    titulo: 'Gestão de Conflitos',
    descricao: 'Lidar com tensões e desentendimentos dentro da equipe com objetividade.',
    questao: 'Como você se avalia ao lidar com conflitos entre membros da equipe ou com você mesmo?',
    ancora_baixo: 'Evito o conflito ou fico imparcial esperando que se resolva sozinho.',
    ancora_alto: 'Intervenho rapidamente, ouço as partes e conduzo uma resolução justa.',
  },
  {
    id: 'delegacao' as keyof AssessmentResponses,
    numero: '06',
    titulo: 'Delegação Eficaz',
    descricao: 'Distribuir tarefas e responsabilidades de forma estratégica e acompanhada.',
    questao: 'Como você se avalia ao delegar tarefas e responsabilidades para sua equipe?',
    ancora_baixo: 'Prefiro fazer eu mesmo ou delego sem acompanhar se foi feito.',
    ancora_alto: 'Delego com critério: escolho a pessoa certa, alinho expectativas e acompanho.',
  },
  {
    id: 'autogestao' as keyof AssessmentResponses,
    numero: '07',
    titulo: 'Autogestão e Presença',
    descricao: 'Gerenciar suas próprias emoções e comportamentos como referência para a equipe.',
    questao: 'Como você se avalia no controle das suas emoções e reações em situações de pressão?',
    ancora_baixo: 'Em situações de pressão, costumo reagir com impulso ou ficando irritado.',
    ancora_alto: 'Mantenho postura consistente mesmo sob pressão. Sou estável para minha equipe.',
  },
]

const niveis = [
  { valor: 1, label: 'Preciso desenvolver muito' },
  { valor: 2, label: 'Em início de desenvolvimento' },
  { valor: 3, label: 'Em desenvolvimento' },
  { valor: 4, label: 'Bem desenvolvido' },
  { valor: 5, label: 'Ponto forte claro' },
]

const corNivel: Record<number, string> = {
  1: '#EF4444',
  2: '#F97316',
  3: '#F59E0B',
  4: '#1565C0',
  5: '#4CAF35',
}

const labelNivel: Record<number, string> = {
  1: 'Desenvolver',
  2: 'Iniciando',
  3: 'Em progresso',
  4: 'Desenvolvido',
  5: 'Ponto forte',
}

type Props = {
  enrollmentId: string
  courseId: string
}

export default function AvaliacaoInicialForm({ enrollmentId, courseId }: Props) {
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [responses, setResponses] = useState<Partial<AssessmentResponses>>({})
  const [salvando, setSalvando] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (contextos.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-6 text-sm text-[#64748B]">
        Nenhuma competência foi configurada para esta autoavaliação.
      </div>
    )
  }

  const totalSteps = contextos.length
  const isSummary = step === totalSteps
  const contextoAtual = !isSummary ? contextos[step] : null
  const respostaSelecionada = contextoAtual ? responses[contextoAtual.id] : undefined
  const progressoVisual = isSummary ? 100 : Math.round(((step + 1) / totalSteps) * 100)
  const todasRespondidas = contextos.every((contexto) => responses[contexto.id] !== undefined)
  const respostasPendentes = contextos.filter((contexto) => responses[contexto.id] === undefined).length

  function selecionar(valor: number) {
    if (!contextoAtual) return
    setResponses((prev) => ({ ...prev, [contextoAtual.id]: valor }))
  }

  function avancar() {
    setSubmitError(null)
    if (step < totalSteps) setStep((current) => current + 1)
  }

  function voltar() {
    setSubmitError(null)
    if (step > 0) setStep((current) => current - 1)
  }

  async function handleSubmit() {
    if (!todasRespondidas || salvando) return

    setSubmitError(null)
    setSalvando(true)

    const result = await saveInitialAssessment(enrollmentId, courseId, responses as AssessmentResponses)
    if (result.success) {
      router.push(`/dashboard/cursos/${courseId}`)
      router.refresh()
      return
    }

    setSalvando(false)
    setSubmitError(result.error || 'Não foi possível salvar sua autoavaliação. Tente novamente.')
  }

  if (isSummary) {
    const resumo = contextos.map((contexto) => {
      const nota = responses[contexto.id] ?? 0
      return { ...contexto, nota }
    })

    const media = Number((resumo.reduce((acc, item) => acc + item.nota, 0) / totalSteps).toFixed(1))
    const strengths = resumo.slice().sort((a, b) => b.nota - a.nota).slice(0, 2)
    const pontosAtencao = resumo.slice().sort((a, b) => a.nota - b.nota).slice(0, 2)

    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B4A8F]">Resumo da autoavaliação</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#0F172A]">Seu ponto de partida na trilha</h2>
          <p className="mt-2 text-sm text-[#64748B]">
            Revise suas notas antes de finalizar. Essa base será usada para comparar sua evolução ao final da jornada.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#64748B]">Média geral</p>
            <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">{media}</p>
          </article>
          <article className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#64748B]">Pontos fortes</p>
            <p className="mt-1 text-sm font-bold text-[#0F172A]">
              {strengths.map((item) => item.titulo).join(' • ')}
            </p>
          </article>
          <article className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#64748B]">Pontos de atenção</p>
            <p className="mt-1 text-sm font-bold text-[#0F172A]">
              {pontosAtencao.map((item) => item.titulo).join(' • ')}
            </p>
          </article>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E3EBF6] bg-white">
          {resumo.map((item, index) => {
            const pct = (item.nota / 5) * 100
            const cor = corNivel[item.nota]

            return (
              <div
                key={item.id}
                className={`px-5 py-4 ${index < resumo.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[#111827]">
                    {item.numero} • {item.titulo}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(index)}
                    className="text-xs font-semibold text-[#64748B] transition-colors hover:text-[#0B4A8F]"
                  >
                    Editar
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEF3F9]">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cor }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: cor }}>
                    {labelNivel[item.nota]}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={voltar}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!todasRespondidas || salvando}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1043A0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {salvando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Iniciar treinamento
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-[#64748B]">
            Contexto {step + 1} de {totalSteps}
          </p>
          <p className="text-sm font-bold text-[#0B4A8F]">{progressoVisual}%</p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
          <div className="h-full rounded-full bg-[#1565C0] transition-all duration-500" style={{ width: `${progressoVisual}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
        <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#1565C0]/10 text-sm font-extrabold text-[#1565C0]">
          {contextoAtual?.numero}
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#111827]">{contextoAtual?.titulo}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{contextoAtual?.descricao}</p>
        <p className="mt-4 rounded-xl border border-[#E4EAF4] bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#111827]">
          {contextoAtual?.questao}
        </p>
      </div>

      <div className="space-y-2.5">
        {niveis.map(({ valor, label }) => {
          const selecionado = respostaSelecionada === valor

          return (
            <button
              key={valor}
              type="button"
              onClick={() => selecionar(valor)}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                selecionado ? 'border-[#1565C0] bg-[#EFF6FE]' : 'border-[#E5E7EB] bg-white hover:border-[#BCD0EA] hover:bg-[#F8FAFD]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold text-white"
                  style={{ backgroundColor: selecionado ? corNivel[valor] : '#CBD5E1' }}
                >
                  {valor}
                </span>
                <span className={`text-sm font-semibold ${selecionado ? 'text-[#111827]' : 'text-[#334155]'}`}>{label}</span>
                {selecionado ? <CheckCircle2 className="ml-auto h-4.5 w-4.5 text-[#1565C0]" /> : null}
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-4 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#64748B]">Referência baixa (1)</p>
          <p className="mt-1 text-xs leading-relaxed text-[#475569]">{contextoAtual?.ancora_baixo}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#64748B]">Referência alta (5)</p>
          <p className="mt-1 text-xs leading-relaxed text-[#475569]">{contextoAtual?.ancora_alto}</p>
        </div>
      </div>

      {submitError ? (
        <div className="inline-flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4" />
          {submitError}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={voltar}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold text-[#64748B]">
            {respostasPendentes > 0 ? `${respostasPendentes} contexto(s) pendente(s)` : 'Tudo pronto para finalizar'}
          </p>
          <button
            type="button"
            onClick={avancar}
            disabled={respostaSelecionada === undefined}
            className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step < totalSteps - 1 ? 'Próximo' : 'Ver resumo'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
