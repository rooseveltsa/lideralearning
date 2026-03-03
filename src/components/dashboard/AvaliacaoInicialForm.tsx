'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { saveInitialAssessment, AssessmentResponses } from '@/lib/actions/assessment'

// ─── Contextos da formação para Supervisores ────────────────────────────────

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

// Cor por nível para o indicador visual
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
  3: 'Em prog.',
  4: 'Desenvolvido',
  5: 'Ponto forte',
}

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  enrollmentId: string
  courseId: string
}

export default function AvaliacaoInicialForm({ enrollmentId, courseId }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0–6: contextos, 7: resumo
  const [responses, setResponses] = useState<Partial<AssessmentResponses>>({})
  const [salvando, setSalvando] = useState(false)

  const totalSteps = contextos.length
  const isSummary = step === totalSteps
  const contextoAtual = !isSummary ? contextos[step] : null
  const respostaSelecionada = contextoAtual ? responses[contextoAtual.id] : undefined
  const progresso = isSummary ? 100 : Math.round((step / totalSteps) * 100)
  const todasRespondidas = contextos.every(c => responses[c.id] !== undefined)

  function selecionar(valor: number) {
    if (!contextoAtual) return
    setResponses(prev => ({ ...prev, [contextoAtual.id]: valor }))
  }

  function avancar() {
    if (step < totalSteps) setStep(s => s + 1)
  }

  function voltar() {
    if (step > 0) setStep(s => s - 1)
  }

  async function handleSubmit() {
    if (!todasRespondidas) return
    setSalvando(true)
    const result = await saveInitialAssessment(
      enrollmentId,
      courseId,
      responses as AssessmentResponses
    )
    if (result.success) {
      router.push(`/dashboard/cursos/${courseId}`)
      router.refresh()
    } else {
      setSalvando(false)
      alert('Erro ao salvar. Tente novamente.')
    }
  }

  // ── Resumo final ──────────────────────────────────────────────────────────
  if (isSummary) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="section-label mb-3">Autoavaliação concluída</p>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#111827] tracking-tight mb-3">
            Seu ponto de partida.
          </h1>
          <p className="text-[#64748B] leading-relaxed">
            Essas são as competências que o treinamento vai desenvolver com você.
            Ao final do programa, você fará uma nova avaliação e verá sua evolução.
          </p>
        </div>

        {/* Resumo das respostas */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm mb-8">
          {contextos.map((ctx, i) => {
            const nota = responses[ctx.id] ?? 0
            const cor = corNivel[nota]
            const pct = (nota / 5) * 100
            return (
              <div
                key={ctx.id}
                className={`px-6 py-5 flex items-center gap-5 ${i < contextos.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-extrabold text-[#94A3B8]">{ctx.numero}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#111827] text-sm mb-1.5">{ctx.titulo}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-[#F0F4F8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: cor }}
                      />
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color: cor }}>
                      {labelNivel[nota]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setStep(i)}
                  className="text-xs text-[#94A3B8] hover:text-[#1565C0] transition-colors shrink-0"
                >
                  Editar
                </button>
              </div>
            )
          })}
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between">
          <button
            onClick={voltar}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!todasRespondidas || salvando}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1565C0] text-white font-bold rounded-xl hover:bg-[#1043A0] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#1565C0]/20"
          >
            {salvando ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
            ) : (
              <><CheckCircle2 className="h-4 w-4" /> Iniciar o Treinamento</>
            )}
          </button>
        </div>
      </div>
    )
  }

  // ── Passo individual ──────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      {/* Barra de progresso */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-[#64748B]">
            Contexto {step + 1} de {totalSteps}
          </span>
          <span className="text-sm font-bold text-[#1565C0]">{progresso}%</span>
        </div>
        <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1565C0] rounded-full transition-all duration-500"
            style={{ width: `${progresso + (1 / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Contexto */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#1565C0]/10 text-[#1565C0] font-extrabold text-sm font-heading">
            {contextoAtual!.numero}
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-[#111827] tracking-tight">
            {contextoAtual!.titulo}
          </h2>
        </div>
        <p className="text-[#64748B] text-base leading-relaxed mb-1">
          {contextoAtual!.descricao}
        </p>
      </div>

      {/* Questão */}
      <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-6 py-5 mb-8">
        <p className="font-bold text-[#111827] leading-relaxed">
          {contextoAtual!.questao}
        </p>
      </div>

      {/* Opções Likert */}
      <div className="space-y-3 mb-10">
        {niveis.map(({ valor, label }) => {
          const selecionado = respostaSelecionada === valor
          const cor = corNivel[valor]
          return (
            <button
              key={valor}
              onClick={() => selecionar(valor)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-150 ${
                selecionado
                  ? 'border-[#1565C0] bg-[#1565C0]/5 shadow-sm shadow-[#1565C0]/10'
                  : 'border-[#E5E7EB] bg-white hover:border-[#1565C0]/40 hover:bg-[#F8FAFC]'
              }`}
            >
              {/* Indicador de nível */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-extrabold text-sm text-white transition-all"
                style={{
                  backgroundColor: selecionado ? cor : '#E5E7EB',
                  color: selecionado ? 'white' : '#94A3B8',
                }}
              >
                {valor}
              </div>

              {/* Label */}
              <span
                className={`font-semibold text-sm flex-1 transition-colors ${
                  selecionado ? 'text-[#111827]' : 'text-[#374151]'
                }`}
              >
                {label}
              </span>

              {/* Âncoras contextuais para 1 e 5 */}
              {valor === 1 && (
                <span className="text-xs text-[#94A3B8] text-right leading-tight max-w-[160px] hidden md:block">
                  {contextoAtual!.ancora_baixo}
                </span>
              )}
              {valor === 5 && (
                <span className="text-xs text-[#94A3B8] text-right leading-tight max-w-[160px] hidden md:block">
                  {contextoAtual!.ancora_alto}
                </span>
              )}

              {/* Checkmark se selecionado */}
              {selecionado && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1565C0]" />
              )}
            </button>
          )
        })}
      </div>

      {/* Navegação */}
      <div className="flex items-center justify-between">
        {step > 0 ? (
          <button
            onClick={voltar}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={avancar}
          disabled={respostaSelecionada === undefined}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#111827] text-white font-bold rounded-xl hover:bg-[#1565C0] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          {step < totalSteps - 1 ? (
            <>Próximo <ArrowRight className="h-4 w-4" /></>
          ) : (
            <>Ver Resumo <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}
